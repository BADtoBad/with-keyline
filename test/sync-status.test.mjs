import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildSync} from 'esbuild';
import vm from 'node:vm';
const bundle=buildSync({entryPoints:['src/domain/sync-status.ts'],bundle:true,write:false,format:'cjs',target:'es2018'}).outputFiles[0].text;
const module={exports:{}};vm.runInNewContext(bundle,{module,exports:module.exports});
const {syncStatus}=module.exports;
for(const state of ['⏹','⏹️','💤','🌀','⚡','⚡️','📦'])test(`routine sync symbol retains source and counters: ${state}`,()=>{
  const text=`🌐 Sync: ${state} ↑ 12 (3) ↓ 45 (6) LIVE`,plan=syncStatus(text);
  assert.equal(plan.parts.map(p=>p.text).join(''),text);assert.equal(plan.attention,false);
  assert.equal(plan.parts.find(p=>p.text==='🌐').icon,'globe');
  assert.ok(plan.parts.every(p=>!p.warning));
});
for(const tail of ['⚠️ Error: disconnected','⛔ Error: unavailable','💤 SKIP: excluded','💤 EVIL','💤 LIVELIVE','💤 Live','💤 🧪 unknown','💤 ⚠️','⚡ ↑ 5 ⚠️','💤 ⛔️','⏹ 💤 🌀 ⚡ 📦 ⏳ 🛫 📬 ⚠ ⛔ ↑ ↓','paused','💤 Sync: 🌀'])test(`unknown/error sync information is not quieted: ${tail}`,()=>{
  const text='Sync: '+tail,plan=syncStatus(text);
  assert.equal(plan.attention,true);assert.equal(plan.parts.map(p=>p.text).join(''),text);
});
test('complete original symbol inventory and variation selectors map without deleting unknown content',()=>{
  const text='📲 Sync: ⏹️ 💤 🌀 ⚡️ 📦 ⏳ 🛫 📬 ⚠️ ⛔️ ↑ ↓ 未知🙂';
  const result=syncStatus(text);assert.equal(result.parts.filter(p=>p.icon).length,13);
  assert.equal(result.parts.map(p=>p.text).join(''),text);assert.equal(result.attention,true);
  assert.deepEqual(Array.from(result.parts.filter(p=>p.warning),p=>p.icon),['triangle-alert','circle-alert']);
});
test('ordinary items and oversized status text remain untouched',()=>{
  for(const value of ['', '24 words','Synced','SYNC: ⚡','⚡ 3 files','Sync: '+'x'.repeat(16000)])assert.equal(syncStatus(value),null);
});
test('no status content is interpolated as markup or replaced by a successful-state inference',()=>{
  const text='🌐 Sync: ⚡ <script>not html</script> \nFailed — 保留完整提示';
  const result=syncStatus(text);assert.equal(result.parts.map(p=>p.text).join(''),text);assert.equal(result.attention,true);
});
