import type { Editor } from "obsidian";
import { lineDocument, lineDragRange, type LineDocument, type LineRange } from "../domain/line-drag";
import type { EditContext } from "./block-commands";

export interface LineContext extends EditContext { model: LineDocument; range: LineRange }
const cache = new WeakMap<Editor, LineDocument>();
export function captureLineDrag(editor: Editor, at: number, includeSelection: boolean, guard: () => boolean): LineContext | null {
  if (!guard() || editor.listSelections().length !== 1) return null;
  const text = editor.getValue();
  if (text.length > 2 * 1024 * 1024) return null;
  let model = cache.get(editor);
  if (!model || model.text !== text) { model = lineDocument(text); cache.set(editor, model); }
  const from = editor.posToOffset(editor.getCursor("from")), to = editor.posToOffset(editor.getCursor("to"));
  const range = lineDragRange(model, at, includeSelection ? { from, to } : undefined);
  return range ? { editor, model, range, valid: () => guard() && editor.getValue() === text &&
    editor.listSelections().length === 1 && editor.posToOffset(editor.getCursor("from")) === from &&
    editor.posToOffset(editor.getCursor("to")) === to } : null;
}
