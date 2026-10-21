import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {SettingsTransfer,transferDigest}=require('../.test-build/platform/settings-transfer.cjs');
const {decodePreferences}=require('../.test-build/domain/preferences.cjs');
const manifest='{"id":"notion-craft-interaction-lab","version":"0.7.4"}',source=' { "enabled": false, "handleSide": "right" }\n';
function setup(raw=' {"schema":1,"language":"zh","unrelated":"keep exact bytes"}\n'){
  const f={disk:raw,current:decodePreferences(raw===null?null:JSON.parse(raw)),ready:true,locked:false,backups:new Map(),writes:[],commits:0,serial:0};
  f.io={read:async()=>f.disk,write:async v=>{f.writes.push(v);f.disk=v},createBackup:async(n,v)=>{assert.ok(!f.backups.has(n));f.backups.set(n,v)},
    readBackup:async n=>{if(!f.backups.has(n))throw Error('missing');return f.backups.get(n)},listBackups:async()=>[...f.backups.keys()]};
  f.make=()=>new SettingsTransfer(f.io,()=>f.current,()=>f.ready,p=>{f.current=p;f.commits++},()=>f.locked=true,()=>`settings-test-${++f.serial}.json`);
  f.engine=f.make();f.preview=()=>f.engine.previewImport(manifest,source);return f;
}
test('opening and preview are read-only; import backup preserves raw source and before bytes',async()=>{
  const f=setup(),before=f.disk,p=await f.preview();assert.equal(f.writes.length,0);assert.equal(f.backups.size,0);
  const name=await f.engine.apply(p),record=JSON.parse(f.backups.get(name)),data=JSON.parse(record.payload);
  assert.equal(record.sha256,await transferDigest(record.payload));assert.equal(data.before,before);assert.equal(data.manifest,manifest);assert.equal(data.source,source);
  assert.equal(f.disk,data.after);assert.equal(f.current.editingEnabled,false);assert.equal(f.commits,1);assert.equal(f.locked,false);
  await assert.rejects(f.engine.apply(p));assert.equal(f.writes.length,1);
});
test('restore survives restart, backs up later settings, and restores original bytes exactly',async()=>{
  const f=setup(),before=f.disk,name=await f.engine.apply(await f.preview());
  f.disk=JSON.stringify({...f.current,handleSide:'left'});f.current=decodePreferences(JSON.parse(f.disk));const later=f.disk;
  f.engine.close();f.engine=f.make();const preview=await f.engine.previewRestore(name);assert.equal(f.disk,later);
  const restoreName=await f.engine.apply(preview);assert.equal(f.disk,before);assert.equal(JSON.parse(JSON.parse(f.backups.get(restoreName)).payload).before,later);
  assert.equal(f.backups.size,2);assert.equal(f.current.editingEnabled,true);
});
test('restore of an absent original settings file removes only the new settings value',async()=>{
  const f=setup(null),name=await f.engine.apply(await f.preview());await f.engine.apply(await f.engine.previewRestore(name));
  assert.equal(f.disk,null);assert.equal(f.backups.size,2);assert.equal(f.current.editingEnabled,true);
});
for(const failure of ['throw','swallow','corrupt-read'])test(`backup ${failure} never writes settings`,async()=>{
  const f=setup(),p=await f.preview(),before=f.disk;
  if(failure==='throw')f.io.createBackup=async()=>{throw Error('full')};
  if(failure==='swallow')f.io.createBackup=async()=>{};
  if(failure==='corrupt-read')f.io.readBackup=async()=>'{"broken":true}';
  await assert.rejects(f.engine.apply(p));assert.equal(f.disk,before);assert.equal(f.writes.length,0);assert.equal(f.commits,0);
});
for(const failure of ['throw','swallow','write-then-throw','read-once'])test(`settings failure ${failure} retains or restores original`,async()=>{
  const f=setup(),p=await f.preview(),before=f.disk;let attempts=0,readFailure=false;
  f.io.write=async v=>{f.writes.push(v);attempts++;if(attempts>1){f.disk=v;return}if(failure==='throw')throw Error('disk');if(failure==='swallow')return;f.disk=v;if(failure==='write-then-throw')throw Error('late');readFailure=true;};
  f.io.read=async()=>{if(readFailure){readFailure=false;throw Error('read')}return f.disk};
  await assert.rejects(f.engine.apply(p));assert.equal(f.disk,before);assert.equal(f.commits,0);assert.equal(f.locked,false);assert.equal(f.backups.size,1);
});
test('an unexpected write-back value locks further settings instead of erasing it',async()=>{
  const f=setup(),p=await f.preview();f.io.write=async()=>{f.disk='foreign/partial'};
  await assert.rejects(f.engine.apply(p),e=>e.uncertain===true&&!!e.backup);assert.equal(f.disk,'foreign/partial');assert.equal(f.locked,true);assert.equal(f.commits,0);
});
test('stale previews, foreign previews, dirty state and external writes are refused',async()=>{
  const f=setup(),p=await f.preview();f.disk+=' ';await assert.rejects(f.engine.apply(p));assert.equal(f.writes.length,0);
  await assert.rejects(f.engine.apply({kind:'import'}));f.ready=false;await assert.rejects(f.preview());
  f.ready=true;f.disk='{"schema":999}';await assert.rejects(f.preview());assert.equal(f.backups.size,0);
});
test('external write between backup and apply is not overwritten',async()=>{
  const f=setup(),p=await f.preview(),create=f.io.createBackup;f.io.createBackup=async(n,v)=>{await create(n,v);f.disk='external';};
  await assert.rejects(f.engine.apply(p));assert.equal(f.disk,'external');assert.equal(f.writes.length,0);
});
test('tampered, future, missing and traversal backups cannot be restored',async()=>{
  const f=setup(),name=await f.engine.apply(await f.preview()),saved=f.backups.get(name);
  f.backups.set(name,saved.replace('right','wrong'));await assert.rejects(f.engine.previewRestore(name));
  await assert.rejects(f.engine.previewRestore('../data.json'));await assert.rejects(f.engine.previewRestore('settings-missing.json'));
  const payload=JSON.stringify({schema:999,kind:'import',before:null,after:null});f.backups.set(name,JSON.stringify({payload,sha256:await transferDigest(payload)}));
  await assert.rejects(f.engine.previewRestore(name));assert.equal(f.writes.length,1);
});
test('busy transfer rejects concurrency; closing during backup prevents a settings write',async()=>{
  const f=setup(),p=await f.preview();let release;const gate=new Promise(r=>release=r),create=f.io.createBackup;
  f.io.createBackup=async(n,v)=>{await gate;await create(n,v)};const apply=f.engine.apply(p);
  await new Promise(r=>setTimeout(r,10));assert.equal(f.engine.busy,true);await assert.rejects(f.preview());f.engine.close();release();
  await assert.rejects(apply);assert.equal(f.writes.length,0);assert.equal(f.backups.size,1);assert.equal(f.engine.busy,false);
});
