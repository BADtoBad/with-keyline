import { normalizeTypography, type Typography } from "./typography";
import { insertDefaults, normalizeInsert, type InsertPreferences } from "./insertion";
import { cleanIconRules, iconRuleLimit, type IconRule } from "./icons";

export interface Preferences extends InsertPreferences {
  schema: 1;
  language: "auto" | "en" | "zh";
  editingEnabled: boolean;
  mentions: boolean;
  fileIcons: boolean;
  monochrome: boolean;
  iconRules: IconRule[];
  toolbar: boolean;
  hints: boolean;
  fileNavigation: boolean;
  workspaces: boolean;
  typographyEnabled: boolean;
  typography: Typography;
  fullwidthLinks: boolean;
  hideMarkers: boolean;
  markSuspicious: boolean;
  optionReveal: boolean;
  pasteHints: boolean;
  blockHandles: boolean;
  dragGranularity: "block" | "line";
  handleSide: "left" | "right";
  handlePinned: boolean;
  handleFold: boolean;
  handlePlus: boolean;
  handleHoverDelay: number;
  handleHideDelay: number;
  snapSelection: boolean;
  blockKeys: boolean;
}

export const defaults: Readonly<Preferences> = Object.freeze({
  schema: 1, language: "auto", editingEnabled: true, mentions: true, fileIcons: true,
  monochrome: false, iconRules: [], toolbar: true, hints: false, fileNavigation: true, workspaces: true,
  typographyEnabled: true, typography: normalizeTypography(null), ...insertDefaults,
  fullwidthLinks: true, hideMarkers: true, markSuspicious: true, optionReveal: true, pasteHints: true,
  blockHandles: true, dragGranularity: "block", handleSide: "left", handlePinned: false, handleFold: false,
  handlePlus: true, handleHoverDelay: 90, handleHideDelay: 260, snapSelection: true, blockKeys: true
});

/** Read only known fields; never execute a migration or write on load. */
export function decodePreferences(value: unknown): Preferences {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const delay = (key: "handleHoverDelay" | "handleHideDelay", max: number): number => {
    const value = raw[key];
    return typeof value === "number" && Number.isFinite(value) ? Math.round(Math.max(0, Math.min(max, value))) : defaults[key];
  };
  return {
    ...normalizeInsert(raw), schema: 1,
    language: raw.language === "en" || raw.language === "zh" ? raw.language : "auto",
    editingEnabled: typeof raw.editingEnabled === "boolean" ? raw.editingEnabled : defaults.editingEnabled,
    mentions: typeof raw.mentions === "boolean" ? raw.mentions : defaults.mentions,
    fileIcons: typeof raw.fileIcons === "boolean" ? raw.fileIcons : defaults.fileIcons,
    monochrome: typeof raw.monochrome === "boolean" ? raw.monochrome : defaults.monochrome,
    iconRules: cleanIconRules(raw.iconRules),
    toolbar: typeof raw.toolbar === "boolean" ? raw.toolbar : defaults.toolbar,
    hints: typeof raw.hints === "boolean" ? raw.hints : defaults.hints,
    fileNavigation: typeof raw.fileNavigation === "boolean" ? raw.fileNavigation : defaults.fileNavigation,
    workspaces: typeof raw.workspaces === "boolean" ? raw.workspaces : defaults.workspaces,
    typographyEnabled: typeof raw.typographyEnabled === "boolean" ? raw.typographyEnabled : defaults.typographyEnabled,
    typography: normalizeTypography(raw.typography),
    fullwidthLinks: typeof raw.fullwidthLinks === "boolean" ? raw.fullwidthLinks : defaults.fullwidthLinks,
    hideMarkers: typeof raw.hideMarkers === "boolean" ? raw.hideMarkers : defaults.hideMarkers,
    markSuspicious: typeof raw.markSuspicious === "boolean" ? raw.markSuspicious : defaults.markSuspicious,
    optionReveal: typeof raw.optionReveal === "boolean" ? raw.optionReveal : defaults.optionReveal,
    pasteHints: typeof raw.pasteHints === "boolean" ? raw.pasteHints : defaults.pasteHints,
    blockHandles: typeof raw.blockHandles === "boolean" ? raw.blockHandles : defaults.blockHandles,
    dragGranularity: raw.dragGranularity === "line" ? "line" : "block",
    handleSide: raw.handleSide === "right" ? "right" : "left",
    handlePinned: typeof raw.handlePinned === "boolean" ? raw.handlePinned : defaults.handlePinned,
    handleFold: typeof raw.handleFold === "boolean" ? raw.handleFold : defaults.handleFold,
    handlePlus: typeof raw.handlePlus === "boolean" ? raw.handlePlus : defaults.handlePlus,
    snapSelection: typeof raw.snapSelection === "boolean" ? raw.snapSelection : defaults.snapSelection,
    blockKeys: typeof raw.blockKeys === "boolean" ? raw.blockKeys : defaults.blockKeys,
    handleHoverDelay: delay("handleHoverDelay", 1000),
    handleHideDelay: delay("handleHideDelay", 1500)
  };
}

/** Keep the stored subordinate choices when the integrated editing master is off. */
export function editingPreferences(prefs: Preferences): Preferences {
  return prefs.editingEnabled ? prefs : { ...prefs, mentions: false, toolbar: false, slash: false,
    fullwidthLinks: false, hideMarkers: false, markSuspicious: false, optionReveal: false, pasteHints: false,
    blockHandles: false, snapSelection: false, blockKeys: false, typographyEnabled: false };
}

export function writablePreferences(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value !== "object" || Array.isArray(value)) return false;
  const rules = (value as Record<string, unknown>).iconRules;
  if (Array.isArray(rules) && rules.length > iconRuleLimit) return false;
  const schema = (value as Record<string, unknown>).schema;
  return schema == null || schema === 1;
}
