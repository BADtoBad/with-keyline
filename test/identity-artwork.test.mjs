import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import vm from "node:vm";

// Pinned upstream path hashes, checked against commit 14cd695f3f2bbe320bbe7a01e65b251df7ba52cf.
// Regression tests are offline and do not read the previous plugin checkout.
const hashes = {
  "keyline-folder": "b1be3702274ae21f3951ec9c7755afd2c0c8938c83aa5eea46c85ccb45f70d8f",
  "keyline-folder-open": "0b673e32c39d71665a5b222c0d99d179cb26bf97e957e3accdf1a6a0caeee866",
  "keyline-file-text": "243be92dd0f643c7da3144fb009b6ee40c563c532dd6e2b24a70ac3a91b12937",
  "keyline-file-image": "6f297f4b97cd64c3a46920524a7516c032439671d71707ccf76b6febe9818eb1"
};
function setup() {
  class Element {
    constructor(doc, name) { this.ownerDocument = doc; this.name = name; this.attrs = {}; this.dataset = {}; this.children = []; this.classes = []; this.classList = { add: c => this.classes.push(c) }; }
    setAttribute(name, value) { this.attrs[name] = value; }
    appendChild(child) { this.children.push(child); }
    replaceChildren(...children) { this.children = children; }
  }
  const doc = {
    createElementNS(ns, name) { assert.equal(ns, "http://www.w3.org/2000/svg"); return new Element(doc, name); },
    importNode(source, deep) { assert.equal(deep, true); const node = new Element(doc, source.name); node.attrs = { ...source.attrs }; return node; }
  };
  const hostIcon = new Element({}, "svg"); hostIcon.attrs = { "data-host-shape": "star" };
  const module = { exports: {} };
  vm.runInNewContext(readFileSync(new URL("../.test-build/platform/identity-artwork.cjs", import.meta.url), "utf8"), {
    module, exports: module.exports, require: name => {
      assert.equal(name, "obsidian");
      return { getIconIds: () => ["lucide-star", "star", "keyline-folder", "<svg>"],
        getIcon: id => id === "star" ? hostIcon : undefined };
    }
  });
  return { ...module.exports, doc, hostIcon, slot: new Element(doc, "span") };
}
for (const [id, hash] of Object.entries(hashes)) test(`retained artwork: exact pinned path and explicit paint for ${id}`, () => {
  const s = setup(); s.paintIdentityGlyph(s.slot, id);
  const svg = s.slot.children[0], path = svg.children[0], filled = id !== "keyline-folder-open";
  assert.equal(createHash("sha256").update(path.attrs.d).digest("hex"), hash);
  assert.equal(svg.ownerDocument, s.doc); assert.equal(svg.attrs.viewBox, "0 0 24 24");
  assert.equal(svg.attrs.fill, filled ? "currentColor" : "none");
  assert.equal(svg.attrs.stroke, filled ? "none" : "currentColor");
  assert.equal(svg.attrs["stroke-width"], filled ? "0" : "2");
  assert.equal(svg.attrs["stroke-linecap"], "butt");
  assert.equal(svg.attrs["aria-hidden"], "true"); assert.equal(svg.attrs.focusable, "false");
  assert.equal(svg.dataset.identity, id);
  s.paintIdentityGlyph(s.slot, id); assert.equal(s.slot.children.length, 1);
});
test("inventory keeps original glyphs first, deduplicates native names and rejects markup", () => {
  const s = setup();
  assert.deepEqual(Array.from(s.identityGlyphs()), [...Object.keys(hashes), "star"]);
});
test("Lucide stays an explicit separate choice without mutating its native SVG", () => {
  const s = setup(), before = JSON.stringify(s.hostIcon.attrs);
  s.paintIdentityGlyph(s.slot, "lucide-star");
  const result = s.slot.children[0];
  assert.equal(result.dataset.identity, "star"); assert.equal(result.dataset.paint, "stroke");
  assert.notEqual(result, s.hostIcon); assert.equal(result.ownerDocument, s.doc);
  assert.equal(JSON.stringify(s.hostIcon.attrs), before);
});
for (const id of ["missing", "__proto__", "<svg onload=alert(1)>"]) test(`unknown artwork falls back safely: ${id}`, () => {
  const s = setup(); s.paintIdentityGlyph(s.slot, id);
  assert.equal(s.slot.children[0].dataset.identity, "keyline-file-text");
  assert.equal(s.slot.children[0].children.length, 1);
});
test("the production notice retains the asset origin and licence", () => {
  const notice = readFileSync(new URL("../THIRD-PARTY-NOTICES.txt", import.meta.url), "utf8");
  assert.match(notice, /Copyright \(c\) 2026 Keyline Icons/u);
  assert.match(notice, /14cd695f3f2bbe320bbe7a01e65b251df7ba52cf/u);
  assert.match(notice, /Permission is hereby granted/u);
});
