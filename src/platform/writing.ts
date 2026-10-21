import { syntaxTree, syntaxTreeAvailable } from "@codemirror/language";
import { Prec, StateEffect, Transaction } from "@codemirror/state";
import { Decoration, EditorView, ViewPlugin, WidgetType, type DecorationSet, type ViewUpdate } from "@codemirror/view";
import { editorInfoField, editorLivePreviewField, Notice, setIcon, type Editor } from "obsidian";
import { analyzeWriting, bracketEdit, warningRange, MAX_WRITING_UNITS, type HostToken, type WritingAnalysis } from "../domain/writing";
import type { Preferences } from "../domain/preferences";
import { message } from "../strings";
import { structurePresentation, calloutPresentation, type StructurePresentation } from "../domain/structure-presentation";

class EditableCalloutHeader extends WidgetType {
  constructor(private type: string, private explicit: boolean, private zh: boolean) { super(); }
  eq(other: EditableCalloutHeader): boolean { return this.type === other.type && this.explicit === other.explicit && this.zh === other.zh; }
  toDOM(view: EditorView): HTMLElement {
    const doc = view.dom.ownerDocument, header = doc.createElement("span"), icon = doc.createElement("span");
    const info = calloutPresentation(this.type, this.zh);
    header.className = "keyline-next-callout-heading";
    icon.className = "keyline-next-callout-symbol"; icon.setAttribute("aria-hidden", "true"); setIcon(icon, info.icon); header.append(icon);
    if (this.explicit) header.setAttribute("aria-hidden", "true");
    else { const label = doc.createElement("span"); label.textContent = info.label; header.append(label); }
    return header;
  }
  ignoreEvent(): boolean { return true; }
}

const redraw = StateEffect.define<null>();
export class WritingController {
  private instances = new Set<WritingView>();
  private documents = new Map<Document, { count: number; reveal: boolean; remove(): void }>();
  private registrations = new Map<WritingView, Document>();
  private notice?: Notice;
  private inputStats = { calls: 0, composing: 0, nonTyping: 0, skipped: 0, normalized: 0 };
  live = true;
  constructor(readonly preferences: () => Preferences, readonly zh: () => boolean) {}
  extension() {
    const owner = this;
    const plugin = ViewPlugin.define(view => new WritingView(view, owner), {
      decorations: value => value.decorations,
      provide: p => EditorView.atomicRanges.of(view => view.plugin(p)?.atomic ?? Decoration.none),
      eventHandlers: {
        compositionstart() { this.beginComposition(); },
        compositionend() { this.endComposition(); }
      }
    });
    return [plugin, Prec.highest(EditorView.inputHandler.of((view, from, to, input, insert) => {
      if (/^[【】]{1,2}$/u.test(input)) { owner.inputStats.calls++; if (view.composing) owner.inputStats.composing++; }
      if (!owner.live || view.composing || view.state.readOnly || view.state.doc.length > MAX_WRITING_UNITS ||
        view.state.selection.ranges.length !== 1 || !view.state.field(editorInfoField, false)?.file || !/^[【】]{1,2}$/u.test(input)) return false;
      const transaction = insert();
      if (!transaction.isUserEvent("input.type") || transaction.isUserEvent("input.type.compose")) { owner.inputStats.nonTyping++; return false; }
      const text = view.state.doc.toString();
      const edit = owner.preferences().fullwidthLinks ? bracketEdit(text, from, to, input) : null;
      // The host has its own fullwidth normalization. Outside our contract,
      // leave native behaviour intact; do not bypass other transaction filters
      // or rewrite their result after the fact.
      if (!edit) {
        owner.inputStats.skipped++;
        return false;
      }
      owner.inputStats.normalized++;
      view.dispatch({ changes: { from: edit.from, to: edit.to, insert: edit.insert },
        selection: { anchor: edit.cursor }, annotations: Transaction.userEvent.of("input.type"), scrollIntoView: true });
      return true;
    }))];
  }
  attach(instance: WritingView): boolean {
    if (!this.live) return false;
    const doc = instance.view.dom.ownerDocument, previous = this.registrations.get(instance);
    if (previous === doc) return false;
    if (previous) this.detach(instance);
    this.instances.add(instance);
    this.registrations.set(instance, doc);
    const existing = this.documents.get(doc);
    if (existing) { existing.count++; return true; }
    const state = { count: 1, reveal: false, remove() {} };
    const set = (value: boolean) => { if (state.reveal !== value) { state.reveal = value; this.refresh(doc); } };
    const down = (event: KeyboardEvent) => { if (event.key === "Alt") set(true); };
    const up = (event: KeyboardEvent) => { if (event.key === "Alt" || !event.altKey) set(false); };
    const clear = () => set(false);
    doc.addEventListener("keydown", down, true); doc.addEventListener("keyup", up, true);
    doc.addEventListener("visibilitychange", clear); doc.defaultView?.addEventListener("blur", clear);
    state.remove = () => {
      doc.removeEventListener("keydown", down, true); doc.removeEventListener("keyup", up, true);
      doc.removeEventListener("visibilitychange", clear); doc.defaultView?.removeEventListener("blur", clear);
    };
    this.documents.set(doc, state);
    return true;
  }
  detach(instance: WritingView): void {
    this.instances.delete(instance);
    const doc = this.registrations.get(instance);
    this.registrations.delete(instance);
    if (!doc) return;
    const entry = this.documents.get(doc);
    if (entry && --entry.count === 0) { entry.remove(); this.documents.delete(doc); }
  }
  revealed(doc: Document): boolean { return this.preferences().optionReveal && !!this.documents.get(doc)?.reveal; }
  refresh(doc?: Document): void {
    if (!this.live) return;
    for (const instance of this.instances) if (!doc || instance.view.dom.ownerDocument === doc) instance.view.dispatch({ effects: redraw.of(null) });
  }
  warnPaste(count: number): void {
    if (!this.live || !this.preferences().pasteHints || !count) return;
    this.notice?.hide(); this.notice = new Notice(message("pasteWarning", this.zh()).replace("{n}", String(count)));
  }
  next(editor: Editor): boolean {
    const instance = [...this.instances].find(i => i.editor === editor);
    if (!instance || !this.live || instance.view.composing) return false;
    if (instance.view.state.doc.length > MAX_WRITING_UNITS) { new Notice(message("writingTooLarge", this.zh())); return true; }
    const analysis = instance.analyze();
    if (!analysis) { new Notice(message("parsePending", this.zh())); return true; }
    const at = editor.posToOffset(editor.getCursor("to")), next = analysis.suspicious.find(r => r.from >= at) ?? analysis.suspicious[0];
    if (!next) { new Notice(message("noSuspicious", this.zh())); return true; }
    instance.navigate(next.from, next.to);
    return true;
  }
  inspect(editor: Editor) {
    const instance = [...this.instances].find(i => i.editor === editor);
    if (!instance) return null;
    return { live: instance.view.state.field(editorLivePreviewField, false), nodes: instance.tokens,
      analysis: instance.analyze(), structure: instance.structure, applied: instance.applied, revealed: this.revealed(instance.view.dom.ownerDocument), inputStats: { ...this.inputStats } };
  }
  dispose(): void {
    this.live = false; this.notice?.hide();
    for (const entry of this.documents.values()) entry.remove();
    this.documents.clear();
    this.registrations.clear();
    for (const instance of this.instances) instance.cancelTimers();
  }
}
class WritingView {
  decorations: DecorationSet = Decoration.none;
  atomic: DecorationSet = Decoration.none;
  tokens: HostToken[] = [];
  applied = 0;
  structure: StructurePresentation = { quotes: [], separators: [] };
  private doc?: ViewUpdate["state"]["doc"];
  private tree?: ReturnType<typeof syntaxTree>;
  private analysis: WritingAnalysis = { hidden: [], suspicious: [] };
  private composingBefore?: { text: string; from: number; to: number };
  private compositionTimer?: ReturnType<typeof setTimeout>;
  private pasteTimer?: ReturnType<typeof setTimeout>;
  private navigationTimer?: ReturnType<typeof setTimeout>;
  private destroyed = false;
  private revision = 0;
  get editor(): Editor | undefined { return this.view.state.field(editorInfoField, false)?.editor; }
  constructor(readonly view: EditorView, private owner: WritingController) { owner.attach(this); this.rebuild(); }
  analyze(): WritingAnalysis | null {
    const state = this.view.state, tree = syntaxTree(state);
    if (!this.owner.live || !state.field(editorInfoField, false)?.file || state.doc.length > MAX_WRITING_UNITS ||
      !syntaxTreeAvailable(state, Math.min(state.doc.length, this.view.viewport.to))) return null;
    if (this.doc !== state.doc || this.tree !== tree) {
      this.tokens = [];
      tree.iterate({ enter: n => { if (n.name !== "Document") this.tokens.push({ name: n.name, from: n.from, to: n.to }); } });
      this.analysis = analyzeWriting(state.doc.toString(), this.tokens);
      this.structure = structurePresentation(state.doc.toString(), this.tokens);
      this.doc = state.doc; this.tree = tree;
    }
    return this.analysis;
  }
  private rebuild(): void {
    this.decorations = this.atomic = Decoration.none; this.applied = 0;
    const analysis = this.analyze(), state = this.view.state, prefs = this.owner.preferences();
    if (!analysis) return;
    const visible = (r: { from: number; to: number }) => this.view.visibleRanges.some(v => r.from >= v.from && r.to <= v.to);
    const shown = !!state.field(editorLivePreviewField, false);
    // Composition must not replace source around the native IME range. Pure
    // separator styling is independent: removing it makes every list row jump.
    const formatted = prefs.hideMarkers && shown && !this.view.composing && !this.owner.revealed(this.view.dom.ownerDocument);
    const hidden = formatted
      ? analysis.hidden.filter(visible).map(r => Decoration.replace({}).range(r.from, r.to)) : [];
    const layout = [];
    if (formatted) for (const line of this.structure.quotes) {
      if (!this.view.visibleRanges.some(r => r.from <= line.to && r.to >= line.from)) continue;
      const tone = line.type ? calloutPresentation(line.type, this.owner.zh()).tone : "gray";
      layout.push(Decoration.line({class: `keyline-next-edit-${line.kind}${line.first ? " is-first" : ""}${line.last ? " is-last" : ""}`,
        attributes: {"data-keyline-callout-tone": tone}}).range(line.from));
      hidden.push(Decoration.replace({}).range(line.marker.from, line.marker.to));
      if (line.header && line.type) hidden.push(Decoration.replace({widget: new EditableCalloutHeader(line.type, !!line.explicitTitle, this.owner.zh())}).range(line.header.from, line.header.to));
    }
    if (shown && prefs.typographyEnabled) for (const separator of this.structure.separators.filter(visible))
      layout.push(Decoration.mark({class: `keyline-next-list-separator is-${separator.task ? "task" : "marker"}`}).range(separator.from, separator.to));
    this.applied = hidden.length;
    this.atomic = Decoration.set(hidden, true);
    const text = prefs.markSuspicious ? state.doc.toString() : "";
    const warnings = prefs.markSuspicious && !this.view.composing ? analysis.suspicious.filter(visible).map(r => {
      const range = warningRange(text, r);
      return Decoration.mark({
        class: "keyline-next-suspicious", attributes: { title: message(r.kind === "backtick" ? "suspiciousCode" : r.kind === "strike" ? "suspiciousStrike" : "suspiciousEmphasis", this.owner.zh()) }
      }).range(range.from, range.to);
    }) : [];
    this.decorations = Decoration.set([...hidden, ...warnings, ...layout], true);
  }
  update(update: ViewUpdate): void {
    const moved = this.owner.attach(this);
    if (update.docChanged) this.revision++;
    if (moved || update.docChanged || update.viewportChanged || update.selectionSet || this.tree !== syntaxTree(update.state) ||
      update.startState.field(editorLivePreviewField, false) !== update.state.field(editorLivePreviewField, false) ||
      update.transactions.some(t => t.effects.some(e => e.is(redraw)))) this.rebuild();
    if (update.transactions.some(t => t.isUserEvent("input.paste")) && this.owner.preferences().pasteHints) {
      clearTimeout(this.pasteTimer);
      const revision = this.revision, changed: { from: number; to: number }[] = [];
      update.changes.iterChangedRanges((_a, _b, from, to) => changed.push({ from, to }));
      this.pasteTimer = setTimeout(() => {
        if (this.destroyed || this.revision !== revision) return;
        const analysis = this.analyze();
        const count = analysis?.suspicious.filter(r => changed.some(c => r.from < c.to && r.to > c.from)).length ?? 0;
        this.owner.warnPaste(count);
      }, 250);
    }
  }
  navigate(from: number, to: number): void {
    clearTimeout(this.navigationTimer);
    this.view.focus();
    // First reveal the target line in Live Preview. The host adjusts selections
    // against its previous hidden-marker ranges asynchronously. Selecting the
    // delimiter after that reveal avoids its stale-range caret correction.
    this.view.dispatch({ selection: { anchor: from }, effects: EditorView.scrollIntoView(from, { y: "center" }) });
    const { doc, selection } = this.view.state;
    this.navigationTimer = setTimeout(() => {
      if (this.destroyed || !this.owner.live || this.view.composing || !this.view.hasFocus ||
        this.view.state.doc !== doc || this.view.state.selection !== selection) return;
      this.view.dispatch({ selection: { anchor: from, head: to } });
    }, 0);
  }
  beginComposition(): void {
    clearTimeout(this.compositionTimer);
    const s = this.view.state.selection;
    this.composingBefore = this.owner.preferences().fullwidthLinks && this.view.state.doc.length <= MAX_WRITING_UNITS &&
      s.ranges.length === 1 && s.main.empty ? { text: this.view.state.doc.toString(), from: s.main.from, to: s.main.to } : undefined;
    this.compositionTimer = setTimeout(() => { if (!this.destroyed) this.view.dispatch({ effects: redraw.of(null) }); }, 0);
  }
  endComposition(): void {
    clearTimeout(this.compositionTimer);
    const before = this.composingBefore; this.composingBefore = undefined;
    let attempts = 0;
    const finish = () => {
      if (this.destroyed || !this.owner.live) return;
      if (this.view.composing && ++attempts < 10) { this.compositionTimer = setTimeout(finish, 50); return; }
      const state = this.view.state, selection = state.selection.main;
      if (before && this.owner.preferences().fullwidthLinks && !this.view.composing && !state.readOnly && state.selection.ranges.length === 1 && selection.empty) {
        const text = state.doc.toString();
        const count = text.length - before.text.length;
        if (count > 0 && count <= 2 && selection.head === before.from + count &&
          text.slice(0, before.from) === before.text.slice(0, before.from) && text.slice(selection.head) === before.text.slice(before.to)) {
          const edit = bracketEdit(before.text, before.from, before.to, text.slice(before.from, selection.head));
          if (edit) this.view.dispatch({ changes: { from: edit.from, to: edit.to + count, insert: edit.insert },
            selection: { anchor: edit.cursor }, annotations: Transaction.userEvent.of("input.type") });
        }
      }
      this.view.dispatch({ effects: redraw.of(null) });
    };
    this.compositionTimer = setTimeout(finish, 0);
  }
  cancelTimers(): void {
    clearTimeout(this.compositionTimer); clearTimeout(this.pasteTimer); clearTimeout(this.navigationTimer);
  }
  destroy(): void { this.destroyed = true; this.cancelTimers(); this.owner.detach(this); }
}
