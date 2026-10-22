import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const {slashAt}=createRequire(import.meta.url)('../.test-build/domain/insertion.cjs');

function fixture(){
  const target=()=>({handlers:new Map(),attrs:new Map(),addEventListener(k,f){const a=this.handlers.get(k)??[];a.push(f);this.handlers.set(k,a);},removeEventListener(k,f){this.handlers.set(k,(this.handlers.get(k)??[]).filter(x=>x!==f));},getAttribute(k){return this.attrs.get(k)??null;},setAttribute(k,v){this.attrs.set(k,v);},removeAttribute(k){this.attrs.delete(k);}});
  const doc=target(),timers=new Map();let timer=0,rendered=0,text='';
  doc.defaultView={...target(),setTimeout(fn){timers.set(++timer,fn);return timer;},clearTimeout(id){timers.delete(id);}};
  const content=target();doc.activeElement=content;
  const prefs={slash:true,slashTrigger:'/',insertOrder:[],hiddenInsert:[],customInsert:[]},writes=[];
  const file={path:'Start.md'},editor={getCursor:()=>({line:0,ch:text.length}),posToOffset:p=>p.ch,focus(){doc.activeElement=content;}};
  const owner={live:true,preferences:()=>prefs,zh:()=>false,suggest:{onTrigger(){const hit=slashAt(text,text.length,{...prefs,inlineSlash:true});return hit?{start:{line:0,ch:hit.from},end:editor.getCursor(),query:hit.query}:null;}},capture(){const source=text;return{editor,file,text:source,from:0,to:text.length,valid:()=>owner.live&&source===text};},choose:(context,entry)=>writes.push(entry.id)};
  const modules={obsidian:{editorInfoField:'info'},'@codemirror/state':{Prec:{highest:v=>v}},'@codemirror/view':{ViewPlugin:{define:create=>({create})},keymap:{of:v=>v}}};
  const module={exports:{}};
  vm.runInNewContext(readFileSync(new URL('../.test-build/platform/insertion-menus.cjs',import.meta.url),'utf8'),{module,exports:module.exports,require:name=>{assert.ok(modules[name]);return modules[name];}});
  const view={dom:{ownerDocument:doc},contentDOM:content,hasFocus:true,composing:false};
  const state=()=>{const main={empty:true,head:text.length};return{doc:{length:text.length},field:()=>({editor,file}),selection:{main,ranges:[main]},readOnly:false};};view.state=state();
  const controller=new module.exports.InsertionMenus(owner),[plugin,keys]=controller.extension(),instance=plugin.create(view);
  // Actual DOM geometry/choices are separately compared in native paired hosts.
  instance.rows=()=>[];instance.render=()=>{rendered++;instance.root={remove(){},contains:()=>false};};instance.position=()=>{};
  const flush=()=>{for(const[id,fn]of [...timers]){timers.delete(id);fn();}};
  const input=(value,event='input.type')=>{text+=value;view.state=state();instance.update({state:view.state,docChanged:true,transactions:[{isUserEvent:e=>event===e||event.startsWith(e+'.')}],changes:{iterChanges(fn){fn(0,0,0,text.length,{toString:()=>value});}}});};
  return{controller,instance,owner,view,prefs,doc,content,writes,input,flush,timers,key:key=>keys.find(k=>k.key===key).run(view),get rendered(){return rendered;},get text(){return text;}};
}
for(const event of ['input.paste','undo','redo','set','input.type.compose'])test(`insert menu ignores non-trigger ${event}`,()=>{
  const f=fixture();f.input('/',event);f.flush();assert.equal(f.rendered,0);assert.equal(f.key('Enter'),false);
});
for(const event of ['input.paste','undo','redo','set','input.type.compose'])test(`ideographic comma ignores non-trigger ${event}`,()=>{
  const f=fixture();f.input('、',event);f.flush();assert.equal(f.rendered,0);assert.equal(f.key('Enter'),false);
});
test('ideographic comma opens the same menu, filters and commits exactly once',()=>{
  const slash=fixture();slash.input('/');slash.flush();
  const f=fixture();f.input('、');f.flush();assert.equal(f.rendered,1);
  assert.deepEqual(Array.from(f.instance.entries,e=>e.id),Array.from(slash.instance.entries,e=>e.id));
  f.input('待办');f.flush();assert.equal(f.key('Enter'),true);assert.deepEqual(f.writes,['task']);assert.equal(f.key('Enter'),false);
});
test('ideographic comma Escape retains text and does not reopen on continued typing',()=>{
  const f=fixture();f.input('、');f.flush();assert.equal(f.key('Escape'),true);
  f.input('task');f.flush();assert.equal(f.rendered,1);assert.equal(f.text,'、task');assert.deepEqual(f.writes,[]);
});
test('whole query, normal enumeration, disabled menu and custom triggers do not open the alias',()=>{
  const whole=fixture();whole.input('、h2');whole.flush();assert.equal(whole.rendered,0);
  const prose=fixture();prose.input('甲');prose.input('、');prose.flush();assert.equal(prose.rendered,0);
  const disabled=fixture();disabled.prefs.slash=false;disabled.input('、');disabled.flush();assert.equal(disabled.rendered,0);
  const custom=fixture();custom.prefs.slashTrigger=';';custom.input('、');custom.flush();assert.equal(custom.rendered,0);
  const explicit=fixture();explicit.prefs.slashTrigger='、';explicit.input('、');explicit.flush();assert.equal(explicit.rendered,1);
});
test('an inserted whole query is not a genuine slash keystroke',()=>{const f=fixture();f.input('/h2');f.flush();assert.equal(f.rendered,0);});
test('slash opens first matching choice; Escape retains literal input and dismissal',()=>{
  const f=fixture();f.input('/');f.flush();assert.equal(f.rendered,1);assert.equal(f.instance.entries[0].id,'h1');
  assert.equal(f.key('Escape'),true);f.input('h2');f.flush();assert.equal(f.rendered,1);assert.equal(f.text,'/h2');assert.equal(f.writes.length,0);
});
test('query changes invalidate old highlighted choice before deferred render',()=>{
  const f=fixture();f.input('/');f.flush();f.input('h2');assert.equal(f.key('Enter'),false);f.flush();assert.equal(f.writes.length,0);
});
test('filtered keyboard commit makes exactly one explicit choice',()=>{
  const f=fixture();f.input('/');f.flush();f.input('h2');f.flush();assert.equal(f.key('Enter'),true);assert.deepEqual(f.writes,['h2']);assert.equal(f.key('Enter'),false);
});
for(const guard of ['composing','readOnly','multi','foreign','unfocused','disabled','oversized','disposed'])test(`pending insert guard: ${guard}`,()=>{
  const f=fixture();f.input('/');
  if(guard==='composing')f.view.composing=true;
  if(guard==='readOnly')f.view.state.readOnly=true;
  if(guard==='multi')f.view.state.selection.ranges.push({});
  if(guard==='foreign')f.doc.activeElement={};
  if(guard==='unfocused')f.view.hasFocus=false;
  if(guard==='disabled')f.prefs.slash=false;
  if(guard==='oversized')f.view.state.doc.length=3*1024*1024;
  if(guard==='disposed')f.controller.dispose();
  f.flush();assert.equal(f.rendered,0);assert.equal(f.writes.length,0);
});
test('stale timer callback cannot close a later valid session',()=>{
  const f=fixture();f.input('/');const stale=[...f.timers.values()][0];f.controller.close();
  f.controller.open(f.owner.capture());assert.equal(f.rendered,1);stale();assert.ok(f.instance.root);assert.equal(f.writes.length,0);
});
test('ARIA restores absent/prior attributes without overwriting later foreign ownership',()=>{
  const f=fixture();f.content.setAttribute('aria-autocomplete','both');f.instance.aria('aria-autocomplete','list');
  f.instance.aria('aria-activedescendant','first');f.instance.aria('aria-activedescendant','second');
  f.instance.aria('aria-controls','ours');f.content.setAttribute('aria-controls','foreign');f.instance.close();
  assert.equal(f.content.getAttribute('aria-autocomplete'),'both');assert.equal(f.content.getAttribute('aria-activedescendant'),null);assert.equal(f.content.getAttribute('aria-controls'),'foreign');
});
test('unload removes listeners and presenter and cancels deferred work',()=>{
  const f=fixture();f.input('/');f.controller.dispose();f.instance.destroy();f.flush();assert.equal(f.rendered,0);assert.equal(f.owner.presenter,undefined);
  assert.equal(f.key('Enter'),false);assert.ok([...f.doc.handlers.values(),...f.doc.defaultView.handlers.values(),...f.content.handlers.values()].every(a=>!a.length));
});
test('moving an existing slash editor clears timers in their original window and migrates outside listeners',()=>{
  const f=fixture(),next=fixture();next.controller.dispose();next.doc.activeElement=f.content;
  f.input('/');const stale=[...f.timers.values()][0];
  f.view.dom.ownerDocument=next.doc;f.instance.update({docChanged:false,selectionSet:false});
  assert.equal(f.timers.size,0);stale();assert.equal(f.rendered,0);
  assert.ok([...f.doc.handlers.values(),...f.doc.defaultView.handlers.values()].every(a=>!a.length));
  assert.equal(next.doc.handlers.get('focusin').length,1);
  f.controller.dispose();assert.ok([...next.doc.handlers.values(),...next.doc.defaultView.handlers.values()].every(a=>!a.length));
});
