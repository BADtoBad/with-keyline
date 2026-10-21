import { inProtectedSyntax, markdownTree } from "./blocks";
export const MAX_WRITING_UNITS = 2 * 1024 * 1024;
export interface Span { from: number; to: number }
export interface HostToken extends Span { name: string }
export interface Marker extends Span { kind: "strong" | "em" | "strikethrough" | "code" | "header" | "escape" }
export interface Suspicious extends Span { kind: "emphasis" | "strike" | "backtick" }
export interface WritingAnalysis { hidden: Marker[]; suspicious: Suspicious[] }
/** Include one adjacent visible glyph: native Live Preview can hide even an
 * unpaired delimiter while its line is inactive. Never cross a line boundary. */
export function warningRange(text: string, range: Span): Span {
  let at = range.to;
  while (at < text.length && /[ \t]/u.test(text[at])) at++;
  if (at < text.length && text[at] !== "\n" && text[at] !== "\r")
    return { from: range.from, to: at + (text.codePointAt(at)! > 0xffff ? 2 : 1) };
  at = range.from - 1;
  while (at >= 0 && /[ \t]/u.test(text[at])) at--;
  if (at >= 0 && text[at] !== "\n" && text[at] !== "\r") {
    if (/[\udc00-\udfff]/u.test(text[at]) && at > 0 && /[\ud800-\udbff]/u.test(text[at - 1])) at--;
    return { from: at, to: range.to };
  }
  return range;
}
const opaque = /^(?:FencedCode|CodeBlock|InlineCode|HTMLBlock|HTMLTag|URL|Autolink|LinkReference|HorizontalRule|KeylineFrontmatter|Keyline(?:Inline)?Math|Keyline(?:Inline)?Comment)$/u;
function merged(spans: readonly Span[]): Span[] {
  const result: Span[] = [];
  for (const span of [...spans].sort((a, b) => a.from - b.from)) {
    const previous = result[result.length - 1];
    if (previous && span.from <= previous.to) previous.to = Math.max(previous.to, span.to);
    else result.push({ from: span.from, to: span.to });
  }
  return result;
}
function preceding(at: number, spans: readonly Span[]): number {
  let lo = 0, hi = spans.length;
  while (lo < hi) { const mid = (lo + hi) >>> 1; if (spans[mid].from <= at) lo = mid + 1; else hi = mid; }
  return lo - 1;
}
const covered = (range: Span, spans: readonly Span[]) => { const i = preceding(range.from, spans); return i >= 0 && spans[i].to >= range.to; };
const intersects = (range: Span, spans: readonly Span[]) => { const i = preceding(range.to - 1, spans); return i >= 0 && spans[i].to > range.from; };
function* matches(text: string, expression: RegExp) { let match: RegExpExecArray | null; while ((match = expression.exec(text))) yield match; }
const escapesAt = (text: string, at: number) => { let n = 0; while (at > 0 && text[--at] === "\\") n++; return n % 2 === 1; };

/** Intersection of actual host tokens and structurally paired Markdown.
 * A stream parser may colour an unmatched opening delimiter as valid. */
export function analyzeWriting(text: string, tokens: readonly HostToken[]): WritingAnalysis {
  const hidden: Marker[] = [], suspicious: Suspicious[] = [], protectedRanges: Span[] = [], confirmed: Marker[] = [];
  if (text.length > MAX_WRITING_UNITS) return { hidden, suspicious };
  markdownTree(text).iterate({ enter(node) {
    if (opaque.test(node.name)) protectedRanges.push({ from: node.from, to: node.to });
    const parent = node.node.parent?.name;
    let kind: Marker["kind"] | undefined, to = node.to;
    if (node.name === "EmphasisMark" && parent === "StrongEmphasis") kind = "strong";
    else if (node.name === "EmphasisMark" && parent === "Emphasis") kind = "em";
    else if (node.name === "StrikethroughMark" && parent === "Strikethrough") kind = "strikethrough";
    else if (node.name === "CodeMark" && parent === "InlineCode") kind = "code";
    else if (node.name === "HeaderMark" && parent?.startsWith("ATXHeading")) {
      kind = "header";
      // Only consume the adjacent heading separator, never a newline.
      while (/[ \t]/u.test(text[to] ?? "") && to < text.length) to++;
    } else if (node.name === "Escape" && text[node.from] === "\\") { kind = "escape"; to = node.from + 1; }
    if (kind) confirmed.push({ from: node.from, to, kind });
  } });
  const hostRanges = new Map<Marker["kind"], Span[]>();
  for (const kind of ["strong", "em", "strikethrough", "code", "header", "escape"] as const)
    hostRanges.set(kind, merged(tokens.filter(t => t.name.split("_").includes(`formatting-${kind}`) &&
      !/(?:hmd-frontmatter|hmd-codeblock|comment|math)/u.test(t.name))));
  // The host and structural parser may divide a *** / ___ run into em+strong
  // in opposite orders, or the host labels the entire run as strong. Both
  // must still confirm every hidden character; the
  // emphasis subtype boundary inside one delimiter run is not significant.
  const emphasisRanges = merged([...hostRanges.get("strong")!, ...hostRanges.get("em")!]);
  for (const marker of confirmed) {
    const host = marker.kind === "strong" || marker.kind === "em" ? emphasisRanges : hostRanges.get(marker.kind)!;
    if (covered(marker, host)) hidden.push(marker);
  }
  // Wiki destinations/aliases and native URL tokens are not candidates for
  // unsolicited syntax advice. Link labels can still contain real formatting.
  for (const match of matches(text, /\[\[[^\]\r\n]*(?:\]\]|$)/gu)) protectedRanges.push({ from: match.index, to: match.index + match[0].length });
  for (const token of tokens) if (/(?:^|_)(?:url|hmd-frontmatter|hmd-codeblock|comment|math)(?:_|$)/u.test(token.name))
    protectedRanges.push(token);
  const sorted = merged(confirmed), protectedUnion = merged(protectedRanges);
  for (const match of matches(text, /`+|\*{2,}|_{2,}|~{2,}/gu)) {
    const from = match.index, to = from + match[0].length;
    if (escapesAt(text, from) || covered({ from, to }, sorted) || intersects({ from, to }, protectedUnion)) continue;
    // Literal underscores inside words are not emphasis.
    if (match[0][0] === "_" && /[\p{L}\p{N}]/u.test(text[from - 1] ?? "") && /[\p{L}\p{N}]/u.test(text[to] ?? "")) continue;
    suspicious.push({ from, to, kind: match[0][0] === "`" ? "backtick" : match[0][0] === "~" ? "strike" : "emphasis" });
  }
  return { hidden, suspicious };
}

export interface BracketEdit extends Span { insert: string; cursor: number }
/** Only a short, explicitly typed bracket pair is eligible. Never scan/rewrite
 * a pasted document, a selected range, escaped text or an opaque syntax block. */
export function bracketEdit(text: string, from: number, to: number, input: string): BracketEdit | null {
  if (text.length > MAX_WRITING_UNITS || from !== to || !Number.isInteger(from) || from < 0 || to > text.length || !/^(?:【{1,2}|】{1,2})$/u.test(input)) return null;
  const char = input[0], need = 2 - input.length;
  if (need && text[from - 1] !== char) return null;
  const start = from - need, before = text.slice(0, start);
  if (start < 0 || escapesAt(text, start) || inProtectedSyntax(text, start)) return null;
  const line = before.slice(before.lastIndexOf("\n") + 1);
  if (line.lastIndexOf("](") > line.lastIndexOf(")") || (line.match(/(?<!\\)`+/gu) ?? []).length % 2) return null;
  const open = line.lastIndexOf("[[") > line.lastIndexOf("]]");
  if (char === "【") {
    if (open) return null;
    return { from: start, to, insert: text.slice(to, to + 2) === "]]" ? "[[" : "[[]]", cursor: start + 2 };
  }
  if (!open) return null;
  return { from: start, to: text.slice(to, to + 2) === "]]" ? to + 2 : to, insert: "]]", cursor: start + 2 };
}
