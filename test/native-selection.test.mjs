import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const { nativeSelectionAction, nativeSelectionCommands, selectionBlockLabel, annotationProvider, annotationStatus, insertAnnotation } =
  createRequire(import.meta.url)("../.test-build/platform/native-selection.cjs");
for (const action of Object.keys(nativeSelectionCommands)) test(`toolbar delegates ${action} to the same core command as the integrated reference`, () => {
  const calls = [], editor = { focus() { this.focused = true; } };
  const app = { workspace: { activeEditor: { editor } }, commands: { executeCommandById(id) { calls.push(id); return true; } } };
  assert.equal(nativeSelectionAction(app, editor, action, () => true), true);
  assert.deepEqual(calls, [nativeSelectionCommands[action]]);
});
test('optional provider lookup fails closed for unexpected getters and non-boolean active state',()=>{
  assert.equal(annotationProvider({get plugins(){throw Error('unloading')}}),null);
  assert.equal(annotationProvider({plugins:{plugins:{'keyline-marginalia':{apiVersion:1,active:'yes',availability(){return null},insertFromView(){return true}}}}}),null);
});
for(const outcome of ['throw','undefined','false','empty','promise'])test(`optional availability ${outcome} cannot crash or enable the toolbar`,()=>{
  const value={throw:()=>{throw Error('provider failed')},undefined:()=>undefined,false:()=>false,empty:()=>'',promise:()=>Promise.resolve(null)}[outcome];
  const app={plugins:{plugins:{'keyline-marginalia':{apiVersion:1,active:true,availability:value,insertFromView(){throw Error('must not call')}}}}};
  assert.deepEqual(annotationStatus(app,{}),{provider:null,reason:null,error:true});
  assert.equal(insertAnnotation(app,{},'sidenote',()=>true).status,'failed');
});
test('provider-owned unavailable reason stays exact and cannot insert',()=>{
  const provider={apiVersion:1,active:true,availability(){return 'Protected source — 保留原文'},insertFromView(){throw Error('must not call')}};
  const app={plugins:{plugins:{'keyline-marginalia':provider}}};
  assert.equal(annotationStatus(app,{}).reason,'Protected source — 保留原文');
  assert.deepEqual(insertAnnotation(app,{},'marginnote',()=>true),{status:'unavailable',reason:'Protected source — 保留原文'});
});
for(const change of ['stale','availability-edit','availability-unload','replacement','inactive','insert-throws','partial-throws','rejects','success'])test(`optional annotation dispatch: ${change}`,()=>{
  const view={text:'Original'},calls=[];let valid=change!=='stale';
  const provider={apiVersion:1,active:true,availability(received){
    assert.equal(this,provider);assert.equal(received,view);
    if(change==='availability-edit'){view.text='Later user edit';valid=false;}
    if(change==='availability-unload')delete app.plugins.plugins['keyline-marginalia'];
    if(change==='replacement')app.plugins.plugins['keyline-marginalia']={...provider};
    if(change==='inactive')provider.active=false;
    return null;
  },insertFromView(received,kind){
    calls.push([received,kind]);assert.equal(this,provider);
    if(change==='partial-throws'){view.text='Partial provider edit';throw Error('after edit');}
    if(change==='insert-throws')throw Error('before edit');
    return change!=='rejects';
  }};
  const app={plugins:{plugins:{'keyline-marginalia':provider}}};
  const result=insertAnnotation(app,view,'marginnote',()=>valid);
  const writes=['insert-throws','partial-throws','rejects','success'].includes(change);
  assert.equal(calls.length,writes?1:0);
  assert.equal(result.status,change==='success'?'inserted':writes?'failed':'stale');
  assert.equal(view.text,change==='availability-edit'?'Later user edit':change==='partial-throws'?'Partial provider edit':'Original');
});
for (const change of ["stale", "focus-change", "other-editor", "missing-command", "throw"])
  test(`native toolbar action fails closed for ${change}`, () => {
    let valid = change !== "stale", count = 0;
    const editor = { focus() { if (change === "focus-change") valid = false; } };
    const app = { workspace: { activeEditor: { editor: change === "other-editor" ? {} : editor } },
      commands: change === "missing-command" ? {} : { executeCommandById() { count++; if (change === "throw") throw Error("host failure"); return true; } } };
    assert.equal(nativeSelectionAction(app, editor, "bold", () => valid), false);
    assert.equal(count, change === "throw" ? 1 : 0);
  });
test("block labels preserve integrated indented-row Text fallback and the declared H6 addition", () => {
  for (const [line, en, zh] of [
    ["Text", "Text", "正文"], ["###### Six", "Heading 6", "标题 6"], ["  - [X] Done", "Text", "正文"],
    ["    - Child", "Text", "正文"], ["- [X] Done", "Task", "待办"], ["- Item", "Bullet list", "项目符号列表"], ["10) Next", "Numbered list", "编号列表"],
    ["> [!note]", "Callout", "Callout"], ["> Quote", "Quote", "引用"]
  ]) {
    assert.equal(selectionBlockLabel(line, false), en); assert.equal(selectionBlockLabel(line, true), zh);
  }
});
test("optional annotation provider requires the complete versioned API and active state", () => {
  const valid = { apiVersion: 1, active: true, availability() { return null; }, insertFromView() { return true; } };
  const app = value => ({ plugins: { plugins: { "keyline-marginalia": value } } });
  assert.equal(annotationProvider(app(valid)), valid);
  for (const value of [null, {}, { ...valid, active: false }, { ...valid, apiVersion: 2 }, { ...valid, availability: null }])
    assert.equal(annotationProvider(app(value)), null);
});
