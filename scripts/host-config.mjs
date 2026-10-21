import fs from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";

/** The host may truncate then rewrite its config during a debounced save.
 * Retry incomplete JSON briefly, never substitute a default or swallow I/O
 * errors. This is test observation only; plugin persistence stays unchanged. */
export async function readHostConfig(file, {
  read = () => fs.readFile(file, "utf8"),
  wait = () => delay(50),
  attempts = 20
} = {}) {
  for (let index = 0; index < attempts; index++) {
    const source = await read();
    let value;
    try { value = JSON.parse(source); }
    catch (error) {
      if (!(error instanceof SyntaxError) || index + 1 === attempts) throw error;
      await wait(); continue;
    }
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw Error(`Expected a config object: ${file}`);
    }
    return value;
  }
  throw Error(`No config read attempts: ${file}`);
}
