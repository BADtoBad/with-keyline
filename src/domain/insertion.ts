import { inProtectedSyntax, parseBlocks } from "./blocks";
import { calloutTypes } from "./selection-blocks";

export const insertItems = [
  ["h1", "Heading 1", "标题 1", "heading-1", "block"],
  ["h2", "Heading 2", "标题 2", "heading-2", "block"],
  ["h3", "Heading 3", "标题 3", "heading-3", "block"],
  ["h4", "Heading 4", "标题 4", "heading-4", "block"],
  ["h5", "Heading 5", "标题 5", "heading-5", "block"],
  ["task", "To-do list", "待办列表", "check-square", "block"],
  ["codeblock", "Code block", "代码块", "code", "block"],
  ["math", "Math block", "数学块", "sigma", "block"],
  ["table", "Table", "表格", "table", "block"],
  ["rule", "Divider", "分割线", "minus", "block"],
  ["toc", "Table of contents", "目录", "list-ordered", "block"],
  ["callout", "Callout", "Callout", "edit-3", "block"],
  ["newpage", "Page", "页面", "file-plus", "action"],
  ["wiki", "Internal link", "内部链接", "link", "action"],
  ["link", "External link", "外部链接", "link-2", "inline"],
  ["image", "Insert image", "插入图片", "image", "action"],
  ["attachment", "Insert attachment", "插入附件", "paperclip", "action"],
  ["today", "Today", "今天", "calendar", "inline"],
  ["yesterday", "Yesterday", "昨天", "calendar-minus", "inline"],
  ["tomorrow", "Tomorrow", "明天", "calendar-plus", "inline"],
  ["time", "Current time", "当前时间", "clock", "inline"],
  ["footnote", "Footnote", "脚注", "hash", "inline"],
  ["comment", "Comment", "注释", "message-square", "inline"],
  ["text", "Text", "正文", "type", "block"],
  ["h6", "Heading 6", "标题 6", "heading-6", "block"],
  ["bullet", "Bullet list", "列表", "list", "block"],
  ["number", "Numbered list", "序号", "list-ordered", "block"],
  ["quote", "Quote", "引用", "quote", "block"]
] as const;
export type InsertId = typeof insertItems[number][0];
export interface InsertEntry { id: string; label: string; search: string; icon: string; mode: "block" | "inline" | "action" | "command"; command?: string }
export interface CustomInsert { command: string; label: string; id?: string; icon?: string }
export const customInsertId = (item: CustomInsert): string => item.id ?? `command:${item.command}`;
export interface InsertPreferences {
  slash: boolean; slashTrigger: string; inlineSlash: boolean; embedAttachments: boolean;
  insertOrder: string[]; hiddenInsert: string[]; customInsert: CustomInsert[];
  dateFormat: string; timeFormat: string;
}
export const insertDefaults: InsertPreferences = {
  slash: true, slashTrigger: "/", inlineSlash: true, embedAttachments: false,
  insertOrder: [], hiddenInsert: [], customInsert: [], dateFormat: "YYYY-MM-DD", timeFormat: "HH:mm"
};
const boundedString = (v: unknown, fallback: string, limit: number) => typeof v === "string" && v.trim() && v.length <= limit && !/[\x00-\x1f]/u.test(v) ? v.trim() : fallback;
export function validSlashTrigger(value: unknown): value is string {
  return typeof value === "string" && /^[\/;:!?~+%＝／；：！～＋]$/u.test(value);
}
export function normalizeInsert(raw: Record<string, unknown>): InsertPreferences {
  const customInsert: CustomInsert[] = [];
  if (Array.isArray(raw.customInsert)) for (const item of raw.customInsert.slice(0, 32)) {
    if (!item || typeof item !== "object") continue;
    const command = boundedString(item.command, "", 160), label = boundedString(item.label, command, 80);
    const id = typeof item.id === "string" && /^custom:[a-zA-Z0-9._-]{1,100}$/u.test(item.id) ? item.id : undefined;
    const icon = typeof item.icon === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(item.icon) && item.icon.length <= 100 ? item.icon : undefined;
    const entry: CustomInsert = { command, label, ...(id ? { id } : {}), ...(icon ? { icon } : {}) };
    if (!/^[a-zA-Z0-9][a-zA-Z0-9:._-]*$/u.test(command) || customInsert.some(c => customInsertId(c) === customInsertId(entry))) continue;
    customInsert.push(entry);
  }
  const allowed = new Set<string>([...insertItems.map(i => i[0]), ...customInsert.map(customInsertId)]);
  const ids = (v: unknown) => Array.isArray(v) ? [...new Set(v.filter((id): id is string => typeof id === "string" && allowed.has(id)))] : [];
  return {
    slash: typeof raw.slash === "boolean" ? raw.slash : true,
    slashTrigger: validSlashTrigger(raw.slashTrigger) ? raw.slashTrigger : "/",
    inlineSlash: typeof raw.inlineSlash === "boolean" ? raw.inlineSlash : true,
    embedAttachments: typeof raw.embedAttachments === "boolean" ? raw.embedAttachments : false,
    insertOrder: ids(raw.insertOrder), hiddenInsert: ids(raw.hiddenInsert), customInsert,
    dateFormat: boundedString(raw.dateFormat, "YYYY-MM-DD", 80),
    timeFormat: boundedString(raw.timeFormat, "HH:mm", 80)
  };
}
export function insertionEntries(prefs: InsertPreferences, zh: boolean, query = "", includeHidden = false): InsertEntry[] {
  const entries: InsertEntry[] = insertItems.map(([id, en, cn, icon, mode]) => ({ id, label: zh ? cn : en, search: `${id} ${en} ${cn}`, icon, mode }));
  entries.push(...prefs.customInsert.map(c => ({ id: customInsertId(c), label: c.label, search: `${c.label} ${c.command}`, icon: c.icon ?? "terminal", mode: "command" as const, command: c.command })));
  const original = new Map(entries.map((entry, index) => [entry.id, index]));
  const rank = (entry: InsertEntry) => { const i = prefs.insertOrder.indexOf(entry.id); return i < 0 ? prefs.insertOrder.length + original.get(entry.id)! : i; };
  return entries.filter(e => (includeHidden || !prefs.hiddenInsert.includes(e.id)) && e.search.toLowerCase().includes(query.toLowerCase().trim())).sort((a, b) => rank(a) - rank(b));
}
/** Recognise the literal query, but do not consume it before explicit choice. */
export function slashAt(text: string, cursor: number, prefs: InsertPreferences): { from: number; to: number; query: string } | null {
  if (!prefs.slash || cursor < 0 || cursor > text.length || !Number.isInteger(cursor)) return null;
  const begin = cursor === 0 ? 0 : text.lastIndexOf("\n", cursor - 1) + 1, line = text.slice(begin, cursor);
  const index = line.lastIndexOf(prefs.slashTrigger);
  if (index < 0 || index > 0 && !/[\s（(]/u.test(line[index - 1])) return null;
  const before = line.slice(0, index), query = line.slice(index + prefs.slashTrigger.length);
  if (query.length > 64 || /[\/\\\r\n\t:[\]<>`]/u.test(query) || /^\s/u.test(query)) return null;
  if (!prefs.inlineSlash && !/^(?:[ \t]*>[ \t]*)*[ \t]*(?:(?:[-+*]|\d+[.)])[ \t]+(?:\[[ xX]\][ \t]*)?)?$/u.test(before)) return null;
  if ((before.match(/(?<!\\)`+/gu) ?? []).length % 2 || before.lastIndexOf("[[") > before.lastIndexOf("]]") || before.lastIndexOf("](") > before.lastIndexOf(")")) return null;
  if (inProtectedSyntax(text, begin + index)) return null;
  return { from: begin + index, to: cursor, query };
}
export interface Snippet { text: string; from: number; to: number; block: boolean; append?: string }
const snippet = (text: string, selected: string, block = true): Snippet => {
  const from = selected ? text.indexOf(selected) : text.length;
  return { text, from: Math.max(0, from), to: Math.max(0, from) + selected.length, block };
};
export function makeSnippet(id: string, document: string, selected: string, zh: boolean, dates: Record<string, string>): Snippet | null {
  const body = selected, heading = selected;
  if (/^h[1-6]$/u.test(id)) return snippet("#".repeat(Number(id.slice(1))) + " " + heading, heading);
  if(id==='callout'||id.startsWith('callout-')){
    const type=id==='callout'?'note':id.slice(8);
    if(!(calloutTypes as readonly string[]).includes(type))return null;
    const text=`> [!${type}]\n> ${body.replace(/\n/gu,'\n> ')}`;
    return body?snippet(text,body.includes('\n')?'':body):{text,from:text.length,to:text.length,block:true};
  }
  switch (id) {
    case "text": return snippet(body, body);
    case "bullet": return snippet(`- ${body}`, body);
    case "number": return snippet(`1. ${body}`, body);
    case "task": return snippet(`- [ ] ${body}`, body);
    case "quote": return snippet(body.split("\n").map(line => `> ${line}`).join("\n"), body.includes("\n") ? "" : body);
    case "codeblock": {
      const code = selected;
      const longest = Math.max(2, ...(code.match(/`+/gu) ?? []).map(m => m.length));
      const fence = "`".repeat(longest + 1);
      const text=`${fence}\n${code}\n${fence}`;
      return {text,from:fence.length+1,to:fence.length+1+code.length,block:true};
    }
    case "math": { const formula = selected; return formula.includes("$$") ? null : {text:`$$\n${formula}\n$$`,from:3,to:3+formula.length,block:true}; }
    case "table": {
      if(!selected)return {text:'|  |  |  |\n| --- | --- | --- |\n|  |  |  |\n|  |  |  |',from:2,to:2,block:true};
      const a = selected || (zh ? "项目" : "Item"), b = zh ? "说明" : "Details";
      const cell = a.replace(/\\/gu, "\\\\").replace(/\|/gu, "\\|").replace(/\r?\n/gu, "<br>");
      return snippet(`| ${cell} | ${b} |\n| --- | --- |\n|  |  |`, "");
    }
    case "rule": return snippet("---\n", "");
    case "toc": {
      const model = parseBlocks(document), headings = model.blocks.filter(b => b.kind === "heading");
      const rows = headings.map(b => {
        const raw = document.slice(b.from, b.to), atx = /^(#{1,6})\s+(.+?)(?:\s+#+)?$/u.exec(raw);
        const label = atx ? atx[2] : raw.split(/\r?\n/u)[0], level = atx ? atx[1].length : /=+\s*$/u.test(raw) ? 1 : 2;
        if (!label || /[\[\]|#^]/u.test(label)) return null;
        return `${"  ".repeat(level - 1)}- [[#${label}|${label}]]`;
      }).filter((s): s is string => !!s);
      return rows.length ? snippet(`**${zh ? "目录" : "Table of contents"}**\n${rows.join("\n")}`, "") : null;
    }
    case "wiki": return /[\[\]|\r\n]/u.test(selected) ? null : {text:`[[${selected}]]`,from:2,to:2+selected.length,block:false};
    case "link": { const label = selected.replace(/[\\[\]]/gu, "\\$&");const text=`[${label}]()`;const at=selected?text.length-1:1;return {text,from:at,to:at,block:false}; }
    case "today": case "tomorrow": case "yesterday": case "time": return snippet(dates[id] ?? "", "", false);
    case "footnote": {
      let n = 1; while (document.includes(`[^${n}]`)) n++;
      const content = selected;
      return { ...snippet(`[^${n}]`, "", false), append: `\n\n[^${n}]: ${content.replace(/\n/gu, "\n    ")}` };
    }
    case "comment": return body.includes("%%") ? null : {text:`%% ${body} %%`,from:3,to:3+body.length,block:false};
    default: return null;
  }
}
export interface InsertPlan { from: number; to: number; before: string; insert: string; anchor: number; head: number; append?: string }
/** Insert a new sibling after a complete parsed block, not inside its final
 * code/quote line. No empty line is written while the picker is merely open. */
export function planAfterBlock(text: string, id: string, value: Snippet): InsertPlan | null {
  if (text.length > 2 * 1024 * 1024) return null;
  const model = parseBlocks(text), block = model.blocks.find(b => b.id === id);
  if (!block || block.locked) return null;
  if (![value.from, value.to].every(Number.isInteger) || value.from < 0 || value.to < value.from || value.to > value.text.length) return null;
  const eol = text.match(/\r?\n/u)?.[0] ?? "\n";
  let prefix = "", continuation = "", gap = eol + eol;
  if (block.kind === "item") {
    const lead = /^([ \t]*)([-+*]|\d+[.)])([ \t]+)/u.exec(text.slice(block.from, block.to));
    if (!lead) return null;
    gap = eol;
    if (/^(?:[-+*]|\d+[.)])[ \t]+/u.test(value.text)) prefix = continuation = lead[1];
    else {
      prefix = lead[1] + (/^\d/u.test(lead[2]) ? "1. " : lead[2] + " ");
      continuation = " ".repeat(prefix.length);
    }
  }
  const content = prefix + value.text.replace(/\n/gu, "\n" + continuation);
  const mapped = (at: number) => prefix.length + at + (value.text.slice(0, at).match(/\n/gu)?.length ?? 0) * continuation.length;
  const endings = (s: string) => s.replace(/\r?\n/gu, eol);
  const insert = gap + endings(content);
  const candidate = parseBlocks(text.slice(0, block.to) + insert + text.slice(block.to));
  const boundaries = new Set(candidate.blocks.map(b => `${b.from}:${b.to}:${b.kind}:${b.depth}`));
  // Existing atomic blocks and neighbouring items must keep their exact
  // boundaries. Ancestors may grow to contain the newly inserted sibling.
  if (model.blocks.some(b => {
    if (b.from <= block.from && b.to >= block.to && b.depth < block.depth)
      return !boundaries.has(`${b.from}:${b.to + insert.length}:${b.kind}:${b.depth}`);
    const delta = b.from > block.to ? insert.length : 0;
    return !boundaries.has(`${b.from + delta}:${b.to + delta}:${b.kind}:${b.depth}`);
  })) return null;
  return { from: block.to, to: block.to, before: "", insert,
    anchor: block.to + gap.length + endings(content.slice(0, mapped(value.from))).length,
    head: block.to + gap.length + endings(content.slice(0, mapped(value.to))).length,
    append: value.append && endings(value.append) };
}
export function planInsertion(text: string, from: number, to: number, value: Snippet): InsertPlan | null {
  if (inProtectedSyntax(text, from, to)) return null;
  const begin = from === 0 ? 0 : text.lastIndexOf("\n", from - 1) + 1;
  const stop = text.indexOf("\n", to), end = stop < 0 ? text.length : stop;
  const prefix = text.slice(begin, from), suffix = text.slice(to, end);
  let insert = value.text, fromIn = value.from, toIn = value.to;
  if (value.block) {
    const match = /^((?:[ \t]*>[ \t]*)*)([ \t]*)(?:(?:[-+*]|\d+[.)])([ \t]+)(?:\[[ xX]\]([ \t]*))?)?$/u.exec(prefix);
    if (match) {
      // Prefix already belongs to the current quote/list. Continuation lines
      // use the content indentation, never repeat a list bullet on code lines.
      const continuation = match[1] + match[2] + " ".repeat(prefix.length - match[1].length - match[2].length);
      const beforeCount = (insert.slice(0, fromIn).match(/\n/gu) ?? []).length;
      const toCount = (insert.slice(0, toIn).match(/\n/gu) ?? []).length;
      insert = insert.replace(/\n/gu, "\n" + continuation);
      fromIn += beforeCount * continuation.length; toIn += toCount * continuation.length;
      if (suffix.trim()) insert += "\n" + continuation;
    } else {
      insert = "\n" + insert + (suffix.trim() ? "\n" : "");
      fromIn += 1; toIn += 1;
    }
    // A divider at document start would be interpreted as YAML, not a rule.
    if (from === 0 && /^---\n?$/u.test(value.text)) { insert = "***" + insert.slice(3); }
  }
  // Generated lines follow this document's line endings; selection offsets are
  // mapped after conversion rather than assuming one character per newline.
  const eol = text.match(/\r?\n/u)?.[0] ?? "\n";
  const endings = (s: string) => s.replace(/\r?\n/gu, eol);
  fromIn = endings(insert.slice(0, fromIn)).length;
  toIn = endings(insert.slice(0, toIn)).length;
  return { from, to, before: text.slice(from, to), insert: endings(insert), anchor: from + fromIn, head: from + toIn, append: value.append && endings(value.append) };
}
