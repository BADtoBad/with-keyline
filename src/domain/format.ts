export type InlineStyle = "bold" | "italic" | "strike" | "highlight" | "code";
export interface TextEdit { text: string; selectionStart: number; selectionEnd: number }

/** One replacement = one host undo transaction. No document-global edits. */
export function inlineEdit(text: string, style: InlineStyle): TextEdit | null {
  if (!text || /[\r\n]/u.test(text)) return null;
  const leading = /^\s*/u.exec(text)![0].length;
  const trailing = /\s*$/u.exec(text)![0].length;
  const content = text.slice(leading, text.length - trailing);
  if (!content) return null;
  const marks = { bold: "**", italic: "*", strike: "~~", highlight: "==", code: "`" };
  const token = marks[style];
  let replacement: string;
  if (style === "code") {
    // Choose a longer delimiter than any backtick run in the selected text.
    const runs = content.match(/`+/gu) ?? [];
    const fence = "`".repeat(Math.max(0, ...runs.map(r => r.length)) + 1);
    const padded = content.startsWith("`") || content.endsWith("`");
    replacement = fence + (padded ? " " : "") + content + (padded ? " " : "") + fence;
  } else if (content.startsWith(token) && content.endsWith(token) && content.length > 2 * token.length &&
    !(style === "italic" && (content.startsWith("**") || content.endsWith("**")))) {
    replacement = content.slice(token.length, -token.length);
  } else replacement = token + content + token;
  const result = text.slice(0, leading) + replacement + (trailing ? text.slice(-trailing) : "");
  return { text: result, selectionStart: leading, selectionEnd: leading + replacement.length };
}
