import test from "node:test";
import assert from "node:assert/strict";
import { readHostConfig } from "../scripts/host-config.mjs";

test("host observer retries an incomplete write without inventing defaults", async () => {
  const values = ["", '{"nativeMenus":', '{"nativeMenus":false}'];
  let waits = 0;
  const actual = await readHostConfig("fixture", {
    read: async () => values.shift(),
    wait: async () => { waits++; }
  });
  assert.deepEqual(actual, { nativeMenus: false });
  assert.equal(waits, 2);
  assert.equal(values.length, 0);
});

test("host observer returns complete actual values, even if not expected", async () => {
  assert.deepEqual(await readHostConfig("fixture", {
    read: async () => '{"nativeMenus":true,"unrelated":2}',
    wait: async () => assert.fail("No retry for valid content")
  }), { nativeMenus: true, unrelated: 2 });
});

test("persistently corrupt host configuration fails within the read limit", async () => {
  let reads = 0;
  await assert.rejects(readHostConfig("fixture", {
    attempts: 3, read: async () => { reads++; return "{"; }, wait: async () => {}
  }), SyntaxError);
  assert.equal(reads, 3);
});

test("host observer does not suppress access errors or non-object data", async () => {
  const denied = Object.assign(Error("Denied"), { code: "EACCES" });
  await assert.rejects(readHostConfig("fixture", {
    read: async () => { throw denied; }, wait: async () => assert.fail("No access retry")
  }), error => error === denied);
  for (const value of ["null", "[]", "false"]) {
    await assert.rejects(readHostConfig("fixture", { read: async () => value }), /Expected a config object/);
  }
});
