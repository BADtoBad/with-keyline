import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const require=createRequire(import.meta.url),cm=require('@codemirror/state'),views=require('@codemirror/view');
const {wholeRows,selectedRowStarts,MAX_SELECTION_DOCUMENT}=require('../.test-build/domain/row-selection.cjs');
const text='Alpha first line.\nBeta second line.\n\nTail. 美😀';
const doc=cm.EditorState.create({doc:text}).doc, visible=[{from:0,to:doc.length}];

for(const [anchor,head,expected,paint] of [
  [2,7,[2,7],[]],[0,17,[0,17],[]],[4,23,[0,35],[0,18]],[23,4,[35,0],[0,18]],
  [4,18,[0,35],[0,18]],[7,7,[7,7],[]],[20,36,[18,36],[18,36]],[0,doc.length,[0,doc.length],[0,18,36,37]]
])test(`physical row bounds and paint ${anchor}:${head}`,()=>{
  const r={anchor,head},n=wholeRows(doc,r);
  assert.deepEqual([n.anchor,n.head],expected);assert.deepEqual(selectedRowStarts(doc,[r],visible),paint);
  assert.deepEqual(wholeRows(doc,n),n);assert.equal(doc.toString(),text);
});
test('paint unions multiple ranges in source order and only walks visible rows',()=>{
  const ranges=[{anchor:doc.length,head:36},{anchor:4,head:23},{anchor:23,head:4}];
  assert.deepEqual(selectedRowStarts(doc,ranges,visible),[0,18,36,37]);
  assert.deepEqual(selectedRowStarts(doc,ranges,[{from:20,to:25}]),[18]);
  assert.deepEqual(selectedRowStarts(doc,ranges,[]),[]);
});
test('invalid and oversized bounds fail closed without calling lineAt',()=>{
  for(const r of [{anchor:-1,head:4},{anchor:0,head:Infinity},{anchor:2.5,head:3},{anchor:0,head:doc.length+1}]){
    assert.equal(wholeRows(doc,r),r);assert.deepEqual(selectedRowStarts(doc,[r],visible),[]);
  }
  const huge={length:MAX_SELECTION_DOCUMENT+1,lineAt(){assert.fail('No oversized document walk');}},r={anchor:0,head:4};
  assert.equal(wholeRows(huge,r),r);assert.deepEqual(selectedRowStarts(huge,[r],visible),[]);
});
test('a wrapped physical line and unicode positions remain precise',()=>{
  const document=cm.Text.of(['字😀'.repeat(1000)]),r={anchor:3,head:1900};
  assert.equal(wholeRows(document,r),r);assert.deepEqual(selectedRowStarts(document,[r],[{from:0,to:document.length}]),[]);
});

function fixture({focused=true,composing=false,file=true,readOnly=false,huge=false}={}) {
  const info=cm.StateField.define({create:()=>file?{file:{path:'Fiction.md'}}:undefined,update:v=>v});
  const module={exports:{}};
  vm.runInNewContext(readFileSync(new URL('../.test-build/platform/row-selection.cjs',import.meta.url),'utf8'),{
    module,exports:module.exports,require:name=>name==='obsidian'?{editorInfoField:info}:name==='@codemirror/state'?cm:
      name==='@codemirror/view'?{...views,ViewPlugin:{define:(create,spec)=>({create,spec})}}:assert.fail(name)
  });
  const preferences={editingEnabled:true,snapSelection:true},owner=new module.exports.RowSelection(()=>preferences),[plugin,filter]=owner.extension();
  let state=cm.EditorState.create({doc:huge?'x'.repeat(MAX_SELECTION_DOCUMENT+1):text,extensions:[info,filter,cm.EditorState.readOnly.of(readOnly),cm.EditorState.allowMultipleSelections.of(true)]});
  const window={getComputedStyle:()=>({getPropertyValue:()=> '1'}),requestAnimationFrame:fn=>{window.callback=fn;return 10;},cancelAnimationFrame:id=>{window.cancelled=id;}};
  const view={get state(){return state;},hasFocus:focused,composing,visibleRanges:visible,dom:{ownerDocument:{defaultView:window}},dispatch(spec){apply(spec);}};
  const instance=plugin.create(view);
  function apply(spec){const tr=state.update(spec);state=tr.state;instance.update({transactions:[tr],docChanged:tr.docChanged,selectionSet:!!tr.selection,viewportChanged:false,startState:tr.startState,state});return tr;}
  return {owner,preferences,view,instance,window,apply};
}
function bounds(f){return Array.from(f.view.state.selection.ranges,r=>[r.anchor,r.head]);}
function nextWindow(theme='0') {
  const win={getComputedStyle:()=>({getPropertyValue:()=>theme}),requestAnimationFrame:fn=>{win.callback=fn;return 10;},cancelAnimationFrame:id=>{win.cancelled=id;}};
  return win;
}
test('queued row paint follows a moved editor and stale old-window frames cannot consume the replacement',()=>{
  const f=fixture();f.owner.refresh();const oldCallback=f.window.callback,win=nextWindow();
  f.view.dom.ownerDocument={defaultView:win};f.owner.refresh();
  assert.equal(f.window.cancelled,10);assert.equal(typeof win.callback,'function');
  assert.equal(win.cancelled,undefined);oldCallback();assert.equal(f.owner.frames.size,1);
  win.callback();assert.equal(f.owner.frames.size,0);assert.equal(f.instance.theme,false);
  assert.equal(f.view.state.doc.toString(),text);
});
test('moving an existing editor refreshes row paint theme without changing text or selection',()=>{
  const f=fixture();f.apply({selection:{anchor:4,head:23}});f.owner.refresh();
  f.view.dom.ownerDocument={defaultView:nextWindow()};f.apply({});
  assert.equal(f.window.cancelled,10);assert.equal(f.instance.theme,false);assert.equal(f.instance.decorations.size,2);
  assert.deepEqual(bounds(f),[[4,23]]);assert.equal(f.view.state.doc.toString(),text);
});
test('an old-window frame firing before the editor update reschedules only in the new window',()=>{
  const f=fixture();f.owner.refresh();const win=nextWindow();
  f.view.dom.ownerDocument={defaultView:win};f.window.callback();
  assert.equal(typeof win.callback,'function');assert.equal(f.owner.frames.size,1);
  assert.equal(f.instance.theme,true);win.callback();assert.equal(f.instance.theme,false);
  assert.equal(f.owner.frames.size,0);assert.equal(f.view.state.doc.toString(),text);
});
for(const end of ['detach','dispose'])test(`row paint ${end} cancels the owning window frame even before a moved editor updates`,()=>{
  const f=fixture();f.owner.refresh();const callback=f.window.callback,win=nextWindow();
  f.view.dom.ownerDocument={defaultView:win};
  if(end==='detach')f.instance.destroy();else f.owner.dispose();
  assert.equal(f.window.cancelled,10);assert.equal(win.cancelled,undefined);callback();
  assert.equal(f.owner.frames.size,0);assert.equal(f.owner.views.size,0);
  assert.equal(f.view.state.doc.toString(),text);
});
test('editing master disables paint and snapping without losing the separate snapping choice',()=>{
  const f=fixture();f.apply({selection:{anchor:4,head:23}});assert.equal(f.instance.decorations.size,2);
  f.preferences.editingEnabled=false;f.owner.refresh();f.window.callback();assert.equal(f.instance.decorations.size,0);
  f.apply({selection:{anchor:23,head:4},userEvent:'select.pointer'});assert.deepEqual(bounds(f),[[23,4]]);assert.equal(f.preferences.snapSelection,true);
  f.preferences.editingEnabled=true;f.owner.refresh();f.window.callback();assert.equal(f.instance.decorations.size,2);
});
for(const event of ['select','select.keyboard','input.type','input.type.compose','undo',undefined])test(`precise range retained for non-pointer ${event}`,()=>{
  const f=fixture();f.apply({selection:{anchor:4,head:23},...(event?{userEvent:event}:{})});assert.deepEqual(bounds(f),[[4,23]]);
});
for(const options of [{focused:false},{composing:true},{file:false},{readOnly:true},{huge:true}])test(`pointer safety ${JSON.stringify(options)}`,()=>{
  const f=fixture(options);f.apply({selection:{anchor:4,head:23},userEvent:'select.pointer'});assert.deepEqual(bounds(f),[[4,23]]);
});
test('pointer selection expands in one native transaction, respects direction and opt-out',()=>{
  const f=fixture();f.apply({selection:{anchor:23,head:4},userEvent:'select.pointer'});assert.deepEqual(bounds(f),[[35,0]]);
  f.preferences.snapSelection=false;f.apply({selection:{anchor:4,head:23},userEvent:'select.pointer'});assert.deepEqual(bounds(f),[[4,23]]);
  assert.equal(f.instance.decorations.size,2);
});
test('transactions containing edits never expand their selection',()=>{
  const f=fixture();f.apply({changes:{from:0,to:0,insert:'Q'},selection:{anchor:4,head:23},userEvent:'select.pointer'});
  assert.deepEqual(bounds(f),[[4,23]]);assert.equal(f.view.state.doc.toString(),'Q'+text);
});
test('paint refresh and unload do not write text; pending frame is cancelled',()=>{
  const f=fixture();f.apply({selection:{anchor:4,head:23}});assert.equal(f.instance.decorations.size,2);
  f.owner.refresh();assert.ok(f.window.callback);f.window.callback();assert.equal(f.view.state.doc.toString(),text);
  f.owner.refresh();f.owner.dispose();assert.equal(f.window.cancelled,10);assert.equal(f.owner.views.size,0);
  f.apply({selection:{anchor:4,head:23},userEvent:'select.pointer'});assert.deepEqual(bounds(f),[[4,23]]);assert.equal(f.instance.decorations.size,0);
  f.instance.destroy();
});
test('closing a view cancels only its pending paint refresh',()=>{
  const f=fixture();f.owner.refresh();f.instance.destroy();
  assert.equal(f.window.cancelled,10);assert.equal(f.owner.views.size,0);
  f.window.callback();assert.equal(f.view.state.doc.toString(),text);
});
