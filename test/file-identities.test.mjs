import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
function fixture() {
  const owned = ".keyline-next-file-icon,.keyline-next-tab-icon,.keyline-next-bucket-icon", elements = [];
  const observers = [], timers = new Set();
  const doc = {
    defaultView: { MutationObserver: class {
      constructor(callback) { this.callback = callback; observers.push(this); }
      observe() {} disconnect() { this.disconnected = true; }
    } },
    querySelectorAll: selector => { assert.equal(selector, owned); return elements.filter(e => e.owned && !e.removed); }
  };
  const root = { isConnected: true, ownerDocument: doc, querySelectorAll: () => [] };
  const module = { exports: {} };
  vm.runInNewContext(readFileSync(new URL("../.test-build/platform/file-identities.cjs", import.meta.url), "utf8"), {
    module, exports: module.exports, require: name => { assert.equal(name, "obsidian"); return { getIconIds: () => [] }; },
    setInterval: fn => { timers.add(fn); return fn; }, clearInterval: fn => timers.delete(fn),
    setTimeout: fn => { timers.add(fn); return fn; }, clearTimeout: fn => timers.delete(fn)
  });
  const prefs = { fileIcons: true, monochrome: false, iconRules: [] }, state = { yielded: false };
  const controller = new module.exports.FileIdentities({
    workspace: { getLeavesOfType: () => { throw Error('Redirectable lookup must not be used'); },
      iterateAllLeaves: visit => visit({view:{getViewType:()=>'file-explorer',containerEl:root},getViewState:()=>({})}) }
  }, () => prefs, () => state.yielded);
  const add = (owned = true) => { const e = { owned, remove() { this.removed = true; } }; elements.push(e); return e; };
  controller.refresh();
  const tracked = add(), clone = add(), native = add(false);
  controller.spans.add(tracked);
  return { controller, prefs, state, tracked, clone, native, timers, observers, ...module.exports };
}
for (const action of ["disable", "unload", "yield"]) test(`file identities remove host-cloned own spans on ${action}, preserving native icons`, () => {
  const f = fixture();
  if (action === "disable") { f.prefs.fileIcons = false; f.controller.refresh(); }
  if (action === "yield") { f.state.yielded = true; f.controller.refresh(); }
  if (action === "unload") f.controller.dispose();
  assert.equal(f.tracked.removed, true); assert.equal(f.clone.removed, true); assert.equal(f.native.removed, undefined);
  assert.equal(f.controller.spans.size, 0);
  if (action !== "yield") assert.ok(f.observers.every(o => o.disconnected));
  if (action === "unload") assert.equal(f.timers.size, 0);
  f.controller.dispose();
});
for (const changed of ["none", "owned-span", "missing", "duplicate", "extra", "shape", "paint", "tag", "unknown-host"])
  test(`native identity slot comparison yields safely: ${changed}`, () => {
    const f = fixture();
    const glyph = () => ({
      tagName: "svg", matches: () => false,
      getAttribute: name => name === "viewBox" ? "0 0 24 24" : name === "stroke" ? "currentColor" : null,
      childNodes: [{ key: "native-path", isEqualNode(other) { return this.key === other.key; } }]
    });
    const expected = glyph(), actual = glyph(), container = { children: [actual] };
    if (changed === "owned-span") container.children.push({ matches: () => true });
    if (changed === "missing") container.children = [];
    if (changed === "duplicate") container.children.push(glyph());
    if (changed === "extra") { const other=glyph();other.childNodes[0].key='foreign-path';container.children.push(other); }
    if (changed === "shape") actual.childNodes[0].key = "foreign-path";
    if (changed === "paint") actual.getAttribute = () => "foreign-paint";
    if (changed === "tag") actual.tagName = "span";
    assert.equal(f.nativeGlyphMatches(container, changed === "unknown-host" ? null : expected), ["none", "owned-span"].includes(changed));
    assert.equal(f.nativeGlyphMatches(container, changed === "unknown-host" ? null : expected, true), ["none", "owned-span", "duplicate"].includes(changed));
    f.controller.dispose();
  });

function rowStyle() {
  const values=new Map(),priorities=new Map();
  return {style:{getPropertyValue:k=>values.get(k)??'',getPropertyPriority:k=>priorities.get(k)??'',
    setProperty(k,v,p=''){values.set(k,v);priorities.set(k,p);},removeProperty(k){values.delete(k);priorities.delete(k);}}};
}
const tint='--ncl-file-selection-color';
test('native file-row selection token follows resolved tint and clears only its own value',()=>{
  const f=fixture(),row=rowStyle();row.style.setProperty('--unrelated','keep');
  f.controller.paintSelection(row,'var(--keyline-next-identity-blue)');assert.equal(row.style.getPropertyValue(tint),'var(--keyline-next-identity-blue)');
  f.controller.paintSelection(row,'#bd5432');assert.equal(row.style.getPropertyValue(tint),'#bd5432');
  f.controller.paintSelection(row,'var(--text-muted)');assert.equal(row.style.getPropertyValue(tint),'var(--text-muted)');
  f.controller.releaseSelection(row);assert.equal(row.style.getPropertyValue(tint),'');assert.equal(row.style.getPropertyValue('--unrelated'),'keep');f.controller.dispose();
});
for(const when of ['before','after','priority'])test(`file-row tint yields to foreign ${when} styling`,()=>{
  const f=fixture(),row=rowStyle();
  if(when==='before')row.style.setProperty(tint,'#123456');
  f.controller.paintSelection(row,'#bd5432');
  if(when==='after')row.style.setProperty(tint,'#123456');
  if(when==='priority')row.style.setProperty(tint,'#bd5432','important');
  f.controller.paintSelection(row,'#654321');f.controller.dispose();
  assert.equal(row.style.getPropertyValue(tint),when==='priority'?'#bd5432':'#123456');
  assert.equal(row.style.getPropertyPriority(tint),when==='priority'?'important':'');
});
for(const action of ['disable','yield','detach','unload'])test(`file selection tint is released on ${action}`,()=>{
  const f=fixture(),row=rowStyle();f.controller.paintSelection(row,'#bd5432');
  if(action==='disable')f.prefs.fileIcons=false;
  if(action==='yield')f.state.yielded=true;
  if(action==='unload')f.controller.dispose();else f.controller.refresh();
  assert.equal(row.style.getPropertyValue(tint),'');assert.equal(f.controller.selectionRows.size,0);f.controller.dispose();
});

function nativeShape(key) {
  return {tagName:'svg',matches:()=>false,getAttribute:name=>name==='viewBox'?'0 0 24 24':null,
    childNodes:[{key,isEqualNode(other){return this.key===other.key;}}],cloneNode(){return nativeShape(this.childNodes[0].key);}};
}
test('native tab duplicate allowance never accepts a previous or changed foreign glyph',()=>{
  const f=fixture(),a=nativeShape('image'),b=nativeShape('file'),container={children:[a]};
  assert.equal(f.nativeGlyphMatches(container,nativeShape('image'),true),true);
  container.children.push(b);
  assert.equal(f.nativeGlyphMatches(container,nativeShape('file'),true),false);
  assert.equal(container.children[0],a);assert.equal(container.children[1],b);
  a.childNodes[0].key='file';assert.equal(f.nativeGlyphMatches(container,nativeShape('file'),true),true);
  a.childNodes[0].key='foreign';assert.equal(f.nativeGlyphMatches(container,nativeShape('file'),true),false);
  f.controller.dispose();
});
test('native tab duplicate allowance still rejects missing and unknown host glyphs',()=>{
  const f=fixture(),container={children:[]};
  assert.equal(f.nativeGlyphMatches(container,nativeShape('file'),true),false);
  assert.equal(f.nativeGlyphMatches(container,null,true),false);f.controller.dispose();
});
