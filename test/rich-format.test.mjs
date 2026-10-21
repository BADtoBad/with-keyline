import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { colorSelection, selectionInk, inkStyle, tones, externalDestination, externalLinkEdit, selectedLink, unlinkSelection } =
  require("../.test-build/domain/rich-format.cjs");
const apply = (text, plan) => { assert.ok(plan); return text.slice(0, plan.from) + plan.insert + text.slice(plan.to); };
for (const tone of tones) for (const key of ["text", "background"]) test(`colour ${key}/${tone} preserves selection and source neighbours`, () => {
  const text = "before 🐦中文 after", plan = colorSelection(text, 7, 11, { [key]: tone }), next = apply(text, plan);
  assert.equal(next.slice(plan.anchor, plan.head), "🐦中文");
  assert.ok(next.startsWith("before <span data-keyline-color=")); assert.ok(next.endsWith("</span> after"));
  assert.equal(selectionInk(next, plan.anchor, plan.head)[key], tone);
});
test("foreground and background can combine, change independently, then unwrap", () => {
  const original = "Text", blue = colorSelection(original, 0, 4, { text: "blue" }), value = apply(original, blue);
  const yellow = colorSelection(value, blue.anchor, blue.head, { background: "yellow" }), both = apply(value, yellow);
  assert.deepEqual(selectionInk(both, yellow.anchor, yellow.head), { text: "blue", background: "yellow" });
  assert.equal(both.match(/<span /gu).length, 1);
  const noText = colorSelection(both, yellow.anchor, yellow.head, { text: "default" }), background = apply(both, noText);
  assert.deepEqual(selectionInk(background, noText.anchor, noText.head), { text: "default", background: "yellow" });
  const clear = colorSelection(background, noText.anchor, noText.head, { background: "default" });
  assert.equal(apply(background, clear), original);
});
test("partial recolour splits runs without changing the colours of neighbours", () => {
  const blue = colorSelection("one two three", 0, 13, { text: "blue" }), text = apply("one two three", blue);
  const red = colorSelection(text, blue.anchor + 4, blue.anchor + 7, { text: "red" }), result = apply(text, red);
  assert.equal(result.slice(red.anchor, red.head), "two");
  assert.equal(result.match(/data-keyline-color="blue:default"/gu).length, 2);
  assert.equal(result.match(/data-keyline-color="red:default"/gu).length, 1);
  assert.equal(result.replace(/<[^>]+>/gu, ""), "one two three");
});
test("whole generated wrapper selection supports reset", () => {
  const plan = colorSelection("Text", 0, 4, { text: "purple" }), value = apply("Text", plan);
  assert.equal(apply(value, colorSelection(value, 0, value.length, { text: "default" })), "Text");
});
test("default never unwraps foreign HTML, legacy wrappers or changed inline styles", () => {
  for (const open of ['<span style="color: red;">', '<span data-nmg-color="red-text" style="color: var(--color-red);">',
    '<span data-keyline-color="red:default" style="color: tomato;">']) {
    const value = open + "Text</span>";
    assert.equal(colorSelection(value, open.length, open.length + 4, { text: "default" }), null);
  }
});
for (const value of ["javascript:red", "</span><script>", null, {}, "BLUE"]) test(`unknown colour cannot enter generated markup: ${JSON.stringify(value)}`, () =>
  assert.equal(colorSelection("Text", 0, 4, { text: value }), null));
for (const input of ["```\ncode\n```", "---\nname: test\n---", "`inline code`", "$math$", "%%comment%%"]) test(`protected colour context: ${input}`, () =>
  assert.equal(colorSelection(input, 0, input.length, { text: "red" }), null));
test("empty, newline, oversized and invalid selection colours are ignored", () => {
  for (const [text, from, to] of [["", 0, 0], ["  ", 0, 2], ["A\nB", 0, 3], ["Text", -1, 3], ["Text", 0, 5],
    ["x".repeat(16001), 0, 16001]]) assert.equal(colorSelection(text, from, to, { text: "blue" }), null);
});
for (const url of ["javascript:alert(1)", "data:text/html,x", "file:///tmp/a", "https://user:pass@host.test", "https://x.test/a\nb", "mailto:", "just text"])
  test(`reject unsafe/incomplete external destination: ${url}`, () => assert.equal(externalDestination(url), null));
for (const url of ["https://example.com/", "http://localhost/", "mailto:hello@example.com", "https://example.com/path?q=x#part"])
  test(`allow explicit external destination: ${url}`, () => assert.equal(externalDestination(url), url));
test("external link preserves formatted label, escapes brackets and selects it", () => {
  const input = "before **[label]** after", plan = externalLinkEdit(input, 7, 18, "https://x.test/a(b)");
  const output = apply(input, plan);
  assert.equal(output, "before [**\\[label\\]**](<https://x.test/a(b)>) after");
  assert.equal(output.slice(plan.anchor, plan.head), "**\\[label\\]**");
});
test("editing a selected portion of a link preserves its full label and title", () => {
  const input = 'before [full label](https://x.test/a "Keep title") after', start = input.indexOf("label");
  const output = apply(input, externalLinkEdit(input, start, start + 5, "https://new.test/"));
  assert.equal(output, 'before [full label](<https://new.test/> "Keep title") after');
});
test("wiki link aliases can be changed to URL links or unlinked", () => {
  const input = "See [[folder/Page|中文别名]] now", start = input.indexOf("中文");
  assert.equal(selectedLink(input, start, start + 4).destination, "folder/Page");
  assert.equal(apply(input, unlinkSelection(input, start, start + 4)), "See 中文别名 now");
  assert.equal(apply(input, externalLinkEdit(input, start, start + 4, "https://x.test/")), "See [中文别名](<https://x.test/>) now");
});
test("whole links can be unwrapped, while images, escapes, code and reference links are left alone", () => {
  const good = "[label](https://x.test/)";
  assert.equal(apply(good, unlinkSelection(good, 0, good.length)), "label");
  for (const text of ["![label](https://x.test/)", "![[Page|label]]", "\\[[Page|label]]", "`[label](https://x.test/)`", "[label][id]"]) {
    const from = text.indexOf("label"); assert.equal(unlinkSelection(text, from, from + 5), null, text);
  }
});
test("link insertion refuses selected links that would create nested syntax", () => {
  const input = "before [label](https://x.test/) after";
  assert.equal(externalLinkEdit(input, 0, input.length, "https://new.test/"), null);
});
test("inline edits refuse partial delimiters, destinations and embedded links", () => {
  for (const [input, selected] of [
    ["before **bold** after", "*bold"], ["before ~~strike~~ after", "~strike"],
    ["[label](https://example.com/)", "example"], ["[[Folder/Page|Alias]]", "Alias"],
    ["![caption](https://example.com/)", "caption"], ["![[Photo|caption]]", "caption"],
    ["<https://example.com/>", "example"], ["\\*literal", "*literal"]
  ]) {
    const from = input.indexOf(selected), to = from + selected.length;
    assert.equal(colorSelection(input, from, to, { text: "red" }), null, input);
    // Wiki aliases are intentionally eligible for changing their entire link.
    if (input.startsWith("[[")) continue;
    assert.equal(externalLinkEdit(input, from, to, "https://new.test/"), null, input);
  }
});
test("whole emphasis and link constructs or interior Markdown label text stay eligible for colour", () => {
  for (const [input, selected] of [
    ["**bold**", "**bold**"], ["**bold**", "old"], ["[label](https://x.test/)", "label"],
    ["[[Folder/Page|Alias]]", "[[Folder/Page|Alias]]"]
  ]) {
    const from = input.indexOf(selected), plan = colorSelection(input, from, from + selected.length, { text: "blue" });
    assert.ok(plan, input); assert.equal(apply(input, plan).slice(plan.anchor, plan.head), selected);
  }
});
