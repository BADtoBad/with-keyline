import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { parseBlocks, blockAt, blockSelection, siblings, moveBlock, shiftBlock, duplicateBlock, deleteBlock, convertBlock, applyBlockEdit } = require("../.test-build/domain/blocks.cjs");
const textOf = (m, b) => m.text.slice(b.from, b.to);
const at = (m, text) => blockAt(m, m.text.indexOf(text));
const run = (m, p) => { assert.ok(p, "Expected a safe edit plan"); const next = applyBlockEdit(m.text, p); assert.notEqual(next, null); return next; };
const { moveBlocks, shiftBlocks, duplicateBlocks, deleteBlocks, siblingDropTarget } = require("../.test-build/domain/blocks.cjs");
const { inProtectedSyntax } = require("../.test-build/domain/blocks.cjs");
test("toolbar may continue native actions inside inline code without relaxing other protected syntax", () => {
  assert.equal(inProtectedSyntax("`code`", 1, 5), true);
  assert.equal(inProtectedSyntax("`code`", 1, 5, true), false);
  for (const [text, from, to] of [
    ["```\ncode\n```",4,8], ["---\nx: y\n---",4,8], ["$math$",1,5],
    ["%% hidden %%",3,9], ["<div>hidden</div>",0,5]
  ]) assert.equal(inProtectedSyntax(text,from,to,true), true);
});

for (const eol of ["\n", "\r\n"]) test(`continuous multi-block move preserves nested bytes (${JSON.stringify(eol)})`, () => {
  const model = parseBlocks(["- 🐦 A", "  - Child A", "- B", "  continuation", "- C", "- D"].join(eol));
  const group = siblings(model, at(model, "🐦"));
  const plan = moveBlocks(model, group.slice(0, 2), group[3], true);
  const result = run(model, plan);
  assert.equal(result, ["- C", "- D", "- 🐦 A", "  - Child A", "- B", "  continuation"].join(eol));
  assert.equal(result.slice(plan.anchor, plan.head), ["- 🐦 A", "  - Child A", "- B", "  continuation"].join(eol));
  const moved = parseBlocks(result), next = siblings(moved, at(moved, "🐦"));
  assert.equal(run(moved, moveBlocks(moved, next.slice(2), next[0], false)), model.text);
});
test("multi-block plans reject gaps, repeats, stale objects, locked and mixed-parent selections", () => {
  const m = parseBlocks("---\nx: 1\n---\n\n- A\n  - child\n- B\n- C"), group = siblings(m, at(m, "A"));
  for (const chosen of [[], [group[0], group[2]], [group[0], group[0]], [{ ...group[0] }], [group[0], at(m, "child")], [m.blocks[0]]]) {
    assert.equal(shiftBlocks(m, chosen, 1), null);
    assert.equal(duplicateBlocks(m, chosen), null);
    assert.equal(deleteBlocks(m, chosen), null);
  }
});
test("all contiguous ranges can move without losing or rewriting any sibling", () => {
  const m = parseBlocks(Array.from({ length: 7 }, (_, i) => `- Item ${i}\n  - Child ${i}`).join("\n"));
  const group = siblings(m, at(m, "Item 0"));
  for (let first = 0; first < group.length; first++) for (let last = first; last < group.length; last++)
    for (let target = 0; target < group.length; target++) for (const after of [false, true]) {
      if (target >= first && target <= last) continue;
      const chosen = group.slice(first, last + 1), expected = group.filter(b => !chosen.includes(b));
      expected.splice(expected.indexOf(group[target]) + Number(after), 0, ...chosen);
      const plan = moveBlocks(m, chosen, group[target], after);
      if (expected.every((b, i) => b === group[i])) { assert.equal(plan, null); continue; }
      const next = parseBlocks(run(m, plan));
      assert.deepEqual(siblings(next, at(next, "Item")).map(b => textOf(next, b)), expected.map(b => textOf(m, b)));
    }
});
test("multi-block duplicate and delete preserve neighbours and unique anchors", () => {
  const m = parseBlocks("- A\n- B\n- C"), group = siblings(m, at(m, "A"));
  assert.equal(run(m, duplicateBlocks(m, group.slice(0, 2))), "- A\n- B\n- A\n- B\n- C");
  assert.equal(run(m, deleteBlocks(m, group.slice(0, 2))), "\n- C");
  const anchored = parseBlocks("- A ^a\n- B");
  assert.equal(duplicateBlocks(anchored, siblings(anchored, at(anchored, "A"))), null);
});
test("drop targets cannot snap a nested group onto another parent or external paragraph", () => {
  const m = parseBlocks("- Parent\n  - A\n\n  - B\n- Other\n  - C\n\nOutside.\n\nEnd.");
  const parent = at(m, "A").parent;
  assert.equal(siblingDropTarget(m, m.text.indexOf("B"), parent), at(m, "B"));
  assert.equal(siblingDropTarget(m, m.text.indexOf("A") + 2, parent), at(m, "A"));
  for (const word of ["Parent", "Other", "C", "Outside", "End"])
    assert.equal(siblingDropTarget(m, m.text.indexOf(word), parent), null, word);
  assert.equal(siblingDropTarget(m, -1, parent), null);
});

for (const eol of ["\n", "\r\n"]) test(`opaque frontmatter remains intact (${JSON.stringify(eol)})`, () => {
  const source = ["---", "title: Demo", "types:", "  - work", "---", "", "# Heading"].join(eol);
  const model = parseBlocks(source);
  assert.deepEqual(model.blocks.map(b => b.kind), ["frontmatter", "heading"]);
  const first = model.blocks[0];
  assert.ok(first.locked);
  assert.equal(textOf(model, first), source.split(eol + eol)[0]);
  for (const plan of [deleteBlock(model, first), duplicateBlock(model, first), shiftBlock(model, first, 1), convertBlock(model, first, "paragraph")]) assert.equal(plan, null);
});
for (const source of ["---\ntitle: unfinished\n\n# Not a heading", "```js\n# Still code", "$$\nx + y\n\n# Still math", "%%\n# Still comment"]) test(`unclosed construct is locked: ${source.split("\n")[0]}`, () => {
  const model = parseBlocks(source);
  assert.equal(model.blocks.length, 1); assert.ok(model.blocks[0].locked);
  assert.equal(duplicateBlock(model, model.blocks[0]), null);
});
for (const [source, kind] of [
  ["$$\nx + y\n$$", "math"], ["$$x + y$$", "math"],
  ["%%\n# Private\n%%", "comment"], ["%% Private %%", "comment"],
  ["> [!note] Title\n> Content\n>\n> - item", "callout"],
  ["> Quoted line\ncontinued lazy quote", "quote"],
  ["| A | B |\n|---|---|\n| 1 | 2 |", "table"],
  ["```md\n> fake quote\n- fake list\n```", "code"],
  ["    # indented code\n    - not list", "code"],
  ["<div>\n# HTML content\n</div>", "html"]
]) test(`atomic selection: ${kind} / ${source.split("\n")[0]}`, () => {
  const m = parseBlocks(source + "\n\nAfter.");
  assert.equal(m.blocks[0].kind, kind);
  assert.equal(blockAt(m, source.length - 1).id, m.blocks[0].id);
  assert.equal(textOf(m, m.blocks[0]), source);
});
test("nested items retain continuations, indentation and sibling ownership", () => {
  const m = parseBlocks("- parent\n  continuation\n  - child one\n    more\n  - child two\n- sibling");
  const parent = at(m, "parent"), child = at(m, "child one");
  assert.equal(parent.kind, "item"); assert.equal(child.kind, "item");
  assert.equal(textOf(m, child), "  - child one\n    more");
  assert.equal(siblings(m, child).length, 2);
  assert.match(textOf(m, parent), /child two$/u);
  assert.deepEqual(blockSelection(m, m.text.indexOf("child one"), m.text.indexOf("two") + 3).map(b => textOf(m, b)), ["  - child one\n    more", "  - child two"]);
});
test("selection spanning a nested item and next parent expands to whole parents", () => {
  const m = parseBlocks("- parent\n  - child\n- next\n  - leaf");
  const chosen = blockSelection(m, m.text.indexOf("child"), m.text.indexOf("next") + 4);
  assert.equal(chosen.length, 2);
  assert.deepEqual(chosen.map(b => textOf(m, b)), ["- parent\n  - child", "- next\n  - leaf"]);
});
test("blank lines and invalid positions do not select unrelated blocks", () => {
  const m = parseBlocks("One\n\n\nTwo");
  assert.equal(blockAt(m, 5), null);
  assert.equal(blockAt(m, -1), null); assert.equal(blockAt(m, Infinity), null);
  assert.deepEqual(blockSelection(m, 5), []);
});
for (const eol of ["\n", "\r\n"]) test(`nested sibling move is byte-preserving (${JSON.stringify(eol)})`, () => {
  const m = parseBlocks(["- parent", "  - α first", "    wrapped", "  - 🐦 second", "- outside"].join(eol));
  const first = at(m, "α"), second = at(m, "🐦");
  const p = moveBlock(m, first, second, true), result = run(m, p);
  assert.equal(result, ["- parent", "  - 🐦 second", "  - α first", "    wrapped", "- outside"].join(eol));
  assert.equal(result.slice(p.anchor, p.head), textOf(m, first));
  const next = parseBlocks(result);
  assert.equal(run(next, shiftBlock(next, at(next, "α"), -1)), m.text);
});
test("move an atomic callout across a heading without leaking quote markers", () => {
  const m = parseBlocks("Before.\n\n> [!note] Side note\n> Exact content\n\n## Next\n\nAfter.");
  const p = shiftBlock(m, at(m, "Exact"), 1), value = run(m, p);
  assert.equal(value, "Before.\n\n## Next\n\n> [!note] Side note\n> Exact content\n\nAfter.");
});
test("structural merges and cross-level guesses are rejected", () => {
  const m = parseBlocks("- A\n  - child\n- B\n\nBetween.\n\n- C");
  assert.equal(moveBlock(m, at(m, "child"), at(m, "B"), false), null);
  // Moving the separating paragraph would merge two separately parsed lists.
  assert.equal(shiftBlock(m, at(m, "Between"), 1), null);
  assert.equal(moveBlock(m, at(m, "A"), at(m, "A"), false), null);
});
test("first and last sibling cannot move outside their container", () => {
  const m = parseBlocks("- A\n- B");
  assert.equal(shiftBlock(m, at(m, "A"), -1), null);
  assert.equal(shiftBlock(m, at(m, "B"), 1), null);
});
for (const source of ["Note.", "- [x] Finished", "> [!tip] Title\n> Body", "```js\nlet x = 1;\n```"]) test(`duplicate keeps its complete structure: ${source.split("\n")[0]}`, () => {
  const m = parseBlocks(source);
  const selected = at(m, source.includes("Finished") ? "Finished" : source);
  const plan = duplicateBlock(m, selected), value = run(m, plan);
  assert.equal(value.slice(plan.anchor, plan.head), source);
});
for (const source of ["A note ^anchor", "A note\n\n^anchor", "[^id]: definition"]) test(`do not duplicate unique identifier: ${source}`, () => {
  const m = parseBlocks(source), selected = at(m, source.includes("^anchor") ? "^anchor" : source);
  assert.equal(duplicateBlock(m, selected), null);
});
test("deleting a nested parent removes children but preserves neighbouring content", () => {
  const m = parseBlocks("- before\n- parent\n  - child\n- after"), target = at(m, "parent");
  assert.equal(run(m, deleteBlock(m, target)), "- before\n\n- after");
});
for (const [target, prefix] of [["h1", "# "], ["h6", "###### "], ["bullet", "- "], ["number", "1. "], ["task", "- [ ] "], ["quote", "> "], ["paragraph", ""]]) test(`single-line conversion: ${target}`, () => {
  const m = parseBlocks("### Keep **content**");
  const plan = convertBlock(m, m.blocks[0], target), value = run(m, plan);
  assert.equal(value, prefix + "Keep **content**");
  assert.equal(value.slice(plan.anchor, plan.head), "Keep **content**");
});
test("conversion never flattens complex content", () => {
  for (const source of ["A line\ncontinued", "- parent\n  - child", "| A | B |\n|---|---|\n|1|2|", "```js\ncode\n```", "> [!note] Title\n> Body"]) {
    const m = parseBlocks(source);
    assert.equal(convertBlock(m, blockAt(m, 0), "h1"), null);
  }
  const nested = parseBlocks("- parent\n  - child");
  assert.equal(run(nested, convertBlock(nested, at(nested, "child"), "paragraph")), "- parent\n\n  child");
});
test("edit plans fail closed on stale ranges", () => {
  const m = parseBlocks("One.\n\nTwo.");
  const plan = shiftBlock(m, m.blocks[0], 1);
  assert.ok(plan);
  assert.equal(applyBlockEdit("Changed.\n\nTwo.", plan), null);
  assert.equal(applyBlockEdit(m.text, { ...plan, from: -1 }), null);
});
test("standalone block anchors move with their original content", () => {
  const m = parseBlocks("First paragraph.\n\n^first-id\n\nSecond paragraph.");
  assert.equal(m.blocks.length, 2);
  assert.equal(textOf(m, m.blocks[0]), "First paragraph.\n\n^first-id");
  assert.equal(run(m, shiftBlock(m, m.blocks[0], 1)), "Second paragraph.\n\nFirst paragraph.\n\n^first-id");
  assert.equal(duplicateBlock(m, m.blocks[0]), null);
});
test("list-level block anchor remains with the list, not its last child", () => {
  const m = parseBlocks("- one\n- two\n\n^list-id\n\nTail.");
  const list = m.blocks[0], items = m.blocks.filter(b => b.kind === "item");
  assert.equal(list.kind, "list");
  assert.ok(items.every(b => b.parent === list.id));
  assert.equal(textOf(m, list), "- one\n- two\n\n^list-id");
  assert.equal(run(m, shiftBlock(m, items[0], 1)), "- two\n- one\n\n^list-id\n\nTail.");
});
test("many distinct sibling permutations preserve all sibling bytes", () => {
  for (let source = 0; source < 8; source++) for (let target = 0; target < 8; target++) {
    if (source === target) continue;
    const text = Array.from({ length: 8 }, (_, i) => `- Item ${i}\n  continuation ${i}`).join("\n");
    const m = parseBlocks(text), items = m.blocks.filter(b => b.kind === "item");
    const p = moveBlock(m, items[source], items[target], source < target);
    const moved = run(m, p), next = parseBlocks(moved);
    assert.equal(next.blocks.filter(b => b.kind === "item").length, items.length);
    assert.deepEqual(next.blocks.filter(b => b.kind === "item").map(b => textOf(next, b)).sort(), items.map(b => textOf(m, b)).sort());
  }
});
