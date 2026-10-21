import { Notice, Platform, Scope, setIcon, type App } from "obsidian";
import { convertBlocks, type BlockEdit, type Conversion } from "../domain/blocks";
import { selectionInk, toneColor, tones, type Tone, type Ink } from "../domain/rich-format";
import { captureBlock, commitBlockEdit, conversions, conversionLabels, performBlock } from "./block-commands";
import type { FormatContext, RichFormatting } from "./rich-format";
import { message } from "../strings";
import { blockLinkPlan, calloutTypes, selectionBlockPlan, type SelectionBlockTarget } from "../domain/selection-blocks";

const calloutLabels = {
  note: ["Note", "便签", "pencil"], info: ["Info", "信息", "info"], todo: ["Todo", "待办", "check-circle"],
  tip: ["Tip", "提示", "flame"], success: ["Success", "成功", "check"], question: ["Question", "问题", "help-circle"],
  warning: ["Warning", "警告", "alert-triangle"], failure: ["Failure", "失败", "x-circle"], danger: ["Danger", "危险", "zap"],
  bug: ["Bug", "缺陷", "bug"], example: ["Example", "示例", "list"], quote: ["Quote", "引用", "quote"]
} as const;

export interface FormatMenuActions {
  conversion(target: Conversion | SelectionBlockTarget): BlockEdit | null;
  commit(plan: BlockEdit): boolean;
  plain: boolean;
  color(patch: Partial<Ink>): boolean;
  canColor: boolean;
  copy?: () => void;
  remove?: () => void;
}

/** An anchored, selection-scoped surface. It never reads the active editor or
 * changes text until an explicit enabled action; the captured context is
 * revalidated by every underlying edit adapter. */
export class SelectionMenu {
  private root: HTMLDivElement;
  private panel: HTMLDivElement;
  private submenu?: HTMLDivElement;
  private page?: "color" | "callout";
  private scope: Scope;
  private closed = false;
  private acting = false;
  private pointer: (e: PointerEvent) => void;
  private focus: (e: FocusEvent) => void;
  private windowBlur = () => this.close();
  private viewport = (e: Event) => { if (e.type === "resize" || !this.root.contains(e.target as Node)) this.close(); };
  constructor(private app: App, private owner: Pick<RichFormatting, "zh" | "color">, private context: FormatContext,
    private point: { x: number; y: number }, private doc: Document, initial: "main" | "color", private release: (resume: boolean) => void,
    private actions?: FormatMenuActions) {
    this.root = doc.createElement("div"); this.root.className = "keyline-next-format-popover";
    this.root.dataset.keyboard = "false";
    this.panel = this.createPanel("main");
    this.root.append(this.panel); doc.body.append(this.root);
    this.scope = new Scope(app.scope);
    this.scope.register([], "Escape", () => { this.close(true); return false; });
    for (const key of ["ArrowUp", "ArrowDown", "Home", "End", "ArrowLeft", "ArrowRight", "Enter", " "]) {
      this.scope.register([], key, () => { this.navigate(key); return false; });
    }
    this.pointer = e => { if (!this.root.contains(e.target as Node)) this.close(); };
    this.focus = e => { if (!this.acting && !this.root.contains(e.target as Node)) this.close(); };
    doc.addEventListener("pointerdown", this.pointer, true);
    doc.addEventListener("focusin", this.focus, true);
    doc.addEventListener("scroll", this.viewport, true);
    doc.defaultView?.addEventListener("resize", this.viewport);
    doc.defaultView?.addEventListener("blur", this.windowBlur);
    app.keymap.pushScope(this.scope);
    this.render();
    if (initial === "color") this.showSubmenu("color");
    this.position();
    // Opening the colour preview does not move the integrated menu's keyboard
    // cursor out of the main list. Enter the submenu explicitly with Right.
    this.focusFirst(this.panel);
  }
  private createPanel(kind: string): HTMLDivElement {
    const panel = this.doc.createElement("div");
    panel.className = `keyline-next-format-panel keyline-next-format-${kind}`; panel.setAttribute("role", "menu");
    panel.setAttribute("aria-label", kind === "callout" ? "Callout" : message(kind === "color" ? "colors" : "blockType", this.owner.zh()));
    const list = this.doc.createElement("div"); list.className = "keyline-next-format-items"; panel.append(list);
    return panel;
  }
  private contents(panel: HTMLElement): HTMLElement { return panel.firstElementChild as HTMLElement; }
  private title(panel: HTMLElement, label: string): void {
    const e = this.doc.createElement("div"); e.className = "keyline-next-format-heading"; e.textContent = label; this.contents(panel).append(e);
  }
  private separator(panel: HTMLElement): void {
    const e = this.doc.createElement("hr"); e.setAttribute("role", "separator"); this.contents(panel).append(e);
  }
  private button(panel: HTMLElement, label: string, icon: string, action: () => void, disabled = false): HTMLButtonElement {
    const b = this.doc.createElement("button"); b.type = "button"; b.setAttribute("role", "menuitem");
    b.disabled = disabled;
    const glyph = this.doc.createElement("span"); glyph.className = "keyline-next-format-glyph"; setIcon(glyph, icon);
    const text = this.doc.createElement("span"); text.textContent = label;
    b.append(glyph, text); b.addEventListener("click", () => {
      if (this.closed || b.disabled) return;
      this.acting = true; try { action(); } finally { this.acting = false; }
    });
    b.addEventListener("pointerenter", () => {
      this.root.dataset.keyboard = "false";
      if (!b.disabled) b.focus({ preventScroll: true });
      if (panel === this.panel && !b.dataset.submenu && this.submenu) {
        this.submenu.remove(); this.submenu = undefined;
        for (const opener of Array.from(this.panel.querySelectorAll("[data-submenu]"))) opener.setAttribute("aria-expanded", "false");
      }
    });
    this.contents(panel).append(b); return b;
  }
  private render(): void {
    const zh = this.owner.zh(), block = this.actions ? null : captureBlock(this.context.editor, this.context.valid);
    this.title(this.panel, zh ? "转换成" : "Turn into");
    const icons = { paragraph: "text", task: "check-square", bullet: "list", number: "list-ordered", quote: "quote" };
    for (const target of conversions.filter(target => target !== "h6")) {
      const plan = this.actions ? this.actions.conversion(target) : block && convertBlocks(block.model, block.blocks, target);
      const unchangedText = target === "paragraph" && (this.actions ? this.actions.plain : block?.blocks.every(b => b.kind === "paragraph"));
      const icon = target.startsWith("h") ? `heading-${target.slice(1)}` : icons[target as keyof typeof icons];
      const shortLabels = { paragraph: "文本", task: "待办列表", bullet: "无序列表", number: "有序列表" };
      const label = zh && target in shortLabels ? shortLabels[target as keyof typeof shortLabels] : conversionLabels[target][zh ? 1 : 0];
      const b = this.button(this.panel, label, icon, () => {
        if (plan) this.actions ? this.actions.commit(plan) : block && commitBlockEdit(block, plan);
        this.close(true);
      }, !plan && !unchangedText);
      b.dataset.convert = target;
    }
    for (const [target, en, cn, icon] of [
      ["code", "Code block", "代码块", "code"], ["math", "Math block", "数学块", "sigma"], ["divider", "Divider", "分割线", "minus"]
    ] as const) {
      const plan = this.actions ? this.actions.conversion(target) : block && selectionBlockPlan(block.model, block.blocks, target);
      const b = this.button(this.panel, zh ? cn : en, icon, () => {
        if (plan) this.actions ? this.actions.commit(plan) : block && commitBlockEdit(block, plan); this.close(true);
      }, !plan);
      b.dataset.convert = target;
      if (target === "divider") b.title = zh ? "在块后插入分割线，保留原文" : "Insert a divider after this block; keep its text";
    }
    this.submenuButton("callout", "Callout", "pencil");
    this.separator(this.panel);
    this.submenuButton("color", zh ? "颜色" : "Color", "paint-roller");
    this.separator(this.panel);
    const link = block && blockLinkPlan(block.model, block.blocks, this.context.file.path, "ki-probe");
    const copy = this.button(this.panel, zh ? "拷贝区块链接" : "Copy block link", "link", () => {
      if (this.actions) { this.actions.copy?.(); this.close(true); return; }
      if (!block?.valid()) { this.close(); return; }
      const entropy = new Uint32Array(2); this.doc.defaultView!.crypto.getRandomValues(entropy);
      const plan = blockLinkPlan(block.model, block.blocks, this.context.file.path, `ki-${Array.from(entropy, n => n.toString(36)).join("-")}`);
      if (!plan || plan.edit && !commitBlockEdit(block, plan.edit)) { this.close(); return; }
      const clipboard = this.doc.defaultView?.navigator.clipboard;
      if (clipboard) void clipboard.writeText(plan.link).then(
        () => new Notice(zh ? "区块链接已复制" : "Block link copied"),
        () => new Notice(zh ? "无法写入剪贴板。新增的区块 ID 可撤销。" : "Could not write to clipboard. A newly added block ID can be undone."));
      else new Notice(zh ? "当前窗口无法使用剪贴板" : "Clipboard is unavailable in this window");
      this.close(true);
    }, this.actions ? !this.actions.copy : !link || !this.doc.defaultView?.navigator.clipboard);
    copy.dataset.blockAction = "copy-link";
    const shortcut = this.doc.createElement("span"); shortcut.className = "keyline-next-format-shortcut";
    shortcut.textContent = Platform.isMacOS ? "⌘⌃L" : "Ctrl+Alt+L"; copy.append(shortcut);
    this.scope.register(Platform.isMacOS ? ["Mod", "Ctrl"] : ["Ctrl", "Alt"], "l", () => { copy.click(); return false; });
    const remove = this.button(this.panel, zh ? "删除" : "Delete", "trash-2", () => {
      if (this.actions) this.actions.remove?.(); else if (block) performBlock(block, "delete"); this.close(true);
    }, this.actions ? !this.actions.remove : !block);
    remove.dataset.blockAction = "delete";
    const deleteShortcut = this.doc.createElement("span"); deleteShortcut.className = "keyline-next-format-shortcut";
    deleteShortcut.textContent = "Del"; remove.append(deleteShortcut);
    this.scope.register([], "Delete", () => { remove.click(); return false; });
  }
  private submenuButton(page: "color" | "callout", label: string, icon: string): void {
    const b = this.button(this.panel, label, icon, () => this.showSubmenu(page, true));
    b.dataset.submenu = page; b.setAttribute("aria-haspopup", "menu"); b.setAttribute("aria-expanded", "false");
    const arrow = this.doc.createElement("span"); setIcon(arrow, "chevron-right"); b.append(arrow);
    b.addEventListener("pointerenter", () => this.showSubmenu(page));
  }
  private showSubmenu(page: "color" | "callout", focus = false): void {
    if (!this.submenu || this.page !== page) {
      this.submenu?.remove();
      this.page = page; this.submenu = this.createPanel(page); this.root.append(this.submenu);
      if (page === "callout") {
        const block = this.actions ? null : captureBlock(this.context.editor, this.context.valid);
        this.title(this.submenu, "Callout");
        for (const type of calloutTypes) {
          const target = `callout-${type}` as SelectionBlockTarget;
          const plan = this.actions ? this.actions.conversion(target) : block && selectionBlockPlan(block.model, block.blocks, target);
          const labels = calloutLabels[type];
          const b = this.button(this.submenu, labels[this.owner.zh() ? 1 : 0], labels[2], () => {
            if (plan) this.actions ? this.actions.commit(plan) : block && commitBlockEdit(block, plan); this.close(true);
          }, !plan);
          b.dataset.convert = `callout-${type}`;
        }
      } else {
      const ink = selectionInk(this.context.text, this.context.from, this.context.to), zh = this.owner.zh();
      for (const kind of ["text", "background"] as const) {
        if (kind === "background") this.separator(this.submenu);
        this.title(this.submenu, zh ? (kind === "text" ? "文本颜色" : "背景颜色") : (kind === "text" ? "Text color" : "Background color"));
        for (const tone of ["default", ...tones] as Tone[]) {
          const labels = { default: "toneDefault", gray: "toneGray", brown: "toneBrown", orange: "toneOrange", yellow: "toneYellow", green: "toneGreen", blue: "toneBlue", purple: "tonePurple", pink: "tonePink", red: "toneRed" } as const;
          const label = message(labels[tone], zh) + (zh ? `${tone === "default" ? "" : "色"}${kind === "text" ? "文本" : "背景"}` : "");
          const b = this.button(this.submenu, label, "", () => {
            this.actions ? this.actions.color({ [kind]: tone }) : this.owner.color(this.context, { [kind]: tone }); this.close(true);
          }, this.actions && !this.actions.canColor);
          b.dataset.color = `${kind}:${tone}`; b.setAttribute("aria-checked", String(ink[kind] === tone)); b.setAttribute("role", "menuitemradio");
          const glyph = b.firstElementChild as HTMLElement; glyph.textContent = kind === "text" ? "A" : "";
          glyph.classList.add("keyline-next-format-swatch");
          glyph.dataset.tone = tone;
          if (tone !== "default") glyph.style.color = toneColor(tone);
        }
      }
      }
    }
    for (const b of Array.from(this.panel.querySelectorAll<HTMLElement>("[data-submenu]")))
      b.setAttribute("aria-expanded", String(b.dataset.submenu === page));
    this.position(); if (focus) this.focusFirst(this.submenu);
  }
  private focusFirst(panel: HTMLElement): void { panel.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus(); }
  private navigate(key: string): void {
    this.root.dataset.keyboard = "true";
    const active = this.doc.activeElement as HTMLElement, panel = active?.closest<HTMLElement>(".keyline-next-format-panel") ?? this.panel;
    if (key === "ArrowLeft" && this.submenu?.contains(active)) {
      this.submenu.remove(); this.submenu = undefined;
      const opener = this.panel.querySelector<HTMLButtonElement>(`[data-submenu="${this.page}"]`);
      opener?.focus(); opener?.setAttribute("aria-expanded", "false"); return;
    }
    if (key === "ArrowRight" && (active?.dataset.submenu === "color" || active?.dataset.submenu === "callout")) {
      this.showSubmenu(active.dataset.submenu, true); return;
    }
    if (key === "Enter" || key === " ") { active?.click(); return; }
    const buttons = Array.from(panel.querySelectorAll<HTMLButtonElement>("button:not(:disabled)")), at = buttons.indexOf(active as HTMLButtonElement);
    const next = key === "Home" ? 0 : key === "End" ? buttons.length - 1 :
      key === "ArrowDown" ? (at + 1) % buttons.length : key === "ArrowUp" ? (at - 1 + buttons.length) % buttons.length : at;
    buttons[next]?.focus(); buttons[next]?.scrollIntoView({ block: "nearest" });
  }
  private position(): void {
    const win = this.doc.defaultView!; const maxHeight = Math.min(300, win.innerHeight - 16);
    for (const panel of [this.panel, this.submenu].filter(Boolean) as HTMLElement[]) panel.style.maxHeight = `${maxHeight}px`;
    const w = this.panel.offsetWidth, h = Math.max(this.panel.offsetHeight, this.submenu?.offsetHeight ?? 0);
    const x = Math.max(8, Math.min(this.point.x, win.innerWidth - w - 8));
    const gap = this.actions ? 0 : 4;
    const y = this.point.y + gap + h < win.innerHeight - 8 ? this.point.y + gap : Math.max(8, this.point.y - h - 32);
    this.panel.style.left = `${x}px`; this.panel.style.top = `${y}px`;
    if (this.submenu) {
      const cw = this.submenu.offsetWidth;
      this.submenu.style.left = `${x + w + 6 + cw <= win.innerWidth - 8 ? x + w + 6 : Math.max(8, x - cw - 6)}px`;
      this.submenu.style.top = `${y}px`;
    }
  }
  hide(): void { this.close(); }
  close(refocus = false): void {
    if (this.closed) return; this.closed = true;
    this.doc.removeEventListener("pointerdown", this.pointer, true); this.doc.removeEventListener("focusin", this.focus, true);
    this.doc.removeEventListener("scroll", this.viewport, true); this.doc.defaultView?.removeEventListener("resize", this.viewport);
    this.doc.defaultView?.removeEventListener("blur", this.windowBlur);
    this.app.keymap.popScope(this.scope); this.root.remove(); this.release(refocus);
    if (refocus) this.context.editor.focus();
  }
}
