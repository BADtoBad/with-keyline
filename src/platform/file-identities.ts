import { getIcon, type App, type WorkspaceLeaf } from "obsidian";
import { identityGlyphs, paintIdentityGlyph } from "./identity-artwork";
import { kindIdentity, iconTintCss, identityResolver, validIconPath, type FileIdentity } from "../domain/icons";
import { attachedViews } from "./native-views";
import type { Preferences } from "../domain/preferences";
const owned = ".keyline-next-file-icon,.keyline-next-tab-icon,.keyline-next-bucket-icon";
const selectionColor = "--ncl-file-selection-color";
/** Guarded compatibility boundary: the SDK exposes neither explorer row nor tab
 * decoration. Native nodes are never removed/replaced. Unknown DOM or another
 * icon owner causes us to yield; no prototype patches or editor fallbacks. */
export class FileIdentities {
  private roots = new Map<HTMLElement, MutationObserver>();
  private documents = new Set<Document>();
  private spans = new Set<HTMLElement>();
  private bucketSlots = new Set<HTMLElement>();
  private selectionRows = new Map<HTMLElement, string>();
  private scheduled: ReturnType<typeof setTimeout> | undefined;
  private poll: ReturnType<typeof setInterval>;
  private live = true;
  private lastYield = false;
  constructor(private readonly app: App, private readonly prefs: () => Pick<Preferences, "fileIcons" | "monochrome" | "iconRules">,
    private readonly yielded: () => boolean = () => iconOwnerPresent(app)) {
    this.lastYield = yielded();
    // Plugin enable/disable is not a public workspace event. This cheap status
    // check resumes after Iconic relinquishes ownership, without rescanning.
    this.poll = setInterval(() => {
      const next = yielded();
      if (next !== this.lastYield) { this.lastYield = next; this.schedule(); }
    }, 1500);
  }
  private observe(root: HTMLElement): void {
    if (this.roots.has(root)) return;
    const Observer = root.ownerDocument.defaultView?.MutationObserver;
    if (!Observer) return;
    const observer = new Observer(records => {
      const relevant = records.some(record => {
        if ((record.target as Element).closest?.(owned)) return false;
        if (record.type === "attributes") return ["data-path", "class", "data-bucket-path", "data-bucket-kind", "aria-expanded"].includes(record.attributeName ?? "") ||
          !!(record.target as Element).closest?.(".workspace-tab-header-inner-icon,.bucket-entry-icon");
        const changed = [...Array.from(record.addedNodes), ...Array.from(record.removedNodes)];
        return changed.some(node => !(node.nodeType === 1 && (node as Element).matches(owned)));
      });
      if (relevant) this.schedule();
    });
    observer.observe(root, { childList: true, subtree: true, attributes: true });
    this.roots.set(root, observer);
    this.documents.add(root.ownerDocument);
  }
  private add(parent: HTMLElement, identity: FileIdentity, category: "file" | "tab" | "bucket", before: Element | null, icons: Set<string>,
    treeSlot = false): void {
    let span = Array.from(parent.children).find(e => e.matches(owned)) as HTMLElement | undefined;
    if (!span) {
      span = parent.ownerDocument.createElement("span");
      span.className = `keyline-next-${category}-icon${treeSlot ? " tree-item-icon" : ""}`;
      span.setAttribute("aria-hidden", "true");
    }
    const glyph = icons.has(identity.icon) ? identity.icon : kindIdentity(identity.category).icon;
    if (span.dataset.glyph !== glyph) { paintIdentityGlyph(span, glyph); span.dataset.glyph = glyph; }
    if (span.dataset.category !== identity.category) span.dataset.category = identity.category;
    const color = iconTintCss(identity.color);
    if (span.style.color !== color) span.style.color = color;
    if (!span.parentElement) parent.insertBefore(span, before);
    this.spans.add(span);
  }
  private paintSelection(row: HTMLElement, color: string): void {
    const current = row.style.getPropertyValue(selectionColor), written = this.selectionRows.get(row);
    // This is a theme contract, not a global label-color override. A preexisting
    // or later foreign inline value wins. Record CSSOM's actual written value.
    if (row.style.getPropertyPriority(selectionColor) || (written === undefined ? current !== "" : current !== written)) return;
    if (current !== color) row.style.setProperty(selectionColor, color);
    this.selectionRows.set(row, row.style.getPropertyValue(selectionColor));
  }
  private releaseSelection(row: HTMLElement): void {
    if (row.style.getPropertyValue(selectionColor) === this.selectionRows.get(row) && !row.style.getPropertyPriority(selectionColor))
      row.style.removeProperty(selectionColor);
    this.selectionRows.delete(row);
  }
  refresh(): void {
    if (!this.live) return;
    const prefs = this.prefs();
    if (!prefs.fileIcons) { this.clear(); return; }
    const explorer = attachedViews(this.app, "file-explorer").map(view => view.containerEl);
    const buckets = attachedViews(this.app, "bucket-sidebar-view").map(view => view.containerEl);
    const tabs: { root: HTMLElement; path: string; native: string }[] = [];
    this.app.workspace.iterateAllLeaves(leaf => {
      const header = (leaf as WorkspaceLeaf & { tabHeaderEl?: HTMLElement }).tabHeaderEl;
      const file = leaf.getViewState().state?.file;
      // Outline/backlink panes also carry the followed file in view state;
      // they are tools, not document tabs. Keep their semantic core icons.
      if (!header?.isConnected || !header.closest('.mod-root') || typeof file !== "string" || !this.app.vault.getAbstractFileByPath(file)) return;
      tabs.push({ root: header, path: file, native: leaf.view.getIcon().replace(/^lucide-/u, "") });
    });
    const current = new Set([...explorer, ...buckets, ...tabs.map(tab => tab.root)]);
    for (const [root, observer] of this.roots) if (!current.has(root)) {
      observer.disconnect(); this.roots.delete(root);
      root.querySelectorAll(owned).forEach(e => e.remove());
    }
    for (const root of current) this.observe(root);
    for (const doc of this.documents) if (doc.defaultView?.closed) this.documents.delete(doc);
    if (this.yielded()) { this.removeIcons(); return; }
    const icons = new Set(identityGlyphs());
    const resolve = identityResolver(prefs.iconRules, prefs.monochrome);
    const currentRows = new Set<HTMLElement>();
    for (const root of explorer) {
      for (const row of Array.from(root.querySelectorAll<HTMLElement>(".nav-file-title[data-path],.nav-folder-title[data-path]"))) {
        const filename = row.getAttribute("data-path") ?? "", folder = row.classList.contains("nav-folder-title");
        const label = row.querySelector(folder ? ".nav-folder-title-content" : ".nav-file-title-content");
        if (!label || !filename || !this.app.vault.getAbstractFileByPath(filename)) continue;
        if (row.querySelector(".nav-file-title-icon,.nav-folder-title-icon,.iconic-icon,.iconic-sidekick")) { row.querySelector(owned)?.remove(); continue; }
        const identity = resolve(filename, folder, !row.parentElement?.classList.contains("is-collapsed"));
        if (folder) {
          // Reuse the native hit target and indentation slot. Keep its actual
          // SVG node intact underneath our reversible presentation; an extra
          // inline icon would leave a second chevron column and shift labels.
          const indicator = row.querySelector<HTMLElement>(":scope > .tree-item-icon.collapse-icon,:scope > .nav-folder-collapse-indicator");
          if (!indicator || indicator.style.color || !nativeGlyphMatches(indicator, getIcon("right-triangle"))) {
            row.querySelector(owned)?.remove(); continue;
          }
          this.add(indicator, identity, "file", null, icons);
        } else {
          this.add(row, identity, "file", label, icons, true);
          this.paintSelection(row, iconTintCss(identity.color)); currentRows.add(row);
        }
      }
    }
    // Bucket's versioned DOM contract publishes reference paths, never icon
    // preferences. Decorate only its known entry slot, retaining the original
    // SVG and all of its controls. Space/group identity is not a file identity.
    const bucketSlots = new Set<HTMLElement>();
    for (const root of buckets) {
      for (const row of Array.from(root.querySelectorAll<HTMLElement>(".bucket-entry-row[data-bucket-path][data-bucket-kind]"))) {
        const path = row.dataset.bucketPath, kind = row.dataset.bucketKind;
        const slot = row.querySelector<HTMLElement>(":scope > .bucket-entry-icon");
        if (!slot || !validIconPath(path) || (kind !== "file" && kind !== "folder") ||
          row.matches(".iconic-icon,.iconic-sidekick") || row.querySelector(".iconic-icon,.iconic-sidekick") || slot.style.color ||
          !nativeGlyphMatches(slot, getIcon(kind === "folder" ? "folder" : "file-text"))) continue;
        const expanded = row.querySelector(":scope > .bucket-disclosure")?.getAttribute("aria-expanded") === "true";
        const identity = resolve(path, kind === "folder", expanded);
        this.add(slot, identity, "bucket", null, icons); bucketSlots.add(slot);
        if (kind === "file") { this.paintSelection(row, iconTintCss(identity.color)); currentRows.add(row); }
      }
    }
    for (const slot of this.bucketSlots) if (!bucketSlots.has(slot)) slot.querySelector(":scope > .keyline-next-bucket-icon")?.remove();
    this.bucketSlots = bucketSlots;
    for (const row of this.selectionRows.keys()) if (!currentRows.has(row)) this.releaseSelection(row);
    for (const tab of tabs) {
      const container = tab.root.querySelector<HTMLElement>(".workspace-tab-header-inner-icon");
      if (!container?.parentElement) continue;
      const expected = getIcon(tab.native);
      const safe = !tab.root.querySelector(".iconic-icon") && !container.style.color && nativeGlyphMatches(container, expected, true);
      if (!safe) { container.parentElement.querySelector(':scope > .keyline-next-tab-icon')?.remove(); continue; }
      // Keep our presentation OUTSIDE the host's icon-rendering container.
      // Core replaces its children during view-type changes; putting our node
      // inside it causes native SVGs to accumulate across image/Canvas changes.
      this.add(container.parentElement, resolve(tab.path), "tab", container.nextElementSibling, icons);
    }
    for (const span of this.spans) if (!span.isConnected) this.spans.delete(span);
  }
  schedule(): void {
    if (!this.live || this.scheduled !== undefined) return;
    this.scheduled = setTimeout(() => { this.scheduled = undefined; this.refresh(); }, 60);
  }
  private removeIcons(): void {
    for (const row of this.selectionRows.keys()) this.releaseSelection(row);
    for (const span of this.spans) span.remove();
    // Closing/reordering a native tab can temporarily clone its header for an
    // animation. Those copies are not in our Set or the live leaf hierarchy.
    // Remove only our namespaced spans, including such copies, in owned docs.
    for (const doc of this.documents) doc.querySelectorAll(owned).forEach(e => e.remove());
    this.spans.clear();
    this.bucketSlots.clear();
  }
  private clear(): void {
    for (const observer of this.roots.values()) observer.disconnect();
    this.roots.clear(); this.removeIcons(); this.documents.clear();
  }
  dispose(): void {
    this.live = false; clearInterval(this.poll);
    if (this.scheduled !== undefined) clearTimeout(this.scheduled);
    this.clear();
  }
}
/** Do not mask an unknown/new host glyph or another plugin's replacement. */
export function nativeGlyphMatches(container: HTMLElement, expected: SVGSVGElement | null, repeated = false): boolean {
  const native = Array.from(container.children).filter(e => !e.matches(owned));
  // Native image views can leave two identical host SVGs after changing the
  // leaf's view type. Decorate only if EVERY child is the exact expected glyph;
  // do not delete either one or accept a foreign/changed additional child.
  return Boolean(expected && (repeated ? native.length > 0 : native.length === 1) && native.every(element => sameGlyph(element, expected)));
}
function sameGlyph(element: Element, expected: SVGSVGElement): boolean {
  return element.tagName.toLowerCase() === "svg" &&
    ["viewBox", "fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin", "style"]
      .every(name => element.getAttribute(name) === expected.getAttribute(name)) &&
    element.childNodes.length === expected.childNodes.length &&
    Array.from(element.childNodes).every((node, i) => node.isEqualNode(expected.childNodes[i]));
}
export function iconOwnerPresent(app: App): boolean {
  const plugins = (app as App & { plugins?: { getPlugin?: (id: string) => unknown; plugins?: Record<string, unknown> } }).plugins;
  return Boolean(plugins?.getPlugin?.("iconic") ?? plugins?.plugins?.iconic);
}
