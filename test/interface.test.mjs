import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
function fixture() {
  const Menu = { useNativeMenu: null }, Platform = { isDesktopApp: true }, writes = [];
  const state = { value: false, stored: false, fail: false, mismatch: false, saveFail: false, readFail: false, staleDisk: false, beforeSave: undefined };
  let saves = 0;
  const vault = { getConfig: key => { assert.equal(key, "nativeMenus"); return state.value; },
    setConfig: async (key, value) => {
      writes.push({ key, value }); if (state.fail) throw Error("Fixture");
      if (!state.mismatch) state.value = value;
    },
    saveConfig: async () => {
      saves++;
      if (state.beforeSave) await state.beforeSave();
      if (state.saveFail) throw Error("Fixture save");
      if (!state.staleDisk) state.stored = state.value;
    },
    readConfigJson: async name => {
      assert.equal(name, "appearance"); if (state.readFail) throw Error("Fixture read");
      return { nativeMenus: state.stored };
    }
  };
  const module = { exports: {} };
  vm.runInNewContext(readFileSync(new URL("../.test-build/platform/interface.cjs", import.meta.url), "utf8"), {
    module, exports: module.exports, require: name => { assert.equal(name, "obsidian"); return { Menu, Platform }; }
  });
  return { ...module.exports, Menu, Platform, state, writes, vault, get saves() { return saves; }, mode: new module.exports.MenuMode({ vault }) };
}
test("menu preference is read from the host and never written on startup or dispose", () => {
  const f = fixture(); assert.equal(f.mode.read(), false); f.Menu.useNativeMenu = true; assert.equal(f.mode.read(), true);
  f.mode.dispose(); assert.equal(f.writes.length, 0); assert.equal(f.saves, 0);
});
test("explicit menu choices are serialized, verified and applied to the native mode", async () => {
  const f = fixture();
  assert.deepEqual(await Promise.all([f.mode.set(true), f.mode.set(false)]), [true, true]);
  assert.deepEqual(f.writes, [{ key: "nativeMenus", value: true }, { key: "nativeMenus", value: false }]);
  assert.equal(f.Menu.useNativeMenu, false);
  assert.equal(f.state.stored, false); assert.equal(f.saves, 2);
});
for (const kind of ["fail", "mismatch", "saveFail", "readFail", "staleDisk", "unsupported", "missingWriter", "missingReader", "mobile", "disposed"]) test(`menu writes do not claim success: ${kind}`, async () => {
  const f = fixture();
  if (kind === "fail") f.state.fail = true;
  if (kind === "mismatch") f.state.mismatch = true;
  if (kind === "saveFail") f.state.saveFail = true;
  if (kind === "readFail") f.state.readFail = true;
  if (kind === "staleDisk") f.state.staleDisk = true;
  if (kind === "unsupported") delete f.vault.setConfig;
  if (kind === "missingWriter") delete f.vault.saveConfig;
  if (kind === "missingReader") delete f.vault.readConfigJson;
  if (kind === "mobile") f.Platform.isDesktopApp = false;
  if (kind === "disposed") f.mode.dispose();
  assert.equal(await f.mode.set(true), false); assert.equal(f.Menu.useNativeMenu, null);
});
test("live menu mode changes only after persistence, and unload does not apply late UI effects", async () => {
  const f = fixture(); let release;
  f.state.beforeSave = () => new Promise(r => { release = r; });
  const pending = f.mode.set(true);
  await new Promise(r => setImmediate(r));
  assert.equal(f.state.value, true); assert.equal(f.state.stored, false); assert.equal(f.Menu.useNativeMenu, null);
  f.mode.dispose(); release();
  assert.equal(await pending, false); assert.equal(f.Menu.useNativeMenu, null);
  assert.equal(f.state.stored, true); // Already-requested native write may finish.
});
function doc(initial = false) {
  const classes = new Set(initial ? ["keyline-next-no-hints", "unrelated"] : ["unrelated"]);
  return { defaultView: { closed: false }, body: { classList: {
    contains: k => classes.has(k), toggle(k, on) { on ? classes.add(k) : classes.delete(k); }
  } }, classes };
}
test("hint presentation follows preferences across documents and restores original classes", () => {
  const { HoverHints } = fixture(); let enabled = false;
  const controller = new HoverHints(() => enabled), one = doc(), two = doc(true);
  controller.watch(one); controller.watch(two);
  assert.equal(one.classes.has("keyline-next-no-hints"), true);
  enabled = true; controller.refresh();
  assert.equal(one.classes.has("keyline-next-no-hints"), false); assert.equal(two.classes.has("keyline-next-no-hints"), true);
  controller.dispose(); assert.deepEqual([...one.classes], ["unrelated"]);
  assert.deepEqual([...two.classes], ["keyline-next-no-hints", "unrelated"]);
  controller.watch(one); assert.equal(one.classes.has("keyline-next-no-hints"), false);
});
