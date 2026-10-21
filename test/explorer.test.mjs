import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { availableNotePath } = require("../.test-build/domain/explorer.cjs");
for (const parent of ["", "/", "Notes", "项目/资料🐦"]) test(`new-note names preserve the exact parent: ${parent || "(empty root)"}`, () => {
  const prefix = parent === "/" || parent === "" ? "" : parent + "/";
  assert.equal(availableNotePath(parent, false, p => [prefix + "Untitled.md", prefix + "Untitled 1.md"].includes(p)), prefix + "Untitled 2.md");
  assert.equal(availableNotePath(parent, true, () => false), prefix + "未命名.md");
});
test("invalid or full destinations cannot generate a note path", () => {
  for (const parent of ["../Elsewhere", "/outside", "a//b", "a\\b", "a\nb"])
    assert.equal(availableNotePath(parent, false, () => false), null);
  let count = 0; assert.equal(availableNotePath("Full", false, () => { count++; return true; }), null);
  assert.equal(count, 10000);
});
function fixture() {
  const notices = [], writes = [], opened = [], files = new Map();
  class TFolder { constructor(path) { this.path = path; } }
  const folder = new TFolder("Notes"), root = new TFolder("/");
  files.set("Notes", folder);
  const module = { exports: {} };
  vm.runInNewContext(readFileSync(new URL("../.test-build/platform/explorer.cjs", import.meta.url), "utf8"), {
    module, exports: module.exports, require: name => {
      assert.equal(name, "obsidian"); return { TFolder, Notice: class { constructor(text) { notices.push(text); } } };
    }, setTimeout, clearTimeout
  });
  const state = { fail: false, openFail: false, createHook: undefined };
  const owner = { zh: false, preferences: { fileNavigation: true }, app: {
    vault: { getRoot: () => root, getAbstractFileByPath: path => files.get(path) ?? null,
      async create(path, text) {
        writes.push({ path, text }); if (state.createHook) await state.createHook(path);
        if (state.fail || files.has(path)) throw Error("Fixture failure or collision");
        const file = { path }; files.set(path, file); return file;
      } },
    workspace: { getLeaf: () => ({ openFile: async f => { if (state.openFail) throw Error("Cannot open"); opened.push(f.path); } }) }
  } };
  const controller = new module.exports.ExplorerActions(owner);
  return { owner, controller, state, folder, root, files, writes, opened, notices };
}
test("explicit folder creation skips existing names without modifying them", async () => {
  const f = fixture(), existing = { path: "Notes/Untitled.md", text: "Keep" }; f.files.set(existing.path, existing);
  await f.controller.createNote(f.folder);
  assert.equal(f.files.get(existing.path), existing);
  assert.deepEqual(f.writes, [{ path: "Notes/Untitled 1.md", text: "" }]);
  assert.deepEqual(f.opened, ["Notes/Untitled 1.md"]);
});
for (const change of ["removed", "replaced", "disabled", "disposed"]) test(`no creation when destination/lifecycle is ${change}`, async () => {
  const f = fixture();
  if (change === "removed") f.files.delete("Notes");
  if (change === "replaced") f.files.set("Notes", { path: "Notes" });
  if (change === "disabled") f.owner.preferences.fileNavigation = false;
  if (change === "disposed") f.controller.dispose();
  await f.controller.createNote(f.folder); assert.equal(f.writes.length, 0);
});
test("same-folder rapid clicks share one in-flight operation", async () => {
  const f = fixture(); let release;
  f.state.createHook = () => new Promise(r => { release = r; });
  const first = f.controller.createNote(f.folder), second = f.controller.createNote(f.folder);
  assert.equal(f.writes.length, 1); release(); await Promise.all([first, second]); assert.equal(f.opened.length, 1);
});
test("a creation race reports failure and never retries or overwrites", async () => {
  const f = fixture(), external = { text: "External" };
  f.state.createHook = path => f.files.set(path, external);
  await f.controller.createNote(f.folder);
  assert.equal(f.writes.length, 1); assert.equal(f.files.get("Notes/Untitled.md"), external);
  assert.equal(f.opened.length, 0); assert.equal(f.notices.length, 1);
});
test("storage failure can be explicitly retried after the busy guard releases", async () => {
  const f = fixture(); f.state.fail = true; await f.controller.createNote(f.folder);
  assert.equal(f.notices.length, 1); assert.equal(f.files.has("Notes/Untitled.md"), false);
  f.state.fail = false; await f.controller.createNote(f.folder); assert.equal(f.opened.length, 1);
});
for (const change of ["unload", "folderRename", "openFailure"]) test(`a created file is retained after ${change}`, async () => {
  const f = fixture();
  f.state.createHook = () => {
    if (change === "unload") f.controller.dispose();
    if (change === "folderRename") f.folder.path = "Moved";
    if (change === "openFailure") f.state.openFail = true;
  };
  await f.controller.createNote(f.folder);
  assert.equal(f.files.has("Notes/Untitled.md"), true); assert.equal(f.opened.length, 0);
  assert.equal(f.notices.length, change === "unload" ? 0 : 1);
});
test("Vault-root note creation does not prepend an absolute path", async () => {
  const f = fixture(); f.owner.zh = true; await f.controller.createNote(f.root);
  assert.deepEqual(f.opened, ["未命名.md"]);
});
