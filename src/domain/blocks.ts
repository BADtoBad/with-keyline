import { GFM, parser, type BlockParser, type InlineParser } from "@lezer/markdown";
import { convertStructured } from "./conversion";

export type BlockKind = "paragraph" | "heading" | "list" | "item" | "quote" | "callout" | "code" | "table" | "rule" | "html" | "math" | "comment" | "frontmatter" | "reference";
export interface Block {
  id: string; kind: BlockKind; from: number; to: number;
  parent: string | null; children: string[]; depth: number; locked: boolean;
}
export interface Blocks { text: string; blocks: Block[] }
export interface BlockEdit { from: number; to: number; before: string; insert: string; anchor: number; head: number }
type Node = ReturnType<typeof parser.parse>["topNode"];

/** Obsidian-only opaque constructs, including content inside list/quote
 * containers. Such contents remain owned by their enclosing item/quote in the
 * editable block model. The standard parser handles fences,
 * indentation, HTML, lazy continuations and GFM tables. */
const opaque: BlockParser = {
  name: "KeylineOpaque", before: "HorizontalRule",
  parse(cx, line) {
    const root = cx.parentType().name === "Document";
    const text = line.text.slice(line.basePos).replace(/^\uFEFF/u, "").replace(/\s+$/u, "");
    let type: string, close: RegExp;
    if (root && cx.lineStart === 0 && text === "---") { type = "KeylineFrontmatter"; close = /^(?:---|\.\.\.)[ \t]*$/u; }
    else if (/^ {0,3}\$\$/u.test(text)) { type = "KeylineMath"; close = /\$\$[ \t]*$/u; }
    else if (/^ {0,3}%%/u.test(text)) { type = "KeylineComment"; close = /%%[ \t]*$/u; }
    else return false;
    const from = cx.lineStart + (root ? 0 : line.pos), containerIndent = line.baseIndent;
    let to = cx.lineStart + line.text.length;
    const first = type === "KeylineFrontmatter" ? "" : text.replace(/^\s+/u, "").slice(2);
    if (first && close.test(first)) cx.nextLine();
    else while (cx.nextLine()) {
      // Public Line metadata describes the containers retained on this row.
      // Stop before a sibling/outside paragraph instead of swallowing it into
      // an unfinished nested formula or comment. Blank list rows retain base.
      if (line.baseIndent < containerIndent) break;
      to = cx.lineStart + line.text.length;
      if (close.test(line.text.slice(line.basePos).replace(/\r$/u, ""))) { cx.nextLine(); break; }
    }
    cx.addElement(cx.elt(type, from, to));
    return true;
  },
  endLeaf(_cx, line) { return /^ {0,3}(?:\$\$|%%)/u.test(line.text.slice(line.basePos)); }
};
const inlineOpaque: InlineParser = {
  name: "KeylineInlineOpaque", after: "InlineCode",
  parse(cx, next, pos) {
    const comment = next === 37 && cx.char(pos + 1) === 37;
    if (!comment && next !== 36) return -1;
    const width = comment || cx.char(pos + 1) === 36 ? 2 : 1;
    const marker = comment ? "%%" : "$".repeat(width);
    let stop = -1;
    for (let at = pos + width; at + width <= cx.end; at++) {
      if (cx.slice(at, at + width) !== marker) continue;
      let escapes = 0; for (let p = at - 1; p >= pos && cx.char(p) === 92; p--) escapes++;
      if (escapes % 2 === 0) { stop = at + width; break; }
    }
    // An unfinished comment is intentionally opaque. An ordinary unmatched
    // currency symbol is not sufficient evidence of math.
    if (stop < 0 && !comment) return -1;
    return cx.addElement(cx.elt(comment ? "KeylineInlineComment" : "KeylineInlineMath", pos, stop < 0 ? cx.end : stop));
  }
};
const markdown = parser.configure([GFM, {
  defineNodes: [...["KeylineFrontmatter", "KeylineMath", "KeylineComment"].map(name => ({ name, block: true })),
    { name: "KeylineInlineComment" }, { name: "KeylineInlineMath" }],
  parseBlock: [opaque], parseInline: [inlineOpaque]
}]);
/** Shared syntax model. Callers must still check host parser confirmation before
 * changing presentation; this model alone is not Obsidian's rendering truth. */
export function markdownTree(text: string) { return markdown.parse(text); }
export function inProtectedSyntax(text: string, offset: number, end = offset, allowInlineCode = false): boolean {
  if (!Number.isInteger(offset) || !Number.isInteger(end) || offset < 0 || end < offset || end > text.length || text.length > 2 * 1024 * 1024) return true;
  const tree = markdown.parse(text);
  const protectedName = /^(?:FencedCode|CodeBlock|InlineCode|HTMLBlock|HTMLTag|KeylineFrontmatter|Keyline(?:Inline)?Math|Keyline(?:Inline)?Comment)$/u;
  const protectedNode = (name: string) => protectedName.test(name) && !(allowInlineCode && name === "InlineCode");
  let node: Node | null = tree.resolveInner(offset, offset < text.length ? 1 : -1);
  while (node) {
    if (protectedNode(node.name)) return true;
    node = node.parent;
  }
  let found = false;
  if (end > offset) tree.iterate({ from: offset, to: end, enter(node) {
    if (protectedNode(node.name) && node.from < end && node.to > offset) { found = true; return false; }
  } });
  return found;
}
function lineStart(text: string, at: number): number { return text.lastIndexOf("\n", Math.max(0, at - 1)) + 1; }
function endWithoutCR(text: string, at: number): number { return text[at - 1] === "\r" ? at - 1 : at; }
function kind(node: Node, text: string): BlockKind | null {
  if (/^(ATXHeading|SetextHeading)/u.test(node.name)) return "heading";
  if (node.name === "BulletList" || node.name === "OrderedList") return "list";
  if (node.name === "ListItem") return "item";
  if (node.name === "Blockquote") return /^ {0,3}>\s*\[![^\]]+\]/u.test(text.slice(lineStart(text, node.from), node.to)) ? "callout" : "quote";
  const names: Record<string, BlockKind> = {
    Paragraph: "paragraph", FencedCode: "code", CodeBlock: "code", Table: "table",
    HorizontalRule: "rule", HTMLBlock: "html", LinkReference: "reference",
    KeylineFrontmatter: "frontmatter", KeylineMath: "math", KeylineComment: "comment"
  };
  return names[node.name] ?? null;
}
function unclosed(node: Node, source: string): boolean {
  if (node.name === "FencedCode") return node.getChildren("CodeMark").length < 2;
  const lines = source.split(/\r?\n/u);
  if (node.name === "KeylineFrontmatter") return lines.length < 2 || !/^(---|\.\.\.)[ \t]*$/u.test(lines[lines.length - 1]);
  if (node.name === "KeylineMath" || node.name === "KeylineComment") {
    const marker = node.name === "KeylineMath" ? "$$" : "%%";
    return !source.replace(/\s+$/u, "").slice(source.indexOf(marker) + 2).endsWith(marker);
  }
  return false;
}
/** A container with unfinished opaque content is not a safe structural payload. */
export function closedBlockSyntax(node: Node, text: string): boolean {
  if (unclosed(node, text.slice(node.from, node.to))) return false;
  for (let child = node.firstChild; child; child = child.nextSibling)
    if (!closedBlockSyntax(child, text)) return false;
  return true;
}
export function parseBlocks(text: string): Blocks {
  const blocks: Block[] = [], tree = markdown.parse(text);
  const visit = (node: Node, parent: Block | null) => {
    const category = kind(node, text);
    if (!category) return;
    const start = lineStart(text, node.from);
    // Keep ordinary indentation inside the editable range, but never borrow a
    // preceding parent marker on the same physical line ("- - child"). Besides
    // corrupting edit scope, rounding those nodes to the line start gave parent
    // and child identical IDs and could make ancestor traversal cyclic.
    const from = /\S/u.test(text.slice(start, node.from)) ? node.from : start;
    const to = endWithoutCR(text, node.to);
    const item: Block = {
      id: `${from}:${to}:${category}`, kind: category, from, to, parent: parent?.id ?? null,
      children: [], depth: parent ? parent.depth + 1 : 0,
      locked: category === "frontmatter" || unclosed(node, text.slice(from, to))
    };
    blocks.push(item); parent?.children.push(item.id);
    // A whole quote/callout/table/code block is atomic. An item's child list is
    // addressable, but its paragraph/continuations stay with that item.
    if (category === "list" || category === "item") for (let child = node.firstChild; child; child = child.nextSibling) {
      if (category === "list" && child.name === "ListItem" || category === "item" && /^(BulletList|OrderedList)$/u.test(child.name)) visit(child, item);
    }
  };
  let previousRoot: Block | undefined;
  for (let node = tree.topNode.firstChild; node; node = node.nextSibling) {
    // Obsidian permits a standalone block ID after a paragraph/table/list.
    // Keep the anchor with its original block rather than moving it alone.
    if (node.name === "Paragraph" && /^ {0,3}\^[\w-]+[ \t\r]*$/u.test(text.slice(node.from, node.to)) && previousRoot && !previousRoot.locked) {
      const oldId = previousRoot.id;
      previousRoot.to = endWithoutCR(text, node.to);
      previousRoot.id = `${previousRoot.from}:${previousRoot.to}:${previousRoot.kind}`;
      for (const block of blocks) if (block.parent === oldId) block.parent = previousRoot.id;
      continue;
    }
    const count = blocks.length;
    visit(node, null);
    previousRoot = blocks[count];
  }
  return { text, blocks };
}
export function blockAt(model: Blocks, position: number): Block | null {
  if (!Number.isInteger(position) || position < 0 || position > model.text.length) return null;
  return model.blocks.filter(b => b.from <= position && position <= b.to).sort((a, b) => b.depth - a.depth)[0] ?? null;
}
export function siblings(model: Blocks, block: Block): Block[] {
  return model.blocks.filter(b => b.parent === block.parent);
}
/** Resolve only a sibling or a whitespace gap adjacent to that sibling group.
 * Never snap a nested drag onto a distant container just because it is nearest. */
export function siblingDropTarget(model: Blocks, position: number, parent: string | null): Block | null {
  if (!Number.isInteger(position) || position < 0 || position > model.text.length) return null;
  let block = blockAt(model, position);
  while (block && block.parent !== parent) block = model.blocks.find(b => b.id === block!.parent) ?? null;
  if (block) return block;
  const group = model.blocks.filter(b => b.parent === parent);
  if (!group.length) return null;
  const before = [...group].reverse().find(b => b.to <= position), after = group.find(b => b.from >= position);
  if (before && after && /^\s*$/u.test(model.text.slice(before.to, after.from)))
    return position - before.to <= after.from - position ? before : after;
  if (parent === null && !blockAt(model, position)) {
    if (!before && after && /^\s*$/u.test(model.text.slice(position, after.from))) return after;
    if (before && !after && /^\s*$/u.test(model.text.slice(before.to, position))) return before;
  }
  return null;
}
function parentOf(model: Blocks, block: Block): Block | null { return model.blocks.find(b => b.id === block.parent) ?? null; }
export function blockSelection(model: Blocks, from: number, to = from): Block[] {
  if (from > to) [from, to] = [to, from];
  let first = blockAt(model, from), last = blockAt(model, Math.max(from, to - 1));
  if (!first || !last) return [];
  while (first.parent !== last.parent) {
    if (first.depth >= last.depth) first = parentOf(model, first);
    else last = parentOf(model, last);
    if (!first || !last) return [];
  }
  const items = siblings(model, first);
  return items.slice(items.indexOf(first), items.indexOf(last) + 1);
}
const edit = (model: Blocks, from: number, to: number, insert: string, anchor = from, head = anchor): BlockEdit =>
  ({ from, to, before: model.text.slice(from, to), insert, anchor, head });

/** A compact child starts after its parent's marker, not at column zero. */
export function blockPrefixColumns(text: string, from: number): number {
  let width = 0;
  for (const char of text.slice(lineStart(text, from), from)) width += char === "\t" ? 4 - width % 4 : 1;
  return width;
}
/** Move only first-row container indentation between a full row and an inline
 * slot. Continuation/code bytes stay untouched. A partial tab is not sliced. */
export function blockTextInSlot(model: Blocks, block: Block, prefix: number): string | null {
  const text = " ".repeat(blockPrefixColumns(model.text, block.from)) + model.text.slice(block.from, block.to);
  let width = 0, start = 0;
  while (width < prefix && /[ \t]/u.test(text[start] ?? "")) {
    width += text[start++] === "\t" ? 4 - width % 4 : 1;
  }
  return width === prefix ? text.slice(start) : null;
}

/** Move within a parsed sibling group. Do not guess indentation/reparenting.
 * Separators belong to positions; a compact first row borrows its parent's
 * indentation slot. Payload/continuation bytes and sibling ownership survive.
 * Reparse the candidate and reject any change in sibling structure. */
export function moveBlock(model: Blocks, source: Block, target: Block, after: boolean): BlockEdit | null {
  return moveBlocks(model, [source], target, after);
}
function consecutive(model: Blocks, selected: readonly Block[]): Block[] | null {
  const known = new Set(model.blocks);
  if (!selected.length || selected.some(b => b.locked || !known.has(b) || b.parent !== selected[0].parent)) return null;
  const group = siblings(model, selected[0]), positions = new Map(group.map((b, i) => [b, i]));
  const indices = selected.map(b => positions.get(b)!).sort((a, b) => a - b);
  if (indices.some((n, i) => n !== indices[0] + i)) return null;
  return indices.map(i => group[i]);
}
export function moveBlocks(model: Blocks, selected: readonly Block[], target: Block, after: boolean): BlockEdit | null {
  const sources = consecutive(model, selected), source = sources?.[0];
  if (!sources || !source || target.locked || sources.includes(target) || source.parent !== target.parent) return null;
  const group = siblings(model, source);
  if (!group.includes(target)) return null;
  const moving = new Set(sources), ordered = group.filter(b => !moving.has(b));
  ordered.splice(ordered.indexOf(target) + (after ? 1 : 0), 0, ...sources);
  if (ordered.every((b, i) => b === group[i])) return null;
  const begin = group[0].from, end = group[group.length - 1].to;
  let insert = "", anchor = begin, head = begin;
  const rendered: string[] = [];
  for (let i = 0; i < ordered.length; i++) {
    const value = blockTextInSlot(model, ordered[i], blockPrefixColumns(model.text, group[i].from));
    if (value === null) return null;
    rendered.push(value);
    if (ordered[i] === source) anchor = begin + insert.length;
    insert += value;
    if (ordered[i] === sources[sources.length - 1]) head = begin + insert.length;
    if (i < group.length - 1) insert += model.text.slice(group[i].to, group[i + 1].from);
  }
  const candidate = parseBlocks(model.text.slice(0, begin) + insert + model.text.slice(end));
  const moved = candidate.blocks.find(b => b.from === anchor && b.kind === source.kind && b.depth === source.depth);
  if (!moved || candidate.text.slice(moved.from, moved.to) !== rendered[ordered.indexOf(source)]) return null;
  const nextGroup = siblings(candidate, moved);
  if (nextGroup.length !== group.length || nextGroup.some((b, i) => b.kind !== ordered[i].kind ||
    blockTextInSlot(candidate, b, 0) !== blockTextInSlot(model, ordered[i], 0))) return null;
  const parent = parentOf(model, source), nextParent = parentOf(candidate, moved);
  if (parent ? nextParent?.from !== parent.from || nextParent.kind !== parent.kind : nextParent) return null;
  return edit(model, begin, end, insert, anchor, head);
}
export function shiftBlocks(model: Blocks, selected: readonly Block[], direction: -1 | 1): BlockEdit | null {
  const sources = consecutive(model, selected);
  if (!sources) return null;
  const group = siblings(model, sources[0]), edge = direction < 0 ? sources[0] : sources[sources.length - 1];
  const next = group[group.indexOf(edge) + direction];
  return next ? moveBlocks(model, sources, next, direction === 1) : null;
}
export function deleteBlocks(model: Blocks, selected: readonly Block[]): BlockEdit | null {
  const sources = consecutive(model, selected);
  return sources ? edit(model, sources[0].from, sources[sources.length - 1].to, "") : null;
}
export function duplicateBlocks(model: Blocks, selected: readonly Block[]): BlockEdit | null {
  const sources = consecutive(model, selected);
  if (!sources) return null;
  const first = sources[0], last = sources[sources.length - 1], source = model.text.slice(first.from, last.to);
  if (/(?:^|\s)\^[\w-]+[ \t]*(?:\r?$)/mu.test(source) || /^\s*\[\^[^\]]+\]:/mu.test(source)) return null;
  const eol = model.text.includes("\r\n") ? "\r\n" : "\n", gap = first.kind === "item" ? eol : eol + eol;
  const copiedSource = " ".repeat(blockPrefixColumns(model.text, first.from)) + source;
  const insert = gap + copiedSource, anchor = last.to + gap.length;
  const candidate = parseBlocks(model.text.slice(0, last.to) + insert + model.text.slice(last.to));
  const copied = candidate.blocks.find(b => b.from === anchor && b.kind === first.kind && b.depth === first.depth);
  if (!copied) return null;
  const before = siblings(model, first), split = before.indexOf(last) + 1;
  const expected = [...before.slice(0, split), ...sources, ...before.slice(split)];
  const group = siblings(candidate, copied), parent = parentOf(model, first), nextParent = parentOf(candidate, copied);
  if (parent ? nextParent?.from !== parent.from || nextParent.kind !== parent.kind : nextParent) return null;
  if (group.length !== expected.length || group.some((b, i) => b.kind !== expected[i].kind ||
    blockTextInSlot(candidate, b, 0) !== blockTextInSlot(model, expected[i], 0))) return null;
  return edit(model, last.to, last.to, insert, anchor, anchor + copiedSource.length);
}
export function shiftBlock(model: Blocks, block: Block, direction: -1 | 1): BlockEdit | null {
  const group = siblings(model, block), next = group[group.indexOf(block) + direction];
  return next ? moveBlock(model, block, next, direction === 1) : null;
}
export function duplicateBlock(model: Blocks, block: Block): BlockEdit | null {
  return duplicateBlocks(model, [block]);
}
export function deleteBlock(model: Blocks, block: Block): BlockEdit | null {
  if (block.locked || !model.blocks.includes(block)) return null;
  // Keep separators, so deletion cannot join surrounding Markdown constructs.
  return edit(model, block.from, block.to, "");
}
export type Conversion = "paragraph" | "bullet" | "number" | "task" | "quote" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
/** One selected structural layer, with full-document ownership validation. */
export function convertBlock(model: Blocks, block: Block, target: Conversion): BlockEdit | null {
  return convertStructured(model, [block], target);
}
export function convertBlocks(model: Blocks, selected: readonly Block[], target: Conversion): BlockEdit | null {
  return convertStructured(model, selected, target);
}
export function applyBlockEdit(text: string, plan: BlockEdit): string | null {
  if (plan.from < 0 || plan.to < plan.from || plan.to > text.length || text.slice(plan.from, plan.to) !== plan.before) return null;
  return text.slice(0, plan.from) + plan.insert + text.slice(plan.to);
}
