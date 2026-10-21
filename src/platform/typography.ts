import type { App } from "obsidian";
import type { Preferences } from "../domain/preferences";
import { typographyVariables } from "../domain/typography";

type OwnedStyle = { before: string; priority: string; written: string };
/** Per-leaf ownership: never clear a whole style attribute or another plugin's change. */
export class TypographyController {
  private roots = new Map<HTMLElement, Map<string, OwnedStyle>>();
  constructor(private app: App, private preferences: () => Preferences) {}
  refresh(): void {
    const current = new Set(this.preferences().typographyEnabled
      ? this.app.workspace.getLeavesOfType("markdown").map(leaf => leaf.view.containerEl)
      : []);
    for (const root of this.roots.keys()) if (!current.has(root)) this.release(root);
    const variables = typographyVariables(this.preferences().typography);
    for (const root of current) {
      let owned = this.roots.get(root);
      if (!owned) { owned = new Map(); this.roots.set(root, owned); }
      root.classList.add("keyline-next-typography");
      if (this.preferences().typography.inset >= 0) root.classList.add("keyline-next-custom-inset");
      else root.classList.remove("keyline-next-custom-inset");
      for (const [name, value] of Object.entries(variables)) {
        const old = owned.get(name);
        if (!old) owned.set(name, { before: root.style.getPropertyValue(name), priority: root.style.getPropertyPriority(name), written: value });
        else if (root.style.getPropertyValue(name) !== old.written) continue;
        root.style.setProperty(name, value);
        owned.get(name)!.written = value;
      }
    }
  }
  private release(root: HTMLElement): void {
    for (const [name, style] of this.roots.get(root) ?? []) {
      if (root.style.getPropertyValue(name) !== style.written) continue;
      if (style.before) root.style.setProperty(name, style.before, style.priority);
      else root.style.removeProperty(name);
    }
    root.classList.remove("keyline-next-typography"); root.classList.remove("keyline-next-custom-inset"); this.roots.delete(root);
  }
  dispose(): void { for (const root of this.roots.keys()) this.release(root); }
}
