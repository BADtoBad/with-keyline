import { moment } from "obsidian";
import type { InsertPreferences } from "../domain/insertion";

export function formattedDates(preferences: Pick<InsertPreferences, "dateFormat" | "timeFormat">, zh: boolean, now = new Date()): Record<string, string> {
  const format = (date: Date, pattern: string) => moment(date).locale(zh ? "zh-cn" : "en").format(pattern);
  const result: Record<string, string> = {};
  for (const [key, delta] of [["today", 0], ["tomorrow", 1], ["yesterday", -1]] as const) {
    const d = new Date(now.getTime()); d.setDate(d.getDate() + delta);
    result[key] = format(d, preferences.dateFormat);
  }
  result.time = format(now, preferences.timeFormat);
  result.now = `${result.today} ${result.time}`;
  return result;
}
