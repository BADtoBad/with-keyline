type Field = { before: string | null; last: string | null; lost: boolean };
type StyleField = { before: string; priority: string; last: string; lastPriority: string; lost: boolean };
type ClassField = { before: boolean; last: boolean; lost: boolean };

/** A reversible lease of individual presentation fields. Never restore entire
 * class/style attributes, or overwrite a later owner when releasing a field. */
export class PresentationLease {
  private attrs = new Map<HTMLElement, Map<string, Field>>();
  private styles = new Map<HTMLElement, Map<string, StyleField>>();
  private classes = new Map<HTMLElement, Map<string, ClassField>>();
  attribute(el: HTMLElement, name: string, value: string | null): void {
    let fields = this.attrs.get(el);
    if (!fields) this.attrs.set(el, fields = new Map());
    let field = fields.get(name);
    const current = el.getAttribute(name);
    if (!field) fields.set(name, field = { before: current, last: current, lost: false });
    if (field.lost || current !== field.last) { field.lost = true; return; }
    if (current !== value) { if (value === null) el.removeAttribute(name); else el.setAttribute(name, value); }
    field.last = value;
  }
  style(el: HTMLElement, name: string, value: string): void {
    let fields = this.styles.get(el);
    if (!fields) this.styles.set(el, fields = new Map());
    let field = fields.get(name);
    const current = el.style.getPropertyValue(name);
    if (!field) fields.set(name, field = { before: current, priority: el.style.getPropertyPriority(name), last: current, lastPriority: el.style.getPropertyPriority(name), lost: false });
    if (field.lost || current !== field.last || el.style.getPropertyPriority(name) !== field.lastPriority) { field.lost = true; return; }
    if (current !== value || el.style.getPropertyPriority(name)) el.style.setProperty(name, value);
    // CSSOM canonicalizes decimals/colours (e.g. 128.833333px -> 128.833px).
    // Compare the browser's stored representation on the next refresh, not
    // the input string, or animated layout changes falsely look like ownership
    // changes and freeze the first intermediate width.
    field.last = el.style.getPropertyValue(name);
    field.lastPriority = el.style.getPropertyPriority(name);
  }
  addClass(el: HTMLElement, name: string): void { this.toggleClass(el, name, true); }
  toggleClass(el: HTMLElement, name: string, enabled: boolean): void {
    let fields = this.classes.get(el);
    if (!fields) this.classes.set(el, fields = new Map());
    let field = fields.get(name);
    const current = el.classList.contains(name);
    if (!field) fields.set(name, field = { before: current, last: current, lost: false });
    if (field.lost || current !== field.last) { field.lost = true; return; }
    el.classList.toggle(name, enabled); field.last = enabled;
  }
  release(): void {
    for (const [el, fields] of this.classes) for (const [name, field] of fields) {
      if (!field.lost && el.classList.contains(name) === field.last) el.classList.toggle(name, field.before);
    }
    for (const [el, fields] of this.attrs) for (const [name, field] of fields) {
      if (field.lost || el.getAttribute(name) !== field.last) continue;
      if (field.before === null) el.removeAttribute(name); else el.setAttribute(name, field.before);
    }
    for (const [el, fields] of this.styles) for (const [name, field] of fields) {
      if (field.lost || el.style.getPropertyValue(name) !== field.last || el.style.getPropertyPriority(name) !== field.lastPriority) continue;
      if (field.before) el.style.setProperty(name, field.before, field.priority); else el.style.removeProperty(name);
    }
    this.attrs.clear(); this.styles.clear(); this.classes.clear();
  }
}
