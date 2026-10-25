// Native host checks. New fictional Vault/profile; never touches a personal Vault.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import {fileURLToPath} from 'node:url';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const theme=process.argv[2];
assert.ok(theme&&path.isAbsolute(theme),'Pass an absolute Keyline theme directory');
const out=path.join(repo,'evidence','properties');fs.mkdirSync(out,{recursive:true});
const base=fs.mkdtempSync(path.join(os.tmpdir(),'keyline-properties-check-'));
const vault=path.join(base,'Keyline Properties Test'),profile=path.join(base,'profile');
const installed=path.join(vault,'.obsidian/plugins/with-keyline');
fs.mkdirSync(installed,{recursive:true});fs.mkdirSync(profile);
for(const f of ['main.js','styles.css','manifest.json'])fs.copyFileSync(path.join(repo,f),path.join(installed,f));
fs.writeFileSync(path.join(installed,'data.json'),JSON.stringify({schema:1,language:'zh'}));
const td=path.join(vault,'.obsidian/themes/Keyline');fs.mkdirSync(td,{recursive:true});
for(const f of ['manifest.json','theme.css'])fs.copyFileSync(path.join(theme,f),path.join(td,f));
const notes={
 '未命名.md':'',
 '工作笔记.md':'# 本周记录\n\n整理访谈结果，准备下一次讨论。\n',
 '项目记录.md':'---\n项目: Atlas\n日期: \ntags: []\n---\n\n整理访谈结果，准备下一次讨论。\n',
 '参考.md':'---\ntags:\n  - writing\n  - research\n---\n\nFictional reference.\n',
 '会议.md':'---\n会议时间: 2026-10-25T09:30:42\n---\n\n讨论下一期内容。\n',
 '格式错误.md':'---\nitems: [broken\n---\n\nKeep source unchanged.\n'
};
for(const [f,s] of Object.entries(notes))fs.writeFileSync(path.join(vault,f),s);
fs.writeFileSync(path.join(vault,'.obsidian/types.json'),JSON.stringify({types:{日期:'date',会议时间:'datetime'}}));
fs.writeFileSync(path.join(vault,'.obsidian/community-plugins.json'),'[]');
fs.writeFileSync(path.join(vault,'.obsidian/appearance.json'),JSON.stringify({cssTheme:'Keyline',theme:'moonstone'}));
fs.writeFileSync(path.join(vault,'.obsidian/app.json'),JSON.stringify({propertiesInDocument:'visible',nativeMenus:false}));
fs.writeFileSync(path.join(profile,'obsidian.json'),JSON.stringify({vaults:{b202610250004:{path:vault,ts:Date.now(),open:true}},updateDisabled:true}));
const child=spawn(process.env.OBSIDIAN_TEST_BINARY??'/Applications/Obsidian 2.app/Contents/MacOS/Obsidian',[`--user-data-dir=${profile}`,'--remote-debugging-address=127.0.0.1','--remote-debugging-port=0','--disable-background-timer-throttling','--disable-renderer-backgrounding'],{stdio:['ignore','ignore','pipe']});
let stderr='',ws,serial=0;const pending=new Map(),report={vault,checks:[],exceptions:[],limitation:'Native macOS desktop plus mobile emulation; not a physical phone/tablet.'};
child.stderr.on('data',b=>stderr=(stderr+b).slice(-10000));
const until=async(fn,label)=>{for(let i=0;i<100;i++){if(child.exitCode!==null)throw Error('Owned host exited');if(await fn())return;await delay(150);}throw Error(label);};
const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++serial,timer=setTimeout(()=>{pending.delete(id);reject(Error(method+' timeout'));},12000);pending.set(id,{resolve:r=>{clearTimeout(timer);resolve(r)},reject:e=>{clearTimeout(timer);reject(e)}});ws.send(JSON.stringify({id,method,params}));});
const evaluate=async expression=>{const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
const run=expr=>evaluate(`(async()=>{if(app.vault.adapter.basePath!==${JSON.stringify(vault)})throw Error('Wrong vault');return await (${expr});})()`);
const view="app.workspace.getLeavesOfType('markdown').find(l=>l===app.workspace.activeLeaf).view";
const text=()=>run(`${view}.getViewData()`);
const open=async(file,mode='source',source=false)=>{
 await run(`app.workspace.getLeaf(false).setViewState({type:'markdown',state:{file:${JSON.stringify(file)},mode:${JSON.stringify(mode)},source:${source}},active:true})`);
 await delay(250);
};
const point=selector=>run(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)throw Error('Missing '+${JSON.stringify(selector)});const r=e.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2,width:r.width,height:r.height}})()`);
const click=async selector=>{const p=await point(selector);assert.ok(p.width&&p.height,'Visible target '+selector);await call('Input.dispatchMouseEvent',{type:'mousePressed',x:p.x,y:p.y,button:'left',clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',x:p.x,y:p.y,button:'left',clickCount:1});await delay(160);};
const key=async(k,code,modifiers=0)=>{await call('Input.dispatchKeyEvent',{type:'keyDown',key:k,code:k,windowsVirtualKeyCode:code,modifiers});await call('Input.dispatchKeyEvent',{type:'keyUp',key:k,code:k,windowsVirtualKeyCode:code,modifiers});await delay(120);};
const type=async s=>{await call('Input.insertText',{text:s});await delay(120);};
const shot=async name=>{
 const r=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,name+'.png'),Buffer.from(r.data,'base64'));
 const clip=await run(`(()=>{const v=${view},a=v.inlineTitleEl.getBoundingClientRect(),b=v.metadataEditor.containerEl.getBoundingClientRect(),c=document.querySelector('.keyline-next-property-calendar')?.getBoundingClientRect();const x=Math.max(0,Math.min(a.left,b.left)-24),y=Math.max(0,a.top-16);return{x,y,width:Math.min(innerWidth-x,Math.max(a.width,b.width)+48),height:Math.min(innerHeight-y,Math.max(b.bottom,c?.bottom??0)-y+24),scale:1}})()`);
 if(clip.width>0&&clip.height>0){const detail=await call('Page.captureScreenshot',{format:'png',clip});fs.writeFileSync(path.join(out,name+'-detail.png'),Buffer.from(detail.data,'base64'));}
};
const check=name=>{report.checks.push(name);console.log('PASS',name);};
const meta=()=>run(`(()=>{const v=${view},m=v.metadataEditor;return {properties:m.properties,rows:m.rendered.length,empty:m.containerEl.classList.contains('keyline-next-empty-properties'),rect:m.containerEl.getBoundingClientRect().toJSON(),active:document.activeElement.className,suggestions:!!document.querySelector('.suggestion-container:not([style*="display: none"])'),html:m.containerEl.outerHTML}})()`);
try{
 await until(()=>/DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)/.test(stderr),'debug');
 const port=stderr.match(/DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)/)[1];let target;
 await until(async()=>{target=(await(await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(p=>p.type==='page'&&p.url==='app://obsidian.md/index.html');return target;},'target');
 ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});ws.onmessage=e=>{const m=JSON.parse(e.data),p=pending.get(m.id);if(m.method==='Runtime.exceptionThrown')report.exceptions.push(m.params.exceptionDetails);if(p){pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}};
 await call('Runtime.enable');await until(()=>evaluate("typeof app!=='undefined'&&app.workspace?.layoutReady"),'workspace');
 await run("(()=>{[...document.querySelectorAll('.modal button')].find(b=>/信任仓库作者并启用插件|Trust author and enable plugins/i.test(b.textContent))?.click();return true})()");
 await call('Page.bringToFront');await call('Emulation.setDeviceMetricsOverride',{width:1100,height:820,deviceScaleFactor:2,mobile:false});
 await open('未命名.md');await run("app.plugins.enablePlugin('with-keyline')");
 await run("(()=>{app.workspace.leftSplit.collapse();app.workspace.rightSplit.collapse();return true})()");await delay(300);
 for(const color of ['moonstone','obsidian']){
  await run(`app.changeTheme('${color}')`);await delay(150);
  for(const mode of ['source','preview']){
   await open('未命名.md',mode);const m=await meta();
   assert.equal(m.rows,1);assert.equal(m.empty,true);assert.ok(m.rect.height>25&&m.rect.height<95,JSON.stringify(m.rect));
   assert.equal(m.suggestions,false);assert.deepEqual(m.properties,[{key:'',value:null}]);
   assert.equal(fs.readFileSync(path.join(vault,'未命名.md'),'utf8'),'');
   await shot(`empty-${color}-${mode}`);check('Empty native row, no suggestions or writes: '+color+' '+mode);
  }
 }
 await run("app.changeTheme('moonstone')");await open('工作笔记.md');
 await run(`(()=>{${view}.editor.focus();return true})()`);await delay(100);
 const focusBefore=await run("document.activeElement.className");await run("app.plugins.plugins['with-keyline'].noteProperties.refresh()");
 assert.equal(await run("document.activeElement.className"),focusBefore);assert.equal(await text(),notes['工作笔记.md']);check('Existing prose, selection/focus and source preserved');
 await open('未命名.md');await click('.metadata-property-key-input');await type('项目');await key('Tab',9);
 await type('Atlas');await key('Tab',9);await delay(350);
 assert.match(await text(),/项目: Atlas/);assert.equal((await meta()).empty,false);await shot('property-filled');check('Native name/value entry commits only after explicit input');
 const changed=await text();await run(`${view}.metadataEditor.focusProperty('项目')`);await key('z',90,4);
 assert.notEqual(await text(),changed);await key('z',90,12);assert.equal(await text(),changed);check('Native property edit undo/redo');
 await open('项目记录.md');assert.equal(await run("document.querySelector('.metadata-property-value input[type=date]').value"),'');
 const cal='.keyline-next-property-calendar',dateInput='.metadata-property-value input[type=date]';
 const isOpen=()=>run(`!!document.querySelector('${cal}')`);
 await click(dateInput);assert.equal(await isOpen(),true);
 assert.equal(await run(`document.querySelectorAll('${cal} [data-date]').length`),42);
 await shot('calendar-light');
 const light=await run(`getComputedStyle(document.querySelector('${cal}')).backgroundColor`);
 await run("app.changeTheme('obsidian')");await delay(150);assert.equal(await isOpen(),true);
 const dark=await run(`getComputedStyle(document.querySelector('${cal}')).backgroundColor`);
 assert.notEqual(light,dark);await shot('calendar-dark');await run("app.changeTheme('moonstone')");
 await key('Escape',27);assert.equal(await isOpen(),false);
 assert.equal(await run(`document.activeElement===document.querySelector('${dateInput}')`),true);
 assert.equal(await text(),notes['项目记录.md']);check('Themed calendar opens, switches light/dark live and cancels without a write; focus restored');
 await click(dateInput);const monthBefore=await run(`document.querySelector('${cal} .keyline-calendar-month').textContent`);
 await click(`${cal} [data-action=next]`);assert.notEqual(await run(`document.querySelector('${cal} .keyline-calendar-month').textContent`),monthBefore);
 assert.equal(await text(),notes['项目记录.md']);await click(`${cal} [data-action=previous]`);
 const chosen=await run(`document.querySelector('${cal} [data-date]:not(.is-outside):not(:disabled)').dataset.date`);
 await click(`${cal} [data-date="${chosen}"]`);await delay(250);assert.equal(await isOpen(),false);assert.ok((await text()).includes('日期: '+chosen));
 const clicked=await text();await key('z',90,4);assert.notEqual(await text(),clicked);await key('z',90,12);assert.equal(await text(),clicked);
 check('Mouse month navigation does not write; mouse date selection saves with native undo/redo');
 await click(dateInput);assert.equal(await run(`document.querySelector('${cal} .is-selected').dataset.date`),chosen);
 await shot('calendar-selected');await key('ArrowRight',39);await key('Enter',13);assert.equal(await isOpen(),false);assert.notEqual(await text(),clicked);
 check('Selected date is highlighted; arrow key plus Enter commits');
 await click(dateInput);const beforeKeys=await text();await key('PageDown',34);await key('Home',36);await key('End',35);await key('Escape',27);assert.equal(await text(),beforeKeys);
 check('Keyboard month/week navigation and Escape preserve the stored value');
 await run(`document.querySelector('${dateInput}').focus()`);await key('ArrowDown',40,1);assert.equal(await isOpen(),true);
 await click(`${cal} [data-action=today]`);const today=await run("(()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')})()");
 assert.ok((await text()).includes('日期: '+today));check('Alt+Down opens calendar; mouse Today saves the local date');
 await click(dateInput);await click(`${cal} [data-action=clear]`);assert.match(await text(),/日期:\s*\ntags:/);check('Mouse Clear empties the native date field');
 await click(dateInput);await click('.inline-title');assert.equal(await isOpen(),false);check('Outside click dismisses without stealing focus');
 await click(dateInput);await open('会议.md');assert.equal(await isOpen(),false);check('Switching notes closes the old picker');
 const dateTimeInput='.metadata-property-value input[type=datetime-local]';
 await click(dateTimeInput);const meetingBefore=await text();
 await click(`${cal} [data-action=next]`);await click(`${cal} [data-date="2026-11-03"]`);
 assert.equal(await text(),meetingBefore);assert.equal(await isOpen(),true);
 await click(`${cal} [data-action=apply]`);assert.match(await text(),/会议时间: 2026-11-03T09:30:42/);
 check('Datetime day selection waits for Apply and preserves time including seconds');
 await click(dateTimeInput);await click(`${cal} [data-action=clear]`);assert.match(await text(),/会议时间:\s*\n/);check('Datetime Clear preserves the empty property');
 await open('项目记录.md');await click(dateInput);await run("app.plugins.disablePlugin('with-keyline')");assert.equal(await isOpen(),false);
 assert.equal(await run(`document.querySelector('${dateInput}').hasAttribute('aria-controls')`),false);
 await run("app.plugins.enablePlugin('with-keyline')");check('Plugin unload closes the popup and releases owned accessibility attributes');
 // Manual-input contract remains native; the custom picker does not replace
 // the field or intercept ordinary editing keys.
 await run("(()=>{const e=document.querySelector('.metadata-property-value input[type=date]');e.blur();e.focus();e.value='2026-10-28';e.dispatchEvent(new Event('input',{bubbles:true}));e.blur();return true})()");await delay(200);
 const dated=await text();assert.match(dated,/日期: 2026-10-28/);await shot('date-selected');check('Native date input/change/blur contract saves the selected value (event-level)');
 await run("(()=>{const e=document.querySelector('.metadata-property-value input[type=date]');e.focus();e.value='';e.dispatchEvent(new Event('input',{bubbles:true}));e.blur();return true})()");await delay(200);
 assert.match(await text(),/日期:\s*\ntags:/);check('Clearing the native date input persists an empty value (event-level)');
 await click(dateInput);await call('Emulation.setDeviceMetricsOverride',{width:390,height:780,deviceScaleFactor:1,mobile:false});await delay(150);
 const small=await run(`document.querySelector('${cal}').getBoundingClientRect().toJSON()`);assert.ok(small.left>=0&&small.right<=390&&small.bottom<=780,JSON.stringify(small));await shot('calendar-narrow');await key('Escape',27);
 await call('Emulation.setDeviceMetricsOverride',{width:1100,height:820,deviceScaleFactor:2,mobile:false});check('Calendar stays inside a narrow desktop viewport');
 await click('[data-property-key=tags] .multi-select-input');await type('res');
 const choices=await run("[...document.querySelectorAll('.suggestion-item')].filter(e=>e.getBoundingClientRect().width).map(e=>e.textContent)");
 assert.ok(choices.some(s=>s.includes('research')),JSON.stringify(choices));await shot('tag-options');await key('Escape',27);check('Native tag field offers existing values, not invented recommendations');
 await open('工作笔记.md','source',true);assert.equal((await meta()).empty,false);assert.equal((await meta()).rect.height,0);check('Raw source mode is not replaced by an empty property UI');
 await run("app.vault.setConfig('propertiesInDocument','hidden')");await open('工作笔记.md');assert.equal((await meta()).rect.height,0);assert.equal((await meta()).rows,0);check('Native hide-properties preference is respected');
 await run("app.vault.setConfig('propertiesInDocument','visible')");await open('格式错误.md');assert.equal((await meta()).empty,false);assert.equal(await text(),notes['格式错误.md']);check('Invalid YAML untouched, native error UI retained');
 await open('工作笔记.md');await run("app.plugins.disablePlugin('with-keyline')");await delay(150);assert.equal((await meta()).rows,0);assert.equal((await meta()).empty,false);assert.equal(await text(),notes['工作笔记.md']);check('Disable removes untouched draft and restores native empty state');
 await run("app.plugins.enablePlugin('with-keyline')");await delay(150);assert.equal((await meta()).rows,1);check('Re-enable adds exactly one row');
 await run('app.emulateMobile(true)');await delay(800);await call('Emulation.setDeviceMetricsOverride',{width:390,height:780,deviceScaleFactor:1,mobile:false});
 await run("app.plugins.enablePlugin('with-keyline')");
 await run("app.plugins.plugins['with-keyline'].betaNotice?.hide()");
 await open('工作笔记.md');await delay(200);const mobile=await meta();assert.equal(mobile.rows,1);assert.ok(mobile.rect.width<=390&&mobile.rect.left>=0);
 await shot('empty-mobile');check('Mobile-emulated empty row fits the viewport');
 await open('项目记录.md');await run(`(()=>{const e=document.querySelector('${dateInput}');e.showPicker=()=>window.__mobilePickerCalls=(window.__mobilePickerCalls||0)+1;return true})()`);
 await click(dateInput);assert.equal(await isOpen(),false);assert.equal(await run('window.__mobilePickerCalls'),1);check('Mobile-emulated path delegates to native showPicker, never the desktop calendar');
 for(const f of ['工作笔记.md','格式错误.md','参考.md'])assert.equal(fs.readFileSync(path.join(vault,f),'utf8'),notes[f]);
 assert.deepEqual(report.exceptions,[]);report.status='passed';
}catch(error){report.status='failed';report.error=String(error.stack??error);console.error(report.error);try{report.metadata=await meta();await shot('failure');}catch{}process.exitCode=1;}
finally{fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify(report,null,2));ws?.close();child.kill();}
