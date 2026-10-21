import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url), cm = require("@codemirror/state");
const viewModule = require("@codemirror/view");
function fixture(text = "# Heading\n\nText", file = {}) {
  const info = cm.StateField.define({create:()=>({file}),update:value=>value});
  const live = cm.StateField.define({create:()=>true,update:value=>value});
  const callbacks = new Map(), cancelled = [], dispatched = [], nodes = [];
  let serial = 0, measured = 0;
  const document = { defaultView: {
    requestAnimationFrame(fn) { const id = ++serial; callbacks.set(id, fn); return id; },
    cancelAnimationFrame(id) { cancelled.push(id); callbacks.delete(id); }
  }, createElement() { const node = { style: {}, attrs: {}, setAttribute(k,v) { this.attrs[k]=v; } }; nodes.push(node); return node; } };
  const modules = { "@codemirror/state": cm, "@codemirror/view": {...viewModule, ViewPlugin: { define: create=>({create}) }},
    obsidian: {editorInfoField:info,editorLivePreviewField:live} };
  const module = {exports:{}};
  vm.runInNewContext(readFileSync(new URL("../.test-build/platform/editor-rhythm.cjs", import.meta.url), "utf8"), {
    module, exports:module.exports, require:name=>modules[name], console
  });
  const prefs = {typographyEnabled:true}, controller = new module.exports.EditorRhythmController(()=>prefs);
  const [field, tracker] = controller.extension();
  const view = {state:cm.EditorState.create({doc:text,extensions:[info,live,field]}),dom:{ownerDocument:document},
    dispatch(spec) { dispatched.push(spec); this.state=this.state.update(spec).state; }, requestMeasure() {measured++;} };
  const instance = tracker.create(view);
  const ranges = () => { const list=[]; view.state.field(field).between(0,view.state.doc.length,(from,to,deco)=>list.push({from,to,deco})); return list; };
  const flush = () => { for(const [id,fn] of [...callbacks]) {callbacks.delete(id);fn();} };
  return {view,field,prefs,controller,instance,ranges,flush,callbacks,cancelled,dispatched,nodes,measure:()=>measured};
}
test("vertical gaps use direct state decorations and never text transactions", () => {
  const f=fixture(), before=f.view.state.doc.toString();
  assert.equal(f.ranges().filter(r=>r.deco.spec.widget).length,4);
  f.controller.refresh(); f.controller.refresh(); assert.equal(f.callbacks.size,1); f.flush();
  assert.equal(f.measure(),1); assert.equal(f.dispatched.length,1); assert.ok(!f.dispatched[0].changes);
  assert.equal(f.view.state.doc.toString(),before);
});
test("document edits rebuild offsets while selection-only updates reuse decoration set", () => {
  const f=fixture(), before=f.view.state.field(f.field);
  f.view.dispatch({selection:{anchor:2}}); assert.equal(f.view.state.field(f.field),before);
  f.view.dispatch({changes:{from:0,to:f.view.state.doc.length,insert:"Plain"}});
  assert.notEqual(f.view.state.field(f.field),before); assert.equal(f.ranges().length,3);
});
test("opt-out removes gaps on next presentation refresh and opt-in restores them", () => {
  const f=fixture(); f.prefs.typographyEnabled=false; f.controller.refresh(); f.flush(); assert.equal(f.ranges().length,0);
  f.prefs.typographyEnabled=true; f.controller.refresh(); f.flush(); assert.ok(f.ranges().length>0);
});
test("non-note editors never get rhythm decorations", () => { assert.equal(fixture("Text", null).ranges().length,0); });
test("destroy and disposal cancel pending view work without dispatching", () => {
  for(const which of ["instance","controller"]) {
    const f=fixture(); f.controller.refresh(); which==="instance"?f.instance.destroy():f.controller.dispose(); f.flush();
    assert.equal(f.cancelled.length,1); assert.equal(f.dispatched.length,0);
  }
});
test('rhythm refresh migrates pending work and ignores a stale frame with the same window-local ID',()=>{
  const f=fixture(),other=fixture();other.controller.dispose();f.controller.refresh();
  const old=f.callbacks.values().next().value;
  f.view.dom.ownerDocument=other.view.dom.ownerDocument;f.controller.refresh();
  assert.deepEqual(f.cancelled,[1]);assert.equal(other.callbacks.size,1);
  old();assert.equal(f.dispatched.length,0);assert.equal(other.callbacks.size,1);
  other.flush();assert.equal(f.dispatched.length,1);assert.equal(f.measure(),1);
  assert.equal(f.view.state.doc.toString(),'# Heading\n\nText');
});
for(const which of ['instance','controller'])test(`rhythm ${which} teardown cancels work in the original document after adoption`,()=>{
  const f=fixture(),other=fixture();other.controller.dispose();f.controller.refresh();
  const old=f.callbacks.values().next().value;f.view.dom.ownerDocument=other.view.dom.ownerDocument;
  which==='instance'?f.instance.destroy():f.controller.dispose();
  assert.deepEqual(f.cancelled,[1]);assert.equal(other.cancelled.length,0);
  old();assert.equal(f.dispatched.length,0);assert.equal(f.measure(),0);
});
test('a moved editor defers rhythm work to the new window even if its previous frame fires first',()=>{
  const f=fixture(),other=fixture();other.controller.dispose();f.controller.refresh();
  f.view.dom.ownerDocument=other.view.dom.ownerDocument;f.flush();
  assert.equal(f.dispatched.length,0);assert.equal(other.callbacks.size,1);
  other.flush();assert.equal(f.dispatched.length,1);assert.equal(f.measure(),1);
});
test('editor adoption itself requests a fresh rhythm measurement without editing its document',()=>{
  const f=fixture(),other=fixture();other.controller.dispose();
  f.view.dom.ownerDocument=other.view.dom.ownerDocument;f.instance.update();
  assert.equal(other.callbacks.size,1);other.flush();
  assert.equal(f.dispatched.length,1);assert.equal(f.measure(),1);assert.ok(!f.dispatched[0].changes);
  assert.equal(f.view.state.doc.toString(),'# Heading\n\nText');
  f.controller.dispose();f.instance.update();assert.equal(other.callbacks.size,0);
});
test("widgets are aria-hidden inert nodes owned by the editor document", () => {
  const f=fixture(); const widget=f.ranges().find(r=>r.deco.spec.widget).deco.spec.widget;
  const node=widget.toDOM(f.view); assert.equal(node.attrs["aria-hidden"],"true"); assert.equal(widget.ignoreEvent(),true);
  assert.equal(node.style.height,"max(var(--keyline-next-headingBefore, 0px), 0px)");
});
