import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const module={exports:{}};
vm.runInNewContext(readFileSync(new URL('../.test-build/platform/transfer-modal.cjs',import.meta.url),'utf8'),{
  module,exports:module.exports,console,require:name=>{assert.equal(name,'obsidian');return {Modal:class {}};}
});
const {SettingsTransferModal}=module.exports;
function setup(){
  const owner={app:{},zh:false,readOnly:false,transfer:{busy:false}},modal=new SettingsTransferModal(owner,()=>{});
  const button={disabled:true},states=[];
  // Native ButtonComponent maintains its own disabled state in addition to DOM.
  const control={disabled:true,setDisabled(value){this.disabled=value;button.disabled=value;states.push(value);}};
  const node=()=>({empty(){},createEl(){return node();}});
  Object.assign(modal,{closed:false,applyButton:button,applyControl:control,details:node(),status:{textContent:''},contentEl:{querySelectorAll:()=>[button]}});
  return {modal,owner,button,control,states};
}
test('preview and invalidation update the native component state, not just the DOM attribute',()=>{
  const f=setup(),preview={kind:'import',changes:['toolbar'],notices:[],result:'{}'};
  f.modal.show(preview);assert.equal(f.control.disabled,false);assert.equal(f.button.disabled,false);
  f.modal.invalidate();assert.equal(f.control.disabled,true);assert.equal(f.button.disabled,true);
  assert.deepEqual(f.states,[false,true]);
});
test('preview completion and failure synchronize native disabled state',async()=>{
  const f=setup();
  await f.modal.work(async()=>f.modal.show({kind:'import',changes:[],notices:[],result:'{}'}));
  assert.equal(f.control.disabled,false);
  await f.modal.work(async()=>{throw Error('Fixture failure');});
  assert.equal(f.control.disabled,true);assert.equal(f.button.disabled,true);assert.match(f.modal.status.textContent,/Fixture failure/u);
});
