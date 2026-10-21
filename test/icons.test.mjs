import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { identifyFile, iconKinds, kindIdentity, cleanIconChoice, cleanIconRules, iconChoice, setIconChoice, resolveIdentity, identityResolver, iconTintCss, renameIconRules } =
  require("../.test-build/domain/icons.cjs");
const { decodePreferences, writablePreferences } = require("../.test-build/domain/preferences.cjs");
for (const [file, category] of [
  ["Folder.with.md/noextension", "other"], ["Clip.MOV", "video"], ["App.tsx", "code"], ["settings.YAML", "code"],
  ["Backup.TAR.gz", "archive"], ["sound.opus", "audio"], ["image.heic", "image"]
]) test(`extended format identity: ${file}`, () => assert.equal(identifyFile(file).category, category));
for (const [category, extensions] of Object.entries({
  image: ['heif','ico','tif','tiff'], video: ['ogv'], code: ['sql'],
  audio: ['aif'], other: ['', 'md.']
})) for (const ext of extensions) test(`previous and additional file type: ${ext || 'extensionless'}`, () => {
  for (const suffix of [ext, ext.toUpperCase()]) assert.equal(identifyFile(`Folder.md/File${suffix ? '.'+suffix : ''}`).category, category);
});
test('leading-dot names without a basename are not inferred to be typed documents',()=>{
  for(const filename of ['.md','.pdf','.sql','Folder/.heif'])assert.equal(identifyFile(filename).category,'other');
  assert.equal(identifyFile('.draft.md').category,'note');
});
test("folders resolve independently from their filename extension and expansion", () => {
  assert.deepEqual(identifyFile("Files.pdf", true), { icon: "keyline-folder", category: "folder", color: "gray" });
  assert.equal(identifyFile("Files.pdf", true, true).icon, "keyline-folder-open");
});
test("default identities retain the accepted library and type palette, not replacement Lucide shapes", () => {
  const mapping = { note: ["keyline-file-text", "blue"], document: ["keyline-file-text", "red"],
    book: ["keyline-file-text", "amber"], image: ["keyline-file-image", "green"],
    other: ["keyline-file-text", "gray"], folder: ["keyline-folder", "gray"],
    audio: ["file-audio", "purple"], video: ["file-video", "pink"], canvas: ["layout-dashboard", "cyan"],
    code: ["file-code", "blue"], archive: ["file-archive", "orange"] };
  for (const [kind, [icon, color]] of Object.entries(mapping)) assert.deepEqual(kindIdentity(kind), { icon, color, category: kind });
  assert.deepEqual(cleanIconChoice({ tint: "yellow", glyph: "file-text" }), { tint: "yellow", glyph: "file-text" });
  assert.equal(iconTintCss("amber"), "var(--keyline-next-identity-amber)");
});
for (const kind of iconKinds) test(`type defaults and file choices resolve independently: ${kind}`, () => {
  const paths = { note: "A.md", document: "A.pdf", book: "A.epub", canvas: "A.canvas", audio: "A.wav", image: "A.svg",
    video: "A.mp4", code: "A.json", archive: "A.zip", other: "A.abc", folder: "A" };
  const filename = paths[kind], folder = kind === "folder";
  let rules = setIconChoice([], "type", kind, { glyph: "star", tint: "red" });
  rules = setIconChoice(rules, "path", filename, { tint: "#123456" });
  assert.deepEqual(resolveIdentity(filename, rules, false, folder), { icon: "star", color: "#123456", category: kind });
  assert.equal(resolveIdentity(filename, rules, true, folder).color, "gray");
  assert.equal(resolveIdentity(filename, rules, false, folder).color, "#123456");
  rules = setIconChoice(rules, "path", filename, {});
  assert.equal(resolveIdentity(filename, rules, false, folder).color, "red");
  rules = setIconChoice(rules, "type", kind, {});
  assert.deepEqual(resolveIdentity(filename, rules, false, folder), kindIdentity(kind));
});
test("normalization is immutable, deduplicated and rejects arbitrary CSS/SVG/path payloads", () => {
  const raw = [
    { scope: "path", key: "Safe.md", glyph: "star", tint: "#AABBCC" },
    { scope: "path", key: "Safe.md", tint: "BLUE" },
    { scope: "type", key: "unsupported", glyph: "star" },
    ...["", "/absolute", "../outside", "a/../b", "a//b", "a\\b", "a\nb"].map(key => ({ scope: "path", key, glyph: "star" })),
    { scope: "path", key: "__proto__", glyph: "star" },
    { scope: "path", key: "Injection.md", glyph: "<svg>", tint: "url(https://bad.test)" }
  ];
  const before = JSON.stringify(raw), value = cleanIconRules(raw);
  assert.deepEqual(value, [{ scope: "path", key: "Safe.md", tint: "blue" }, { scope: "path", key: "__proto__", glyph: "star" }]);
  assert.equal(JSON.stringify(raw), before);
  for (const unsafe of [null, [], "red", { glyph: "../star", tint: "var(--x)" }, { glyph: "a".repeat(101), tint: "#bad" }])
    assert.deepEqual(cleanIconChoice(unsafe), {});
  assert.equal(iconTintCss("red;display:none"), "var(--text-muted)");
  assert.equal(iconTintCss("#AABBCC"), "#aabbcc");
});
test("missing or malformed stored rules leave clean defaults without mutating input", () => {
  for (const iconRules of [null, {}, "bad", [null], [{ scope: "path", key: "A.md" }]])
    assert.deepEqual(decodePreferences({ iconRules }).iconRules, []);
  assert.deepEqual(decodePreferences({ fileIcons: false, iconRules: [{ scope: "path", key: "A.md", glyph: "star" }] }).iconRules,
    [{ scope: "path", key: "A.md", glyph: "star" }]);
});
test("folder rename moves only descendants, including Unicode, without changing type rules", () => {
  const rules = [{ scope: "path", key: "A", glyph: "star" }, { scope: "path", key: "A/中文🐦.md", tint: "green" },
    { scope: "path", key: "AB/Note.md", tint: "red" }, { scope: "type", key: "note", glyph: "book" }];
  const before = JSON.stringify(rules), result = renameIconRules(rules, "A", "B/C");
  assert.equal(result.conflict, false);
  assert.deepEqual(result.rules.map(r => r.key), ["B/C", "B/C/中文🐦.md", "AB/Note.md", "note"]);
  assert.equal(JSON.stringify(rules), before);
});
test("rename collisions retain all choices instead of overwriting a stale destination", () => {
  const rules = [{ scope: "path", key: "A/Note.md", glyph: "star" }, { scope: "path", key: "B/Note.md", tint: "red" }];
  const result = renameIconRules(rules, "A", "B");
  assert.equal(result.conflict, true); assert.deepEqual(result.rules, rules);
});
test("one changed choice retains unrelated and missing-file choices", () => {
  const rules = [{ scope: "path", key: "Missing.md", glyph: "star" }, { scope: "type", key: "note", tint: "red" }];
  const next = setIconChoice(rules, "path", "New.md", { glyph: "heart" });
  assert.deepEqual(next.slice(0, 2), rules);
  assert.deepEqual(iconChoice(next, "path", "New.md"), { glyph: "heart" });
  assert.equal(rules.length, 2);
});
test("large icon maps are indexed once, and oversized stored maps stay read-only", () => {
  const rules = Array.from({ length: 10000 }, (_, i) => ({ scope: "path", key: `Notes/${i}.md`, glyph: "star" }));
  const resolve = identityResolver(rules);
  for (let i = 0; i < 10000; i++) assert.equal(resolve(`Notes/${i}.md`).icon, "star");
  assert.equal(writablePreferences({ schema: 1, iconRules: rules }), true);
  rules.push({ scope: "path", key: "Notes/extra.md", glyph: "star" });
  assert.equal(writablePreferences({ schema: 1, iconRules: rules }), false);
});
