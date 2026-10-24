import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

function load(file, host) {
  const module = { exports: {} };
  vm.runInNewContext(readFileSync(new URL(`../.test-build/${file}.cjs`, import.meta.url), "utf8"), {
    module, exports: module.exports, require: name => {
      if (name === "@codemirror/view") return { WidgetType: class {}, ViewPlugin: { define() {} } };
      if (name === "@codemirror/language") return {};
      if (name === "@codemirror/state") return { StateEffect: { define() { return {}; } } };
      assert.equal(name, "obsidian"); return { Modal: class {}, ...host };
    },
    setTimeout, clearTimeout, console
  });
  return module.exports;
}
class Editor {
  constructor(text) { this.text = text; this.pos = { line: 0, ch: text.length }; this.writes = []; this.selected = false; this.count = 1; }
  getLine(n) { return this.text.split("\n")[n]; }
  getCursor() { return this.pos; }
  somethingSelected() { return this.selected; }
  listSelections() { return Array(this.count).fill({ anchor: this.pos, head: this.pos }); }
  posToOffset(p) { return this.text.split("\n").slice(0, p.line).reduce((n, s) => n + s.length + 1, p.ch); }
  getRange(a, b) { return this.text.slice(this.posToOffset(a), this.posToOffset(b)); }
  replaceRange(value, a, b) { this.writes.push(value); this.text = this.text.slice(0, this.posToOffset(a)) + value + this.text.slice(this.posToOffset(b)); }
  setCursor(p) { this.pos = p; }
}
function setup(text = "@Plan") {
  const notices = [];
  class TFile { constructor(path) { this.path = path; this.basename = "Plan"; } }
  class EditorSuggest { constructor(app) { this.app = app; } setInstructions() {} close() { this.closed = true; } }
  const host = { EditorSuggest, TFile, Notice: class { constructor(s) { notices.push(s); } }, getLanguage: () => "en" };
  const { DatePageSuggest } = load("platform/mention-suggest", host);
  const file = new TFile("Work/Plan.md");
  const state = { enabled: true, composing: false, removed: false, cache: null, link: "Work/Plan" };
  const app = {
    metadataCache: { getFileCache: () => state.cache, fileToLinktext: () => state.link },
    vault: { getMarkdownFiles: () => [file], getAbstractFileByPath: () => state.removed ? null : file }
  };
  const editor = new Editor(text);
  const suggest = new DatePageSuggest(app, () => state.enabled, () => false, () => state.composing);
  const hit = suggest.onTrigger(editor.pos, editor, file);
  if (hit) suggest.context = { ...hit, editor, file };
  return { suggest, editor, state, notices };
}
const page = { kind: "page", path: "Work/Plan.md", label: "Plan" };
test("opening and cancelling suggestions never mutate literal input", () => {
  const { suggest, editor } = setup();
  assert.equal(suggest.getSuggestions(suggest.context)[0].kind, "page");
  suggest.close(); assert.equal(editor.text, "@Plan"); assert.equal(editor.writes.length, 0);
});
test("explicit page choice uses host-disambiguated link in a single edit", () => {
  const { suggest, editor } = setup();
  suggest.selectSuggestion(page); assert.equal(editor.text, "[[Work/Plan]]");
  assert.equal(editor.writes.length, 1); assert.equal(editor.pos.ch, 13);
});
test("date selection replaces only trigger range", () => {
  const { suggest, editor } = setup("Meet @");
  suggest.selectSuggestion({ kind: "date", key: "today", label: "Today", insert: "2026-10-20" });
  assert.equal(editor.text, "Meet 2026-10-20"); assert.equal(editor.writes.length, 1);
});
for (const kind of ["stale", "removed", "disabled", "composition", "selection", "multi", "code", "unsafe"]) {
  test(`unsafe selection is ignored: ${kind}`, () => {
    const { suggest, editor, state } = setup();
    if (kind === "stale") editor.text = "@Done";
    if (kind === "removed") state.removed = true;
    if (kind === "disabled") state.enabled = false;
    if (kind === "composition") state.composing = true;
    if (kind === "selection") editor.selected = true;
    if (kind === "multi") editor.count = 2;
    if (kind === "code") state.cache = { sections: [{ type: "code", position: { start: { offset: 0 }, end: { offset: 100 } } }] };
    if (kind === "unsafe") state.link = "Work/Plan#1";
    suggest.selectSuggestion(page);
    assert.equal(editor.writes.length, 0);
  });
}
for (const text of ["email@example.com", "---\ntitle: @", "```md\n@"]) {
  test(`native adapter rejects protected context: ${text}`, () => {
    const { suggest, editor } = setup(text);
    editor.pos = { line: text.split("\n").length - 1, ch: text.split("\n").at(-1).length };
    assert.equal(suggest.onTrigger(editor.pos, editor, null), null);
  });
}
test("mobile initializes existing settings but unload during load prevents late features and writes", async () => {
  let resolve, loads = 0;
  const callbacks = [];
  const host = { Platform: { isMobile: true }, Plugin: class {
    loadData() { loads++; return new Promise(r => { resolve = r; }); } saveData() { throw Error("unexpected save"); }
    register(fn) { callbacks.push(fn); } addCommand() { throw Error("late command"); }
  }, PluginSettingTab: class {}, EditorSuggest: class {}, SuggestModal: class {}, Notice: class {}, getLanguage: () => "en" };
  const Plugin = load("main", host).default, plugin = new Plugin();
  const start = plugin.onload(); callbacks.forEach(fn => fn()); resolve(null); await start;
  assert.equal(loads, 1); assert.equal(plugin.store, undefined);
});
test("unload during asynchronous initialization prevents registering late features", async () => {
  let resolve;
  const callbacks = [];
  const host = { Platform: { isMobile: false }, Plugin: class {
    register(fn) { callbacks.push(fn); }
    loadData() { return new Promise(r => { resolve = r; }); }
    addCommand() { throw Error("late command"); }
  }, PluginSettingTab: class {}, EditorSuggest: class {}, SuggestModal: class {} };
  const Plugin = load("main", host).default, plugin = new Plugin();
  const start = plugin.onload(); callbacks.forEach(fn => fn()); resolve(null); await start;
  assert.equal(plugin.store, undefined);
});
