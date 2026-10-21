import { Notice, TFile, type App, type Editor, type EditorPosition, type EditorSuggestContext, type EditorSuggestTriggerInfo } from "obsidian";
import { dateChoices, insideFence, mentionAt, mentionSessionAt, protectedOffset, safeWikiTarget, suggestions, type MentionChoice } from "../domain/mentions";
import { message } from "../strings";
import { formattedDates } from "./dates";
import type { InsertPreferences } from "../domain/insertion";

/** Validated source/commit adapter. Not registered as a native EditorSuggest:
 * native preselection would turn a plain Enter after @ into an unwanted edit. */
export class DatePageSuggest {
  context: EditorSuggestContext | null = null;
  constructor(private readonly app: App, private readonly enabled: () => boolean, private readonly zh: () => boolean, private readonly composing: () => boolean, private readonly preferences?: () => InsertPreferences) {}
  close(): void { this.context = null; }
  onTrigger(cursor: EditorPosition, editor: Editor, file: TFile | null, previewComposition = false): EditorSuggestTriggerInfo | null {
    // Only an already-owned menu may request a read-only composition preview.
    // Creation and insertion retain the normal composing guard.
    if (!this.enabled() || (!previewComposition && this.composing()) || editor.somethingSelected() || editor.listSelections().length !== 1) return null;
    const hit = mentionAt(editor.getLine(cursor.line), cursor.ch);
    if (!hit) return null;
    if (file) {
      const cache = this.app.metadataCache.getFileCache(file);
      const protectedRanges = (cache?.sections ?? []).filter(s => ["code", "yaml"].includes(s.type)).map(s => ({ start: s.position.start.offset, end: s.position.end.offset }));
      if (cache?.frontmatterPosition) protectedRanges.push({ start: cache.frontmatterPosition.start.offset, end: cache.frontmatterPosition.end.offset });
      if (protectedOffset(editor.posToOffset(cursor), protectedRanges)) return null;
    }
    const lines = Array.from({ length: cursor.line + 1 }, (_, n) => editor.getLine(n));
    if (lines[0] === "---" && !lines.slice(1).some(line => /^(---|\.\.\.)\s*$/u.test(line))) return null;
    if (insideFence(lines)) return null;
    return { start: { line: cursor.line, ch: hit.start }, end: cursor, query: hit.query };
  }
  getSuggestions(context: EditorSuggestContext): MentionChoice[] {
    const now = new Date(), choices = dateChoices(now, this.zh());
    if (this.preferences) {
      const values = formattedDates(this.preferences(), this.zh(), now);
      for (const choice of choices) choice.insert = values[choice.key === "now" ? "time" : choice.key];
    }
    return suggestions(context.query, this.app.vault.getMarkdownFiles().map(f => ({ path: f.path, name: f.basename, modified: f.stat?.mtime })), now, this.zh(), choices);
  }
  onSession(cursor: EditorPosition, editor: Editor, start: EditorPosition, previewComposition = false): EditorSuggestTriggerInfo | null {
    if (!this.enabled() || (!previewComposition && this.composing()) || editor.somethingSelected() || editor.listSelections().length !== 1 || cursor.line !== start.line) return null;
    const hit = mentionSessionAt(editor.getLine(cursor.line), cursor.ch, start.ch);
    return hit ? { start, end: cursor, query: hit.query } : null;
  }
  selectSuggestion(choice: MentionChoice): void {
    const context = this.context;
    if (!context || !this.enabled() || this.composing()) return;
    const { editor, start, end } = context;
    const cursor = editor.getCursor();
    // Revalidate the trigger's original source context, not the query's words
    // or punctuation. A stale range that became code must not be edited.
    const origin = this.onTrigger({ line: start.line, ch: start.ch + 1 }, editor, context.file);
    if (!origin || !this.onSession(cursor, editor, start) || cursor.line !== end.line || cursor.ch !== end.ch || editor.getRange(start, end) !== "@" + context.query) {
      new Notice(message("stale", this.zh()));
      this.close(); return;
    }
    let replacement = choice.kind === "date" ? choice.insert : "";
    if (choice.kind === "page") {
      const file = this.app.vault.getAbstractFileByPath(choice.path);
      if (!(file instanceof TFile)) { new Notice(message("missing", this.zh())); this.close(); return; }
      // Use Obsidian's path resolver to disambiguate same-named pages.
      const link = this.app.metadataCache.fileToLinktext(file, context.file?.path ?? "", true);
      if (!safeWikiTarget(link)) { new Notice(message("unsafeLink", this.zh())); this.close(); return; }
      replacement = `[[${link}]]`;
    }
    editor.replaceRange(replacement, start, end, "keyline-next-mention");
    editor.setCursor({ line: start.line, ch: start.ch + replacement.length });
    this.close();
  }
}
