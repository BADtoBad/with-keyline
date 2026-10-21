import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { parseBlocks, blockAt, convertBlock, convertBlocks, applyBlockEdit, markdownTree } = require("../.test-build/domain/blocks.cjs");
function convert(text, target, chosen = "roots") {
  const model = parseBlocks(text);
  const blocks = chosen === "roots" ? model.blocks.filter(b => !b.parent) :
    Array.isArray(chosen) ? chosen.map(s => blockAt(model, text.indexOf(s))) : [blockAt(model, text.indexOf(chosen))];
  const plan = convertBlocks(model, blocks, target);
  return { plan, text: plan && applyBlockEdit(text, plan) };
}
const examples = [
  ["First **strong** line\nsecond line  \nthird 😀", "quote", "> First **strong** line\n> second line  \n> third 😀"],
  ["First **strong** line\nsecond line", "task", "- [ ] First **strong** line\n  second line"],
  ["Title\n=====", "h3", "### Title"],
  ["### Title ###", "paragraph", "Title"],
  ["9. [X] parent\n   continued\n\n   - child", "bullet", "- parent\n  continued\n  \n  - child"],
  ["9. [X] parent\n   continued\n\n   - child", "task", "- [X] parent\n  continued\n  \n  - child"],
  ["- parent\n  - child\n    - grandchild\n- peer", "number", "1. parent\n   - child\n     - grandchild\n2. peer"],
  ["- [x] finished\n- [ ] pending\n  - child", "task", "- [x] finished\n- [ ] pending\n  - child"],
  ["> text\n>\n> - child\n>   continuation", "paragraph", "text\n\n- child\n  continuation"],
  ["> > nested\n>\n> text", "paragraph", "> nested\n\ntext"],
  ["> > nested\n>\n> text", "bullet", "- > nested\n  \n  text"],
  ["> text\nlazy continuation\n> ending", "paragraph", "text\nlazy continuation\nending"],
  ["- before\n- parent\n  - child\n- after", "paragraph", "before\n\nparent\n- child\n\nafter"],
  ["First\n\nSecond", "bullet", "- First\n\n- Second"],
  ["First\n\nSecond", "quote", "> First\n\n> Second"],
  ["- A\n- B", "h2", "## A\n\n## B"],
  ["```js\n  code();\n\n  more();\n```", "quote", "> ```js\n>   code();\n> \n>   more();\n> ```"],
  ["```js\n  code();\n```", "bullet", "- ```js\n    code();\n  ```"],
  ["| A | B |\n| --- | --- |\n| 1 | 2 |", "quote", "> | A | B |\n> | --- | --- |\n> | 1 | 2 |"],
  ["> [!tip]- Title\n> Body", "bullet", "- > [!tip]- Title\n  > Body"],
  ["Text with a [[Page|label]] and ^anchor", "h2", "## Text with a [[Page|label]] and ^anchor"],
  ["A ==highlight\ncontinued== end", "quote", "> A ==highlight\n> continued== end"],
  ["A <span>colour\ncontinued</span> end", "bullet", "- A <span>colour\n  continued</span> end"],
];
for (const [source, target, expected] of examples) test(`structured conversion ${target}: ${JSON.stringify(source)}`, () => {
  const actual = convert(source, target);
  if (source === expected) { assert.equal(actual.plan, null); return; }
  assert.equal(actual.text, expected);
  assert.equal(actual.plan.before, source);
  assert.ok(actual.plan.anchor >= 0 && actual.plan.anchor <= actual.plan.head && actual.plan.head <= expected.length);
  assert.equal(actual.text.slice(0, actual.plan.from) + actual.plan.before + actual.text.slice(actual.plan.from + actual.plan.insert.length), source);
});
for (const [name, source, target, expected] of [
  ["nested text", "- Parent\n  - Child\n  - Next\n- Other", "paragraph", "- Parent\n\n  Child\n\n  - Next\n- Other"],
  ["nested quote", "- Parent\n  - Child\n    - Leaf\n  - Next\n- Other", "quote", "- Parent\n\n  > Child\n  > - Leaf\n\n  - Next\n- Other"],
  ["nested heading", "- Parent\n  - Child\n  - Next\n- Other", "h3", "- Parent\n\n  ### Child\n\n  - Next\n- Other"],
  ["different marker width", "- Parent\n\n  9. Child\n     more\n     - Leaf\n  10. Next", "bullet", "- Parent\n\n  - Child\n    more\n    - Leaf\n\n  10. Next"],
  ["middle top item", "- Before\n- Child\n  - Leaf\n- Next", "paragraph", "- Before\n\nChild\n- Leaf\n\n- Next"],
]) test(`unselected ancestry survives ${name}`, () => {
  assert.equal(convert(source, target, "Child").text, expected);
});
test("consecutive selected children convert without rewriting their parent or following sibling", () => {
  const source = "- Parent\n  - A\n    - Leaf\n  - B\n  - C\n- Outside";
  assert.equal(convert(source, "number", ["A", "B"]).text,
    "- Parent\n  1. A\n     - Leaf\n  2. B\n  - C\n- Outside");
});
for (const newline of ["\n", "\r\n"]) test(`structured conversions retain newline style ${JSON.stringify(newline)}`, () => {
  for (const target of ["quote", "bullet", "task"]) {
    const source = "First **bold**\nnext 😀\nlast  ".replaceAll("\n", newline);
    const result = convert(source, target);
    assert.ok(result.plan);
    assert.deepEqual(result.text.match(/\r?\n/gu), source.match(/\r?\n/gu));
  }
});
test("mixed newline bytes inside and between selected blocks remain at their boundaries", () => {
  const source = "First\r\ncontinued\n\nSecond\r\ncontinued";
  const result = convert(source, "quote");
  assert.equal(result.text, "> First\r\n> continued\n\n> Second\r\n> continued");
});
for (const [source, target, chosen] of [
  ["---\ntitle: keep\n---", "quote"],
  ["- List\n\n^list-anchor", "number"],
  ["Text\n\n^text-anchor", "h2"],
  ["```\nunfinished", "quote"],
  ["- parent\n  ```\n  unfinished", "number"],
  ["Title\ncontinued", "h1"],
  ["- parent\n  - child", "h1"],
  ["| A |\n| --- |\n| 1 |", "h1"],
  ["```js\ncode();\n```", "h1"],
  ["> [!note]- Title\n> Body", "paragraph"],
  ["## ---", "paragraph"],
  ["## <div>", "paragraph"],
  ["## %%", "paragraph"],
  ["- [ ] ## Looks like heading", "bullet"],
  ["- [x] ---", "bullet"],
  ["    code", "paragraph"],
  ["- Before\n- Last\n\n^list-anchor", "paragraph", "Last"],
]) test(`unsafe/lossy conversion is unavailable: ${JSON.stringify(source)} to ${target}`, () => {
  assert.equal(convert(source, target, chosen).plan, null);
});
test("a list's detached anchor cannot be orphaned by transforming its whole range", () => {
  const source = "- A\n- B\n\n^list";
  const model = parseBlocks(source);
  assert.equal(convertBlock(model, model.blocks[0], "quote"), null);
});
test("foreign, repeated, gapped and mixed-parent selections cannot convert", () => {
  const m = parseBlocks("- Parent\n  - Child\n- Next\n- Last");
  const parent = blockAt(m, 3), next = blockAt(m, m.text.indexOf("Next")), last = blockAt(m, m.text.indexOf("Last"));
  const child = blockAt(m, m.text.indexOf("Child"));
  for (const chosen of [[], [parent, parent], [parent, last], [parent, child], [{ ...parent }], [parent, next, child]])
    assert.equal(convertBlocks(m, chosen, "number"), null);
  assert.equal(convertBlocks(m, [parent], "unknown"), null);
  assert.equal(convertBlock({ ...m, text: "X".repeat(2 * 1024 * 1024 + 1) }, parent, "quote"), null);
});
test("fullwidth text, emoji, links, code whitespace and original siblings survive a converted item", () => {
  const source = "- Before ^before\n- 中文😀 **重点** [[Page|标题]]\n  continuation  \n\n  ```text\n    payload\n  ```\n  - Child ^child\n- After ^after";
  const result = convert(source, "number", "中文");
  assert.equal(result.text, "- Before ^before\n1. 中文😀 **重点** [[Page|标题]]\n   continuation  \n   \n   ```text\n     payload\n   ```\n   - Child ^child\n- After ^after");
  assert.equal((result.text.match(/\^(before|child|after)/gu) ?? []).length, 3);
});
test("new quote/list wrappers keep existing inline node names and content", () => {
  const source = "**bold** and *italic* and `a + b` and [link](https://example.test)\nmore";
  const inline = text => {
    const result = [];
    markdownTree(text).iterate({ enter(n) {
      if (["StrongEmphasis", "Emphasis", "InlineCode", "Link"].includes(n.name)) result.push([n.name, text.slice(n.from, n.to)]);
    } });
    return result;
  };
  for (const target of ["quote", "bullet", "number", "task"])
    assert.deepEqual(inline(convert(source, target).text), inline(source));
});
