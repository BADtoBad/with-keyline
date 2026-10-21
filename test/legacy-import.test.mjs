import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {planLegacyImport,legacyId,legacyVersion,importLimit}=require('../.test-build/domain/legacy-import.cjs');
const {decodePreferences,editingPreferences}=require('../.test-build/domain/preferences.cjs');
const {insertionEntries}=require('../.test-build/domain/insertion.cjs');
const manifest=JSON.stringify({id:legacyId,version:legacyVersion}),base=()=>decodePreferences({language:'zh'});
const plan=raw=>planLegacyImport(manifest,JSON.stringify({enabled:true,...raw}),base());
test('legacy master and subordinate choices are stored separately; current-only preferences stay',()=>{
  const raw={enabled:false,selectionToolbar:true,wikilinkInputAliases:false,nativeFileExplorerEnhancements:false,workspaceSwitcher:false,showHoverHints:true,
    hideSyntaxMarkers:true,guardSuspiciousSyntax:false,revealSyntaxWithOption:false,notifyOnPaste:false,plusHandle:false,foldHandle:true,handleAlwaysVisible:true,
    blockKeys:true,snapSelectionToBlocks:false,slashMenu:false,slashInline:false,embedAttachments:true,dragGranularity:'line',handleSide:'right',hoverDelay:120,hideDelay:300};
  const p=plan(raw).preferences;assert.equal(p.editingEnabled,false);assert.equal(p.toolbar,true);assert.equal(p.hideMarkers,true);
  assert.equal(p.language,'zh');assert.equal(p.mentions,false);assert.equal(p.fullwidthLinks,false);assert.equal(p.fileNavigation,false);
  assert.equal(p.hints,true);assert.equal(p.workspaces,false);assert.equal(p.dragGranularity,'line');assert.equal(p.handleSide,'right');
  assert.equal(p.handleHoverDelay,120);assert.equal(p.handleHideDelay,300);assert.equal(p.handlePinned,true);assert.equal(p.handleFold,true);assert.equal(p.handlePlus,false);
  const effective=editingPreferences(p);assert.equal(effective.toolbar,false);assert.equal(effective.blockKeys,false);assert.equal(effective.hideMarkers,false);
  assert.equal(editingPreferences({...p,editingEnabled:true}).toolbar,true);assert.equal(p.blockKeys,true);
});
test('all sixteen layout values map without mutating the source',()=>{
  const layout={textMaxWidth:880,pageSidePadding:32,editorLineHeight:2,readingLineHeight:1.7,paragraphGap:.5,paragraphBefore:.5,paragraphAfter:.5,firstLineIndent:1,
    listLineHeight:1.6,listItemSpacing:.2,listIndent:2,listMarkerGap:8,listBulletSize:5,blockquoteIndent:20,headingBefore:2,headingAfter:.5};
  const copy=JSON.stringify(layout),p=plan({themeLayout:layout}).preferences.typography;assert.equal(Object.keys(p).length,16);
  assert.deepEqual(Object.values(p),Object.values(layout));assert.equal(JSON.stringify(layout),copy);
});
test('type and path icon overrides retain original identity names, custom hex and Unicode paths',()=>{
  const p=plan({fileIcons:{enabled:false,monochrome:true,types:{markdown:{icon:'keyline-file-text',color:'blue'},pdf:{color:'#12ABCD'}},files:{'资料/稿件.md':{icon:'lucide-book-open'},'__proto__':{color:'red'}}}}).preferences;
  assert.equal(p.fileIcons,false);assert.equal(p.monochrome,true);assert.deepEqual(p.iconRules,[{scope:'type',key:'note',glyph:'keyline-file-text',tint:'blue'},{scope:'type',key:'document',tint:'#12abcd'},{scope:'path',key:'资料/稿件.md',glyph:'book-open'}]);
});
test('old IDs, duplicate command bindings, custom glyphs, order and hidden entries survive',()=>{
  const p=plan({insertCustom:[{id:'a',label:'First',icon:'star',commandId:'editor:toggle-bold'},{id:'b',label:'Second',icon:'heart',commandId:'editor:toggle-bold'}],
    insertOrder:['b','todo','ext-link','link','a','page','code','divider'],insertHidden:['a','todo']}).preferences;
  const entries=insertionEntries(p,false,'',true);assert.deepEqual(entries.slice(0,8).map(e=>e.id),['custom:legacy-2','task','link','wiki','custom:legacy-1','newpage','codeblock','rule']);
  assert.equal(entries[0].icon,'heart');assert.equal(entries[0].command,'editor:toggle-bold');assert.equal(p.customInsert.length,2);
  assert.ok(!insertionEntries(p,false).some(e=>e.id==='custom:legacy-1'));assert.ok(!insertionEntries(p,false).some(e=>e.id==='task'));
});
test('marginalia is reported, never bundled; imports never execute commands',()=>{
  const r=plan({marginalia:false,dateFormat:'YYYY/MM/DD',timeFormat:'HH:mm:ss'});assert.ok(r.notices.includes('marginalia-excluded'));
  assert.equal(r.preferences.dateFormat,'YYYY/MM/DD');assert.equal(r.preferences.timeFormat,'HH:mm:ss');assert.equal(r.preferences.marginalia,undefined);
});
test('empty and partial old order retains old effective ordering before new builtins',()=>{
  const defaults=insertionEntries(plan({}).preferences,false).map(e=>e.id);
  assert.deepEqual(defaults.slice(0,7),['h1','h2','h3','h4','h5','task','codeblock']);assert.ok(defaults.indexOf('yesterday')<defaults.indexOf('tomorrow'));
  assert.ok(defaults.indexOf('text')>defaults.indexOf('comment'));
  const partial=insertionEntries(plan({insertOrder:['time']}).preferences,false).map(e=>e.id);assert.deepEqual(partial.slice(0,3),['time','h1','h2']);
});
for(const raw of [{schema:2},{newFutureKey:true},{enabled:'false'},{fileIcons:{files:{'../outside.md':{color:'blue'}}}},{fileIcons:{types:{future:{icon:'star'}}}},
  {fileIcons:{types:{markdown:{color:'url(x)'}}}},{themeLayout:{textMaxWidth:123}},{themeLayout:{unknown:1}},{themeLayout:{textMaxWidth:'600'}},
  {insertCustom:null},{dragGranularity:null},{handleSide:'middle'},{hoverDelay:9999},{insertHidden:['missing']},{slashTrigger:'@'},
  {insertCustom:[{id:'x',label:'Run',commandId:'eval()'}]},{insertCustom:[{id:'h1',label:'Run',commandId:'core:command'}]},
  {insertCustom:[{id:'x',label:'Run',commandId:'core:command',icon:'<svg>'}]},
  {insertCustom:Array.from({length:33},(_,i)=>({id:String(i),label:'Run',commandId:'core:command'}))}])
  test(`unknown/malformed contract rejected: ${JSON.stringify(raw).slice(0,100)}`,()=>assert.throws(()=>plan(raw)));
test('version, root, size and foreign JSON are rejected before producing a plan',()=>{
  for(const version of ['0.7.3','0.8.0',null])assert.throws(()=>planLegacyImport(JSON.stringify({id:legacyId,version}),'{}',base()));
  for(const value of ['[]','null','{}','not JSON',' '.repeat(importLimit+1)])assert.throws(()=>planLegacyImport(manifest,value,base()));
  assert.throws(()=>planLegacyImport('{"id":"other","version":"0.7.4"}','{}',base()));
});
