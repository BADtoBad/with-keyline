import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSync } from "esbuild";
import vm from "node:vm";
function load(file) {
  const source = buildSync({ entryPoints: [file], bundle: true, write: false, format: "cjs", target: "es2018" }).outputFiles[0].text;
  const module = { exports: {} }; vm.runInNewContext(source, { module, exports: module.exports }); return module.exports;
}
const { footerGeometry } = load("src/domain/footer.ts");
const { PresentationLease } = load("src/platform/presentation.ts");
const rect = (left, right) => ({ left, right, width: right - left });
const base = { workspace: rect(100, 1300), ribbon: rect(100, 144), dock: rect(144, 444), dockOpen: true, ribbonVisible: true };
const geometry = p => JSON.parse(JSON.stringify(footerGeometry({ ...base, ...p })));
test("expanded footer spans native navigation and keeps its eight-pixel insets", () => {
  assert.deepEqual(geometry({}), { left: 8, width: 328, compact: false, hidden: false });
});
test("compact footer stays on the ribbon; hiding all navigation hides it", () => {
  assert.deepEqual(geometry({ dockOpen: false }), { left: 0, width: 52, compact: true, hidden: false });
  assert.equal(geometry({ dockOpen: false, ribbonVisible: false }).hidden, true);
});
test("hidden ribbon does not create a gap beside the expanded dock", () => {
  assert.deepEqual(geometry({ ribbonVisible: false, dock: rect(100, 400) }),
    { left: 8, width: 284, compact: false, hidden: false });
});
test("footer bounds clamp to the workspace and invalid measurements fail closed", () => {
  const bounded = geometry({ dock: rect(100, 1600) }); assert.equal(bounded.left + bounded.width, 1200);
  assert.equal(footerGeometry({ ...base, workspace: rect(0, 0) }), null);
  assert.equal(footerGeometry({ ...base, ribbon: { left: NaN, right: 40, width: 40 } }), null);
  assert.equal(geometry({ dock: rect(100, 105) }).hidden, true);
});
function element() {
  const attrs = new Map(), styles = new Map(), classes = new Set(["native"]);
  return {
    attrs, styles, classes,
    getAttribute: k => attrs.get(k) ?? null, setAttribute: (k, v) => attrs.set(k, v), removeAttribute: k => attrs.delete(k),
    style: {
      getPropertyValue: k => styles.get(k)?.value ?? "", getPropertyPriority: k => styles.get(k)?.priority ?? "",
      setProperty: (k, value, priority = "") => styles.set(k, { value, priority }), removeProperty: k => styles.delete(k)
    },
    classList: { contains: k => classes.has(k), toggle: (k, on) => on ? classes.add(k) : classes.delete(k) }
  };
}
test("presentation release restores only its own fields, including style priorities", () => {
  const e = element(), lease = new PresentationLease();
  e.setAttribute("aria-label", "Native label"); e.style.setProperty("width", "20px", "important");
  lease.attribute(e, "aria-label", "New label"); lease.attribute(e, "role", "button");
  lease.style(e, "width", "40px"); lease.style(e, "left", "8px"); lease.addClass(e, "native"); lease.addClass(e, "owned");
  e.classes.add("foreign"); e.style.setProperty("color", "red"); lease.release();
  assert.equal(e.getAttribute("aria-label"), "Native label"); assert.equal(e.getAttribute("role"), null);
  assert.deepEqual(e.styles.get("width"), { value: "20px", priority: "important" });
  assert.equal(e.style.getPropertyValue("left"), ""); assert.equal(e.style.getPropertyValue("color"), "red");
  assert.deepEqual([...e.classes], ["native", "foreign"]); lease.release();
});
test("later field owners are not overwritten by refresh or release", () => {
  const e = element(), lease = new PresentationLease();
  lease.attribute(e, "aria-label", "Own"); lease.style(e, "left", "8px"); lease.addClass(e, "owned");
  e.setAttribute("aria-label", "Foreign"); e.style.setProperty("left", "10px", "important"); e.classes.delete("owned");
  lease.attribute(e, "aria-label", "Own update"); lease.style(e, "left", "9px"); lease.addClass(e, "owned"); lease.release();
  assert.equal(e.getAttribute("aria-label"), "Foreign"); assert.deepEqual(e.styles.get("left"), { value: "10px", priority: "important" });
  assert.equal(e.classes.has("owned"), false);
});
test("compact class transitions restore their original state rather than an entire class attribute", () => {
  for (const initial of [false, true]) {
    const e = element(), lease = new PresentationLease(); if (initial) e.classes.add("is-compact");
    lease.toggleClass(e, "is-compact", false); lease.toggleClass(e, "is-compact", true);
    e.classes.add("extra"); lease.release(); assert.equal(e.classes.has("is-compact"), initial); assert.equal(e.classes.has("extra"), true);
  }
});
test("CSSOM decimal canonicalization does not freeze an animated footer width", () => {
  const e = element(), lease = new PresentationLease();
  e.style.setProperty = (key, value, priority = "") => e.styles.set(key, { value: `${Number.parseFloat(value).toFixed(3)}px`, priority });
  lease.style(e, "width", "128.8333333333px");
  lease.style(e, "width", "320.5px");
  assert.equal(e.style.getPropertyValue("width"), "320.500px");
  lease.release(); assert.equal(e.style.getPropertyValue("width"), "");
});
