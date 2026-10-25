/** Calendar arithmetic uses local civil dates, never UTC timestamp parsing. */
export type CalendarDate = { year: number; month: number; day: number };
export function daysInMonth(year: number, month: number): number {
  return [31, year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28,
    31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] ?? 0;
}
export function parseCalendarDate(value: string): CalendarDate | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T|$)/.exec(value);
  if (!match) return;
  const [, y, m, d] = match, date = { year: +y, month: +m, day: +d };
  if (date.year < 1 || date.month < 1 || date.month > 12 || date.day < 1 || date.day > daysInMonth(date.year, date.month)) return;
  return date;
}
export function calendarISO(date: CalendarDate): string {
  return `${String(date.year).padStart(4, "0")}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
}
export function localCalendarDate(now = new Date()): CalendarDate {
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}
function nativeDate(date: CalendarDate): Date {
  const result = new Date(0);
  result.setFullYear(date.year, date.month - 1, date.day); result.setHours(12, 0, 0, 0);
  return result;
}
export function moveCalendarDay(date: CalendarDate, delta: number): CalendarDate {
  const result = nativeDate(date); result.setDate(result.getDate() + delta);
  return localCalendarDate(result);
}
export function moveCalendarMonth(date: CalendarDate, delta: number): CalendarDate {
  const total = (date.year - 1) * 12 + date.month - 1 + delta;
  const bounded = Math.max(0, Math.min(9999 * 12 - 1, total));
  const year = Math.floor(bounded / 12) + 1, month = bounded % 12 + 1;
  return { year, month, day: Math.min(date.day, daysInMonth(year, month)) };
}
export function calendarCells(month: CalendarDate, mondayFirst: boolean): CalendarDate[] {
  const first = { ...month, day: 1 };
  const offset = (nativeDate(first).getDay() + (mondayFirst ? 6 : 0)) % 7;
  return Array.from({ length: 42 }, (_, i) => moveCalendarDay(first, i - offset));
}
/** Preserve time/seconds on datetime fields; an empty field gets midnight only
 * after the user explicitly chooses a date and confirms. */
export function calendarValue(date: string, type: string, time: string): string {
  return type === "datetime-local" ? `${date}T${time || "00:00"}` : date;
}
