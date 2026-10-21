import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { analyzeWriting, bracketEdit, warningRange } = require("../.test-build/domain/writing.cjs");
const host = (from, to, kind) => ({ from, to, name: `formatting_formatting-${kind}` });
test("host colour alone never hides an unpaired emphasis marker", () => {
  const text = "**unclosed";
  const a = analyzeWriting(text, [host(0, 2, "strong")]);
  assert.equal(a.hidden.length, 0); assert.deepEqual(a.suspicious, [{ from: 0, to: 2, kind: "emphasis" }]);
});
for (const [text, length, kind] of [["**bold**", 2, "strong"], ["*italics*", 1, "em"], ["~~strike~~", 2, "strikethrough"], ["`code`", 1, "code"]]) test(`paired syntax and host confirmation: ${kind}`, () => {
  assert.equal(analyzeWriting(text, []).hidden.length, 0, "No host confirmation means no hiding");
  const a = analyzeWriting(text, [host(0, length, kind), host(text.length - length, text.length, kind)]);
  assert.deepEqual(a.hidden.map(r => text.slice(r.from, r.to)), [text.slice(0, length), text.slice(0, length)]);
  assert.equal(a.suspicious.length, 0);
});
test("heading separator and valid escape hide without consuming content", () => {
  const a = analyzeWriting("# Title \\*", [host(0, 2, "header"), host(8, 9, "escape")]);
  assert.deepEqual(a.hidden, [{ from: 0, to: 2, kind: "header" }, { from: 8, to: 9, kind: "escape" }]);
});
for (const text of ["---\nname: '**bad'\n---", "```\n**bad\n```", "    **bad", "`**bad`", "> ```\n> **bad\n> ```", "text %% **bad %%", "$x ** y$", "***", "foo__bar", "\\**literal", "[[**Name]]", "[name](https://a/__path)", "<div> **bad\n</div>"]) test(`suspicious scanner respects protected or literal context: ${JSON.stringify(text)}`, () => {
  assert.equal(analyzeWriting(text, []).suspicious.length, 0);
});
test("nested paired delimiters do not create false warnings", () => {
  for (const text of ["***both***", "**bold *italic* bold**", "[**link**](https://example.com)", "中文**加粗**"]) assert.equal(analyzeWriting(text, []).suspicious.length, 0, text);
});
for (const mark of ['*','_']) for (const order of ['strong-first','em-first']) test(`combined ${mark} emphasis accepts the host's ${order} token boundary`, () => {
  const text=mark.repeat(3)+'Both'+mark.repeat(3),end=text.length;
  const tokens=order==='strong-first'
    ? [host(0,2,'strong'),host(2,3,'em'),host(end-3,end-1,'strong'),host(end-1,end,'em')]
    : [host(0,1,'em'),host(1,3,'strong'),host(end-3,end-2,'em'),host(end-2,end,'strong')];
  const a=analyzeWriting(text,tokens),positions=a.hidden.flatMap(r=>Array.from({length:r.to-r.from},(_,i)=>r.from+i));
  assert.deepEqual(positions.sort((a,b)=>a-b),[0,1,2,end-3,end-2,end-1]);assert.equal(a.suspicious.length,0);
});
test('emphasis token union still requires structural pairing and complete host coverage',()=>{
  assert.equal(analyzeWriting('***unclosed',[host(0,2,'strong'),host(2,3,'em')]).hidden.length,0);
  const text='***Both***',a=analyzeWriting(text,[host(0,1,'em'),host(9,10,'em')]);
  assert.ok(a.hidden.every(r=>r.from===0&&r.to===1||r.from===9&&r.to===10));
  assert.equal(analyzeWriting('`***code***`',[host(1,4,'strong'),host(8,11,'em')]).hidden.length,0);
});
test('actual Obsidian combined-token label hides the entire paired triple run',()=>{
  const text='Select ***these words*** and continue.';
  const a=analyzeWriting(text,[{from:7,to:10,name:'em_em_formatting_formatting-strong_strong'},
    {from:10,to:21,name:'em_strong'},{from:21,to:24,name:'em_em_formatting_formatting-strong_strong'}]);
  assert.equal(a.hidden.reduce((sum,r)=>sum+r.to-r.from,0),6);
  assert.equal(a.suspicious.length,0);
});
test("unpaired markers stay visible and are ordered for navigation", () => {
  const text = "bad **one\n\nbad __two\n\nbad ~~three\n\nbad `four";
  assert.deepEqual(analyzeWriting(text, []).suspicious.map(r => text.slice(r.from, r.to)), ["**", "__", "~~", "`"]);
});
test("warning decoration includes a visible glyph without crossing lines or splitting Unicode", () => {
  assert.deepEqual(warningRange("**broken", { from: 0, to: 2 }), { from: 0, to: 3 });
  assert.deepEqual(warningRange("** 😀", { from: 0, to: 2 }), { from: 0, to: 5 });
  assert.deepEqual(warningRange("😀 **", { from: 3, to: 5 }), { from: 0, to: 5 });
  assert.deepEqual(warningRange("**\nnext", { from: 0, to: 2 }), { from: 0, to: 2 });
});
test("large-document scan fails closed without guessing", () => {
  const text = "x".repeat(2 * 1024 * 1024 + 1);
  assert.deepEqual(analyzeWriting(text, []), { hidden: [], suspicious: [] });
  assert.equal(bracketEdit(text, text.length, text.length, "【【"), null);
});
test("long notes use interval indexes without changing outcomes", () => {
  const row = "**good** and **bad\n\n", text = row.repeat(2500), tokens = [];
  for (let at = 0; at < text.length; at += row.length) tokens.push(host(at, at + 2, "strong"), host(at + 6, at + 8, "strong"));
  const start = performance.now(), a = analyzeWriting(text, tokens);
  assert.equal(a.hidden.length, 5000); assert.equal(a.suspicious.length, 2500);
  assert.ok(performance.now() - start < 2500, "A modest document must not require quadratic scanning");
});
test("typed opening brackets normalize together and leave the cursor inside", () => {
  assert.deepEqual(bracketEdit("", 0, 0, "【【"), { from: 0, to: 0, insert: "[[]]", cursor: 2 });
  assert.deepEqual(bracketEdit("Text 【", 6, 6, "【"), { from: 5, to: 6, insert: "[[]]", cursor: 7 });
  assert.deepEqual(bracketEdit("【]]", 1, 1, "【"), { from: 0, to: 1, insert: "[[", cursor: 2 });
});
test("closing pair only acts inside an open wiki link, reusing automatic closers", () => {
  assert.deepEqual(bracketEdit("[[Work】", 7, 7, "】"), { from: 6, to: 7, insert: "]]", cursor: 8 });
  assert.deepEqual(bracketEdit("[[Work】]]", 7, 7, "】"), { from: 6, to: 9, insert: "]]", cursor: 8 });
  assert.equal(bracketEdit("A 】", 3, 3, "】"), null);
});
for (const [text, input] of [["`【", "【"], ["```\n【", "【"], ["---\nkey: 【", "【"], ["\\【", "【"], ["[[Page【", "【"], ["[link](【", "【"], ["Text %% 【", "【"], ["    【", "【"]]) test(`brackets preserve protected input: ${JSON.stringify(text)}`, () => {
  assert.equal(bracketEdit(text, text.length, text.length, input), null);
});
test("single bracket, selected text and pasted content are never rewritten", () => {
  assert.equal(bracketEdit("", 0, 0, "【"), null);
  assert.equal(bracketEdit("Selected", 0, 8, "【【"), null);
  for (const text of ["【【Paste this】】", "Note\n【【Page】】", "ordinary text"]) assert.equal(bracketEdit("", 0, 0, text), null);
});
