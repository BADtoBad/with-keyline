import { blockAt, inProtectedSyntax, parseBlocks, type BlockEdit, type Blocks, type Conversion } from "./blocks";
import { calloutTypes, type SelectionBlockTarget } from "./selection-blocks";
import { colorSelection } from "./rich-format";

export interface HandleRow { from: number; to: number; bodyFrom: number; body: string; eol: string; plain: boolean }
/** The primary handle menu addresses a physical source row, not the current
 * selection or drag scope. Never infer a row inside an opaque construct. */
export function handleRow(model: Blocks, at: number): HandleRow | null {
  const text = model.text;
  if (text.length > 2 * 1024 * 1024 || !Number.isInteger(at) || at < 0 || at > text.length) return null;
  const from = at === 0 ? 0 : text.lastIndexOf("\n", at - 1) + 1;
  const end = text.indexOf("\n", from), to = end < 0 ? text.length : end - Number(text[end - 1] === "\r");
  const value = text.slice(from, to), block = blockAt(model, from);
  const ownedColour = () => colorSelection(text, from, to, { text: "default", background: "default" });
  if (block?.locked || inProtectedSyntax(text, from, to, true) && !ownedColour()) return null;
  if (block && !["paragraph", "heading", "quote", "item"].includes(block.kind)) return null;
  if (block && block.kind !== "paragraph" && (block.from !== from || block.to !== to)) return null;
  // A nested item's source prefix is shared with its parent structure. Do not
  // reproduce the integrated bug that promotes its label and abandons children.
  if (block?.kind === "item") {
    const list = model.blocks.find(b => b.id === block.parent);
    if (!list || list.parent !== null || block.children.length) return null;
  } else if (block?.parent) return null;
  if (/(?:^|\s)\^[\w-]+[ \t]*$/u.test(value)) return null;
  let prefix = "";
  if (block?.kind === "heading") prefix = value.match(/^ {0,3}#{1,6}(?:[ \t]+|$)/u)?.[0] ?? "";
  if (block?.kind === "item") prefix = value.match(/^ {0,3}(?:[-+*]|\d+[.)])[ \t]+(?:\[[ xX]\][ \t]+)?/u)?.[0] ?? "";
  if (block?.kind === "quote") prefix = value.match(/^ {0,3}>[ \t]?/u)?.[0] ?? "";
  if (block && block.kind !== "paragraph" && !prefix) return null;
  const body = value.slice(prefix.length);
  return { from, to, bodyFrom: from + prefix.length, body, plain: !prefix, eol: text.match(/\r?\n/u)?.[0] ?? "\n" };
}

export function handleConversion(model: Blocks, row: HandleRow, target: Conversion | SelectionBlockTarget): BlockEdit | null {
  const actual = handleRow(model, row.from);
  if (!actual || JSON.stringify(actual) !== JSON.stringify(row)) return null;
  const before = model.text.slice(row.from, row.to), eol = row.eol, body = row.body;
  let insert: string;
  if (target === "divider") {
    // Preserve the payload: the old menu replaces it. Use the selection menu's
    // insertion-after contract, and record this intentional difference.
    const following = model.text.slice(row.to).match(/^(?:\r?\n){0,2}/u)![0].split("\n").length - 1;
    const value = `${eol}${eol}---${eol.repeat(2 - following)}`;
    return { from: row.to, to: row.to, before: "", insert: value, anchor: row.to, head: row.to };
  }
  if (target === "paragraph") insert = body;
  else if (/^h[1-6]$/u.test(target)) insert = "#".repeat(Number(target.slice(1))) + " " + body;
  else if (target === "bullet") insert = "- " + body;
  else if (target === "number") insert = "1. " + body;
  else if (target === "task") {
    const checked = before.match(/^ {0,3}(?:[-+*]|\d+[.)])[ \t]+\[([ xX])\]/u)?.[1] ?? " ";
    insert = `- [${checked}] ` + body;
  } else if (target === "quote") insert = "> " + body;
  else if (target === "code") {
    const fence = "`".repeat(Math.max(2, ...(body.match(/`+/gu) ?? []).map(s => s.length)) + 1);
    insert = `${fence}${eol}${body}${eol}${fence}`;
  } else if (target === "math") {
    if (body.includes("$$")) return null;
    insert = `$$${eol}${body}${eol}$$`;
  } else if (target.startsWith("callout-") && (calloutTypes as readonly string[]).includes(target.slice(8)))
    insert = `> [!${target.slice(8)}]${eol}> ${body}`;
  else return null;
  if (insert === before) return null;
  const candidate = parseBlocks(model.text.slice(0, row.from) + insert + model.text.slice(row.to));
  if (candidate.blocks.some(b => b.locked && b.from <= row.from && b.to >= row.from + insert.length)) return null;
  return { from: row.from, to: row.to, before, insert, anchor: row.from, head: row.from };
}

export function handleDelete(model: Blocks, row: HandleRow): BlockEdit | null {
  const actual = handleRow(model, row.from);
  if (!actual || JSON.stringify(actual) !== JSON.stringify(row)) return null;
  const from = row.from, tail = model.text.slice(row.to), eol = tail.match(/^\r?\n/u)?.[0] ?? "";
  const to = row.to + eol.length;
  if (to === from) return null;
  return { from, to, before: model.text.slice(from, to), insert: "", anchor: from, head: from };
}
