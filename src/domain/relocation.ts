import { markdownTree, parseBlocks, siblings, moveBlocks, closedBlockSyntax, blockPrefixColumns, blockTextInSlot, type Block, type Blocks, type BlockEdit } from "./blocks";

export type Placement = "before" | "after" | "inside" | "root-before" | "root-after";
type Node = ReturnType<typeof markdownTree>["topNode"];
type Marker = { indent: number; mark: string; width: number; body: string };
const rootNames: Record<string, RegExp> = {
  paragraph: /^Paragraph$/u, heading: /^(?:ATX|Setext)Heading/u, list: /^(?:Bullet|Ordered)List$/u,
  item: /^ListItem$/u, quote: /^Blockquote$/u, callout: /^Blockquote$/u, code: /^(?:FencedCode|CodeBlock)$/u,
  table: /^Table$/u, rule: /^HorizontalRule$/u, html: /^HTMLBlock$/u, math: /^KeylineMath$/u,
  comment: /^KeylineComment$/u, frontmatter: /^KeylineFrontmatter$/u, reference: /^LinkReference$/u
};
function columns(white: string): number {
  let col = 0;
  for (const ch of white) col += ch === "\t" ? 4 - col % 4 : 1;
  return col;
}
/** Remove indentation in visual columns, never slice a character from content. */
function trimIndent(line: string, count: number): string {
  let width = 0, end = 0;
  while (end < line.length && width < count && /[ \t]/u.test(line[end])) {
    width += line[end++] === "\t" ? 4 - width % 4 : 1;
  }
  return " ".repeat(Math.max(0, width - count)) + line.slice(end);
}
function marker(source: string): Marker | null {
  const match = /^([ \t]*)([-+*]|\d+[.)])([ \t]+)([^\r\n]*)/u.exec(source);
  if (!match) return null;
  return { indent: columns(match[1]), mark: match[2],
    width: columns(match[1] + match[2] + match[3]) - columns(match[1]), body: match[4] };
}
function syntax(tree: Node, text: string, block: Block): Node | null {
  const firstLineEnd = text.indexOf("\n", block.from);
  const limit = firstLineEnd < 0 ? block.to : Math.min(block.to, firstLineEnd);
  const walk = (node: Node): Node | null => {
    if (node.to < block.from || node.from > limit) return null;
    if (node.from >= block.from && node.to <= block.to + Number(text[block.to] === "\r") &&
      rootNames[block.kind].test(node.name)) return node;
    for (let child = node.firstChild; child; child = child.nextSibling) { const found = walk(child); if (found) return found; }
    return null;
  };
  return walk(tree);
}
/** Both syntax shape and exact relative text must survive. In particular,
 * whitespace inside code is content, not disposable formatting. */
function signature(node: Node, text: string, base: number): unknown {
  const lines = text.slice(node.from, node.to).replace(/\r$/u, "").split(/\r?\n/u);
  const relative = lines.map((line, i) => i ? trimIndent(line, base) : line).join("\n");
  const children: unknown[] = [];
  // Lezer can split CodeText around list indentation and blank lines. The
  // parent fence's exact relative text already proves code whitespace/content.
  for (let child = node.firstChild; child; child = child.nextSibling)
    if (!(node.name === "FencedCode" && child.name === "CodeText")) children.push(signature(child, text, base));
  return [node.name, relative, children];
}
function contentSignature(node: Node, text: string, base: number, end: number): string | null {
  const content: unknown[] = [];
  // Root detached IDs sit after the syntax node. Once nested, Obsidian owns
  // that same ID on the newly created item, whose final paragraph contains it.
  // Compare the exact payload and ID separately, never ignore arbitrary tails.
  const tail = text.slice(node.to, end);
  const outside = /^(?:[ \t\r]*\n)+[ \t]*(\^[\w-]+)[ \t\r]*$/u.exec(tail);
  let anchor = outside?.[1] ?? null;
  if (tail && !outside) return null;
  const last = node.lastChild;
  const inside = node.name === 'ListItem' && last?.name === 'Paragraph' &&
    /^\^[\w-]+[ \t\r]*$/u.test(text.slice(last.from, last.to)) ? last : null;
  if (inside) anchor = text.slice(inside.from, inside.to).trim();
  if (node.name === "ListItem") {
    for (let child = node.firstChild; child; child = child.nextSibling)
      if (child.name !== "ListMark" && child.from !== inside?.from) content.push(signature(child, text, base));
  } else content.push(signature(node, text, base));
  return JSON.stringify([content, anchor]);
}
function ancestors(model: Blocks, block: Block | undefined): Block[] {
  const result: Block[] = [];
  while (block?.parent) {
    block = model.blocks.find(b => b.id === block!.parent);
    if (block) result.push(block);
  }
  return result;
}
function outerItem(model: Blocks, block: Block): Block | undefined {
  return ancestors(model, block).find(b => b.kind === "item");
}
function roots(model: Blocks, blocks: readonly Block[]): Block[] | null {
  if (!blocks.length) return null;
  const group = siblings(model, blocks[0]), chosen = new Set(blocks);
  const ordered = group.filter(b => chosen.has(b));
  if (chosen.size !== blocks.length || ordered.length !== blocks.length || ordered.some(b => b.locked)) return null;
  const start = group.indexOf(ordered[0]);
  return ordered.every((b, i) => group[start + i] === b) ? ordered : null;
}
function rootOf(model: Blocks, block: Block): Block {
  const parents = ancestors(model, block);
  return parents[parents.length - 1] ?? block;
}
function padBefore(text: string, n: number, eol: string): string {
  if (!text) return "";
  const tail = text.match(/(?:\r?\n[ \t]*)*$/u)![0];
  return eol.repeat(Math.max(0, n - (tail.match(/\n/gu)?.length ?? 0)));
}
function padAfter(text: string, n: number, eol: string): string {
  if (!text) return "";
  const head = text.match(/^(?:[ \t]*\r?\n)*/u)![0];
  return eol.repeat(Math.max(0, n - (head.match(/\n/gu)?.length ?? 0)));
}

/** Relocate whole parsed blocks. Every surviving non-container is matched after
 * reparse, and each moved block retains its syntax shape and relative content.
 * A root item remains a list item; moving prose into a list adds only a wrapper. */
export function relocateBlocks(model: Blocks, selected: readonly Block[], rawTarget: Block, placement: Placement): BlockEdit | null {
  if (model.text.length > 2 * 1024 * 1024 || !model.blocks.includes(rawTarget) || rawTarget.locked) return null;
  const sources = roots(model, selected);
  if (!sources) return null;
  if (sources.some(b => b.from <= rawTarget.from && b.to >= rawTarget.to)) return null;
  const target = placement.startsWith("root-") ? rootOf(model, rawTarget) : rawTarget;
  const inside = placement === "inside", after = placement === "after" || placement === "root-after";
  if (inside && target.kind !== "item") return null;
  if (sources.some(b => b.from <= target.from && b.to >= target.to)) return null;
  if (!inside && sources[0].parent === target.parent) return moveBlocks(model, sources, target, after);
  const text = model.text, eol = text.match(/\r?\n/u)?.[0] ?? "\n";
  const targetSource = text.slice(target.from, target.to), targetMarker = target.kind === "item" ? marker(targetSource) : null;
  const itemDestination = !!targetMarker && !placement.startsWith("root-");
  if (inside && !targetMarker) return null;
  const existingChild = inside ? model.blocks.find(b => b.parent === target.id && b.kind === "list" && b.to === target.to) : undefined;
  const childItem = existingChild && model.blocks.find(b => b.parent === existingChild.id && b.kind === "item");
  const childMarker = childItem && marker(text.slice(childItem.from, childItem.to));
  const targetPrefix = blockPrefixColumns(text, target.from);
  const targetIndent = targetPrefix + (targetMarker?.indent ?? 0);
  const childIndent = childItem && childMarker ? blockPrefixColumns(text, childItem.from) + childMarker.indent : undefined;
  const indent = itemDestination ? inside ? childIndent ?? targetIndent + targetMarker!.width : targetIndent : 0;
  const mark = itemDestination ? inside ? childMarker?.mark ?? "-" : targetMarker!.mark : "";
  const depth = itemDestination ? target.depth + (inside ? 2 : 0) : 0;
  const tree = markdownTree(text).topNode;
  const fragments: { text: string; offset: number; base: number; kind: Block["kind"]; depth: number; signature: string }[] = [];
  let body = "";
  for (const source of sources) {
    const value = text.slice(source.from, source.to), sourceMarker = source.kind === "item" ? marker(value) : null;
    const node = syntax(tree, text, source);
    if (!node || !closedBlockSyntax(node, text) || source.kind === "item" && !sourceMarker) return null;
    const sourceBase = sourceMarker ? blockPrefixColumns(text, source.from) + sourceMarker.indent + sourceMarker.width : 0;
    const lines = value.split(/\r?\n/u);
    let moved: string, base = 0, kind = source.kind, movedDepth = 0;
    if (itemDestination || sourceMarker) {
      const outputMark = itemDestination ? mark : sourceMarker!.mark;
      const prefix = " ".repeat(indent) + outputMark + " ";
      base = prefix.length; kind = "item"; movedDepth = itemDestination ? depth : 1;
      const first = sourceMarker ? sourceMarker.body : lines[0];
      moved = prefix + first + lines.slice(1).map(line =>
        eol + (line ? " ".repeat(base) + trimIndent(line, sourceBase) : "")
      ).join("");
    } else moved = value;
    if (body) body += itemDestination || fragments[fragments.length - 1]?.kind === "item" && kind === "item" ? eol : eol + eol;
    const sourceSignature = contentSignature(node, text, sourceBase, source.to);
    if (sourceSignature === null) return null;
    fragments.push({ text: moved, offset: body.length, base, kind, depth: movedDepth, signature: sourceSignature });
    body += moved;
  }
  const first = sources[0], last = sources[sources.length - 1];
  const cutFrom = first.from;
  // Removing an inline child must leave the parent's row and its newline.
  // Consuming that newline would glue the next child's indentation to it.
  let cutTo = last.to + (blockPrefixColumns(text, first.from) ? 0 : text.slice(last.to).match(/^\r?\n/u)?.[0].length ?? 0);
  if (first.parent === null || cutFrom === 0)
    cutTo += text.slice(cutTo).match(/^(?:[ \t]*\r?\n)*/u)![0].length;
  const position = inside || after ? target.to : target.from;
  // A last child's ancestor can end at the same position as the selected
  // child. Its post-removal boundary is cutFrom, not stale source text.
  if (position > cutFrom && position < last.to) return null;
  const cutLength = cutTo - cutFrom;
  const at = position < cutFrom ? position : position >= cutTo ? position - cutLength : cutFrom;
  const remaining = text.slice(0, cutFrom) + text.slice(cutTo);
  const minimum = itemDestination ? 1 : 2;
  const compactBefore = itemDestination && !inside && !after && targetPrefix > 0;
  // Use the existing parent prefix for the first inserted row, then restore
  // the old target's column on its new physical row. Only structural spaces
  // are transferred; the target's payload and all continuation bytes survive.
  if (compactBefore) {
    if (!body.startsWith(" ".repeat(targetPrefix))) return null;
    body = body.slice(targetPrefix);
    fragments[0].text = fragments[0].text.slice(targetPrefix);
    for (let i = 1; i < fragments.length; i++) fragments[i].offset -= targetPrefix;
  }
  const prefix = compactBefore ? "" : padBefore(remaining.slice(0, at), minimum, eol);
  const suffix = padAfter(remaining.slice(at), minimum, eol) + (compactBefore ? " ".repeat(targetPrefix) : "");
  const insertion = prefix + body + suffix;
  let candidateText = remaining.slice(0, at) + insertion + remaining.slice(at);
  // When removing the last block, its preceding separator may become a
  // trailing newline. Do not manufacture an empty line at a formerly dry EOF.
  if (!/\n$/u.test(text)) candidateText = candidateText.replace(/(?:\r?\n)+$/u, "");
  if (candidateText === text) return null;
  const candidate = parseBlocks(candidateText), candidateTree = markdownTree(candidateText).topNode;
  const boundaryMap = new Map(candidate.blocks.map(b => [`${b.from}:${b.kind}:${b.depth}`, b]));
  const mapped = (offset: number, right: boolean): number => {
    const next = offset < cutFrom ? offset : offset >= cutTo ? offset - cutLength : cutFrom;
    return next > at || next === at && right ? next + insertion.length : next;
  };
  const mappedStart = (block: Block): number => mapped(block.from, true) - (compactBefore && block === target ? targetPrefix : 0);
  const movedIds = new Set(model.blocks.filter(b => sources.some(s => b.from >= s.from && b.to <= s.to && b.depth >= s.depth)).map(b => b.id));
  const mutable = new Set(sources.reduce<Block[]>((all, s) => all.concat(ancestors(model, s)), []).map(b => b.id));
  const destinationAncestors = inside ? [target, ...ancestors(model, target)] : ancestors(model, target);
  for (const b of destinationAncestors) mutable.add(b.id);
  // A detached list ID belongs to its original list, not whichever paragraph
  // happens to precede it after cutting the last child.
  for (const list of model.blocks.filter(b => b.kind === "list" && !movedIds.has(b.id))) {
    const node = syntax(tree, text, list);
    // Nested detached IDs belong to an item, not the containing list. Only an
    // ID outside the actual list syntax was attached by parseBlocks as a root
    // list-level ID. Looking merely at its suffix misidentified the last item.
    const tail = node ? text.slice(node.to, list.to) : '';
    const anchor = /^(?:[ \t\r]*\n)+[ \t]*(\^[\w-]+)[ \t\r]*$/u.exec(tail);
    if (!anchor) continue;
    const surviving = model.blocks.filter(b => b.parent === list.id && !movedIds.has(b.id));
    if (!surviving.length) return null;
    const next = candidate.blocks.find(b => b.kind === "list" && b.to === mapped(list.to, false));
    if (!next || !candidateText.slice(next.from, next.to).endsWith(tail) ||
      !surviving.every(b => candidate.blocks.some(n => n.from === mappedStart(b) && n.kind === b.kind && n.parent === next.id))) return null;
  }
  for (const b of model.blocks) {
    if (movedIds.has(b.id) || b.kind === "list") continue;
    const next = boundaryMap.get(`${mappedStart(b)}:${b.kind}:${b.depth}`);
    if (!next) return null;
    if (!mutable.has(b.id) && (next.to !== mapped(b.to, false) ||
      (compactBefore && b === target ? blockTextInSlot(candidate, next, 0) !== blockTextInSlot(model, b, 0) :
        candidateText.slice(next.from, next.to) !== text.slice(b.from, b.to)))) return null;
    const parent = outerItem(model, b), nextParent = outerItem(candidate, next);
    if (parent ? nextParent?.from !== mappedStart(parent) : !!nextParent) return null;
  }
  for (const fragment of fragments) {
    const from = at + prefix.length + fragment.offset;
    const moved = boundaryMap.get(`${from}:${fragment.kind}:${fragment.depth}`);
    if (!moved || moved.to !== from + fragment.text.length) return null;
    const node = syntax(candidateTree, candidateText, moved);
    if (!node || !closedBlockSyntax(node, candidateText) || contentSignature(node, candidateText, fragment.base, moved.to) !== fragment.signature) return null;
    const parent = outerItem(candidate, moved);
    const expectedParent = itemDestination ? inside ? target : outerItem(model, target) : undefined;
    if (expectedParent ? parent?.from !== mappedStart(expectedParent) : !!parent) return null;
  }
  // One replacement around the affected blocks. Keep source and destination in
  // `before` even for a pure indent, so a stale plan cannot silently reparent
  // different content. The host adapter also validates the complete snapshot.
  let begin = 0, end = text.length, nextEnd = candidateText.length;
  while (begin < Math.min(first.from, target.from) && begin < nextEnd && text[begin] === candidateText[begin]) begin++;
  while (end > Math.max(last.to, target.to) && nextEnd > begin && text[end - 1] === candidateText[nextEnd - 1]) { end--; nextEnd--; }
  return { from: begin, to: end, before: text.slice(begin, end), insert: candidateText.slice(begin, nextEnd),
    anchor: at + prefix.length, head: at + prefix.length + body.length };
}

export function changeBlockIndent(model: Blocks, selected: readonly Block[], direction: -1 | 1): BlockEdit | null {
  const chosen = roots(model, selected);
  if (!chosen) return null;
  const group = siblings(model, chosen[0]);
  if (direction === 1) {
    const previous = group[group.indexOf(chosen[0]) - 1];
    return previous?.kind === "item" ? relocateBlocks(model, chosen, previous, "inside") : null;
  }
  const parent = outerItem(model, chosen[0]);
  return parent ? relocateBlocks(model, chosen, parent, "after") : null;
}
