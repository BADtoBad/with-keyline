export const iconKinds = ["note", "document", "book", "canvas", "audio", "image", "video", "code", "archive", "other", "folder"] as const;
export type IconKind = typeof iconKinds[number];
export type FileIdentity = { icon: string; category: IconKind; color: string };
export interface IconChoice { glyph?: string; tint?: string }
export interface IconRule extends IconChoice { scope: "type" | "path"; key: string }
export const iconRuleLimit = 10000;
export const iconTints = ["gray", "blue", "red", "green", "purple", "amber", "cyan", "orange", "pink"] as const;
export const kindLabels: Record<IconKind, [string, string]> = {
  note: ["Markdown notes", "Markdown 笔记"], document: ["PDF documents", "PDF 文档"], book: ["EPUB books", "EPUB 电子书"],
  canvas: ["Canvas", "白板"], audio: ["Audio", "音频"], image: ["Images", "图片"], video: ["Video", "视频"],
  code: ["Code and configuration", "代码与配置"], archive: ["Archives", "压缩文件"], other: ["Other files", "其他文件"], folder: ["Folders", "文件夹"]
};
const builtins: Record<IconKind, [string, string]> = {
  note: ["keyline-file-text", "blue"], document: ["keyline-file-text", "red"], book: ["keyline-file-text", "amber"],
  canvas: ["layout-dashboard", "cyan"], audio: ["file-audio", "purple"], image: ["keyline-file-image", "green"],
  video: ["file-video", "pink"], code: ["file-code", "blue"], archive: ["file-archive", "orange"],
  other: ["keyline-file-text", "gray"], folder: ["keyline-folder", "gray"]
};
export function kindIdentity(category: IconKind, expanded = false): FileIdentity {
  const [icon, color] = builtins[category];
  return { category, icon: category === "folder" && expanded ? "keyline-folder-open" : icon, color };
}

/** Classification only. A format icon does not imply an installed reader. */
export function identifyFile(filename: string, folder = false, expanded = false): FileIdentity {
  const name = filename.slice(filename.lastIndexOf("/") + 1), dot = name.lastIndexOf(".");
  const extension = dot <= 0 ? "" : name.slice(dot + 1).toLowerCase();
  const kind: IconKind = folder ? "folder" : extension === "md" ? "note" : extension === "pdf" ? "document" :
    extension === "epub" ? "book" : extension === "canvas" ? "canvas" :
    ["wav", "mp3", "m4a", "ogg", "flac", "aac", "aiff", "aif", "opus"].includes(extension) ? "audio" :
    ["svg", "png", "jpg", "jpeg", "webp", "gif", "avif", "bmp", "heic", "heif", "ico", "tif", "tiff"].includes(extension) ? "image" :
    ["mp4", "mov", "webm", "mkv", "avi", "m4v", "ogv"].includes(extension) ? "video" :
    ["js", "ts", "tsx", "jsx", "json", "yaml", "yml", "toml", "css", "html", "xml", "py", "sh", "sql", "c", "cpp", "rs", "go", "swift"].includes(extension) ? "code" :
    ["zip", "7z", "rar", "gz", "tar", "bz2", "xz"].includes(extension) ? "archive" : "other";
  return kindIdentity(kind, expanded);
}
export function validIconPath(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= 4096 &&
    !/[\\\x00-\x1f\x7f]/u.test(value) && value.split("/").every(part => part !== "" && part !== "." && part !== "..");
}
export function cleanIconChoice(value: unknown): IconChoice {
  const result: IconChoice = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) return result;
  const { glyph, tint } = value as Record<string, unknown>;
  if (typeof glyph === "string" && glyph.length <= 100 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(glyph)) result.glyph = glyph;
  if (typeof tint === "string") {
    const color = tint.toLowerCase();
    // Preserve an explicit choice from earlier rewrite checkpoints as well.
    if ((iconTints as readonly string[]).includes(color) || color === "yellow" || /^#[0-9a-f]{6}$/u.test(color)) result.tint = color;
  }
  return result;
}
export function cleanIconRules(value: unknown): IconRule[] {
  if (!Array.isArray(value)) return [];
  const rules = new Map<string, IconRule>();
  for (const raw of value.slice(0, iconRuleLimit)) {
    if (!raw || typeof raw !== "object") continue;
    const { scope, key } = raw;
    if (scope === "type" ? !iconKinds.includes(key) : scope !== "path" || !validIconPath(key)) continue;
    const choice = cleanIconChoice(raw);
    if (choice.glyph || choice.tint) rules.set(`${scope}:${key}`, { scope, key, ...choice });
  }
  return [...rules.values()];
}
export function iconChoice(rules: readonly IconRule[], scope: IconRule["scope"], key: string): IconChoice {
  const rule = rules.find(r => r.scope === scope && r.key === key);
  return rule ? { ...(rule.glyph ? { glyph: rule.glyph } : {}), ...(rule.tint ? { tint: rule.tint } : {}) } : {};
}
export function setIconChoice(rules: readonly IconRule[], scope: IconRule["scope"], key: string, choice: IconChoice): IconRule[] {
  return cleanIconRules([...rules.filter(r => r.scope !== scope || r.key !== key), { scope, key, ...choice }]);
}
export function resolveIdentity(filename: string, rules: readonly IconRule[], monochrome = false, folder = false, expanded = false): FileIdentity {
  return identityResolver(rules, monochrome)(filename, folder, expanded);
}
/** Index once for a complete explorer refresh, not once per row. */
export function identityResolver(rules: readonly IconRule[], monochrome = false) {
  const types = new Map<string, IconRule>(), paths = new Map<string, IconRule>();
  for (const rule of rules) (rule.scope === "type" ? types : paths).set(rule.key, rule);
  return (filename: string, folder = false, expanded = false): FileIdentity => {
    const base = identifyFile(filename, folder, expanded), type = types.get(base.category), file = paths.get(filename);
    return { category: base.category, icon: file?.glyph ?? type?.glyph ?? base.icon, color: monochrome ? "gray" : file?.tint ?? type?.tint ?? base.color };
  };
}
export function iconTintCss(tint: string): string {
  const safe = cleanIconChoice({ tint }).tint ?? "gray";
  return safe.startsWith("#") ? safe : safe === "gray" ? "var(--text-muted)" :
    safe === "yellow" ? "var(--color-yellow)" : `var(--keyline-next-identity-${safe})`;
}
/** A folder rename is segment-aware and all-or-nothing on rule collisions.
 * Deleted paths are intentionally retained for trash/undo restoration. */
export function renameIconRules(rules: readonly IconRule[], before: string, after: string): { rules: IconRule[]; conflict: boolean } {
  if (!validIconPath(before) || !validIconPath(after) || before === after) return { rules: [...rules], conflict: false };
  const affected = (r: IconRule) => r.scope === "path" && (r.key === before || r.key.startsWith(before + "/"));
  const occupied = new Set(rules.filter(r => r.scope === "path" && !affected(r)).map(r => r.key));
  if (rules.some(r => affected(r) && occupied.has(after + r.key.slice(before.length)))) return { rules: [...rules], conflict: true };
  return { rules: rules.map(r => affected(r) ? { ...r, key: after + r.key.slice(before.length) } : { ...r }), conflict: false };
}
