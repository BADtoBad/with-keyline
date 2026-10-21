import { Modal, Notice, Scope, setIcon, type App } from "obsidian";
import { message } from "../strings";
import { WorkspaceActions, WorkspaceFailure, WorkspaceJournal, type WorkspaceCore, type WorkspaceProblem } from "./workspace-state";
export { validRecovery, validWorkspaceName } from "./workspace-state";

function core(app: App): WorkspaceCore | null {
  // Guarded boundary: no core enablement, patches, or direct core-data writes.
  const api = app as App & { internalPlugins?: { getPluginById?(id: string): {
    enabled?: boolean; _loaded?: boolean; instance?: Partial<WorkspaceCore> & { plugin?: { _loaded?: boolean } };
  } } };
  const p = api.internalPlugins?.getPluginById?.("workspaces"), i = p?.instance;
  return p?.enabled && p._loaded !== false && i?.plugin?._loaded !== false && i?.workspaces &&
    typeof i.workspaces === "object" && !Array.isArray(i.workspaces) && typeof i.activeWorkspace === "string" && typeof i.saveData === "function"
    ? i as WorkspaceCore : null;
}
const labels: Record<WorkspaceProblem, readonly [string, string]> = {
  unavailable: ["Enable Workspaces in Settings → Core plugins.", "请在「设置 → 核心插件」中开启「工作区」。"],
  conflict: ["Disable Workspaces Plus / Workspace++ before managing layouts here. Keep your saved layouts.", "请先停用 Workspaces Plus / Workspace++，避免两套布局管理同时接管。原布局无需删除。"],
  busy: ["A layout operation is in progress. Please wait.", "布局操作进行中，请稍候。"],
  stale: ["The workspace changed. Please choose the action again.", "工作区状态已变化，请重新操作。"],
  invalid: ["Enter a valid layout name (up to 80 characters).", "请输入有效布局名称（最多 80 个字符）。"],
  duplicate: ["A layout with that name already exists. Choose another name.", "已存在同名布局，请换一个名称。"],
  missing: ["The selected layout or recovery snapshot is unavailable.", "所选布局或恢复快照不存在。"],
  recovery: ["Could not verify the recovery snapshot. The current layout was not switched.", "恢复快照未通过校验，未切换当前布局。"],
  failed: ["The layout operation could not be confirmed. Check the current layout before retrying; existing recovery files are retained.", "无法确认布局操作结果。请先检查当前布局再重试；已有恢复文件仍保留。"]
};
function explain(error: unknown, zh: boolean): string {
  return labels[error instanceof WorkspaceFailure ? error.problem : "failed"][zh ? 1 : 0];
}
const owns = (c: WorkspaceCore, name: string) => Object.prototype.hasOwnProperty.call(c.workspaces, name);
type Entry = null | { title: string; icon?: string; checked?: boolean; action(): void };
let menuSequence = 0;

/** Commands follow the focused native editor window. Never mount into an
 * unrelated document supplied by another app/Settings surface. */
export function workspaceMenuDocument(app: App, fallback: Document, focused: Document | undefined): Document {
  if (!focused || focused === fallback || !focused.defaultView || focused.defaultView.closed) return fallback;
  let owned = false;
  app.workspace.iterateAllLeaves(leaf => {
    if (leaf.view.containerEl.isConnected && leaf.view.containerEl.ownerDocument === focused) owned = true;
  });
  return owned ? focused : fallback;
}

class WorkspacePopup {
  private root: HTMLDivElement;
  private scope: Scope;
  private rows: HTMLButtonElement[] = [];
  private closed = false;
  private outside = (event: PointerEvent) => {
    const node = event.target as Node;
    if (!this.root.contains(node) && !this.anchor?.contains(node)) this.close(false);
  };
  private blur = () => this.close(false);
  private resize = () => this.close(true);
  constructor(private app: App, private doc: Document, private anchor: HTMLButtonElement | null,
    entries: Entry[], zh: boolean, private done: () => void) {
    this.root = doc.createElement("div"); this.root.className = "keyline-next-workspace-menu";
    this.root.id = `keyline-next-workspace-menu-${++menuSequence}`;
    this.root.setAttribute("role", "menu"); this.root.setAttribute("aria-label", zh ? "工作区布局" : "Workspace layouts");
    let initial = 0;
    for (const entry of entries) {
      if (!entry) {
        const separator = doc.createElement("div"); separator.className = "keyline-next-workspace-divider";
        separator.setAttribute("role", "separator"); this.root.append(separator); continue;
      }
      const row = doc.createElement("button"); row.type = "button"; row.tabIndex = -1;
      row.className = "keyline-next-workspace-item";
      row.setAttribute("role", entry.checked === undefined ? "menuitem" : "menuitemradio");
      if (entry.checked !== undefined) row.setAttribute("aria-checked", String(entry.checked));
      if (entry.checked) initial = this.rows.length;
      const icon = doc.createElement("span"), text = doc.createElement("span");
      icon.className = "keyline-next-workspace-glyph"; icon.setAttribute("aria-hidden", "true");
      text.className = "keyline-next-workspace-title"; text.textContent = entry.title;
      if (entry.icon || entry.checked) setIcon(icon, entry.icon ?? "check");
      row.append(icon, text); this.root.append(row); this.rows.push(row);
      row.addEventListener("pointermove", () => row.focus({ preventScroll: true }));
      row.addEventListener("click", () => { if (!this.closed) { this.close(); entry.action(); } });
    }
    this.scope = new Scope(app.scope);
    this.scope.register([], "Escape", () => { this.close(); return false; });
    this.scope.register([], "Tab", () => { this.close(); return true; });
    for (const key of ["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "]) {
      this.scope.register([], key, () => {
        const current = this.rows.indexOf(doc.activeElement as HTMLButtonElement);
        if (key === "Enter" || key === " ") this.rows[current]?.click();
        else {
          const index = key === "Home" ? 0 : key === "End" ? this.rows.length - 1 :
            (current + (key === "ArrowDown" ? 1 : -1) + this.rows.length) % this.rows.length;
          this.rows[index]?.focus({ preventScroll: true }); this.rows[index]?.scrollIntoView({ block: "nearest" });
        }
        return false;
      });
    }
    doc.body.append(this.root); this.position();
    anchor?.setAttribute("aria-controls", this.root.id); anchor?.setAttribute("aria-expanded", "true");
    app.keymap.pushScope(this.scope);
    doc.addEventListener("pointerdown", this.outside, true);
    doc.defaultView?.addEventListener("blur", this.blur); doc.defaultView?.addEventListener("resize", this.resize);
    doc.defaultView?.addEventListener("pagehide", this.blur);
    this.rows[initial]?.focus({ preventScroll: true }); this.rows[initial]?.scrollIntoView({ block: "nearest" });
  }
  position(): void {
    const win = this.doc.defaultView; if (!win || this.closed) return;
    const area = this.doc.querySelector(".app-container")?.getBoundingClientRect();
    const trigger = this.anchor?.getBoundingClientRect(), bar = this.anchor?.closest(".status-bar")?.getBoundingClientRect();
    const leftEdge = Math.max(0, area?.left ?? 0) + 8, rightEdge = Math.min(win.innerWidth, area?.right ?? win.innerWidth) - 8;
    const topEdge = Math.max(0, area?.top ?? 0) + 8;
    const width = Math.min(264, Math.max(0, rightEdge - leftEdge));
    const bottom = Math.max(topEdge, Math.min((bar?.top ?? trigger?.top ?? win.innerHeight - 28) - 6, (area?.bottom ?? win.innerHeight) - 8));
    const center = trigger ? (trigger.left + trigger.right) / 2 : win.innerWidth / 2;
    Object.assign(this.root.style, {
      left: `${Math.max(leftEdge, Math.min(center - width / 2, rightEdge - width))}px`,
      bottom: `${win.innerHeight - bottom}px`, width: `${width}px`, maxHeight: `${Math.min(360, Math.max(0, bottom - topEdge))}px`
    });
  }
  close(restore = true): void {
    if (this.closed) return; this.closed = true;
    this.app.keymap.popScope(this.scope); this.root.remove();
    this.doc.removeEventListener("pointerdown", this.outside, true);
    this.doc.defaultView?.removeEventListener("blur", this.blur); this.doc.defaultView?.removeEventListener("resize", this.resize);
    this.doc.defaultView?.removeEventListener("pagehide", this.blur);
    this.anchor?.setAttribute("aria-expanded", "false"); this.anchor?.removeAttribute("aria-controls");
    if (restore && this.anchor?.isConnected && !this.anchor.disabled) this.anchor.focus({ preventScroll: true });
    this.done();
  }
}

export class WorkspaceController {
  private button: HTMLButtonElement;
  private name: HTMLElement;
  private live = true;
  private menu?: WorkspacePopup;
  private modal?: WorkspaceNameModal;
  private bar?: HTMLElement;
  private observer?: MutationObserver;
  private resize?: ResizeObserver;
  private observed = new Set<Element>();
  private frame?: number;
  readonly actions: WorkspaceActions;
  private schedule = () => {
    const win = this.slot.ownerDocument.defaultView;
    if (!win || !this.live || this.frame !== undefined) return;
    this.frame = win.requestAnimationFrame(() => { this.frame = undefined; this.refresh(); });
  };
  constructor(private app: App, private slot: HTMLElement, directory: string, private enabled: () => boolean, private zh: () => boolean) {
    this.actions = new WorkspaceActions({
      core: () => core(app), allowed: enabled,
      conflict: () => ["workspaces-plus", "workspace-plus-plus"].some(id =>
        (app as App & { plugins?: { enabledPlugins?: Set<string> } }).plugins?.enabledPlugins?.has(id)),
      current: () => app.workspace.getLayout(), apply: layout => app.workspace.changeLayout(layout),
      readSaved: async () => JSON.parse(await app.vault.adapter.read(`${app.vault.configDir}/workspaces.json`))
    }, new WorkspaceJournal(app.vault.adapter, directory));
    slot.addClass("keyline-next-workspace");
    this.button = slot.createEl("button", { cls: "keyline-next-workspace-button" }); this.button.type = "button";
    this.button.setAttribute("aria-haspopup", "menu"); this.button.setAttribute("aria-expanded", "false");
    setIcon(this.button.createSpan({ attr: { "aria-hidden": "true" } }), "panels-top-left");
    this.name = this.button.createSpan({ cls: "keyline-next-workspace-name" });
    setIcon(this.button.createSpan({ cls: "keyline-next-workspace-arrow", attr: { "aria-hidden": "true" } }), "chevron-up");
    this.button.addEventListener("click", () => { if (this.menu) this.menu.close(); else this.open(this.slot.ownerDocument); });
    this.button.addEventListener("keydown", event => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") { event.preventDefault(); this.open(this.slot.ownerDocument); }
    });
    const doc = slot.ownerDocument, win = doc.defaultView as (Window & typeof globalThis) | null;
    if (win) {
      this.observer = new win.MutationObserver(records => {
        if (records.some(r => !slot.contains(r.target) && ((r.target as Element).closest?.(".status-bar") ||
          Array.from(r.addedNodes).concat(Array.from(r.removedNodes)).some(n => (n as Element).matches?.(".status-bar"))))) this.schedule();
      });
      this.observer.observe(doc.body, { childList: true, subtree: true, characterData: true });
      this.resize = new win.ResizeObserver(this.schedule); win.addEventListener("resize", this.schedule);
    }
    this.refresh();
  }
  refresh(): void {
    if (!this.live) return;
    const doc = this.slot.ownerDocument, win = doc.defaultView;
    const bar = doc.querySelector<HTMLElement>(".app-container > .status-bar");
    const visible = this.enabled() && !doc.body.classList.contains("is-mobile") &&
      win?.getComputedStyle(doc.body).getPropertyValue("--ncl-workspace-controls").trim() === "1" && !!bar;
    this.slot.hidden = !visible;
    if (!this.enabled()) { this.menu?.close(false); this.modal?.close(); }
    if (this.bar !== bar || !visible) {
      this.bar?.classList.remove("keyline-next-workspace-bar"); this.resize?.disconnect(); this.observed.clear(); this.bar = undefined;
    }
    if (bar && visible) {
      this.bar = bar; bar.classList.add("keyline-next-workspace-bar");
      if (this.slot.parentElement !== bar) bar.append(this.slot);
      this.position(bar);
    }
    const c = core(this.app), label = c && c.activeWorkspace && owns(c, c.activeWorkspace) ? c.activeWorkspace : (this.zh() ? "布局" : "Layout");
    if (this.name.textContent !== label) this.name.textContent = label;
    this.button.setAttribute("aria-label", this.zh() ? `切换工作区布局：${label}` : `Switch workspace layout: ${label}`);
    this.button.disabled = this.actions.busy; this.menu?.position();
  }
  private position(bar: HTMLElement): void {
    const bounds = bar.getBoundingClientRect(); let left = 0, right = bounds.width, row: number | undefined, wrapped = false;
    const observing = new Set<Element>([bar]);
    for (const node of Array.from(bar.children)) {
      if (node === this.slot) continue;
      observing.add(node); const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) continue;
      if (row === undefined) row = rect.top; else if (Math.abs(row - rect.top) > 3) wrapped = true;
      if (node.matches(".syncstatusbar")) left = Math.max(left, rect.right - bounds.left);
      else right = Math.min(right, rect.left - bounds.left);
    }
    for (const node of this.observed) if (!observing.has(node)) this.resize?.unobserve(node);
    for (const node of observing) if (!this.observed.has(node)) this.resize?.observe(node);
    this.observed = observing;
    const clearance = Math.floor(Math.min(bounds.width / 2 - left - 12, right - bounds.width / 2 - 12) * 2);
    const separate = wrapped || clearance < 32;
    const available = separate ? Math.max(32, bounds.width - 24) : clearance;
    this.slot.classList.toggle("is-separate-row", separate);
    this.slot.classList.toggle("is-icon-only", separate ? bounds.width < 100 : available < 80);
    this.slot.style.setProperty("--keyline-workspace-width", `${Math.min(180, available)}px`);
  }
  private async run(action: () => Promise<void>, success = false): Promise<void> {
    if (!this.live || !this.enabled()) return;
    try { const pending = action(); this.refresh(); await pending; if (success && this.live) new Notice(message("saved", this.zh())); }
    catch (error) { if (this.live) new Notice(explain(error, this.zh())); }
    finally { this.refresh(); }
  }
  open(focused: Document | undefined = typeof activeDocument === "undefined" ? undefined : activeDocument): void {
    if (!this.live || !this.enabled() || this.actions.busy) return;
    this.menu?.close(false); this.refresh(); const entries: Entry[] = [];
    try {
      const c = this.actions.core();
      const active = c.activeWorkspace;
      const guarded = (action: () => void) => () => {
        try {
          if (this.actions.core() !== c || c.activeWorkspace !== active) throw new WorkspaceFailure("stale");
          action();
        } catch (error) { if (this.live) new Notice(explain(error, this.zh())); }
      };
      for (const name of Object.keys(c.workspaces)) {
        const selected = c.workspaces[name];
        entries.push({ title: name, checked: name === c.activeWorkspace, action: () => {
          void this.run(async () => {
            if (this.actions.core() !== c || c.workspaces[name] !== selected) throw new WorkspaceFailure("stale");
            await this.actions.switchTo(name);
          });
        } });
      }
      if (entries.length) entries.push(null);
      entries.push(
        { title: message("saveWorkspace", this.zh()), icon: "save", action: guarded(() => this.save()) },
        { title: message("saveWorkspaceAs", this.zh()), icon: "plus", action: guarded(() => this.saveAs()) },
        { title: message("restoreWorkspace", this.zh()), icon: "undo-2", action: guarded(() => { void this.restore(); }) }
      );
      if (c.onOpenModal) entries.push({ title: this.zh() ? "原生工作区管理…" : "Manage workspaces…", icon: "settings", action: guarded(() => { void this.manage(); }) });
    } catch (error) {
      entries.push({ title: explain(error, this.zh()), icon: "info", action: () => { new Notice(explain(error, this.zh())); } });
    }
    const bounds = this.button.getBoundingClientRect();
    const doc = workspaceMenuDocument(this.app, this.slot.ownerDocument, focused);
    const anchor = doc === this.slot.ownerDocument && !this.slot.hidden && bounds.width > 0 && bounds.height > 0 ? this.button : null;
    const menu = new WorkspacePopup(this.app, doc, anchor,
      entries, this.zh(), () => { if (this.menu === menu) this.menu = undefined; });
    this.menu = menu;
  }
  async switchTo(name: string): Promise<void> { await this.run(() => this.actions.switchTo(name)); }
  async restore(): Promise<void> { await this.run(() => this.actions.restore()); }
  async manage(): Promise<void> { await this.run(() => this.actions.manage()); }
  save(): void {
    if (!this.live || !this.enabled()) return;
    try {
      const c = this.actions.core();
      if (!c.activeWorkspace || !owns(c, c.activeWorkspace)) this.saveAs();
      else void this.run(() => this.actions.save(c.activeWorkspace, true), true);
    } catch (error) { new Notice(explain(error, this.zh())); }
  }
  saveAs(): void {
    if (!this.live || !this.enabled() || this.actions.busy) return;
    try {
      const c = this.actions.core(); this.modal?.close();
      const modal = new WorkspaceNameModal(this.app, this.zh(), async name => {
        if (this.actions.core() !== c) throw new WorkspaceFailure("stale");
        const pending = this.actions.save(name, false); this.refresh();
        try { await pending; if (this.live) new Notice(message("saved", this.zh())); }
        finally { this.refresh(); }
      }, () => { if (this.modal === modal) this.modal = undefined; });
      this.modal = modal; modal.open();
    } catch (error) { new Notice(explain(error, this.zh())); }
  }
  dispose(): void {
    this.live = false; this.actions.stop(); this.menu?.close(false); this.modal?.close();
    this.observer?.disconnect(); this.resize?.disconnect();
    const win = this.slot.ownerDocument.defaultView; win?.removeEventListener("resize", this.schedule);
    if (this.frame !== undefined) win?.cancelAnimationFrame(this.frame);
    this.bar?.classList.remove("keyline-next-workspace-bar"); this.slot.remove();
  }
}

class WorkspaceNameModal extends Modal {
  private closed = false;
  constructor(app: App, private zh: boolean, private save: (name: string) => Promise<void>, private done: () => void) { super(app); }
  onOpen(): void {
    this.setTitle(this.zh ? "另存为新布局" : "Save as new layout"); this.modalEl.classList.add("keyline-next-workspace-dialog");
    const form = this.contentEl.createEl("form"), input = form.createEl("input", { type: "text" });
    input.placeholder = this.zh ? "例如：阅读、写作" : "For example: Reading, Writing";
    input.setAttribute("aria-label", this.zh ? "布局名称" : "Layout name"); input.maxLength = 80;
    const error = form.createEl("p", { cls: "keyline-next-workspace-error", attr: { role: "alert" } }); error.hidden = true;
    const actions = form.createDiv({ cls: "keyline-next-workspace-dialog-actions" });
    const cancel = actions.createEl("button", { text: message("cancel", this.zh) }); cancel.type = "button";
    const submit = actions.createEl("button", { text: message("save", this.zh), cls: "mod-cta" }); submit.type = "submit";
    cancel.addEventListener("click", () => this.close()); let busy = false;
    form.addEventListener("submit", async event => {
      event.preventDefault(); if (busy || this.closed) return; busy = true;
      input.disabled = cancel.disabled = submit.disabled = true; error.hidden = true;
      try { await this.save(input.value); if (!this.closed) this.close(); }
      catch (cause) { if (!this.closed) { error.textContent = explain(cause, this.zh); error.hidden = false; } }
      finally { busy = false; input.disabled = cancel.disabled = submit.disabled = false; if (!this.closed) input.focus(); }
    });
    input.focus();
  }
  onClose(): void { this.closed = true; this.contentEl.replaceChildren(); this.done(); }
}
