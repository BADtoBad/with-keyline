import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
const module = { exports: {} };
vm.runInNewContext(readFileSync(new URL("../.test-build/platform/selection-toolbar.cjs", import.meta.url), "utf8"), {
  module, exports: module.exports, console,
  require: name => {
    if (name === "@codemirror/view") return { ViewPlugin: { define: (create, spec) => ({ create, ...spec }) } };
    assert.equal(name, "obsidian"); return { SuggestModal: class {} };
  }
});
const { ToolbarController } = module.exports;
const handlers = new ToolbarController({}, () => ({}), () => false, {}).extension().eventHandlers;
for (const event of [
  { key: "a", ctrlKey: true }, { key: "a", metaKey: true }, { key: "ArrowLeft", shiftKey: true }, { key: "Escape" }
]) test(`embedded input key cannot arm the editor toolbar: ${JSON.stringify(event)}`, () => {
  const target = {}, instance = { armed: true, foreignInput: e => e === target, hide() { this.hidden = true; } };
  assert.equal(handlers.keydown.call(instance, { ...event, target }), false);
  assert.equal(instance.armed, false); assert.equal(instance.hidden, true);
});
test("editor keyboard selection arms but never consumes the native selection event", () => {
  const instance = { armed: false, foreignInput: () => false, hide() {} };
  assert.equal(handlers.keydown.call(instance, { key: "ArrowRight", shiftKey: true }), false);
  assert.equal(instance.armed, true);
  assert.equal(handlers.keydown.call(instance, { key: "Escape" }), false);
  assert.equal(instance.armed, false);
});
test("foreign pointer inputs do not start a genuine-editor selection gesture", () => {
  const instance = { armed: true, pointer: true, foreignInput: () => true, hide() { this.hidden = true; } };
  handlers.pointerdown.call(instance, { target: {} });
  assert.equal(instance.pointer, false); assert.equal(instance.armed, false); assert.equal(instance.hidden, true);
});
test("only an explicit native Callout edit control arms the widget pointer route and unload removes it",()=>{
  class Target {
    handlers=new Map();children=[];
    addEventListener(key,fn){const list=this.handlers.get(key)??[];list.push(fn);this.handlers.set(key,list);}
    removeEventListener(key,fn){this.handlers.set(key,(this.handlers.get(key)??[]).filter(f=>f!==fn));}
    append(child){this.children.push(child);}setAttribute(){}remove(){this.removed=true;}
  }
  const doc=new Target();doc.body=new Target();doc.createElement=()=>{const e=new Target();e.ownerDocument=doc;return e;};
  const dom=new Target();dom.ownerDocument=doc;
  const controller=new ToolbarController({},()=>({}),()=>false,{}),view={dom,contentDOM:new Target()};
  const instance=controller.extension().create(view),handler=dom.handlers.get('pointerdown')[0];
  for(const [button,control,foreign,expected] of [[0,true,false,true],[2,true,false,false],[0,false,false,false],[0,true,true,false]]){
    instance.pointer=false;instance.armed=false;
    const target={closest:selector=>selector.startsWith('.cm-callout')?(control?{}:null):(foreign?{}:null)};
    handler({button,target});assert.equal(instance.pointer,expected);assert.equal(instance.armed,false);
  }
  controller.dispose();assert.equal(dom.handlers.get('pointerdown').length,0);assert.equal(dom.handlers.get('keydown').length,0);
  assert.ok(doc.body.children[0].removed);
});
test('an existing toolbar moves to its editor document and releases the old window listeners',()=>{
  class Target {
    handlers=new Map();children=[];
    addEventListener(k,f){const a=this.handlers.get(k)??[];a.push(f);this.handlers.set(k,a);}
    removeEventListener(k,f){this.handlers.set(k,(this.handlers.get(k)??[]).filter(fn=>fn!==f));}
    append(e){e.ownerDocument=this.ownerDocument;this.children.push(e);}setAttribute(){}remove(){this.removed=true;}
  }
  const make=()=>{const doc=new Target();doc.body=new Target();doc.body.ownerDocument=doc;doc.defaultView=new Target();doc.createElement=()=>new Target();return doc;};
  const a=make(),b=make(),dom=new Target();dom.ownerDocument=a;
  const controller=new ToolbarController({},()=>({}),()=>false,{}),instance=controller.extension().create({dom,contentDOM:new Target()});
  for(const doc of [b,a,b]){
    const old=dom.ownerDocument;dom.ownerDocument=doc;instance.armed=true;instance.pointer=true;instance.syncDocument();
    assert.equal(instance.root.ownerDocument,doc);assert.equal(instance.root.hidden,true);assert.equal(instance.armed,false);assert.equal(instance.pointer,false);
    assert.ok([...old.handlers.values(),...old.defaultView.handlers.values()].every(list=>!list.length));
    assert.equal(doc.handlers.get('pointerup').length,1);assert.equal(doc.handlers.get('focusin').length,1);
  }
  controller.dispose();assert.ok([...b.handlers.values(),...b.defaultView.handlers.values()].every(list=>!list.length));
});
for(const[event,focused,expected]of [['undo',true,true],['redo',true,true],['undo',false,false],['input.type',true,false],['input.margin.sidenote',true,false],['keyline-marginalia.insert-marginnote',true,false],['select',true,false]])test(`history toolbar intent: ${event}, focused=${focused}`,()=>{
  class Target{handlers=new Map();addEventListener(k,f){this.handlers.set(k,f)}removeEventListener(){}append(){}setAttribute(){}remove(){}}
  const doc=new Target();doc.body=new Target();doc.createElement=()=>{const e=new Target();e.ownerDocument=doc;return e};
  const dom=new Target();dom.ownerDocument=doc;
  const controller=new ToolbarController({},()=>({}),()=>false,{}),view={dom,contentDOM:new Target(),hasFocus:focused};
  const instance=controller.extension().create(view);instance.schedule=()=>{};instance.armed=true;
  instance.update({docChanged:true,transactions:[{isUserEvent:value=>value===event}]});
  assert.equal(instance.armed,expected);controller.dispose();
});

function windowFixture(){
  class Target{
    handlers=new Map();children=[];
    addEventListener(k,f){const a=this.handlers.get(k)??[];a.push(f);this.handlers.set(k,a)}
    removeEventListener(k,f){this.handlers.set(k,(this.handlers.get(k)??[]).filter(n=>n!==f))}
    append(e){this.children.push(e)}setAttribute(){}remove(){}
    contains(e){return e===this||this.children.some(n=>n.contains(e))}
    closest(){return null}
    emit(type){for(const f of this.handlers.get(type)??[])f({type,target:this})}
  }
  const doc=new Target();doc.focused=true;doc.hasFocus=()=>doc.focused;
  doc.body=new Target();doc.defaultView=new Target();doc.createElement=()=>{const e=new Target();e.ownerDocument=doc;return e};
  const dom=new Target();dom.ownerDocument=doc;
  const state={selection:{main:{from:0,to:4,empty:false},ranges:[{}]},doc:{length:14,toString:()=>'Keep this text'},sliceDoc:()=> 'Keep',field:()=>({editor:{},file:{path:'Start.md'}})};
  const view={dom,contentDOM:new Target(),state,hasFocus:false,requestMeasure:m=>{view.pending=m}};
  const controller=new ToolbarController({},()=>({toolbar:true}),()=>false,{}),instance=controller.extension().create(view);
  instance.armed=true;instance.root.hidden=false;instance.shown=true;
  instance.snapshot={from:0,to:4,text:'Keep',document:'Keep this text'};
  const button=new Target();instance.root.append(button);doc.activeElement=button;
  return{doc,view,controller,instance};
}
test('native window blur dismisses a keyboard-focused toolbar without retaining a stale action',()=>{
  const {doc,controller,instance}=windowFixture();assert.equal(instance.eligible(),true);assert.equal(instance.valid(),true);
  instance.pointer=true;instance.focusRequested=true;doc.focused=false;doc.defaultView.emit('blur');
  assert.equal(instance.root.hidden,true);assert.equal(instance.armed,false);assert.equal(instance.pointer,false);assert.equal(instance.focusRequested,false);
  assert.equal(instance.valid(),false);controller.dispose();assert.equal(doc.defaultView.handlers.get('blur')?.length,0);
});
for(const explicit of [false,true])test(`inactive document rejects stale scheduled toolbar geometry, focus request=${explicit}`,()=>{
  const {doc,view,controller,instance}=windowFixture();instance.focusRequested=explicit;
  instance.schedule();doc.focused=false;
  assert.equal(instance.eligible(),false);assert.equal(view.pending.read(),null);assert.equal(instance.valid(),false);
  controller.dispose();
});
for(const changed of [false,true])test(`returning native focus restores only the unchanged prior selection, changed=${changed}`,()=>{
  const {doc,view,controller,instance}=windowFixture();
  view.coordsAtPos=()=>({left:20,top:30,bottom:50});view.scrollDOM={getBoundingClientRect:()=>({left:0,top:0,bottom:200})};
  doc.focused=false;doc.defaultView.emit('blur');
  if(changed)view.state.doc.toString=()=>'Changed this text';
  doc.focused=true;view.hasFocus=true;doc.defaultView.emit('focus');
  const measurement=view.pending.read();assert.equal(instance.armed,!changed);assert.equal(measurement===null,changed);
  controller.dispose();
});
test('returning to a foreign field cannot revive the suspended toolbar',()=>{
  const {doc,view,controller,instance}=windowFixture();doc.focused=false;doc.defaultView.emit('blur');doc.focused=true;
  const input={closest:()=>input};doc.activeElement=input;
  for(const f of doc.handlers.get('focusin'))f({target:input});
  view.hasFocus=false;doc.defaultView.emit('focus');assert.equal(view.pending.read(),null);assert.equal(instance.armed,false);controller.dispose();
});
test('Escape cancels a pending native-window selection resume before its measured frame',()=>{
  const {doc,view,controller,instance}=windowFixture();
  view.coordsAtPos=()=>({left:20,top:30,bottom:50});view.scrollDOM={getBoundingClientRect:()=>({left:0,top:0,bottom:200})};
  doc.focused=false;doc.defaultView.emit('blur');doc.focused=true;view.hasFocus=true;doc.defaultView.emit('focus');
  view.dom.handlers.get('keydown')[0]({key:'Escape',target:view.contentDOM});
  assert.equal(view.pending.read(),null);assert.equal(instance.armed,false);controller.dispose();
});
