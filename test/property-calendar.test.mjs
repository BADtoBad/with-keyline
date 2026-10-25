import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const module={exports:{}};
vm.runInNewContext(readFileSync(new URL('../.test-build/platform/property-calendar.cjs',import.meta.url),'utf8'),{
  module,exports:module.exports,require:name=>{assert.equal(name,'obsidian');return {setIcon(){}};}
});
const {PropertyCalendar:C}=module.exports;
function fixture(){
  const events=[],doc={body:{classList:{contains:()=>false}},defaultView:{Event:class{constructor(type){this.type=type;}}}};
  const input={ownerDocument:doc,type:'date',value:'2026-10-25',min:'',max:'',disabled:false,readOnly:false,isConnected:true,
    getClientRects:()=>[{}],hasAttribute:()=>false,cloneNode:()=>({value:'',validity:{valid:true}}),
    focus:()=>events.push('focus'),blur:()=>events.push('blur'),dispatchEvent:e=>events.push(e.type),closest:()=>({focus:()=>events.push('row-focus')})};
  const f=Object.create(C.prototype);Object.assign(f,{live:true,doc,input,original:input.value,selected:input.value,cursor:{year:2026,month:10,day:25},time:'09:30:42',valid:()=>true,
    close(){this.live=false;events.push('close');},render(){events.push('render');},position(){},focusDay(){}});
  return {f,input,events,doc};
}
for(const kind of ['mobile','unsupported-type','missing-window'])test(`native fallback: ${kind}`,()=>{
  const {input,doc}=fixture();if(kind==='mobile')doc.body.classList.contains=()=>true;
  if(kind==='unsupported-type')input.type='text';if(kind==='missing-window')doc.defaultView=null;
  assert.equal(C.supported(input),false);
});
for(const kind of ['foreign-note','detached','disabled','readonly','changed-value','foreign-document','hidden','mobile'])test(`stale popup closes without events on the input: ${kind}`,()=>{
  const {f,input,events,doc}=fixture();
  if(kind==='foreign-note')f.valid=()=>false;if(kind==='detached')input.isConnected=false;
  if(kind==='disabled')input.disabled=true;if(kind==='readonly')input.readOnly=true;
  if(kind==='changed-value')input.value='2026-10-26';if(kind==='foreign-document')input.ownerDocument={};
  if(kind==='hidden')input.getClientRects=()=>[];if(kind==='mobile')doc.body.classList.contains=()=>true;
  f.refresh();assert.deepEqual(events,['close']);
});
test('native commit emits one input/change/blur and restores the property row for undo',()=>{
  const {f,input,events}=fixture();f.commit('2026-11-01');
  assert.equal(input.value,'2026-11-01');assert.deepEqual(events,['close','focus','input','change','blur','row-focus']);
});
test('selecting the current value does not create an edit',()=>{
  const {f,input,events}=fixture();f.commit(input.value);assert.deepEqual(events,['close','row-focus']);
});
test('Clear preserves the native empty string contract',()=>{
  const {f,input,events}=fixture();f.commit('');assert.equal(input.value,'');assert.equal(events.filter(e=>e==='input').length,1);
});
test('stale values cannot be overwritten by a late click',()=>{
  const {f,input,events}=fixture();input.value='2026-12-12';f.commit('2026-11-01');assert.equal(input.value,'2026-12-12');assert.deepEqual(events,['close']);
});
test('invalid native range/step validation prevents commit',()=>{
  const {f,input,events}=fixture();input.cloneNode=()=>({value:'',validity:{valid:false}});f.commit('2026-11-01');assert.deepEqual(events,[]);assert.equal(input.value,'2026-10-25');
});
test('date-time selection remains a draft until Apply',()=>{
  const {f,input,events}=fixture();input.type='datetime-local';f.choose('2026-11-01');assert.equal(f.selected,'2026-11-01');assert.equal(input.value,'2026-10-25');assert.deepEqual(events,['render']);
});
test('date-time keeps existing seconds and relaxes only the implicit browser step',()=>{
  for(const explicit of [false,true]){
    const {f,input}=fixture(),probe={value:'',validity:{valid:true},step:'60'};
    input.type='datetime-local';input.hasAttribute=()=>explicit;input.cloneNode=()=>probe;
    f.commit('2026-11-01');assert.equal(input.value,'2026-11-01T09:30:42');assert.equal(probe.step,explicit?'60':'any');
  }
});
test('min/max dates are inclusive, invalid and out-of-range dates are rejected',()=>{
  const {f,input}=fixture();input.min='2026-10-10';input.max='2026-10-20';
  assert.equal(f.allowed('2026-10-10'),true);assert.equal(f.allowed('2026-10-20'),true);
  for(const date of ['2026-10-09','2026-10-21','2026-02-30'])assert.equal(f.allowed(date),false);
});
test('Enter and Space activate only enabled buttons; composition is not consumed',()=>{
  for(const key of ['Enter',' '])for(const disabled of [false,true]){
    const {f}=fixture();let clicks=0,prevented=0;const target={tagName:'BUTTON',disabled,click:()=>clicks++};
    f.key({key,target,preventDefault:()=>prevented++,stopPropagation(){}});assert.equal(clicks,disabled?0:1);assert.equal(prevented,1);
    f.key({key,target,isComposing:true,preventDefault(){throw Error('IME should pass');}});assert.equal(clicks,disabled?0:1);
  }
});
test('navigation changes the cursor but never the selected value or native input',()=>{
  const {f,input,events}=fixture();f.key({key:'ArrowRight',target:{dataset:{date:'2026-10-25'}},preventDefault(){},stopPropagation(){}});
  assert.equal(f.cursor.day,26);assert.equal(f.selected,'2026-10-25');assert.equal(input.value,'2026-10-25');assert.deepEqual(events,['render']);
});
