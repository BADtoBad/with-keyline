import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
function setup(){
  const state={valid:true,created:[],commits:[],notices:[],files:[],inputs:[],lookups:[]};
  const module={exports:{}};
  vm.runInNewContext(readFileSync(new URL('../.test-build/platform/attachment-imports.cjs',import.meta.url),'utf8'),{module,exports:module.exports,console,require:()=>({Notice:class{constructor(text){state.notices.push(text);}}})});
  const doc={body:{append(n){state.inputs.push(n);}},createElement(){return{events:{},addEventListener(n,fn){this.events[n]=fn;},remove(){state.inputs=state.inputs.filter(n=>n!==this);},click(){state.clicked=(state.clicked??0)+1;}};}};
  const file={path:'Research/Start.md'},editor={},leaf={view:{editor,containerEl:{ownerDocument:doc}}};
  const context={file,editor,valid:()=>state.valid};
  const app={workspace:{getLeavesOfType:()=>[leaf],activeLeaf:leaf},fileManager:{
    async getAvailablePathForAttachment(name,source){state.lookups.push({name,source});await state.pathHook?.();let p='Assets/'+name,n=1;while(state.files.some(f=>f.path===p))p='Assets/'+n+++'-'+name;return p;},
    generateMarkdownLink(f,source){assert.equal(source,'Research/Start.md');if(state.linkError)throw state.linkError;return `[[${f.path}]]`;}
  },vault:{async createBinary(path,bytes){if(state.failAt===state.created.length)throw Error('disk failure');state.created.push({path,bytes});await state.writeHook?.();const f={path,basename:path.split('/').at(-1).replace(/\.[^.]+$/u,'')};state.files.push(f);return f;},getAbstractFileByPath:p=>state.files.find(f=>f.path===p)}};
  const owner={app,live:true,zh:()=>false,preferences:()=>({embedAttachments:!!state.embed}),commitAttachment(c,text){assert.equal(c,context);if(state.commitFails)return false;state.commits.push({text});return true;}};
  const controller=new module.exports.AttachmentImports(owner);
  const chosen=(name,hook)=>({name,arrayBuffer:async()=>{await hook?.();return Uint8Array.from([1,2,3]).buffer;}});
  return{state,app,owner,context,controller,chosen};
}
test('explicit multi-file import follows host destination, preserves bytes and makes one body transaction',async()=>{
  const s=setup();await s.controller.import(s.context,[s.chosen('A.pdf'),s.chosen('B.pdf')],'attachment');
  assert.equal(s.state.created.length,2);assert.deepEqual([...new Uint8Array(s.state.created[0].bytes)],[1,2,3]);
  assert.equal(s.state.commits.length,1);assert.equal(s.state.commits[0].text,'[A](Assets/A.pdf)\n[B](Assets/B.pdf)');
  assert.ok(s.state.lookups.every(l=>l.source==='Research/Start.md'));
});
test('image choice filters non-images, embeds and uses host collision resolution',async()=>{
  const s=setup();s.state.files.push({path:'Assets/A.svg'});await s.controller.import(s.context,[s.chosen('A.svg'),s.chosen('B.pdf')],'image');
  assert.equal(s.state.created.length,1);assert.equal(s.state.commits[0].text,'![[Assets/1-A.svg]]');
});
test('attachment embed is captured when import starts',async()=>{
  const s=setup();s.state.embed=true;await s.controller.import(s.context,[s.chosen('A.pdf',()=>{s.state.embed=false;})],'attachment');
  assert.equal(s.state.commits[0].text,'![A](Assets/A.pdf)');
});
test('empty and rejected image choices never write',async()=>{
  const s=setup();await s.controller.import(s.context,[],'image');assert.equal(s.state.notices.length,0);
  await s.controller.import(s.context,[s.chosen('bad.exe')],'image');assert.equal(s.state.created.length,0);assert.equal(s.state.commits.length,0);assert.ok(s.state.notices.length);
});
for(const stage of ['initial','read','path','write','renamed','unload'])test(`async ${stage} invalidation cannot link to later content`,async()=>{
  const s=setup();let hook;
  if(stage==='initial')s.state.valid=false;
  if(stage==='read')hook=()=>{s.state.valid=false;};
  if(stage==='path')s.state.pathHook=()=>{s.state.valid=false;};
  if(stage==='write')s.state.writeHook=()=>{s.state.valid=false;};
  if(stage==='renamed')s.state.writeHook=()=>{s.context.file.path='Moved.md';};
  if(stage==='unload')s.state.writeHook=()=>{s.owner.live=false;s.controller.dispose();};
  await s.controller.import(s.context,[s.chosen('A.pdf',hook)],'attachment');
  assert.equal(s.state.commits.length,0);assert.equal(s.state.created.length,['write','renamed','unload'].includes(stage)?1:0);
  if(['write','renamed'].includes(stage))assert.match(s.state.notices.at(-1),/Files already saved were kept:\nAssets\/A.pdf/u);
});
for(const failure of ['read','firstWrite','secondWrite','link','commit'])test(`failure ${failure} keeps saved resources and never commits a partial body`,async()=>{
  const s=setup();let hook;
  if(failure==='read')hook=()=>{throw Error('unreadable');};
  if(failure==='firstWrite')s.state.failAt=0;
  if(failure==='secondWrite')s.state.failAt=1;
  if(failure==='link')s.state.linkError=Error('link');
  if(failure==='commit')s.state.commitFails=true;
  await s.controller.import(s.context,[s.chosen('A.pdf',hook),s.chosen('B.pdf')],'attachment');
  assert.equal(s.state.commits.length,0);assert.ok(s.state.notices.length);
  if(['secondWrite','link','commit'].includes(failure))assert.ok(s.state.files.some(f=>f.path==='Assets/A.pdf'));
});
test('picker is in the originating document, uses native multiple/image filters and cancellation is inert',()=>{
  const s=setup();s.controller.open(s.context,'image');const input=s.state.inputs[0];
  assert.equal(input.type,'file');assert.equal(input.multiple,true);assert.ok(input.accept.includes('.svg'));assert.equal(input.hidden,true);assert.equal(s.state.clicked,1);
  input.events.cancel();assert.equal(s.state.inputs.length,0);assert.equal(s.state.created.length,0);assert.equal(s.state.commits.length,0);
});
test('replacement, stale selection and unload make old file-input callbacks inert',async()=>{
  const s=setup();s.controller.open(s.context,'image');const old=s.state.inputs[0];
  s.controller.open(s.context,'attachment');const fresh=s.state.inputs[0];
  assert.equal(s.state.inputs.length,1);old.files=[s.chosen('A.svg')];old.events.change();
  s.controller.dispose();fresh.files=[s.chosen('B.pdf')];fresh.events.change();await Promise.resolve();
  assert.equal(s.state.inputs.length,0);assert.equal(s.state.created.length,0);assert.equal(s.state.commits.length,0);
});
test('native picker cannot open from a background leaf',()=>{
  const s=setup();s.app.workspace.activeLeaf={};s.controller.open(s.context,'attachment');assert.equal(s.state.inputs.length,0);
});
test('a changed active leaf while the file picker is open rejects its eventual selection',async()=>{
  const s=setup();s.controller.open(s.context,'attachment');const input=s.state.inputs[0];
  s.app.workspace.activeLeaf={};input.files=[s.chosen('A.pdf')];input.events.change();await Promise.resolve();
  assert.equal(s.state.inputs.length,0);assert.equal(s.state.created.length,0);assert.equal(s.state.commits.length,0);
});
test('replacing a picker during its awaited write keeps the partial resource without linking',async()=>{
  const s=setup();let release;s.state.writeHook=()=>new Promise(r=>{release=r;});
  s.controller.open(s.context,'attachment');const input=s.state.inputs[0];input.files=[s.chosen('A.pdf')];input.events.change();
  for(let i=0;i<10&&!release;i++)await Promise.resolve();assert.ok(release);
  s.controller.open(s.context,'image');release();for(let i=0;i<10;i++)await Promise.resolve();
  assert.equal(s.state.commits.length,0);assert.equal(s.state.files.length,1);assert.equal(s.state.inputs.length,1);assert.ok(s.state.inputs[0].accept.includes('.svg'));
  s.controller.dispose();
});
