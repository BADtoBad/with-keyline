export type ShellRect = { left: number; right: number; width: number };
export interface FooterGeometry {
  workspace: ShellRect;
  dock: ShellRect;
  ribbon: ShellRect;
  dockOpen: boolean;
  ribbonVisible: boolean;
}

/** Coordinates remain relative to the real workspace, not the whole screen.
 * No sidebar and no ribbon means no additional floating navigation. */
export function footerGeometry(value: FooterGeometry): { left: number; width: number; compact: boolean; hidden: boolean } | null {
  const { workspace, dock, ribbon, dockOpen, ribbonVisible } = value;
  if (![workspace, dock, ribbon].every(r => [r.left, r.right, r.width].every(Number.isFinite)) ||
      workspace.width <= 0 || dock.width < 0 || ribbon.width < 0) return null;
  const compact = !dockOpen;
  const hidden = compact && !ribbonVisible;
  const start = dockOpen ? (ribbonVisible ? ribbon.left : dock.left) + 8 : ribbon.left;
  const end = dockOpen ? dock.right - 8 : ribbon.right + 8;
  const left = Math.max(0, Math.min(workspace.width, start - workspace.left));
  const width = Math.max(0, Math.min(workspace.width - left, end - workspace.left - left));
  return { left, width, compact, hidden: hidden || width === 0 };
}
