import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import vm from "node:vm";
const require = createRequire(import.meta.url);
const { normalizeTypography, typographySpecs, typographyKeys, typographyVariables } = require("../.test-build/domain/typography.cjs");
function load(file, host = {}) {
  const module = { exports: {} };
  vm.runInNewContext(readFileSync(new URL(`../.test-build/platform/${file}.cjs`, import.meta.url), "utf8"), {
    module, exports: module.exports, require: name => { assert.equal(name, "obsidian"); return { Modal: class {}, ...host }; }, console
  });
  return module.exports;
}
for (const key of typographyKeys) test(`typography clamps and validates: ${key}`, () => {
  const spec = typographySpecs[key];
  for (const value of [NaN, Infinity, null, "999", {}, []]) assert.equal(normalizeTypography({ [key]: value })[key], spec.initial);
  assert.equal(normalizeTypography({ [key]: -10000 })[key], spec.min);
  assert.equal(normalizeTypography({ [key]: 10000 })[key], spec.max);
});
test("typography values generate only bounded host tokens", () => {
  const vars = typographyVariables(normalizeTypography({ inset: 120, width: 820 }));
  assert.equal(vars["--file-line-width"], "820px");
  assert.equal(vars["--ncl-page-side-padding"], "min(120px, 20cqw)");
  assert.equal(typographyVariables(normalizeTypography(null))["--ncl-page-side-padding"], "initial");
});
test("list item gap is shared across both sides and first indent follows the integrated contract",()=>{
  const vars=typographyVariables(normalizeTypography({listGap:.4,listIndent:2.5}));
  assert.equal(vars['--list-spacing'],'0.2em');
  assert.equal(vars['--ncl-list-first-indent'],'1em');
  assert.equal(typographyVariables(normalizeTypography({listIndent:.75}))['--ncl-list-first-indent'],'0.5em');
});
class Element {
  constructor() {
    this.values = new Map(); this.classes = new Set(); this.children = [];
    this.style = { getPropertyValue: k => this.values.get(k)?.value || "", getPropertyPriority: k => this.values.get(k)?.priority || "",
      setProperty: (k, value, priority = "") => this.values.set(k, { value, priority }), removeProperty: k => this.values.delete(k) };
    this.classList = { add: k => this.classes.add(k), remove: k => this.classes.delete(k) };
  }
  addClass(k) { this.classes.add(k); }
  createEl() { const e = new Element(); this.children.push(e); return e; }
  createSpan() { return this.createEl(); }
  setAttribute() {}
  addEventListener() {}
  replaceChildren() { this.children = []; }
  remove() { this.removed = true; }
}
test("typography restores owned styles but preserves later external edits", () => {
  const { TypographyController } = load("typography");
  const root = new Element();
  root.style.setProperty("--file-line-width", "55rem", "important");
  const preferences = { typographyEnabled: true, typography: normalizeTypography(null) };
  const controller = new TypographyController({ workspace: { getLeavesOfType: () => [{ view: { containerEl: root } }] } }, () => preferences);
  controller.refresh(); assert.equal(root.style.getPropertyValue("--file-line-width"), "600px");
  root.style.setProperty("--ncl-editor-line-height", "3");
  controller.refresh(); assert.equal(root.style.getPropertyValue("--ncl-editor-line-height"), "3");
  controller.dispose();
  assert.equal(root.style.getPropertyValue("--file-line-width"), "55rem");
  assert.equal(root.style.getPropertyPriority("--file-line-width"), "important");
  assert.equal(root.style.getPropertyValue("--ncl-editor-line-height"), "3");
  assert.equal(root.classes.size, 0);
});
test("explicit side padding opts in locally while auto/reset restores theme margins", () => {
  const { TypographyController } = load("typography"), root=new Element();
  const preferences={typographyEnabled:true,typography:normalizeTypography({inset:48})};
  const controller=new TypographyController({workspace:{getLeavesOfType:()=>[{view:{containerEl:root}}]}},()=>preferences);
  controller.refresh();assert.ok(root.classes.has("keyline-next-custom-inset"));
  preferences.typography.inset=-1;controller.refresh();assert.ok(!root.classes.has("keyline-next-custom-inset"));
  preferences.typography.inset=0;controller.refresh();assert.ok(root.classes.has("keyline-next-custom-inset"));
  controller.dispose();assert.equal(root.classes.size,0);
});
function workspaceFixture() {
  const calls = [], disk = new Map();
  const { WorkspaceActions, WorkspaceJournal, validRecovery, validWorkspaceName } = require("../.test-build/platform/workspace-state.cjs");
  const state = { fail: false, enabled: true, allowed: true, conflict: false, layout: { main: { type: "split", children: [] }, custom: "unsaved" }, saved: null };
  const core = { activeWorkspace: "Writing", workspaces: { Writing: { main: { note: "Writing" } }, Research: { main: { note: "Research" } } },
    saveData: async () => { state.saved = structuredClone({ workspaces: core.workspaces, active: core.activeWorkspace }); },
    onOpenModal: () => calls.push("manage") };
  const adapter = {
    write: async (path, value) => { if (state.fail) throw Error("fixture"); disk.set(path, value); },
    read: async path => disk.get(path), exists: async path => disk.has(path)
  };
  const port = {
    core: () => state.enabled ? core : null, allowed: () => state.allowed, conflict: () => state.conflict,
    current: () => state.layout, apply: async value => { calls.push(value.main.note); state.layout = value; },
    readSaved: async () => state.saved
  };
  const journal = new WorkspaceJournal(adapter, ".obsidian/plugins/next");
  const controller = new WorkspaceActions(port, journal);
  return { controller, calls, disk, state, core, validRecovery, validWorkspaceName, journal, adapter, port };
}
test("workspace switch snapshots unsaved layout without overwriting core saves", async () => {
  const f = workspaceFixture(); await f.controller.switchTo("Research");
  assert.deepEqual(f.calls, ["Research"]);
  const recovery = JSON.parse([...f.disk.values()][0]);
  assert.equal(recovery.layout.custom, "unsaved");
  f.state.layout = { main: {}, custom: "different" };
  await f.controller.restore(); assert.equal(f.state.layout.custom, "unsaved");
});
test("workspace native optional undefined fields compare as persisted JSON, not a false stale scene", async () => {
  const f = workspaceFixture(); f.state.layout.main.optional = undefined; f.state.layout.floating = undefined;
  f.core.workspaces.Research.main.optional = undefined;
  f.core.saveData = async () => { f.state.saved = JSON.parse(JSON.stringify({workspaces:f.core.workspaces,active:f.core.activeWorkspace})); };
  const apply = f.port.apply;
  f.port.apply = async layout => { await apply(layout); f.state.layout.main.optional = undefined; };
  await f.controller.switchTo("Research"); assert.deepEqual(f.calls,["Research"]);
  await f.controller.restore(); assert.equal(f.state.layout.custom,"unsaved");
});
test("workspace switch stops if recovery cannot be verified", async () => {
  const f = workspaceFixture(); f.state.fail = true;
  await assert.rejects(f.controller.switchTo("Research")); assert.deepEqual(f.calls, []);
});
test("disabled core, missing layout and unloaded controller cannot switch", async () => {
  const f = workspaceFixture(); f.state.enabled = false;
  await assert.rejects(f.controller.switchTo("Research")); f.state.enabled = true;
  await assert.rejects(f.controller.switchTo("Missing")); f.controller.stop();
  await assert.rejects(f.controller.switchTo("Research")); assert.deepEqual(f.calls, []);
});
test("workspace recovery and names validate unsafe inputs", () => {
  const f = workspaceFixture();
  for (const name of ["", "  ", "__proto__", "constructor", "hasOwnProperty", "toString", " a\nb ", "x".repeat(81), "a\x7fb"]) assert.equal(f.validWorkspaceName(name), false);
  assert.ok(f.validWorkspaceName("写作 · Work"));
  for (const value of [null, {}, { schema: 1, active: "", at: "", layout: { main: "wrong" } }]) assert.equal(f.validRecovery(value), false);
});
test("workspace save-current persists directly, new names activate, duplicate rejects", async () => {
  const f = workspaceFixture(), research = structuredClone(f.core.workspaces.Research);
  await f.controller.save("Writing", true); assert.equal(f.state.saved.workspaces.Writing.custom, "unsaved");
  await f.controller.save("New layout", false); assert.equal(f.state.saved.active, "New layout");
  const saved = structuredClone(f.state.saved);
  await assert.rejects(f.controller.save("Writing", false), { problem: "duplicate" });
  await assert.rejects(f.controller.save("Writing", true), { problem: "stale" });
  assert.deepEqual(f.state.saved, saved); assert.deepEqual(f.core.workspaces.Research, research);
  assert.equal(f.disk.size, 0); assert.equal(f.calls.length, 0);
});
test("workspace failed save/readback restores owned in-memory definitions without reporting success", async () => {
  for (const mode of ["write", "read", "mismatch"]) {
    const f = workspaceFixture(), saved = structuredClone(f.core.workspaces);
    if (mode === "write") f.core.saveData = async () => { throw Error("disk"); };
    if (mode === "read") f.port.readSaved = async () => { throw Error("read"); };
    if (mode === "mismatch") f.port.readSaved = async () => ({});
    await assert.rejects(f.controller.save("New", false)); assert.deepEqual(f.core.workspaces, saved);
    assert.equal(f.core.activeWorkspace, "Writing"); assert.equal(f.controller.busy, false);
  }
});
test("workspace failed save does not overwrite a later native manager edit", async () => {
  const f = workspaceFixture();
  f.core.saveData = async () => { f.core.workspaces.New = { main: { foreign: true } }; f.core.activeWorkspace = "Research"; throw Error("disk"); };
  await assert.rejects(f.controller.save("New", false)); assert.equal(f.core.workspaces.New.main.foreign, true);
  assert.equal(f.core.activeWorkspace, "Research");
});
test("workspace failed save preserves in-place foreign edits too", async () => {
  const f = workspaceFixture();
  f.core.saveData = async () => { f.core.workspaces.New.main.foreign = true; throw Error("disk"); };
  await assert.rejects(f.controller.save("New", false)); assert.equal(f.core.workspaces.New.main.foreign, true);
});
test("workspace disable during a completed native save does not roll core memory back behind persisted data", async () => {
  const f = workspaceFixture(), save = f.core.saveData;
  f.core.saveData = async () => { await save(); f.controller.stop(); };
  await assert.rejects(f.controller.save("New", false),{problem:"stale"});
  assert.equal(f.core.activeWorkspace,"New");assert.equal(f.state.saved.active,"New");
  assert.deepEqual(f.core.workspaces.New,f.state.saved.workspaces.New);
});
test("workspace journal retains last good copy across torn writes and then repairs only torn slot", async () => {
  const f = workspaceFixture(); await f.controller.switchTo("Research");
  const original = await f.journal.read(), good = [...f.disk.entries()][0];
  f.adapter.write = async (p) => { f.disk.set(p, '{"schema":'); throw Error("partial"); };
  await assert.rejects(f.controller.switchTo("Writing"));
  assert.deepEqual(await f.journal.read(), original); assert.equal(f.disk.get(good[0]), good[1]);
  f.adapter.write = async (p, value) => f.disk.set(p, value);
  await f.controller.switchTo("Writing"); assert.equal(f.disk.size, 2);
  assert.equal((await f.journal.read()).active, "Research");
});
test("workspace journal future schema and unreadable slots remain untouched", async () => {
  const f = workspaceFixture(); await f.controller.switchTo("Research");
  f.disk.set(".obsidian/plugins/next/workspace-recovery.1.json", '{"schema":999,"future":true}');
  const before = [...f.disk.entries()]; await assert.rejects(f.controller.switchTo("Writing")); assert.deepEqual([...f.disk.entries()], before);
  f.adapter.read = async () => { throw Error("permission"); };
  await assert.rejects(f.controller.switchTo("Writing")); assert.deepEqual([...f.disk.entries()], before);
});
for (const change of ["core", "enabled", "setting", "conflict", "scene", "active", "definition", "unload"]) test(`workspace aborts stale recovery boundary: ${change}`, async () => {
  const f = workspaceFixture(), write = f.adapter.write;
  f.adapter.write = async (p, value) => {
    await write(p, value);
    if (change === "core") f.port.core = () => ({ ...f.core });
    if (change === "enabled") f.state.enabled = false;
    if (change === "setting") f.state.allowed = false;
    if (change === "conflict") f.state.conflict = true;
    if (change === "scene") f.state.layout = { main: { foreign: true } };
    if (change === "active") f.core.activeWorkspace = "Research";
    if (change === "definition") f.core.workspaces.Research.main.note = "Changed";
    if (change === "unload") f.controller.stop();
  };
  await assert.rejects(f.controller.switchTo("Research")); assert.deepEqual(f.calls, []);
});
test("workspace operation is exclusive while recovery awaits", async () => {
  const f = workspaceFixture(); let release;
  f.adapter.write = (p, value) => new Promise(resolve => { release = () => { f.disk.set(p, value); resolve(); }; });
  const pending = f.controller.switchTo("Research");
  for (let i = 0; i < 15 && !release; i++) await Promise.resolve();
  assert.ok(release); await assert.rejects(f.controller.save("Writing", true), { problem: "busy" });
  release(); await pending; assert.deepEqual(f.calls, ["Research"]);
});
test("workspace native management requires verified recovery and cannot run after unload", async () => {
  const f = workspaceFixture(); f.state.fail = true; await assert.rejects(f.controller.manage()); assert.deepEqual(f.calls, []);
  f.state.fail = false; await f.controller.manage(); assert.deepEqual(f.calls, ["manage"]);
  assert.equal((await f.journal.read()).layout.custom, "unsaved"); f.controller.stop();
  await assert.rejects(f.controller.manage()); assert.deepEqual(f.calls, ["manage"]);
});
test("workspace restore rotates recovery and clears unknown active name", async () => {
  const f = workspaceFixture(); f.core.activeWorkspace = "Removed";
  await f.controller.switchTo("Research"); await f.controller.restore();
  assert.equal(f.core.activeWorkspace, ""); assert.equal(f.state.saved.active, "");
  assert.equal((await f.journal.read()).active, "Research");
  await f.controller.restore(); assert.equal(f.state.layout.main.note, "Research");
});
test("workspace core persistence failure rolls back owned scene and retains recovery", async () => {
  const f = workspaceFixture(), save = f.core.saveData; let count = 0;
  f.core.saveData = async () => { if (++count === 1) throw Error("disk"); await save(); };
  await assert.rejects(f.controller.switchTo("Research")); assert.equal(f.state.layout.custom, "unsaved");
  assert.equal(f.core.activeWorkspace, "Writing"); assert.equal((await f.journal.read()).layout.custom, "unsaved");
});
test("workspace cold start performs no I/O and missing recovery never changes layout", async () => {
  const f = workspaceFixture(); assert.equal(f.disk.size,0); assert.deepEqual(f.calls,[]); assert.equal(f.state.saved,null);
  await assert.rejects(f.controller.restore(),{problem:"missing"});assert.equal(f.disk.size,0);assert.deepEqual(f.calls,[]);
});
test("workspace old development snapshot is read-only and explicit restore preserves the scene left behind", async () => {
  const f = workspaceFixture(), path='.obsidian/plugins/next/workspace-recovery.json';
  const text=JSON.stringify({schema:1,layout:{main:{note:'Legacy'}},active:'Writing',at:'2026-10-21T00:00:00.000Z'});
  f.disk.set(path,text); await f.controller.restore();assert.equal(f.state.layout.main.note,'Legacy');assert.equal(f.disk.get(path),text);
  assert.equal((await f.journal.read()).layout.custom,'unsaved');assert.equal(f.disk.size,2);
});
test("workspace read-back mismatch stops the switch without losing the preceding verified slot", async () => {
  const f=workspaceFixture();await f.controller.switchTo('Research');const good=await f.journal.read();const calls=f.calls.length;
  f.adapter.write=async(p,value)=>f.disk.set(p,value.slice(0,-5));
  await assert.rejects(f.controller.switchTo('Writing'),{problem:'recovery'});
  assert.equal(f.calls.length,calls);assert.deepEqual(await f.journal.read(),good);
});
test("workspace core save rejection cannot roll back a newer scene opened during persistence",async()=>{
  const f=workspaceFixture();f.core.saveData=async()=>{f.state.layout={main:{note:'Foreign'}};throw Error('save failure')};
  await assert.rejects(f.controller.switchTo('Research'));assert.equal(f.state.layout.main.note,'Foreign');
  assert.deepEqual(f.calls,['Research']);assert.equal((await f.journal.read()).layout.custom,'unsaved');
});

function customWorkspace() {
  const leaf=id=>({id,type:'leaf',state:{type:'third-party-view',state:{title:'opaque title',icon:'opaque icon',children:[{state:{title:'keep'}}]},icon:'file',title:'Board'}});
  return {main:{id:'main',type:'split',children:[leaf('a')]},left:{id:'left',type:'split',children:[leaf('b')]},
    right:{id:'right',type:'split',children:[]},floating:{id:'float',type:'floating',children:[{id:'window',type:'window',children:[leaf('c')],x:50,y:20,width:900,height:760}]},active:'a',mtime:'2026-10-21T00:00:00.000Z'};
}
test('workspace native missing-view title/icon normalization preserves opaque data and original definitions',async()=>{
  const f=workspaceFixture(),target=customWorkspace();f.core.workspaces.Custom=structuredClone(target);
  const apply=f.port.apply;f.port.apply=async value=>{
    await apply(value);delete f.state.layout.mtime;
    for(const node of [f.state.layout.main.children[0],f.state.layout.left.children[0],f.state.layout.floating.children[0].children[0]]){
      node.state.icon='ghost';node.state.title='third-party-view';
    }
  };
  await f.controller.switchTo('Custom');
  assert.equal(f.core.activeWorkspace,'Custom');assert.deepEqual(f.core.workspaces.Custom,target);
  assert.deepEqual(f.state.layout.main.children[0].state.state,target.main.children[0].state.state);
});
for(const change of ['payload title','payload icon','payload children','view type','leaf identity','right','floating','active'])test(`workspace detects partial application or foreign change outside the main note: ${change}`,async()=>{
  const f=workspaceFixture();f.core.workspaces.Custom=customWorkspace();const apply=f.port.apply;
  f.port.apply=async value=>{
    await apply(value);const node=f.state.layout.main.children[0];
    if(change==='payload title')node.state.state.title='changed';
    if(change==='payload icon')node.state.state.icon='changed';
    if(change==='payload children')node.state.state.children[0].state.title='changed';
    if(change==='view type')node.state.type='empty';
    if(change==='leaf identity')node.id='foreign';
    if(change==='right')f.state.layout.right.children.push({id:'foreign',type:'leaf'});
    if(change==='floating')f.state.layout.floating.children=[];
    if(change==='active')f.state.layout.active='foreign';
  };
  await assert.rejects(f.controller.switchTo('Custom'),{problem:'stale'});
  assert.equal(f.core.activeWorkspace,'Writing');assert.equal(f.state.saved,null);assert.equal(f.calls.length,1);
});
for(const part of ['left','right','floating'])test(`workspace persistence rejection preserves a newer ${part} scene instead of rolling it back`,async()=>{
  const f=workspaceFixture();f.core.workspaces.Custom=customWorkspace();
  f.core.saveData=async()=>{f.state.layout[part]={foreign:true};throw Error('native save rejection')};
  await assert.rejects(f.controller.switchTo('Custom'));
  assert.equal(f.state.layout[part].foreign,true);assert.equal(f.calls.length,1);
});
test('workspace failed persistence can restore its own normalized missing-view scene',async()=>{
  const f=workspaceFixture(),before=structuredClone(f.state.layout);f.core.workspaces.Custom=customWorkspace();
  const apply=f.port.apply,save=f.core.saveData;let count=0;
  f.port.apply=async value=>{await apply(value);if(f.state.layout.main.children?.[0]){f.state.layout.main.children[0].state.title='third-party-view';f.state.layout.main.children[0].state.icon='ghost';}};
  f.core.saveData=async()=>{if(++count===1)throw Error('disk');await save()};
  await assert.rejects(f.controller.switchTo('Custom'));
  assert.deepEqual(f.state.layout,before);assert.equal(f.core.activeWorkspace,'Writing');assert.equal(f.calls.length,2);
});
test('workspace commands choose only a live attached editor document from this app',()=>{
  const {workspaceMenuDocument}=load('workspaces');
  const main={defaultView:{closed:false}},popout={defaultView:{closed:false}},foreign={defaultView:{closed:false}};
  const leaf={view:{containerEl:{isConnected:true,ownerDocument:popout}}},app={workspace:{iterateAllLeaves:fn=>fn(leaf)}};
  assert.equal(workspaceMenuDocument(app,main,popout),popout);
  for(const doc of [undefined,main,foreign,{defaultView:null}])assert.equal(workspaceMenuDocument(app,main,doc),main);
  popout.defaultView.closed=true;assert.equal(workspaceMenuDocument(app,main,popout),main);
  popout.defaultView.closed=false;leaf.view.containerEl.isConnected=false;
  assert.equal(workspaceMenuDocument(app,main,popout),main);
});
