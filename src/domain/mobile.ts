import type { Preferences } from "./preferences";

/** Runtime capability limits, never persisted over a synced desktop profile. */
export const mobileUnavailable = new Set<keyof Preferences>([
  "hints", "fileNavigation", "workspaces", "toolbar", "blockHandles", "handlePinned",
  "handleFold", "handlePlus", "snapSelection", "blockKeys", "optionReveal",
  "hideMarkers", "markSuspicious", "pasteHints", "fullwidthLinks"
]);

export function platformPreferences(preferences: Preferences, mobile: boolean): Preferences {
  if (!mobile) return preferences;
  const effective = { ...preferences, typography: { ...preferences.typography, inset: -1 } };
  for (const key of mobileUnavailable) Object.assign(effective, { [key]: false });
  return effective;
}
