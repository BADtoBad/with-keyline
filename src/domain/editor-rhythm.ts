import { markdownTree, parseBlocks, type BlockKind } from "./blocks";
import { flatQuoteContainers } from "./structure-presentation";

export type RhythmRole = "paragraph" | "heading";
export interface RhythmLine { at: number; role: RhythmRole }
export interface RhythmGap { at: number; side: -1 | 1; before?: RhythmRole; after?: RhythmRole; direct?: "paragraph" | "quote" }
export interface EditorRhythm { lines: RhythmLine[]; gaps: RhythmGap[] }
export const MAX_RHYTHM_UNITS = 2 * 1024 * 1024;

/** A presentation-only plan. Structured rows stay atomic; an unprefixed lazy
 * paragraph continuation keeps the ordinary source-line rhythm even when its
 * Markdown owner is a list/quote. Never add editable lines or touch source.
 * The integrated companion treats each ordinary source line (including blank
 * separators) as a paragraph rhythm unit, not each Markdown paragraph node. */
export function editorRhythm(text: string): EditorRhythm {
  const result: EditorRhythm = { lines: [], gaps: [] };
  if (!text.trim() || text.length > MAX_RHYTHM_UNITS) return result;
  const roots = parseBlocks(text).blocks.filter(block => block.parent === null);
  let tree: ReturnType<typeof markdownTree> | undefined;
  type Row = { at: number; kind?: BlockKind; root?: string };
  const quoteRows = new Map<number, Pick<Row, "kind" | "root">>();
  if (text.includes(">")) {
    tree = markdownTree(text);
    for (const container of flatQuoteContainers(tree)) {
      let at = text.lastIndexOf("\n", Math.max(0, container.from - 1)) + 1;
      let start = at, callout = false;
      while (at <= container.to) {
        const newline = text.indexOf("\n", at), end = Math.min(container.to, newline < 0 ? text.length : newline);
        const row = text.slice(at, end), prefix = /^[ \t]*>[ \t]*/u.exec(row);
        if (!prefix || row[prefix[0].length] === ">") {
          // Native nested rows form a boundary, not part of the flat Callout.
          // This is geometry only: no marker hiding or source transformation.
          if (prefix) quoteRows.set(at, {});
          start = newline + 1; callout = false;
        } else {
          const mark = prefix[0].indexOf(">"), spaces = prefix[0].slice(mark + 1);
          const body = spaces.length >= 5 || spaces.includes("\t") ? mark + 1 + (spaces[0] === " " ? 1 : 0) : prefix[0].length;
          if (/^\[![\w-]{1,64}\][+-]?/u.test(row.slice(body))) {
            let opaque = false;
            for (let node = tree.resolveInner(at + body, 1); node.parent; node = node.parent)
              if (/^(?:FencedCode|CodeBlock|HTMLBlock)$/u.test(node.name)) { opaque = true; break; }
            if (!opaque) { start = at; callout = true; }
          }
          quoteRows.set(at, {kind: callout ? "callout" : "quote", root: `quote:${container.from}:${start}`});
        }
        if (newline < 0 || newline >= container.to) break;
        at = newline + 1;
      }
    }
  }
  const rows: Row[] = [];
  let index = 0, at = 0;
  for (const line of text.split("\n")) {
    while (index < roots.length && roots[index].to < at) index++;
    const root = roots[index];
    const inside = root && root.from <= at && at <= root.to;
    let kind = inside ? root.kind : /^\s*$/u.test(line) ? "paragraph" : undefined;
    if (kind === "list" && /^\s*$/u.test(line)) {
      tree ??= markdownTree(text);
      let opaque = false;
      for (let node = tree.resolveInner(at, 1); node.parent; node = node.parent)
        if (/^(?:FencedCode|CodeBlock|HTMLBlock|Keyline(?:Inline)?(?:Math|Comment))$/u.test(node.name)) { opaque = true; break; }
      if (!opaque) kind = "paragraph";
    }
    if (inside && ["list", "quote", "callout"].includes(root.kind) && /^\S/u.test(line) && !line.startsWith(">")) {
      // Source-line presentation is not structural ownership. Confirm a real
      // paragraph/task-text ancestor before treating a lazy image/text row as prose;
      // code/table/opaque descendants must retain their own native spacing.
      tree ??= markdownTree(text);
      for (let node = tree.resolveInner(at, 1); node.parent; node = node.parent) {
        if (/^(?:FencedCode|CodeBlock|HTMLBlock|Keyline(?:Inline)?(?:Math|Comment))$/u.test(node.name)) break;
        if (node.name === "Paragraph" || node.name === "Task") { kind = "paragraph"; break; }
      }
    }
    const quoted = quoteRows.get(at);
    if (quoted) kind = quoted.kind;
    rows.push({ at, kind, root: quoted ? quoted.root : inside ? root.id : undefined });
    if (kind === "paragraph" || kind === "heading") result.lines.push({ at, role: kind });
    at += line.length + 1;
  }
  const edge = (row?: Row): RhythmRole | undefined => row?.kind === "heading" ? "heading"
    : row && ["paragraph", "quote", "callout"].includes(row.kind ?? "") ? "paragraph" : undefined;
  for (let i = 0; i <= rows.length; i++) {
    const previous = rows[i - 1], next = rows[i];
    const gap: RhythmGap = { at: next?.at ?? text.length, side: next ? -1 : 1 };
    if (previous?.kind === "paragraph" && next?.kind === "paragraph") gap.direct = "paragraph";
    else if (previous?.root && previous.root === next?.root && previous.kind === next.kind) {
      if (previous.kind === "quote") gap.direct = "quote";
      else continue;
    } else { gap.before = edge(next); gap.after = edge(previous); }
    if (gap.direct || gap.before || gap.after) result.gaps.push(gap);
  }
  return result;
}
