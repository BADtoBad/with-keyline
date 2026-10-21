import { markdownTree } from "./blocks";
import type { HostToken, Span } from "./writing";

export interface QuoteLine extends Span {
  marker: Span; kind: "quote" | "callout"; first: boolean; last: boolean;
  header?: Span; type?: string; explicitTitle?: boolean;
}
export interface StructurePresentation { quotes: QuoteLine[]; separators: (Span & { task: boolean })[] }

/** Single quote-depth containers may live inside lists. A deeper quote keeps
 * its native rendering; indentation alone is not evidence of a quote. */
export function flatQuoteContainers(tree: ReturnType<typeof markdownTree>) {
  const containers: (typeof tree.topNode)[] = [];
  tree.iterate({ enter({ node }) {
    if (node.name !== "Blockquote") return;
    for (let parent = node.parent; parent; parent = parent.parent) if (parent.name === "Blockquote") return;
    containers.push(node);
  } });
  return containers;
}

/** Both parsers must agree before any source marker is hidden or widened.
 * Native tokens supply display truth; our Markdown tree excludes fenced code,
 * frontmatter, HTML and non-list punctuation. No document edits are planned. */
export function structurePresentation(text: string, host: readonly HostToken[]): StructurePresentation {
  const result: StructurePresentation = { quotes: [], separators: [] };
  if (text.length > 2 * 1024 * 1024) return result;
  const confirmed = (pattern: RegExp) => {
    const tokens = host.filter(t => pattern.test(t.name)).sort((a,b) => a.from - b.from);
    return (from: number, to: number) => {
      let lo = 0, hi = tokens.length;
      while (lo < hi) { const mid = (lo + hi) >>> 1; if (tokens[mid].from <= from) lo = mid + 1; else hi = mid; }
      return lo > 0 && tokens[lo - 1].to >= to;
    };
  };
  const quote = confirmed(/(?:^|_)formatting-quote(?:_|$)/u);
  const callout = confirmed(/(?:^|_)hmd-callout(?:_|$)/u);
  const list = confirmed(/(?:^|_)formatting-list(?:_|$)/u);
  const tree = markdownTree(text);
  tree.iterate({ enter({node}) {
    if (node.name !== "ListMark" || node.parent?.name !== "ListItem" || !list(node.from, node.to)) return;
    if (!/[ \t]/u.test(text[node.to] ?? "")) return;
    const end = text.indexOf("\n", node.to), rest = text.slice(node.to, end < 0 ? text.length : end);
    const task = /^[ \t]+\[[^\]\r\n]\]([ \t])/u.exec(rest);
    const from = task ? node.to + task[0].length - 1 : node.to;
    result.separators.push({from, to: from + 1, task: !!task});
  } });
  // Quote depth, not document depth, decides ownership. List-contained quotes
  // receive the same single-level presentation without consuming list indent.
  for (const root of flatQuoteContainers(tree)) {
    let at = text.lastIndexOf("\n", Math.max(0, root.from - 1)) + 1;
    let segment: QuoteLine[] = [], type: string | undefined;
    const finish = () => {
      if (segment.length) { segment[0].first = true; segment[segment.length - 1].last = true; }
      segment = [];
    };
    while (at <= root.to) {
      const newline = text.indexOf("\n", at), end = Math.min(root.to, newline < 0 ? text.length : newline);
      const row = text.slice(at, end).replace(/\r$/u, ""), prefix = /^[ \t]*>[ \t]*/u.exec(row);
      if (!prefix || row[prefix[0].length] === ">") { finish(); type = undefined; }
      else {
        const mark = at + prefix[0].indexOf(">");
        if (!quote(mark, mark + 1)) { finish(); type = undefined; }
        else {
          const spaces = prefix[0].slice(prefix[0].indexOf(">") + 1);
          // Four indentation columns after the optional quote separator are
          // code-significant. Keep them in the editor's coordinate system.
          const markerEnd = spaces.length >= 5 || spaces.includes("\t") ? mark + 1 + (spaces[0] === " " ? 1 : 0) : at + prefix[0].length;
          const candidate = /^\[!([\w-]{1,64})\][+-]?[ \t]*/u.exec(text.slice(markerEnd, end));
          const header = candidate && callout(markerEnd, markerEnd + candidate[0].trim().length) ? candidate : null;
          if (header) { finish(); type = header[1].toLowerCase(); }
          const line: QuoteLine = {from: at, to: at + row.length, marker: {from: mark, to: markerEnd},
            kind: type ? "callout" : "quote", type, first: false, last: false};
          if (header) {
            line.header = {from: markerEnd, to: markerEnd + header[0].length};
            line.explicitTitle = !!text.slice(line.header.to, at + row.length).trim();
          }
          result.quotes.push(line); segment.push(line);
        }
      }
      if (newline < 0 || newline >= root.to) break;
      at = newline + 1;
    }
    finish();
  }
  return result;
}

const definitions = {
  note: ["Note", "便签", "pencil", "blue"], abstract: ["Abstract", "Abstract", "clipboard-list", "blue"],
  info: ["Info", "信息", "info", "blue"], todo: ["Todo", "待办", "check-circle", "blue"],
  tip: ["Tip", "提示", "flame", "cyan"], success: ["Success", "成功", "check", "green"],
  question: ["Question", "问题", "help-circle", "purple"], warning: ["Warning", "警告", "alert-triangle", "orange"],
  failure: ["Failure", "失败", "x-circle", "red"], danger: ["Danger", "危险", "zap", "red"],
  bug: ["Bug", "缺陷", "bug", "red"], example: ["Example", "示例", "list", "purple"], quote: ["Quote", "引用", "quote", "gray"]
} as const;
const aliases: Record<string, keyof typeof definitions> = { summary: "abstract", tldr: "abstract", hint: "tip", important: "tip",
  check: "success", done: "success", help: "question", faq: "question", caution: "warning", attention: "warning",
  fail: "failure", missing: "failure", error: "danger", cite: "quote" };
export function calloutPresentation(type: string, zh: boolean) {
  const direct = definitions[type as keyof typeof definitions], known = direct ?? definitions[aliases[type]];
  // Alias artwork follows the canonical type, but its authored type name is
  // the default title in the integrated companion, not the canonical label.
  return {label: direct?.[zh ? 1 : 0] ?? type.charAt(0).toUpperCase() + type.slice(1),
    icon: known?.[2] ?? "pencil", tone: known?.[3] ?? "blue"};
}
