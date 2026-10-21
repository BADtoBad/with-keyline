import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
const module = { exports: {} }, notices = [];
vm.runInNewContext(readFileSync(new URL("../.test-build/platform/block-commands.cjs", import.meta.url), "utf8"), {
  module, exports: module.exports, require: name => {
    assert.equal(name, "obsidian");
    return { Notice: class { constructor(s) { notices.push(s); } }, SuggestModal: class { setPlaceholder() {} } };
  }, console
});
const { captureBlock, blockActionPlan, performBlock, commitBlockEdit, BlockConvertPicker } = module.exports;
class Editor {
  constructor(text, at = 0) { this.text = text; this.from = this.to = at; this.edits = []; this.multiple = false; }
  getValue() { return this.text; }
  getCursor(which) { return this.offsetToPos(which === "from" ? this.from : this.to); }
  getSelection() { return this.text.slice(this.from, this.to); }
  listSelections() { return this.multiple ? [{}, {}] : [{}]; }
  posToOffset(p) { const lines = this.text.split("\n"); return lines.slice(0, p.line).reduce((n, s) => n + s.length + 1, 0) + p.ch; }
  offsetToPos(offset) { const lines = this.text.slice(0, offset).split("\n"); return { line: lines.length - 1, ch: lines.at(-1).length }; }
  setSelection(a, b) { this.from = this.posToOffset(a); this.to = this.posToOffset(b); }
  replaceRange(insert, a, b, origin) {
    const from = this.posToOffset(a), to = this.posToOffset(b);
    this.edits.push({ old: this.text, origin }); this.text = this.text.slice(0, from) + insert + this.text.slice(to);
  }
  focus() { this.focused = true; }
}
test("block selection changes only selection, not document", () => {
  const editor = new Editor("- parent\n  - child\n- next", 3);
  assert.ok(performBlock(captureBlock(editor), "select"));
  assert.equal(editor.getSelection(), "- parent\n  - child");
  assert.equal(editor.edits.length, 0);
});
test("native block adapter uses one edit and selects the moved block", () => {
  const editor = new Editor("- first\n  - child\n- second", 3);
  assert.ok(performBlock(captureBlock(editor), "down"));
  assert.equal(editor.text, "- second\n- first\n  - child");
  assert.equal(editor.getSelection(), "- first\n  - child");
  assert.equal(editor.edits.length, 1);
  assert.equal(editor.edits[0].origin, "set", "planned replacements are not interpreted as typed list edits");
});
test("hovered block actions preserve the actual caret until an explicit action", () => {
  const editor = new Editor("First.\n\nSecond.\n\nThird.", 0);
  const context = captureBlock(editor, () => true, { from: 8, to: 15 });
  assert.equal(editor.from, 0);
  assert.equal(context.blocks[0].kind, "paragraph");
  assert.ok(performBlock(context, "down"));
  assert.equal(editor.text, "First.\n\nThird.\n\nSecond.");
  assert.equal(editor.edits.length, 1);
});
test("partially selected sibling blocks move as a complete group in one edit", () => {
  const editor = new Editor("- A\n- B\n- C", 2); editor.to = 7;
  assert.ok(performBlock(captureBlock(editor), "down"));
  assert.equal(editor.text, "- C\n- A\n- B");
  assert.equal(editor.getSelection(), "- A\n- B");
  assert.equal(editor.edits.length, 1);
});
test("indent commands reparent a selected group and keep one undo transaction", () => {
  const editor = new Editor("- Parent\n- A\n  - leaf\n- B\n- Next", 11); editor.to = 24;
  assert.ok(performBlock(captureBlock(editor), "indent"));
  assert.equal(editor.text, "- Parent\n  - A\n    - leaf\n  - B\n- Next");
  assert.equal(editor.getSelection(), "  - A\n    - leaf\n  - B");
  assert.equal(editor.edits.length, 1);
  assert.ok(performBlock(captureBlock(editor), "outdent"));
  assert.equal(editor.text, "- Parent\n- A\n  - leaf\n- B\n- Next");
  assert.equal(editor.edits.length, 2);
});
test("a pure-indent plan still rejects later changed document or selection", () => {
  for (const changed of ["text", "selection"]) {
    const editor = new Editor("- Parent\n- Child", 11), context = captureBlock(editor);
    const plan = blockActionPlan(context, "indent");
    assert.ok(plan);
    if (changed === "text") editor.text += "\nExternal edit";
    else editor.from = editor.to = 0;
    assert.equal(commitBlockEdit(context, plan), false);
    assert.equal(editor.edits.length, 0);
  }
});
for (const mutation of ["text", "selection", "file", "multiple"]) test(`stale block action is ignored: ${mutation}`, () => {
  const editor = new Editor("One.\n\nTwo.");
  let valid = true; const context = captureBlock(editor, () => valid), plan = blockActionPlan(context, "down");
  if (mutation === "text") editor.text = "Changed.\n\nTwo.";
  if (mutation === "selection") editor.from = editor.to = 1;
  if (mutation === "file") valid = false;
  if (mutation === "multiple") editor.multiple = true;
  assert.equal(commitBlockEdit(context, plan), false);
  assert.equal(editor.edits.length, 0);
});
test("blocked or very large documents do not enter block actions", () => {
  assert.equal(captureBlock(new Editor("---\ntitle: protected\n---")), null);
  assert.equal(captureBlock(new Editor("x".repeat(2 * 1024 * 1024 + 1))), null);
  assert.equal(captureBlock(new Editor("normal"), () => false), null);
});
test("conversion picker checks the captured context at commit", () => {
  const editor = new Editor("Some text");
  const picker = new BlockConvertPicker({}, captureBlock(editor), false);
  assert.ok(picker.getSuggestions("标题").includes("h6"));
  editor.text = "New text";
  assert.equal(picker.getSuggestions("").length, 0);
  picker.onChooseSuggestion("h1");
  assert.equal(editor.edits.length, 0); assert.ok(notices.length);
});
test("conversion picker transforms a selected group in one edit and preserves descendants", () => {
  const editor = new Editor("- A\n  - Child\n- B\n- Outside", 2); editor.to = 17;
  const picker = new BlockConvertPicker({}, captureBlock(editor), false);
  assert.ok(picker.getSuggestions("number").includes("number"));
  picker.onChooseSuggestion("number");
  assert.equal(editor.text, "1. A\n   - Child\n2. B\n- Outside");
  assert.equal(editor.edits.length, 1);
  assert.equal(editor.getSelection(), "A\n   - Child\n2. B");
});
for (const changed of ["text", "selection", "multiple", "guard"]) test(`cached conversion plan rejects changed ${changed}`, () => {
  const editor = new Editor("First\ncontinued"); let live = true;
  const picker = new BlockConvertPicker({}, captureBlock(editor, () => live), false);
  assert.ok(picker.getSuggestions("").includes("quote"));
  if (changed === "text") editor.text += ".";
  if (changed === "selection") editor.from = editor.to = 1;
  if (changed === "multiple") editor.multiple = true;
  if (changed === "guard") live = false;
  picker.onChooseSuggestion("quote");
  assert.equal(editor.edits.length, 0);
});
