import { Scope, type App } from "obsidian";

/** Native explorer scopes can consume Enter before a button's DOM listener.
 * Use the public scope stack only while an owned button has keyboard focus.
 * No native handlers are changed, and higher-priority menus keep their scopes. */
export class ButtonKeys {
  private active?: { button: HTMLElement & { disabled?: boolean }; scope: Scope };
  constructor(private app: Pick<App, "keymap" | "scope">) {}
  focus(button: HTMLElement & { disabled?: boolean }, parent: Scope | null = this.app.scope, activate: () => void = () => button.click()): void {
    if (this.active?.button === button) return;
    this.clear();
    if (!button.isConnected || button.ownerDocument.activeElement !== button || button.disabled) return;
    const scope = new Scope(parent ?? this.app.scope);
    for (const key of ["Enter", " "]) scope.register([], key, event => {
      if (this.active?.scope !== scope || !button.isConnected || button.ownerDocument.activeElement !== button) { this.clear(); return; }
      event.preventDefault(); event.stopPropagation();
      if (!event.repeat && !button.disabled) activate();
      return false;
    });
    this.active = { button, scope };
    this.app.keymap.pushScope(scope);
  }
  blur(button: HTMLElement): void { if (this.active?.button === button) this.clear(); }
  releaseWithin(root: HTMLElement): void { if (this.active && root.contains(this.active.button)) this.clear(); }
  prune(): void { if (this.active && !this.active.button.isConnected) this.clear(); }
  clear(): void {
    if (!this.active) return;
    const scope = this.active.scope;
    this.active = undefined; this.app.keymap.popScope(scope);
  }
}
