import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
class Editor {
  constructor(text) { this.text = text; this.from = 0; this.to = text.length; this.edits = []; this.multiple = false; }
  getValue() { return this.text; }
  getCursor(which) { return this.offsetToPos(which === "from" ? this.from : this.to); }
  listSelections() { return this.multiple ? [{}, {}] : [{}]; }
  posToOffset(p) { return this.text.split("\n").slice(0, p.line).reduce((n, s) => n + s.length + 1, p.ch); }
  offsetToPos(offset) { const lines = this.text.slice(0, offset).split("\n"); return { line: lines.length - 1, ch: lines.at(-1).length }; }
  setSelection(a, b) { this.from = this.posToOffset(a); this.to = this.posToOffset(b); }
  replaceRange(insert, a, b, origin) {
    const from = this.posToOffset(a), to = this.posToOffset(b);
    this.edits.push({ before: this.text, origin }); this.text = this.text.slice(0, from) + insert + this.text.slice(to);
  }
  focus() { this.focused = true; }
}
function setup(text = "Selected") {
  const notices = [], dialogs = [], menus = [], chosen = [];
  class Modal {
    constructor(app) { this.app = app; }
    open() { dialogs.push(this); }
    close() { this.closed = true; this.onClose?.(); }
  }
  class SuggestModal extends Modal { setPlaceholder() {} onClose() { this.cleaned = true; } }
  class Menu {
    items = [];
    addItem(fn) {
      const item = { setTitle(v) { this.title = v; return this; }, setIcon() { return this; },
        setDisabled(v) { this.disabled = v; return this; }, onClick(fn) { this.click = fn; return this; } };
      fn(item); this.items.push(item); return this;
    }
    addSeparator() { return this; }
    onHide(fn) { this.hidden = fn; }
    showAtPosition(point, doc) { menus.push(this); this.point = point; this.doc = doc; }
    hide() { this.closed = true; this.hidden?.(); }
  }
  const host = { Modal, SuggestModal, Menu, Notice: class { constructor(s) { notices.push(s); } } };
  const module = { exports: {} };
  vm.runInNewContext(readFileSync(new URL("../.test-build/platform/rich-format.cjs", import.meta.url), "utf8"), {
    module, exports: module.exports, URL, console, require: name => { assert.equal(name, "obsidian"); return host; }
  });
  const editor = new Editor(text), file = { path: "Start.md" }, state = { composing: false, removed: false, viewChanged: false, guard: true };
  const app = {
    vault: { getAbstractFileByPath: path => !state.removed && path === file.path ? file : null },
    workspace: { getLeavesOfType: () => [{ view: { editor, file: state.viewChanged ? {} : file } }] }
  };
  const insertion = { capture: () => ({ from: editor.from, to: editor.to, selected: editor.text.slice(editor.from, editor.to), valid: () => context().valid() }),
    pickFile: (context, kind) => chosen.push({ context, kind }), open: context => chosen.push({ context }) };
  const controller = new module.exports.RichFormatting(app, () => false, () => insertion, () => state.composing);
  const context = () => controller.capture(editor, file, () => state.guard);
  const menu = () => controller.link(context(), { x: 10, y: 20 }, {});
  return { ...module.exports, controller, editor, file, state, notices, dialogs, menus, chosen, context, menu };
}
test("native colour and link adapters make a single edit and retain the label selection", () => {
  for (const type of ["color", "url"]) {
    const s = setup();
    assert.ok(type === "color" ? s.controller.color(s.context(), { text: "blue" }) : s.controller.url(s.context(), "mailto:hi@example.com"));
    assert.equal(s.editor.edits.length, 1); assert.equal(s.editor.edits[0].origin, "keyline-next-format");
    assert.equal(s.editor.text.slice(s.editor.from, s.editor.to), "Selected"); assert.equal(s.editor.focused, true);
  }
});
for (const changed of ["text", "selection", "file", "view", "removed", "multiple", "composition", "guard", "disposed"])
  test(`captured rich-format action fails closed after ${changed}`, () => {
    const s = setup(), c = s.context();
    if (changed === "text") s.editor.text += ".";
    if (changed === "selection") s.editor.from = 1;
    if (changed === "file") s.file.path = "Renamed.md";
    if (changed === "view") s.state.viewChanged = true;
    if (changed === "removed") s.state.removed = true;
    if (changed === "multiple") s.editor.multiple = true;
    if (changed === "composition") s.state.composing = true;
    if (changed === "guard") s.state.guard = false;
    if (changed === "disposed") s.controller.dispose();
    assert.equal(s.controller.color(c, { text: "red" }), false);
    assert.equal(s.controller.url(c, "https://example.com/"), false);
    assert.equal(s.editor.edits.length, 0); assert.equal(s.editor.focused, undefined);
  });
test("cancelling native menus and dialogs leaves source and selection untouched", () => {
  const s = setup(); s.menu(); s.menus[0].hide();
  s.controller.colors(s.context()); s.dialogs[0].close();
  s.menu(); s.menus.at(-1).items[1].click(); s.dialogs.at(-1).close();
  assert.equal(s.editor.text, "Selected"); assert.equal(s.editor.from, 0); assert.equal(s.editor.to, 8);
  assert.equal(s.editor.edits.length, 0);
});
test("existing URL label chosen as page replaces the complete link, not a nested fragment", () => {
  const s = setup('Before [full label](https://old.test/ "title") after');
  s.editor.from = s.editor.text.indexOf("label"); s.editor.to = s.editor.from + 5;
  s.menu(); s.menus[0].items[0].click();
  const chosen = s.chosen[0]; assert.ok(chosen); assert.equal(chosen.kind, "wiki");
  assert.equal(chosen.context.selected, "full label");
  assert.equal(s.editor.text.slice(chosen.context.from, chosen.context.to), '[full label](https://old.test/ "title")');
  assert.equal(s.editor.edits.length, 0);
});
test("stale page menu does not open a second picker or alter source", () => {
  const s = setup(); s.menu(); s.editor.text += ".";
  s.menus[0].items[0].click(); assert.equal(s.chosen.length, 0); assert.equal(s.editor.edits.length, 0);
});
test("more-menu conversion and rich dialogs close on unload and cannot later commit", () => {
  const s = setup(); s.controller.colors(s.context()); s.menu(); s.menus.at(-1).items[1].click();
  s.controller.blocks(s.context(), { x: 10, y: 20 }, {});
  s.menus.at(-1).items.at(-1).click();
  assert.equal(s.dialogs.length, 3);
  s.controller.dispose();
  assert.ok(s.dialogs.every(d => d.closed)); assert.ok(s.menus.every(m => m.closed));
  s.dialogs.at(-1).onChooseSuggestion("h1"); assert.equal(s.editor.edits.length, 0);
});
test("multiline toolbar conversion opens for a group and unload invalidates its cached choices", () => {
  const s = setup("- A\n  - Child\n- B");
  s.controller.convert(s.context());
  assert.equal(s.dialogs.length, 1);
  assert.ok(s.dialogs[0].getSuggestions("").includes("number"));
  s.controller.dispose();
  s.dialogs[0].onChooseSuggestion("number");
  assert.equal(s.editor.edits.length, 0);
});
