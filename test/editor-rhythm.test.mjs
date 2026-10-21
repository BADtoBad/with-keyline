import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { editorRhythm, MAX_RHYTHM_UNITS } = require("../.test-build/domain/editor-rhythm.cjs");

test("source prose has a leading/trailing gap and one gap per source-line boundary", () => {
  const text = "# Heading\n\nFirst line\ncontinued paragraph.\n\nSecond paragraph.";
  const plan = editorRhythm(text);
  assert.equal(plan.lines.length, 6); assert.equal(plan.gaps.length, 7);
  assert.deepEqual(plan.gaps[0], { at: 0, side: -1, before: "heading", after: undefined });
  assert.equal(plan.gaps[1].after, "heading"); assert.equal(plan.gaps[1].before, "paragraph");
  assert.ok(plan.gaps.slice(2, -1).every(gap => gap.direct === "paragraph"));
  assert.equal(plan.gaps.at(-1).at, text.length); assert.equal(plan.gaps.at(-1).side, 1);
});
for (const [name, text] of Object.entries({
  list: "- One\n  - Nested\n- Two", fence: "```js\nconst x = 1;\n\n```", unclosed: "```\nnot prose\n\n",
  properties: "---\ntitle: value\n\n---", table: "| A | B |\n| --- | --- |\n| C | D |", html: "<div>\ninside\n</div>",
  math: "$$\nx\n\n$$", comment: "%%\ninside\n\n%%", reference: "[ref]: https://example.com"
})) test(`no paragraph rhythm inside root ${name}`, () => {
  const result = editorRhythm(text);
  assert.deepEqual(result.lines, []); assert.deepEqual(result.gaps, []);
});
test("blank separators beside protected blocks retain ordinary rhythm", () => {
  const text = "Before\n\n```\ncode\n```\n\nAfter";
  const result = editorRhythm(text), start = text.indexOf("```"), end = text.lastIndexOf("```") + 3;
  assert.equal(result.lines.length, 4);
  assert.ok(!result.gaps.some(gap => gap.at > start && gap.at < end));
});
test("quote line gaps are distinct from paragraph and callout contents", () => {
  const quote = editorRhythm("> First\n> Next\n>\n> Last");
  assert.equal(quote.gaps.filter(gap => gap.direct === "quote").length, 3);
  assert.equal(quote.lines.length, 0);
  const callout = editorRhythm("> [!note] Title\n> Body\n>\n> More");
  assert.equal(callout.gaps.length, 2); assert.equal(callout.lines.length, 0);
});
test('nested quote boundaries end a flat Callout segment and resume quote rhythm',()=>{
  const text='> [!note] Outer\n> Body\n>\n> > [!warning] Inner\n> > Nested\n>\n> End';
  const plan=editorRhythm(text),nested=text.indexOf('> >'),resume=text.indexOf('\n>\n> End')+1;
  assert.equal(plan.gaps.find(g=>g.at===nested)?.after,'paragraph');
  assert.equal(plan.gaps.find(g=>g.at===resume)?.before,'paragraph');
  assert.equal(plan.gaps.find(g=>g.at===text.indexOf('> End'))?.direct,'quote');
  assert.ok(!plan.gaps.some(g=>g.at===text.indexOf('> > Nested')));
  assert.deepEqual(plan.lines,[]);
});
test('list-contained Callout has inert spacing around its blank separators, not within its body',()=>{
  const text='- Parent\n\n  > [!note] List\n  > Body\n  > More\n\n- Next';
  const plan=editorRhythm(text),start=text.indexOf('  >'),end=text.indexOf('\n\n- Next')+1;
  assert.deepEqual(plan.lines.map(l=>l.at),[text.indexOf('\n\n')+1,end]);
  assert.equal(plan.gaps.find(g=>g.at===start)?.before,'paragraph');
  assert.ok(!plan.gaps.some(g=>g.at>start&&g.at<end));
  assert.equal(plan.gaps.find(g=>g.at===end)?.after,'paragraph');
});
test('blank lines inside list code and HTML stay opaque',()=>{
  for(const text of ['- Parent\n\n  ```md\n\n  > literal\n  ```','- Parent\n\n  <script>\n\n  text\n  </script>']) {
    const plan=editorRhythm(text),opaqueStart=text.indexOf('  ');
    assert.ok(!plan.lines.some(l=>l.at>opaqueStart));
    assert.ok(!plan.gaps.some(g=>g.at>opaqueStart));
  }
});
test('quoted code bodies retain their existing Callout container spacing',()=>{
  const text='> [!example]\n> ```md\n> literal\n> ```';
  assert.equal(editorRhythm(text).gaps.length,2);
});
test('literal Callout-looking text in quoted code does not start a decorative Callout',()=>{
  for(const text of ['> ```md\n> [!note]\n> code\n> ```','>     [!note]\n>     code','> <script>\n> [!note]\n> code\n> </script>']) {
    const plan=editorRhythm(text);
    assert.equal(plan.gaps.filter(g=>g.direct==='quote').length,text.split('\n').length-1);
  }
});
test('CRLF and Unicode list Callouts keep exact physical-line boundaries',()=>{
  const text='- 父项😀\r\n\r\n  > [!note]\r\n  > 内容\r\n\r\n- 后项';
  const plan=editorRhythm(text);
  assert.deepEqual(plan.lines.map(l=>l.at),[text.indexOf('\r\n\r\n')+2,text.lastIndexOf('\r\n\r\n')+2]);
  assert.ok(plan.gaps.every(g=>g.at===text.length||g.at===0||text[g.at-1]==='\n'));
});
for(const text of ['- Parent\n  - Child\n![[A.svg]]\n  - Sibling','> Quote\n![[A.svg]]\n> After','> [!note] Demo\n> Body\n![[A.svg]]','- Item\nlazy text\n- Next'])test(`unprefixed lazy continuation has paragraph presentation without changing ownership: ${text}`,()=>{
  const at=text.indexOf('![[A.svg]]')>=0?text.indexOf('![[A.svg]]'):text.indexOf('lazy text');
  const plan=editorRhythm(text);assert.deepEqual(plan.lines,[{at,role:'paragraph'}]);
  assert.equal(plan.gaps.find(g=>g.at===at)?.before,'paragraph');
  assert.ok(plan.gaps.some(g=>g.at>at&&g.after==='paragraph'));
});
test('indented image continuations and quoted/list code are not treated as unprefixed prose',()=>{
  for(const text of ['- Item\n  ![[A.svg]]\n- Next','- Item\n  ```\n  ![[A.svg]]\n  ```','> ```\n> ![[A.svg]]\n> ```'])assert.deepEqual(editorRhythm(text).lines,[]);
});
test("setext heading marker stays part of one atomic heading", () => {
  const plan = editorRhythm("Title\n=====\n\nNext");
  assert.equal(plan.lines.filter(line => line.role === "heading").length, 2);
  assert.ok(!plan.gaps.some(gap => gap.at === 6));
});
test("empty and oversized documents are untouched", () => {
  for (const text of ["", " \n\t", "x".repeat(MAX_RHYTHM_UNITS + 1)]) assert.deepEqual(editorRhythm(text), { lines: [], gaps: [] });
});
test("CRLF, Unicode and a trailing blank line use exact UTF-16 source offsets", () => {
  const text = "# 中文😀\r\n\r\n正文\r\n";
  const plan = editorRhythm(text);
  assert.deepEqual(plan.lines.map(line => line.at), [0, 8, 10, 14]);
  assert.ok(plan.gaps.every(gap => gap.at <= text.length));
});
for(const ending of ['\n','\r\n'])for(const checked of [' ','x'])test(`task-to-prose spacing survives the first character: ${JSON.stringify(ending)} ${checked}`,()=>{
  const prefix=`- [${checked}] First${ending}- [ ] Second${ending}`,at=prefix.length;
  for(const body of ['', 'a', '任务', '中文😀', '`inline`', '**bold**']){
    const plan=editorRhythm(prefix+body);
    assert.ok(plan.lines.some(l=>l.at===at&&l.role==='paragraph'));
    assert.equal(plan.gaps.find(g=>g.at===at&&g.side===-1)?.before,'paragraph');
  }
});
