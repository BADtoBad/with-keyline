import { Prec } from "@codemirror/state";
import { EditorView, ViewPlugin, keymap, type ViewUpdate } from "@codemirror/view";
import { editorInfoField, setIcon, type App, type EditorSuggestContext } from "obsidian";
import { mentionNavigation, type MentionChoice } from "../domain/mentions";
import type { Preferences } from "../domain/preferences";
import { DatePageSuggest } from "./mention-suggest";

/** A passive, editor-owned menu. Cancelling never dispatches a text change.
 * The native caret keeps focus; no system scope or private suggest DOM is used. */
export class MentionController {
  private views = new Map<EditorView, MentionMenu>();
  constructor(readonly app: App, readonly preferences: () => Preferences, readonly zh: () => boolean) {}
  extension() {
    const owner = this;
    return [ViewPlugin.define(view => {
      const menu = new MentionMenu(view, owner); owner.views.set(view, menu); return menu;
    }), Prec.highest(keymap.of(["ArrowDown", "ArrowUp", "Enter", "Tab", "Escape"].map(key => ({
      key, run: (view: EditorView) => owner.views.get(view)?.key(key) ?? false
    }))))];
  }
  claim(menu: MentionMenu): void { for (const other of this.views.values()) if (other !== menu) other.close(); }
  refresh(): void { for (const menu of this.views.values()) menu.close(); }
  remove(view: EditorView): void { this.views.delete(view); }
  dispose(): void { for (const menu of [...this.views.values()]) menu.destroy(); }
}

let serial = 0;
class MentionMenu {
  private source: DatePageSuggest;
  private root?: HTMLDivElement;
  private context?: EditorSuggestContext;
  private choices: MentionChoice[] = [];
  private active = -1;
  private anchor = -1;
  private pending?: number;
  private disposed = false;
  private generation = 0;
  private priorAria = new Map<string, string | null>();
  private ownedAria = new Map<string, string>();
  private outside: (e: Event) => void;
  private viewport: (e: Event) => void;
  private composing = false;
  private compose = () => {
    this.composing = true;
    this.deactivate();
    if (this.pending !== undefined) this.boundDocument.defaultView?.clearTimeout(this.pending);
    this.pending = undefined;
  };
  private composed = () => {
    this.composing = false;
    if (this.anchor >= 0) this.schedule();
  };
  private boundDocument: Document;
  constructor(private view: EditorView, private owner: MentionController) {
    this.source = new DatePageSuggest(owner.app, () => owner.preferences().mentions, owner.zh, () => view.composing, owner.preferences);
    const doc = view.dom.ownerDocument;
    this.boundDocument = doc;
    this.outside = e => { if (!this.root?.contains(e.target as Node)) this.close(); };
    this.viewport = e => { if (e.type === "resize" || !this.root?.contains(e.target as Node)) this.close(); };
    this.bindDocument(doc);
    view.contentDOM.addEventListener("compositionstart", this.compose);
    view.contentDOM.addEventListener("compositionend", this.composed);
  }
  private bindDocument(doc: Document): void {
    doc.addEventListener("pointerdown", this.outside, true);
    doc.addEventListener("focusin", this.outside, true);
    doc.addEventListener("scroll", this.viewport, true);
    doc.defaultView?.addEventListener("resize", this.viewport);
  }
  private unbindDocument(doc: Document): void {
    doc.removeEventListener("pointerdown", this.outside, true); doc.removeEventListener("focusin", this.outside, true);
    doc.removeEventListener("scroll", this.viewport, true); doc.defaultView?.removeEventListener("resize", this.viewport);
  }
  private syncDocument(): void {
    const doc = this.view.dom.ownerDocument;
    if (doc === this.boundDocument) return;
    this.close(); this.unbindDocument(this.boundDocument);
    this.boundDocument = doc; this.bindDocument(doc);
  }
  update(update: ViewUpdate): void {
    if (this.disposed) return;
    this.syncDocument();
    if (update.focusChanged && !this.view.hasFocus) { this.close(); return; }
    if (!update.docChanged && !update.selectionSet) return;
    const typed = update.transactions.some(t => t.isUserEvent("input.type"));
    const deletion = update.transactions.some(t => t.isUserEvent("delete"));
    if (this.anchor >= 0) {
      if (this.context && update.state.field(editorInfoField, false)?.file !== this.context.file) { this.close(); return; }
      if (update.docChanged && (typed || deletion)) {
        let intact = true;
        update.changes.iterChanges((from) => { if (from <= this.anchor) intact = false; });
        if (!intact) { this.close(); return; }
        this.deactivate(); this.schedule();
      } else if (update.docChanged || (!this.composing && !this.view.composing)) this.close();
      return;
    }
    // A new session requires the actual trigger keystroke. Pasted, restored or
    // programmatically selected literals must never reopen a dismissed menu.
    if (!typed || this.composing || this.view.composing || update.transactions.some(t => t.isUserEvent("input.type.compose"))) return;
    let trigger = false;
    update.changes.iterChanges((_a, _b, _c, end, inserted) => {
      if (inserted.toString() === "@" && end === update.state.selection.main.head) trigger = true;
    });
    if (!trigger || !this.current()) return;
    this.anchor = this.view.state.selection.main.head - 1;
    this.owner.claim(this); this.schedule();
  }
  private current(previewComposition = false): EditorSuggestContext | undefined {
    const state = this.view.state, info = state.field(editorInfoField, false);
    if (this.disposed || !this.view.hasFocus || (!previewComposition && this.view.composing) || state.readOnly || !info?.file || !info.editor ||
      state.doc.length > 2 * 1024 * 1024 || state.selection.ranges.length !== 1 || !state.selection.main.empty ||
      this.view.dom.ownerDocument.activeElement !== this.view.contentDOM) return;
    const hit = this.anchor >= 0
      ? this.source.onSession(info.editor.getCursor(), info.editor, info.editor.offsetToPos(this.anchor), previewComposition)
      : this.source.onTrigger(info.editor.getCursor(), info.editor, info.file, previewComposition);
    if (!hit || (this.anchor >= 0 && info.editor.posToOffset(hit.start) !== this.anchor)) return;
    return { ...hit, editor: info.editor, file: info.file };
  }
  private schedule(attempt = 0): void {
    const win = this.view.dom.ownerDocument.defaultView;
    if (!win) return;
    if (this.pending !== undefined) win.clearTimeout(this.pending);
    const generation = this.generation;
    this.pending = win.setTimeout(() => {
      this.pending = undefined;
      if (generation !== this.generation || this.disposed) return;
      // Retain the session while the system owns candidate navigation. CM may
      // clear its composing flag just after compositionend, so defer that last
      // read rather than treating it as cancellation. Never reopen a closed @.
      if (this.composing) {
        // Update the passive choices like the integrated companion, without
        // selecting anything or touching the IME-owned source/selection.
        const preview = this.context && this.current(true);
        if (preview) {
          this.context = preview; this.choices = this.source.getSuggestions(preview); this.active = -1;
          this.render(); this.position();
        }
        return;
      }
      if (this.view.composing) {
        if (attempt < 10) this.schedule(attempt + 1);
        return;
      }
      const context = this.current();
      if (!context) { this.close(); return; }
      this.context = context; this.choices = this.source.getSuggestions(context); this.active = -1;
      this.render(); this.position();
    }, attempt ? 20 : 0);
  }
  private render(): void {
    const doc = this.view.dom.ownerDocument, zh = this.owner.zh();
    if (!this.root) {
      this.root = doc.createElement("div"); this.root.className = "keyline-next-input-menu keyline-next-mention-menu";
      this.root.addEventListener("mousedown", e => e.preventDefault());
      doc.body.append(this.root);
    }
    this.root.replaceChildren();
    const list = this.root.createDiv({ cls: "keyline-next-mention-list" }); list.id = `keyline-next-mention-${++serial}`;
    list.setAttribute("role", "listbox"); list.setAttribute("aria-label", zh ? "插入日期或链接到页面" : "Insert a date or link to a page");
    for (const kind of ["date", "page"] as const) {
      const rows = this.choices.map((choice, index) => ({ choice, index })).filter(row => row.choice.kind === kind);
      if (!rows.length) continue;
      const label = kind === "date" ? (zh ? "日期" : "Date") : (zh ? "链接到页面" : "Link to a page");
      const group = list.createDiv(); group.setAttribute("role", "group"); group.setAttribute("aria-label", label);
      group.createDiv({ cls: "keyline-next-mention-heading", text: label }).setAttribute("aria-hidden", "true");
      for (const { choice, index } of rows) {
        const row = group.createDiv({ cls: `keyline-next-suggestion keyline-next-mention-row is-${kind}` });
        row.id = `${list.id}-${index}`; row.setAttribute("role", "option"); row.setAttribute("aria-selected", "false");
        const icon = row.createSpan({ cls: "keyline-next-mention-icon" }); icon.setAttribute("aria-hidden", "true");
        setIcon(icon, kind === "page" ? "file-text" : choice.kind === "date" && choice.key === "now" ? "clock" : "calendar");
        row.createDiv({ cls: "keyline-next-mention-label", text: choice.label });
        const detail = choice.kind === "date" ? choice.insert : choice.path.split("/").slice(0, -1).join("/") || (zh ? "根目录" : "Vault root");
        row.createDiv({ cls: "keyline-next-mention-detail", text: detail });
        row.addEventListener("pointermove", () => this.select(index));
        row.addEventListener("click", () => this.commit(index));
      }
    }
    if (!this.choices.length) list.createDiv({ cls: "keyline-next-mention-empty", text: zh ? "没有匹配项，继续输入会保留原文" : "No results. Keep typing to retain your text." }).setAttribute("role", "status");
    this.root.createDiv({ cls: "keyline-next-mention-hint", text: zh ? "↑↓ 选择 · Enter 插入 · Esc 保留原文" : "↑↓ Select · Enter Insert · Esc Keep text" });
    this.aria("aria-controls", list.id); this.aria("aria-expanded", "true"); this.aria("aria-autocomplete", "list");
    this.restoreAria("aria-activedescendant");
  }
  private position(): void {
    if (!this.root) return;
    const rect = this.view.coordsAtPos(this.view.state.selection.main.head), win = this.view.dom.ownerDocument.defaultView!;
    if (!rect) { this.close(); return; }
    this.root.style.maxHeight = `${Math.max(32, Math.min(400, win.innerHeight - 16))}px`;
    this.root.style.left = `${Math.max(8, Math.min(rect.left, win.innerWidth - this.root.offsetWidth - 8))}px`;
    this.root.style.top = `${Math.max(8, Math.min(rect.bottom + 6, win.innerHeight - this.root.offsetHeight - 8))}px`;
  }
  key(key: string): boolean {
    this.syncDocument();
    if (this.anchor < 0) return false;
    if (this.composing || this.view.composing) return false;
    if (!this.context || !this.current()) { this.close(); return false; }
    if (key === "Escape") { this.close(); return true; }
    if (key === "ArrowDown" || key === "ArrowUp") {
      this.select(mentionNavigation(this.active, this.choices.length, key)); return true;
    }
    if (key === "Enter" || key === "Tab") {
      if (this.active >= 0) { this.commit(this.active); return true; }
      this.close(); return false;
    }
    return false;
  }
  private select(index: number): void {
    if (this.composing || this.view.composing) return;
    if (!this.root || index < 0 || !this.choices[index]) return;
    this.active = index;
    this.root.querySelectorAll<HTMLElement>("[role=option]").forEach((row, i) => {
      row.classList.toggle("is-active", i === index); row.setAttribute("aria-selected", String(i === index));
      if (i === index) { this.aria("aria-activedescendant", row.id); row.scrollIntoView({ block: "nearest" }); }
    });
  }
  private commit(index: number): void {
    if (this.composing || this.view.composing) return;
    const choice = this.choices[index], context = this.current();
    const valid = context && this.context && context.editor === this.context.editor && context.file === this.context.file && context.query === this.context.query;
    this.close();
    if (!valid || !choice || !context) return;
    this.source.context = context; this.source.selectSuggestion(choice);
  }
  private deactivate(): void {
    this.active = -1;
    this.root?.querySelectorAll<HTMLElement>("[role=option]").forEach(row => {
      row.classList.remove("is-active"); row.setAttribute("aria-selected", "false");
    });
    this.restoreAria("aria-activedescendant");
  }
  private aria(name: string, value: string): void {
    if (!this.priorAria.has(name)) this.priorAria.set(name, this.view.contentDOM.getAttribute(name));
    this.view.contentDOM.setAttribute(name, value); this.ownedAria.set(name, value);
  }
  private restoreAria(name: string): void {
    if (this.ownedAria.has(name) && this.view.contentDOM.getAttribute(name) === this.ownedAria.get(name)) {
      const prior = this.priorAria.get(name);
      if (prior == null) this.view.contentDOM.removeAttribute(name); else this.view.contentDOM.setAttribute(name, prior);
    }
    this.priorAria.delete(name); this.ownedAria.delete(name);
  }
  close(): void {
    this.generation++;
    if (this.pending !== undefined) this.boundDocument.defaultView?.clearTimeout(this.pending);
    this.pending = undefined; this.anchor = -1; this.active = -1; this.context = undefined; this.choices = [];
    this.root?.remove(); this.root = undefined; this.source.close();
    for (const key of [...this.ownedAria.keys()]) this.restoreAria(key);
  }
  destroy(): void {
    if (this.disposed) return;
    this.disposed = true; this.close();
    this.unbindDocument(this.boundDocument);
    this.view.contentDOM.removeEventListener("compositionstart", this.compose); this.owner.remove(this.view);
    this.view.contentDOM.removeEventListener("compositionend", this.composed);
  }
}
