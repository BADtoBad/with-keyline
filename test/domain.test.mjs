import { createRequire } from "node:module";
import assert from "node:assert/strict";
import test from "node:test";
const require = createRequire(import.meta.url);
const { mentionAt, mentionSessionAt, dateChoices, dateText, suggestions, protectedOffset, insideFence, mentionNavigation } = require("../.test-build/domain/mentions.cjs");
const { decodePreferences, defaults, writablePreferences } = require("../.test-build/domain/preferences.cjs");
const { identifyFile } = require("../.test-build/domain/icons.cjs");
const { inlineEdit } = require("../.test-build/domain/format.cjs");

for (const text of ["@", " @", "Hello @Plan", "（@今日", "- @Research notes", "🐦 @Ideas",
  "家搜到家哦@", "提到@任务", "这是正文。@任务", "下一步：@今天", "- 中文@任务", "- [ ] 中文@任务", "𠮷@任务"]) {
  test(`literal trigger: ${text}`, () => {
    const result = mentionAt(text, text.length);
    assert.ok(result);
    assert.equal(text.slice(result.start, result.end), "@" + result.query);
  });
}
for (const text of ["name@example.com", "user+tag@", "foo@", "http://@", "\\@", "`@today", "[[@Page", "[site]( @site", "    @code", "@@team", "@example.com", "@ bad", "a@中文",
  "`中文@任务", "[[中文@任务", "[标题](中文@任务", "    中文@任务", "中文\\@任务", "中文name@example.com"]) {
  test(`do not hijack: ${text}`, () => assert.equal(mentionAt(text, text.length), null));
}
test("invalid cursor and overlong query are ignored", () => {
  for (const pos of [-1, 1.5, 100]) assert.equal(mentionAt("@", pos), null);
  assert.equal(mentionAt("@" + "x".repeat(81), 82), null);
  assert.deepEqual(mentionAt("@one after", 4), { start: 0, end: 4, query: "one" });
});
test('active mention query is literal continued text, distinct from initial trigger protection',()=>{
  for(const query of [' 任务', 'Release.v2', 'some more text', '`example`', '（继续）', 'x'.repeat(120)]){
    const text='正文@'+query;
    assert.deepEqual(mentionSessionAt(text,text.length,2),{start:2,end:text.length,query});
  }
  for(const text of ['正文@\n下一行','正文@@other','正文@[link','正文@done]','正文@'+'x'.repeat(121)])assert.equal(mentionSessionAt(text,text.length,2),null);
  assert.equal(mentionSessionAt('正文@任务',2,2),null);
});
test("closed inline code and complete wiki links no longer suppress a later trigger", () => {
  for (const text of ["`ok` @", "[[Page]] @", "[link](path) @"]) assert.ok(mentionAt(text, text.length));
});
test("current-buffer fenced code is excluded even without metadata", () => {
  assert.equal(insideFence(["```ts", "@"]), true);
  assert.equal(insideFence(["~~~~md", "```", "@"]), true);
  assert.equal(insideFence(["~~~~", "~~~", "@"]), true);
  assert.equal(insideFence(["```", "```", "@"]), false);
  assert.equal(insideFence(["```", "``` not a closing fence", "@"]), true);
});
test("cached protected offsets include boundaries", () => {
  const ranges = [{ start: 5, end: 20 }];
  assert.equal(protectedOffset(5, ranges), true);
  assert.equal(protectedOffset(20, ranges), true);
  assert.equal(protectedOffset(21, ranges), false);
});
for (const [input, next, previous] of [
  [new Date(2024, 1, 28, 13, 4), "2024-02-29", "2024-02-27"],
  [new Date(2026, 11, 31, 23, 59), "2027-01-01", "2026-12-30"],
  [new Date(2026, 0, 1), "2026-01-02", "2025-12-31"]
]) test(`calendar arithmetic ${dateText(input)}`, () => {
  const original = input.getTime();
  const choices = dateChoices(input, false);
  assert.equal(choices[1].insert, next);
  assert.equal(choices[2].insert, previous);
  assert.equal(input.getTime(), original);
  assert.match(choices[3].insert, /^\d{2}:\d{2}$/);
});
test("suggestions put dates first, preserve duplicate titles with distinct paths, limit results", () => {
  const pages = [{ name: "Plan", path: "Work/Plan.md" }, { name: "Plan", path: "Home/Plan.md" }];
  const list = suggestions("", pages, new Date(2026, 9, 20), true);
  assert.equal(list[0].label, "今天");
  assert.deepEqual(list.slice(0, 4).map(i => i.kind), ["date", "date", "date", "date"]);
  assert.deepEqual(suggestions("plan", pages, new Date(), false).map(i => i.path), ["Home/Plan.md", "Work/Plan.md"]);
  assert.equal(suggestions("", Array.from({ length: 100 }, (_, n) => ({ path: `${n}.md`, name: String(n) })), new Date(), false).length, 16);
  assert.equal(suggestions("明天", pages, new Date(), true)[0].key, "tomorrow");
});
test("passive mention navigation never implies a choice until an arrow is pressed", () => {
  assert.equal(mentionNavigation(-1, 4, "Enter"), -1);
  assert.equal(mentionNavigation(-1, 4, "ArrowDown"), 0);
  assert.equal(mentionNavigation(-1, 4, "ArrowUp"), 3);
  assert.equal(mentionNavigation(3, 4, "ArrowDown"), 0);
  assert.equal(mentionNavigation(0, 4, "ArrowUp"), 3);
  assert.equal(mentionNavigation(-1, 0, "ArrowDown"), -1);
});
test("mention ranking preserves exact titles, recent pages, multilingual aliases and multiword filtering", () => {
  const pages = [{name:"Plan other",path:"Work/Plan other.md",modified:30},{name:"Plan",path:"Home/Plan.md",modified:10},{name:"Plan",path:"Work/Plan.md",modified:20}];
  assert.deepEqual(suggestions("plan", pages, new Date(), false).filter(c=>c.kind==='page').map(c=>c.path), ["Work/Plan.md","Home/Plan.md","Work/Plan other.md"]);
  assert.equal(suggestions("Work other", pages, new Date(), false)[0].path, "Work/Plan other.md");
  assert.equal(suggestions("明日",[],new Date(),false)[0].key,"tomorrow");
  assert.equal(suggestions("time",[],new Date(),true)[0].key,"now");
  assert.equal(suggestions("",pages,new Date(),false).filter(c=>c.kind==='page')[0].path,"Work/Plan other.md");
});
test("preferences validate primitives and do not overwrite source objects", () => {
  assert.deepEqual(decodePreferences(null), defaults);
  assert.deepEqual(decodePreferences({ mentions: "false", fileIcons: 1, language: "de" }), defaults);
  const source = { schema: 1, mentions: false, fileIcons: false, language: "zh", unrelated: "keep" };
  const copy = JSON.stringify(source);
  assert.deepEqual(decodePreferences(source), { ...defaults, schema: 1, mentions: false, fileIcons: false, language: "zh" });
  assert.equal(JSON.stringify(source), copy);
  for (const raw of [3, "text", [], { schema: 2 }]) assert.equal(writablePreferences(raw), false);
  for (const raw of [null, {}, { schema: 1 }]) assert.equal(writablePreferences(raw), true);
});
test("block handle preferences retain conservative defaults and bounded delays", () => {
  assert.equal(defaults.blockHandles, true); assert.equal(defaults.handleSide, "left");
  assert.equal(defaults.handlePinned, false); assert.equal(defaults.handleFold, false);
  assert.equal(defaults.handlePlus, true); assert.equal(defaults.snapSelection, true);
  for (const invalid of [NaN, Infinity, "0", null, {}]) {
    const p = decodePreferences({ handleHoverDelay: invalid, handleHideDelay: invalid, handlePinned: invalid, handleSide: invalid });
    assert.equal(p.handleHoverDelay, 90); assert.equal(p.handleHideDelay, 260);
    assert.equal(p.handlePinned, false); assert.equal(p.handleSide, "left");
  }
  const p = decodePreferences({ handleHoverDelay: -1, handleHideDelay: 9000, handleSide: "right", handleFold: true });
  assert.equal(p.handleHoverDelay, 0); assert.equal(p.handleHideDelay, 1500);
  assert.equal(p.handleSide, "right"); assert.equal(p.handleFold, true);
});
for (const [file, category] of [
  ["Guide.md", "note"], ["Research.PDF", "document"], ["Book.EPUB", "book"],
  ["Sound.WAV", "audio"], ["Map.canvas", "canvas"], ["Picture.SVG", "image"], ["other.xyz", "other"]
]) test(`identity ${file}`, () => assert.equal(identifyFile(file).category, category));
for (const [style, marked] of [["bold", "**text**"], ["italic", "*text*"], ["strike", "~~text~~"], ["highlight", "==text=="]]) {
  test(`one reversible inline edit: ${style}`, () => {
    assert.equal(inlineEdit("text", style).text, marked);
    assert.equal(inlineEdit(marked, style).text, "text");
    assert.equal(inlineEdit("  text ", style).text, "  " + marked + " ");
  });
}
test("formatting rejects empty/multiline and protects code delimiters", () => {
  for (const text of ["", "   ", "two\nlines", "two\rlines"]) assert.equal(inlineEdit(text, "bold"), null);
  assert.equal(inlineEdit("**bold**", "italic").text, "***bold***");
  assert.equal(inlineEdit("a`b", "code").text, "``a`b``");
  assert.equal(inlineEdit("`tick`", "code").text, "`` `tick` ``");
});
