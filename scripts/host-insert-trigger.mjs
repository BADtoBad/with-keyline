// Focused desktop regression in a disposable fictional Vault. Never attaches
// to an existing Obsidian process or reads a personal Vault.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {setTimeout as delay} from 'node:timers/promises';

const root=fileURLToPath(new URL('../',import.meta.url));
const themeDir=process.argv[2];
assert.ok(themeDir&&path.isAbsolute(themeDir),'Pass an absolute directory containing a downloaded Keyline theme');
const theme=JSON.parse(fs.readFileSync(path.join(themeDir,'manifest.json'),'utf8'));
assert.equal(theme.name,'Keyline');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'with-keyline-trigger-'));
const vault=path.join(temp,'Trigger Test'),profile=path.join(temp,'profile'),output=path.join(root,'evidence','insert-trigger');
const pluginPath=path.join(vault,'.obsidian/plugins/with-keyline');
fs.mkdirSync(pluginPath,{recursive:true});fs.mkdirSync(profile);fs.mkdirSync(output,{recursive:true});
for(const file of ['main.js','styles.css','manifest.json'])fs.copyFileSync(path.join(root,file),path.join(pluginPath,file));
const themePath=path.join(vault,'.obsidian/themes/Keyline');fs.mkdirSync(themePath,{recursive:true});
for(const file of ['manifest.json','theme.css'])fs.copyFileSync(path.join(themeDir,file),path.join(themePath,file));
fs.writeFileSync(path.join(vault,'Start.md'),'# Fictional trigger test\n');
fs.writeFileSync(path.join(vault,'.obsidian/community-plugins.json'),'[]');
fs.writeFileSync(path.join(vault,'.obsidian/appearance.json'),JSON.stringify({cssTheme:'Keyline',theme:'moonstone',nativeMenus:false}));
fs.writeFileSync(path.join(profile,'obsidian.json'),JSON.stringify({vaults:{a20261023ef012345:{path:vault,ts:Date.now(),open:true}},updateDisabled:true}));
const hash=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const report={startedAt:new Date().toISOString(),vault,version:JSON.parse(fs.readFileSync(path.join(root,'manifest.json'))).version,theme:theme.version,themeSha256:hash(path.join(themeDir,'theme.css')),mainSha256:hash(path.join(root,'main.js')),checks:[],exceptions:[]};
const child=spawn(process.env.OBSIDIAN_TEST_BINARY??'/Applications/Obsidian 2.app/Contents/MacOS/Obsidian',[
  `--user-data-dir=${profile}`,'--remote-debugging-address=127.0.0.1','--remote-debugging-port=0',
  '--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows'
],{stdio:['ignore','ignore','pipe']});
let stderr='',socket,port,serial=0;const pending=new Map();
child.stderr.on('data',b=>stderr=(stderr+b).slice(-10000));
async function until(fn,label){for(let i=0;i<100;i++){if(child.exitCode!==null)throw Error('Owned test host exited');if(await fn())return;await delay(150);}throw Error(label+' timed out');}
function call(method,params={}){return new Promise((resolve,reject)=>{const id=++serial,timer=setTimeout(()=>{pending.delete(id);reject(Error(method+' timeout'));},15000);pending.set(id,{resolve:r=>{clearTimeout(timer);resolve(r);},reject:e=>{clearTimeout(timer);reject(e);}});socket.send(JSON.stringify({id,method,params}));});}
async function evaluate(expression){const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
const scoped=expression=>evaluate(`(async()=>{if(typeof app==='undefined'||app.vault.adapter.basePath!==${JSON.stringify(vault)})throw Error('Wrong Vault');return await (${expression});})()`);
const editor="app.workspace.getLeavesOfType('markdown').find(l=>l.view.file?.path==='Start.md').view.editor";
const plugin="app.plugins.plugins['with-keyline']";
const state=()=>scoped(`({text:${editor}.getValue(),focus:${editor}.hasFocus(),menus:[...document.querySelectorAll('.keyline-next-insert-menu:not(.is-callout)')].map(e=>({text:e.innerText,ids:[...e.querySelectorAll('[data-insert-id]')].map(r=>r.dataset.insertId)}))})`);
const type=async text=>{await call('Input.insertText',{text});await delay(150);};
const key=async(key,code,number,extra={})=>{await call('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:number,...extra});await call('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:number,...extra});await delay(150);};
const reset=async text=>{await scoped(`(()=>{const e=${editor};e.setValue(${JSON.stringify(text)});e.setCursor(e.offsetToPos(e.getValue().length));e.focus();return true})()`);await delay(200);};
const check=label=>{report.checks.push(label);console.log('PASS',label);};
async function screenshot(name){const r=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(output,name+'.png'),Buffer.from(r.data,'base64'));}
async function click(id){const point=await scoped(`(()=>{const e=document.querySelector('.keyline-next-insert-menu [data-insert-id="${id}"]');if(!e)throw Error('Missing menu choice');e.scrollIntoView({block:'nearest'});const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);await call('Input.dispatchMouseEvent',{type:'mousePressed',...point,button:'left',buttons:1,clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',...point,button:'left',buttons:0,clickCount:1});await delay(200);}
try{
  await until(()=>port=stderr.match(/DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)/)?.[1],'Debugger');
  let page;await until(async()=>page=(await(await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(p=>p.type==='page'&&p.url==='app://obsidian.md/index.html'),'Test page');
  socket=new WebSocket(page.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
  socket.onmessage=e=>{const m=JSON.parse(e.data),p=pending.get(m.id);if(m.method==='Runtime.exceptionThrown')report.exceptions.push(m.params.exceptionDetails);if(p){pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}};
  await call('Runtime.enable');await until(()=>evaluate("typeof app!=='undefined'&&app.workspace?.layoutReady"),'Workspace');
  await call('Page.bringToFront');report.host=await scoped('navigator.userAgent');
  await scoped(`(()=>{[...document.querySelectorAll('.modal button')].find(b=>/信任仓库作者并启用插件|Trust author and enable plugins/i.test(b.textContent))?.click();return true})()`);
  await until(()=>scoped("!document.querySelector('.modal')"),'Test Vault trust');
  await call('Emulation.setDeviceMetricsOverride',{width:1200,height:850,deviceScaleFactor:1,mobile:false});
  await scoped(`(async()=>{await app.plugins.enablePlugin('with-keyline');await app.workspace.getLeaf(false).openFile(app.vault.getAbstractFileByPath('Start.md'));await app.workspace.getLeaf(false).setViewState({type:'markdown',state:{file:'Start.md',mode:'source',source:false}});await ${plugin}.update({language:'zh'});return true})()`);
  await until(()=>scoped("getComputedStyle(document.body).getPropertyValue('--ncl-shell-controls').trim()==='1'"),'Keyline theme');
  for(const [mode,theme]of [['light','moonstone'],['dark','obsidian']]){
    await scoped(`app.changeTheme('${theme}')`);
    let slashIds;
    for(const trigger of ['/','、']){
      await reset('A fictional paragraph.\n');await type(trigger);
      let s=await state();assert.equal(s.menus.length,1);assert.equal(s.text,'A fictional paragraph.\n'+trigger);assert.equal(s.focus,true);
      if(trigger==='/')slashIds=s.menus[0].ids;else assert.deepEqual(s.menus[0].ids,slashIds);
      await screenshot(`${mode}-${trigger==='/'?'slash':'comma'}-open`);check(`${mode}: ${trigger} same menu after a newline`);
      await type('待办');assert.deepEqual((await state()).menus[0].ids,['task']);await screenshot(`${mode}-${trigger==='/'?'slash':'comma'}-filtered`);
      await delay(550);await click('task');s=await state();assert.equal(s.text,'A fictional paragraph.\n- [ ] ');assert.equal(s.menus.length,0);check(`${mode}: ${trigger} Chinese filter and mouse insertion`);
      await key('z','KeyZ',90,{modifiers:4});s=await state();assert.equal(s.text,'A fictional paragraph.\n'+trigger+'待办');assert.equal(s.menus.length,0);check(`${mode}: ${trigger} native undo restores literal query`);
      await reset('');await type(trigger);await type('h2');await key('Enter','Enter',13);assert.equal((await state()).text,'## ');check(`${mode}: ${trigger} keyboard selection`);
      await reset('');await type(trigger);await key('Escape','Escape',27);await type('task');s=await state();assert.equal(s.text,trigger+'task');assert.equal(s.menus.length,0);check(`${mode}: ${trigger} Escape retains text without reopening`);
      await reset('');await type(trigger);await key('Backspace','Backspace',8);s=await state();assert.equal(s.text,'');assert.equal(s.menus.length,0);check(`${mode}: ${trigger} backspace closes`);
    }
    for(const prefix of ['甲','`','```\n','---\nkey: ']){await reset(prefix);await type('、');const s=await state();assert.equal(s.menus.length,0);assert.equal(s.text,prefix+'、');}check(`${mode}: ordinary punctuation and protected syntax remain literal`);
    await reset('');await type('、h2');assert.equal((await state()).menus.length,0);check(`${mode}: whole-query insertion does not open a menu`);
    await scoped(`${plugin}.update({slash:false})`);await reset('');await type('、');assert.equal((await state()).menus.length,0);
    await scoped(`${plugin}.update({slash:true,slashTrigger:';'})`);await reset('');await type('、');assert.equal((await state()).menus.length,0);await reset('');await type(';');assert.equal((await state()).menus.length,1);
    await scoped(`${plugin}.update({slashTrigger:'/',inlineSlash:false})`);await reset('Before ');await type('、');assert.equal((await state()).menus.length,0);await reset('- ');await type('、');assert.equal((await state()).menus.length,1);
    await scoped(`${plugin}.update({inlineSlash:true})`);check(`${mode}: disabled, custom-trigger and line-only preferences respected`);
  }
  assert.equal(report.exceptions.length,0);report.status='passed';check('No native runtime exceptions');
}catch(error){report.status='failed';report.error=String(error.stack??error);try{report.failureState=await state();await screenshot('failure');}catch{}throw error;}
finally{report.completedAt=new Date().toISOString();fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));socket?.close();if(child.exitCode===null)child.kill('SIGTERM');console.log('Evidence',output);}
