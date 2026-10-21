import type { App, View } from "obsidian";

/** Query actual leaf identity, not the redirectable named-leaf lookup. Some
 * explorer replacements redirect that lookup to their own look-alike tree. */
export function attachedViews(app: App, type: string): View[] {
  const views = new Map<HTMLElement, View>();
  app.workspace.iterateAllLeaves(leaf => {
    const view = leaf.view;
    if (view.getViewType?.() === type && view.containerEl?.isConnected) views.set(view.containerEl, view);
  });
  return [...views.values()];
}
