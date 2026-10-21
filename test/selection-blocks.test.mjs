import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { selectionBlockPlan, blockLinkPlan, calloutTypes } = require("../.test-build/domain/selection-blocks.cjs");
const { parseBlocks, blockSelection, applyBlockEdit } = require("../.test-build/domain/blocks.cjs");
const fixture = (text, at = 0) => { const model = parseBlocks(text); return [model, blockSelection(model, at)]; };
for (const type of calloutTypes) test(`selection callout ${type} keeps the entire multiline payload and neighbours`, () => {
  const original = "First **bold**\nsecond 😀\n\nOutside";
  const [m,b] = fixture(original), plan = selectionBlockPlan(m,b,`callout-${type}`);
  assert.ok(plan);
  assert.equal(applyBlockEdit(original, plan), `> [!${type}]\n> First **bold**\n> second 😀\n\nOutside`);
});
test("selection code uses a collision-free fence and preserves CRLF and code indentation", () => {
  const original = "## `inline` and ```literal```\r\n\r\nOutside";
  const [m,b] = fixture(original), plan = selectionBlockPlan(m,b,"code");
  assert.equal(applyBlockEdit(original, plan), "````\r\n`inline` and ```literal```\r\n````\r\n\r\nOutside");
});
test("math converts a complete paragraph but rejects an existing closing delimiter", () => {
  const [m,b] = fixture("x + y\nz");
  assert.equal(applyBlockEdit(m.text,selectionBlockPlan(m,b,"math")), "$$\nx + y\nz\n$$");
  assert.equal(selectionBlockPlan(...fixture("x $$ y"),"math"),null);
});
test("divider retains text and inserts after it rather than deleting the payload", () => {
  const [m,b] = fixture("Keep **everything**\n\nOutside");
  assert.equal(applyBlockEdit(m.text,selectionBlockPlan(m,b,"divider")), "Keep **everything**\n\n---\n\nOutside");
});
for (const text of ["- Parent\n  - Child", "---\nkey: value\n---", "> [!note]\n> Keep", "text ^keep", "```\nopen"])
  test(`unsafe or already structured conversion is unavailable: ${text}`, () => {
    for (const target of ["code","math","divider","callout-note"]) assert.equal(selectionBlockPlan(...fixture(text),target),null);
  });
test("block link retains full file path and uses a unique ID without changing body", () => {
  const [m,b] = fixture("Hello\ncontinued\n\nOutside"), p = blockLinkPlan(m,b,"Projects/Name.md","ki-123");
  assert.equal(p.link,"[[Projects/Name#^ki-123]]");
  assert.equal(applyBlockEdit(m.text,p.edit),"Hello\ncontinued ^ki-123\n\nOutside");
  const next = fixture(applyBlockEdit(m.text,p.edit));
  assert.deepEqual(blockLinkPlan(...next,"Projects/Name.md","ki-new"), {link:p.link,edit:null});
});
test("block links reject duplicate IDs, invalid paths, nested/opaque targets and unsafe generated IDs", () => {
  assert.equal(blockLinkPlan(...fixture("One ^same\n\nTwo ^same"),"Note.md","next"),null);
  assert.equal(blockLinkPlan(...fixture("One\n\nTwo ^taken"),"Note.md","taken"),null);
  for (const file of ["a#b.md","a|b.md","a[b].md","a\nb.md","a.pdf"])
    assert.equal(blockLinkPlan(...fixture("Text"),file,"new"),null);
  assert.equal(blockLinkPlan(...fixture("- List"),"Note.md","new"),null);
  assert.equal(blockLinkPlan(...fixture("Text"),"Note.md","unsafe id"),null);
});
