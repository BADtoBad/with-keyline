import { Notice, SuggestModal, type App, type Editor } from "obsidian";
import { inlineEdit, type InlineStyle } from "../domain/format";
import { message } from "../strings";

export const inlineStyles: InlineStyle[] = ["bold", "italic", "strike", "highlight", "code"];
export function formatSelection(editor: Editor, style: InlineStyle): boolean {
  if (editor.listSelections().length !== 1) return false;
  const start = editor.getCursor("from"), end = editor.getCursor("to");
  const edit = inlineEdit(editor.getRange(start, end), style);
  if (!edit || start.line !== end.line) return false;
  editor.replaceRange(edit.text, start, end, "keyline-next-format");
  editor.setSelection({ line: start.line, ch: start.ch + edit.selectionStart }, { line: start.line, ch: start.ch + edit.selectionEnd });
  return true;
}

export class FormatPicker extends SuggestModal<InlineStyle> {
  private readonly selected: string;
  private readonly start;
  private readonly end;
  constructor(app: App, private readonly editor: Editor, private readonly zh: boolean) {
    super(app);
    this.start = editor.getCursor("from"); this.end = editor.getCursor("to");
    this.selected = editor.getRange(this.start, this.end);
    this.setPlaceholder(message("format", zh));
  }
  getSuggestions(query: string): InlineStyle[] {
    return inlineStyles.filter(s => message(s, this.zh).toLowerCase().includes(query.toLowerCase()) || s.includes(query.toLowerCase()));
  }
  renderSuggestion(style: InlineStyle, el: HTMLElement): void { el.setText(message(style, this.zh)); }
  onChooseSuggestion(style: InlineStyle): void {
    const start = this.editor.getCursor("from"), end = this.editor.getCursor("to");
    if (start.line !== this.start.line || start.ch !== this.start.ch || end.line !== this.end.line || end.ch !== this.end.ch || this.editor.getRange(start, end) !== this.selected) {
      new Notice(message("stale", this.zh)); return;
    }
    if (!formatSelection(this.editor, style)) new Notice(message("selectedText", this.zh));
  }
}
