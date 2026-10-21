import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {attachmentName,attachmentLink,isImageName,imageAccept,planAttachmentInsertion}=require('../.test-build/domain/attachments.cjs');
const {parseBlocks}=require('../.test-build/domain/blocks.cjs');
test('image filter uses supported filename extensions, not an untrusted MIME claim',()=>{
  for(const name of ['a.PNG','draw.svg','image.webp','photo.avif'])assert.equal(isImageName(name),true);
  for(const name of ['a.pdf','a.png.exe','png',''])assert.equal(isImageName(name),false);
  assert.ok(imageAccept.includes('.svg'));assert.ok(imageAccept.includes('image/svg+xml'));
});
test('attachment basenames are inert and preserve ordinary names and Unicode',()=>{
  for(const name of ['Report (final).pdf','中文资料.pdf','demo [one].svg'])assert.equal(attachmentName(name),name);
  for(const name of ['../private','C:\\outside.txt','a\u0000b','...','bad.','x|y','a/b']){
    const safe=attachmentName(name);assert.ok(safe);assert.doesNotMatch(safe,/^[.]|[\\/:*?"<>|\x00-\x1f\x7f]|[. ]$/u);
  }
});
for(const [raw,name,expected]of [
  ['[[Assets/Report.pdf]]','Report','[Report](Assets/Report.pdf)'],
  ['[[Report (final).pdf]]','Report (final)','[Report (final)](Report%20%28final%29.pdf)'],
  ['[[../资料/a#b%20.pdf|Shown]]','a#b%20','[Shown](../%E8%B5%84%E6%96%99/a%23b%2520.pdf)'],
  ['[[x.pdf|A [label]]]','x','[A \\[label\\]](x.pdf)'],
  ['[](../Assets/report.pdf)','report','[report](../Assets/report.pdf)'],
  ['[Given](path%20with%20space.pdf)','report','[Given](path%20with%20space.pdf)']
])test(`attachment Markdown preserves host target and safe label: ${raw}`,()=>{
  assert.equal(attachmentLink(raw,name,false,false),expected);
  assert.equal(attachmentLink(raw,name,false,true),'!'+expected);
});
test('image imports keep native wiki/Markdown notation and always embed once',()=>{
  for(const raw of ['[[a.svg]]','[](a.svg)','![alt](a.svg)'])assert.equal(attachmentLink(raw,'a',true,false),'!'+raw.replace(/^!/,''));
  assert.equal(attachmentLink('', 'x',false,false),null);assert.equal(attachmentLink('not a link','x',true,true),null);
});
const apply=(text,plan)=>text.slice(0,plan.from)+plan.insert+text.slice(plan.to);
for(const [name,line]of [
  ['prose','Intro /image tail.'],['quote','> Intro /image tail.'],
  ['nested item','  - Item /image tail.'],['Callout body','> Before /image tail.'],
  ['heading','## Title /image tail.'],['empty quote','> /image'],['empty item','- /image'],
  ['spaces','  /image  '],['blank','/image']
])for(const eol of ['\n','\r\n'])test(`attachment import keeps the complete ${name} line (${JSON.stringify(eol)})`,()=>{
  const text='Before'+eol+eol+line+eol+eol+'After',from=text.indexOf('/image'),to=from+6;
  const links='![[A.svg]]\n![[B.svg]]',plan=planAttachmentInsertion(text,from,to,links);assert.ok(plan);
  const remaining=line.replace('/image','');
  const expected='Before'+eol+eol+remaining+(remaining.trim()?eol:'')+links.replace(/\n/g,eol)+eol+eol+'After';
  assert.equal(apply(text,plan),expected);assert.equal(text.slice(plan.from,plan.to),plan.before);
  assert.equal(expected.slice(0,plan.head).endsWith('![[B.svg]]'),true);assert.equal(plan.anchor,plan.head);
});
test('inline import preserves quote and list sibling ownership, including lazy continuation',()=>{
  for(const text of ['> Quote /image tail.\n\nOutside','- Parent\n  - Item /image tail.\n  - Sibling\n- Outside','> [!note] Demo\n> Body /image tail.\n\nOutside']){
    const from=text.indexOf('/image'),next=apply(text,planAttachmentInsertion(text,from,from+6,'![[A.svg]]'));
    const shape=t=>parseBlocks(t).blocks.map(b=>[b.kind,b.depth]);
    assert.deepEqual(shape(next),shape(text));assert.ok(next.includes(' tail.\n![[A.svg]]'));
  }
});
test('import at document end and a manual caret retains the original suffix',()=>{
  for(const [text,from,to,expected]of [['/image',0,6,'![[A.svg]]'],['Intro /image tail.',6,12,'Intro  tail.\n![[A.svg]]'],['Original sentence.',4,4,'Original sentence.\n![[A.svg]]']]){
    assert.equal(apply(text,planAttachmentInsertion(text,from,to,'![[A.svg]]')),expected);
  }
});
test('attachment planner rejects protected, invalid and cross-line trigger ranges',()=>{
  for(const [text,from,to]of [['```\n/image\n```',4,10],['---\nx: /image\n---',7,13],['a\nb',0,3],['x',-1,0],['x',0,2],['a\r\nb',2,2]])assert.equal(planAttachmentInsertion(text,from,to,'![[A.svg]]'),null);
  assert.equal(planAttachmentInsertion('text',0,0,''),null);
});
