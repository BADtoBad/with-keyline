// Fresh fictional Vault only. Native macOS host with Obsidian mobile emulation;
// never represents Android/iOS or software-keyboard device certification.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {setTimeout as delay} from 'node:timers/promises';

const root=fileURLToPath(new URL('../',import.meta.url)),themeDir=process.argv[2];
assert.ok(themeDir&&path.isAbsolute(themeDir),'Pass an absolute Keyline theme directory');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'with-keyline-mobile-'));
const vault=path.join(temp,'Mobile Beta Test'),profile=path.join(temp,'profile'),output=path.join(root,'evidence','mobile-beta');
const installed=path.join(vault,'.obsidian/plugins/with-keyline');
fs.mkdirSync(installed,{recursive:true});fs.mkdirSync(profile);fs.mkdirSync(output,{recursive:true});
for(const file of ['main.js','styles.css','manifest.json'])fs.copyFileSync(path.join(root,file),path.join(installed,file));
const themePath=path.join(vault,'.obsidian/themes/Keyline');fs.mkdirSync(themePath,{recursive:true});
for(const file of ['manifest.json','theme.css'])fs.copyFileSync(path.join(themeDir,file),path.join(themePath,file));
const stored={schema:1,language:'en',toolbar:true,blockHandles:true,workspaces:true,typography:{inset:80}};
fs.writeFileSync(path.join(installed,'data.json'),JSON.stringify(stored));
for(const name of ['Start','Project plan','任务'])fs.writeFileSync(path.join(vault,name+'.md'),'# Fictional test\n');
fs.writeFileSync(path.join(vault,'.obsidian/community-plugins.json'),'[]');
fs.writeFileSync(path.join(vault,'.obsidian/appearance.json'),JSON.stringify({cssTheme:'Keyline',theme:'moonstone'}));
fs.writeFileSync(path.join(vault,'.obsidian/app.json'),JSON.stringify({nativeMenus:false}));
fs.writeFileSync(path.join(profile,'obsidian.json'),JSON.stringify({vaults:{a20261024ef012345:{path:vault,ts:Date.now(),open:true}},updateDisabled:true}));
const hash=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const report={startedAt:new Date().toISOString(),vault,version:JSON.parse(fs.readFileSync(path.join(root,'manifest.json'))).version,
  limitation:'Native macOS host using app.emulateMobile, CDP touch/IME and reduced viewport. Not a physical Android/iOS or software keyboard test.',
  mainSha256:hash(path.join(root,'main.js')),themeSha256:hash(path.join(themeDir,'theme.css')),checks:[],exceptions:[]};
const child=spawn(process.env.OBSIDIAN_TEST_BINARY??'/Applications/Obsidian 2.app/Contents/MacOS/Obsidian',[
  `--user-data-dir=${profile}`,'--remote-debugging-address=127.0.0.1','--remote-debugging-port=0',
  '--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows'
],{stdio:['ignore','ignore','pipe']});
let stderr='',socket,serial=0;const pending=new Map();child.stderr.on('data',b=>stderr=(stderr+b).slice(-10000));
async function until(fn,label){for(let i=0;i<100;i++){if(child.exitCode!==null)throw Error('Owned host exited');if(await fn())return;await delay(150);}throw Error(label+' timed out');}
function call(method,params={}){return new Promise((resolve,reject)=>{const id=++serial,timer=setTimeout(()=>{pending.delete(id);reject(Error(method+' timeout'));},15000);pending.set(id,{resolve:r=>{clearTimeout(timer);resolve(r);},reject:e=>{clearTimeout(timer);reject(e);}});socket.send(JSON.stringify({id,method,params}));});}
async function evaluate(expression){const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
const scoped=expression=>evaluate(`(async()=>{if(typeof app==='undefined'||app.vault.adapter.basePath!==${JSON.stringify(vault)})throw Error('Wrong Vault');return await (${expression});})()`);
const editor="app.workspace.getLeavesOfType('markdown').find(l=>l.view.file?.path==='Start.md').view.editor",plugin="app.plugins.plugins['with-keyline']";
const text=()=>scoped(`${editor}.getValue()`);
const type=async text=>{await call('Input.insertText',{text});await delay(180);};
const reset=async text=>{await scoped(`(()=>{const e=${editor};e.setValue(${JSON.stringify(text)});e.setCursor(e.offsetToPos(e.getValue().length));e.focus();return true})()`);await delay(200);};
const check=label=>{report.checks.push(label);console.log('PASS',label);};
const shot=async name=>{const r=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(output,name+'.png'),Buffer.from(r.data,'base64'));};
async function point(selector){return scoped(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)throw Error('Missing '+${JSON.stringify(selector)});e.scrollIntoView({block:'nearest'});const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);}
async function tap(selector){await until(()=>scoped(`!!document.querySelector(${JSON.stringify(selector)})`),'Choice '+selector);const at=await point(selector);await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...at,radiusX:2,radiusY:2}]});await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await delay(220);}
async function undo(){await scoped(`(()=>{${editor}.focus();return app.commands.executeCommandById('editor:undo')})()`);await delay(150);}
async function metrics(selector,width,height){const r=await scoped(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)return null;const r=e.getBoundingClientRect();return{rect:r.toJSON(),rows:[...e.querySelectorAll('[role=option]')].map(r=>r.getBoundingClientRect().height),focus:${editor}.hasFocus()}})()`);assert.ok(r,'Menu missing');assert.ok(r.rect.left>=0&&r.rect.right<=width+1&&r.rect.top>=0&&r.rect.bottom<=height+1,JSON.stringify(r));assert.ok(r.rows.length&&r.rows.every(h=>h>=44));assert.equal(r.focus,true);return r;}
try{
  let port,page;await until(()=>port=stderr.match(/DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)/)?.[1],'Debugger');
  await until(async()=>page=(await(await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(p=>p.type==='page'&&p.url==='app://obsidian.md/index.html'),'Page');
  socket=new WebSocket(page.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
  socket.onmessage=e=>{const m=JSON.parse(e.data),p=pending.get(m.id);if(m.method==='Runtime.exceptionThrown')report.exceptions.push(m.params.exceptionDetails);if(p){pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}};
  await call('Runtime.enable');await until(()=>evaluate("typeof app!=='undefined'&&app.workspace?.layoutReady"),'Workspace');
  await call('Page.bringToFront');report.host=await scoped('navigator.userAgent');
  await scoped(`(()=>{[...document.querySelectorAll('.modal button')].find(b=>/信任仓库作者并启用插件|Trust author and enable plugins/i.test(b.textContent))?.click();return true})()`);
  await until(()=>scoped("!document.querySelector('.modal')"),'Test Vault trust');
  await scoped(`(async()=>{await app.emulateMobile(true);return true})()`);await delay(1000);
  await until(()=>scoped('app.workspace.rootSplit?.children?.length>0'),'Mobile workspace');
  await call('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
  await scoped(`(async()=>{await app.plugins.enablePlugin('with-keyline');await app.workspace.getLeaf(false).openFile(app.vault.getAbstractFileByPath('Start.md'));await app.workspace.getLeaf(false).setViewState({type:'markdown',state:{file:'Start.md',mode:'source',source:false}});return true})()`);
  assert.equal(await scoped(`${plugin}.mobile`),true,'Must execute mobile runtime, not only CSS');
  await scoped(`(()=>{window.__mobileTrace=[];for(const name of ['mentions','insertMenus'])for(const menu of ${plugin}[name].views.values()){const close=menu.close.bind(menu);menu.close=()=>{window.__mobileTrace.push({kind:name,stack:new Error().stack,focus:document.hasFocus(),active:document.activeElement?.className,text:${editor}.getValue()});window.__mobileTrace=window.__mobileTrace.slice(-15);return close();};}return true})()`);
  assert.equal(await scoped(`!!${plugin}.store`),true);
  assert.equal(await scoped(`!!document.querySelector('.notice')?.textContent.includes('Mobile Beta')`),true);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(installed,'data.json'))),stored);check('Mobile runtime loads with Beta notice; no settings write on startup');
  assert.deepEqual(await scoped(`['handles','toolbar','workspaces','writing','rowSelection','shell','syncStatus','explorer'].filter(k=>!!${plugin}[k])`),[]);
  assert.equal(await scoped(`${plugin}.effectivePreferences.typography.inset`),-1);check('Desktop-only controllers absent; synced preferences unchanged');
  await scoped(`(()=>{${plugin}.betaNotice?.hide();app.workspace.leftSplit.collapse();app.workspace.rightSplit.collapse();return true})()`);
  for(const [mode,theme] of [['light','moonstone'],['dark','obsidian']])for(const [width,height] of [[390,780],[768,1000],[390,420]]){
    await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
    await scoped(`app.changeTheme('${theme}')`);await delay(180);
    const name=`${mode}-${width}-${height}`;
    await reset('Meet ');await type('@');await metrics('.keyline-next-mention-menu',width,height);await shot(name+'-mention');
    await tap('.keyline-next-mention-row.is-date');assert.match(await text(),/^Meet \d{4}-\d{2}-\d{2}$/u);await undo();assert.equal(await text(),'Meet @');check(name+': date touch insertion and native undo');
    await reset('See ');await type('@');await type('Project');await tap('.keyline-next-mention-row.is-page');assert.equal(await text(),'See [[Project plan]]');await undo();assert.equal(await text(),'See @Project');check(name+': page touch insertion and undo');
    for(const trigger of ['/','、']){
      await reset('');await type(trigger);await metrics('.keyline-next-insert-menu',width,height);await type('task');await tap('[data-insert-id="task"]');assert.equal(await text(),'- [ ] ');await undo();assert.equal(await text(),trigger+'task');
    }check(name+': slash and ideographic-comma touch insertion/undo');
    await reset('');await type('/');await type('callout');await tap('[data-insert-id="callout"]');await metrics('.keyline-next-insert-menu.is-callout',width,height);await shot(name+'-callout');await tap('.is-callout [role=button]');assert.equal(await scoped(`!!document.querySelector('.keyline-next-insert-menu.is-callout')`),false);
    await tap('[data-insert-id="callout"]');await tap('[data-insert-id="callout-note"]');assert.match(await text(),/> \[!note\]/u);check(name+': touch callout submenu/back/insert fits viewport');
  }
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:780,deviceScaleFactor:1,mobile:false});
  await reset('');await type('@');
  const scroll=await scoped(`(()=>{const r=document.querySelector('.keyline-next-mention-list').getBoundingClientRect();return{x:r.left+40,y:r.bottom-40,end:r.top+40}})()`);
  await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:scroll.x,y:scroll.y}]});
  for(let i=1;i<=6;i++){await call('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:scroll.x,y:scroll.y+(scroll.end-scroll.y)*i/6}]});await delay(30);}
  await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await delay(150);assert.equal(await text(),'@');check('Scrolling the touch menu never inserts a row');
  await reset('');await type('@');await call('Emulation.setDeviceMetricsOverride',{width:390,height:420,deviceScaleFactor:1,mobile:false});await delay(220);await metrics('.keyline-next-mention-menu',390,420);assert.equal(await text(),'@');check('Open menu repositions after available-height reduction without an edit');
  for(const trigger of ['@','/','、']){
    await reset('');await call('Input.imeSetComposition',{text:trigger,selectionStart:1,selectionEnd:1});await delay(100);
    await call('Input.insertText',{text:trigger});await delay(350);
    assert.equal(await text(),trigger);
    assert.equal(await scoped(`!!document.querySelector('${trigger==='@'?'.keyline-next-mention-menu':'.keyline-next-insert-menu'}')`),true);
    check('IME trigger commits without text loss: '+trigger);
  }
  await reset('Keep text');await scoped(`(()=>{const e=${editor};e.setSelection({line:0,ch:0},{line:0,ch:4});return app.commands.executeCommandById('with-keyline:format-bold')})()`);assert.equal(await text(),'**Keep** text');await undo();assert.equal(await text(),'Keep text');check('Basic formatting command preserves correct range and native undo');
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:780,deviceScaleFactor:1,mobile:false});
  await scoped(`(()=>{app.setting.open();app.setting.openTabById('with-keyline');return true})()`);await delay(250);assert.equal(await scoped(`document.querySelector('.keyline-next-mobile-beta strong')?.textContent`),'Mobile Beta');await shot('settings-beta');
  const settings=await scoped(`(()=>{const root=document.querySelector('.keyline-next-settings'),control=root.querySelector('.keyline-next-settings-panel select');control.scrollIntoView({block:'center'});const r=control.getBoundingClientRect();return{control:r.toJSON(),overflow:root.scrollWidth>root.clientWidth,info:control.closest('.setting-item').querySelector('.setting-item-info').getBoundingClientRect().height}})()`);
  assert.ok(settings.control.top>=0&&settings.control.bottom<=780&&settings.control.height>=44&&!settings.overflow&&settings.info<120,JSON.stringify(settings));await shot('settings-controls');await scoped('app.setting.close()');check('Persistent Beta banner and reachable mobile settings controls');
  await reset('Persist this test note.');await delay(1800);assert.equal(fs.readFileSync(path.join(vault,'Start.md'),'utf8'),'Persist this test note.');check('Native file save reaches test Vault disk');
  await scoped(`(async()=>{await app.plugins.disablePlugin('with-keyline');await app.plugins.enablePlugin('with-keyline');return true})()`);assert.equal(await text(),'Persist this test note.');assert.deepEqual(JSON.parse(fs.readFileSync(path.join(installed,'data.json'))),stored);check('Disable/re-enable retains note and desktop preferences');
  assert.equal(report.exceptions.length,0);report.status='passed';check('No renderer runtime exceptions');
}catch(error){report.status='failed';report.error=String(error.stack??error);try{report.text=await text();report.dom=await scoped('document.body.innerText.slice(-5000)');report.trace=await scoped('window.__mobileTrace');report.focus=await scoped('document.hasFocus()');await shot('failure');}catch{}throw error;}
finally{report.completedAt=new Date().toISOString();fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));socket?.close();if(child.exitCode===null)child.kill('SIGTERM');console.log('Evidence',output);}
