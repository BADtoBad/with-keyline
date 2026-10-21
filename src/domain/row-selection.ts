/** Physical editor rows, not parsed Markdown blocks. Wrapped visual rows stay
 * one line, and a selection ending at a newline includes the following row. */
export interface RowDocument {
  length: number;
  lineAt(position: number): { from: number; to: number };
}
export interface DirectedRange { anchor: number; head: number }
export interface OffsetSpan { from: number; to: number }
export const MAX_SELECTION_DOCUMENT = 2 * 1024 * 1024;

export function wholeRows(doc: RowDocument, range: DirectedRange): DirectedRange {
  const { anchor, head } = range;
  if (!Number.isInteger(anchor) || !Number.isInteger(head) || Math.min(anchor, head) < 0 ||
    Math.max(anchor, head) > doc.length || doc.length > MAX_SELECTION_DOCUMENT) return range;
  const a = doc.lineAt(anchor), h = doc.lineAt(head);
  if (a.from === h.from) return range;
  return anchor < head ? { anchor: a.from, head: h.to } : { anchor: a.to, head: h.from };
}

/** Only create decorations for visible rows. No document string, Markdown
 * parse or O(document-size) walk is needed on each pointer movement. */
export function selectedRowStarts(doc: RowDocument, ranges: readonly DirectedRange[], visible: readonly OffsetSpan[]): number[] {
  if (doc.length > MAX_SELECTION_DOCUMENT) return [];
  const result = new Set<number>();
  for (const range of ranges) {
    const expanded = wholeRows(doc, range);
    if (expanded === range) continue;
    const from = Math.min(expanded.anchor, expanded.head), to = Math.max(expanded.anchor, expanded.head);
    for (const window of visible) {
      const left = Math.max(0, from, window.from), right = Math.min(doc.length, to, window.to);
      if (left > right) continue;
      let row = doc.lineAt(left);
      while (row.from <= right) {
        result.add(row.from);
        if (row.to >= right || row.to === doc.length) break;
        row = doc.lineAt(row.to + 1);
      }
    }
  }
  return [...result].sort((a, b) => a - b);
}
