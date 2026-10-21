import { EditorView, ViewPlugin, type ViewUpdate } from "@codemirror/view";
import { editorInfoField, setIcon, Notice, type Editor } from "obsidian";
import type { Preferences } from "../domain/preferences";
import { inProtectedSyntax } from "../domain/blocks";
import type { RichFormatting } from "./rich-format";
import type { App } from "obsidian";
import { message } from "../strings";
import { annotationStatus, insertAnnotation, nativeSelectionAction, nativeSelectionCommands, selectionBlockLabel, type NativeSelectionAction } from "./native-selection";

/** Host extension; no editor DOM replacement and no synthetic document edits. */
export class ToolbarController {
  private instances = new Set<SelectionToolbar>();
  constructor(readonly app: App, readonly preferences: () => Preferences, readonly zh: () => boolean, readonly rich: RichFormatting) {}
  extension() {
    const owner = this;
    return ViewPlugin.define(view => {
      const instance = new SelectionToolbar(view, owner); owner.instances.add(instance); return instance;
    }, { eventHandlers: {
      pointerdown(event) { this.pointer = !this.foreignInput(event.target as Element); this.armed = false; this.hide(); },
      keydown(event) {
        if (this.foreignInput(event.target as Element)) { this.armed = false; this.hide(); return false; }
        if (event.key === "Escape") { this.armed = false; this.hide(); return false; }
        if (event.shiftKey || (event.key.toLowerCase() === "a" && (event.metaKey || event.ctrlKey))) this.armed = true;
        return false;
      },
      contextmenu() { this.armed = false; this.hide(); }
    } });
  }
  refresh(): void { for (const instance of this.instances) instance.refresh(); }
  focus(editor: Editor): boolean {
    for (const instance of this.instances) if (instance.editor === editor) {
      instance.armed = true; instance.focusRequested = true; instance.schedule(); return true;
    }
    return false;
  }
  remove(instance: SelectionToolbar): void { this.instances.delete(instance); }
  dispose(): void { for (const instance of [...this.instances]) instance.destroy(); this.instances.clear(); }
}

class SelectionToolbar {
  pointer = false;
  armed = false;
  focusRequested = false;
  private root: HTMLDivElement;
  private snapshot = { from: -1, to: -1, text: "", document: "" };
  private shown = false;
  private disposed = false;
  private formatting = false;
  private releasePointer: () => void;
  private focusChanged: (event: FocusEvent) => void;
  private selectionKey: (event: KeyboardEvent) => void;
  private calloutPointer: (event: PointerEvent) => void;
  private boundDocument: Document;
  private resumeAfterBlur = false;
  private annotationChanged = () => this.refresh();
  private windowBlur = () => {
    this.resumeAfterBlur = this.resumeAfterBlur || this.armed && this.shown;
    this.armed = false; this.pointer = false; this.hide();
  };
  private windowFocus = () => this.schedule();
  get editor(): Editor | undefined { return this.view.state.field(editorInfoField, false)?.editor; }
  constructor(private view: EditorView, private owner: ToolbarController) {
    const doc = view.dom.ownerDocument;
    this.boundDocument = doc;
    this.root = doc.createElement("div");
    this.root.className = "keyline-next-toolbar";
    this.root.setAttribute("role", "toolbar");
    this.root.setAttribute("aria-label", message("format", owner.zh()));
    this.root.hidden = true; doc.body.append(this.root);
    // Core's keymap consumes Shift+Arrow before ordinary ViewPlugin handlers.
    // Observe selection intent in capture phase without consuming the event.
    this.selectionKey = event => {
      if (this.foreignInput(event.target as Element)) return;
      if (event.key === "Escape") { this.resumeAfterBlur = false; this.armed = false; this.hide(); return; }
      if (event.shiftKey || (event.key.toLowerCase() === "a" && (event.metaKey || event.ctrlKey))) this.armed = true;
    };
    view.dom.addEventListener("keydown", this.selectionKey, true);
    // Native block widgets consume their pointer events before ViewPlugin
    // handlers. This explicit edit control expresses selection intent; a
    // programmatic selection or annotation placeholder does not.
    this.calloutPointer = event => {
      const target = event.target as Element | null;
      if (event.button !== 0 || !target?.closest(".cm-callout > .embed-actions > .edit-block-button") || this.foreignInput(target)) return;
      this.pointer = true; this.armed = false; this.hide();
    };
    view.dom.addEventListener("pointerdown", this.calloutPointer, true);
    doc.defaultView?.addEventListener("keyline-marginalia-settings", this.annotationChanged);
    doc.defaultView?.addEventListener("blur", this.windowBlur);
    doc.defaultView?.addEventListener("focus", this.windowFocus);
    this.root.addEventListener("mousedown", e => e.preventDefault());
    this.root.addEventListener("keydown", e => {
      const buttons = Array.from(this.root.querySelectorAll<HTMLButtonElement>("button:not([disabled])"));
      const index = buttons.indexOf(this.root.ownerDocument.activeElement as HTMLButtonElement);
      if (e.key === "Escape") { this.resumeAfterBlur = false; this.armed = false; this.hide(); view.focus(); e.preventDefault(); e.stopPropagation(); }
      if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
        const next = e.key === "Home" ? 0 : e.key === "End" ? buttons.length - 1 :
          (index + (e.key === "ArrowRight" ? 1 : buttons.length - 1)) % buttons.length;
        buttons[next]?.focus(); buttons[next]?.scrollIntoView({ block: "nearest", inline: "nearest" });
        e.preventDefault(); e.stopPropagation();
      }
      // Obsidian's global keyboard scope can consume the browser's default
      // activation. Handle these keys while focus is inside our own toolbar.
      if ((e.key === "Enter" || e.key === " ") && index >= 0) {
        e.preventDefault(); e.stopPropagation();
        if (!e.repeat) buttons[index].click();
      }
    });
    this.releasePointer = () => {
      if (!this.pointer) return;
      this.pointer = false;
      this.armed = !this.foreignInput(this.root.ownerDocument.activeElement);
      this.schedule();
    };
    doc.addEventListener("pointerup", this.releasePointer);
    this.focusChanged = event => {
      if (this.root.contains(event.target as Node)) return;
      if (!this.view.contentDOM.contains(event.target as Node) || this.foreignInput(event.target as Element)) {
        this.resumeAfterBlur = false; this.armed = false; this.pointer = false; this.hide();
      }
    };
    doc.addEventListener("focusin", this.focusChanged);
  }
  /** Obsidian can move the existing CodeMirror view between native windows
   * without destroying it. The toolbar and document listeners must follow. */
  private syncDocument(): void {
    const doc = this.view.dom.ownerDocument, previous = this.boundDocument;
    if (doc === previous) return;
    previous.removeEventListener("pointerup", this.releasePointer);
    previous.removeEventListener("focusin", this.focusChanged);
    previous.defaultView?.removeEventListener("keyline-marginalia-settings", this.annotationChanged);
    previous.defaultView?.removeEventListener("blur", this.windowBlur);
    previous.defaultView?.removeEventListener("focus", this.windowFocus);
    this.boundDocument = doc;
    this.resumeAfterBlur = false; this.armed = false; this.pointer = false; this.hide();
    doc.body.append(this.root);
    doc.addEventListener("pointerup", this.releasePointer);
    doc.addEventListener("focusin", this.focusChanged);
    doc.defaultView?.addEventListener("keyline-marginalia-settings", this.annotationChanged);
    doc.defaultView?.addEventListener("blur", this.windowBlur);
    doc.defaultView?.addEventListener("focus", this.windowFocus);
  }
  foreignInput(target: Element | null): boolean {
    const input = target?.closest("input,textarea,select,[contenteditable=true]");
    return !!input && input !== this.view.contentDOM;
  }
  update(update: ViewUpdate): void {
    if (update.docChanged && !this.formatting) {
      // Native history restores an intentional earlier selection. Match the
      // integrated toolbar after undo/redo, without arming ordinary programmatic
      // selections or the initial annotation placeholder transaction.
      this.armed = this.view.hasFocus && update.transactions.some(t => t.isUserEvent("undo") || t.isUserEvent("redo"));
    }
    if (update.selectionSet || update.docChanged || update.focusChanged || update.viewportChanged || update.geometryChanged) this.schedule();
  }
  refresh(): void {
    const buttons = Array.from(this.root.querySelectorAll<HTMLButtonElement>("button"));
    const index = buttons.indexOf(this.root.ownerDocument.activeElement as HTMLButtonElement);
    if (this.shown) {
      this.render();
      if (index >= 0) this.root.querySelectorAll<HTMLButtonElement>("button")[index]?.focus();
    }
    this.root.setAttribute("aria-label", message("format", this.owner.zh()));
    this.schedule();
  }
  private eligible(): boolean {
    const state = this.view.state, selected = state.selection.main, editor = this.editor;
    const active = this.view.dom.ownerDocument.activeElement;
    if (this.disposed || !editor || !this.view.dom.ownerDocument.hasFocus() || !this.owner.preferences().toolbar || !this.armed || this.pointer || this.view.composing || state.readOnly ||
      state.doc.length > 2 * 1024 * 1024 || this.foreignInput(active)) return false;
    if (!this.view.hasFocus && !this.root.contains(active) && !this.focusRequested) return false;
    if (state.selection.ranges.length !== 1 || selected.empty || selected.to - selected.from > 16000 ||
      !state.sliceDoc(selected.from, selected.to).trim() || inProtectedSyntax(state.doc.toString(), selected.from, selected.to, true)) return false;
    // Auto-selected annotation placeholders do not arm this toolbar. Embedded
    // editors without a Markdown file are also excluded.
    return Boolean(state.field(editorInfoField, false)?.file);
  }
  schedule(): void {
    if (this.disposed) return;
    this.syncDocument();
    this.view.requestMeasure({
      key: this,
      read: () => {
        // Match the integrated toolbar when the same native editor regains
        // focus. Never resurrect an old selection after source/range changes
        // or while a different input/window owns focus.
        if (this.resumeAfterBlur && this.view.hasFocus && this.valid()) {
          this.resumeAfterBlur = false; this.armed = true;
        }
        if (!this.eligible()) return null;
        const selected = this.view.state.selection.main;
        const a = this.view.coordsAtPos(selected.from), b = this.view.coordsAtPos(selected.to);
        const area = this.view.scrollDOM.getBoundingClientRect();
        if (!a || !b || b.bottom < area.top || a.top > area.bottom) return null;
        return { left: Math.max(area.left + 4, a.left), top: a.top, bottom: b.bottom };
      },
      write: bounds => {
        if (!bounds || !this.eligible()) { this.hide(); return; }
        const selected = this.view.state.selection.main;
        const text = this.view.state.sliceDoc(selected.from, selected.to);
        const changed = text !== this.snapshot.text || this.snapshot.document !== this.view.state.doc.toString() ||
          selected.from !== this.snapshot.from || selected.to !== this.snapshot.to;
        this.snapshot = { from: selected.from, to: selected.to, text, document: this.view.state.doc.toString() };
        if (!this.shown || changed) this.render();
        const win = this.root.ownerDocument.defaultView!;
        this.root.hidden = false;
        this.root.style.maxWidth = `${Math.max(100, win.innerWidth - 16)}px`;
        this.root.style.left = `${Math.max(8, Math.min(bounds.left, win.innerWidth - this.root.offsetWidth - 8))}px`;
        const height = this.root.offsetHeight;
        this.root.style.top = `${bounds.top >= height + 14 ? bounds.top - height - 6 :
          Math.min(bounds.bottom + 6, win.innerHeight - height - 8)}px`;
        this.shown = true;
        if (this.focusRequested) { this.root.querySelector<HTMLButtonElement>("button:not([disabled])")?.focus(); this.focusRequested = false; }
      }
    });
  }
  private valid(): boolean {
    const selected = this.view.state.selection.main, saved = this.snapshot;
    return !this.disposed && this.boundDocument.hasFocus() && this.owner.preferences().toolbar && !this.view.state.readOnly &&
      this.boundDocument === this.view.dom.ownerDocument &&
      this.view.state.selection.ranges.length === 1 && selected.from === saved.from && selected.to === saved.to &&
      this.view.state.doc.toString() === saved.document && !this.view.composing;
  }
  private render(): void {
    this.root.replaceChildren();
    for (const [key, icon] of [["blockType", "chevron-down"], ["bold", "bold"], ["italic", "italic"], ["strike", "strikethrough"],
      ["code", "code"], ["link", "link"], ["highlight", "highlighter"], ["sidenote", "text-quote"], ["marginnote", "panel-right"],
      ["colors", "palette"], ["moreBlocks", "ellipsis"]] as const) {
      if (["bold", "sidenote", "colors"].includes(key)) {
        const separator = this.root.ownerDocument.createElement("span");
        separator.className = "keyline-next-toolbar-separator"; separator.setAttribute("aria-hidden", "true"); this.root.append(separator);
      }
      const button = this.root.ownerDocument.createElement("button");
      button.type = "button"; button.className = "clickable-icon";
      const label = message(key, this.owner.zh());
      button.setAttribute("aria-label", label);
      button.dataset.action = key;
      if (key === "sidenote" || key === "marginnote") {
        const status = annotationStatus(this.owner.app, this.view);
        const reason = status.reason ?? (status.error ? message("annotationFailed", this.owner.zh()) :
          status.provider ? null : message("annotationUnavailable", this.owner.zh()));
        button.disabled = !!reason; if (reason) button.title = reason;
      }
      if (this.owner.preferences().hints && !button.title) button.title = label;
      if (key === "blockType") {
        button.classList.add("keyline-next-toolbar-type");
        const text = button.ownerDocument.createElement("span"); text.className = "keyline-next-toolbar-label";
        text.textContent = selectionBlockLabel(this.view.state.doc.lineAt(this.snapshot.from).text, this.owner.zh()); button.append(text);
        const chevron = button.ownerDocument.createElement("span"); setIcon(chevron, icon); button.append(chevron);
      } else setIcon(button, icon);
      this.root.append(button);
      button.addEventListener("click", () => {
        if (!this.valid() || !this.editor) { this.hide(); return; }
        const editor = this.editor;
        const file = this.view.state.field(editorInfoField, false)?.file;
        const context = file && this.owner.rich.capture(editor, file, () => !this.disposed && !this.view.composing && !this.view.state.readOnly);
        const bounds = button.getBoundingClientRect(), point = { x: bounds.left, y: bounds.bottom };
        if (key === "sidenote" || key === "marginnote") {
          this.armed = false; this.hide();
          const result = insertAnnotation(this.owner.app, this.view, key, () => this.valid());
          if (result.status === "failed") new Notice(message("annotationFailed", this.owner.zh()));
          else if (result.status === "unavailable") new Notice(result.reason ?? message("annotationUnavailable", this.owner.zh()));
          return;
        }
        if (key in nativeSelectionCommands) {
          this.formatting = true;
          try {
            if (!nativeSelectionAction(this.owner.app, editor, key as NativeSelectionAction, () => this.valid())) {
              new Notice(message("commandUnavailable", this.owner.zh()));
            }
          } finally { this.formatting = false; }
          this.armed = !this.view.state.selection.main.empty; this.schedule();
          return;
        }
        this.armed = false; this.hide(); this.view.focus();
        if (context) this.owner.rich.selectionMenu(context, point, this.root.ownerDocument, key === "colors" ? "color" : "main", resume => {
          if (!this.disposed) { this.armed = resume; this.schedule(); }
        });
      });
    }
  }
  hide(): void { this.root.hidden = true; this.shown = false; this.focusRequested = false; }
  destroy(): void {
    this.disposed = true;
    this.boundDocument.removeEventListener("pointerup", this.releasePointer);
    this.boundDocument.removeEventListener("focusin", this.focusChanged);
    this.view.dom.removeEventListener("keydown", this.selectionKey, true);
    this.view.dom.removeEventListener("pointerdown", this.calloutPointer, true);
    this.boundDocument.defaultView?.removeEventListener("keyline-marginalia-settings", this.annotationChanged);
    this.boundDocument.defaultView?.removeEventListener("blur", this.windowBlur);
    this.boundDocument.defaultView?.removeEventListener("focus", this.windowFocus);
    this.root.remove(); this.owner.remove(this);
  }
}
