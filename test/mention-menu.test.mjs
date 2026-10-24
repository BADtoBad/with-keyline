import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

function fixture(mobile=false){
  const target=()=>({handlers:new Map(),attrs:new Map(),addEventListener(k,f){const a=this.handlers.get(k)??[];a.push(f);this.handlers.set(k,a);},removeEventListener(k,f){this.handlers.set(k,(this.handlers.get(k)??[]).filter(x=>x!==f));},emit(k,e={}){for(const f of this.handlers.get(k)??[])f(e);},getAttribute(k){return this.attrs.get(k)??null;},setAttribute(k,v){this.attrs.set(k,v);},removeAttribute(k){this.attrs.delete(k);}});
  const doc=target(),timers=new Map();let timer=0,rendered=0;
  doc.defaultView={...target(),setTimeout(fn){timers.set(++timer,fn);return timer;},clearTimeout(id){timers.delete(id);}};
  const content=target();doc.activeElement=content;
  doc.body={classList:{contains:()=>mobile}};
  const prefs={mentions:true,dateFormat:'YYYY-MM-DD',timeFormat:'HH:mm'},writes=[];
  class TFile {path='Start.md';basename='Start';stat={mtime:0};}
  const file=new TFile();
  const app={vault:{getMarkdownFiles:()=>[file],getAbstractFileByPath:()=>file},metadataCache:{getFileCache:()=>null,fileToLinktext:()=> 'Start'}};
  const modules={obsidian:{editorInfoField:'info',TFile,Notice:class{},moment:()=>({locale(){return this;},format:pattern=>pattern})},'@codemirror/state':{Prec:{highest:v=>v}},'@codemirror/view':{ViewPlugin:{define:create=>({create})},keymap:{of:v=>v}}};
  const module={exports:{}};
  vm.runInNewContext(readFileSync(new URL('../.test-build/platform/mention-menu.cjs',import.meta.url),'utf8'),{module,exports:module.exports,require:name=>{assert.ok(modules[name]);return modules[name];}});
  let text='';
  const editor={getCursor:()=>({line:0,ch:text.length}),getLine:()=>text,somethingSelected:()=>false,listSelections:()=>[{}],posToOffset:p=>p.ch,offsetToPos:ch=>({line:0,ch}),getRange:(a,b)=>text.slice(a.ch,b.ch),replaceRange:(value,a,b)=>{writes.push(value);text=text.slice(0,a.ch)+value+text.slice(b.ch);},setCursor(){}};
  const view={dom:{ownerDocument:doc},contentDOM:content,hasFocus:true,composing:false};
  const state=()=>{const main={empty:true,head:text.length};return {doc:{length:text.length},field:()=>({editor,file}),selection:{main,ranges:[main]},readOnly:false};};
  view.state=state();
  const controller=new module.exports.MentionController(app,()=>prefs,()=>false),[plugin,keys]=controller.extension(),instance=plugin.create(view);
  // Rendering is exercised in real paired hosts; these tests isolate event,
  // ownership and lifecycle transitions without mocking a browser layout.
  instance.render=()=>{rendered++;};instance.position=()=>{};
  const flush=()=>{for(const [id,fn]of [...timers]){timers.delete(id);fn();}};
  const input=(value,event='input.type')=>{const from=text.length;text+=value;view.state=state();instance.update({state:view.state,docChanged:true,transactions:[{isUserEvent:e=>event===e||event.startsWith(e+'.')}],changes:{iterChanges(fn){fn(from,from,from,text.length,{toString:()=>value});}}});};
  const key=key=>keys.find(k=>k.key===key).run(view);
  return {controller,instance,view,prefs,doc,content,writes,input,key,flush,timers,get rendered(){return rendered;},get text(){return text;}};
}
for(const event of ['input.paste','undo','redo','set','input.type.compose'])test(`non-trigger input does not open passive mentions: ${event}`,()=>{
  const f=fixture();f.input('@',event);f.flush();assert.equal(f.rendered,0);assert.equal(f.key('Enter'),false);assert.equal(f.text,'@');
});
test('mobile IME trigger is inert until composition finishes; then opens without editing',()=>{
  const f=fixture(true);f.view.composing=true;f.content.emit('compositionstart');
  f.input('@','input.type.compose');f.flush();assert.equal(f.rendered,0);assert.equal(f.writes.length,0);
  f.view.composing=false;f.content.emit('compositionend');f.flush();assert.equal(f.rendered,1);assert.equal(f.text,'@');
});
test('mobile composition trigger cancellation cannot resurrect an @ menu',()=>{
  const f=fixture(true);f.view.composing=true;f.content.emit('compositionstart');f.input('@','input.type.compose');f.instance.close();
  f.view.composing=false;f.content.emit('compositionend');f.flush();assert.equal(f.rendered,0);assert.equal(f.writes.length,0);
});
test('mobile viewport and editor autoscroll retain the literal mention session',()=>{
  const f=fixture(true);f.input('@');f.flush();let positioned=0;f.instance.position=()=>positioned++;
  f.instance.viewport({type:'resize',target:f.doc.defaultView});f.instance.viewport({type:'scroll',target:f.content});
  assert.equal(positioned,2);assert.equal(f.instance.anchor,0);assert.equal(f.writes.length,0);
  const desktop=fixture();desktop.input('@');desktop.flush();desktop.instance.viewport({type:'resize',target:desktop.doc.defaultView});assert.equal(desktop.instance.anchor,-1);
});
test('an entire inserted query is not confused with an actual trigger keystroke',()=>{
  const f=fixture();f.input('@Start');f.flush();assert.equal(f.rendered,0);
});
test('plain Enter stays native; dismissed text does not reopen until another trigger',()=>{
  const f=fixture();f.input('@');f.flush();assert.equal(f.rendered,1);assert.equal(f.instance.active,-1);
  assert.equal(f.key('Enter'),false);f.input('Start');f.flush();assert.equal(f.rendered,1);assert.equal(f.writes.length,0);
});
test('Escape, preference refresh and dispose cancel pending renders',()=>{
  for(const operation of [f=>f.instance.close(),f=>f.controller.refresh(),f=>f.controller.dispose()]){
    const f=fixture();f.input('@');operation(f);f.flush();assert.equal(f.rendered,0);assert.equal(f.key('Enter'),false);
  }
});
for(const guard of ['composing','readOnly','multi','foreign','unfocused','disabled','oversized'])test(`current-context guard suppresses pending mention: ${guard}`,()=>{
  const f=fixture();f.input('@');
  if(guard==='composing')f.view.composing=true;
  if(guard==='readOnly')f.view.state.readOnly=true;
  if(guard==='multi')f.view.state.selection.ranges.push({});
  if(guard==='foreign')f.doc.activeElement={};
  if(guard==='unfocused')f.view.hasFocus=false;
  if(guard==='disabled')f.prefs.mentions=false;
  if(guard==='oversized')f.view.state.doc.length=3*1024*1024;
  f.flush();assert.equal(f.rendered,0);assert.equal(f.writes.length,0);
});
test('query changes immediately invalidate a previously highlighted row before the timer',()=>{
  const f=fixture();f.input('@');f.flush();f.instance.active=0;f.input('x');assert.equal(f.instance.active,-1);
  assert.equal(f.key('Enter'),false);f.flush();assert.equal(f.writes.length,0);
});
test('foreign source changes close the session and pending work cannot resurrect it',()=>{
  const f=fixture();f.input('@');f.flush();f.input('Start','set');f.flush();assert.equal(f.rendered,1);assert.equal(f.instance.anchor,-1);
});
test('ARIA cleanup restores prior owned values but does not overwrite a later foreign value',()=>{
  const f=fixture();f.content.setAttribute('aria-autocomplete','both');f.instance.aria('aria-autocomplete','list');
  f.instance.aria('aria-controls','ours');f.content.setAttribute('aria-controls','foreign');f.instance.close();
  assert.equal(f.content.getAttribute('aria-autocomplete'),'both');assert.equal(f.content.getAttribute('aria-controls'),'foreign');
});
test('unload removes listeners, pending work and active keyboard routes',()=>{
  const f=fixture();f.input('@');f.controller.dispose();f.instance.destroy();f.flush();
  assert.equal(f.rendered,0);assert.equal(f.key('ArrowDown'),false);
  assert.ok([...f.doc.handlers.values(),...f.doc.defaultView.handlers.values(),...f.content.handlers.values()].every(a=>!a.length));
});
test('moving an existing editor cancels its old-window timer and rebinds document listeners',()=>{
  const f=fixture(),next=fixture();next.controller.dispose();next.doc.activeElement=f.content;
  f.input('@');const stale=[...f.timers.values()][0];
  f.view.dom.ownerDocument=next.doc;f.instance.update({docChanged:false,selectionSet:false});
  assert.equal(f.timers.size,0);stale();assert.equal(f.rendered,0);
  assert.ok([...f.doc.handlers.values(),...f.doc.defaultView.handlers.values()].every(a=>!a.length));
  assert.equal(next.doc.handlers.get('pointerdown').length,1);
  f.controller.dispose();assert.ok([...next.doc.handlers.values(),...next.doc.defaultView.handlers.values()].every(a=>!a.length));
});
test('Chinese query composition keeps its @ session without consuming candidate keys',()=>{
  const f=fixture();f.input('@');f.flush();f.instance.active=0;
  f.view.composing=true;f.content.emit('compositionstart');
  assert.equal(f.instance.active,-1);
  f.input('任务','input.type.compose');f.flush();
  assert.equal(f.instance.context.query,'任务');assert.equal(f.rendered,2);
  for(const key of ['Enter','Tab','ArrowDown','ArrowUp','Escape'])assert.equal(f.key(key),false);
  assert.equal(f.instance.anchor,0);assert.equal(f.writes.length,0);
  f.view.composing=false;f.content.emit('compositionend');f.flush();
  assert.equal(f.instance.context.query,'任务');assert.equal(f.rendered,3);assert.equal(f.text,'@任务');
});
test('cancelled composition restores the original query; a closed session never resurrects',()=>{
  for(const close of [false,true]){
    const f=fixture();f.input('@');f.input('Sta');f.flush();
    f.view.composing=true;f.content.emit('compositionstart');
    if(close)f.instance.close();
    f.view.composing=false;f.content.emit('compositionend');f.flush();
    assert.equal(f.instance.anchor,close?-1:0);assert.equal(f.instance.context?.query,close?undefined:'Sta');
    assert.equal(f.writes.length,0);
  }
});
test('compositionend tolerates CM clearing its composing flag after the DOM event',()=>{
  const f=fixture();f.input('@');f.flush();f.view.composing=true;f.content.emit('compositionstart');
  f.input('任务','input.type.compose');f.content.emit('compositionend');f.flush();
  assert.equal(f.instance.anchor,0);assert.equal(f.timers.size,1);
  f.view.composing=false;f.flush();assert.equal(f.instance.context.query,'任务');
});
test('external edits during composition cancel the session instead of resuming it',()=>{
  const f=fixture();f.input('@');f.flush();f.view.composing=true;f.content.emit('compositionstart');
  f.input('external','set');f.view.composing=false;f.content.emit('compositionend');f.flush();
  assert.equal(f.instance.anchor,-1);assert.equal(f.writes.length,0);
});
test('Chinese prose directly before @ opens a menu and preserves the prefix on commit',()=>{
  const f=fixture();f.input('提到');f.flush();f.input('@');f.flush();
  assert.equal(f.instance.anchor,2);assert.equal(f.rendered,1);
  f.input('Start');f.flush();assert.equal(f.instance.context.query,'Start');
  assert.equal(f.instance.choices[0].label,'Start');
  // Rendering is intentionally stubbed in this fixture; native arrow/pointer
  // row selection is covered by the paired host gate.
  f.instance.active=0;assert.equal(f.key('Enter'),true);
  assert.equal(f.text,'提到[[Start]]');
});
test('no-space Chinese prose keeps literal input on cancellation; email-like tails stay suppressed',()=>{
  const f=fixture();f.input('正文');f.input('@');f.flush();assert.equal(f.key('Escape'),true);
  f.input('任务');f.flush();assert.equal(f.text,'正文@任务');assert.equal(f.instance.anchor,-1);
  const email=fixture();email.input('正文name');email.input('@');email.flush();
  assert.equal(email.rendered,0);assert.equal(email.instance.anchor,-1);
});
test('an open query accepts continued words, spaces and punctuation without reapplying trigger rules',()=>{
  const f=fixture();f.input('正文');f.input('@');f.flush();
  for(const chunk of [' ', '任务', '.v2', ' more', '`literal`', '（继续）']){
    f.input(chunk);f.flush();assert.equal(f.instance.anchor,2);
    assert.equal(f.instance.context.query,f.text.slice(3));assert.equal(f.writes.length,0);
  }
  assert.equal(f.key('Escape'),true);assert.equal(f.instance.anchor,-1);
  f.input('仍是文本');f.flush();assert.equal(f.instance.anchor,-1);
});
