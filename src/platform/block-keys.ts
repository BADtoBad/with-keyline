import { Prec, Transaction } from "@codemirror/state";
import { keymap, type EditorView } from "@codemirror/view";
import { editorInfoField } from "obsidian";
import { parseBlocks, type Blocks } from "../domain/blocks";
import { backspaceBlock, expandBlockSelection } from "../domain/block-keys";
import type { Preferences } from "../domain/preferences";

export class BlockKeys {
  private live = true;
  private cache = new WeakMap<EditorView, Blocks>();
  constructor(private preferences: () => Preferences) {}
  private model(view: EditorView): Blocks | null {
    if (!this.live || !this.preferences().blockKeys || !view.hasFocus || view.composing || view.state.readOnly ||
      view.state.doc.length > 2 * 1024 * 1024 || view.state.selection.ranges.length !== 1 ||
      !view.state.field(editorInfoField, false)?.file) return null;
    const text = view.state.doc.toString(), cached = this.cache.get(view);
    if (cached?.text === text) return cached;
    const model = parseBlocks(text); this.cache.set(view, model); return model;
  }
  extension() {
    return Prec.highest(keymap.of([
      { key: "Mod-a", run: view => {
        const model = this.model(view), range = view.state.selection.main;
        const selection = model && expandBlockSelection(model, range.from, range.to);
        if (!selection) return false;
        view.dispatch({ selection, scrollIntoView: true, annotations: Transaction.userEvent.of("select") });
        return true;
      } },
      { key: "Backspace", run: view => {
        if (!view.state.selection.main.empty) return false;
        const model = this.model(view), edit = model && backspaceBlock(model, view.state.selection.main.head);
        if (!edit) return false;
        view.dispatch({ changes: { from: edit.from, to: edit.to, insert: edit.insert },
          selection: { anchor: edit.anchor }, scrollIntoView: true, annotations: Transaction.userEvent.of("delete.backward") });
        return true;
      } }
    ]));
  }
  dispose(): void { this.live = false; this.cache = new WeakMap(); }
}
