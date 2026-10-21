import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { insertItems, normalizeInsert, insertionEntries, slashAt, makeSnippet, planInsertion } = require("../.test-build/domain/insertion.cjs");
const prefs = normalizeInsert({});
const dates = { today: "2026-10-20", tomorrow: "2026-10-21", yesterday: "2026-10-19", time: "17:40" };
const { planAfterBlock } = require("../.test-build/domain/insertion.cjs");
const { parseBlocks, blockAt } = require("../.test-build/domain/blocks.cjs");
test("wiki insertion preserves a safe selected title and rejects delimiters rather than generating broken links",()=>{
  const value=makeSnippet('wiki','A title','A title',false,dates);
  assert.deepEqual(value,{text:'[[A title]]',from:2,to:9,block:false});
  for(const title of ['A|B','[A]','A\nB','A\rB'])assert.equal(makeSnippet('wiki',title,title,false,dates),null);
});
for (const eol of ["\n", "\r\n"]) for (const source of [
  "Paragraph.", "```js\nconst x = 1;\n```", "> [!note] Title\n> Body", "| A | B |\n|---|---|\n|1|2|"
]) test(`plus inserts outside the complete block: ${source.split("\n")[0]} / ${JSON.stringify(eol)}`, () => {
  const original = source.replace(/\n/gu, eol), text = original + eol + eol + "Tail.";
  const block = blockAt(parseBlocks(text), 0);
  const plan = planAfterBlock(text, block.id, makeSnippet("h2", text, "Heading", false, dates));
  assert.ok(plan);
  const result = text.slice(0, plan.from) + plan.insert + text.slice(plan.to);
  assert.equal(result, original + eol + eol + "## Heading" + eol + eol + "Tail.");
  assert.equal(result.slice(plan.anchor, plan.head), "Heading");
});
for (const kind of ["codeblock", "h3", "task", "table", "quote", "footnote", "today"]) test(`plus retains nested siblings: ${kind}`, () => {
  const text = "- Parent\n  - Child\n    - Grandchild\n  - Next\n- Outside";
  const block = blockAt(parseBlocks(text), text.indexOf("Child"));
  const payload = kind === "codeblock" ? "Code" : kind === "footnote" ? "Footnote text" : "";
  const plan = planAfterBlock(text, block.id, makeSnippet(kind, text, payload, false, dates));
  assert.ok(plan, kind);
  const result = text.slice(0, plan.from) + plan.insert + text.slice(plan.to);
  assert.ok(result.startsWith("- Parent\n  - Child\n    - Grandchild\n  - "));
  assert.ok(result.endsWith("\n  - Next\n- Outside"));
  if (kind === "codeblock") assert.equal(result.slice(plan.anchor, plan.head), "Code");
  if (kind === "footnote") assert.equal(plan.append, "\n\n[^1]: Footnote text");
});
test("plus rejects invalid, locked and structurally merging targets", () => {
  const snippet = makeSnippet("h2", "", "", false, dates);
  for (const text of ["---\nx: 1\n---", "```\nUnclosed", "$$\nx"]) {
    assert.equal(planAfterBlock(text, parseBlocks(text).blocks[0].id, snippet), null);
  }
  assert.equal(planAfterBlock("Note.", "not-a-block", snippet), null);
  assert.equal(planAfterBlock("Note.", parseBlocks("Note.").blocks[0].id, { ...snippet, from: -1 }), null);
  // Changing the bullet style would split its parent list. Do not silently do so.
  const text = "+ A\n+ B";
  assert.equal(planAfterBlock(text, blockAt(parseBlocks(text), 2).id, makeSnippet("task", text, "", false, dates)), null);
});
for (const text of ["/", "/h6", "Before /task", "> /quote", "- /table", "  - /codeblock", "\n/h1", "- item\n  - /task"]) test(`slash triggers without changing input: ${JSON.stringify(text)}`, () => {
  const result = slashAt(text, text.length, prefs);
  assert.ok(result); assert.equal(text.slice(result.from, result.to), "/" + result.query);
});
for (const text of ["user/path", "https://site/", "/usr/bin", "`/h1", "[[/h1", "[a](/h1", "    /code", "```\n/h1", "- item\n  ```\n  /h1", "> ```\n> /h1", "---\nkey: /h1", "$$\n/h1", "%%\n/h1", "<div>\n/h1"]) test(`protected slash context: ${JSON.stringify(text)}`, () => {
  assert.equal(slashAt(text, text.length, prefs), null);
});
test("inline comments and formulas are protected without suppressing later normal prose", () => {
  for (const text of ["Text %% /h1", "> %% /h1", "Text $x + /h1$"]) assert.equal(slashAt(text, text.length, prefs), null, text);
  for (const text of ["Text %% hidden %% /h1", "Text $x$ /h1", "Cost $5. /h1", "Text \\%\\% /h1"]) assert.ok(slashAt(text, text.length, prefs), text);
});
test("slash settings validate triggers, inline mode and disabled state", () => {
  assert.equal(slashAt("Before /task", 12, { ...prefs, inlineSlash: false }), null);
  assert.ok(slashAt("- /task", 7, { ...prefs, inlineSlash: false }));
  assert.equal(slashAt("/", 1, { ...prefs, slash: false }), null);
  assert.ok(slashAt(";h6", 3, { ...prefs, slashTrigger: ";" }));
  for (const trigger of ["", "ab", " ", "@", "[", "\n", "\\"]) assert.equal(normalizeInsert({ slashTrigger: trigger }).slashTrigger, "/");
});
test("menu catalog includes every required template in two languages", () => {
  assert.equal(insertItems.length, 28);
  for (const [id, en, zh, , mode] of insertItems) {
    assert.ok(insertionEntries(prefs, false, en).some(i => i.id === id));
    assert.ok(insertionEntries(prefs, true, zh).some(i => i.id === id));
    if (mode !== "action") assert.ok(makeSnippet(id, "# Demo\n\n## Topic", "", false, dates), id);
  }
});
test("order, visibility and custom commands are normalized without executing anything", () => {
  const p = normalizeInsert({ insertOrder: ["time", "time", "missing", "h2"], hiddenInsert: ["h1", "evil"], customInsert: [
    { command: "editor:toggle-bold", label: "Bold" }, { command: "editor:toggle-bold", label: "Duplicate" }, { command: "eval(x)", label: "No" }
  ] });
  assert.deepEqual(p.insertOrder, ["time", "h2"]); assert.deepEqual(p.hiddenInsert, ["h1"]); assert.equal(p.customInsert.length, 1);
  const menu = insertionEntries(p, false);
  assert.equal(menu[0].id, "time"); assert.equal(menu[1].id, "h2"); assert.ok(!menu.some(e => e.id === "h1"));
  assert.equal(menu.at(-1).command, "editor:toggle-bold");
  assert.ok(insertionEntries(p, false, "", true).some(e => e.id === "h1"));
});
test("date format validation preserves literal printable patterns", () => {
  assert.equal(normalizeInsert({ dateFormat: "DD/MM/YYYY", timeFormat: "HH:mm:ss" }).dateFormat, "DD/MM/YYYY");
  for (const bad of ["", "\n", "x".repeat(81), 123]) assert.equal(normalizeInsert({ dateFormat: bad }).dateFormat, "YYYY-MM-DD");
});
test("code template selects its contents and escapes a nested fence structurally", () => {
  const s = makeSnippet("codeblock", "", "```js\nx\n```", false, dates);
  assert.equal(s.text, "````\n```js\nx\n```\n````");
  assert.equal(s.text.slice(s.from, s.to), "```js\nx\n```");
});
test("TOC excludes code/frontmatter lookalikes and includes H6/setext headings", () => {
  const doc = "---\ntitle: metadata\n---\n\n# Visible\n\n```md\n# Hidden\n```\n\n###### Detail\n\nUnderlined\n---";
  const s = makeSnippet("toc", doc, "", false, dates);
  assert.equal(s.text, "**Table of contents**\n- [[#Visible|Visible]]\n          - [[#Detail|Detail]]\n  - [[#Underlined|Underlined]]");
  assert.equal(makeSnippet("toc", "Only text", "", false, dates), null);
});
test("footnote picks an unused ID and appends a definition", () => {
  const s = makeSnippet("footnote", "Existing [^1]\n\n[^1]: Known", "Two\nlines", false, dates);
  assert.equal(s.text, "[^2]"); assert.equal(s.append, "\n\n[^2]: Two\n    lines");
});
test("inline slash block insertion keeps surrounding prose", () => {
  const text = "Before /h1 after";
  const p = planInsertion(text, 7, 10, makeSnippet("h1", text, "", false, dates));
  const result = text.slice(0, p.from) + p.insert + text.slice(p.to);
  assert.equal(result, "Before \n# \n after");
  assert.equal(p.anchor, 10); assert.equal(p.head, p.anchor);
});
test("block insertion in a nested list repeats continuation indentation, not bullets", () => {
  const text = "- parent\n  - /codeblock";
  const p = planInsertion(text, text.indexOf("/"), text.length, makeSnippet("codeblock", text, "Code", false, dates));
  assert.equal(text.slice(0, p.from) + p.insert, "- parent\n  - ```\n    Code\n    ```");
  assert.equal((text.slice(0, p.from) + p.insert).slice(p.anchor, p.head), "Code");
});
test("quote/list compound continuation is retained for multi-line templates", () => {
  const text = "> - /table";
  const p = planInsertion(text, 4, text.length, makeSnippet("table", text, "", false, dates));
  assert.match(p.insert, /\n> {3}\|/u);
});
test("divider at start must not become frontmatter", () => {
  const p = planInsertion("/rule", 0, 5, makeSnippet("rule", "", "", false, dates));
  assert.equal(p.insert, "***\n");
  assert.notEqual(parseBlocks(p.insert).blocks[0]?.kind, "frontmatter");
  const suffix = planInsertion("/rule Remaining text", 0, 5, makeSnippet("rule", "", "", false, dates));
  assert.equal(suffix.insert, "***\n\n");
});
test("insertion refuses protected spans and invalid offsets", () => {
  const snippet = makeSnippet("h1", "", "", false, dates);
  assert.equal(planInsertion("---\nkey: value\n---", 0, 0, snippet), null);
  assert.equal(planInsertion("a", -1, 1, snippet), null);
  assert.equal(planInsertion("Text\n\n```\nCode\n```", 0, 18, snippet), null);
  assert.equal(planInsertion("Text `code` tail", 0, 12, snippet), null);
});
test("table and web links retain punctuation rather than deleting selected content", () => {
  assert.match(makeSnippet("table", "", "a|b\nc", false, dates).text, /a\\\|b<br>c/u);
  assert.equal(makeSnippet("link", "", "[A] \\ B", false, dates).text, "[\\[A\\] \\\\ B]()");
  assert.equal(makeSnippet("comment", "", "Has %% delimiter", false, dates), null);
  assert.equal(makeSnippet("math", "", "Has $$ delimiter", false, dates), null);
});
test("CRLF insertion preserves line endings and selected placeholder mapping", () => {
  const text = "Before\r\n\r\n/codeblock";
  const p = planInsertion(text, 10, text.length, makeSnippet("codeblock", text, "Code", false, dates));
  const result = text.slice(0, p.from) + p.insert;
  assert.equal(result, "Before\r\n\r\n```\r\nCode\r\n```");
  assert.equal(result.slice(p.anchor, p.head), "Code");
  const foot = planInsertion(text, 10, text.length, makeSnippet("footnote", text, "Footnote text", false, dates));
  assert.equal(foot.append, "\r\n\r\n[^1]: Footnote text");
});
for (const [id, text, caret] of [
  ["h2", "## ", 3], ["task", "- [ ] ", 6], ["codeblock", "```\n\n```", 4],
  ["math", "$$\n\n$$", 3], ["link", "[]()", 1], ["comment", "%%  %%", 3],
  ["callout-note", "> [!note]\n> ", 12], ["rule", "---\n", 4],
  ["table", "|  |  |  |\n| --- | --- | --- |\n|  |  |  |\n|  |  |  |", 2]
]) test(`empty ${id} inserts no placeholder and retains the intended caret`, () => {
  for (const zh of [false, true]) {
    const s = makeSnippet(id, "", "", zh, dates);
    assert.equal(s.text, text); assert.equal(s.from, caret); assert.equal(s.to, caret);
  }
});
