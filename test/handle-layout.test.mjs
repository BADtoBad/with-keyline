import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {handleLayout}=createRequire(import.meta.url)('../.test-build/domain/handle-layout.cjs');
const viewport={left:344,right:1092,top:100,bottom:820},content={left:418,right:1018},row={top:248.90625,bottom:267.90625};
test('one gutter and centred text-row anchor exclude paragraph gap widgets',()=>{
  assert.deepEqual(handleLayout(viewport,content,row,'left',2),{x:356,y:244.40625,size:28});
  assert.deepEqual(handleLayout(viewport,content,row,'right',2),{x:1022,y:244.40625,size:28});
});
test('three controls shrink together to fit the gutter, without growing the row',()=>{
  assert.deepEqual(handleLayout(viewport,content,row,'right',3),{x:1022,y:248.40625,size:20});
  assert.deepEqual(handleLayout(viewport,content,row,'left',3),{x:350,y:248.40625,size:20});
});
test('scroll clipping and invalid geometry never park a detached handle over other UI',()=>{
  for(const r of [{top:80,bottom:99},{top:819,bottom:840},{top:NaN,bottom:250}])assert.equal(handleLayout(viewport,content,r,'left',2),null);
  for(const n of [0,4,1.5,NaN])assert.equal(handleLayout(viewport,content,row,'left',n),null);
});
test('narrow gutters preserve bounded controls inside the editor viewport',()=>{
  const r=handleLayout(viewport,{left:350,right:1086},row,'left',3);assert.equal(r.size,20);assert.equal(r.x,350);
});
const fold={left:403,right:418,...row};
test('left controls reserve the entire native fold hitbox plus a gap',()=>{
  const r=handleLayout(viewport,content,row,'left',2,fold);
  assert.ok(r.x+r.size*2+2<=fold.left-4);assert.ok(r.x>=viewport.left+6);assert.ok(r.size>=20);
  assert.equal(r.side,undefined);assert.equal((r.y+r.size/2),(row.top+row.bottom)/2);
});
test('a tight gutter uses the other side without hiding folding or shrinking targets',()=>{
  for(const count of [1,2,3]){
    const r=handleLayout(viewport,{left:370,right:1066},row,'left',count,{...fold,left:355,right:370});
    assert.equal(r.side,'right');assert.ok(r.x>=374);assert.ok(r.size>=20);
    assert.ok(r.x+r.size*count+(count-1)*2<=viewport.right-6);
  }
});
test('ordinary rows, other-row folds and explicit right handles retain their placement',()=>{
  for(const side of ['left','right'])for(const ignored of [undefined,{...fold,top:10,bottom:20},{...fold,left:NaN},{...fold,right:403}])
    assert.deepEqual(handleLayout(viewport,content,row,side,2,ignored),handleLayout(viewport,content,row,side,2));
  assert.deepEqual(handleLayout(viewport,content,row,'right',2,fold),handleLayout(viewport,content,row,'right',2));
});
