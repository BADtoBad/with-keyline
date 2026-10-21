import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const module={exports:{}},notices=[];
vm.runInNewContext(readFileSync(new URL('../.test-build/platform/handle-menu.cjs',import.meta.url),'utf8'),{
  module,exports:module.exports,console,require(name){assert.equal(name,'obsidian');return {Notice:class{constructor(s){notices.push(s)}}}}
});
const {captureHandleMenu}=module.exports;
function setup(){
  const state={ok:true,removed:false},file={path:'Start.md'},writes=[],clipboard=[];
  const editor={text:'First line.\nSecond line.\nThird line.',anchor:1,head:1,
    getValue(){return this.text},offsetToPos(at){const s=this.text.slice(0,at).split('\n');return {line:s.length-1,ch:s.at(-1).length}},
    posToOffset(p){return this.text.split('\n').slice(0,p.line).reduce((n,s)=>n+s.length+1,p.ch)},
    listSelections(){return [{anchor:this.offsetToPos(this.anchor),head:this.offsetToPos(this.head)}]},
    setCursor(p){this.anchor=this.head=this.posToOffset(p)},focus(){this.focused=true},
    replaceRange(insert,a,b,origin){const from=this.posToOffset(a),to=this.posToOffset(b);writes.push({from,to,insert,origin});this.text=this.text.slice(0,from)+insert+this.text.slice(to)}
  };
  const app={vault:{getAbstractFileByPath:p=>!state.removed&&p===file.path?file:null}};
  const doc={defaultView:{crypto:{getRandomValues(a){a[0]=12;a[1]=24}},navigator:{clipboard:{async writeText(s){clipboard.push(s)}}}}};
  const capture=(at=12)=>captureHandleMenu(app,editor,file,at,()=>state.ok,doc,false);
  return {state,file,editor,writes,clipboard,capture};
}
test('opening a row menu does not select it; conversion commits once without resetting the native selection',()=>{
  const f=setup(),c=f.capture();assert.equal(f.writes.length,0);assert.equal(f.editor.anchor,1);
  assert.ok(c.actions.commit(c.actions.conversion('h2')));assert.equal(f.editor.text,'First line.\n## Second line.\nThird line.');
  assert.equal(f.writes.length,1);assert.equal(f.writes[0].origin,'set');assert.equal(f.editor.anchor,1);
});
for(const reason of ['text','selection','reverse','file','removed','guard'])test(`stale handle actions do not mutate after ${reason}`,()=>{
  const f=setup();f.editor.anchor=2;f.editor.head=8;const c=f.capture(),plan=c.actions.conversion('h2');
  if(reason==='text')f.editor.text+='!';if(reason==='selection')f.editor.head=9;
  if(reason==='reverse'){f.editor.anchor=8;f.editor.head=2}if(reason==='file')f.file.path='Moved.md';
  if(reason==='removed')f.state.removed=true;if(reason==='guard')f.state.ok=false;
  assert.equal(c.actions.commit(plan),false);assert.equal(c.actions.color({text:'blue'}),false);c.actions.remove?.();c.actions.copy?.();
  assert.equal(f.writes.length,0);assert.equal(f.clipboard.length,0);
});
test('row colour collapses at the payload end and can be reset without nesting spans',()=>{
  const f=setup();assert.ok(f.capture().actions.color({text:'blue'}));
  assert.equal(f.editor.anchor,f.editor.head);assert.equal(f.editor.text.slice(f.editor.head,f.editor.head+7),'</span>');
  const c=f.capture();assert.ok(c.actions.canColor);assert.ok(c.actions.color({text:'default'}));
  assert.equal(f.editor.text,'First line.\nSecond line.\nThird line.');assert.equal(f.writes.length,2);
});
test('block link uses the parsed block end, not an invalid mid-paragraph anchor',async()=>{
  const f=setup();f.capture().actions.copy();await Promise.resolve();
  assert.match(f.editor.text,/Third line\. \^ki-/);assert.match(f.clipboard[0],/^\[\[Start#\^ki-/);assert.equal(f.writes.length,1);
});

for(const [source,label] of [
  ['- Parent\n  - Child\n- Next','Parent'],
  ['- Parent\n  - Child\n- Next','Child'],
  ['- - Child\n  - Next\n- Outside','Child'],
  ['- - Child\n  - Next\n- Outside','Next']
])test(`primary row menu does not silently fall back to nested whole-block conversion: ${label} in ${JSON.stringify(source)}`,()=>{
  const f=setup();f.editor.text=source;
  const c=f.capture(source.indexOf(label));assert.ok(c);
  for(const target of ['paragraph','h2','bullet','number','task','quote','code','math','divider','callout-note'])
    assert.equal(c.actions.conversion(target),null,`Row menu must not promote ${label} through ${target}`);
  assert.equal(f.editor.text,source);assert.equal(f.writes.length,0);
});
