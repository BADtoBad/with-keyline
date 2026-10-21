import { Notice, TFolder, setIcon, type App, type Scope } from "obsidian";
import { availableNotePath } from "../domain/explorer";
import type { Preferences } from "../domain/preferences";
import { message } from "../strings";
import { ButtonKeys } from "./button-keys";
import { attachedViews } from "./native-views";

const actionsClass = "keyline-next-row-actions";
type ExplorerOwner = { app: App; preferences: Preferences; zh: boolean };

/** A thin layer on the real explorer. Never rebuild the tree, replace a native
 * event handler, or invent a partial file menu. Unknown rows are left alone. */
export class ExplorerActions {
  private live = true;
  private roots = new Map<HTMLElement, MutationObserver>();
  private windowFocus = new Map<HTMLElement, { focus: () => void; blur: () => void }>();
  private pending: ReturnType<typeof setTimeout> | undefined;
  private busy = new Set<TFolder>();
  private keys: ButtonKeys;
  constructor(private owner: ExplorerOwner) { this.keys = new ButtonKeys(owner.app); }
  private valid(folder: TFolder, path: string): boolean {
    return this.live && this.owner.preferences.fileNavigation && folder.path === path &&
      (path === "/" ? this.owner.app.vault.getRoot() === folder : this.owner.app.vault.getAbstractFileByPath(path) === folder);
  }
  async createNote(folder: TFolder): Promise<void> {
    const path = folder.path;
    if (!this.valid(folder, path) || this.busy.has(folder)) return;
    this.busy.add(folder);
    try {
      const target = availableNotePath(path, this.owner.zh, p => this.owner.app.vault.getAbstractFileByPath(p) !== null);
      if (!target || !this.valid(folder, path)) throw Error("Unavailable destination");
      // Vault.create rejects an occupied path. Never use modify/write here;
      // a race or partial failure is reported, not retried into another file.
      const file = await this.owner.app.vault.create(target, "");
      if (!this.live) return;
      if (!this.valid(folder, path) || this.owner.app.vault.getAbstractFileByPath(file.path) !== file) {
        new Notice(`${message("createdNotOpened", this.owner.zh)} ${file.path}`); return;
      }
      try { await this.owner.app.workspace.getLeaf(false).openFile(file); }
      catch { if (this.live) new Notice(`${message("createdNotOpened", this.owner.zh)} ${file.path}`); }
    } catch { if (this.live) new Notice(message("createFailed", this.owner.zh)); }
    finally { this.busy.delete(folder); }
  }
  private action(row: HTMLElement, kind: "new" | "more"): void {
    if (!this.live || !this.owner.preferences.fileNavigation || !row.isConnected) return;
    const path = row.dataset.path, file = path && this.owner.app.vault.getAbstractFileByPath(path);
    if (!file) { new Notice(message("explorerChanged", this.owner.zh)); return; }
    if (kind === "new") { if (file instanceof TFolder) void this.createNote(file); return; }
    const win = row.ownerDocument.defaultView, anchor = row.querySelector(`[data-keyline-action="more"]`);
    if (!win || !anchor) return;
    const rect = anchor.getBoundingClientRect();
    // The existing native row listener supplies all host/third-party entries.
    row.dispatchEvent(new win.MouseEvent("contextmenu", {
      bubbles: true, cancelable: true, view: win, button: 2, buttons: 0,
      clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2
    }));
  }
  private mount(row: HTMLElement, folder: boolean, parentScope: Scope | null): void {
    let bar = row.querySelector<HTMLElement>(`:scope > .${actionsClass}`);
    const shape = folder ? "folder" : "file";
    if (bar?.dataset.kind !== shape) { if (bar) { this.keys.releaseWithin(bar); bar.remove(); } bar = null; }
    if (!bar) {
      bar = row.ownerDocument.createElement("span"); bar.className = actionsClass; bar.dataset.kind = shape;
      bar.setAttribute("role", "group");
      for (const kind of (folder ? ["new", "more"] : ["more"]) as ("new" | "more")[]) {
        const button = row.ownerDocument.createElement("button");
        button.type = "button"; button.dataset.keylineAction = kind;
        button.classList.add("clickable-icon"); button.dataset.tooltipPosition = "top";
        setIcon(button, kind === "new" ? "plus" : "ellipsis"); bar.append(button);
        button.addEventListener("pointerdown", e => e.stopPropagation());
        button.addEventListener("mousedown", e => e.stopPropagation());
        button.addEventListener("click", e => { e.preventDefault(); e.stopPropagation(); this.action(row, kind); });
        button.addEventListener("focus", () => this.keys.focus(button, parentScope));
        button.addEventListener("blur", () => this.keys.blur(button));
        button.addEventListener("keydown", e => {
          if (e.defaultPrevented || e.ctrlKey || e.altKey || e.metaKey || e.shiftKey || (e.key !== "Enter" && e.key !== " ")) return;
          e.preventDefault(); e.stopPropagation(); if (!e.repeat) button.click();
        });
      }
      row.append(bar);
    }
    bar.setAttribute("aria-label", `${message("quickActions", this.owner.zh)}: ${row.dataset.path}`);
    for (const button of Array.from(bar.querySelectorAll<HTMLButtonElement>("button"))) {
      button.setAttribute("aria-label", `${message(button.dataset.keylineAction === "new" ? "noteHere" : "moreActions", this.owner.zh)}: ${row.dataset.path}`);
    }
  }
  refresh(): void {
    if (!this.live) return;
    this.keys.prune();
    const views = this.owner.preferences.fileNavigation ? attachedViews(this.owner.app, "file-explorer") : [];
    const current = new Map(views.map(view => [view.containerEl, view.scope] as const));
    for (const [root, observer] of this.roots) if (!current.has(root)) {
      observer.disconnect(); this.release(root); this.roots.delete(root);
    }
    for (const [root, parentScope] of current) {
      if (!this.roots.has(root)) {
        const Observer = root.ownerDocument.defaultView?.MutationObserver;
        if (!Observer) continue;
        const observer = new Observer(records => {
          if (records.some(record => !(record.target as Element).closest?.(`.${actionsClass}`) &&
            (record.type === "attributes" || [...Array.from(record.addedNodes), ...Array.from(record.removedNodes)]
              .some(node => !(node.nodeType === 1 && (node as Element).matches(`.${actionsClass}`)))))) this.schedule();
        });
        observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-path"] });
        this.roots.set(root, observer);
        const focus = () => {
          const button = root.ownerDocument.activeElement as HTMLButtonElement | null;
          if (button?.matches(`.${actionsClass} button`) && root.contains(button)) this.keys.focus(button, parentScope);
        };
        const blur = () => this.keys.releaseWithin(root);
        root.ownerDocument.defaultView?.addEventListener("focus", focus);
        root.ownerDocument.defaultView?.addEventListener("blur", blur);
        this.windowFocus.set(root, { focus, blur });
      }
      root.classList.add("keyline-next-explorer");
      for (const row of Array.from(root.querySelectorAll<HTMLElement>(".nav-file-title[data-path],.nav-folder-title[data-path]"))) {
        const file = this.owner.app.vault.getAbstractFileByPath(row.dataset.path ?? "");
        const folder = file instanceof TFolder;
        if (!file || row.querySelector(":scope > .nav-file-title-actions,:scope > .nav-folder-title-actions,:scope > .ncl-native-row-actions")) {
          this.removeBar(row); continue;
        }
        if (!row.querySelector(folder ? ".nav-folder-title-content" : ".nav-file-title-content")) { this.removeBar(row); continue; }
        this.mount(row, folder, parentScope);
      }
    }
  }
  private removeBar(row: HTMLElement): void {
    const bar = row.querySelector<HTMLElement>(`:scope > .${actionsClass}`);
    if (bar) { this.keys.releaseWithin(bar); bar.remove(); }
  }
  schedule(): void {
    if (!this.live || this.pending !== undefined) return;
    this.pending = setTimeout(() => { this.pending = undefined; this.refresh(); }, 60);
  }
  private release(root: HTMLElement): void {
    this.keys.releaseWithin(root);
    const listeners = this.windowFocus.get(root);
    if (listeners) {
      root.ownerDocument.defaultView?.removeEventListener("focus", listeners.focus);
      root.ownerDocument.defaultView?.removeEventListener("blur", listeners.blur);
      this.windowFocus.delete(root);
    }
    root.querySelectorAll(`.${actionsClass}`).forEach(el => el.remove());
    root.classList.remove("keyline-next-explorer");
  }
  dispose(): void {
    this.live = false;
    if (this.pending !== undefined) clearTimeout(this.pending);
    for (const [root, observer] of this.roots) { observer.disconnect(); this.release(root); }
    this.roots.clear();
    this.keys.clear();
  }
}
