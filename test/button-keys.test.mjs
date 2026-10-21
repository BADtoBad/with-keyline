import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { buildSync } from "esbuild";
const source = buildSync({ entryPoints: ["src/platform/button-keys.ts"], bundle: true, write: false,
  format: "cjs", platform: "browser", target: "es2018", external: ["obsidian"] }).outputFiles[0].text;
function setup() {
  class Scope {
    constructor(parent) { this.parent = parent; this.bindings = new Map(); }
    register(modifiers, key, run) { assert.deepEqual(Array.from(modifiers), []); this.bindings.set(key, run); }
  }
  const module = { exports: {} };
  vm.runInNewContext(source, { module, exports: module.exports, require: name => { assert.equal(name, "obsidian"); return { Scope }; } });
  const base = new Scope(), stack = [base], changes = [];
  const app = { scope: base, keymap: {
    pushScope(s) { stack.push(s); changes.push("push"); },
    popScope(s) { const at = stack.indexOf(s); assert.ok(at >= 0); stack.splice(at, 1); changes.push("pop"); }
  } };
  const doc = { activeElement: null }, button = { isConnected: true, disabled: false, ownerDocument: doc, clicks: 0, click() { this.clicks++; } };
  doc.activeElement = button;
  const event = repeat => ({ repeat, defaultPrevented: false, stopped: false,
    preventDefault() { this.defaultPrevented = true; }, stopPropagation() { this.stopped = true; } });
  return { controller: new module.exports.ButtonKeys(app), button, doc, stack, changes, event, Scope, base };
}
for (const key of ["Enter", " "]) test(`owned button intercepts ${key} before the native explorer scope`, () => {
  const f = setup(), native = new f.Scope(f.base); f.controller.focus(f.button, native);
  const scope = f.stack.at(-1), e = f.event(false);
  assert.equal(scope.parent, native);
  assert.equal(scope.bindings.get(key)(e), false);
  assert.equal(f.button.clicks, 1); assert.equal(e.defaultPrevented, true); assert.equal(e.stopped, true);
  scope.bindings.get(key)(f.event(true)); assert.equal(f.button.clicks, 1);
  f.controller.blur(f.button); assert.deepEqual(f.stack, [f.base]);
});
test("focus is idempotent and blur removes only the owned scope under an open native menu", () => {
  const f = setup(); f.controller.focus(f.button); f.controller.focus(f.button);
  assert.deepEqual(f.changes, ["push"]);
  const menu = new f.Scope(); f.stack.push(menu);
  f.controller.blur({}); assert.equal(f.stack.length, 3);
  f.controller.blur(f.button); assert.deepEqual(f.stack, [f.base, menu]);
  f.controller.clear(); assert.deepEqual(f.changes, ["push", "pop"]);
});
test("native non-button controls can use an anchored click without dispatching an extra default click", () => {
  const f = setup(); delete f.button.disabled;
  let anchored = 0; f.controller.focus(f.button, f.base, () => { anchored++; });
  f.stack.at(-1).bindings.get("Enter")(f.event(false));
  assert.equal(anchored, 1); assert.equal(f.button.clicks, 0); f.controller.clear();
});
test("scope follows focus between buttons without leaking a previous registration", () => {
  const f = setup(); f.controller.focus(f.button);
  const other = { ...f.button }; f.doc.activeElement = other; f.controller.focus(other);
  assert.deepEqual(f.changes, ["push", "pop", "push"]);
  f.controller.blur(f.button); assert.equal(f.stack.length, 2);
  f.controller.clear(); assert.deepEqual(f.stack, [f.base]);
});
for (const changed of ["detached", "otherFocus", "disabled"]) test(`invalid button cannot take or activate a scope: ${changed}`, () => {
  const f = setup();
  if (changed === "detached") f.button.isConnected = false;
  if (changed === "otherFocus") f.doc.activeElement = {};
  if (changed === "disabled") f.button.disabled = true;
  f.controller.focus(f.button); assert.deepEqual(f.stack, [f.base]); assert.equal(f.button.clicks, 0);
});
test("late keys after removal do not execute stale actions, and refresh/unload can release scope", () => {
  const f = setup(); f.controller.focus(f.button); const scope = f.stack.at(-1);
  f.button.isConnected = false; scope.bindings.get("Enter")(f.event(false));
  assert.equal(f.button.clicks, 0); assert.deepEqual(f.stack, [f.base]);
  f.button.isConnected = true; f.controller.focus(f.button); f.button.isConnected = false; f.controller.prune();
  assert.deepEqual(f.stack, [f.base]);
  f.button.isConnected = true; f.controller.focus(f.button);
  f.controller.releaseWithin({ contains: () => false }); assert.equal(f.stack.length, 2);
  f.controller.releaseWithin({ contains: b => b === f.button }); assert.deepEqual(f.stack, [f.base]);
});
