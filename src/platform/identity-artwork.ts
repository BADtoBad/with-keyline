import { getIcon, getIconIds } from "obsidian";
import { identityArtwork } from "../assets/identity-icons";
import { cleanIconChoice } from "../domain/icons";

export function identityGlyphs(): string[] {
  const host = getIconIds().map(id => id.replace(/^lucide-/u, ""))
    .filter(id => cleanIconChoice({ glyph: id }).glyph).sort();
  return [...new Set([...Object.keys(identityArtwork), ...host])];
}

/** Renders only into a plugin-owned slot. Never registers/replaces a host icon,
 * parses SVG markup or accepts user-provided paths. Native icon comparison stays
 * with getIcon in FileIdentities, independent of this visual asset adapter. */
export function paintIdentityGlyph(slot: HTMLElement, requested: string): void {
  const id = requested.replace(/^lucide-/u, "");
  const art = Object.prototype.hasOwnProperty.call(identityArtwork, id) ? identityArtwork[id] : undefined;
  const doc = slot.ownerDocument, ns = "http://www.w3.org/2000/svg";
  let svg: SVGSVGElement;
  if (art) {
    svg = doc.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    const path = doc.createElementNS(ns, "path");
    path.setAttribute("d", art.path); svg.appendChild(path);
    if (id === "keyline-file-image") { path.setAttribute("fill-rule", "evenodd"); path.setAttribute("clip-rule", "evenodd"); }
    svg.setAttribute("fill", art.filled ? "currentColor" : "none");
    svg.setAttribute("stroke", art.filled ? "none" : "currentColor");
    svg.setAttribute("stroke-width", art.filled ? "0" : "2");
    svg.setAttribute("stroke-linecap", "butt");
    svg.setAttribute("stroke-linejoin", "round");
    svg.dataset.paint = art.filled ? "fill" : "sharp-stroke";
  } else {
    const host = getIcon(id);
    if (!host) { paintIdentityGlyph(slot, "keyline-file-text"); return; }
    svg = doc.importNode(host, true); svg.dataset.paint = "stroke";
  }
  svg.classList.add("keyline-next-identity-artwork");
  svg.dataset.identity = id;
  svg.setAttribute("aria-hidden", "true"); svg.setAttribute("focusable", "false");
  slot.replaceChildren(svg);
}
