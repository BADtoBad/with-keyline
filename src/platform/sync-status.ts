import { getIcon, Platform } from "obsidian";
import { syncStatus } from "../domain/sync-status";
import { PresentationLease } from "./presentation";

type Paint = { item: HTMLElement; content: HTMLElement; tokens: { token: HTMLElement; source: HTMLElement; svg: SVGSVGElement }[]; lease: PresentationLease };
const itemSelector = ".status-bar > .syncstatusbar";

/** Own only inserted wrappers and two theme classes. Do not read plugin
 * internals, settings, databases or network state; never replace native items
 * or their handlers. Foreign structured content always wins. */
export class SyncStatusDocument {
  private observer: MutationObserver;
  private timer?: number;
  private live = true;
  private painted: Paint[] = [];
  private readonly win: Window & typeof globalThis;
  private schedule = () => {
    if (!this.live || this.timer !== undefined) return;
    this.timer = this.win.setTimeout(() => { this.timer = undefined; this.refresh(); }, 30);
  };
  constructor(private doc: Document, private onDispose: () => void = () => {}) {
    this.win = doc.defaultView as Window & typeof globalThis;
    this.observer = new this.win.MutationObserver(records => {
      if (records.some(r => (r.type === "attributes" && r.target === doc.body) ||
        this.painted.some(paint => paint.item === r.target || paint.content.contains(r.target)) ||
        (r.target.nodeType === 1 ? r.target as Element : r.target.parentElement)?.closest(".syncstatusbar") ||
        [...Array.from(r.addedNodes), ...Array.from(r.removedNodes)].some(node => node.nodeType === 1 &&
          ((node as Element).matches(".status-bar,.syncstatusbar") || (node as Element).querySelector(".status-bar,.syncstatusbar"))))) this.schedule();
    });
    this.win.addEventListener("pagehide", this.dispose);
    this.refresh();
  }
  private release(): void {
    for (const paint of this.painted) {
      // Unwrap our current content rather than restoring a captured old string.
      // If another plugin replaced/moved children, retain those foreign nodes.
      for (const { token, source, svg } of paint.tokens) {
        if (svg.parentNode === token) svg.remove();
        if (source.parentNode === token) source.replaceWith(...Array.from(source.childNodes));
        if (token.parentNode) token.replaceWith(...Array.from(token.childNodes));
      }
      if (paint.content.parentNode) paint.content.replaceWith(...Array.from(paint.content.childNodes));
      paint.lease.release();
    }
    this.painted = [];
  }
  refresh(): void {
    if (!this.live) return;
    this.observer.disconnect(); this.release();
    const enabled = Platform.isDesktopApp && !this.doc.body.classList.contains("is-mobile") &&
      this.win.getComputedStyle(this.doc.body).getPropertyValue("--ncl-shell-controls").trim() === "1";
    if (enabled) for (const item of Array.from(this.doc.querySelectorAll<HTMLElement>(itemSelector))) {
      if (item.matches(".ncl-sync-known,.ncl-sync-attention") || Array.from(item.childNodes).some(node => node.nodeType !== 3)) continue;
      const plan = syncStatus(item.textContent ?? ""); if (!plan) continue;
      const content = this.doc.createElement("span"); content.className = "keyline-next-sync-content";
      const paint: Paint = { item, content, tokens: [], lease: new PresentationLease() };
      for (const part of plan.parts) {
        const icon = part.icon && getIcon(part.icon);
        if (!icon || icon.textContent) { content.append(this.doc.createTextNode(part.text)); continue; }
        const token = this.doc.createElement("span"), source = this.doc.createElement("span");
        const svg = this.doc.importNode(icon, true);
        token.className = "keyline-next-sync-token"; if (part.warning) token.classList.add("is-warning");
        source.className = "keyline-next-sync-source"; source.textContent = part.text;
        svg.setAttribute("aria-hidden", "true"); svg.setAttribute("focusable", "false");
        token.append(source, svg); content.append(token); paint.tokens.push({ token, source, svg });
      }
      paint.lease.addClass(item, plan.attention ? "ncl-sync-attention" : "ncl-sync-known");
      item.replaceChildren(content); this.painted.push(paint);
    }
    this.observer.observe(this.doc.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["class"] });
  }
  dispose = (): void => {
    if (!this.live) return; this.live = false; this.observer.disconnect();
    if (this.timer !== undefined) this.win.clearTimeout(this.timer);
    this.timer = undefined; this.win.removeEventListener("pagehide", this.dispose); this.release(); this.onDispose();
  };
}

export class SyncStatusPresentation {
  private docs = new Map<Document, SyncStatusDocument>();
  private live = true;
  watch(doc: Document): void {
    if (!this.live || !doc.body || !doc.defaultView || doc.defaultView.closed || this.docs.has(doc)) return;
    this.docs.set(doc, new SyncStatusDocument(doc, () => this.docs.delete(doc)));
  }
  refresh(): void {
    if (!this.live) return;
    for (const [doc, presentation] of this.docs) {
      if (!doc.defaultView || doc.defaultView.closed) { presentation.dispose(); this.docs.delete(doc); }
      else presentation.refresh();
    }
  }
  dispose(): void { this.live = false; for (const presentation of this.docs.values()) presentation.dispose(); this.docs.clear(); }
}
