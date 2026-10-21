import { foldable, foldedRanges, foldEffect, unfoldEffect } from "@codemirror/language";
import { ViewPlugin, type EditorView, type ViewUpdate } from "@codemirror/view";
import { editorInfoField, Menu, Notice, setIcon, type App, type Editor } from "obsidian";
import { blockAt, blockSelection, parseBlocks, siblingDropTarget, type Block, type Blocks, type BlockEdit } from "../domain/blocks";
import { relocateBlocks, type Placement } from "../domain/relocation";
import type { Preferences } from "../domain/preferences";
import { message, type Message } from "../strings";
import { appendBlockMenu, captureBlock, commitBlockEdit, type BlockContext } from "./block-commands";
import type { InsertionController } from "./insertion";
import { lineIndex, relocateLineBlocks, relocateLines } from "../domain/line-drag";
import { captureLineDrag, type LineContext } from "./line-drag";
import { handleLayout } from "../domain/handle-layout";
import { captureHandleMenu } from "./handle-menu";
import { SelectionMenu } from "./selection-menu";

const mime = "application/x-keyline-next-block";
let dragSerial = 0;
type Target = { model: Blocks; block?: Block; at: number; visualAt: number };
type Drag = { mode: "block"; context: BlockContext; token: string } | { mode: "line"; context: LineContext; token: string };
export class BlockHandles {
  live = true;
  private instances = new Set<HandleView>();
  constructor(readonly app: App, readonly preferences: () => Preferences, readonly zh: () => boolean, readonly insertion: InsertionController,
    readonly changeGranularity: (value: Preferences["dragGranularity"]) => Promise<void>) {}
  extension() {
    const owner = this;
    return ViewPlugin.define(view => {
      const instance = new HandleView(view, owner); owner.instances.add(instance); return instance;
    }, { eventHandlers: {
      keydown(event) { if (event.key === "Escape") this.cancel(); },
      compositionstart() { this.cancel(); }
    } });
  }
  focus(editor: Editor): boolean {
    const instance = [...this.instances].find(i => i.editor === editor);
    return !!instance?.focus();
  }
  canFocus(editor: Editor): boolean { return !![...this.instances].find(i => i.editor === editor)?.canFocus(); }
  refresh(): void { for (const instance of this.instances) instance.refresh(); }
  remove(instance: HandleView): void { this.instances.delete(instance); }
  dispose(): void { this.live = false; for (const instance of this.instances) instance.destroy(); this.instances.clear(); }
}
class HandleView {
  private root: HTMLDivElement;
  private dropLine: HTMLDivElement;
  private target?: Target;
  private model?: Blocks;
  private shown = false;
  private destroyed = false;
  private showTimer?: ReturnType<typeof setTimeout>;
  private hideTimer?: ReturnType<typeof setTimeout>;
  private drag?: Drag;
  private drop?: { plan: BlockEdit };
  private dropCache?: { key: string; plan: BlockEdit | null };
  private menu?: Menu | SelectionMenu;
  private keyboard = false;
  private pressing = false;
  private granularity: Preferences["dragGranularity"];
  private release: (() => void)[] = [];
  private boundDocument: Document;
  get editor(): Editor | undefined { return this.view.state.field(editorInfoField, false)?.editor; }
  constructor(readonly view: EditorView, private owner: BlockHandles) {
    this.granularity = owner.preferences().dragGranularity;
    const doc = view.dom.ownerDocument;
    this.boundDocument = doc;
    this.root = doc.createElement("div"); this.root.className = "keyline-next-block-handle";
    this.root.hidden = true; this.root.setAttribute("role", "toolbar"); doc.body.append(this.root);
    this.dropLine = doc.createElement("div"); this.dropLine.className = "keyline-next-block-drop"; this.dropLine.hidden = true; doc.body.append(this.dropLine);
    this.root.addEventListener("pointerdown", event => {
      const target = event.target as HTMLElement;
      if (event.button === 0 && target.closest("[data-action=grip]")) {
        this.pressing = true; clearTimeout(this.showTimer); clearTimeout(this.hideTimer);
      }
    });
    this.root.addEventListener("mousedown", event => {
      // A prevented mousedown suppresses Chromium's native drag initiation.
      // Let only the grip receive normal pointer focus; editor selection is
      // captured independently and must not be rewritten just to start a drag.
      if (!(event.target as HTMLElement).closest("[data-action=grip]")) event.preventDefault();
    });
    this.root.addEventListener("pointerenter", () => clearTimeout(this.hideTimer));
    this.root.addEventListener("pointerleave", () => this.leave());
    this.root.addEventListener("contextmenu", event => {
      if (!(event.target as HTMLElement).closest('[data-action="grip"]')) return;
      event.preventDefault(); event.stopPropagation(); this.openStructuralMenu();
    });
    this.root.addEventListener("keydown", event => {
      const buttons = Array.from(this.root.querySelectorAll<HTMLButtonElement>("button:not([disabled])"));
      const index = buttons.indexOf(this.root.ownerDocument.activeElement as HTMLButtonElement);
      if (event.key === "ContextMenu" || event.key === "F10" && event.shiftKey) {
        event.preventDefault(); event.stopPropagation(); this.openStructuralMenu(); return;
      }
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); this.cancel(); this.view.focus(); }
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault(); event.stopPropagation(); buttons[(index + (event.key === "ArrowRight" ? 1 : buttons.length - 1)) % buttons.length]?.focus();
      }
      if ((event.key === "Enter" || event.key === " ") && index >= 0) { event.preventDefault(); event.stopPropagation(); if (!event.repeat) buttons[index].click(); }
    });
    this.bindDocument(doc); this.refresh();
  }
  private bindDocument(doc: Document): void {
    const view = this.view;
    const dragover = (event: DragEvent) => this.dragOver(event), drop = (event: DragEvent) => this.onDrop(event);
    const end = () => this.endDrag(), resize = () => this.refresh(), blur = () => this.cancel();
    // Native media widgets can ignore CodeMirror's eventHandlers. Observe only
    // our editor content in capture phase; never consume the widget's event or
    // replace its zoom/edit/resize controls. Follow the view across documents.
    const hover = (event: PointerEvent) => this.hover(event), leave = () => this.leave();
    const releasePress = (event: PointerEvent) => {
      const heldGrip = this.pressing; this.pressing = false;
      if (!heldGrip && event.type === "pointerup" && event.button === 0) this.hover(event);
    };
    doc.addEventListener("dragover", dragover, true); doc.addEventListener("drop", drop, true);
    view.contentDOM.addEventListener("pointermove", hover, true);
    view.contentDOM.addEventListener("pointerleave", leave);
    doc.addEventListener("pointerup", releasePress, true); doc.addEventListener("pointercancel", releasePress, true);
    doc.addEventListener("dragend", end, true); doc.defaultView?.addEventListener("resize", resize);
    doc.defaultView?.addEventListener("blur", blur); view.scrollDOM.addEventListener("scroll", resize, { passive: true });
    this.release.push(() => {
      doc.removeEventListener("dragover", dragover, true); doc.removeEventListener("drop", drop, true);
      view.contentDOM.removeEventListener("pointermove", hover, true);
      view.contentDOM.removeEventListener("pointerleave", leave);
      doc.removeEventListener("pointerup", releasePress, true); doc.removeEventListener("pointercancel", releasePress, true);
      doc.removeEventListener("dragend", end, true); doc.defaultView?.removeEventListener("resize", resize);
      doc.defaultView?.removeEventListener("blur", blur); view.scrollDOM.removeEventListener("scroll", resize);
    });
  }
  private syncDocument(): void {
    const doc = this.view.dom.ownerDocument;
    if (doc === this.boundDocument) return;
    this.cancel(); this.target = undefined;
    for (const release of this.release.splice(0)) release();
    this.boundDocument = doc; doc.body.append(this.root, this.dropLine); this.bindDocument(doc);
  }
  private eligible(): boolean {
    return !this.destroyed && this.owner.live && this.owner.preferences().blockHandles && !this.view.composing &&
      this.boundDocument === this.view.dom.ownerDocument &&
      !this.view.state.readOnly && this.view.state.doc.length <= 2 * 1024 * 1024 &&
      this.view.state.selection.ranges.length === 1 && !!this.view.state.field(editorInfoField, false)?.file;
  }
  private parsed(): Blocks {
    const text = this.view.state.doc.toString();
    if (this.model?.text !== text) this.model = parseBlocks(text);
    return this.model;
  }
  private at(position: number): Target | undefined {
    if (!this.eligible()) return;
    const model = this.parsed(), block = blockAt(model, position);
    if (block?.locked) return;
    const line = this.view.state.doc.lineAt(position);
    if (!block && line.text.trim()) return;
    return { model, block: block ?? undefined, visualAt: line.from,
      at: this.owner.preferences().dragGranularity === "line" ? line.from : block?.from ?? line.from };
  }
  hover(event: PointerEvent): void {
    this.syncDocument();
    if (event.buttons || this.drag || this.menu || !this.eligible()) return;
    if (!this.view.contentDOM.contains(event.target as Node)) return;
    const pos = this.view.posAtCoords({ x: event.clientX, y: event.clientY }, false);
    if (pos === null) return;
    const target = this.at(pos);
    if (!target) { this.leave(); return; }
    clearTimeout(this.hideTimer);
    if (this.target?.at === target.at && this.target.visualAt === target.visualAt && this.shown) return;
    this.keyboard = false; clearTimeout(this.showTimer);
    this.showTimer = setTimeout(() => { if (this.eligible() && this.view.state.doc.toString() === target.model.text) { this.target = target; this.show(); } }, this.owner.preferences().handleHoverDelay);
  }
  leave(): void {
    clearTimeout(this.showTimer); clearTimeout(this.hideTimer);
    if (this.destroyed || !this.owner.live) return;
    if (this.pressing || this.drag || this.menu || this.root.contains(this.root.ownerDocument.activeElement)) return;
    if (this.owner.preferences().handlePinned) { this.target = this.at(this.view.state.selection.main.head); this.show(); return; }
    this.hideTimer = setTimeout(() => this.hide(), this.owner.preferences().handleHideDelay);
  }
  private hide(): void { this.root.hidden = true; this.shown = false; }
  cancel(): void {
    clearTimeout(this.showTimer); clearTimeout(this.hideTimer); this.menu?.hide(); this.menu = undefined;
    this.keyboard = false; this.pressing = false; this.endDrag(); this.hide();
  }
  update(update: ViewUpdate): void {
    if (update.docChanged) { this.model = undefined; this.target = undefined; this.cancel(); }
    if (update.docChanged || update.selectionSet || update.viewportChanged || update.geometryChanged || update.focusChanged) this.refresh();
  }
  refresh(): void {
    this.syncDocument();
    if (this.granularity !== this.owner.preferences().dragGranularity) {
      this.granularity = this.owner.preferences().dragGranularity;
      const at = this.target?.visualAt;
      this.cancel(); this.target = at === undefined ? undefined : this.at(at);
    }
    if (!this.eligible()) { this.cancel(); return; }
    if (this.pressing || this.drag || this.menu) return;
    if (this.owner.preferences().handlePinned) this.target = this.at(this.view.state.selection.main.head);
    if (this.target && (this.shown || this.owner.preferences().handlePinned || this.keyboard)) this.show();
    else if (!this.target) this.hide();
  }
  focus(): boolean {
    this.syncDocument();
    clearTimeout(this.showTimer); clearTimeout(this.hideTimer);
    this.target = this.at(this.view.state.selection.main.head);
    if (!this.target) { this.cancel(); return false; }
    this.keyboard = true; this.show(); return true;
  }
  canFocus(): boolean {
    const target = this.at(this.view.state.selection.main.head);
    return !!target;
  }
  private context(): BlockContext | null {
    const editor = this.editor, target = this.target, file = this.view.state.field(editorInfoField, false)?.file;
    if (!editor || !target?.block || !file || !this.eligible()) return null;
    const selected = this.view.state.selection.main;
    const chosen = this.owner.preferences().snapSelection && !selected.empty ? blockSelection(target.model, selected.from, selected.to) : [];
    const useSelection = chosen.some(b => b.from <= target.block!.from && b.to >= target.block!.to);
    return captureBlock(editor, () => this.eligible() && this.view.state.field(editorInfoField, false)?.file === file,
      useSelection ? undefined : { from: target.block.from, to: target.block.to });
  }
  private insert(): void {
    const editor = this.editor, target = this.target, file = this.view.state.field(editorInfoField, false)?.file;
    if (!editor || !target || !file || !this.eligible() || this.view.state.doc.toString() !== target.model.text) return;
    const context = target.block
      ? this.owner.insertion.capture(editor, file, { from: target.block.to, to: target.block.to }, target.block.id)
      : this.owner.insertion.capture(editor, file, { from: target.at, to: target.at });
    if (context) {
      const rect = this.root.querySelector('[data-action="insert"]')?.getBoundingClientRect();
      this.hide(); this.owner.insertion.open(context, rect && {x:rect.left,y:rect.bottom});
    }
  }
  private foldRange(): { from: number; to: number; folded: boolean } | null {
    if (!this.target?.block) return null;
    if (this.target.at !== this.target.block.from) return null;
    const line = this.view.state.doc.lineAt(this.target.at);
    let existing: { from: number; to: number; folded: boolean } | null = null;
    foldedRanges(this.view.state).between(line.from, line.to, (from, to) => { existing = { from, to, folded: true }; });
    const range = existing ?? foldable(this.view.state, line.from, line.to);
    return range ? { ...range, folded: !!existing } : null;
  }
  private toggleFold(): void {
    if (!this.eligible() || this.view.state.doc.toString() !== this.target?.model.text) return;
    const range = this.foldRange();
    if (range) this.view.dispatch({ effects: (range.folded ? unfoldEffect : foldEffect).of({ from: range.from, to: range.to }) });
    this.show();
  }
  private openMenu(): void {
    const editor = this.editor, target = this.target, file = this.view.state.field(editorInfoField, false)?.file;
    if (!editor || !target || !file) return;
    const doc = this.root.ownerDocument, captured = captureHandleMenu(this.owner.app, editor, file, target.visualAt,
      () => this.eligible() && this.view.state.field(editorInfoField, false)?.file === file, doc, this.owner.zh());
    if (!captured) return;
    this.menu?.hide();
    const bounds = this.root.querySelector('[data-action="grip"]')?.getBoundingClientRect() ?? this.root.getBoundingClientRect();
    this.hide();
    const menu = new SelectionMenu(this.owner.app, { zh: this.owner.zh, color: (_, patch) => captured.actions.color(patch) },
      captured.context, { x: bounds.left, y: bounds.bottom }, doc, "main", () => {
        if (this.menu === menu) this.menu = undefined;
      }, captured.actions);
    this.menu = menu;
  }
  private openStructuralMenu(): void {
    const context = this.context();
    if (!context && (!this.target || !this.eligible() || this.granularity !== "line")) return;
    this.menu?.hide();
    const menu = new Menu(); this.menu = menu;
    menu.addItem(item => item.setTitle(message("insertAfter", this.owner.zh())).setIcon("plus").onClick(() => this.insert()));
    if (context) appendBlockMenu(menu, this.owner.app, context, this.owner.zh());
    menu.addSeparator();
    menu.addItem(item => item.setTitle(message(this.granularity === "line" ? "dragUseBlock" : "dragUseLine", this.owner.zh()))
      .setIcon("rows-3").onClick(() => { if (this.owner.live) void this.owner.changeGranularity(this.granularity === "line" ? "block" : "line"); }));
    menu.onHide(() => { if (this.menu === menu) this.menu = undefined; this.leave(); });
    const bounds = this.root.getBoundingClientRect();
    menu.showAtPosition({ x: bounds.left, y: bounds.bottom }, this.root.ownerDocument);
  }
  private button(action: string, label: Message, icon: string, run: () => void): HTMLButtonElement {
    const button = this.root.ownerDocument.createElement("button");
    button.type = "button"; button.className = "clickable-icon"; button.dataset.action = action;
    button.setAttribute("aria-label", message(label, this.owner.zh()));
    if (this.owner.preferences().hints) button.title = message(label, this.owner.zh());
    setIcon(button, icon); button.addEventListener("click", run); this.root.append(button); return button;
  }
  private show(): void {
    if (!this.target || !this.eligible()) { this.hide(); return; }
    const target = this.target, prefs = this.owner.preferences();
    this.view.requestMeasure({
      key: this,
      read: () => {
        if (!this.eligible() || target !== this.target || target.model.text !== this.view.state.doc.toString()) return null;
        const text = this.view.coordsAtPos(target.visualAt);
        if (!text) return null;
        const node = this.view.domAtPos(target.visualAt).node;
        const element = node.nodeType === 1 ? node as Element : node.parentElement;
        const fold = element?.closest(".cm-line")?.querySelector(".cm-fold-indicator .collapse-indicator")?.getBoundingClientRect();
        const count = Number(prefs.handlePlus) + 1 + Number(prefs.handleFold);
        const layout = handleLayout(this.view.scrollDOM.getBoundingClientRect(), this.view.contentDOM.getBoundingClientRect(), text, prefs.handleSide, count,
          fold && { left: fold.left, right: fold.right, top: fold.top, bottom: fold.bottom });
        return layout && { ...layout, fold: prefs.handleFold ? this.foldRange() : null };
      },
      write: bounds => {
        if (this.pressing || this.drag || this.menu) return;
        if (!bounds || !this.eligible() || target !== this.target) { this.hide(); return; }
        const focused = (this.root.ownerDocument.activeElement as HTMLElement)?.dataset.action;
        this.root.replaceChildren(); this.root.setAttribute("aria-label", message("blockControls", this.owner.zh()));
        this.root.dataset.from = String(target.at); this.root.dataset.side = bounds.side ?? prefs.handleSide;
        this.root.dataset.visualFrom = String(target.visualAt);
        this.root.style.setProperty("--keyline-next-handle-size", `${bounds.size}px`);
        this.root.dataset.granularity = this.granularity;
        if (prefs.handlePlus) this.button("insert", "blockHandleAdd", "plus", () => this.insert());
        {
          if (prefs.handleFold) {
            const fold = this.button("fold", bounds.fold?.folded ? "unfoldBlock" : "foldBlock",
              bounds.fold?.folded ? "chevron-right" : "chevron-down", () => this.toggleFold());
            fold.disabled = !bounds.fold; fold.setAttribute("aria-expanded", String(!bounds.fold?.folded));
          }
          const grip = this.button("grip", "blockHandleDrag", "grip-vertical", () => this.openMenu());
          grip.setAttribute("aria-description", message(this.granularity === "line" ? "lineMenu" : "blockMenu", this.owner.zh()));
          grip.draggable = true; grip.addEventListener("dragstart", event => this.startDrag(event));
        }
        this.root.style.left = `${bounds.x}px`; this.root.style.top = `${bounds.y}px`;
        this.root.hidden = false; this.shown = true;
        if (focused) this.root.querySelector<HTMLButtonElement>(`[data-action="${focused}"]`)?.focus();
        else if (this.keyboard) {
          (this.root.querySelector<HTMLButtonElement>('[data-action="grip"]') ?? this.root.querySelector<HTMLButtonElement>("button"))?.focus();
          this.keyboard = false;
        }
      }
    });
  }
  private startDrag(event: DragEvent): void {
    if (!event.dataTransfer || !this.target) { event.preventDefault(); return; }
    const file = this.view.state.field(editorInfoField, false)?.file;
    const preferenceMode = this.granularity, mode = !this.target.block ? "line" : preferenceMode;
    const line = mode === "line" && this.editor && file ? captureLineDrag(this.editor, this.target.at, this.owner.preferences().snapSelection,
      () => this.eligible() && this.owner.preferences().dragGranularity === preferenceMode && this.view.state.field(editorInfoField, false)?.file === file) : null;
    const block = mode === "block" ? this.context() : null;
    if (!line && !block) { event.preventDefault(); return; }
    clearTimeout(this.hideTimer);
    const token = `keyline-${++dragSerial}`;
    this.pressing = false;
    this.drag = line ? { mode: "line", context: line, token } : { mode: "block", context: block!, token };
    this.drop = undefined; this.dropCache = undefined;
    event.dataTransfer.setData(mime, token); event.dataTransfer.effectAllowed = "move";
    this.root.classList.add("is-dragging");
  }
  private dragOver(event: DragEvent): void {
    if (!this.drag || !this.view.scrollDOM.contains(event.target as Node)) return;
    event.preventDefault(); event.stopPropagation();
    this.drop = undefined; this.dropLine.hidden = true;
    if (!this.drag.context.valid()) { this.endDrag(); return; }
    const box = this.view.scrollDOM.getBoundingClientRect();
    if (event.clientY < box.top + 32) this.view.scrollDOM.scrollTop -= 16;
    else if (event.clientY > box.bottom - 32) this.view.scrollDOM.scrollTop += 16;
    const pos = this.view.posAtCoords({ x: event.clientX, y: event.clientY }, false);
    if (pos === null) return;
    if (this.drag.mode === "line") {
      const model = this.drag.context.model, index = lineIndex(model, pos);
      if (index < 0) return;
      const target = model.lines[index], top = this.view.documentTop + this.view.lineBlockAt(target.from).top;
      const bottom = this.view.documentTop + this.view.lineBlockAt(target.to).bottom, after = event.clientY >= (top + bottom) / 2;
      const syntax = this.parsed();
      const initial = blockAt(syntax, pos);
      let structuralTarget = initial, origin = initial && this.view.coordsAtPos(initial.from), root = false;
      while (structuralTarget?.kind === "item" && origin && event.clientX < origin.left - 12) {
        const list = syntax.blocks.find(b => b.id === structuralTarget!.parent);
        const parent = syntax.blocks.find(b => b.id === list?.parent);
        if (!parent) { root = true; if (list) structuralTarget = list; break; }
        structuralTarget = parent; origin = this.view.coordsAtPos(parent.from);
      }
      const structuralTop = structuralTarget ? this.view.documentTop + this.view.lineBlockAt(structuralTarget.from).top : top;
      const firstBottom = structuralTarget ? this.view.documentTop + this.view.lineBlockAt(structuralTarget.from).bottom : bottom;
      const structuralBottom = structuralTarget ? this.view.documentTop + this.view.lineBlockAt(structuralTarget.to).bottom : bottom;
      origin = structuralTarget && this.view.coordsAtPos(structuralTarget.from);
      const inside = structuralTarget?.kind === "item" && !!origin && event.clientX >= origin.left + 32 &&
        event.clientY > structuralTop + (firstBottom - structuralTop) * .25 && event.clientY < firstBottom - (firstBottom - structuralTop) * .25;
      const structuralAfter = event.clientY >= (structuralTop + structuralBottom) / 2;
      const placement: Placement = inside ? "inside" : root ? structuralAfter ? "root-after" : "root-before" : structuralAfter ? "after" : "before";
      const explicitStructure = inside || root || structuralTarget !== initial;
      if (explicitStructure) {
        const cacheKey = `line-block:${structuralTarget?.id}:${placement}`;
        if (this.dropCache?.key !== cacheKey) this.dropCache = { key: cacheKey,
          plan: structuralTarget ? relocateLineBlocks(model, this.drag.context.range, structuralTarget, placement) : null };
        const plan = this.dropCache.plan;
        if (!plan) { if (event.dataTransfer) event.dataTransfer.dropEffect = "none"; return; }
        this.drop = { plan };
        if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
        const left = Math.max(box.left + 6, (origin?.left ?? box.left + 6) + (inside ? 24 : 0));
        this.dropLine.dataset.placement = placement;
        this.dropLine.dataset.label = message(inside ? "dropInside" : root ? "dropRoot" : structuralAfter ? "dropAfter" : "dropBefore", this.owner.zh());
        this.dropLine.style.left = `${left}px`; this.dropLine.style.width = `${Math.max(0, box.right - left - 12)}px`;
        this.dropLine.style.top = `${inside || structuralAfter ? structuralBottom : structuralTop}px`; this.dropLine.hidden = false;
        return;
      }
      const cacheKey = `line:${index}:${after}`;
      if (this.dropCache?.key !== cacheKey) this.dropCache = { key: cacheKey, plan: relocateLines(model, this.drag.context.range, index, after) };
      const plan = this.dropCache.plan;
      if (!plan) { if (event.dataTransfer) event.dataTransfer.dropEffect = "none"; return; }
      this.drop = { plan };
      if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
      const left = Math.max(box.left + 6, this.view.coordsAtPos(target.from)?.left ?? box.left + 6);
      this.dropLine.dataset.placement = after ? "line-after" : "line-before";
      this.dropLine.dataset.label = message(after ? "dropLineAfter" : "dropLineBefore", this.owner.zh());
      this.dropLine.style.left = `${left}px`; this.dropLine.style.width = `${Math.max(0, box.right - left - 12)}px`;
      this.dropLine.style.top = `${after ? bottom : top}px`; this.dropLine.hidden = false;
      return;
    }
    const model = this.drag.context.model, parent = this.drag.context.blocks[0].parent;
    let target = blockAt(model, pos) ?? siblingDropTarget(model, pos, parent) ?? siblingDropTarget(model, pos, null);
    if (!target) return;
    let origin = this.view.coordsAtPos(target.from), root = false;
    // Horizontal intent can promote the landing point through item ancestors.
    // Nesting uses a separate middle-of-first-line + inset zone.
    while (target.kind === "item" && origin && event.clientX < origin.left - 12) {
      const list = model.blocks.find(b => b.id === target!.parent);
      const parentItem = model.blocks.find(b => b.id === list?.parent);
      if (!parentItem) { root = true; if (list) target = list; break; }
      target = parentItem; origin = this.view.coordsAtPos(target.from);
    }
    origin = this.view.coordsAtPos(target.from);
    const top = this.view.documentTop + this.view.lineBlockAt(target.from).top;
    const bottom = this.view.documentTop + this.view.lineBlockAt(target.to).bottom;
    const firstBottom = this.view.documentTop + this.view.lineBlockAt(target.from).bottom;
    const height = firstBottom - top, after = event.clientY >= (top + bottom) / 2;
    const inside = target.kind === "item" && !!origin && event.clientX >= origin.left + 32 &&
      event.clientY > top + height * 0.25 && event.clientY < firstBottom - height * 0.25;
    const placement: Placement = inside ? "inside" : root ? after ? "root-after" : "root-before" : after ? "after" : "before";
    const cacheKey = `${target.id}/${placement}`;
    if (this.dropCache?.key !== cacheKey)
      this.dropCache = { key: cacheKey, plan: relocateBlocks(model, this.drag.context.blocks, target, placement) };
    const plan = this.dropCache.plan;
    if (!plan) { if (event.dataTransfer) event.dataTransfer.dropEffect = "none"; return; }
    this.drop = { plan };
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    const left = Math.max(box.left + 6, (origin?.left ?? box.left + 6) + (inside ? 24 : 0));
    this.dropLine.dataset.placement = placement;
    this.dropLine.dataset.label = message(inside ? "dropInside" : root ? "dropRoot" : after ? "dropAfter" : "dropBefore", this.owner.zh());
    this.dropLine.style.left = `${left}px`; this.dropLine.style.width = `${Math.max(0, box.right - left - 12)}px`;
    this.dropLine.style.top = `${inside || after ? bottom : top}px`; this.dropLine.hidden = false;
  }
  private onDrop(event: DragEvent): void {
    const drag = this.drag;
    if (!drag || !this.view.scrollDOM.contains(event.target as Node)) return;
    event.preventDefault(); event.stopPropagation();
    // Recompute at the actual drop coordinates; an old blue line is not an
    // authorization to move stale content to its former target.
    this.dragOver(event);
    const plan = this.drop?.plan, owned = event.dataTransfer?.getData(mime) === drag.token;
    this.endDrag();
    if (!owned || !plan || !commitBlockEdit(drag.context, plan)) new Notice(message("blockUnavailable", this.owner.zh()));
  }
  private endDrag(): void { this.pressing = false; this.drag = undefined; this.drop = undefined; this.dropCache = undefined; this.dropLine.hidden = true; this.root.classList.remove("is-dragging"); }
  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true; this.cancel(); for (const release of this.release) release();
    this.root.remove(); this.dropLine.remove(); this.owner.remove(this);
  }
}
