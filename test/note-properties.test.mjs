import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const module={exports:{}};
vm.runInNewContext(readFileSync(new URL('../.test-build/platform/note-properties.cjs',import.meta.url),'utf8'),{
  module,exports:module.exports,require:name=>{assert.equal(name,'obsidian');return {setIcon(){}};},setTimeout,clearTimeout
});
const {PropertyDraft, NoteProperties, needsPropertyDraft, supportsProperties}=module.exports;

function fixture() {
  const listeners={},classes=new Set(),doc={defaultView:null,activeElement:null};
  const containerEl={ownerDocument:doc,contains:()=>false,addEventListener:(k,fn)=>listeners[k]=fn,
    removeEventListener:(k)=>delete listeners[k],classList:{remove:k=>classes.delete(k),toggle:(k,on)=>on?classes.add(k):classes.delete(k)}};
  let syncs=0;const m={containerEl,properties:[],rendered:[],invalidFrontmatter:false,synchronize(value){
    syncs++;this.properties=Object.entries(value).map(([key,value])=>({key,value}));
    this.rendered=this.properties.map(entry=>({entry,containerEl:{ownerDocument:doc,contains:()=>false,querySelectorAll:()=>[],querySelector:()=>null}}));
  }};
  const view={file:{extension:'md'},containerEl,metadataEditor:m,canShowProperties:()=>true};
  return {view,m,classes,listeners,get syncs(){return syncs;}};
}
test('only supported visible empty Markdown gets a native in-memory draft',()=>{
  const f=fixture();assert.equal(needsPropertyDraft(f.view),true);
  const mount=new PropertyDraft(f.view);
  assert.deepEqual(f.m.properties,[{key:'',value:null}]);assert.equal(f.syncs,1);
  assert.ok(f.classes.has('keyline-next-empty-properties'));
  mount.refresh();assert.equal(f.syncs,1);mount.dispose();assert.deepEqual(f.m.properties,[]);
  assert.equal(f.classes.size,0);assert.deepEqual(f.listeners,{});
});
for(const kind of ['no-file','non-markdown','hidden','source-mode','invalid-yaml','existing','missing-api'])test(`does not seed ${kind}`,()=>{
  const f=fixture();
  if(kind==='no-file')f.view.file=null;
  if(kind==='non-markdown')f.view.file.extension='canvas';
  if(kind==='hidden'||kind==='source-mode')f.view.canShowProperties=()=>false;
  if(kind==='invalid-yaml')f.m.invalidFrontmatter=true;
  if(kind==='existing')f.m.properties=[{key:'title',value:'Keep'}];
  if(kind==='missing-api')delete f.m.synchronize;
  assert.equal(needsPropertyDraft(f.view),false);
});
test('changing the native setting removes our untouched draft without persisting anything',()=>{
  const f=fixture(),mount=new PropertyDraft(f.view);f.view.canShowProperties=()=>false;mount.refresh();
  assert.deepEqual(f.m.properties,[]);assert.equal(f.classes.size,0);mount.dispose();
});
for(const kind of ['key','value','uncommitted-key','uncommitted-value','replaced-row','invalid'])test(`unload preserves user/native state: ${kind}`,()=>{
  const f=fixture(),mount=new PropertyDraft(f.view),row=f.m.rendered[0];
  if(kind==='key')row.entry.key='Project';
  if(kind==='value')row.entry.value='Draft';
  if(kind==='uncommitted-key')row.containerEl.querySelectorAll=()=>[{tagName:'INPUT',value:'项目'}];
  if(kind==='uncommitted-value')row.containerEl.querySelectorAll=()=>[{tagName:'DIV',textContent:'内容'}];
  if(kind==='replaced-row')f.m.synchronize({'':null});
  if(kind==='invalid')f.m.invalidFrontmatter=true;
  const before=f.syncs;mount.dispose();assert.equal(f.syncs,before);assert.equal(f.classes.size,0);
});
test('saved property returns to the ordinary native property panel',()=>{
  const f=fixture(),mount=new PropertyDraft(f.view);f.m.synchronize({Project:'Atlas'});mount.refresh();
  assert.equal(f.classes.size,0);mount.dispose();assert.deepEqual(f.m.properties,[{key:'Project',value:'Atlas'}]);
});
for(const kind of ['date','datetime-local','text','synthetic','disabled','readonly','foreign','modifier','unsupported','throws'])test(`calendar click: ${kind}`,()=>{
  const f=fixture(),mount=new PropertyDraft(f.view);let opens=0;
  const target={tagName:'INPUT',type:kind==='datetime-local'?kind:'date',disabled:false,readOnly:false,
    closest:()=>true,showPicker(){opens++;}};
  const event={isTrusted:true,button:0,target};
  if(kind==='text')target.type='text';
  if(kind==='synthetic')event.isTrusted=false;
  if(kind==='disabled')target.disabled=true;
  if(kind==='readonly')target.readOnly=true;
  if(kind==='foreign')target.closest=()=>null;
  if(kind==='modifier')event.ctrlKey=true;
  if(kind==='unsupported')delete target.showPicker;
  if(kind==='throws')target.showPicker=()=>{throw Error('Native fallback');};
  f.listeners.click(event);assert.equal(opens,['date','datetime-local'].includes(kind)?1:0);
  assert.deepEqual(f.m.properties,[{key:'',value:null}]);mount.dispose();
});
test('closed leaves and unload clean only owned empty rows',()=>{
  const one=fixture(),two=fixture();let leaves=[{view:one.view},{view:two.view}];
  const controller=new NoteProperties({workspace:{getLeavesOfType:()=>leaves}});
  controller.refresh();assert.equal(one.m.properties.length,1);assert.equal(two.m.properties.length,1);
  leaves=[{view:two.view}];controller.refresh();assert.equal(one.m.properties.length,0);
  controller.dispose();assert.equal(two.m.properties.length,0);controller.refresh();assert.equal(two.m.properties.length,0);
});
test('recreated native metadata editor is rebound without leaving an orphan',()=>{
  const one=fixture(),two=fixture(),controller=new NoteProperties({workspace:{getLeavesOfType:()=>[{view:one.view}]}});
  controller.refresh();one.view.metadataEditor=two.m;controller.refresh();
  assert.equal(one.m.properties.length,0);assert.equal(two.m.properties.length,1);
  controller.dispose();assert.equal(two.m.properties.length,0);
});
