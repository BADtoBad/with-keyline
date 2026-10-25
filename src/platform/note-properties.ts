import type { App, View } from "obsidian";
import { PresentationLease } from "./presentation";
import { PropertyCalendar } from "./property-calendar";

type Entry = { key: string; value: unknown };
type NativeRow = { entry: Entry; containerEl: HTMLElement };
type NativeProperties = {
  containerEl: HTMLElement;
  properties: Entry[];
  rendered: NativeRow[];
  invalidFrontmatter: boolean;
  synchronize(value: Record<string, unknown>): void;
};
type PropertyView = View & {
  file?: { extension: string } | null;
  metadataEditor?: NativeProperties;
  canShowProperties?(): boolean;
};

/** Native metadata is not a public API. Feature-detect the narrow adapter and
 * fail closed; never parse, rewrite or save frontmatter from this feature. */
export function supportsProperties(view: PropertyView): boolean {
  const m = view.metadataEditor;
  return view.file?.extension === "md" && typeof view.canShowProperties === "function" &&
    !!m?.containerEl && typeof m.synchronize === "function" &&
    Array.isArray(m.properties) && Array.isArray(m.rendered) &&
    typeof m.invalidFrontmatter === "boolean";
}

export function needsPropertyDraft(view: PropertyView): boolean {
  return supportsProperties(view) && view.canShowProperties!() &&
    !view.metadataEditor!.invalidFrontmatter && view.metadataEditor!.properties.length === 0;
}

const emptyClass = "keyline-next-empty-properties";

/** One mount per real Markdown leaf, not an embed, hover preview or sidebar.
 * The empty row is a native unsaved draft, exactly as after Add property.
 * synchronize() does not focus, open suggestions, change types or save a file. */
export class PropertyDraft {
  private row?: NativeRow;
  private live = true;
  private observer?: MutationObserver;
  private timer?: ReturnType<typeof setTimeout>;
  private metadata: NativeProperties;
  private labels = new PresentationLease();
  private calendar?: PropertyCalendar;
  private readonly dateClick = (event: MouseEvent): void => {
    if (!this.live || !event.isTrusted || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    const target = event.target as HTMLInputElement | null;
    if (!target || target.tagName !== "INPUT" || !["date", "datetime-local"].includes(target.type) ||
      !target.closest(".metadata-property-value") || target.disabled || target.readOnly) return;
    if (this.openCalendar(target)) { event.preventDefault(); event.stopPropagation(); return; }
    // Mobile/unsupported hosts keep their native picker within this gesture.
    try { target.showPicker?.(); } catch { /* Keep the native date input usable. */ }
  };
  private readonly dateKey = (event: KeyboardEvent): void => {
    if (!event.isTrusted || event.isComposing || !event.altKey || event.key !== "ArrowDown" || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const target = event.target as HTMLInputElement | null;
    if (target?.tagName === "INPUT" && target.closest(".metadata-property-value") && this.openCalendar(target)) {
      event.preventDefault(); event.stopPropagation();
    }
  };
  private openCalendar(input: HTMLInputElement): boolean {
    if (!this.live || input.disabled || input.readOnly || !PropertyCalendar.supported(input)) return false;
    const file = this.view.file, type = input.type;
    this.calendar?.close();
    this.calendar = new PropertyCalendar(input, this.zh(), () => this.live && this.view.file === file &&
      this.view.metadataEditor === this.metadata && this.metadata.containerEl.contains(input) &&
      this.view.canShowProperties!() && !this.metadata.invalidFrontmatter && input.type === type);
    return true;
  }
  constructor(private view: PropertyView, private zh: () => boolean = () => false) {
    this.metadata = view.metadataEditor!;
    const win = view.containerEl.ownerDocument.defaultView;
    if (win) {
      this.observer = new win.MutationObserver(records => {
        if (records.some(r => r.target === this.metadata.containerEl ||
          this.metadata.containerEl.contains(r.target) ||
          (r.type === "attributes" && (r.target as Element).matches(".markdown-source-view,.markdown-preview-view")) ||
          Array.from(r.addedNodes).some(n => n === this.metadata.containerEl || n.contains(this.metadata.containerEl)))) this.schedule();
      });
      this.observer.observe(view.containerEl, { childList: true, subtree: true, attributes: true,
        attributeFilter: ["data-property-count", "data-property-key", "class"] });
    }
    this.metadata.containerEl.addEventListener("click", this.dateClick, true);
    this.metadata.containerEl.addEventListener("keydown", this.dateKey, true);
    this.refresh();
  }
  matches(view: PropertyView): boolean { return view === this.view && view.metadataEditor === this.metadata; }
  private schedule(): void {
    if (!this.live || this.timer !== undefined) return;
    this.timer = setTimeout(() => { this.timer = undefined; this.refresh(); }, 30);
  }
  refresh(): void {
    this.calendar?.refresh();
    if (!this.live || this.view.metadataEditor !== this.metadata || !supportsProperties(this.view)) return;
    const m = this.metadata;
    if (!this.view.canShowProperties!() || m.invalidFrontmatter) {
      this.labels.release();
      this.removeEmptyDraft();
      m.containerEl.classList.remove(emptyClass);
      return;
    }
    if (needsPropertyDraft(this.view)) {
      m.synchronize({ "": null });
      this.row = m.rendered.find(r => r.entry.key === "");
    }
    const empty = m.properties.length === 1 && m.properties[0].key === "" && !m.invalidFrontmatter;
    m.containerEl.classList.toggle(emptyClass, empty);
    if (empty) {
      const row = m.rendered[0]?.containerEl;
      const key = row?.querySelector<HTMLElement>(".metadata-property-key-input");
      const value = row?.querySelector<HTMLElement>(".metadata-property-value [contenteditable=true]");
      if (key) this.labels.attribute(key, "aria-label", this.zh() ? "属性名" : "Property name");
      if (value) this.labels.attribute(value, "aria-label", this.zh() ? "属性值" : "Property value");
    } else this.labels.release();
  }
  private removeEmptyDraft(): void {
    const m = this.metadata, row = this.row;
    this.row = undefined;
    // Do not remove a draft the user started filling, or a different row
    // created by core/another plugin after changing files or undoing.
    if (!row || !m.rendered.includes(row) || row.entry.key !== "" || row.entry.value != null ||
      m.invalidFrontmatter || m.properties.length !== 1 ||
      Array.from(row.containerEl.querySelectorAll<HTMLInputElement | HTMLElement>("input,[contenteditable=true]"))
        .some(e => (e.tagName === "INPUT" ? (e as HTMLInputElement).value : e.textContent)?.trim())) return;
    const focused = row.containerEl.ownerDocument.activeElement;
    if (focused && row.containerEl.contains(focused)) (focused as HTMLElement).blur();
    m.synchronize({});
  }
  dispose(): void {
    this.live = false;
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.observer?.disconnect();
    this.labels.release();
    this.calendar?.close();
    this.metadata.containerEl.removeEventListener("click", this.dateClick, true);
    this.metadata.containerEl.removeEventListener("keydown", this.dateKey, true);
    this.metadata.containerEl.classList.remove(emptyClass);
    this.removeEmptyDraft();
  }
}

export class NoteProperties {
  private mounts = new Map<View, PropertyDraft>();
  private live = true;
  constructor(private app: App, private zh: () => boolean = () => false) {}
  refresh(): void {
    if (!this.live) return;
    const views = new Set(this.app.workspace.getLeavesOfType("markdown").map(l => l.view));
    for (const [view, mount] of this.mounts) if (!views.has(view)) {
      mount.dispose(); this.mounts.delete(view);
    }
    for (const view of views) {
      if (!supportsProperties(view as PropertyView)) continue;
      let mount = this.mounts.get(view);
      if (mount && !mount.matches(view as PropertyView)) { mount.dispose(); this.mounts.delete(view); mount = undefined; }
      if (!mount) { mount = new PropertyDraft(view as PropertyView, this.zh); this.mounts.set(view, mount); }
      else mount.refresh();
    }
  }
  dispose(): void {
    this.live = false;
    for (const mount of this.mounts.values()) mount.dispose();
    this.mounts.clear();
  }
}
