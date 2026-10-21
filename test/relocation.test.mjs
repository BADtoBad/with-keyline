import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { parseBlocks, blockAt, siblings, applyBlockEdit } = require("../.test-build/domain/blocks.cjs");
const { relocateBlocks, changeBlockIndent } = require("../.test-build/domain/relocation.cjs");
const at = (model, word) => blockAt(model, model.text.indexOf(word));
const run = (model, plan) => {
  assert.ok(plan, "Expected a safe relocation plan");
  const next = applyBlockEdit(model.text, plan);
  assert.notEqual(next, null);
  return next;
};
const cases = [
  ["nest a sibling", "- Parent\n- Child\n- Next", "Child", "Parent", "inside", "- Parent\n  - Child\n- Next"],
  ["outdent a child", "- Parent\n  - Child\n- Next", "Child", "Parent", "after", "- Parent\n- Child\n- Next"],
  ["change parent", "- A\n  - Child\n- B\n  - Leaf", "Child", "Leaf", "after", "- A\n- B\n  - Leaf\n  - Child"],
  ["prepend to another child list", "- A\n  - Child\n- B\n  - Leaf", "Child", "Leaf", "before", "- A\n- B\n  - Child\n  - Leaf"],
  ["nest first root paragraph", "Paragraph.\n\n- Parent\n- Next", "Paragraph", "Parent", "inside", "- Parent\n  - Paragraph.\n- Next"],
  ["nest last root paragraph", "- Parent\n- Next\n\nParagraph.", "Paragraph", "Parent", "inside", "- Parent\n  - Paragraph.\n- Next"],
  ["preserve grandchildren", "- Parent\n- Child\n  - Grandchild\n- Next", "Child", "Parent", "inside", "- Parent\n  - Child\n    - Grandchild\n- Next"],
  ["use child marker", "- Parent\n  + Existing\n- Child", "Child", "Parent", "inside", "- Parent\n  + Existing\n  + Child"],
  ["numbered destination", "12. Parent\n13. Child", "Child", "Parent", "inside", "12. Parent\n    - Child"],
  ["numbered continuation", "- Parent\n\n12. Child\n    more", "Child", "Parent", "inside", "- Parent\n  - Child\n    more"],
  ["task with unicode", "- Parent\n- [x] 🐦 中文\n  - 子项", "🐦", "Parent", "inside", "- Parent\n  - [x] 🐦 中文\n    - 子项"],
  ["inline anchor", "- Parent\n- Child ^identity", "Child", "Parent", "inside", "- Parent\n  - Child ^identity"],
  ["lazy continuation", "- Parent\n- Child\nlazy line", "Child", "Parent", "inside", "- Parent\n  - Child\n    lazy line"],
  ["outdent middle child without stealing next", "- Parent\n  - A\n  - Child\n  - Z\n- Next", "Child", "Parent", "after", "- Parent\n  - A\n  - Z\n- Child\n- Next"],
  ["root-level child keeps list identity", "- Parent\n  - Child\n\nOutside.", "Child", "Outside", "after", "- Parent\n\nOutside.\n\n- Child"],
  ["root before another list", "- Parent\n  - Child\n\nOutside.\n\n- Next", "Child", "Next", "root-before", "- Parent\n\nOutside.\n\n- Child\n\n- Next"],
  ["closed fenced code", "```js\n  x()\n\n    y()\n```\n\n- Parent", "x()", "Parent", "inside", "- Parent\n  - ```js\n      x()\n\n        y()\n    ```"],
  ["atomic quote", "> Quote\n> second\n\n- Parent", "Quote", "Parent", "inside", "- Parent\n  - > Quote\n    > second"],
  ["atomic callout", "> [!note] Title\n> Body\n>\n> - inner\n\n- Parent", "Title", "Parent", "inside", "- Parent\n  - > [!note] Title\n    > Body\n    >\n    > - inner"],
  ["atomic table", "| A | B |\n|---|---|\n| 1 | 2 |\n\n- Parent", "| A", "Parent", "inside", "- Parent\n  - | A | B |\n    |---|---|\n    | 1 | 2 |"],
  ["heading content", "## Heading\n\n- Parent", "Heading", "Parent", "inside", "- Parent\n  - ## Heading"],
  ["indented code", "    code\n      more\n\n- Parent", "code", "Parent", "inside", "- Parent\n  -     code\n          more"]
];
for (const eol of ["\n", "\r\n"]) for (const [name, input, source, target, placement, output] of cases)
  test(`relocate ${name} (${JSON.stringify(eol)})`, () => {
    const model = parseBlocks(input.replaceAll("\n", eol));
    assert.equal(run(model, relocateBlocks(model, [at(model, source)], at(model, target), placement)), output.replaceAll("\n", eol));
  });
test("group indent and outdent preserve order and child trees", () => {
  const model = parseBlocks("- Parent\n- A\n  - a\n- B\n  - b\n- Next");
  const group = siblings(model, at(model, "Parent")), selected = group.slice(1, 3);
  const nested = run(model, changeBlockIndent(model, selected, 1));
  assert.equal(nested, "- Parent\n  - A\n    - a\n  - B\n    - b\n- Next");
  const next = parseBlocks(nested);
  assert.equal(run(next, changeBlockIndent(next, siblings(next, at(next, "A")), -1)), model.text);
});
test("all child subsets can move between parents without changing other children", () => {
  const model = parseBlocks("- Left\n  - A\n    - a\n  - B\n  - C\n- Right\n  - D\n  - E\n- Tail");
  const source = siblings(model, at(model, "A")), target = siblings(model, at(model, "D"));
  for (let start = 0; start < source.length; start++) for (let end = start; end < source.length; end++)
    for (const dest of target) for (const where of ["before", "after"]) {
      const selected = source.slice(start, end + 1);
      const next = parseBlocks(run(model, relocateBlocks(model, selected, dest, where)));
      const remaining = source.filter(b => !selected.includes(b)).map(b => model.text.slice(b.from, b.to));
      const children = next.blocks.filter(b => b.kind === "item" && b.depth === 3);
      assert.equal(children.length, source.length + target.length);
      const list = next.blocks.find(b => b.parent === at(next, "Left").id);
      assert.deepEqual(children.filter(b => b.parent === list?.id).map(b => next.text.slice(b.from, b.to)), remaining);
      assert.equal(next.blocks.filter(b => b.kind === "item").length, model.blocks.filter(b => b.kind === "item").length);
    }
});
test("invalid source ranges and cyclic moves are not editable", () => {
  const model = parseBlocks("---\nx: 1\n---\n\n- Parent\n  - Child\n- Next\n- Last"), parent = at(model, "Parent"), child = at(model, "Child");
  for (const source of [[], [{ ...child }], [child, child], [parent, child], [parent, at(model, "Last")], [model.blocks[0]]])
    assert.equal(relocateBlocks(model, source, at(model, "Next"), "inside"), null);
  for (const where of ["before", "after", "inside", "root-before", "root-after"])
    assert.equal(relocateBlocks(model, [parent], child, where), null, where);
  assert.equal(relocateBlocks(model, [child], model.blocks[0], "after"), null);
  assert.equal(relocateBlocks(model, [child], { ...parent }, "inside"), null);
  assert.equal(changeBlockIndent(model, [parent], -1), null);
  assert.equal(changeBlockIndent(model, [parent], 1), null);
});
test("unfinished nested code does not escape its item", () => {
  const model = parseBlocks("- Parent\n\n- ```js\n  x()");
  assert.equal(relocateBlocks(model, [at(model, "x()")], at(model, "Parent"), "inside"), null);
});
test("an unrelated frontmatter and inline content survive byte-for-byte", () => {
  const model = parseBlocks("---\ntags: [one, two]\n---\n\n# Keep\n\n- Parent\n- Child\n\nTail **unchanged**.");
  const next = run(model, relocateBlocks(model, [at(model, "Child")], at(model, "Parent"), "inside"));
  assert.equal(next, "---\ntags: [one, two]\n---\n\n# Keep\n\n- Parent\n  - Child\n\nTail **unchanged**.");
});
test("stale edit plans cannot overwrite changed content", () => {
  const model = parseBlocks("- Parent\n- Child");
  const plan = relocateBlocks(model, [at(model, "Child")], at(model, "Parent"), "inside");
  assert.ok(plan);
  assert.equal(applyBlockEdit("- Parent\n- Changed", plan), null);
});
test("code tabs and whitespace-only code lines retain their relative bytes", () => {
  const model = parseBlocks("```js\n\tx()\n  \n  \ty()\n```\n\n- Parent");
  assert.equal(run(model, relocateBlocks(model, [at(model, "x()")], at(model, "Parent"), "inside")),
    "- Parent\n  - ```js\n    \tx()\n      \n      \ty()\n    ```");
});
test("tab-indented children can outdent without losing their subtree", () => {
  const model = parseBlocks("- Parent\n\t- Child\n\t  - Leaf\n- Next");
  assert.equal(run(model, changeBlockIndent(model, [at(model, "Child")], -1)), "- Parent\n- Child\n  - Leaf\n- Next");
});
test("a detached list anchor remains attached when moving only one member", () => {
  const model = parseBlocks("- A\n- B\n\n^group\n\n- Parent");
  // Taking a member out must not reassign the list-level anchor to another list.
  const plan = relocateBlocks(model, [at(model, "A")], at(model, "Parent"), "inside");
  const next = run(model, plan), parsed = parseBlocks(next);
  const anchored = parsed.blocks.find(b => next.slice(b.from, b.to).endsWith("^group"));
  assert.ok(anchored); assert.ok(next.slice(anchored.from, anchored.to).includes("B"));
  assert.equal(next.match(/\^group/gu).length, 1);
});
test("removing the last member cannot detach or steal a list-level anchor", () => {
  for (const prefix of ["", "Before.\n\n"]) {
    const model = parseBlocks(prefix + "- A\n\n^group\n\n- Parent");
    assert.equal(relocateBlocks(model, [at(model, "A")], at(model, "Parent"), "inside"), null);
  }
});
