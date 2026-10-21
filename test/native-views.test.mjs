import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {attachedViews}=createRequire(import.meta.url)('../.test-build/platform/native-views.cjs');
const view=(type,connected=true)=>({getViewType:()=>type,containerEl:{isConnected:connected}});
test('actual view discovery excludes redirected, detached and unknown trees without invoking named lookup',()=>{
  const native=view('file-explorer'),foreign=view('make.md'),bucket=view('bucket-sidebar-view'),detached=view('file-explorer',false);
  const all=[native,foreign,bucket,detached,{containerEl:{isConnected:true}},native];
  const app={workspace:{getLeavesOfType(){throw Error('Must never ask redirectable lookup');},iterateAllLeaves:fn=>all.forEach(view=>fn({view}))}};
  assert.deepEqual(attachedViews(app,'file-explorer'),[native]);assert.deepEqual(attachedViews(app,'bucket-sidebar-view'),[bucket]);
  native.getViewType=()=> 'foreign-tree';assert.deepEqual(attachedViews(app,'file-explorer'),[]);
});
test('independent native explorer windows are all discoverable and detached ones cease to be targets',()=>{
  const a=view('file-explorer'),b=view('file-explorer'),app={workspace:{iterateAllLeaves:fn=>[a,b].forEach(view=>fn({view}))}};
  assert.deepEqual(attachedViews(app,'file-explorer'),[a,b]);a.containerEl.isConnected=false;
  assert.deepEqual(attachedViews(app,'file-explorer'),[b]);
});
