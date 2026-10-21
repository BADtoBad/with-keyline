import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url), { decodePreferences } = require("../.test-build/domain/preferences.cjs");
function fixture(text = "**bold**") {
  const notices = [], timers = [], updates = [];
  const target = () => ({ handlers: new Map(), addEventListener(k, fn) { const a = this.handlers.get(k) ?? []; a.push(fn); this.handlers.set(k, a); },
    removeEventListener(k, fn) { this.handlers.set(k, (this.handlers.get(k) ?? []).filter(f => f !== fn)); },
    emit(k, event = {}) { for (const fn of this.handlers.get(k) ?? []) fn(event); } });
  const doc = target(); doc.defaultView = target();
  const mark = spec => ({ range: (from, to) => ({ from, to, spec }) });
  const host = { editorInfoField: "info", editorLivePreviewField: "preview",
    Notice: class { constructor(text) { this.text = text; notices.push(this); } hide() { this.hidden = true; } } };
  const modules = {
    obsidian: host,
    "@codemirror/language": { syntaxTree: s => s.tree, syntaxTreeAvailable: s => s.parsed },
    "@codemirror/state": { Prec: { highest: value => value }, StateEffect: { define() { const type = { of: value => ({ value, is: other => other === type }) }; return type; } }, Transaction: { userEvent: { of: event => ({ event }) } } },
    "@codemirror/view": { WidgetType: class {}, Decoration: { none: [], replace: mark, line: mark, mark, set: ranges => ranges },
      ViewPlugin: { define: (create, spec) => ({ create, spec }) },
      EditorView: { inputHandler: { of: fn => fn }, atomicRanges: { of: fn => fn },
        scrollIntoView: (at, options) => ({ at, options, is: () => false }) } }
  };
  const module = { exports: {} };
  vm.runInNewContext(readFileSync(new URL("../.test-build/platform/writing.cjs", import.meta.url), "utf8"), {
    module, exports: module.exports, require: name => { assert.ok(modules[name], name); return modules[name]; }, console,
    setTimeout: fn => { const t = { fn }; timers.push(t); return t; }, clearTimeout: t => { if (t) t.cancelled = true; }
  });
  const prefs = decodePreferences({ language: "en" }), editor = {};
  const state = (value, live = true, tree) => {
    const selection = { from: value.length, to: value.length, head: value.length, empty: true };
    return { doc: { length: value.length, toString: () => value }, field: key => key === "info" ? { editor, file: {} } : key === "preview" ? live : undefined,
      readOnly: false, parsed: true, selection: { ranges: [selection], main: selection },
      tree: tree ?? { iterate({ enter }) { if (value === "**bold**") for (const [from, to] of [[0, 2], [6, 8]]) enter({ name: "formatting_formatting-strong_strong", from, to }); } } };
  };
  let instance;
  const view = { state: state(text), composing: false, hasFocus: true, focus() {}, dom: { ownerDocument: doc }, viewport: { from: 0, to: text.length },
    visibleRanges: [{ from: 0, to: text.length }],
    dispatch(spec) {
      const startState = this.state, before = startState.doc.toString(), change = spec.changes;
      const value = change ? before.slice(0, change.from) + change.insert + before.slice(change.to) : before;
      this.state = state(value, startState.field("preview"), change ? undefined : startState.tree);
      const at = spec.selection?.anchor ?? startState.selection.main.head;
      this.state.selection.main = { from: at, to: at, head: at, empty: true };
      this.state.selection.ranges = [this.state.selection.main];
      this.viewport.to = value.length; this.visibleRanges = [{ from: 0, to: value.length }];
      updates.push(spec);
      instance?.update({ state: this.state, startState, docChanged: !!change, selectionSet: !!spec.selection, viewportChanged: !!change,
        transactions: [{ effects: spec.effects ? [spec.effects] : [], isUserEvent: e => e === spec.annotations?.event }],
        changes: { iterChangedRanges(fn) { if (change) fn(change.from, change.to, change.from, change.from + change.insert.length); } } });
    } };
  const controller = new module.exports.WritingController(() => prefs, () => false), [plugin, input] = controller.extension();
  instance = plugin.create(view);
  const flush = () => { let n = 0; while (timers.length) { const t = timers.shift(); if (!t.cancelled) t.fn(); if (++n > 50) throw Error("Runaway timer"); } };
  const type = inputText => input(view, view.state.selection.main.from, view.state.selection.main.to, inputText, () => ({
    changes: { from: view.state.selection.main.from, to: view.state.selection.main.to, insert: inputText },
    selection: { anchor: view.state.selection.main.from + inputText.length }, isUserEvent: e => e === "input.type"
  }));
  return { controller, instance, view, prefs, doc, updates, notices, flush, type, input, state };
}
test("live/source field changes refresh markers without a text or selection change", () => {
  const f = fixture();
  assert.equal(f.instance.applied, 2);
  let before = f.view.state;
  f.view.state = f.state("**bold**", false, before.tree);
  f.instance.update({ state: f.view.state, startState: before, transactions: [] });
  assert.equal(f.instance.applied, 0);
  before = f.view.state; f.view.state = f.state("**bold**", true, before.tree);
  f.instance.update({ state: f.view.state, startState: before, transactions: [] });
  assert.equal(f.instance.applied, 2); assert.equal(f.updates.length, 0);
});
test("Option reveal clears on keyup, window blur and document visibility changes", () => {
  const f = fixture();
  for (const release of [() => f.doc.emit("keyup", { key: "Alt", altKey: false }), () => f.doc.defaultView.emit("blur"), () => f.doc.emit("visibilitychange")]) {
    f.doc.emit("keydown", { key: "Alt" }); assert.equal(f.instance.applied, 0);
    release(); assert.equal(f.instance.applied, 2);
  }
  assert.equal(f.view.state.doc.toString(), "**bold**");
  assert.ok(f.updates.every(u => !u.changes));
});
test("dispose removes document listeners and disables pending input hooks", () => {
  const f = fixture("【"); f.controller.dispose(); f.instance.destroy();
  assert.ok([...f.doc.handlers.values(), ...f.doc.defaultView.handlers.values()].every(a => a.length === 0));
  assert.equal(f.type("【"), false);
});
test('Option reveal listeners follow an existing editor to another window and back without leaking counts',()=>{
  const f=fixture(),other=fixture();other.controller.dispose();
  for(const doc of [other.doc,f.doc,other.doc]){
    const old=f.view.dom.ownerDocument;f.view.dom.ownerDocument=doc;
    f.instance.update({state:f.view.state,startState:f.view.state,transactions:[]});
    assert.ok([...old.handlers.values(),...old.defaultView.handlers.values()].every(a=>!a.length));
    assert.equal(doc.handlers.get('keydown').length,1);
    doc.emit('keydown',{key:'Alt'});assert.equal(f.instance.applied,0);
    doc.emit('keyup',{key:'Alt',altKey:false});assert.equal(f.instance.applied,2);
  }
  f.instance.destroy();assert.ok([...other.doc.handlers.values(),...other.doc.defaultView.handlers.values()].every(a=>!a.length));
});
for (const guard of ["composing", "readOnly", "multi", "paste"]) test(`fullwidth input stays native when ${guard}`, () => {
  const f = fixture("【");
  if (guard === "composing") f.view.composing = true;
  if (guard === "readOnly") f.view.state.readOnly = true;
  if (guard === "multi") f.view.state.selection.ranges.push(f.view.state.selection.main);
  const result = guard === "paste" ? f.input(f.view, 1, 1, "【", () => ({ isUserEvent: e => e === "input.paste" })) : f.type("【");
  assert.equal(result, false); assert.equal(f.updates.length, 0);
});
test("turning normalization off delegates typed pairs to native handling", () => {
  const f = fixture("【"); f.prefs.fullwidthLinks = false;
  assert.equal(f.type("【"), false); assert.equal(f.updates.length, 0);
});
test("typed fullwidth pair uses one editor transaction with explicit cursor", () => {
  const f = fixture("【");
  assert.equal(f.type("【"), true); assert.equal(f.view.state.doc.toString(), "[[]]");
  assert.equal(f.view.state.selection.main.head, 2); assert.equal(f.updates.length, 1);
  assert.equal(f.updates[0].annotations.event, "input.type");
});
test("protected fullwidth input delegates to native handling without a plugin transaction", () => {
  const f = fixture("```\n【");
  assert.equal(f.type("【"), false); assert.equal(f.updates.length, 0);
});
test("composition stays literal until committed, then normalizes only the bracket insertion", () => {
  const f = fixture("");
  f.view.composing = true; f.instance.beginComposition(); f.flush();
  f.view.dispatch({ changes: { from: 0, to: 0, insert: "【【" }, selection: { anchor: 2 }, annotations: { event: "input.type.compose" } });
  assert.equal(f.view.state.doc.toString(), "【【");
  f.view.composing = false; f.instance.endComposition(); f.flush();
  assert.equal(f.view.state.doc.toString(), "[[]]"); assert.equal(f.view.state.selection.main.head, 2);
});
test("ordinary Chinese composition and cancelled composition do not rewrite text", () => {
  for (const insert of ["中文输入", ""]) {
    const f = fixture(""); f.view.composing = true; f.instance.beginComposition();
    f.view.dispatch({ changes: { from: 0, to: 0, insert }, selection: { anchor: insert.length } });
    f.view.composing = false; f.instance.endComposition(); f.flush();
    assert.equal(f.view.state.doc.toString(), insert);
    assert.equal(f.updates.filter(u => u.changes).length, 1);
  }
});
test("suspicious navigation reveals first, then selects without editing text", () => {
  const f = fixture("**broken"), editor = f.instance.editor;
  Object.assign(editor, {
    getCursor: () => ({ line: 0, ch: 0 }),
    posToOffset: p => p.ch
  });
  assert.equal(f.controller.next(editor), true);
  assert.equal(f.updates.length, 1);
  assert.equal(f.updates[0].selection.anchor, 0);
  assert.equal(f.updates[0].effects.at, 0); assert.equal(f.updates[0].effects.options.y, "center");
  f.flush();
  assert.equal(f.updates.length, 2);
  assert.equal(f.updates[1].selection.head, 2);
  assert.ok(f.updates.every(u => !u.changes));
  f.view.composing = true;
  assert.equal(f.controller.next(editor), false); assert.equal(f.updates.length, 2);
});
for (const reason of ["edit", "selection", "blur", "unload"]) test(`deferred delimiter selection is cancelled after ${reason}`, () => {
  const f = fixture("**broken"), editor = f.instance.editor;
  Object.assign(editor, { getCursor: () => ({ line: 0, ch: 0 }), posToOffset: p => p.ch });
  f.controller.next(editor);
  if (reason === "edit") f.view.dispatch({ changes: { from: 0, to: 0, insert: "x" } });
  if (reason === "selection") f.view.dispatch({ selection: { anchor: 4 } });
  if (reason === "blur") f.view.hasFocus = false;
  if (reason === "unload") f.controller.dispose();
  const count = f.updates.length; f.flush();
  assert.equal(f.updates.length, count);
});
test("paste warning is non-mutating and is cancelled if the content changes or plugin unloads", () => {
  for (const action of ["none", "edit", "unload"]) {
    const f = fixture("");
    f.view.dispatch({ changes: { from: 0, to: 0, insert: "**broken" }, selection: { anchor: 8 }, annotations: { event: "input.paste" } });
    if (action === "edit") f.view.dispatch({ changes: { from: 0, to: 8, insert: "Fixed" }, selection: { anchor: 5 } });
    if (action === "unload") f.controller.dispose();
    const before = f.view.state.doc.toString(); f.flush();
    assert.equal(f.view.state.doc.toString(), before);
    assert.equal(f.notices.length, action === "none" ? 1 : 0);
  }
});
test("presentation-only refresh does not cancel a pending paste hint", () => {
  const f = fixture("");
  f.view.dispatch({ changes: { from: 0, to: 0, insert: "**broken" }, annotations: { event: "input.paste" } });
  f.controller.refresh(); f.flush();
  assert.equal(f.notices.length, 1); assert.equal(f.view.state.doc.toString(), "**broken");
});
for(const text of ['- First\n- Second','- [ ] First\n- [x] Second','- Parent\n  - Child'])test(`list separator geometry remains decorated during composition: ${text}`,()=>{
  const f=fixture(text),tree={iterate({enter}){for(const m of text.matchAll(/-/gu))enter({name:'formatting-list',from:m.index,to:m.index+1});}};
  f.view.state=f.state(text,true,tree);f.controller.refresh();
  const gaps=()=>f.instance.decorations.filter(r=>r.spec.class?.includes('list-separator')).map(r=>[r.from,r.to,r.spec.class]);
  const before=gaps();assert.equal(before.length,2);
  f.view.composing=true;f.instance.beginComposition();f.flush();assert.deepEqual(gaps(),before);
  assert.equal(f.instance.applied,0);
  f.view.composing=false;f.instance.endComposition();f.flush();assert.deepEqual(gaps(),before);
  assert.equal(f.view.state.doc.toString(),text);assert.ok(f.updates.every(u=>!u.changes));
});
test("quote presentation is reversible on Option, source, composition and preferences without edits", () => {
  const text='> [!note] Title\n> Body',f=fixture(text);
  const tree={iterate({enter}){for(const token of [
    {from:0,to:10,name:'formatting_formatting-quote_hmd-callout'},
    {from:16,to:18,name:'formatting_formatting-quote'}])enter(token);}};
  f.view.state=f.state(text,true,tree);f.controller.refresh();
  assert.equal(f.instance.structure.quotes.length,2);
  assert.equal(f.instance.applied,3);
  assert.equal(f.instance.decorations.filter(r=>r.spec.class?.includes('edit-callout')).length,2);
  f.doc.emit('keydown',{key:'Alt'});assert.equal(f.instance.applied,0);
  f.doc.emit('keyup',{key:'Alt',altKey:false});assert.equal(f.instance.applied,3);
  f.prefs.hideMarkers=false;f.controller.refresh();assert.equal(f.instance.applied,0);
  f.prefs.hideMarkers=true;f.view.composing=true;f.controller.refresh();assert.equal(f.instance.applied,0);
  f.view.composing=false;f.view.state=f.state(text,false,tree);f.controller.refresh();assert.equal(f.instance.applied,0);
  assert.equal(f.instance.decorations.length,0);assert.ok(f.updates.every(u=>!u.changes));
});
test('list-contained Callout decoration preserves indent and reverses without text or history changes',()=>{
  const text='- Parent\n\n  > [!note] Title\n  > Body',f=fixture(text);
  const tree={iterate({enter}){for(const m of text.matchAll(/>[ \t]*(?:\[![\w-]+\][ \t]*)?/gu))
    enter({from:m.index,to:m.index+m[0].length,name:'formatting_formatting-quote'+(m[0].includes('[!')?'_hmd-callout':'')});}};
  f.view.state=f.state(text,true,tree);f.controller.refresh();
  const styled=()=>f.instance.decorations.filter(r=>r.spec.class?.includes('edit-callout'));
  assert.equal(styled().length,2);assert.equal(f.instance.applied,3);
  assert.ok(f.instance.structure.quotes.every(row=>text.slice(row.from,row.marker.from)==='  '));
  for(const release of [()=>f.doc.emit('keyup',{key:'Alt',altKey:false}),()=>f.doc.defaultView.emit('blur')]){
    f.doc.emit('keydown',{key:'Alt'});assert.equal(styled().length,0);release();assert.equal(styled().length,2);
  }
  f.prefs.hideMarkers=false;f.controller.refresh();assert.equal(styled().length,0);
  f.prefs.hideMarkers=true;f.controller.refresh();assert.equal(styled().length,2);
  f.view.composing=true;f.controller.refresh();assert.equal(styled().length,0);
  f.view.composing=false;f.view.state=f.state(text,false,tree);f.controller.refresh();assert.equal(styled().length,0);
  f.view.state=f.state(text,true,tree);f.controller.refresh();assert.equal(styled().length,2);
  // The host removes the registered extension at unload. Even if a pending
  // editor update arrives before that removal, the controller cannot redecorate.
  f.controller.dispose();f.view.dispatch({selection:{anchor:0}});assert.equal(styled().length,0);
  assert.equal(f.view.state.doc.toString(),text);assert.ok(f.updates.every(u=>!u.changes));
});
