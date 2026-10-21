import { Menu, Platform, type App } from "obsidian";

/** Guarded native preference boundary. This is not stored in plugin settings
 * and is never changed during load, unload, or theme switching. */
type ConfigHost = {
  getConfig?: (key: string) => unknown;
  setConfig?: (key: string, value: boolean) => unknown;
  saveConfig?: () => Promise<void>;
  readConfigJson?: (name: string) => Promise<unknown>;
};
const hostMenu = Menu as typeof Menu & { useNativeMenu?: boolean | null };
export class MenuMode {
  private tail: Promise<boolean> = Promise.resolve(true);
  private live = true;
  constructor(private app: App) {}
  read(): boolean | null {
    const vault = this.app.vault as unknown as ConfigHost;
    if (!Platform.isDesktopApp || typeof vault.getConfig !== "function" ||
      typeof vault.setConfig !== "function" || typeof vault.saveConfig !== "function" ||
      typeof vault.readConfigJson !== "function" || !("useNativeMenu" in hostMenu)) return null;
    try {
      if (typeof hostMenu.useNativeMenu === "boolean") return hostMenu.useNativeMenu;
      const value = vault.getConfig("nativeMenus");
      return typeof value === "boolean" ? value : null;
    } catch { return null; }
  }
  set(value: boolean): Promise<boolean> {
    this.tail = this.tail.catch(() => false).then(async () => {
      if (!this.live || this.read() === null || typeof value !== "boolean") return false;
      const vault = this.app.vault as unknown as Required<ConfigHost>;
      try {
        await vault.setConfig("nativeMenus", value);
        // setConfig schedules a debounced save and returns synchronously.
        // Await the host's own writer, not a hand-written config file, before
        // reporting success or changing the live menu implementation.
        await vault.saveConfig();
        const saved = await vault.readConfigJson("appearance");
        if (!saved || typeof saved !== "object" || (saved as { nativeMenus?: unknown }).nativeMenus !== value) return false;
        if (vault.getConfig("nativeMenus") !== value) return false;
        if (!this.live) return false;
        hostMenu.useNativeMenu = value;
        return this.read() === value;
      } catch { return false; }
    });
    return this.tail;
  }
  dispose(): void { this.live = false; }
}

/** Only ordinary Obsidian tooltip presentation is suppressed. ARIA labels,
 * notices, native dialogs and link-preview popovers are untouched. */
export class HoverHints {
  private documents = new Map<Document, boolean>();
  private live = true;
  constructor(private enabled: () => boolean) {}
  watch(doc: Document): void {
    if (!this.live || !doc.body) return;
    if (!this.documents.has(doc)) this.documents.set(doc, doc.body.classList.contains("keyline-next-no-hints"));
    this.refresh();
  }
  refresh(): void {
    if (!this.live) return;
    for (const [doc, initial] of this.documents) {
      if (doc.defaultView?.closed) { this.documents.delete(doc); continue; }
      doc.body.classList.toggle("keyline-next-no-hints", !this.enabled() || initial);
    }
  }
  dispose(): void {
    this.live = false;
    for (const [doc, initial] of this.documents) doc.body.classList.toggle("keyline-next-no-hints", initial);
    this.documents.clear();
  }
}
