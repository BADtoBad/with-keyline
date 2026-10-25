import { setIcon } from "obsidian";
import { calendarCells, calendarISO, calendarValue, localCalendarDate, moveCalendarDay, moveCalendarMonth, parseCalendarDate, type CalendarDate } from "../domain/calendar";
import { PresentationLease } from "./presentation";

const openCalendars = new WeakMap<Document, PropertyCalendar>();
let serial = 0;

/** A presentation-only picker. Core still owns validation, saving and undo. */
export class PropertyCalendar {
  private root: HTMLDivElement;
  private grid: HTMLDivElement;
  private heading: HTMLDivElement;
  private previous: HTMLButtonElement;
  private next: HTMLButtonElement;
  private todayButton: HTMLButtonElement;
  private confirm?: HTMLButtonElement;
  private cursor: CalendarDate;
  private selected: string;
  private original: string;
  private time: string;
  private live = true;
  private lease = new PresentationLease();
  private doc: Document;
  private cleanup: Array<() => void> = [];
  private readonly today = localCalendarDate();

  static supported(input: HTMLInputElement): boolean {
    const doc = input.ownerDocument;
    return !!doc?.defaultView && !!doc.body && !doc.body.classList.contains("is-mobile") &&
      ["date", "datetime-local"].includes(input.type);
  }
  constructor(private input: HTMLInputElement, private zh: boolean, private valid: () => boolean) {
    this.doc = input.ownerDocument;
    openCalendars.get(this.doc)?.close();
    this.original = input.value;
    this.selected = parseCalendarDate(input.value) ? input.value.slice(0, 10) : "";
    this.time = input.type === "datetime-local" ? input.value.split("T")[1] || "00:00" : "";
    this.cursor = parseCalendarDate(this.selected) ?? this.today;
    this.root = this.doc.createElement("div");
    this.root.className = "keyline-next-property-calendar";
    this.root.id = `keyline-property-calendar-${++serial}`;
    this.root.setAttribute("role", "dialog");
    this.root.setAttribute("aria-label", zh ? "选择日期" : "Choose a date");
    this.root.tabIndex = -1;
    const header = this.element("div", "keyline-calendar-header", this.root);
    this.heading = this.element("div", "keyline-calendar-month", header);
    this.heading.id = `${this.root.id}-month`;
    this.heading.setAttribute("aria-live", "polite");
    this.previous = this.button(header, zh ? "上个月" : "Previous month", () => this.changeMonth(-1));
    this.previous.dataset.action = "previous"; setIcon(this.previous, "chevron-left");
    this.next = this.button(header, zh ? "下个月" : "Next month", () => this.changeMonth(1));
    this.next.dataset.action = "next"; setIcon(this.next, "chevron-right");
    const weekdays = this.element("div", "keyline-calendar-weekdays", this.root);
    weekdays.setAttribute("aria-hidden", "true");
    for (const label of zh ? ["一", "二", "三", "四", "五", "六", "日"] : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"])
      this.element("span", "", weekdays).textContent = label;
    this.grid = this.element("div", "keyline-calendar-grid", this.root);
    this.grid.setAttribute("role", "grid");
    this.grid.setAttribute("aria-labelledby", this.heading.id);
    if (input.type === "datetime-local") {
      const label = this.element("label", "keyline-calendar-time", this.root);
      this.element("span", "", label).textContent = zh ? "时间" : "Time";
      const time = this.element("input", "", label); time.type = "time"; time.step = "any"; time.value = this.time;
      time.addEventListener("input", () => { this.time = time.value; this.updateConfirm(); });
    }
    const footer = this.element("div", "keyline-calendar-footer", this.root);
    this.button(footer, zh ? "清空" : "Clear", () => this.commit("")).dataset.action = "clear";
    this.todayButton = this.button(footer, zh ? "今天" : "Today", () => this.choose(calendarISO(this.today)));
    this.todayButton.dataset.action = "today";
    if (input.type === "datetime-local") {
      this.confirm = this.button(footer, zh ? "确定" : "Apply", () => this.commit(this.selected));
      this.confirm.dataset.action = "apply";
    }
    this.doc.body.append(this.root);
    openCalendars.set(this.doc, this);
    this.lease.attribute(input, "aria-haspopup", "dialog");
    this.lease.attribute(input, "aria-expanded", "true");
    this.lease.attribute(input, "aria-controls", this.root.id);
    this.on(this.root, "keydown", event => this.key(event as KeyboardEvent));
    this.on(this.doc, "pointerdown", event => { if (!this.root.contains(event.target as Node) && event.target !== input) this.close(); }, true);
    this.on(this.doc, "focusin", event => { if (!this.root.contains(event.target as Node) && event.target !== input) this.close(); }, true);
    this.on(this.doc, "scroll", event => { if (!this.root.contains(event.target as Node)) this.close(); }, true);
    this.on(this.doc.defaultView!, "resize", () => this.position());
    this.on(this.doc.defaultView!, "blur", () => this.close());
    this.on(input, "input", () => this.close());
    this.render(); this.position(); this.focusDay();
  }
  private on(target: EventTarget, type: string, handler: (event: Event) => void, capture = false): void {
    target.addEventListener(type, handler, capture);
    this.cleanup.push(() => target.removeEventListener(type, handler, capture));
  }
  private element<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, parent: HTMLElement): HTMLElementTagNameMap[K] {
    const el = this.doc.createElement(tag); el.className = cls; parent.append(el); return el;
  }
  private button(parent: HTMLElement, label: string, click: () => void): HTMLButtonElement {
    const button = this.element("button", "", parent); button.type = "button";
    button.textContent = label; button.setAttribute("aria-label", label); button.addEventListener("click", click); return button;
  }
  /** A stale popup must never write to another note, a replaced field or a
   * value changed meanwhile by sync/undo/another plugin. */
  refresh(): void {
    if (this.live && (!this.valid() || !this.input.isConnected || this.input.disabled || this.input.readOnly ||
      this.input.value !== this.original || this.input.ownerDocument !== this.doc ||
      !this.input.getClientRects().length || !PropertyCalendar.supported(this.input))) this.close();
  }
  private allowed(iso: string): boolean {
    const date = parseCalendarDate(iso); if (!date || date.year > 9999) return false;
    const min = this.input.min.slice(0, 10), max = this.input.max.slice(0, 10);
    return (!parseCalendarDate(min) || iso >= min) && (!parseCalendarDate(max) || iso <= max);
  }
  private render(): void {
    this.heading.textContent = this.zh ? `${this.cursor.year}年${this.cursor.month}月` :
      `${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][this.cursor.month - 1]} ${this.cursor.year}`;
    this.previous.disabled = this.cursor.year === 1 && this.cursor.month === 1;
    this.next.disabled = this.cursor.year === 9999 && this.cursor.month === 12;
    this.todayButton.disabled = !this.allowed(calendarISO(this.today));
    this.grid.replaceChildren();
    const cells = calendarCells(this.cursor, this.zh), cursor = calendarISO(this.cursor), today = calendarISO(this.today);
    for (let i = 0; i < cells.length; i += 7) {
      const row = this.element("div", "keyline-calendar-week", this.grid); row.setAttribute("role", "row");
      for (const date of cells.slice(i, i + 7)) {
        const iso = calendarISO(date), cell = this.element("div", "", row); cell.setAttribute("role", "gridcell");
        cell.setAttribute("aria-selected", String(iso === this.selected));
        const button = this.button(cell, iso, () => this.choose(iso)); button.textContent = String(date.day);
        button.dataset.date = iso; button.tabIndex = iso === cursor ? 0 : -1; button.disabled = !this.allowed(iso);
        button.classList.toggle("is-outside", date.month !== this.cursor.month);
        button.classList.toggle("is-selected", iso === this.selected);
        if (iso === today) button.setAttribute("aria-current", "date");
      }
    }
    this.updateConfirm();
  }
  private updateConfirm(): void {
    if (this.confirm) this.confirm.disabled = !this.selected || !this.time;
  }
  private focusDay(): void {
    const target = this.grid.querySelector<HTMLButtonElement>(`button[data-date="${calendarISO(this.cursor)}"]:not(:disabled)`);
    (target ?? this.root).focus({ preventScroll: true });
  }
  private changeMonth(delta: number): void {
    this.refresh(); if (!this.live) return;
    this.cursor = moveCalendarMonth(this.cursor, delta); this.render(); this.position();
  }
  private choose(iso: string): void {
    this.refresh(); if (!this.live || !this.allowed(iso)) return;
    if (this.input.type === "datetime-local") {
      this.selected = iso; this.cursor = parseCalendarDate(iso)!; this.render(); this.focusDay();
    } else this.commit(iso);
  }
  private key(event: KeyboardEvent): void {
    if (event.isComposing || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); this.close(true); return; }
    const target = event.target as HTMLElement;
    // Explicit activation keeps Obsidian's document-level hotkeys from taking
    // Enter/Space away from this focused button (including footer/navigation).
    if ((event.key === "Enter" || event.key === " ") && target.tagName === "BUTTON") {
      event.preventDefault(); event.stopPropagation();
      if (!(target as HTMLButtonElement).disabled) target.click();
      return;
    }
    if (event.key === "Enter" && target.tagName === "INPUT" && this.confirm && !this.confirm.disabled) {
      event.preventDefault(); event.stopPropagation(); this.confirm.click(); return;
    }
    if (!target.dataset.date) return;
    let next: CalendarDate | undefined;
    const steps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (event.key in steps) next = moveCalendarDay(this.cursor, steps[event.key]);
    else if (event.key === "PageUp" || event.key === "PageDown") next = moveCalendarMonth(this.cursor, (event.key === "PageUp" ? -1 : 1) * (event.shiftKey ? 12 : 1));
    else if (event.key === "Home" || event.key === "End") {
      const cells = calendarCells(this.cursor, this.zh), index = cells.findIndex(d => calendarISO(d) === calendarISO(this.cursor));
      next = cells[Math.floor(index / 7) * 7 + (event.key === "End" ? 6 : 0)];
    }
    if (next) {
      event.preventDefault(); event.stopPropagation();
      if (!this.allowed(calendarISO(next))) return;
      this.cursor = next; this.render(); this.position(); this.focusDay();
    }
  }
  private commit(date: string): void {
    this.refresh(); if (!this.live || (date && !this.allowed(date))) return;
    const input = this.input, value = date ? calendarValue(date, input.type, this.time) : "";
    // Let the native field enforce min/max/step before touching the real value.
    const probe = input.cloneNode(false) as HTMLInputElement;
    // Core stores seconds even when its input omits step (whose browser default
    // is one minute). Preserve those seconds; respect an explicitly set step.
    if (input.type === "datetime-local" && !input.hasAttribute("step")) probe.step = "any";
    probe.value = value;
    if (date && (probe.value !== value || !probe.validity.valid)) return;
    this.close();
    if (value === input.value) { this.focusProperty(); return; }
    input.focus({ preventScroll: true }); input.value = value;
    const EventClass = input.ownerDocument.defaultView!.Event;
    input.dispatchEvent(new EventClass("input", { bubbles: true }));
    input.dispatchEvent(new EventClass("change", { bubbles: true }));
    input.blur(); // Core commits its pending field edit and owns the undo entry.
    this.focusProperty();
  }
  private focusProperty(): void {
    // Native Enter/commit returns to the property row. This also routes Mod+Z
    // to Obsidian's property history instead of the browser input's edit stack.
    if (this.input.isConnected) (this.input.closest<HTMLElement>(".metadata-property[tabindex]") ?? this.input).focus({ preventScroll: true });
  }
  private position(): void {
    this.refresh(); if (!this.live) return;
    const win = this.doc.defaultView!, anchor = this.input.getBoundingClientRect(), box = this.root.getBoundingClientRect();
    const left = Math.max(8, Math.min(anchor.left, win.innerWidth - box.width - 8));
    const top = anchor.bottom + 6 + box.height <= win.innerHeight - 8 ? anchor.bottom + 6 : anchor.top - box.height - 6;
    this.root.style.left = `${left}px`; this.root.style.top = `${Math.max(8, top)}px`;
  }
  close(restoreFocus = false): void {
    if (!this.live) return;
    this.live = false; for (const stop of this.cleanup) stop(); this.cleanup = [];
    this.lease.release(); this.root.remove();
    if (openCalendars.get(this.doc) === this) openCalendars.delete(this.doc);
    if (restoreFocus && this.input.isConnected) this.input.focus({ preventScroll: true });
  }
}
