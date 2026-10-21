import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {parseBlocks,blockAt,applyBlockEdit,inProtectedSyntax,markdownTree,convertBlocks}=require('../.test-build/domain/blocks.cjs');
const {relocateBlocks,changeBlockIndent}=require('../.test-build/domain/relocation.cjs');
const at=(m,s)=>blockAt(m,m.text.indexOf(s));
const run=(m,p)=>{assert.ok(p,'Expected content-preserving relocation');return applyBlockEdit(m.text,p);};
const bodies=[
  ['math','$$\nx+y\n$$'], ['math-blank','$$\nx+y\n\nz+w\n$$'],
  ['comment','%%\nHidden **text**\n%%'], ['comment-blank','%%\nHidden\n\nsecond\n%%'],
  ['paragraph-anchor','Text **strong**\n\n^anchor'],
  ['code-anchor','```js\n  value()\n```\n\n^anchor'],
  ['quote-anchor','> Quote\n> second\n\n^anchor'],
  ['table-anchor','| A | B |\n|---|---|\n| 1 | 2 |\n\n^anchor'],
  ['list-anchor','- A\n- B\n\n^anchor'],
  ['math-anchor','$$\nx+y\n$$\n\n^anchor'],
];
for(const eol of ['\n','\r\n']) for(const [name,body] of bodies) for(const before of [true,false])
test(`relocate ${name} ${before?'before':'after'} destination ${JSON.stringify(eol)}`,()=>{
  const suffix=before?'':'\n\nOutside.';
  const source=(before?body+'\n\n- Parent\n- Tail':'- Parent\n- Tail'+suffix+'\n\n'+body).replaceAll('\n',eol);
  const m=parseBlocks(source),selected=m.blocks.find(b=>b.parent===null&&b.from===source.indexOf(body.split('\n')[0]));
  assert.ok(selected);
  const nested='  - '+body.replace(/\n([^\n]*)/gu,(_,line)=>'\n'+(line?'    '+line:''));
  const expected=('- Parent\n'+nested+'\n- Tail'+suffix).replaceAll('\n',eol);
  const result=run(m,relocateBlocks(m,[selected],at(m,'Parent'),'inside'));
  assert.equal(result,expected);
  const n=parseBlocks(result),child=n.blocks.find(b=>b.kind==='item'&&b.depth===3);
  assert.ok(child);
  const out=run(n,changeBlockIndent(n,[child],-1));
  assert.equal(out,('- Parent\n'+nested.split('\n').map(l=>l.startsWith('  ')?l.slice(2):l).join('\n')+'\n- Tail'+suffix).replaceAll('\n',eol));
});
for(const delimiter of ['$$','%%']) for(const eol of ['\n','\r\n'])
test(`nested opaque parser preserves boundaries and protected payload ${delimiter} ${JSON.stringify(eol)}`,()=>{
  const source=['- Parent','  - '+delimiter,'    **not emphasis**','','    # not a heading','    '+delimiter,'  - Sibling','- Tail'].join(eol);
  const m=parseBlocks(source),kind=delimiter==='$$'?'KeylineMath':'KeylineComment';
  const found=[];markdownTree(source).iterate({enter(n){if(n.name===kind)found.push([n.from,n.to]);}});
  assert.equal(found.length,1);assert.equal(source.slice(...found[0]).trimEnd().endsWith(delimiter),true);
  assert.equal(inProtectedSyntax(source,source.indexOf('not emphasis')),true);
  assert.equal(inProtectedSyntax(source,source.indexOf('Sibling')),false);
  assert.equal(at(m,'Sibling').depth,3);assert.equal(at(m,'Tail').depth,1);
});
for(const delimiter of ['$$','%%'])
test(`unfinished nested opaque content cannot consume an outside sibling ${delimiter}`,()=>{
  const source='- Parent\n  - '+delimiter+'\n    hidden\n- Tail',m=parseBlocks(source);
  assert.equal(at(m,'Tail').depth,1);
  assert.equal(inProtectedSyntax(source,source.indexOf('Tail')),false);
  assert.equal(changeBlockIndent(m,[at(m,'hidden')],-1),null);
  assert.equal(convertBlocks(m,[at(m,'hidden')],'quote'),null);
});
for(const delimiter of ['$$','%%']) for(const wrapper of ['quote','list','quote-list'])
test(`opaque container ${wrapper} does not parse payload markers or consume adjacent blocks ${delimiter}`,()=>{
  const body=[delimiter,'**not emphasis**','','# not a heading','- not a list',delimiter];
  const wrapped=wrapper==='quote'?body.map(l=>'> '+l).join('\n'):
    wrapper==='list'?'- '+body.join('\n  '):'> - '+body.join('\n>   ');
  const source=wrapped+'\n\nOutside.',m=parseBlocks(source);
  assert.equal(m.blocks.filter(b=>b.kind==='heading').length,0);
  assert.equal(m.blocks.filter(b=>b.kind==='item').length,wrapper==='list'?1:0);
  assert.equal(inProtectedSyntax(source,source.indexOf('not emphasis')),true);
  assert.equal(inProtectedSyntax(source,source.indexOf('Outside')),false);
  assert.equal(at(m,'Outside').kind,'paragraph');
});
test('nested thematic rules are not frontmatter and fenced markers are not math/comments',()=>{
  for(const text of ['- ---\n  x: 1\n  ---','- ```md\n  $$\n  %%\n  ```']) {
    const names=[];markdownTree(text).iterate({enter(n){names.push(n.name);}});
    assert.equal(names.includes('KeylineFrontmatter'),false);
    assert.equal(names.includes('KeylineMath'),false);assert.equal(names.includes('KeylineComment'),false);
  }
});
test('unmodelled repeated detached IDs never relax payload comparison',()=>{
  const m=parseBlocks('Text\n\n^one\n\n^two\n\n- Parent');
  assert.equal(relocateBlocks(m,[m.blocks[0]],at(m,'Parent'),'inside'),null);
});
test('a nested final-item ID travels with its item instead of locking the enclosing list',()=>{
  const m=parseBlocks('- Left\n  - Keep\n  - Payload\n\n    ^anchor\n- Right\n  - Existing\n- Tail');
  const p=relocateBlocks(m,[at(m,'Payload')],at(m,'Existing'),'before');
  const next=run(m,p);
  assert.equal(next,'- Left\n  - Keep\n- Right\n  - Payload\n\n    ^anchor\n  - Existing\n- Tail');
  assert.equal(next.match(/\^anchor/gu).length,1);
  assert.equal(applyBlockEdit(m.text.replace('Payload','Changed'),p),null);
});
