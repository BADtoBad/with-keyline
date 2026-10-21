import { decodePreferences, type Preferences } from "./preferences";
import { cleanIconChoice, iconRuleLimit, validIconPath, type IconKind, type IconRule } from "./icons";
import { normalizeInsert, validSlashTrigger } from "./insertion";
import { normalizeTypography, type TypographyKey } from "./typography";

export const legacyId = "notion-craft-interaction-lab";
export const legacyVersion = "0.7.4";
export const importLimit = 2 * 1024 * 1024;
export interface ImportPlan { preferences: Preferences; changed: string[]; notices: string[] }
const boolMap = {
  enabled: "editingEnabled", nativeFileExplorerEnhancements: "fileNavigation", workspaceSwitcher: "workspaces",
  showHoverHints: "hints", selectionToolbar: "toolbar", hideSyntaxMarkers: "hideMarkers",
  guardSuspiciousSyntax: "markSuspicious", revealSyntaxWithOption: "optionReveal", notifyOnPaste: "pasteHints",
  snapSelectionToBlocks: "snapSelection", blockKeys: "blockKeys", handleAlwaysVisible: "handlePinned",
  foldHandle: "handleFold", plusHandle: "handlePlus", slashMenu: "slash", slashInline: "inlineSlash", embedAttachments: "embedAttachments"
} as const;
const typeMap: Record<string, IconKind> = { markdown: "note", pdf: "document", epub: "book", canvas: "canvas",
  audio: "audio", image: "image", video: "video", code: "code", archive: "archive", generic: "other", folder: "folder" };
const layoutMap: Record<string, TypographyKey> = { textMaxWidth: "width", pageSidePadding: "inset", editorLineHeight: "editorLeading",
  readingLineHeight: "readingLeading", paragraphGap: "paragraphGap", paragraphBefore: "paragraphBefore", paragraphAfter: "paragraphAfter",
  firstLineIndent: "firstIndent", listLineHeight: "listLeading", listItemSpacing: "listGap", listIndent: "listIndent",
  listMarkerGap: "markerGap", listBulletSize: "bulletSize", blockquoteIndent: "quoteIndent", headingBefore: "headingBefore", headingAfter: "headingAfter" };
const itemMap: Record<string, string> = {h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",todo:"task",code:"codeblock",
  math:"math",table:"table",divider:"rule",toc:"toc",callout:"callout",page:"newpage",link:"wiki","ext-link":"link",
  image:"image",attachment:"attachment",today:"today",yesterday:"yesterday",tomorrow:"tomorrow",time:"time",footnote:"footnote",comment:"comment"};
const own = (v: object, k: string) => Object.prototype.hasOwnProperty.call(v, k);
export function object(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw Error(`${label}: expected an object`);
  return value as Record<string, unknown>;
}
export function jsonObject(text: string, label: string, limit = importLimit): Record<string, unknown> {
  if (text.length > limit) throw Error(`${label}: file too large`);
  return object(JSON.parse(text.replace(/^\uFEFF/u, "")), label);
}
function keys(raw: Record<string, unknown>, allowed: readonly string[], label: string): void {
  for (const key of Object.keys(raw)) if (!allowed.includes(key)) throw Error(`${label}.${key}: unsupported field`);
}
function bool(raw: Record<string, unknown>, key: string, fallback: boolean): boolean {
  if (!own(raw, key)) return fallback;
  if (typeof raw[key] !== "boolean") throw Error(`${key}: expected a boolean`);
  return raw[key] as boolean;
}
function text(raw: Record<string, unknown>, key: string, fallback: string, max = 80): string {
  if (!own(raw, key)) return fallback;
  const value = raw[key];
  if (typeof value !== "string" || !value.trim() || value.length > max || /[\x00-\x1f\x7f]/u.test(value)) throw Error(`${key}: invalid text`);
  return value.trim();
}
function number(raw: Record<string, unknown>, key: string, fallback: number, max: number): number {
  if (!own(raw, key)) return fallback;
  const value = raw[key];
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > max || !Number.isInteger(value)) throw Error(`${key}: invalid number`);
  return value;
}
function strings(raw: Record<string, unknown>, key: string): string[] {
  if (!own(raw, key)) return [];
  const value = raw[key];
  if (!Array.isArray(value) || value.length > 1000 || value.some(v => typeof v !== "string" || v.length > 200)) throw Error(`${key}: invalid IDs`);
  return value as string[];
}
/** Versioned data-contract mapping only; never reads a Vault, executes a command,
 * writes a note or silently interprets an unknown schema. */
export function planLegacyImport(manifestText: string, dataText: string, current: Preferences): ImportPlan {
  const manifest = jsonObject(manifestText, "manifest", 16000), raw = jsonObject(dataText, "data");
  if (manifest.id !== legacyId || manifest.version !== legacyVersion) throw Error(`Only ${legacyId} ${legacyVersion} is supported`);
  keys(raw, [...Object.keys(boolMap), "fileIcons", "themeLayout", "marginalia", "dragGranularity", "hoverDelay", "hideDelay",
    "handleSide", "dateFormat", "timeFormat", "wikilinkInputAliases", "slashTrigger", "insertOrder", "insertHidden", "insertCustom"], "data");
  if (!["enabled", "fileIcons", "themeLayout", "selectionToolbar"].some(k => own(raw, k))) throw Error("Not a recognizable Keyline settings copy");
  const next = decodePreferences(current), baseline = decodePreferences(null), notices: string[] = [];
  for (const old of Object.keys(boolMap) as (keyof typeof boolMap)[]) {
    const key = boolMap[old]; next[key] = bool(raw, old, baseline[key]);
  }
  next.mentions = next.fullwidthLinks = bool(raw, "wikilinkInputAliases", true);
  next.blockHandles = true; // Old `enabled` is retained as the master, not flattened into sub-options.
  if (own(raw, "marginalia")) { bool(raw, "marginalia", true); notices.push("marginalia-excluded"); }
  const granularity = own(raw,"dragGranularity") ? raw.dragGranularity : "paragraph", side = own(raw,"handleSide") ? raw.handleSide : "left";
  if (granularity !== "paragraph" && granularity !== "line" || side !== "left" && side !== "right") throw Error("Invalid handle preferences");
  next.dragGranularity = granularity === "line" ? "line" : "block"; next.handleSide = side;
  next.handleHoverDelay = number(raw, "hoverDelay", 90, 1000); next.handleHideDelay = number(raw, "hideDelay", 260, 1500);
  next.dateFormat = text(raw, "dateFormat", "YYYY-MM-DD"); next.timeFormat = text(raw, "timeFormat", "HH:mm");
  next.slashTrigger = text(raw, "slashTrigger", "/"); if (!validSlashTrigger(next.slashTrigger)) throw Error("Unsupported slash trigger");
  const layout = own(raw, "themeLayout") ? object(raw.themeLayout, "themeLayout") : {};
  keys(layout, Object.keys(layoutMap), "themeLayout");
  const values: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(layout)) { if (typeof value !== "number" || !Number.isFinite(value)) throw Error(`themeLayout.${key}: invalid number`); values[layoutMap[key]] = value; }
  next.typography = normalizeTypography(values);
  for (const [key, value] of Object.entries(values)) if (Math.abs(next.typography[key as TypographyKey] - (value as number)) > .00001) throw Error(`themeLayout.${key}: out of range or unsupported step`);
  const icons = own(raw, "fileIcons") ? object(raw.fileIcons, "fileIcons") : {};
  keys(icons, ["enabled", "monochrome", "types", "files"], "fileIcons");
  next.fileIcons = bool(icons, "enabled", true); next.monochrome = bool(icons, "monochrome", false);
  const rules: IconRule[] = [];
  for (const scope of ["types", "files"] as const) {
    const entries = own(icons, scope) ? object(icons[scope], `fileIcons.${scope}`) : {};
    if (Object.keys(entries).length + rules.length > iconRuleLimit) throw Error("Too many icon rules");
    for (const [key, value] of Object.entries(entries)) {
      if (scope === "types" ? !own(typeMap,key) : !validIconPath(key)) throw Error(`Invalid icon key: ${key}`);
      const item = object(value, `icon.${key}`); keys(item, ["icon", "color"], `icon.${key}`);
      const glyph = own(item,"icon") ? text(item,"icon", "").replace(/^lucide-/u, "") : undefined;
      const tint = own(item,"color") ? text(item,"color", "").toLowerCase() : undefined;
      const clean = cleanIconChoice({ glyph, tint });
      if (glyph && clean.glyph !== glyph || tint && clean.tint !== tint) throw Error(`Invalid icon choice: ${key}`);
      if (glyph || tint) rules.push({scope: scope === "types" ? "type" : "path", key: scope === "types" ? typeMap[key] : key, ...clean});
    }
  }
  next.iconRules = rules;
  const custom = own(raw,"insertCustom") ? raw.insertCustom : []; if (!Array.isArray(custom) || custom.length > 32) throw Error("Invalid custom insert list (maximum 32)");
  const customIDs = new Map<string,string>();
  next.customInsert = custom.map((value, index) => {
    const item = object(value,"insertCustom"); keys(item,["id","label","icon","commandId"],"insertCustom");
    const oldId = text(item,"id", "", 200), command = text(item,"commandId", "",160), label = text(item,"label","",80);
    if (!oldId || own(itemMap,oldId) || customIDs.has(oldId) || !command || !label) throw Error("Invalid or duplicate custom insert ID");
    const id = `custom:legacy-${index+1}`; customIDs.set(oldId,id);
    const icon = text(item,"icon","terminal",100).replace(/^lucide-/u, "");
    return {id,command,label,icon};
  });
  const mapID = (id: string) => { const mapped = own(itemMap,id) ? itemMap[id] : customIDs.get(id); if (!mapped) throw Error(`Unknown insert item: ${id}`); return mapped; };
  // Materialize the old effective order before appending genuinely new entries.
  // An empty legacy array means the old built-in order, not the rewrite's order.
  next.insertOrder = [...new Set([...strings(raw,"insertOrder"),...Object.keys(itemMap),...customIDs.keys()].map(mapID))];
  next.hiddenInsert = [...new Set(strings(raw,"insertHidden").map(mapID))];
  const normalized = normalizeInsert({...next});
  if (normalized.customInsert.length !== next.customInsert.length || normalized.customInsert.some((item,i) =>
    ["id","command","label","icon"].some(k => item[k as keyof typeof item] !== next.customInsert[i][k as keyof typeof item]))) throw Error("Unsupported custom command, label or icon");
  if (next.customInsert.length) notices.push("commands-not-executed");
  notices.push("notes-and-host-preferences-untouched");
  const changed = Object.keys(next).filter(k => JSON.stringify(next[k as keyof Preferences]) !== JSON.stringify(current[k as keyof Preferences]));
  return { preferences: next, changed, notices };
}
