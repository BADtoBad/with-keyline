import { inProtectedSyntax } from "./blocks";
import type { InsertPlan } from "./insertion";

const imageExtensions = ["avif", "bmp", "gif", "jpeg", "jpg", "png", "svg", "webp"];
export const imageAccept = imageExtensions.map(e => "." + e).join(",") + ",image/avif,image/bmp,image/gif,image/jpeg,image/png,image/svg+xml,image/webp";
export function isImageName(name: string): boolean { const dot = name.lastIndexOf("."); return dot >= 0 && imageExtensions.includes(name.slice(dot + 1).toLowerCase()); }
/** A browser File supplies a basename, never a destination. Keep ordinary names
 * but make hostile/synthetic basenames inert before asking the host for a path. */
export function attachmentName(name: string): string {
  let result = "";
  for (const ch of name.trim()) result += ch.charCodeAt(0) < 32 || ch.charCodeAt(0) === 127 || '\\/:*?"<>|'.includes(ch) ? "-" : ch;
  return result.replace(/^\.+/u, "").replace(/[. ]+$/u, "") || "attachment";
}
const label = (text: string) => text.replace(/[\\[\]]/gu, "\\$&");
/** Preserve host-relative targets; attachments are readable Markdown links even
 * in a wiki-link Vault, while image imports keep the host's link notation. */
export function attachmentLink(generated: string, basename: string, image: boolean, embed: boolean): string | null {
  const source = generated.trim().replace(/^!/u, "");
  if (image) return source.startsWith("[[") && source.endsWith("]]") || source.startsWith("[") && source.endsWith(")") ? "!" + source : null;
  let result: string;
  if (source.startsWith("[[") && source.endsWith("]]")) {
    const body = source.slice(2, -2), split = body.indexOf("|"), target = split < 0 ? body : body.slice(0, split);
    if (!target || /[\[\]\r\n]/u.test(target)) return null;
    const title = split < 0 ? basename : body.slice(split + 1).trim() || basename;
    // Encode path segments, not URI delimiters: a literal # or % is part of
    // the saved filename here, never a heading or pre-encoded escape sequence.
    const destination = target.split("/").map(part => encodeURIComponent(part).replace(/[!'()*]/gu, ch => "%" + ch.charCodeAt(0).toString(16).toUpperCase())).join("/");
    result = `[${label(title)}](${destination})`;
  } else if (source.startsWith("[") && source.endsWith(")") && source.includes("](")) {
    result = source.startsWith("[](") ? `[${label(basename)}]${source.slice(2)}` : source;
  } else return null;
  return (embed ? "!" : "") + result;
}
/** Imports belong after the physical line, not between its prefix and suffix.
 * Only the explicit trigger is removed. Preserve the suffix in the same native
 * transaction, including whitespace; existing line endings stay byte-identical.
 * A manual selection is not a trigger: the caller passes its head as a point. */
export function planAttachmentInsertion(text: string, from: number, to: number, links: string): InsertPlan | null {
  if (!links || inProtectedSyntax(text, from, to) || /[\r\n]/u.test(text.slice(from, to))) return null;
  const start = from === 0 ? 0 : text.lastIndexOf("\n", from - 1) + 1;
  const newline = text.indexOf("\n", to);
  const end = newline < 0 ? text.length : newline > 0 && text[newline - 1] === "\r" ? newline - 1 : newline;
  if (to > end) return null;
  const suffix = text.slice(to, end), line = text.slice(start, from) + suffix;
  const eol = text.match(/\r?\n/u)?.[0] ?? "\n";
  const insert = suffix + (line.trim() ? eol : "") + links.replace(/\r?\n/gu, eol);
  const caret = from + insert.length;
  return { from, to: end, before: text.slice(from, end), insert, anchor: caret, head: caret };
}
