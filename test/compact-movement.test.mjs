import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {parseBlocks,blockAt,moveBlocks,duplicateBlocks,applyBlockEdit}=require('../.test-build/domain/blocks.cjs');
const {relocateBlocks,changeBlockIndent}=require('../.test-build/domain/relocation.cjs');
const at=(m,s)=>blockAt(m,m.text.indexOf(s));
const run=(m,p)=>{assert.ok(p,'Expected a scoped compact operation');const value=applyBlockEdit(m.text,p);assert.ok(value);return value;};
const reorder=[
  ['- - A\n  - B\n- Outside',['A'],'B',true,'- - B\n  - A\n- Outside'],
  ['- - A\n  - B\n- Outside',['B'],'A',false,'- - B\n  - A\n- Outside'],
  ['- - A\n  - B\n  - C\n- Outside',['A','B'],'C',true,'- - C\n  - A\n  - B\n- Outside'],
  ['1. - A\n     more\n   - B\n2. Outside',['A'],'B',true,'1. - B\n   - A\n     more\n2. Outside'],
  ['- - - A\n    - B\n  - C\n- Outside',['A'],'B',true,'- - - B\n    - A\n  - C\n- Outside'],
  ['- - A\n    ```js\n      code()\n    ```\n  - B\n- Outside',['A'],'B',true,'- - B\n  - A\n    ```js\n      code()\n    ```\n- Outside'],
  ['- - A ^item\n  - B\n- Outside',['A'],'B',true,'- - B\n  - A ^item\n- Outside'],
];
for(const eol of ['\n','\r\n'])for(const[source,words,target,after,expected]of reorder)
test(`compact sibling reorder ${JSON.stringify(source)} ${JSON.stringify(eol)}`,()=>{
  const m=parseBlocks(source.replaceAll('\n',eol)),chosen=words.map(s=>at(m,s));
  const p=moveBlocks(m,chosen,at(m,target),after),value=run(m,p);
  assert.equal(value,expected.replaceAll('\n',eol));
  assert.equal(applyBlockEdit(m.text.replace(words[0],'Changed'),p),null);
});
for(const eol of ['\n','\r\n'])for(const[source,words,expected]of [
  ['- - A\n  - B\n- Outside',['A'],'- - A\n  - A\n  - B\n- Outside'],
  ['- - A\n  - B\n- Outside',['A','B'],'- - A\n  - B\n  - A\n  - B\n- Outside'],
  ['- - - A\n    - B\n  - C',['A'],'- - - A\n    - A\n    - B\n  - C'],
  ['1. - A\n     continuation\n   - B',['A'],'1. - A\n     continuation\n   - A\n     continuation\n   - B'],
])test(`compact duplicate ${JSON.stringify(source)} ${JSON.stringify(eol)}`,()=>{
  const m=parseBlocks(source.replaceAll('\n',eol));assert.equal(run(m,duplicateBlocks(m,words.map(s=>at(m,s)))),expected.replaceAll('\n',eol));
});
const cross=[
  ['- - A\n  - B\n- Outside','A','Outside','after','- \n  - B\n- Outside\n- A'],
  ['- - A\n  - B\n- Outside','A','Outside','inside','- \n  - B\n- Outside\n  - A'],
  ['- - A\n  - B\n- Outside','B','A','inside','- - A\n    - B\n- Outside'],
  ['- - A\n    continuation\n  - B\n- Outside','A','Outside','inside','- \n  - B\n- Outside\n  - A\n    continuation'],
  ['- - A\n  - B\n- Outside','Outside','A','before','- - Outside\n  - A\n  - B'],
  ['- - A\n  - B\n- Outside','Outside','A','after','- - A\n  - Outside\n  - B'],
  ['- - - A\n    - B\n  - C\n- Outside','A','Outside','inside','- - \n    - B\n  - C\n- Outside\n  - A'],
];
for(const eol of ['\n','\r\n'])for(const[source,word,target,placement,expected]of cross)
test(`compact cross-level ${word} ${placement} ${target} ${JSON.stringify(eol)}`,()=>{
  const m=parseBlocks(source.replaceAll('\n',eol));
  assert.equal(run(m,relocateBlocks(m,[at(m,word)],at(m,target),placement)),expected.replaceAll('\n',eol));
});
test('compact child can outdent while preserving its empty parent and remaining siblings',()=>{
  const m=parseBlocks('- - A\n  - B\n- Outside');
  assert.equal(run(m,changeBlockIndent(m,[at(m,'A')],-1)),'- \n  - B\n- A\n- Outside');
});
test('compact IDs are never duplicated and nonconsecutive groups stay unavailable',()=>{
  const m=parseBlocks('- - A ^one\n  - B\n  - C');
  assert.equal(duplicateBlocks(m,[at(m,'A')]),null);
  assert.equal(duplicateBlocks(m,[at(m,'A'),at(m,'B')]),null);
  assert.equal(moveBlocks(m,[at(m,'A'),at(m,'C')],at(m,'B'),true),null);
});
for(const eol of ['\n','\r\n'])for(const[source,words,target,expected]of [
  ['- - A\n    - Child\n  - B\n- Outside',['Outside'],'A','- - Outside\n  - A\n    - Child\n  - B'],
  ['- - - A\n    - B\n  - C\n- Outside',['Outside'],'A','- - - Outside\n    - A\n    - B\n  - C'],
  ['- - A\n  - B\n- Outside\n- Extra',['Outside','Extra'],'A','- - Outside\n  - Extra\n  - A\n  - B'],
  ['- Outside\n- - A\n  - B',['Outside'],'A','- - Outside\n  - A\n  - B'],
  ['- - A\n  - B\n- Outside\n  - C',['A','B'],'C','- \n- Outside\n  - A\n  - B\n  - C'],
  ['1. - A\n   - B\n2. Outside',['Outside'],'A','1. - Outside\n   - A\n   - B'],
  ['- - A ^one\n  - B\n- Outside',['Outside'],'A','- - Outside\n  - A ^one\n  - B'],
  ['- - A\n  - B\n- Outside\n\n^root',['Outside'],'A','- - Outside\n  - A\n  - B\n\n^root'],
])test(`compact before target preserves descendants, groups and anchors ${JSON.stringify(source)} ${JSON.stringify(eol)}`,()=>{
  const m=parseBlocks(source.replaceAll('\n',eol));
  assert.equal(run(m,relocateBlocks(m,words.map(w=>at(m,w)),at(m,target),'before')),expected.replaceAll('\n',eol));
});
