import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {parseBlocks,applyBlockEdit}=require('../.test-build/domain/blocks.cjs');
const {handleRow,handleConversion,handleDelete}=require('../.test-build/domain/handle-menu.cjs');
const fixture='First line.\nSecond line.\nThird line.\n\nTail.';
for(const [target,insert] of [['h2','## Second line.'],['bullet','- Second line.'],['number','1. Second line.'],['task','- [ ] Second line.'],['quote','> Second line.'],['code','```\nSecond line.\n```'],['math','$$\nSecond line.\n$$'],['callout-note','> [!note]\n> Second line.']])test(`physical-row conversion retains neighbouring rows: ${target}`,()=>{
  const model=parseBlocks(fixture),row=handleRow(model,15),plan=handleConversion(model,row,target);
  assert.equal(applyBlockEdit(fixture,plan),'First line.\n'+insert+'\nThird line.\n\nTail.');
});
test('blank row can become a heading without borrowing neighbouring text',()=>{
  const model=parseBlocks(fixture),row=handleRow(model,fixture.indexOf('\n\n')+1);
  assert.equal(row.body,'');assert.equal(applyBlockEdit(fixture,handleConversion(model,row,'h2')),fixture.replace('\n\nTail','\n## \nTail'));
});
test('one structural prefix is removed, checked state and inline content remain',()=>{
  for(const text of ['## **Title**','> **Title**','- **Title**','- [x] **Title**']){
    const model=parseBlocks(text),row=handleRow(model,0);
    assert.equal(handleConversion(model,row,'paragraph').insert,'**Title**');
  }
  const model=parseBlocks('- [x] Done'),row=handleRow(model,0);assert.equal(handleConversion(model,row,'task'),null);
});
test('divider inserts after the target row and never replaces its payload',()=>{
  const model=parseBlocks(fixture),row=handleRow(model,15);
  assert.equal(applyBlockEdit(fixture,handleConversion(model,row,'divider')),'First line.\nSecond line.\n\n---\n\nThird line.\n\nTail.');
});
test('delete addresses exactly the hovered source row, including its following newline',()=>{
  const model=parseBlocks(fixture);assert.equal(applyBlockEdit(fixture,handleDelete(model,handleRow(model,15))),'First line.\nThird line.\n\nTail.');
});
for(const text of ['---\nx: y\n---','```\nvalue\n```','$$\nvalue\n$$','%% comment %%','<div>value</div>','- Parent\n  - Child','- Parent\n  - Child\n- Next','A\n===','A ^id'])test(`do not rewrite opaque or shared structural fragments: ${JSON.stringify(text)}`,()=>{
  const model=parseBlocks(text);assert.equal(handleRow(model,text.includes('Child')?text.indexOf('Child'):0),null);
});
test('CRLF, Unicode and safe fence lengths survive physical-row conversion',()=>{
  const text='Before.\r\n你好 `code`\r\nAfter.',model=parseBlocks(text),row=handleRow(model,12),plan=handleConversion(model,row,'code');
  assert.equal(applyBlockEdit(text,plan),'Before.\r\n```\r\n你好 `code`\r\n```\r\nAfter.');
});
test('outdated, invalid and oversized row snapshots fail closed',()=>{
  const model=parseBlocks(fixture),row=handleRow(model,15);
  assert.equal(handleConversion(parseBlocks(fixture+'!'),{...row,body:'wrong'},'h2'),null);
  for(const at of [-1,NaN,Infinity,1000,1.5])assert.equal(handleRow(model,at),null);
  assert.equal(handleRow({text:'x'.repeat(2*1024*1024+1),blocks:[]},0),null);
});
