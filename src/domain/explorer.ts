import { validIconPath } from "./icons";

/** The only generated basename is our bilingual Untitled label. Parent paths
 * come from a live TFolder, never from a user-supplied or normalised path. */
export function availableNotePath(parent: string, chinese: boolean, occupied: (path: string) => boolean): string | null {
  if (parent !== "/" && parent !== "" && !validIconPath(parent)) return null;
  const prefix = parent === "/" || parent === "" ? "" : parent + "/";
  const name = chinese ? "未命名" : "Untitled";
  for (let index = 0; index < 10000; index++) {
    const path = `${prefix}${name}${index ? ` ${index}` : ""}.md`;
    if (!occupied(path)) return path;
  }
  return null;
}
