import { markdownTree, parseBlocks, closedBlockSyntax, type Block, type BlockEdit, type Blocks, type Conversion } from "./blocks";

type Node = ReturnType<typeof markdownTree>["topNode"];
interface Cut { from: number; to: number }
interface Payload { text: string; shape: string; checked: string | null }
interface Fragment { source: Block; value: string; base: number; anchor: number }
const listName = /^(?:BulletList|OrderedList)$/u;
const headingName = /^(?:ATX|Setext)Heading[1-6]$/u;
const listTarget = (target: Conversion) => ["bullet", "number", "task"].includes(target);
const names: Partial<Record<Block["kind"], RegExp>> = {
  paragraph: /^Paragraph$/u, heading: headingName, item: /^ListItem$/u,
  quote: /^Blockquote$/u, callout: /^Blockquote$/u, list: listName,
  code: /^(?:FencedCode|CodeBlock)$/u, table: /^Table$/u, rule: /^HorizontalRule$/u
};
function children(node: Node): Node[] {
  const result: Node[] = [];
  for (let child = node.firstChild; child; child = child.nextSibling) result.push(child);
  return result;
}
function visit(node: Node, run: (node: Node) => void): void {
  run(node); for (let child = node.firstChild; child; child = child.nextSibling) visit(child, run);
}
function columns(value: string): number {
  let col = 0;
  for (const ch of value) col += ch === "\t" ? 4 - col % 4 : 1;
  return col;
}
function project(text: string, cuts: readonly Cut[], from = 0, to = text.length): string {
  let at = from, result = "";
  for (const cut of cuts) {
    if (cut.to <= at || cut.from >= to) continue;
    result += text.slice(at, Math.max(at, cut.from));
    at = Math.min(to, cut.to);
  }
  return result + text.slice(at, to);
}
function ordered(cuts: Cut[]): Cut[] {
  const result: Cut[] = [];
  for (const cut of cuts.sort((a, b) => a.from - b.from)) {
    const last = result[result.length - 1];
    if (last && cut.from <= last.to) last.to = Math.max(last.to, cut.to);
    else if (cut.to > cut.from) result.push({ ...cut });
  }
  return result;
}
/** Only strip complete whitespace columns. A partially consumed tab cannot be
 * represented by a deletion; leave such a conversion unavailable, not lossy. */
function indentCuts(text: string, base: number, first = true): Cut[] | null {
  const result: Cut[] = [];
  let from = 0;
  for (const line of text.split("\n")) {
    if (first || from > 0) {
      let width = 0, end = 0;
      while (end < line.length && width < base && /[ \t]/u.test(line[end])) {
        width += line[end++] === "\t" ? 4 - width % 4 : 1;
      }
      if (width > base) return null;
      result.push({ from, to: from + end });
    }
    from += line.length + 1;
  }
  return result;
}
function shape(node: Node, text: string, cuts: readonly Cut[], rename?: string): unknown {
  if (cuts.some(cut => cut.from <= node.from && cut.to >= node.to)) return null;
  const content = project(text, cuts, node.from, node.to).replace(/\r$/u, "");
  const nested = node.name === "FencedCode" || node.name === "CodeBlock" ? [] :
    children(node).map(child => shape(child, text, cuts)).filter(child => child !== null);
  return [rename ?? node.name, content, nested];
}
function shapes(nodes: readonly Node[], text: string, cuts: readonly Cut[] = [], rename?: Node): string {
  return JSON.stringify(nodes.map(node => shape(node, text, cuts, node === rename ? "Paragraph" : undefined)).filter(node => node !== null));
}
function prefixColumns(text: string, from: number): number {
  return columns(text.slice(text.lastIndexOf("\n", from - 1) + 1, from));
}
function localSource(model: Blocks, block: Block): string | null {
  const value = model.text.slice(block.from, block.to);
  const white = block.kind === "item" ? value.match(/^[ \t]*/u)![0] : "";
  const base = block.kind === "item" ? prefixColumns(model.text, block.from) + columns(white) : 0;
  // The first compact row starts after its parent's marker. Continuations still
  // include that parent's column, so only subsequent rows strip the full base.
  const cuts = indentCuts(value, base, false);
  return cuts && project(value, ordered([{ from: 0, to: white.length }, ...cuts]));
}
/** Remove just one selected structural layer, never every nested Markdown
 * prefix. The projected original syntax must parse identically as the payload. */
function payload(value: string, category: Block["kind"]): Payload | null {
  const tree = markdownTree(value).topNode;
  let roots = children(tree), node = roots[0], cuts: Cut[] = [], renamed: Node | undefined, checked: string | null = null;
  if (!node || roots.length !== 1 || !closedBlockSyntax(node, value)) return null;
  if (category === "item") {
    if (!listName.test(node.name) || children(node).length !== 1) return null;
    node = node.firstChild!;
    const mark = /^([ \t]*)([-+*]|\d+[.)])([ \t]+)/u.exec(value);
    if (!mark) return null;
    const base = columns(mark[0]), indents = indentCuts(value, base, false);
    if (!indents) return null;
    cuts.push(...indents, { from: 0, to: mark[0].length });
    roots = children(node).filter(child => child.name !== "ListMark");
    if (roots[0]?.name === "Task") {
      renamed = roots[0];
      const task = renamed.getChild("TaskMarker");
      if (!task) return null;
      checked = value.slice(task.from + 1, task.to - 1);
      const space = value.slice(task.to).match(/^[ \t]*/u)![0].length;
      cuts.push({ from: task.from, to: task.to + space });
    }
  } else if (category === "heading") {
    if (!headingName.test(node.name)) return null;
    renamed = node;
    const marks = node.getChildren("HeaderMark");
    if (node.name.startsWith("Setext")) {
      const underline = marks[marks.length - 1];
      const start = value.lastIndexOf("\n", underline.from);
      if (start < 0) return null;
      cuts.push({ from: value[start - 1] === "\r" ? start - 1 : start, to: value.length });
    } else {
      const open = marks[0], close = marks[1];
      if (!open) return null;
      cuts.push({ from: 0, to: open.to + value.slice(open.to).match(/^[ \t]*/u)![0].length });
      if (close) {
        const before = value.slice(0, close.from).match(/[ \t]*$/u)![0].length;
        cuts.push({ from: close.from - before, to: value.length });
      }
    }
  } else if (category === "quote") {
    if (node.name !== "Blockquote") return null;
    let from = 0;
    for (const line of value.split("\n")) {
      const mark = /^ {0,3}>[ \t]?/u.exec(line);
      if (mark) cuts.push({ from, to: from + mark[0].length });
      from += line.length + 1;
    }
    roots = children(node);
  } else if (category === "callout") {
    // Its type/title/fold metadata is meaningful. Other targets may wrap it,
    // but "Text" must not silently erase it.
    if (node.name !== "Blockquote") return null;
  } else if (!names[category]?.test(node.name)) return null;
  cuts = ordered(cuts);
  const body = project(value, cuts);
  if (!body.trim()) return null;
  const expected = shapes(roots, value, cuts, renamed), actual = shapes(children(markdownTree(body).topNode), body);
  if (actual !== expected) return null;
  return { text: body, shape: actual, checked };
}
function decorate(body: Payload, target: Conversion, ordinal: number): string | null {
  const text = body.text;
  if (target === "paragraph") return text;
  if (target.startsWith("h")) {
    const roots = children(markdownTree(text).topNode);
    if (/[\r\n]/u.test(text) || roots.length !== 1 || roots[0].name !== "Paragraph") return null;
    return "#".repeat(Number(target.slice(1))) + " " + text;
  }
  if (target === "quote") return text.replace(/(^|\n)/gu, "$1> ");
  const mark = target === "number" ? `${ordinal}. ` : "- ";
  const task = target === "task" ? `[${body.checked ?? " "}] ` : "";
  // Checkbox width is not list indentation. Markdown continuation belongs at
  // the list marker's content column, not under the task's visible label.
  return mark + task + text.replace(/\n/gu, "\n" + " ".repeat(mark.length));
}
function flattenLists(nodes: readonly Node[]): Node[] {
  return nodes.reduce<Node[]>((all, node) => all.concat(listName.test(node.name) ? children(node) : [node]), []);
}
function fragment(model: Blocks, source: Block, target: Conversion, ordinal: number): Fragment | null {
  const local = localSource(model, source);
  if (local === null) return null;
  const body = payload(local, source.kind);
  if (!body) return null;
  const value = decorate(body, target, ordinal);
  if (value === null) return null;
  const resultKind = listTarget(target) ? "item" : target === "quote" ? "quote" : target.startsWith("h") ? "heading" : null;
  const unwrapped = resultKind ? payload(value, resultKind) : { shape: shapes(children(markdownTree(value).topNode), value) };
  if (!unwrapped || unwrapped.shape !== body.shape) return null;
  // In "Text", an ordinary container is unwrapped one level; a table/code/
  // callout is not flattened. A no-op will be removed at the whole-plan boundary.
  const list = source.parent ? model.blocks.find(b => b.id === source.parent) : undefined;
  const parent = list?.parent ? model.blocks.find(b => b.id === list.parent) : undefined;
  const sourceIndent = prefixColumns(model.text, source.from) + columns(model.text.slice(source.from, source.to).match(/^[ \t]*/u)![0]);
  let base = source.kind === "item" && listTarget(target) ? sourceIndent : 0;
  if (source.kind === "item" && !listTarget(target) && parent) {
    const mark = /^([ \t]*)([-+*]|\d+[.)])[ \t]+/u.exec(model.text.slice(parent.from, parent.to));
    if (!mark) return null;
    base = prefixColumns(model.text, parent.from) + columns(mark[0]);
  }
  const prefix = target.startsWith("h") ? Number(target.slice(1)) + 1 :
    target === "quote" ? 2 : target === "number" ? `${ordinal}. `.length :
    target === "task" ? 6 : target === "bullet" ? 2 : 0;
  return { source, value, base, anchor: prefix };
}
function padBefore(text: string, eol: string): string {
  return eol.repeat(Math.max(0, 2 - (text.match(/(?:\r?\n[ \t]*)*$/u)![0].match(/\n/gu)?.length ?? 0)));
}
function padAfter(text: string, eol: string): string {
  return eol.repeat(Math.max(0, 2 - (text.match(/^(?:[ \t]*\r?\n)*/u)![0].match(/\n/gu)?.length ?? 0)));
}

/** Convert one sibling scope in a single undoable edit. Nested content retains
 * its own syntax. Adjacent list containers may split/merge, but unaffected items
 * and their quote/item ancestry must survive exactly. */
export function convertStructured(model: Blocks, selected: readonly Block[], target: Conversion): BlockEdit | null {
  if (model.text.length > 2 * 1024 * 1024 || !selected.length ||
    !/^(?:paragraph|bullet|number|task|quote|h[1-6])$/u.test(target)) return null;
  if (selected.some(b => !model.blocks.includes(b) || b.locked || b.parent !== selected[0].parent)) return null;
  const group = model.blocks.filter(b => b.parent === selected[0].parent);
  const chosen = [...selected].sort((a, b) => a.from - b.from), firstIndex = group.indexOf(chosen[0]);
  if (chosen.some((b, i) => group[firstIndex + i] !== b)) return null;
  // A whole selected list changes its immediate items, not all descendants.
  const sources = chosen.reduce<Block[]>((all, b) =>
    all.concat(b.kind === "list" ? model.blocks.filter(child => child.parent === b.id) : [b]), []);
  if (!sources.length) return null;
  if (!/^\s*$/u.test(model.text.slice(chosen[0].from, sources[0].from)) ||
    !/^\s*$/u.test(model.text.slice(sources[sources.length - 1].to, chosen[chosen.length - 1].to))) return null;
  const fragments: Fragment[] = [];
  for (const source of sources) {
    const planned = fragment(model, source, target, fragments.length + 1);
    if (!planned) return null;
    fragments.push(planned);
  }
  const first = chosen[0], last = chosen[chosen.length - 1], text = model.text;
  const eol = text.match(/\r?\n/u)?.[0] ?? "\n";
  let value = "", anchor = 0;
  const spans: { from: number; to: number; value: string; base: number }[] = [];
  // Preserve existing inter-block whitespace (including mixed newline bytes)
  // whenever it already provides enough separation for the selected target.
  for (let i = 0; i < fragments.length; i++) {
    const part = fragments[i], before = fragments[i - 1];
    if (before) {
      const originalGap = text.slice(before.source.to, part.source.from);
      const minimum = listTarget(target) ? 1 : 2;
      if (!/^\s*$/u.test(originalGap)) return null;
      value += originalGap + eol.repeat(Math.max(0, minimum - (originalGap.match(/\n/gu)?.length ?? 0)));
    }
    const firstIndent = part.base - prefixColumns(text, part.source.from);
    if (firstIndent < 0) return null;
    const decorated = " ".repeat(firstIndent) + part.value.replace(/\n/gu, "\n" + " ".repeat(part.base));
    if (!i) anchor = value.length + firstIndent + part.anchor;
    spans.push({ from: value.length, to: value.length + decorated.length, value: part.value, base: part.base });
    value += decorated;
  }
  // Splitting a list into prose requires explicit separators, including inside
  // an outer item. Existing neighbouring content never becomes a continuation.
  const padding = !listTarget(target) && sources.some(b => b.kind === "item");
  const lastSource = sources[sources.length - 1];
  const peers = model.blocks.filter(b => b.parent === lastSource.parent);
  const following = peers[peers.indexOf(lastSource) + 1];
  // A surviving "10." cannot interrupt a preceding paragraph. When converting
  // only part of its numbered list, add a separator instead of swallowing it as
  // a lazy continuation of the converted item's last descendant.
  const separateNumber = listTarget(target) && target !== "number" && lastSource.kind === "item" &&
    following?.kind === "item" && /^[ \t]*\d+[.)][ \t]/u.test(text.slice(following.from, following.to));
  const prefix = padding && first.from && !prefixColumns(text, first.from) ? padBefore(text.slice(0, first.from), eol) : "";
  const suffix = (padding || separateNumber) && last.to < text.length ? padAfter(text.slice(last.to), eol) : "";
  const insert = prefix + value + suffix;
  if (insert === text.slice(first.from, last.to)) return null;
  const candidate = text.slice(0, first.from) + insert + text.slice(last.to);
  const tree = markdownTree(candidate).topNode, original = markdownTree(text).topNode;
  const delta = insert.length - (last.to - first.from);
  const map = (n: number) => n < first.from ? n : n >= last.to ? n + delta : first.from;
  const indexed = new Map<string, Node>();
  visit(tree, n => indexed.set(`${n.from}:${n.to}:${n.name}`, n));
  const anchored = model.blocks.filter(b => /(?:^|\n)[ \t]*\^[\w-]+[ \t]*$/u.test(text.slice(b.from, b.to)));
  if (anchored.length) {
    const nextBlocks = parseBlocks(candidate).blocks;
    for (const b of anchored) {
      // Detached IDs bind to the preceding semantic block, not just their own
      // source line. Keeping the ID bytes alone is insufficient.
      if (!nextBlocks.some(next => next.kind === b.kind && next.depth === b.depth &&
        next.from === map(b.from) && next.to === map(b.to))) return null;
    }
  }
  let valid = true;
  const ownership = (node: Node, changed: boolean): string => {
    const result: string[] = [];
    for (let p = node.parent; p; p = p.parent)
      if (p.name === "ListItem" || p.name === "Blockquote") result.push(`${p.name}:${changed ? map(p.from) : p.from}`);
    return result.join("/");
  };
  visit(original, node => {
    if (!valid || node.name === "Document" || listName.test(node.name)) return;
    if (node.to <= first.from || node.from >= last.to) {
      const next = indexed.get(`${node.from >= last.to ? map(node.from) : node.from}:${node.to <= first.from ? node.to : map(node.to)}:${node.name}`);
      if (!next || ownership(node, true) !== ownership(next, false)) valid = false;
    } else if (node.from < first.from && node.to >= last.to &&
      (node.name === "ListItem" || node.name === "Blockquote")) {
      // Converting its final children may add a separator after the parent.
      // That whitespace moves later nodes, but is not part of the parent's
      // semantic extent. Both start/identity and every unaffected child still
      // have to survive; only this shared end boundary has two valid mappings.
      const sharedEnd = node.to === last.to + Number(text[last.to] === "\r");
      const contentEnd = first.from + prefix.length + value.length;
      const end = contentEnd + Number(candidate[contentEnd] === "\r");
      if (!indexed.has(`${node.from}:${map(node.to)}:${node.name}`) &&
        !(sharedEnd && indexed.has(`${node.from}:${end}:${node.name}`))) valid = false;
    }
  });
  if (!valid) return null;
  for (const span of spans) {
    const start = first.from + prefix.length + span.from, end = first.from + prefix.length + span.to;
    // Block edit ranges leave the CR of a following CRLF untouched; Lezer's
    // final node can still include it. Compare that same line boundary without
    // inventing a missing child or consuming the newline in the actual edit.
    const syntaxEnd = end + Number(candidate[end] === "\r");
    const roots: Node[] = [];
    const collect = (node: Node) => {
      if (node.to < start || node.from > syntaxEnd) return;
      if (node.name !== "Document" && !listName.test(node.name) && node.from >= start && node.to <= syntaxEnd) {
        roots.push(node); return;
      }
      for (const child of children(node)) collect(child);
    };
    collect(tree);
    const actualText = candidate.slice(start, end), cuts = indentCuts(actualText, span.base);
    if (!cuts) return null;
    const globalCuts = cuts.map(cut => ({ from: start + cut.from, to: start + cut.to }));
    const expected = shapes(flattenLists(children(markdownTree(span.value).topNode)), span.value);
    if (shapes(roots, candidate, globalCuts) !== expected) return null;
  }
  return { from: first.from, to: last.to, before: text.slice(first.from, last.to), insert,
    anchor: first.from + prefix.length + anchor, head: first.from + prefix.length + value.length };
}
