import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
const require = createRequire(import.meta.url);
const { VerifiedStore, equalJson } = require("../.test-build/platform/persistence.cjs");

test("JSON equality includes ordered arrays and exact object fields", () => {
  assert.ok(equalJson({ a: 1, b: [false, null] }, { b: [false, null], a: 1 }));
  assert.ok(!equalJson({ a: 1 }, { a: 1, b: 2 }));
  assert.ok(!equalJson([1, 2], [2, 1]));
  assert.ok(!equalJson({}, []));
});
test("failed or swallowed writes stay dirty until verified retry", async () => {
  for (const failure of ["throw", "swallow", "readback"]) {
    let disk = {}, fail = true;
    const states = [];
    const store = new VerifiedStore(async value => {
      if (fail && failure === "throw") throw Error("disk");
      if (!fail || failure === "readback") disk = value;
    }, async () => { if (fail && failure === "readback") throw Error("read"); return disk; }, s => states.push(s));
    await store.save({ schema: 1, mentions: false });
    assert.equal(store.dirty, true);
    assert.equal(states.at(-1), "failed");
    fail = false; await store.retry();
    assert.equal(store.dirty, false);
    assert.equal(states.at(-1), "saved");
    assert.deepEqual(disk, { schema: 1, mentions: false });
  }
});
test("snapshots cannot be changed by the caller and writes are serial", async () => {
  let disk, unblock;
  const firstWrite = new Promise(resolve => { unblock = resolve; });
  const writes = [];
  const store = new VerifiedStore(async value => {
    writes.push(value);
    if (writes.length === 1) await firstWrite;
    disk = value;
  }, async () => disk, () => {});
  const value = { n: 1 }, first = store.save(value);
  value.n = 99;
  const second = store.save({ n: 2 });
  await Promise.resolve(); await Promise.resolve();
  assert.deepEqual(writes, [{ n: 1 }]);
  unblock(); await Promise.all([first, second]);
  assert.deepEqual(writes, [{ n: 1 }, { n: 2 }]);
  assert.equal(store.dirty, false);
});
test("unloading prevents queued writes and late notifications", async () => {
  let end, disk, count = 0;
  const states = [];
  const gate = new Promise(r => { end = r; });
  const store = new VerifiedStore(async value => { count++; await gate; disk = value; }, async () => disk, s => states.push(s));
  const one = store.save({ n: 1 }); await Promise.resolve(); await Promise.resolve();
  const two = store.save({ n: 2 }); store.close(); end();
  await Promise.all([one, two]); await store.retry(); await store.save({ n: 3 });
  assert.equal(count, 1); assert.deepEqual(states, []);
});
test("open settings observers follow retries from another UI surface and unsubscribe", async () => {
  let fail = true, disk;
  const values = [];
  const store = new VerifiedStore(async value => { if (fail) throw Error("fixture"); disk = value; }, async () => disk, () => {});
  const unsubscribe = store.subscribe(() => values.push(store.dirty));
  await store.save({ n: 1 }); fail = false; await store.retry();
  assert.deepEqual(values, [true, false]);
  unsubscribe(); await store.save({ n: 2 });
  assert.deepEqual(values, [true, false]);
});
