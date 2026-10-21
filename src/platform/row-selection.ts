import { EditorSelection, EditorState, StateEffect } from "@codemirror/state";
import { Decoration, EditorView, ViewPlugin, type DecorationSet, type ViewUpdate } from "@codemirror/view";
import { editorInfoField } from "obsidian";
import { MAX_SELECTION_DOCUMENT, selectedRowStarts, wholeRows } from "../domain/row-selection";
import type { Preferences } from "../domain/preferences";

const repaint = StateEffect.define<null>();
class RowPaint {
  decorations: DecorationSet = Decoration.none;
  theme = false;
  private document: Document;
  constructor(readonly view: EditorView, private owner: RowSelection) {
    this.document = view.dom.ownerDocument;
    owner.views.add(this); this.refresh();
  }
  refresh(): void {
    const { view } = this;
    this.document = view.dom.ownerDocument;
    this.theme = view.dom.ownerDocument.defaultView?.getComputedStyle(view.dom).getPropertyValue("--ncl-shell-controls").trim() === "1";
    this.build();
  }
  private build(): void {
    const { view } = this;
    const rows = this.owner.enabled && view.state.field(editorInfoField, false)?.file
      ? selectedRowStarts(view.state.doc, view.state.selection.ranges, view.visibleRanges) : [];
    this.decorations = Decoration.set(rows.map(at => Decoration.line({ class: "keyline-next-selected-row" }).range(at)));
  }
  update(update: ViewUpdate): void {
    if (this.document !== this.view.dom.ownerDocument) { this.owner.cancelFrame(this.view); this.refresh(); }
    else if (update.transactions.some(tr => tr.effects.some(e => e.is(repaint)))) this.refresh();
    else if (update.docChanged || update.selectionSet || update.viewportChanged ||
      update.startState.field(editorInfoField, false)?.file !== update.state.field(editorInfoField, false)?.file) this.build();
  }
  destroy(): void { this.owner.detach(this); }
}

/** Paint is independent of snapping. Only native pointer selection events in
 * the focused Markdown editor may expand; keyboard/programmatic/IME edits and
 * transactions containing changes always retain their exact native ranges. */
export class RowSelection {
  active = true;
  readonly views = new Set<RowPaint>();
  private frames = new Map<EditorView, { document: Document; window: Window; id: number }>();
  constructor(private preferences: () => Preferences) {}
  get enabled(): boolean { return this.active && this.preferences().editingEnabled; }
  extension() {
    const owner = this;
    const plugin = ViewPlugin.define(view => new RowPaint(view, owner), {
      decorations: instance => instance.decorations,
      provide: plugin => EditorView.editorAttributes.of(view => {
        const instance = view.plugin(plugin);
        return instance?.decorations.size ? { class: `keyline-next-row-selection${instance.theme ? " keyline-next-themed-row-selection" : ""}` } : null;
      })
    });
    return [plugin, EditorState.transactionFilter.of(transaction => {
      if (!owner.enabled || !owner.preferences().snapSelection || !transaction.selection || transaction.docChanged ||
        !transaction.isUserEvent("select.pointer") || transaction.startState.readOnly ||
        !transaction.startState.field(editorInfoField, false)?.file || transaction.newDoc.length > MAX_SELECTION_DOCUMENT ||
        ![...owner.views].some(({ view }) => view.state === transaction.startState && view.hasFocus && !view.composing)) return transaction;
      const ranges = transaction.newSelection.ranges.map(range => {
        const next = wholeRows(transaction.newDoc, range);
        return next === range ? range : EditorSelection.range(next.anchor, next.head);
      });
      if (ranges.every((range, i) => range.eq(transaction.newSelection.ranges[i]))) return transaction;
      return [transaction, { selection: EditorSelection.create(ranges, transaction.newSelection.mainIndex), sequential: true }];
    })];
  }
  refresh(): void {
    if (!this.active) return;
    for (const { view } of this.views) this.schedule(view);
  }
  private schedule(view: EditorView): void {
    const doc = view.dom.ownerDocument, win = doc.defaultView, previous = this.frames.get(view);
    if (previous?.document === doc) return;
    this.cancelFrame(view);
    if (!win) return;
    const frame = { document: doc, window: win, id: 0 };
    this.frames.set(view, frame);
    frame.id = win.requestAnimationFrame(() => {
      // A callback already queued by an old window must not clear a newer one.
      if (this.frames.get(view) !== frame) return;
      this.frames.delete(view);
      if (!this.active || ![...this.views].some(item => item.view === view)) return;
      if (view.dom.ownerDocument !== doc) { this.schedule(view); return; }
      view.dispatch({ effects: repaint.of(null) });
    });
  }
  cancelFrame(view: EditorView): void {
    const frame = this.frames.get(view);
    if (frame) frame.window.cancelAnimationFrame(frame.id);
    this.frames.delete(view);
  }
  detach(instance: RowPaint): void {
    this.cancelFrame(instance.view); this.views.delete(instance);
  }
  dispose(): void {
    this.active = false;
    for (const view of this.frames.keys()) this.cancelFrame(view);
    this.frames.clear(); this.views.clear();
  }
}
