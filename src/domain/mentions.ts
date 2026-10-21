export interface MentionRange { start: number; end: number; query: string }
export type DateChoice = { kind: "date"; key: "today" | "tomorrow" | "yesterday" | "now"; label: string; insert: string };
export type PageChoice = { kind: "page"; path: string; label: string };
export type MentionChoice = DateChoice | PageChoice;
export interface PageRecord { path: string; name: string; modified?: number }
export function safeWikiTarget(path: string): boolean { return !/[\[\]|#^\r\n]/u.test(path); }

/**
 * Suggestions are a view over literal input, never an eager text conversion.
 * Chinese prose need not put a space before @. ASCII word/email tails remain
 * excluded, along with the protected Markdown contexts checked below.
 */
export function mentionAt(line: string, cursor: number): MentionRange | null {
  if (!Number.isInteger(cursor) || cursor < 0 || cursor > line.length) return null;
  const prefix = line.slice(0, cursor);
  const start = prefix.lastIndexOf("@");
  if (start < 0) return null;
  // Read a full code point so supplementary Han characters work as well.
  const previous = Array.from(prefix.slice(0, start)).pop();
  if (previous && !/[\s([{"'“‘（【\p{Script=Han}，。！？：；、）》」』】”’]/u.test(previous)) return null;
  const query = prefix.slice(start + 1);
  if (query.length > 80 || /[@\r\n\t<>[\]`\\]/u.test(query)) return null;
  if (/^\s/u.test(query)) return null;
  // A period starts email/URL-like input; do not hijack it.
  if (query.includes(".")) return null;
  if (prefix.slice(0, start).includes("[[")) {
    const before = prefix.slice(0, start);
    if (before.lastIndexOf("[[") > before.lastIndexOf("]]")) return null;
  }
  // Escaped literal @, inline code, links and indented code are excluded.
  if (/^(?: {4}|\t)/u.test(line)) return null;
  const before = prefix.slice(0, start);
  if ((before.match(/(?<!\\)`+/gu) ?? []).length % 2 !== 0) return null;
  if (before.lastIndexOf("](") > before.lastIndexOf(")")) return null;
  return { start, end: cursor, query };
}

/** Continue an already-owned literal range, not a new trigger decision. Query
 * punctuation/words do not turn an open menu into an email detector. */
export function mentionSessionAt(line: string, cursor: number, start: number): MentionRange | null {
  if (!Number.isInteger(cursor) || !Number.isInteger(start) || start < 0 || cursor <= start || cursor > line.length || line[start] !== "@") return null;
  const query = line.slice(start + 1, cursor);
  if (query.length > 120 || /[\r\n@[\]]/u.test(query)) return null;
  return { start, end: cursor, query };
}

export function dateText(date: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

export function dateChoices(now: Date, zh: boolean): DateChoice[] {
  const names = zh ? ["今天", "明天", "昨天", "当前时间"] : ["Today", "Tomorrow", "Yesterday", "Current time"];
  return (["today", "tomorrow", "yesterday", "now"] as const).map((key, index) => {
    const d = new Date(now.getTime());
    // Calendar arithmetic avoids the 23/25-hour DST-day trap.
    if (key === "tomorrow") d.setDate(d.getDate() + 1);
    if (key === "yesterday") d.setDate(d.getDate() - 1);
    return { kind: "date", key, label: names[index], insert: key === "now" ? `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}` : dateText(d) };
  });
}

export function suggestions(query: string, pages: PageRecord[], now: Date, zh: boolean, choices = dateChoices(now, zh)): MentionChoice[] {
  const q = query.trim().toLocaleLowerCase();
  const terms = q.split(/\s+/u).filter(Boolean);
  const aliases = { today: "today 今日 今天 日期 date", tomorrow: "tomorrow 明日 明天 日期 date", yesterday: "yesterday 昨日 昨天 日期 date", now: "now time 现在 此刻 时间" };
  const matchesQuery = (text: string) => terms.every(term => text.toLocaleLowerCase().includes(term));
  const dates = choices.filter(d => matchesQuery(`${d.label} ${aliases[d.key]} ${d.insert}`));
  const matches = pages.filter(p => safeWikiTarget(p.path) && matchesQuery(`${p.name} ${p.path}`));
  const rank = (p: PageRecord) => p.name.toLocaleLowerCase() === q ? 0 : p.name.toLocaleLowerCase().startsWith(q) ? 1 : 2;
  matches.sort((a, b) => rank(a) - rank(b) || (b.modified ?? 0) - (a.modified ?? 0) || a.path.localeCompare(b.path));
  return [...dates, ...matches.slice(0, 12).map(p => ({ kind: "page" as const, path: p.path, label: p.name }))];
}

/** Passive suggestions have no default choice. Only navigation or a pointer
 * explicitly selects a row; Enter otherwise remains ordinary editor input. */
export function mentionNavigation(active: number, count: number, key: string): number {
  if (!count) return -1;
  if (key === "ArrowDown") return (active + 1) % count;
  if (key === "ArrowUp") return active <= 0 ? count - 1 : active - 1;
  return active;
}

/** Cache metadata supplies protected regions; the domain accepts plain offsets. */
export function protectedOffset(offset: number, ranges: { start: number; end: number }[]): boolean {
  return ranges.some(r => offset >= r.start && offset <= r.end);
}

/** Lightweight current-buffer guard; metadata may lag behind an editor change. */
export function insideFence(linesThroughCursor: string[]): boolean {
  let marker = "", count = 0;
  for (const line of linesThroughCursor) {
    const match = /^ {0,3}(`{3,}|~{3,})(.*)$/u.exec(line);
    if (!match) continue;
    if (!marker) { marker = match[1][0]; count = match[1].length; }
    else if (match[1][0] === marker && match[1].length >= count && match[2].trim() === "") { marker = ""; count = 0; }
  }
  return marker !== "";
}
