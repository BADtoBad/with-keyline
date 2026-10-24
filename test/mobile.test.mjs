import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const require=createRequire(import.meta.url);
const {platformPreferences,mobileUnavailable}=require('../.test-build/domain/mobile.cjs');
const {decodePreferences}=require('../.test-build/domain/preferences.cjs');
test('mobile limits never alter or persist synced desktop choices, including custom inset',()=>{
  const saved=decodePreferences({toolbar:true,blockHandles:true,workspaces:true,typography:{inset:80}}),before=JSON.stringify(saved);
  Object.freeze(saved.typography);Object.freeze(saved);
  const effective=platformPreferences(saved,true);
  for(const key of mobileUnavailable)assert.equal(effective[key],false,key);
  for(const key of ['mentions','slash','fileIcons','typographyEnabled'])assert.equal(effective[key],saved[key]);
  assert.equal(effective.typography.inset,-1);assert.equal(JSON.stringify(saved),before);
  assert.equal(platformPreferences(saved,false),saved);
});
function target(){return{handlers:new Map(),addEventListener(k,f){const a=this.handlers.get(k)??[];a.push(f);this.handlers.set(k,a);},removeEventListener(k,f){this.handlers.set(k,(this.handlers.get(k)??[]).filter(x=>x!==f));},emit(k,e){for(const f of this.handlers.get(k)??[])f(e);}};}
function fixture(mobile=true){
  const module={exports:{}};
  vm.runInNewContext(readFileSync(new URL('../.test-build/platform/mobile-menu.cjs',import.meta.url),'utf8'),{module,exports:module.exports,require:name=>{assert.equal(name,'obsidian');return{Platform:{isMobile:mobile}};},Date});
  const viewport={...target(),offsetLeft:12,offsetTop:100,width:390,height:300};
  const doc={...target(),body:{classList:{contains:()=>mobile}},defaultView:{innerWidth:390,innerHeight:800,visualViewport:viewport,setTimeout:()=>1,clearTimeout(){}}};
  let clicks=0,prevented=0,stopped=0;
  const row={closest(){return this;},click(){clicks++;}};
  const root={...target(),ownerDocument:doc,contains:r=>r===row,offsetWidth:320,offsetHeight:200,style:{setProperty(k,v){this[k]=v;}}};
  const event=(extra={})=>({target:row,pointerType:'touch',isPrimary:true,pointerId:1,clientX:100,clientY:150,preventDefault(){prevented++;},stopImmediatePropagation(){stopped++;},...extra});
  return{api:module.exports,root,doc,row,viewport,event,get clicks(){return clicks;},get prevented(){return prevented;},get stopped(){return stopped;}};
}
test('a tap inserts once and only its duplicate browser click is suppressed',()=>{
  const f=fixture();f.api.bindMobileMenuTouch(f.root);
  f.root.emit('pointerdown',f.event());f.root.emit('pointerup',f.event());assert.equal(f.clicks,1);
  f.doc.emit('click',f.event({isTrusted:false}));assert.equal(f.stopped,0);
  f.doc.emit('click',f.event({isTrusted:true,detail:0}));assert.equal(f.stopped,0);
  f.doc.emit('click',f.event({isTrusted:true,target:{}}));assert.equal(f.stopped,1);
  f.root.emit('pointerdown',f.event());f.root.emit('pointerup',f.event());
  f.doc.emit('pointerdown',f.event({pointerType:'mouse'}));f.doc.emit('click',f.event({isTrusted:true}));assert.equal(f.stopped,1);
});
for(const cancelled of ['move','cancel','secondary','other-pointer','different-target'])test(`mobile ${cancelled} gesture never inserts`,()=>{
  const f=fixture();f.api.bindMobileMenuTouch(f.root);
  f.root.emit('pointerdown',f.event({isPrimary:cancelled!=='secondary'}));
  if(cancelled==='move')f.root.emit('pointermove',f.event({clientY:170}));
  if(cancelled==='cancel')f.root.emit('pointercancel',f.event());
  const end=f.event({pointerId:cancelled==='other-pointer'?2:1,target:cancelled==='different-target'?{closest:()=>null}:f.row});
  f.root.emit('pointerup',end);assert.equal(f.clicks,0);
});
test('desktop menu does not receive touch hooks',()=>{const f=fixture(false);f.api.bindMobileMenuTouch(f.root);assert.equal(f.root.handlers.size,0);});
test('mobile menus fit the keyboard-reduced viewport including its offset',()=>{
  const f=fixture();f.api.positionMobileMenu(f.root,{x:350,y:790});
  assert.equal(f.root.style.left,'74px');assert.equal(f.root.style.top,'192px');
  assert.equal(f.root.style.maxWidth,'374px');assert.equal(f.root.style.maxHeight,'284px');
});
test('visual viewport handlers detach on unload and never attach on desktop',()=>{
  const f=fixture();let calls=0;const stop=f.api.watchMobileViewport(f.doc,()=>calls++);
  f.viewport.emit('resize',{});f.viewport.emit('scroll',{});assert.equal(calls,2);stop();
  f.viewport.emit('resize',{});assert.equal(calls,2);
  const desktop=fixture(false);desktop.api.watchMobileViewport(desktop.doc,()=>{});assert.equal(desktop.viewport.handlers.size,0);
});
