import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const module={exports:{}};
vm.runInNewContext(readFileSync(new URL('../.test-build/platform/selection-menu.cjs',import.meta.url),'utf8'),{
  module,exports:module.exports,console,require:name=>{
    assert.equal(name,'obsidian');return {Scope:class{register(){}},Notice:class{}};
  }
});
const {SelectionMenu}=module.exports;
// Isolate lifecycle/ownership from the separately native-tested menu layout.
for(const method of ['render','position','focusFirst'])SelectionMenu.prototype[method]=()=>{};
SelectionMenu.prototype.createPanel=function(){return this.doc.createElement('div')};
function setup(){
  class Target{
    handlers=new Map();dataset={};children=[];
    addEventListener(k,f){const a=this.handlers.get(k)??[];a.push(f);this.handlers.set(k,a)}
    removeEventListener(k,f){this.handlers.set(k,(this.handlers.get(k)??[]).filter(n=>n!==f))}
    emit(type){for(const f of this.handlers.get(type)??[])f({type,target:this})}
    append(e){this.children.push(e)}remove(){this.removed=true}contains(e){return e===this}
  }
  const doc=new Target();doc.body=new Target();doc.defaultView=new Target();doc.createElement=()=>new Target();
  const scopes=[],releases=[],editor={focused:0,focus(){this.focused++}},app={keymap:{pushScope:s=>scopes.push(s),popScope:s=>{const at=scopes.indexOf(s);assert.notEqual(at,-1);scopes.splice(at,1)}}};
  const menu=new SelectionMenu(app,{}, {editor},{x:0,y:0},doc,'main',resume=>releases.push(resume));
  return{doc,menu,scopes,releases,editor};
}
test('native-window blur closes only its menu and releases its scope without refocusing',()=>{
  const f=setup(),foreign={};f.scopes.unshift(foreign);f.doc.defaultView.emit('blur');
  assert.equal(f.menu.closed,true);assert.equal(f.menu.root.removed,true);assert.deepEqual(f.releases,[false]);assert.equal(f.editor.focused,0);
  assert.deepEqual(f.scopes,[foreign]);assert.ok([...f.doc.handlers.values(),...f.doc.defaultView.handlers.values()].every(a=>a.length===0));
  f.menu.close(true);assert.equal(f.editor.focused,0);assert.deepEqual(f.releases,[false]);
});
test('explicit Escape-style close retains refocus while later window events cannot repeat it',()=>{
  const f=setup();f.menu.close(true);f.doc.defaultView.emit('blur');
  assert.deepEqual(f.releases,[true]);assert.equal(f.editor.focused,1);assert.deepEqual(f.scopes,[]);
});
test('two native documents own separate menu blur listeners',()=>{
  const a=setup(),b=setup();a.doc.defaultView.emit('blur');assert.equal(b.menu.closed,false);assert.equal(b.scopes.length,1);
  b.menu.hide();assert.deepEqual(b.releases,[false]);assert.equal(b.editor.focused,0);
});
