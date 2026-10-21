import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
function setup() {
  const dialogs = [], notices = [], saved = [];
  class TFolder { constructor(path) { this.path = path; } }
  class Modal { open() { dialogs.push(this); } close() { this.closed = true; this.onClose?.(); } }
  const module = { exports: {} };
  const host = { TFolder, Modal, Notice: class { constructor(message) { notices.push(message); } },
    getIconIds: () => ["lucide-star", "lucide-file-text", "folder", "star", "<svg>"] };
  vm.runInNewContext(readFileSync(new URL("../.test-build/platform/icon-editor.cjs", import.meta.url), "utf8"), {
    module, exports: module.exports, require: name => { assert.equal(name, "obsidian"); return host; }, console
  });
  const state = { present: true, blocked: false };
  const file = { path: "File.md" }, folder = new TFolder("Folder");
  const owner = { app: { plugins: { getPlugin: () => state.blocked ? {} : null },
    vault: { getAbstractFileByPath: path => state.present ? [file, folder].find(f => f.path === path) : null } },
    preferences: { iconRules: [] }, readOnly: false, zh: false,
    async update(patch) { saved.push(patch); this.preferences = { ...this.preferences, ...patch }; } };
  const controller = new module.exports.IconEditor(owner);
  return { ...module.exports, controller, owner, file, folder, dialogs, notices, saved, state };
}
test("picker cancellation, type/file distinction and icon inventory do not save settings", () => {
  const s = setup(); s.controller.file(s.file); s.dialogs[0].close(); s.controller.type("note"); s.dialogs[1].close();
  assert.equal(s.saved.length, 0);
  assert.deepEqual(Array.from(s.availableGlyphs()), ["keyline-folder", "keyline-folder-open", "keyline-file-text", "keyline-file-image", "file-text", "folder", "star"]);
  assert.equal(s.matchGlyph("keyline-file-image", "图片"), true);
  assert.equal(s.matchGlyph("keyline-folder-open", "文件夹"), true);
  assert.equal(s.matchGlyph("file-text", "file-text"), true); assert.equal(s.matchGlyph("calendar-check", "日历"), true);
  assert.equal(s.matchGlyph("star", "文件"), false);
  assert.equal(s.matchGlyph("align-start-horizontal", "星"), false);
  assert.equal(s.matchGlyph("moon-star", "星"), true);
});
test("an explicit choice saves only its target and preserves unrelated newer preferences", async () => {
  const s = setup(); s.controller.file(s.file);
  s.owner.preferences.iconRules = [{ scope: "type", key: "image", tint: "red" }];
  assert.equal(await s.dialogs[0].save({ glyph: "star", tint: "#123456" }), true);
  assert.equal(s.saved.length, 1);
  assert.equal(s.owner.preferences.iconRules.length, 2); assert.equal(s.owner.preferences.iconRules[0].key, "image");
});
for (const changed of ["removed", "renamed", "settings", "readOnly", "iconic", "disposed"])
  test(`icon picker cannot commit after ${changed}`, async () => {
    const s = setup(); s.controller.file(s.file);
    if (changed === "removed") s.state.present = false;
    if (changed === "renamed") s.file.path = "Renamed.md";
    if (changed === "settings") s.owner.preferences.iconRules = [{ scope: "path", key: "File.md", glyph: "heart" }];
    if (changed === "readOnly") s.owner.readOnly = true;
    if (changed === "iconic") s.state.blocked = true;
    if (changed === "disposed") s.controller.dispose();
    assert.equal(await s.dialogs[0].save({ glyph: "star" }), false); assert.equal(s.saved.length, 0);
  });
test("Iconic ownership and read-only settings prevent opening a misleading editable picker", () => {
  const s = setup(); s.state.blocked = true; s.controller.file(s.file);
  assert.equal(s.dialogs.length, 0); assert.equal(s.notices.length, 1);
  s.state.blocked = false; s.owner.readOnly = true; s.controller.type("note");
  assert.equal(s.dialogs.length, 0);
});
test("unload closes all owned pickers", () => {
  const s = setup(); s.controller.file(s.file); s.controller.file(s.folder); s.controller.type("note");
  s.controller.dispose(); assert.ok(s.dialogs.every(d => d.closed));
  s.controller.type("image"); assert.equal(s.dialogs.length, 3);
});
