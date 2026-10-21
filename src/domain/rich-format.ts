import { inProtectedSyntax, markdownTree } from "./blocks";
export interface SelectionEdit { from: number; to: number; insert: string; anchor: number; head: number }
export const tones = ["gray", "brown", "orange", "yellow", "green", "blue", "purple", "pink", "red"] as const;
export type Tone = typeof tones[number] | "default";
export type Ink = { text: Tone; background: Tone };
const plain: Ink = { text: "default", background: "default" };
export function toneColor(tone: Tone): string {
  return tone === "default" ? "inherit" : tone === "gray" ? "var(--text-muted)" :
    tone === "brown" ? "color-mix(in srgb, var(--color-orange) 62%, var(--text-muted))" : `var(--color-${tone})`;
}
export function inkStyle(ink: Ink): string {
  return [ink.text !== "default" ? `color: ${toneColor(ink.text)};` : "",
    ink.background !== "default" ? `background-color: color-mix(in srgb, ${toneColor(ink.background)} ${ink.background === "yellow" ? 42 : 22}%, transparent);` : ""].filter(Boolean).join(" ");
}
function wrap(text: string, ink: Ink): { value: string; prefix: number } {
  const style = inkStyle(ink);
  if (!style || !text) return { value: text, prefix: 0 };
  const open = `<span data-keyline-color="${ink.text}:${ink.background}" style="${style}">`;
  return { value: open + text + "</span>", prefix: open.length };
}
function validRange(text: string, from: number, to: number): boolean {
  return text.length <= 2 * 1024 * 1024 && Number.isInteger(from) && Number.isInteger(to) &&
    from >= 0 && to > from && to <= text.length && to - from <= 16000 && !/[\r\n]/u.test(text.slice(from, to));
}
function ownedInk(text: string, from: number, to: number) {
  const names = ["default", ...tones].join("|"), pattern = new RegExp(`<span data-keyline-color="(${names}):(${names})" style="([^"]*)">`, "gu");
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    const start = match.index, body = start + match[0].length, close = text.indexOf("</span>", body), end = close + 7;
    if (close < 0 || close - body > 16000 || /[\r\n]|<span\b/iu.test(text.slice(body, close))) continue;
    const ink: Ink = { text: match[1] as Tone, background: match[2] as Tone };
    if (match[3] !== inkStyle(ink)) continue; // Never unwrap arbitrary HTML/CSS.
    if (from === start && to === end) return { start, end, body, close, from: body, to: close, ink };
    if (from >= body && to <= close) return { start, end, body, close, from, to, ink };
  }
  return null;
}
/** Keep structural inline tokens intact. A selection can contain an entire
 * construct or lie inside its text, but cannot cut through its delimiters. Wiki
 * paths/aliases and image destinations are not ordinary editable label text. */
function inlineBoundarySafe(text: string, from: number, to: number, allowLinks: boolean): boolean {
  let safe = true, hasReferences = false;
  const tree = markdownTree(text);
  tree.iterate({ enter({ node }) { if (node.name === "LinkReference") hasReferences = true; } });
  tree.iterate({ from, to, enter({ node }) {
    if (node.to <= from || node.from >= to) return;
    if (!/^(?:StrongEmphasis|Emphasis|Strikethrough|Link|Image|Autolink|Escape)$/u.test(node.name)) return;
    const whole = from <= node.from && to >= node.to;
    // Lezer also calls unresolved [brackets] a Link. Whole literal brackets
    // can be escaped into a new label; actual references must stay untouched.
    const literalBrackets = node.name === "Link" && !node.getChild("URL") && !node.getChild("LinkLabel") && !hasReferences;
    if (/^(?:Link|Image|Autolink)$/u.test(node.name) && !allowLinks && !(literalBrackets && whole)) { safe = false; return false; }
    if (whole) return;
    if (node.name === "Image" || node.name === "Autolink" || node.name === "Escape") { safe = false; return false; }
    const mark = node.name === "Link" ? "LinkMark" : node.name === "Strikethrough" ? "StrikethroughMark" : "EmphasisMark";
    const marks = node.getChildren(mark), first = marks[0], last = node.name === "Link" ? marks[1] : marks[marks.length - 1];
    if (!first || !last || from < first.to || to > last.from) safe = false;
  } });
  const wiki = /!?\[\[[^\[\]\r\n]*\]\]/gu;
  let found: RegExpExecArray | null;
  while ((found = wiki.exec(text))) {
    let escapes = 0;
    for (let p = found.index - 1; p >= 0 && text[p] === "\\"; p--) escapes++;
    if (escapes % 2) continue;
    const end = found.index + found[0].length;
    if (from < end && to > found.index && (!allowLinks || from > found.index || to < end)) safe = false;
  }
  return safe;
}
export function selectionInk(text: string, from: number, to: number): Ink {
  return ownedInk(text, from, to)?.ink ?? { ...plain };
}
/** A partial recolour splits only our own wrapper into adjacent runs; no nested
 * spans and no recolouring of unselected text. Generated markup is fixed. */
export function colorSelection(text: string, from: number, to: number, patch: Partial<Ink>): SelectionEdit | null {
  if (!validRange(text, from, to)) return null;
  for (const value of Object.values(patch)) if (value !== "default" && !tones.includes(value as typeof tones[number])) return null;
  const own = ownedInk(text, from, to), start = own?.from ?? from, end = own?.to ?? to;
  const selected = text.slice(start, end);
  if (!selected.trim() || inProtectedSyntax(text, start, end) || !inlineBoundarySafe(text, start, end, true)) return null;
  const ink = { ...(own?.ink ?? plain), ...patch };
  const changed = wrap(selected, ink), before = own ? wrap(text.slice(own.body, start), own.ink).value : "";
  const after = own ? wrap(text.slice(end, own.close), own.ink).value : "";
  const insert = before + changed.value + after, editFrom = own?.start ?? from, editTo = own?.end ?? to;
  if (insert === text.slice(editFrom, editTo)) return null;
  const anchor = editFrom + before.length + changed.prefix;
  return { from: editFrom, to: editTo, insert, anchor, head: anchor + selected.length };
}
export interface SelectedLink { from: number; to: number; label: string; destination: string; kind: "wiki" | "url"; title?: string }
/** Recognise a whole link or any selection wholly within its label. Images and
 * reference-style links are intentionally left to the native link editor. */
export function selectedLink(text: string, from: number, to: number): SelectedLink | null {
  if (!validRange(text, from, to) || inProtectedSyntax(text, from, to)) return null;
  const wiki = /!?\[\[([^\[\]\r\n|]+)(?:\|([^\[\]\r\n]*))?\]\]/gu;
  let match: RegExpExecArray | null;
  while ((match = wiki.exec(text))) {
    if (match[0].startsWith("!")) continue;
    let escapes = 0;
    for (let p = match.index - 1; p >= 0 && text[p] === "\\"; p--) escapes++;
    if (escapes % 2) continue;
    const start = match.index, end = start + match[0].length;
    const label = match[2] ?? match[1], body = start + 2 + (match[2] === undefined ? 0 : match[1].length + 1);
    if (from === start && to === end || from >= body && to <= body + label.length)
      return { from: start, to: end, label, destination: match[1], kind: "wiki" };
  }
  let found: SelectedLink | null = null;
  markdownTree(text).iterate({ from, to, enter({ node }) {
    if (node.name === "Image") return false;
    if (node.name !== "Link") return;
    const url = node.getChild("URL"), marks = node.getChildren("LinkMark");
    if (!url || marks.length < 4 || text.slice(marks[1].from, marks[1].to) !== "]") return;
    const start = marks[0].to, end = marks[1].from;
    if (from === node.from && to === node.to || from >= start && to <= end)
      found = { from: node.from, to: node.to, label: text.slice(start, end),
        destination: text.slice(url.from, url.to).replace(/^<|>$/gu, ""), kind: "url", title: text.slice(url.to, node.to - 1) };
  } });
  return found;
}
export function externalDestination(input: string): string | null {
  const value = input.trim();
  if (!value || /[\x00-\x20<>"]/u.test(value)) return null;
  try {
    const url = new URL(value);
    if (!["https:", "http:", "mailto:"].includes(url.protocol) || url.username || url.password) return null;
    if (url.protocol === "mailto:" && !url.pathname) return null;
    return url.href;
  } catch { return null; }
}
function escapeLabel(label: string): string {
  let result = "", escapes = 0;
  for (const ch of label) {
    if ((ch === "[" || ch === "]") && escapes % 2 === 0) result += "\\";
    result += ch; escapes = ch === "\\" ? escapes + 1 : 0;
  }
  return result;
}
export function externalLinkEdit(text: string, from: number, to: number, destination: string): SelectionEdit | null {
  if (!validRange(text, from, to) || inProtectedSyntax(text, from, to)) return null;
  const target = externalDestination(destination);
  if (!target) return null;
  const old = selectedLink(text, from, to), selected = text.slice(from, to);
  if (!old && (!selected.trim() || !inlineBoundarySafe(text, from, to, false) || /!?\[\[|\]\(/u.test(selected))) return null;
  const label = old?.kind === "url" ? old.label : escapeLabel(old?.label ?? selected);
  const insert = `[${label}](<${target}>${old?.title ?? ""})`, start = old?.from ?? from, end = old?.to ?? to;
  if (text.slice(start, end) === insert) return null;
  return { from: start, to: end, insert, anchor: start + 1, head: start + 1 + label.length };
}
export function unlinkSelection(text: string, from: number, to: number): SelectionEdit | null {
  const link = selectedLink(text, from, to);
  return link ? { from: link.from, to: link.to, insert: link.label, anchor: link.from, head: link.from + link.label.length } : null;
}
