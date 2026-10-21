import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { structurePresentation, calloutPresentation } = require("../.test-build/domain/structure-presentation.cjs");
// Deliberately over-permissive host fixtures: the independent parser must still
// refuse apparent markers in opaque text and nested quote containers.
function tokens(text) {
  const out = [];
  for (const match of text.matchAll(/>[ \t]*(?:\[![\w-]+\][+-]?[ \t]*)?/gu))
    out.push({from:match.index,to:match.index+match[0].length,name:`formatting_formatting-quote_quote${match[0].includes('[!')?'_hmd-callout':''}`});
  for (const match of text.matchAll(/(?:[-+*]|\d+[.)])(?=[ \t])/gu))
    out.push({from:match.index,to:match.index+match[0].length,name:'formatting_formatting-list_formatting-list-ul'});
  return out;
}
const plan = text => structurePresentation(text,tokens(text));
test("plain quote markers hide without changing authored content or offsets", () => {
  const source = "> First\n>   Next\n>\n> Last", result = plan(source);
  assert.deepEqual(result.quotes.map(r=>source.slice(r.marker.from,r.marker.to)),["> ",">   ",">","> "]);
  assert.deepEqual(result.quotes.map(r=>[r.first,r.last]),[[true,false],[false,false],[false,false],[false,true]]);
  assert.ok(result.quotes.every(r=>r.kind==='quote'&&!r.header));
});
test("callout header starts a separate segment and preserves explicit title", () => {
  const source = "> Before\n> [!warning]- Keep this\n> Content\n> [!note]\n> More", result=plan(source);
  assert.deepEqual(result.quotes.map(r=>r.kind),['quote','callout','callout','callout','callout']);
  assert.ok(result.quotes[0].first&&result.quotes[0].last);
  const first=result.quotes[1];
  assert.equal(source.slice(first.header.from,first.header.to),'[!warning]- ');
  assert.equal(source.slice(first.header.to,first.to),'Keep this');
  assert.equal(first.explicitTitle,true);assert.equal(result.quotes[3].explicitTitle,false);
  assert.ok(result.quotes[2].last&&result.quotes[3].first&&result.quotes[4].last);
});
test("callout token is not hidden unless the host explicitly recognizes it", () => {
  const source='> [!note] literal';
  const result=structurePresentation(source,[{from:0,to:2,name:'formatting-quote'}]);
  assert.equal(result.quotes[0].kind,'quote');assert.equal(result.quotes[0].header,undefined);
});
test("missing, partial and unrelated host tokens never authorise hiding", () => {
  for(const host of [[],[{from:0,to:0,name:'formatting-quote'}],[{from:0,to:99,name:'not-formatting-quote'}]])
    assert.deepEqual(structurePresentation('> Hello',host).quotes,[]);
  assert.deepEqual(structurePresentation('- List',[]).separators,[]);
});
for(const [name,source] of Object.entries({code:'```md\n> [!note]\n- item\n```',indent:'    > quote\n    - item',frontmatter:'---\n> fake\n- fake\n---',math:'$$\n> fake\n- fake\n$$',comment:'%%\n> fake\n- fake\n%%',html:'<div>\n> fake\n- fake\n</div>'}))
  test(`opaque ${name} rejects even falsely confirmed host markers`,()=>assert.deepEqual(plan(source),{quotes:[],separators:[]}));
test("nested quote depths retain native display while list-contained flat quotes are styled", () => {
  const source='> First\n>> Nested\n> Final\n\n- Parent\n  > Child';
  const result=plan(source);
  assert.equal(result.quotes.length,3);assert.ok(result.quotes.every(r=>r.first&&r.last));
  assert.equal(source.slice(result.quotes[2].marker.from,result.quotes[2].marker.to),'> ');
  assert.equal(source.slice(result.quotes[2].from,result.quotes[2].marker.from),'  ');
});
test('deep list Callouts keep list indentation and require native confirmation',()=>{
  const source='- Parent\n  - Child\n\n    > [!warning] Title\n    > Body\n\n  - Next';
  const rows=plan(source).quotes;
  assert.equal(rows.length,2);assert.ok(rows.every(r=>r.kind==='callout'));
  assert.ok(rows[0].first&&rows[1].last);
  for(const row of rows)assert.equal(source.slice(row.from,row.marker.from),'    ');
  assert.equal(source.slice(rows[0].header.to,rows[0].to),'Title');
  assert.deepEqual(structurePresentation(source,[]).quotes,[]);
});
test('list fences and indented code do not become flat quotes even with false host tokens',()=>{
  for(const source of ['- Parent\n\n  ```md\n  > [!note]\n  > Literal\n  ```','- Parent\n\n      > [!note]\n      > Literal'])
    assert.deepEqual(plan(source).quotes,[]);
});
test("quote code indentation and tabs remain in the editor source", () => {
  for(const source of ['>     code','> \tcode','>\tcode']) {
    const row=plan(source).quotes[0];
    assert.equal(source.slice(row.marker.to),source.slice(source.startsWith('> ')?2:1));
  }
});
test("malformed callout remains a normal quote",()=>{
  const result=plan('> [!note unclosed');assert.equal(result.quotes[0].kind,'quote');assert.equal(result.quotes[0].header,undefined);
});
test("list separator uses one real character, preserving custom whitespace and status", () => {
  const source='- One\n  -  Two\n\n12. Three\n\n- [x] Task\n- [?]  Other\n-\tTabbed\n> - Quoted';
  const result=plan(source);
  assert.equal(result.separators.length,7);
  assert.deepEqual(result.separators.map(r=>source.slice(r.from,r.to)),[' ',' ',' ',' ',' ','\t',' ']);
  assert.deepEqual(result.separators.map(r=>r.task),[false,false,false,true,true,false,false]);
  assert.equal(source[result.separators[1].to],' ');assert.equal(source[result.separators[4].to],' ');
});
test("punctuation and separator-free markers are not a list gap",()=>{
  for(const source of ['a - b','-','2.words','---','***'])assert.deepEqual(plan(source).separators,[]);
});
test("CRLF and Unicode keep exact UTF-16 boundaries",()=>{
  const source='> 中文😀\r\n> Next\r\n\r\n- 项目';const result=plan(source);
  assert.deepEqual(result.quotes.map(r=>r.from),[0,8]);
  assert.equal(result.quotes[0].to,6);assert.equal(source.slice(result.separators[0].to),'项目');
});
test("size guard and empty input fail closed",()=>{
  for(const source of ['', 'x'.repeat(2*1024*1024+1)])assert.deepEqual(plan(source),{quotes:[],separators:[]});
});
test("callout titles, aliases and unknown identifiers stay literal data",()=>{
  assert.deepEqual(calloutPresentation('warning',false),{label:'Warning',icon:'alert-triangle',tone:'orange'});
  assert.equal(calloutPresentation('error',true).tone,'red');assert.equal(calloutPresentation('note',true).label,'便签');
  assert.equal(calloutPresentation('custom-type',false).label,'Custom-type');
  for(const zh of [false,true]) {
    assert.equal(calloutPresentation('summary',zh).label,'Summary');
    assert.equal(calloutPresentation('abstract',zh).label,'Abstract');
    assert.equal(calloutPresentation('error',zh).label,'Error');
  }
});
