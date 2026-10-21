import { blockAt, convertBlock, inProtectedSyntax, parseBlocks, type Blocks, type BlockEdit } from "./blocks";
import { changeBlockIndent } from "./relocation";

/** Expand through real containing blocks, then the document. No text mutation. */
export function expandBlockSelection(model: Blocks, from: number, to: number): { anchor: number; head: number } | null {
  if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to < from || to > model.text.length) return null;
  const current = blockAt(model, from);
  if (!current || current.locked || from === 0 && to === model.text.length) return null;
  const scopes = model.blocks.filter(b => !b.locked && b.from <= from && b.to >= to && (b.from < from || b.to > to))
    .sort((a, b) => (a.to - a.from) - (b.to - b.from) || b.depth - a.depth);
  const scope = scopes[0];
  return scope ? { anchor: scope.from, head: scope.to } : { anchor: 0, head: model.text.length };
}

/** Backspace at the content boundary removes one safe structural layer. Complex
 * roots that cannot round-trip retain the host's normal Backspace behaviour. */
export function backspaceBlock(model: Blocks, at: number): BlockEdit | null {
  const block = blockAt(model, at);
  if (!block || block.locked || inProtectedSyntax(model.text, at)) return null;
  const value = model.text.slice(block.from, block.to);
  // Explicit conversion can unwrap multiline containers. A single Backspace
  // must not acquire that wider scope as conversion support grows.
  if (/[\r\n]/u.test(value) && !(block.kind === "item" && block.depth > 1)) return null;
  const prefix = /^[ \t]*(?:#{1,6}[ \t]+|>[ \t]?|(?:[-+*]|\d+[.)])[ \t]+(?:\[[ xX]\][ \t]+)?)/u.exec(value)?.[0];
  if (!prefix || block.from + prefix.length !== at) return null;
  let plan: BlockEdit | null = null;
  if (block.kind === "item" && block.depth > 1) plan = changeBlockIndent(model, [block], -1);
  else if (block.kind === "item" && /\[[ xX]\][ \t]+$/u.test(prefix)) plan = convertBlock(model, block, "bullet");
  else if (["item", "heading", "quote"].includes(block.kind)) plan = convertBlock(model, block, "paragraph");
  if (!plan) return null;
  const next = model.text.slice(0, plan.from) + plan.insert + model.text.slice(plan.to);
  if (block.kind === "item" && block.depth > 1) {
    const newPrefix = /^[ \t]*(?:[-+*]|\d+[.)])[ \t]+(?:\[[ xX]\][ \t]+)?/u.exec(next.slice(plan.anchor))?.[0];
    if (!newPrefix) return null;
    plan.anchor += newPrefix.length;
  } else {
    const converted = blockAt(parseBlocks(next), plan.anchor);
    const expected = block.kind === "item" && /\[[ xX]\][ \t]+$/u.test(prefix) ? "item" : "paragraph";
    if (!converted || converted.kind !== expected || converted.from !== block.from ||
      converted.to !== block.from + plan.insert.length || converted.locked) return null;
  }
  return { ...plan, head: plan.anchor };
}
