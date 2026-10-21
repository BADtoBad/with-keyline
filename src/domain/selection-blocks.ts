import { convertBlocks, parseBlocks, type Blocks, type Block, type BlockEdit } from "./blocks";

export const calloutTypes = ["note", "info", "todo", "tip", "success", "question", "warning", "failure", "danger", "bug", "example", "quote"] as const;
export type SelectionBlockTarget = "code" | "math" | "divider" | `callout-${typeof calloutTypes[number]}`;

/** Only independent root blocks whose complete contents can be retained
 * qualify. Complex nested structures remain unavailable instead of using a
 * line-level replacement that drops children. */
export function selectionBlockPlan(model: Blocks, blocks: readonly Block[], target: SelectionBlockTarget): BlockEdit | null {
  if (blocks.length !== 1 || model.text.length > 2 * 1024 * 1024) return null;
  const b = blocks[0], before = model.text.slice(b.from, b.to), eol = model.text.match(/\r?\n/u)?.[0] ?? "\n";
  if (!model.blocks.includes(b) || b.locked || b.parent !== null || !["paragraph", "heading", "quote"].includes(b.kind) ||
    /(?:^|\s)\^[\w-]+[ \t]*(?:\r?$)/mu.test(before)) return null;
  // A divider has no content payload. Insert after the block, never erase it.
  if (target === "divider") {
    const followingBreaks = model.text.slice(b.to).match(/^(?:\r?\n){0,2}/u)![0].split("\n").length - 1;
    const insert = `${eol}${eol}---${eol.repeat(2 - followingBreaks)}`;
    return { from: b.to, to: b.to, before: "", insert, anchor: b.to + insert.length, head: b.to + insert.length };
  }
  const local = parseBlocks(before);
  const plain = b.kind === "paragraph" ? before : convertBlocks(local, local.blocks.filter(n => n.parent === null), "paragraph")?.insert;
  if (!plain?.trim()) return null;
  let insert: string, prefix: number;
  if (target === "code") {
    const fence = "`".repeat(Math.max(2, ...(plain.match(/`+/gu) ?? []).map(s => s.length)) + 1);
    insert = `${fence}${eol}${plain}${eol}${fence}`; prefix = fence.length + eol.length;
  } else if (target === "math") {
    if (plain.includes("$$")) return null;
    insert = `$$${eol}${plain}${eol}$$`; prefix = 2 + eol.length;
  } else {
    const type = target.slice(8);
    if (!(calloutTypes as readonly string[]).includes(type)) return null;
    const header = `> [!${type}]${eol}`;
    insert = header + plain.replace(/(^|\n)/gu, "$1> "); prefix = header.length + 2;
  }
  const next = parseBlocks(model.text.slice(0, b.from) + insert + model.text.slice(b.to));
  const expected = target === "code" ? "code" : target === "math" ? "math" : "callout";
  if (!next.blocks.some(n => n.from === b.from && n.to === b.from + insert.length && n.kind === expected && !n.locked)) return null;
  return { from: b.from, to: b.to, before, insert, anchor: b.from + prefix,
    head: b.from + (target.startsWith("callout-") ? insert.length : prefix + plain.length) };
}

/** Never invent an ambiguous basename link or attach an ID to a fragment of a
 * list/table. Existing unique root paragraph/heading IDs can be reused. */
export function blockLinkPlan(model: Blocks, blocks: readonly Block[], filePath: string, newId: string):
  { link: string; edit: BlockEdit | null } | null {
  if (blocks.length !== 1 || !/\.md$/iu.test(filePath) || /[\r\n[\]|#^\\]/u.test(filePath) ||
    !/^[a-zA-Z0-9-]+$/u.test(newId) || newId.length > 64) return null;
  const b = blocks[0], before = model.text.slice(b.from, b.to);
  if (!model.blocks.includes(b) || b.locked || b.parent !== null || !["paragraph", "heading"].includes(b.kind)) return null;
  const existing = /(?:^|\s)\^([\w-]+)[ \t]*$/u.exec(before)?.[1];
  const id = existing ?? newId, pattern = /(?:^|\s)\^([\w-]+)[ \t]*(?=\r?$)/gmu;
  let match: RegExpExecArray | null, occurrences = 0;
  while ((match = pattern.exec(model.text))) if (match[1] === id) occurrences++;
  if (occurrences !== (existing ? 1 : 0)) return null;
  const link = `[[${filePath.slice(0, -3)}#^${id}]]`;
  return { link, edit: existing ? null : {
    from: b.to, to: b.to, before: "", insert: ` ^${id}`, anchor: b.from, head: b.to
  } };
}
