export interface StatusPart { text: string; icon?: string; warning?: boolean }
const glyphs = new Map([
  ["🌐", "globe"], ["📲", "smartphone"], ["⏹", "square"], ["💤", "pause"],
  ["🌀", "refresh-cw"], ["⚡", "zap"], ["📦", "package"], ["⏳", "hourglass"],
  ["🛫", "upload"], ["📬", "inbox"], ["⚠", "triangle-alert"], ["⛔", "circle-alert"],
  ["↑", "arrow-up"], ["↓", "arrow-down"]
]);
const ordinaryStates = new Set(["⏹", "💤", "🌀", "⚡", "📦"]);

/** Presentation only: lossless segments, not a replication-state parser. A
 * status can only be quiet when every remaining word is explicitly understood.
 * Unknown symbols/messages, SKIP and warnings retain attention styling. */
export function syncStatus(text: string): { parts: StatusPart[]; attention: boolean } | null {
  const at = text.indexOf("Sync:");
  if (at < 0 || text.length > 16000) return null;
  const parts: StatusPart[] = []; let plain = "";
  for (let index = 0; index < text.length;) {
    const point = String.fromCodePoint(text.codePointAt(index)!); index += point.length;
    const icon = glyphs.get(point);
    if (!icon) { plain += point; continue; }
    if (plain) { parts.push({ text: plain }); plain = ""; }
    const variant = text[index] === "\uFE0F" ? text[index++] : "";
    parts.push({ text: point + variant, icon, warning: point === "⚠" || point === "⛔" });
  }
  if (plain) parts.push({ text: plain });
  const remainder = parts.filter(part => !part.icon).map(part => part.text).join("");
  const halves = remainder.split("Sync:");
  const counters = (value: string): boolean => /^[\s\d.:()]*$/u.test(value);
  const tail = text.slice(at + 5).replace(/^\s+/u, ""), first = [...tail][0];
  const routine = halves.length === 2 && counters(halves[0]) &&
    counters(halves[1].replace(/\bLIVE\b/gu, "")) && ordinaryStates.has(first) && !parts.some(part => part.warning);
  return { parts, attention: !routine };
}
