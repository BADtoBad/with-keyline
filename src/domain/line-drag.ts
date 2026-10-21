import { blockSelection, markdownTree, parseBlocks, type Block, type BlockEdit, type Blocks } from "./blocks";
import { relocateBlocks, type Placement } from "./relocation";

export interface SourceLine { from: number; to: number; text: string; ending: string }
export interface LineDocument { text: string; lines: SourceLine[] }
export interface LineRange { first: number; last: number }
const limit = 2 * 1024 * 1024;
const parsed = new WeakMap<LineDocument, Blocks>();
const baselines = new WeakMap<LineDocument, ReturnType<typeof structure>>();
function blocks(model: LineDocument): Blocks {
  let value = parsed.get(model);
  if (!value) { value = parseBlocks(model.text); parsed.set(model, value); }
  return value;
}
function locked(model: LineDocument, first: number, last: number): boolean {
  const start = model.lines[first].from, end = model.lines[last].to;
  return blocks(model).blocks.some(b => b.locked && b.from <= end && b.to >= start);
}

/** Logical Markdown lines, not visual wrapped rows. Newline bytes remain at
 * their existing positions; moving a line never normalises LF/CRLF. */
export function lineDocument(text: string): LineDocument {
  const lines: SourceLine[] = [];
  let from = 0;
  while (true) {
    const lf = text.indexOf("\n", from), end = lf < 0 ? text.length : lf;
    const to = lf >= 0 && text[end - 1] === "\r" ? end - 1 : end;
    lines.push({ from, to, text: text.slice(from, to), ending: text.slice(to, lf < 0 ? end : lf + 1) });
    if (lf < 0) break;
    from = lf + 1;
  }
  return { text, lines };
}
export function lineIndex(model: LineDocument, position: number): number {
  if (!Number.isInteger(position) || position < 0 || position > model.text.length) return -1;
  let low = 0, high = model.lines.length;
  while (low + 1 < high) {
    const mid = (low + high) >>> 1;
    if (model.lines[mid].from <= position) low = mid; else high = mid;
  }
  return low;
}
export function lineDragRange(model: LineDocument, position: number, selection?: { from: number; to: number }): LineRange | null {
  const at = lineIndex(model, position);
  if (at < 0 || model.text.length > limit) return null;
  let first = at, last = at;
  if (selection && selection.from !== selection.to) {
    const from = Math.min(selection.from, selection.to), to = Math.max(selection.from, selection.to);
    const start = lineIndex(model, from), end = lineIndex(model, Math.max(from, to - 1));
    if (start < 0 || lineIndex(model, to) < 0) return null;
    if (start < end && start <= at && at <= end) { first = start; last = end; }
  }
  // An unterminated construct and Properties are not a draggable text surface.
  if (locked(model, first, last)) return null;
  return { first, last };
}

/** Stable line IDs let us compare semantic ownership after a reorder. Prose
 * lines may join/split paragraphs; list children must retain their parent item,
 * code bodies their fence, and table rows their header. Immutable multiline
 * syntax (including inline spans and block IDs) must travel intact and ordered. */
function structure(model: LineDocument, ids: readonly number[]): { roles: string[]; groups: string[] } {
  const roles = model.lines.map(() => [] as string[]), groups: string[] = [];
  const tree = markdownTree(model.text);
  const scope = (from: number, to: number, role: string) => {
    for (let i = from; i <= to; i++) roles[i].push(role);
  };
  tree.iterate({ enter(node) {
    if (node.name === "Document") return;
    const first = lineIndex(model, node.from), last = lineIndex(model, Math.max(node.from, node.to - 1));
    const name = node.name, identity = `${ids[first]}:${ids[last]}`;
    if (name === "ListItem") scope(first, last, `item:${ids[first]}`);
    else if (/^(BulletList|OrderedList)$/u.test(name)) scope(first, last, name);
    else if (name === "Blockquote") {
      const callout = /^(?:[ \t]*>[ \t]*)+\[![^\]]+\]/u.test(model.lines[first].text);
      scope(first, last, callout ? `callout:${ids[first]}` : "quote");
    } else if (name === "FencedCode") scope(first, last, `fence:${identity}`);
    else if (name === "Table") scope(first, last, `table:${ids[first]}`);
    else if (/^(Paragraph|ATXHeading\d|SetextHeading\d|HorizontalRule|CodeBlock|HTMLBlock|KeylineFrontmatter|KeylineMath|KeylineComment|LinkReference|TableHeader|TableDelimiter|TableRow|CodeMark)$/u.test(name)) {
      scope(first, last, name);
    }
    const atomic = /^(SetextHeading\d|HTMLBlock|KeylineFrontmatter|KeylineMath|KeylineComment|LinkReference)$/u.test(name);
    const inline = /^(Emphasis|StrongEmphasis|Strikethrough|Link|Image|InlineCode|KeylineInlineMath|KeylineInlineComment)$/u.test(name);
    if (atomic || inline && first !== last) {
      groups.push(`${name}:${ids.slice(first, last + 1).join(",")}:${model.text.slice(node.from, node.to)}`);
    }
    // Lezer does not establish paired raw-HTML ownership or Obsidian's
    // cross-line ==highlight== spans. Keep that containing paragraph intact
    // instead of treating a newly unwrapped line as unchanged plain prose.
    if (name === "Paragraph" && first !== last &&
      /==[\s\S]*\n[\s\S]*==|<\/?[A-Za-z][^>]*>/u.test(model.text.slice(node.from, node.to))) {
      groups.push(`opaque-paragraph:${ids.slice(first, last + 1).join(",")}:${model.text.slice(node.from, node.to)}`);
    }
  } });
  for (const block of blocks(model).blocks) {
    if (!/(?:^|[ \t\n])\^[\w-]+[ \t]*$/u.test(model.text.slice(block.from, block.to))) continue;
    const first = lineIndex(model, block.from), last = lineIndex(model, block.to);
    groups.push(`anchor:${ids.slice(first, last + 1).join(",")}:${model.text.slice(block.from, block.to)}`);
  }
  return { roles: roles.map(parts => parts.join("/")), groups: groups.sort() };
}
export function relocateLines(model: LineDocument, source: LineRange, target: number, after: boolean): BlockEdit | null {
  const { first, last } = source, { lines, text } = model;
  if (text.length > limit || ![first, last, target].every(Number.isInteger) || first < 0 || last < first ||
    last >= lines.length || target < 0 || target >= lines.length || target >= first && target <= last) return null;
  if (locked(model, first, last)) return null;
  const boundary = target + Number(after);
  if (boundary === first || boundary === last + 1) return null;
  const ids = lines.map((_, i) => i), moving = ids.slice(first, last + 1), order = ids.filter(i => i < first || i > last);
  order.splice(boundary > last ? boundary - moving.length : boundary, 0, ...moving);
  const candidateText = order.map((id, index) => lines[id].text + lines[index].ending).join("");
  if (candidateText === text) return null;
  const candidate = lineDocument(candidateText);
  const originalStructure = baselines.get(model) ?? structure(model, ids);
  baselines.set(model, originalStructure);
  const nextStructure = structure(candidate, order);
  if (order.some((id, index) => originalStructure.roles[id] !== nextStructure.roles[index]) ||
    originalStructure.groups.length !== nextStructure.groups.length ||
    originalStructure.groups.some((group, i) => group !== nextStructure.groups[i])) return null;
  const start = Math.min(first, target), end = Math.max(last, target), movedAt = order.indexOf(first);
  return {
    from: lines[start].from, to: lines[end].to, before: text.slice(lines[start].from, lines[end].to),
    insert: candidateText.slice(candidate.lines[start].from, candidate.lines[end].to),
    anchor: candidate.lines[movedAt].from, head: candidate.lines[movedAt + moving.length - 1].to
  };
}

/** Horizontal intent may reparent an exact complete block/selection. Never
 * expand a line source to include unselected children or paragraph neighbours. */
export function relocateLineBlocks(model: LineDocument, source: LineRange, target: Block, placement: Placement): BlockEdit | null {
  if (model.text.length > limit || !Number.isInteger(source.first) || !Number.isInteger(source.last) ||
    source.first < 0 || source.last < source.first || source.last >= model.lines.length) return null;
  const parsed = blocks(model), from = model.lines[source.first].from, to = model.lines[source.last].to;
  const selected = blockSelection(parsed, from, to), resolved = parsed.blocks.find(b => b.id === target.id);
  if (!resolved || !selected.length || selected[0].from !== from || selected[selected.length - 1].to !== to) return null;
  return relocateBlocks(parsed, selected, resolved, placement);
}
