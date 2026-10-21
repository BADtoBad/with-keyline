import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const module={exports:{}};
vm.runInNewContext(readFileSync(new URL('../.test-build/platform/block-handles.cjs',import.meta.url),'utf8'),{
  module,exports:module.exports,console,setTimeout,clearTimeout,
  require(name){
    if(name==='@codemirror/view')return {ViewPlugin:{define:(create,spec)=>({create,...spec})}};
    if(name==='@codemirror/language')return {};
    assert.equal(name,'obsidian');return {SuggestModal:class{},Modal:class{},Scope:class{}};
  }
});
const {BlockHandles}=module.exports;
class Target {
  handlers=new Map();children=[];classList={remove(){}};
  addEventListener(type,fn,options){const entries=this.handlers.get(type)??[];entries.push({fn,capture:options===true||!!options?.capture});this.handlers.set(type,entries)}
  removeEventListener(type,fn,options){const capture=options===true||!!options?.capture;this.handlers.set(type,(this.handlers.get(type)??[]).filter(e=>e.fn!==fn||e.capture!==capture))}
  append(...nodes){for(const node of nodes){node.ownerDocument=this.ownerDocument;this.children.push(node)}}
  setAttribute(){}remove(){this.removed=true}
  contains(node){return node===this||this.children.some(child=>child.contains(node))}
  emit(type,event={}){for(const {fn} of this.handlers.get(type)??[])fn(event)}
}
function documentFixture(){
  const doc=new Target();doc.body=new Target();doc.body.ownerDocument=doc;doc.defaultView=new Target();
  doc.createElement=()=>{const element=new Target();element.ownerDocument=doc;return element};return doc;
}
function setup(){
  const doc=documentFixture(),dom=new Target(),contentDOM=new Target(),scrollDOM=new Target();dom.ownerDocument=doc;
  const owner=new BlockHandles({},()=>({blockHandles:false,dragGranularity:'block'}),()=>false,{},async()=>{});
  const extension=owner.extension(),view={dom,contentDOM,scrollDOM},instance=extension.create(view);
  return {doc,view,owner,extension,instance};
}
test('media hover is captured once on editor content, not the whole document or CodeMirror widget route',()=>{
  const {doc,view,owner,extension,instance}=setup(),seen=[];
  instance.hover=event=>seen.push(event);
  const event={target:{contentEditable:'false'},preventDefault(){assert.fail('Do not consume native media controls')},stopPropagation(){assert.fail('Do not consume native media controls')}};
  const listeners=view.contentDOM.handlers.get('pointermove');assert.equal(listeners.length,1);assert.equal(listeners[0].capture,true);
  assert.equal(extension.eventHandlers.pointermove,undefined);assert.equal(doc.handlers.has('pointermove'),false);
  assert.equal(view.dom.handlers.has('pointermove'),false);view.contentDOM.emit('pointermove',event);assert.deepEqual(seen,[event]);owner.dispose();
});
test('only leaving the editor content triggers the content leave route; nested widget boundaries do not capture it',()=>{
  const {view,owner,extension,instance}=setup();let calls=0;instance.leave=()=>calls++;
  const listeners=view.contentDOM.handlers.get('pointerleave');assert.equal(listeners.length,1);assert.equal(listeners[0].capture,false);
  assert.equal(extension.eventHandlers.pointerleave,undefined);view.contentDOM.emit('pointerleave');assert.equal(calls,1);owner.dispose();
});
test('media hover listeners migrate with the existing editor without accumulating document or window handlers',()=>{
  const {doc,view,owner,instance}=setup(),other=documentFixture();
  for(const next of [other,doc,other]){
    const previous=view.dom.ownerDocument;view.dom.ownerDocument=next;instance.refresh();
    assert.ok([...previous.handlers.values(),...previous.defaultView.handlers.values()].every(entries=>entries.length===0));
    assert.equal(view.contentDOM.handlers.get('pointermove').length,1);assert.equal(view.contentDOM.handlers.get('pointerleave').length,1);
    assert.equal(view.scrollDOM.handlers.get('scroll').length,1);assert.equal(instance.root.ownerDocument,next);assert.equal(instance.dropLine.ownerDocument,next);
  }
  owner.dispose();assert.ok([...other.handlers.values(),...other.defaultView.handlers.values(),...view.contentDOM.handlers.values(),...view.scrollDOM.handlers.values()].every(entries=>entries.length===0));
});
test('destroy and repeated disposal release media observers, leave no active overlay and ignore later pointer input',()=>{
  const {doc,view,owner,instance}=setup();let calls=0;instance.hover=()=>calls++;
  owner.dispose();owner.dispose();view.contentDOM.emit('pointermove');assert.equal(calls,0);
  assert.ok(instance.root.removed&&instance.dropLine.removed);
  assert.ok([...doc.handlers.values(),...doc.defaultView.handlers.values(),...view.contentDOM.handlers.values(),...view.scrollDOM.handlers.values()].every(entries=>entries.length===0));
});
test('disabled handles do not query media coordinates or create delayed work',()=>{
  const {view,owner,instance}=setup();view.posAtCoords=()=>assert.fail('Disabled handles must remain inert');
  view.contentDOM.emit('pointermove',{buttons:0,target:view.contentDOM});assert.equal(instance.showTimer,undefined);assert.equal(instance.root.hidden,true);owner.dispose();
});
