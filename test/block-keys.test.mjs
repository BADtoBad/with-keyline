import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import vm from "node:vm";
import { readFileSync } from "node:fs";
const require = createRequire(import.meta.url);
const { parseBlocks, applyBlockEdit } = require("../.test-build/domain/blocks.cjs");
const { expandBlockSelection, backspaceBlock } = require("../.test-build/domain/block-keys.cjs");
test("select all escalates through a child, child list, parent, list and document", () => {
  const text = "Intro.\n\n- Parent\n  - Child\n  - Other\n- Next\n\nTail.", model = parseBlocks(text);
  let selection = { anchor: text.indexOf("Child") + 1, head: text.indexOf("Child") + 1 };
  for (const expected of ["  - Child", "  - Child\n  - Other", "- Parent\n  - Child\n  - Other", "- Parent\n  - Child\n  - Other\n- Next", text]) {
    selection = expandBlockSelection(model, selection.anchor, selection.head);
    assert.ok(selection);
    assert.equal(text.slice(selection.anchor, selection.head), expected);
  }
  assert.equal(expandBlockSelection(model, 0, text.length), null);
});
test("single-child identical bounds are skipped while expanding", () => {
  const model = parseBlocks("- Parent\n  - Child\n\nTail.");
  const start = model.text.indexOf("Child"), first = expandBlockSelection(model, start, start);
  const second = expandBlockSelection(model, first.anchor, first.head);
  assert.equal(model.text.slice(second.anchor, second.head), "- Parent\n  - Child");
});
for (const [text, at] of [["---\nx: 1\n---", 5], ["One\n\nTwo", 4], ["", 0]])
  test(`select all delegates protected or empty context ${JSON.stringify(text)}`, () => assert.equal(expandBlockSelection(parseBlocks(text), at, at), null));
for (const [input, output, cursor] of [
  ["## |Heading", "Heading", 0], ["> |Quote", "Quote", 0],
  ["- |Item", "Item", 0], ["1. |Numbered", "Numbered", 0],
  ["- [x] |Done\n- Next", "- Done\n- Next", 2],
  ["- Parent\n  - |Child\n    - Leaf\n- Next", "- Parent\n- Child\n  - Leaf\n- Next", 11],
  ["- Parent\n  - A\n  - |Child\n  - Z\n- Next", "- Parent\n  - A\n  - Z\n- Child\n- Next", 23]
]) test(`Backspace removes one layer: ${JSON.stringify(input)}`, () => {
  const offset = input.indexOf("|"), model = parseBlocks(input.replace("|", ""));
  const plan = backspaceBlock(model, offset);
  assert.ok(plan);
  assert.equal(applyBlockEdit(model.text, plan), output);
  assert.equal(plan.anchor, cursor); assert.equal(plan.head, cursor);
});
for (const input of [
  "Text |middle", "```\n|code\n```", "---\nx: |1\n---", "> [!note] |Callout",
  "- |Parent\n  - Child", "> |multi\n> quote", "## |---", "## |%%", "## |<div>",
  "> |## Heading", "- |First\n- Second"
]) test(`Backspace delegates uncertain context: ${JSON.stringify(input)}`, () => {
  assert.equal(backspaceBlock(parseBlocks(input.replace("|", "")), input.indexOf("|")), null);
});

function fixture(value = "- Parent\n  - Child\n- Next") {
  const module = { exports: {} };
  vm.runInNewContext(readFileSync(new URL("../.test-build/platform/block-keys.cjs", import.meta.url), "utf8"), {
    module, exports: module.exports,
    require: name => name === "obsidian" ? { editorInfoField: "info" } :
      name === "@codemirror/state" ? { Prec: { highest: x => x }, Transaction: { userEvent: { of: x => x } } } :
        name === "@codemirror/view" ? { keymap: { of: x => x } } : assert.fail(name)
  });
  const prefs = { blockKeys: true }, at = value.indexOf("Child"), range = { from: at, to: at, head: at, empty: true }, updates = [];
  const view = { hasFocus: true, composing: false, state: { readOnly: false, doc: { length: value.length, toString: () => value },
    selection: { main: range, ranges: [range] }, field: () => ({ file: {} }) }, dispatch: update => updates.push(update) };
  const controller = new module.exports.BlockKeys(() => prefs), keys = controller.extension();
  return { controller, keys, view, prefs, updates, run: key => keys.find(k => k.key === key).run(view) };
}
test("keymap owns only Mod+A and unmodified Backspace; selection is non-mutating", () => {
  const f = fixture();
  assert.deepEqual(Array.from(f.keys, k => k.key), ["Mod-a", "Backspace"]);
  assert.equal(f.run("Mod-a"), true);
  assert.equal(f.updates[0].changes, undefined);
  assert.equal(f.updates[0].annotations, "select");
});
test("Backspace dispatches one document transaction with a collapsed caret", () => {
  const f = fixture(); assert.equal(f.run("Backspace"), true);
  assert.equal(f.updates.length, 1);
  assert.equal(f.updates[0].annotations, "delete.backward");
  assert.equal(f.updates[0].selection.anchor, 11);
  assert.equal(f.updates[0].selection.head, undefined);
});
for (const guard of ["disabled", "unload", "composing", "readOnly", "multiple", "unfocused", "missingFile", "huge"])
  test(`block keyboard guard: ${guard}`, () => {
    const f = fixture();
    if (guard === "disabled") f.prefs.blockKeys = false;
    if (guard === "unload") f.controller.dispose();
    if (guard === "composing") f.view.composing = true;
    if (guard === "readOnly") f.view.state.readOnly = true;
    if (guard === "multiple") f.view.state.selection.ranges.push(f.view.state.selection.main);
    if (guard === "unfocused") f.view.hasFocus = false;
    if (guard === "missingFile") f.view.state.field = () => undefined;
    if (guard === "huge") f.view.state.doc.length = 2 * 1024 * 1024 + 1;
    assert.equal(f.run("Mod-a"), false); assert.equal(f.run("Backspace"), false);
    assert.equal(f.updates.length, 0);
  });
test("Backspace never takes over a nonempty selection", () => {
  const f = fixture(); f.view.state.selection.main.empty = false;
  assert.equal(f.run("Backspace"), false); assert.equal(f.updates.length, 0);
});
