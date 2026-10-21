import { StateEffect, StateField, type EditorState } from "@codemirror/state";
import { Decoration, EditorView, ViewPlugin, WidgetType, type DecorationSet } from "@codemirror/view";
import { editorInfoField, editorLivePreviewField } from "obsidian";
import type { Preferences } from "../domain/preferences";
import { editorRhythm, MAX_RHYTHM_UNITS, type RhythmGap } from "../domain/editor-rhythm";

const measureRhythm = StateEffect.define<null>();
class RhythmWidget extends WidgetType {
  constructor(private gap: RhythmGap, private preview: boolean) { super(); }
  eq(other: RhythmWidget): boolean {
    return this.preview === other.preview && this.gap.before === other.gap.before &&
      this.gap.after === other.gap.after && this.gap.direct === other.gap.direct;
  }
  toDOM(view: EditorView): HTMLElement {
    const element = view.dom.ownerDocument.createElement("div");
    element.className = "keyline-next-rhythm-gap";
    element.setAttribute("aria-hidden", "true");
    const token = (role?: string, side?: string) => role ? `var(--keyline-next-${role}${side}, 0px)` : "0px";
    element.style.height = this.gap.direct === "paragraph" ? token("paragraph", "Gap")
      : this.gap.direct === "quote" ? this.preview ? "var(--ncl-quote-line-gap, 10px)" : "0px"
      : `max(${token(this.gap.before, "Before")}, ${token(this.gap.after, "After")})`;
    return element;
  }
  ignoreEvent(): boolean { return true; }
}

/** Vertical block widgets must be provided by a StateField, not a viewport
 * ViewPlugin. This lets CodeMirror include the extra space in cursor geometry
 * without adding margins to editable lines or mutating document/history. */
export class EditorRhythmController {
  private views = new Map<EditorView, { document: Document; window: Window; id: number } | null>();
  private active = true;
  constructor(private preferences: () => Preferences) {}
  extension() {
    const owner = this;
    const build = (state: EditorState): DecorationSet => {
      if (!owner.active || !owner.preferences().typographyEnabled ||
        !state.field(editorInfoField, false)?.file || state.doc.length > MAX_RHYTHM_UNITS) return Decoration.none;
      const plan = editorRhythm(state.doc.toString());
      const preview = !!state.field(editorLivePreviewField, false);
      return Decoration.set([
        ...plan.lines.map(line => Decoration.line({ class: `keyline-next-rhythm-${line.role}` }).range(line.at)),
        ...plan.gaps.map(gap => Decoration.widget({ widget: new RhythmWidget(gap, preview), block: true, side: gap.side }).range(gap.at))
      ], true);
    };
    const field = StateField.define<DecorationSet>({
      create: build,
      update(value, transaction) {
        return transaction.docChanged || transaction.effects.some(effect => effect.is(measureRhythm)) ||
          transaction.startState.field(editorInfoField, false)?.file !== transaction.state.field(editorInfoField, false)?.file ||
          transaction.startState.field(editorLivePreviewField, false) !== transaction.state.field(editorLivePreviewField, false)
          ? build(transaction.state) : value;
      },
      provide: field => EditorView.decorations.from(field)
    });
    return [field, ViewPlugin.define(view => {
      let document = view.dom.ownerDocument;
      owner.views.set(view, null);
      return {
        update() {
          if (document !== view.dom.ownerDocument) {
            document = view.dom.ownerDocument; owner.schedule(view);
          }
        },
        destroy() { owner.detach(view); }
      };
    })];
  }
  private detach(view: EditorView): void {
    const frame = this.views.get(view);
    if (frame) frame.window.cancelAnimationFrame(frame.id);
    this.views.delete(view);
  }
  refresh(): void {
    if (!this.active) return;
    for (const view of this.views.keys()) this.schedule(view);
  }
  private schedule(view: EditorView): void {
    if (!this.active || !this.views.has(view)) return;
    const document = view.dom.ownerDocument, win = document.defaultView, pending = this.views.get(view);
    if (pending?.document === document) return;
    if (pending) pending.window.cancelAnimationFrame(pending.id);
    this.views.set(view, null);
    if (!win) return;
    const frame = { document, window: win, id: 0 };
    this.views.set(view, frame);
    frame.id = win.requestAnimationFrame(() => {
      if (!this.active || this.views.get(view) !== frame) return;
      this.views.set(view, null);
      if (view.dom.ownerDocument !== document) { this.schedule(view); return; }
      view.dispatch({ effects: measureRhythm.of(null) });
      view.requestMeasure();
    });
  }
  dispose(): void {
    this.active = false;
    for (const view of this.views.keys()) this.detach(view);
  }
}
