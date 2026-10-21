import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSync } from "esbuild";
import vm from "node:vm";
function load(file) {
  const source = buildSync({ entryPoints: [file], bundle: true, write: false, format: "cjs", target: "es2018", tsconfig: "tsconfig.json" }).outputFiles[0].text;
  const module = { exports: {} }; vm.runInNewContext(source, { module, exports: module.exports }); return module.exports;
}
const { lineDocument, lineIndex, lineDragRange, relocateLines, relocateLineBlocks } = load("src/domain/line-drag.ts");
const { parseBlocks } = load("src/domain/blocks.ts");
const { captureLineDrag } = load("src/platform/line-drag.ts");
const { decodePreferences, defaults } = load("src/domain/preferences.ts");
const plain = value => JSON.parse(JSON.stringify(value));
function move(text, first, last, target, after = false) {
  const plan = relocateLines(lineDocument(text), { first, last }, target, after);
  return plan && { text: text.slice(0, plan.from) + plan.insert + text.slice(plan.to), plan };
}
test("whole-block dragging stays the default and only the explicit line value opts in", () => {
  assert.equal(defaults.dragGranularity, "block");
  for (const value of [undefined, null, "paragraph", "anything", {}, true]) assert.equal(decodePreferences({ dragGranularity: value }).dragGranularity, "block");
  assert.equal(decodePreferences({ dragGranularity: "line" }).dragGranularity, "line");
});
test("logical lines preserve mixed newline bytes, terminal blank and Unicode offsets", () => {
  const text = "😀中文\r\nB\n", model = lineDocument(text);
  assert.deepEqual(plain(model.lines), [
    { from: 0, to: 4, text: "😀中文", ending: "\r\n" },
    { from: 6, to: 7, text: "B", ending: "\n" },
    { from: 8, to: 8, text: "", ending: "" }
  ]);
  assert.equal(lineIndex(model, 5), 0); assert.equal(lineIndex(model, 6), 1); assert.equal(lineIndex(model, 8), 2);
  for (const at of [-1, 9, 1.5, NaN]) assert.equal(lineIndex(model, at), -1);
});
test("a line inside multiline prose resolves only that logical line", () => {
  const model = lineDocument("First\nSecond\nThird");
  assert.deepEqual(plain(lineDragRange(model, 7)), { first: 1, last: 1 });
});
test("multiline selection containing the handle wins; an exclusive next-line boundary is not included", () => {
  const model = lineDocument("First\nSecond\nThird\nFourth");
  assert.deepEqual(plain(lineDragRange(model, 7, { from: 2, to: 13 })), { first: 0, last: 1 });
  assert.deepEqual(plain(lineDragRange(model, 14, { from: 2, to: 13 })), { first: 2, last: 2 });
  assert.deepEqual(plain(lineDragRange(model, 7, { from: 10, to: 8 })), { first: 1, last: 1 });
});
for (const eol of ["\n", "\r\n"]) test(`line moves preserve ${JSON.stringify(eol)} and select only moved content`, () => {
  const text = ["First", "第二 😀", "Third"].join(eol), result = move(text, 1, 1, 2, true);
  assert.equal(result.text, ["First", "Third", "第二 😀"].join(eol));
  assert.equal(result.text.slice(result.plan.anchor, result.plan.head), "第二 😀");
  const reverse = move(result.text, 2, 2, 1);
  assert.equal(reverse.text, text);
});
test("line-mode prose may move across paragraph gaps without silently adding indentation", () => {
  assert.equal(move("First\nSecond\n\nLast", 1, 1, 3, true).text, "First\n\nLast\nSecond");
});
test("selected lines move as a group; leading/trailing newline state stays explicit", () => {
  const text = "A\nB\nC\nD\n", result = move(text, 1, 2, 3, true);
  assert.equal(result.text, "A\nD\nB\nC\n");
  assert.equal(result.text.slice(result.plan.anchor, result.plan.head), "B\nC");
});
test("blank lines are independently movable in line mode", () => {
  assert.equal(move("A\n\nB\nC", 1, 1, 3, true).text, "A\nB\nC\n");
  assert.equal(move("\nA\nB", 0, 0, 2, true).text, "A\nB\n");
});
test("a line group can include a trailing blank without dropping it", () => {
  assert.equal(move("A\nB\n\nC", 1, 2, 3, true).text, "A\nC\nB\n");
});
test("same-document alternative drops reuse a baseline without contaminating later plans", () => {
  const text = "A\nB\nC\nD", model = lineDocument(text);
  for (const [target, after, expected] of [[3, true, "A\nC\nD\nB"], [0, false, "B\nA\nC\nD"], [2, true, "A\nC\nB\nD"]]) {
    const plan = relocateLines(model, { first: 1, last: 1 }, target, after);
    assert.equal(text.slice(0, plan.from) + plan.insert + text.slice(plan.to), expected);
  }
});
test("an unchanged result and adjacent/self drops are no-ops", () => {
  for (const args of [[0, 0, 0, true], [0, 0, 1, false], [1, 1, 0, true]]) assert.equal(move("A\nB", ...args), null);
  assert.equal(move("A\nA", 0, 0, 1, true), null);
});
test("leaf list rows can reorder without affecting the surrounding tree", () => {
  assert.equal(move("- A\n- B\n- C", 1, 1, 2, true).text, "- A\n- C\n- B");
  assert.equal(move("- Parent\n  - A\n  - B\n- Next", 1, 1, 2, true).text, "- Parent\n  - B\n  - A\n- Next");
});
test("a parent line cannot abandon its children or absorb a different child", () => {
  assert.equal(move("- A\n  - child A\n- B\n  - child B", 0, 0, 2, true), null);
  assert.equal(move("- A\n  - child A\n- B\n  - child B", 1, 1, 3, true), null);
});
test("a whole selected tree can move between same-level siblings with child ownership intact", () => {
  assert.equal(move("- A\n  - child A\n- B\n  - child B", 0, 1, 3, true).text, "- B\n  - child B\n- A\n  - child A");
});
test("explicit horizontal intent can nest a complete single-line item", () => {
  const text = "- Parent\n- Child\n- Next", model = lineDocument(text), target = parseBlocks(text).blocks.find(b => b.kind === "item");
  const plan = relocateLineBlocks(model, { first: 1, last: 1 }, target, "inside");
  assert.equal(text.slice(0, plan.from) + plan.insert + text.slice(plan.to), "- Parent\n  - Child\n- Next");
});
test("line mode never expands a partial source for horizontal nesting", () => {
  for (const text of ["- Parent\n- Child\n  - Leaf\n- Next", "First\nSecond\n\n- Parent"]) {
    const model = lineDocument(text), target = parseBlocks(text).blocks.find(b => b.kind === "item");
    assert.equal(relocateLineBlocks(model, { first: 1, last: 1 }, target, "inside"), null);
  }
});
test("a fully selected tree in line mode can be nested, and a leaf can be promoted", () => {
  const text = "- Parent\n- Child\n  - Leaf\n- Next", model = lineDocument(text), blocks = parseBlocks(text).blocks;
  const plan = relocateLineBlocks(model, { first: 1, last: 2 }, blocks.find(b => b.kind === "item"), "inside");
  assert.equal(text.slice(0, plan.from) + plan.insert + text.slice(plan.to), "- Parent\n  - Child\n    - Leaf\n- Next");
  const nested = "- Parent\n  - Child\n- Next", parsed = parseBlocks(nested);
  const promoted = relocateLineBlocks(lineDocument(nested), { first: 1, last: 1 }, parsed.blocks.find(b => b.kind === "item" && b.from === 0), "after");
  assert.equal(nested.slice(0, promoted.from) + promoted.insert + nested.slice(promoted.to), "- Parent\n- Child\n- Next");
});
test("fenced code body lines reorder only inside the same intact fence", () => {
  const text = "```js\nfirst();\nsecond();\n```\n\nOutside";
  assert.equal(move(text, 1, 1, 2, true).text, "```js\nsecond();\nfirst();\n```\n\nOutside");
  assert.equal(move(text, 1, 1, 5, true), null);
  assert.equal(move(text, 0, 0, 2, true), null);
  assert.equal(move(text, 3, 3, 1), null);
});
test("table body rows may reorder but a header or delimiter cannot become body content", () => {
  const text = "| Key | Value |\n| --- | --- |\n| A | 1 |\n| B | 2 |";
  assert.equal(move(text, 2, 2, 3, true).text, "| Key | Value |\n| --- | --- |\n| B | 2 |\n| A | 1 |");
  assert.equal(move(text, 0, 0, 3, true), null);
  assert.equal(move(text, 1, 1, 3, true), null);
  assert.equal(move(text, 2, 2, 0), null);
});
test("quote and callout content rows reorder without losing their header", () => {
  assert.equal(move("> A\n> B\n> C", 1, 1, 2, true).text, "> A\n> C\n> B");
  const callout = "> [!note] Note\n> A\n> B";
  assert.equal(move(callout, 1, 1, 2, true).text, "> [!note] Note\n> B\n> A");
  assert.equal(move(callout, 0, 0, 2, true), null);
});
for (const [text, first, target] of [
  ["---\ntitle: Test\n---\n\nText", 1, 4],
  ["```js\nUnfinished\nAnother", 1, 2],
  ["$$\nx + y\n$$\n\nText", 1, 4],
  ["%%\ncomment\n%%\n\nText", 1, 4],
  ["Heading\n=======\n\nText", 0, 3],
  ["<div>\nA\nB\n</div>\n\nText", 1, 2],
  ["First\nSecond\n^owned\n\nLast", 1, 4],
  ["[label]: https://example.com\n  \"title\"\n\nText", 0, 3],
  ["A **bold\nstill bold** end\nThird", 0, 2],
  ["A [label\ncontinued](https://example.com)\nThird", 1, 2],
  ["A ==highlight\ncontinued== end\nThird", 0, 2],
  ["A <span>colour\ncontinued</span> end\nThird", 1, 2]
]) test(`structural/inline boundaries refuse a split: ${JSON.stringify(text.slice(0, 24))}`, () => {
  assert.equal(move(text, first, first, target, true), null);
});
test("an intact multiline inline span travels together", () => {
  assert.equal(move("A **bold\nstill bold** end\nThird", 0, 1, 2, true).text, "Third\nA **bold\nstill bold** end");
});
test("a new leading divider cannot turn existing prose into frontmatter", () => {
  assert.equal(move("Title\n\n---\nText", 2, 2, 0), null);
});
test("bounded invalid input cannot generate a line edit", () => {
  const model = lineDocument("A\nB");
  for (const range of [{ first: -1, last: 0 }, { first: 0, last: 2 }, { first: 1, last: 0 }, { first: 0.5, last: 1 }])
    assert.equal(relocateLines(model, range, 1, true), null);
  assert.equal(relocateLines(model, { first: 0, last: 0 }, 20, true), null);
  assert.equal(lineDragRange(lineDocument("a".repeat(2 * 1024 * 1024 + 1)), 0), null);
});
function editor(text) {
  return { text, from: 0, to: 0, multiple: false,
    getValue() { return this.text; }, getCursor(which) { return { ch: which === "from" ? this.from : this.to }; },
    posToOffset(pos) { return pos.ch; }, listSelections() { return this.multiple ? [{}, {}] : [{}]; }
  };
}
test("capturing a hovered line does not move the real cursor or rewrite the document", () => {
  const e = editor("A\nB\nC"), context = captureLineDrag(e, 2, true, () => true);
  assert.deepEqual(plain(context.range), { first: 1, last: 1 }); assert.equal(e.from, 0); assert.equal(e.text, "A\nB\nC");
});
test("selection opt-out only drags the hovered logical line", () => {
  const e = editor("A\nB\nC"); e.to = 3;
  assert.deepEqual(plain(captureLineDrag(e, 2, true, () => true).range), { first: 0, last: 1 });
  assert.deepEqual(plain(captureLineDrag(e, 2, false, () => true).range), { first: 1, last: 1 });
});
for (const changed of ["text", "caret", "multiple", "guard"]) test(`line drag rejects stale ${changed}`, () => {
  const e = editor("A\nB\nC"); let allowed = true;
  const context = captureLineDrag(e, 2, true, () => allowed);
  if (changed === "text") e.text = "new text";
  if (changed === "caret") e.from = e.to = 1;
  if (changed === "multiple") e.multiple = true;
  if (changed === "guard") allowed = false;
  assert.equal(context.valid(), false);
});
