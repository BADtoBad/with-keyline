import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {daysInMonth,parseCalendarDate,calendarISO,localCalendarDate,moveCalendarDay,moveCalendarMonth,calendarCells,calendarValue}=createRequire(import.meta.url)('../.test-build/domain/calendar.cjs');

for(const value of ['', '2026-02-29','1900-02-29','2026-00-01','2026-13-01','2026-01-00','2026-04-31','0000-01-01','2026-1-1','2026-01-01x'])test(`invalid civil date: ${value}`,()=>assert.equal(parseCalendarDate(value),undefined));
for(const value of ['2000-02-29','2024-02-29','0001-01-01','9999-12-31','2026-10-25'])test(`civil date roundtrip: ${value}`,()=>assert.equal(calendarISO(parseCalendarDate(value)),value));
test('datetime parses the date but preserves the complete time on selection',()=>{
  assert.equal(calendarISO(parseCalendarDate('2026-10-25T15:30:42')),'2026-10-25');
  assert.equal(calendarValue('2026-11-01','datetime-local','15:30:42'),'2026-11-01T15:30:42');
  assert.equal(calendarValue('2026-11-01','datetime-local',''),'2026-11-01T00:00');
  assert.equal(calendarValue('2026-11-01','date','15:30'),'2026-11-01');
});
test('month changes clamp the day and cross years without overflowing February',()=>{
  assert.equal(calendarISO(moveCalendarMonth(parseCalendarDate('2024-01-31'),1)),'2024-02-29');
  assert.equal(calendarISO(moveCalendarMonth(parseCalendarDate('2026-01-31'),1)),'2026-02-28');
  assert.equal(calendarISO(moveCalendarMonth(parseCalendarDate('2026-12-31'),1)),'2027-01-31');
  assert.equal(calendarISO(moveCalendarMonth(parseCalendarDate('0001-01-01'),-1)),'0001-01-01');
  assert.equal(calendarISO(moveCalendarMonth(parseCalendarDate('9999-12-31'),1)),'9999-12-31');
});
test('local date comes from local components, never ISO/UTC conversion',()=>{
  const now=new Date(2026,9,25,0,1);assert.equal(calendarISO(localCalendarDate(now)),'2026-10-25');
  assert.equal(calendarISO(moveCalendarDay(parseCalendarDate('2026-12-31'),1)),'2027-01-01');
  assert.equal(calendarISO(moveCalendarDay(parseCalendarDate('2024-03-01'),-1)),'2024-02-29');
});
for(const monday of [true,false])test(`42-cell calendar has correct first weekday: monday=${monday}`,()=>{
  const cells=calendarCells(parseCalendarDate('2026-10-25'),monday);
  assert.equal(cells.length,42);assert.equal(new Set(cells.map(calendarISO)).size,42);
  assert.equal(calendarISO(cells[0]),monday?'2026-09-28':'2026-09-27');
  assert.equal(cells.filter(d=>d.month===10).length,31);
});
test('leap-year rules include century exceptions',()=>{
  assert.equal(daysInMonth(2000,2),29);assert.equal(daysInMonth(1900,2),28);assert.equal(daysInMonth(2024,2),29);
});
