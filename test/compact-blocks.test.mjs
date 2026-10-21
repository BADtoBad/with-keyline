import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const {parseBlocks,blockAt,blockSelection,convertBlocks,applyBlockEdit,deleteBlock}=createRequire(import.meta.url)('../.test-build/domain/blocks.cjs');

for(const source of ['- - Child','- - - Child','- Parent\n  - - Child\n- Outside','1. - A\n   - B','- - Child\n  - Next\n\n^list'])test(`compact ancestry has unique IDs and exact editable ranges: ${JSON.stringify(source)}`,()=>{
  const model=parseBlocks(source),ids=new Set(model.blocks.map(b=>b.id));
  assert.equal(ids.size,model.blocks.length);
  for(const block of model.blocks){
    let cursor=block;const seen=new Set();
    while(cursor){
      assert.ok(!seen.has(cursor.id));seen.add(cursor.id);
      if(!cursor.parent)break;
      const parent=model.blocks.find(b=>b.id===cursor.parent);
      assert.ok(parent);assert.equal(parent.depth,cursor.depth-1);
      assert.ok(parent.from<=cursor.from&&parent.to>=cursor.to);
      assert.ok(parent.children.includes(cursor.id));cursor=parent;
    }
  }
  const at=source.includes('Child')?source.indexOf('Child'):source.indexOf('A');
  const child=blockAt(model,at);
  assert.equal(child.from,source.lastIndexOf('- ',at));
  assert.deepEqual(blockSelection(model,at),[child]);
  const outer=blockAt(model,0);assert.equal(outer.depth,1);
  assert.ok(outer.from<child.from);
});

const cases=[
  ['- - Child','number','- 1. Child'],
  ['- - Child','paragraph','- Child'],
  ['- - Child','quote','- > Child'],
  ['- - Child','h2','- ## Child'],
  ['- - Child','task','- - [ ] Child'],
  ['- - - Child','number','- - 1. Child'],
  ['- Parent\n  - - Child\n- Outside','number','- Parent\n  - 1. Child\n- Outside'],
  ['- - Child\n    continuation\n  - Next\n- Outside','number','- 1. Child\n     continuation\n  - Next\n- Outside'],
  ['- - Child\n  - Next\n- Outside','paragraph','- Child\n\n  - Next\n- Outside'],
  ['1. - Child\n     **more** 😀\n   - Next','task','1. - [ ] Child\n     **more** 😀\n   - Next'],
  ['- - [X] Child\n  - Next','task',null],
  ['-\t- Child\n\t  more\n- Outside','number','-\t1. Child\n       more\n- Outside'],
  ['- - Child\n    ```js\n      code();\n    ```\n  - Next\n- Outside','number','- 1. Child\n     ```js\n       code();\n     ```\n  - Next\n- Outside'],
  ['- - Child\n    - Leaf\n  - Next\n- Outside','quote','- > Child\n  > - Leaf\n\n  - Next\n- Outside'],
  ['- - Child ^child\n  - Next','number','- 1. Child ^child\n  - Next'],
];
for(const eol of ['\n','\r\n'])for(const[source,target,expected]of cases)test(`compact conversion ${target}, ${JSON.stringify(eol)}: ${JSON.stringify(source)}`,()=>{
  const text=source.replaceAll('\n',eol),m=parseBlocks(text),child=blockAt(m,text.indexOf('Child'));
  const plan=convertBlocks(m,[child],target);
  if(expected===null){assert.equal(plan,null);return;}
  assert.ok(plan);const next=applyBlockEdit(text,plan);assert.equal(next,expected.replaceAll('\n',eol));
  assert.equal(next.slice(0,plan.from)+plan.before+next.slice(plan.from+plan.insert.length),text);
  assert.ok(plan.anchor>=plan.from&&plan.head>=plan.anchor&&plan.head<=next.length);
  assert.equal(applyBlockEdit(text.slice(0,child.from)+'Later text',plan),null);
});

test('compact tab crossing the structural strip column stays unavailable instead of consuming payload whitespace',()=>{
  const source='- -\tChild\n\tmore\n- Outside',m=parseBlocks(source),child=blockAt(m,source.indexOf('Child'));
  for(const target of ['number','task','quote','paragraph'])assert.equal(convertBlocks(m,[child],target),null);
});

test('compact deletion removes the selected child, not the preceding parent marker',()=>{
  const text='- - Child\n  - Next\n- Outside',m=parseBlocks(text),child=blockAt(m,text.indexOf('Child'));
  assert.equal(applyBlockEdit(text,deleteBlock(m,child)),'- \n  - Next\n- Outside');
});

for(const eol of ['\n','\r\n'])for(const[target,expected]of [
  ['number','- 1. A\n  2. B\n- Outside'],
  ['task','- - [ ] A\n  - [ ] B\n- Outside'],
  ['paragraph','- A\n\n  B\n\n- Outside'],
  ['h2','- ## A\n\n  ## B\n\n- Outside'],
  ['quote','- > A\n\n  > B\n\n- Outside']
])test(`compact sibling group keeps its outer parent: ${target}, ${JSON.stringify(eol)}`,()=>{
  const source='- - A\n  - B\n- Outside'.replaceAll('\n',eol),m=parseBlocks(source);
  const chosen=['A','B'].map(s=>blockAt(m,source.indexOf(s))),plan=convertBlocks(m,chosen,target);
  assert.ok(plan);assert.equal(applyBlockEdit(source,plan),expected.replaceAll('\n',eol));
});

for(const source of ['- Parent\n  - A\n  - B\n- Outside','- Parent\n  - A\n  - B\r\n- Outside'])test(`final noncompact children do not consume the parent separator: ${JSON.stringify(source)}`,()=>{
  const m=parseBlocks(source),plan=convertBlocks(m,['A','B'].map(s=>blockAt(m,source.indexOf(s))),'paragraph');
  assert.ok(plan);assert.equal(applyBlockEdit(source,plan),source.replace('  - A\n  - B','\n  A\n\n  B\n'));
});
