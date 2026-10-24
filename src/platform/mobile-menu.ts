import { Platform } from "obsidian";

const pendingClicks = new WeakMap<Document, () => void>();
function suppressCompatibilityClick(doc: Document): void {
  pendingClicks.get(doc)?.();
  const win = doc.defaultView;
  if (!win) return;
  let timer: number | undefined;
  const stop = () => {
    doc.removeEventListener("click", suppress, true);
    doc.removeEventListener("pointerdown", stop, true);
    if (timer !== undefined) win.clearTimeout(timer);
    if (pendingClicks.get(doc) === stop) pendingClicks.delete(doc);
  };
  const suppress = (event: MouseEvent) => {
    if (!event.isTrusted || event.detail === 0) return;
    event.preventDefault(); event.stopImmediatePropagation(); stop();
  };
  // A submenu can appear under the finger before the browser synthesizes its
  // click. Capture on the document, not the replaced/covered original row.
  doc.addEventListener("click", suppress, true);
  doc.addEventListener("pointerdown", stop, true);
  timer = win.setTimeout(stop, 700);
  pendingClicks.set(doc, stop);
}

export function mobileDocument(doc: Document): boolean {
  return !!Platform?.isMobile || !!doc.body?.classList.contains("is-mobile");
}

/** Visual viewport excludes the software keyboard and accounts for panning. */
export function menuViewport(win: Window): { left: number; top: number; width: number; height: number } {
  const viewport = win.visualViewport;
  return {
    left: viewport?.offsetLeft ?? 0, top: viewport?.offsetTop ?? 0,
    width: viewport?.width ?? win.innerWidth, height: viewport?.height ?? win.innerHeight
  };
}

export function positionMobileMenu(root: HTMLElement, point: { x: number; y: number }): void {
  const win = root.ownerDocument.defaultView;
  if (!win) return;
  const area = menuViewport(win), margin = 8;
  const width = Math.max(0, area.width - margin * 2), height = Math.max(0, area.height - margin * 2);
  root.style.maxWidth = `${width}px`;
  root.style.maxHeight = `${Math.min(400, height)}px`;
  root.style.setProperty("--keyline-mobile-menu-height", `${Math.min(400, height)}px`);
  root.style.left = `${Math.max(area.left + margin, Math.min(point.x, area.left + area.width - root.offsetWidth - margin))}px`;
  root.style.top = `${Math.max(area.top + margin, Math.min(point.y, area.top + area.height - root.offsetHeight - margin))}px`;
}

export function watchMobileViewport(doc: Document, reposition: () => void): () => void {
  const viewport = mobileDocument(doc) ? doc.defaultView?.visualViewport : null;
  viewport?.addEventListener("resize", reposition);
  viewport?.addEventListener("scroll", reposition);
  return () => {
    viewport?.removeEventListener("resize", reposition);
    viewport?.removeEventListener("scroll", reposition);
    pendingClicks.get(doc)?.();
  };
}

/** Keep editor focus on a real tap. Scrolling/cancelled gestures never insert.
 * The explicit tap click works even when preventDefault suppresses compatibility
 * mouse events; suppress only the duplicate browser click, never mouse input. */
export function bindMobileMenuTouch(root: HTMLElement): void {
  if (!mobileDocument(root.ownerDocument)) return;
  let press: { id: number; x: number; y: number; row: HTMLElement } | undefined;
  const rowAt = (target: EventTarget | null) => {
    const row = (target as Element | null)?.closest<HTMLElement>("[role=option], [role=button], button");
    return row && root.contains(row) ? row : undefined;
  };
  root.addEventListener("pointerdown", event => {
    if (event.pointerType !== "touch") return;
    const row = rowAt(event.target);
    if (!event.isPrimary || !row) { press = undefined; return; }
    press = { id: event.pointerId, x: event.clientX, y: event.clientY, row };
    event.preventDefault();
  });
  root.addEventListener("pointermove", event => {
    if (press && event.pointerId === press.id && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 8) press = undefined;
  });
  root.addEventListener("pointercancel", () => { press = undefined; });
  root.addEventListener("pointerup", event => {
    const saved = press; press = undefined;
    if (!saved || event.pointerId !== saved.id || rowAt(event.target) !== saved.row ||
      Math.hypot(event.clientX - saved.x, event.clientY - saved.y) > 8) return;
    event.preventDefault(); suppressCompatibilityClick(root.ownerDocument); saved.row.click();
  });
}
