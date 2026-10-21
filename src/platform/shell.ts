import { Platform, setIcon, type App } from "obsidian";
import { footerGeometry } from "../domain/footer";
import { message } from "../strings";
import { ButtonKeys } from "./button-keys";
import { PresentationLease } from "./presentation";

type Parts = {
  workspace: HTMLElement; dock: HTMLElement; ribbon: HTMLElement;
  profile: HTMLElement; switcher: HTMLElement; name: HTMLElement; settings: HTMLElement; help: HTMLElement | null;
};
type Mounted = Parts & { space: HTMLElement; glyph: HTMLElement; lease: PresentationLease; removeListeners: (() => void)[] };
const shellSelector = ".workspace,.workspace-ribbon.mod-left,.mod-left-split,.workspace-sidedock-vault-profile";

/** Only the existing Keyline theme's opt-in token enables relocation. The
 * native nodes and native click/contextmenu handlers remain authoritative. */
class FooterDocument {
  private mounted?: Mounted;
  private observer?: MutationObserver;
  private resize?: ResizeObserver;
  private timer?: ReturnType<typeof setTimeout>;
  private live = true;
  private keys: ButtonKeys;
  private readonly onResize = () => this.schedule();
  private readonly onBlur = () => this.keys.clear();
  private readonly onFocus = () => {
    const current = this.doc.activeElement;
    if (current && this.mounted && [this.mounted.switcher, this.mounted.settings, this.mounted.help].includes(current as HTMLElement)) {
      this.focus(current as HTMLElement);
    }
  };
  constructor(private app: App, private doc: Document, private zh: () => boolean) {
    this.keys = new ButtonKeys(app);
    const win = doc.defaultView;
    if (!win || !doc.body) return;
    this.observer = new win.MutationObserver(records => {
      if (records.some(record => {
        if (record.type === "attributes") return [doc.body, this.mounted?.workspace, this.mounted?.dock, this.mounted?.ribbon].includes(record.target as HTMLElement);
        return [...Array.from(record.addedNodes), ...Array.from(record.removedNodes)].some(node =>
          node.nodeType === 1 && ((node as Element).matches(shellSelector) || !!(node as Element).querySelector(shellSelector)));
      })) this.schedule();
    });
    this.observer.observe(doc.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style"] });
    this.resize = new win.ResizeObserver(this.onResize);
    win.addEventListener("resize", this.onResize);
    win.addEventListener("blur", this.onBlur);
    win.addEventListener("focus", this.onFocus);
    this.refresh();
  }
  private activate(el: HTMLElement): void {
    if (!this.live || !this.mounted?.profile.contains(el) || !el.isConnected) return;
    const win = this.doc.defaultView, rect = el.getBoundingClientRect();
    if (!win || rect.width <= 0 || rect.height <= 0) return;
    // The real handler anchors its menu using the event's screen position.
    el.dispatchEvent(new win.MouseEvent("click", { bubbles: true, cancelable: true,
      clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2, view: win }));
  }
  private focus(el: HTMLElement): void { this.keys.focus(el, this.app.scope, () => this.activate(el)); }
  private discover(): Parts | undefined {
    const workspace = this.doc.querySelector<HTMLElement>(".workspace");
    const dock = workspace?.querySelector<HTMLElement>(":scope > .mod-left-split");
    const ribbon = workspace?.querySelector<HTMLElement>(":scope > .workspace-ribbon.mod-left");
    const profile = dock?.querySelector<HTMLElement>(":scope > .workspace-sidedock-vault-profile");
    if (!workspace || !dock || !ribbon || !profile || profile.matches(".ncl-shell-profile,.keyline-next-footer")) return;
    const switcher = profile.querySelector<HTMLElement>(".workspace-drawer-vault-switcher");
    const name = switcher?.querySelector<HTMLElement>(".workspace-drawer-vault-name");
    const settings = profile.querySelector(".workspace-drawer-vault-actions .lucide-settings")?.closest<HTMLElement>(".clickable-icon");
    const help = profile.querySelector(".workspace-drawer-vault-actions :is(svg.help,.lucide-circle-help,.lucide-help-circle)")?.closest<HTMLElement>(".clickable-icon") ?? null;
    if (switcher && name && settings) return { workspace, dock, ribbon, profile, switcher, name, settings, help };
  }
  private attach(parts: Parts): void {
    const { workspace, dock, ribbon, profile, switcher, settings, help } = parts;
    const lease = new PresentationLease(), space = this.doc.createElement("div"), glyph = this.doc.createElement("span");
    space.className = "ncl-shell-footer-space keyline-next-footer-space";
    space.setAttribute("aria-hidden", "true");
    glyph.className = "ncl-shell-vault-icon keyline-next-vault-glyph";
    glyph.setAttribute("aria-hidden", "true"); setIcon(glyph, "vault");
    const removeListeners: (() => void)[] = [];
    this.mounted = { ...parts, lease, space, glyph, removeListeners };
    lease.addClass(workspace, "ncl-shell-managed");
    lease.addClass(ribbon, "ncl-shell-ribbon");
    lease.addClass(profile, "ncl-shell-profile"); lease.addClass(profile, "keyline-next-footer");
    lease.addClass(settings, "ncl-shell-settings");
    if (help) lease.addClass(help, "ncl-shell-secondary");
    const focused = profile.contains(this.doc.activeElement) ? this.doc.activeElement as HTMLElement : undefined;
    profile.replaceWith(space); workspace.append(profile); switcher.prepend(glyph);
    for (const el of [switcher, settings, help].filter((el): el is HTMLElement => !!el)) {
      if (!el.getAttribute("role")) lease.attribute(el, "role", "button");
      if (!el.hasAttribute("tabindex")) lease.attribute(el, "tabindex", "0");
      lease.attribute(el, "data-tooltip-position", "top");
      lease.attribute(el, "title", null);
      const focus = () => this.focus(el), blur = () => this.keys.blur(el);
      const key = (event: KeyboardEvent) => {
        if (event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey || event.shiftKey || !["Enter", " "].includes(event.key)) return;
        event.preventDefault(); event.stopPropagation();
        if (!event.repeat) this.activate(el);
      };
      el.addEventListener("focus", focus); el.addEventListener("blur", blur); el.addEventListener("keydown", key);
      removeListeners.push(() => { el.removeEventListener("focus", focus); el.removeEventListener("blur", blur); el.removeEventListener("keydown", key); });
    }
    const quiet = (event: MouseEvent) => { if (profile.dataset.keylineFooterMode === "expanded") event.stopImmediatePropagation(); };
    switcher.addEventListener("mouseover", quiet, true);
    removeListeners.push(() => switcher.removeEventListener("mouseover", quiet, true));
    for (const el of [workspace, dock, ribbon, profile]) this.resize?.observe(el);
    focused?.focus({ preventScroll: true });
  }
  refresh(): void {
    if (!this.live) return;
    const win = this.doc.defaultView;
    const enabled = Platform.isDesktopApp && !this.doc.body.classList.contains("is-mobile") && win &&
      win.getComputedStyle(this.doc.body).getPropertyValue("--ncl-shell-controls").trim() === "1";
    if (!enabled) { this.detach(); return; }
    const previous = this.mounted;
    if (previous && (!previous.workspace.isConnected || !previous.dock.isConnected || !previous.ribbon.isConnected ||
      previous.profile.parentElement !== previous.workspace || previous.space.parentElement !== previous.dock ||
      !previous.profile.contains(previous.switcher) || !previous.profile.contains(previous.settings) ||
      previous.dock.querySelector(":scope > .workspace-sidedock-vault-profile"))) this.detach();
    if (!this.mounted) { const parts = this.discover(); if (parts) this.attach(parts); }
    const m = this.mounted;
    if (!m) return;
    const ribbonStyle = win.getComputedStyle(m.ribbon);
    const geometry = footerGeometry({
      workspace: m.workspace.getBoundingClientRect(), dock: m.dock.getBoundingClientRect(), ribbon: m.ribbon.getBoundingClientRect(),
      dockOpen: m.workspace.classList.contains("is-left-sidedock-open"),
      ribbonVisible: ribbonStyle.display !== "none" && ribbonStyle.visibility !== "hidden" && m.ribbon.getBoundingClientRect().width > 0
    });
    if (!geometry) { this.detach(); return; }
    m.lease.attribute(m.switcher, "aria-label", `${message("switchVault", this.zh())}: ${m.name.textContent ?? ""}`);
    m.lease.attribute(m.settings, "aria-label", message("shellSettings", this.zh()));
    if (m.help) m.lease.attribute(m.help, "aria-label", message("shellHelp", this.zh()));
    m.lease.attribute(m.profile, "data-keyline-footer-mode", geometry.compact ? "compact" : "expanded");
    // These classes/tokens form the existing theme's public presentation contract.
    m.lease.toggleClass(m.profile, "is-compact", geometry.compact);
    m.lease.style(m.profile, "display", geometry.hidden ? "none" : "");
    m.lease.style(m.profile, "left", `${geometry.left}px`);
    m.lease.style(m.profile, "width", `${geometry.width}px`);
    const height = geometry.hidden ? 0 : m.profile.getBoundingClientRect().height;
    if (!Number.isFinite(height)) { this.detach(); return; }
    m.space.style.height = `${geometry.compact ? 0 : height}px`;
    m.lease.style(m.ribbon, "--ncl-shell-footer-height", `${height}px`);
    const focused = this.doc.activeElement;
    if (focused && m.profile.contains(focused) && !(focused as HTMLElement).getBoundingClientRect().width) this.keys.clear();
  }
  schedule(): void {
    if (!this.live || this.timer !== undefined) return;
    this.timer = setTimeout(() => { this.timer = undefined; this.refresh(); }, 40);
  }
  private detach(): void {
    const m = this.mounted;
    if (!m) return;
    this.mounted = undefined; this.resize?.disconnect(); this.keys.clear();
    for (const remove of m.removeListeners) remove();
    m.glyph.remove(); m.lease.release();
    // If another owner moved the profile, do not move it back. If core removed
    // its original dock, remove our orphan rather than resurrecting old UI.
    if (m.profile.parentElement === m.workspace) {
      if (m.space.isConnected && m.space.parentElement === m.dock && !m.dock.querySelector(":scope > .workspace-sidedock-vault-profile")) m.space.replaceWith(m.profile);
      else m.profile.remove();
    }
    m.space.remove();
  }
  dispose(): void {
    this.live = false;
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.observer?.disconnect();
    const win = this.doc.defaultView;
    win?.removeEventListener("resize", this.onResize); win?.removeEventListener("blur", this.onBlur); win?.removeEventListener("focus", this.onFocus);
    this.detach(); this.keys.clear();
  }
}

export class ShellPresentation {
  private documents = new Map<Document, FooterDocument>();
  private live = true;
  constructor(private app: App, private zh: () => boolean) {}
  watch(doc: Document): void {
    if (!this.live || !doc.body || this.documents.has(doc)) return;
    this.documents.set(doc, new FooterDocument(this.app, doc, this.zh));
  }
  refresh(): void {
    if (!this.live) return;
    for (const [doc, footer] of this.documents) {
      if (doc.defaultView?.closed) { footer.dispose(); this.documents.delete(doc); }
      else footer.refresh();
    }
  }
  dispose(): void { this.live = false; for (const footer of this.documents.values()) footer.dispose(); this.documents.clear(); }
}
