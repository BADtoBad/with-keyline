import { Menu, Modal, Notice, Setting, type App, type Editor, type TFile } from "obsidian";
import { colorSelection, externalDestination, externalLinkEdit, selectedLink, selectionInk, toneColor, tones, unlinkSelection, type Ink, type Tone, type SelectionEdit } from "../domain/rich-format";
import { appendBlockMenu, BlockConvertPicker, captureBlock } from "./block-commands";
import type { InsertionController } from "./insertion";
import { message, type Message } from "../strings";
import { SelectionMenu } from "./selection-menu";

export interface FormatContext {
  editor: Editor; file: TFile; text: string; from: number; to: number; valid(): boolean;
}
const labels: Record<Tone, Message> = {
  default: "toneDefault", gray: "toneGray", brown: "toneBrown", orange: "toneOrange", yellow: "toneYellow",
  green: "toneGreen", blue: "toneBlue", purple: "tonePurple", pink: "tonePink", red: "toneRed"
};
export class RichFormatting {
  live = true;
  private dialogs = new Set<Modal>();
  private menus = new Set<Menu>();
  private selectionMenus = new Set<SelectionMenu>();
  constructor(readonly app: App, readonly zh: () => boolean, private insertion: () => InsertionController | undefined,
    private composing: (editor: Editor) => boolean) {}
  capture(editor: Editor, file: TFile, guard: () => boolean = () => true): FormatContext | null {
    if (!this.live || !guard() || this.composing(editor) || editor.listSelections().length !== 1) return null;
    const text = editor.getValue(), path = file.path;
    const from = editor.posToOffset(editor.getCursor("from")), to = editor.posToOffset(editor.getCursor("to"));
    if (text.length > 2 * 1024 * 1024 || from === to || to - from > 16000) return null;
    return { editor, file, text, from, to, valid: () => this.live && guard() && !this.composing(editor) && file.path === path &&
      this.app.vault.getAbstractFileByPath(path) === file && editor.getValue() === text && editor.listSelections().length === 1 &&
      editor.posToOffset(editor.getCursor("from")) === from && editor.posToOffset(editor.getCursor("to")) === to &&
      this.app.workspace.getLeavesOfType("markdown").some(leaf => {
        const view = leaf.view as typeof leaf.view & { editor?: Editor; file?: TFile };
        return view.editor === editor && view.file === file;
      }) };
  }
  commit(context: FormatContext, edit: SelectionEdit | null): boolean {
    if (!context.valid() || !edit) { if (this.live) new Notice(message(edit ? "stale" : "formatUnavailable", this.zh())); return false; }
    context.editor.replaceRange(edit.insert, context.editor.offsetToPos(edit.from), context.editor.offsetToPos(edit.to), "keyline-next-format");
    context.editor.setSelection(context.editor.offsetToPos(edit.anchor), context.editor.offsetToPos(edit.head));
    context.editor.focus(); return true;
  }
  color(context: FormatContext, patch: Partial<Ink>): boolean {
    return this.commit(context, colorSelection(context.text, context.from, context.to, patch));
  }
  url(context: FormatContext, destination: string): boolean {
    return this.commit(context, externalLinkEdit(context.text, context.from, context.to, destination));
  }
  show(dialog: Modal): void { if (this.live) { this.dialogs.add(dialog); dialog.open(); } }
  release(dialog: Modal): void { this.dialogs.delete(dialog); }
  colors(context: FormatContext): void { if (context.valid()) this.show(new ColorModal(this.app, this, context)); }
  selectionMenu(context: FormatContext, point: { x: number; y: number }, doc: Document, page: "main" | "color" = "main",
    closed: (resume: boolean) => void = () => {}): void {
    if (!context.valid()) return;
    for (const menu of this.selectionMenus) menu.close();
    const menu = new SelectionMenu(this.app, this, context, point, doc, page, resume => { this.selectionMenus.delete(menu); closed(resume); });
    this.selectionMenus.add(menu);
  }
  link(context: FormatContext, point: { x: number; y: number }, doc: Document): void {
    if (!context.valid()) return;
    const menu = new Menu(), oneLine = !/[\r\n]/u.test(context.text.slice(context.from, context.to));
    menu.addItem(item => item.setTitle(message("linkPage", this.zh())).setIcon("file-text").setDisabled(!oneLine).onClick(() => {
      if (!context.valid()) { new Notice(message("stale", this.zh())); return; }
      const controller = this.insertion(), insert = controller?.capture(context.editor, context.file);
      const old = selectedLink(context.text, context.from, context.to);
      const alias = old?.label ?? context.text.slice(context.from, context.to);
      if (/[\[\]|\r\n]/u.test(alias)) { new Notice(message("unsafeLink", this.zh())); return; }
      if (controller && insert) controller.pickFile(old ? { ...insert, from: old.from, to: old.to, selected: alias } : insert, "wiki");
    }));
    menu.addItem(item => item.setTitle(message("linkUrl", this.zh())).setIcon("link").setDisabled(!oneLine).onClick(() => {
      if (context.valid()) this.show(new LinkModal(this.app, this, context));
    }));
    menu.addItem(item => item.setTitle(message("unlink", this.zh())).setIcon("unlink")
      .setDisabled(!selectedLink(context.text, context.from, context.to)).onClick(() =>
        this.commit(context, unlinkSelection(context.text, context.from, context.to))));
    this.menu(menu, point, doc);
  }
  blocks(context: FormatContext, point: { x: number; y: number }, doc: Document): void {
    if (!context.valid()) return;
    const menu = new Menu(), block = captureBlock(context.editor, context.valid);
    menu.addItem(item => item.setTitle(message("openInsert", this.zh())).setIcon("plus").onClick(() => {
      if (!context.valid()) return;
      const controller = this.insertion(), insert = controller?.capture(context.editor, context.file);
      if (controller && insert) controller.open(insert);
    }));
    if (block) appendBlockMenu(menu, this.app, block, this.zh(), () => this.convert(context));
    this.menu(menu, point, doc);
  }
  convert(context: FormatContext): void {
    const block = captureBlock(context.editor, context.valid), owner = this;
    if (!block || !block.blocks.length) return;
    this.show(new class extends BlockConvertPicker {
      onClose() { super.onClose(); owner.release(this); }
    }(this.app, block, this.zh()));
  }
  private menu(menu: Menu, point: { x: number; y: number }, doc: Document): void {
    this.menus.add(menu); menu.onHide(() => this.menus.delete(menu)); menu.showAtPosition(point, doc);
  }
  dispose(): void {
    this.live = false;
    for (const menu of this.menus) menu.hide();
    for (const dialog of this.dialogs) dialog.close();
    for (const menu of this.selectionMenus) menu.close();
    this.menus.clear(); this.dialogs.clear();
  }
}
export class LinkModal extends Modal {
  constructor(app: App, private owner: RichFormatting, private context: FormatContext) { super(app); }
  onOpen(): void {
    this.setTitle(message("linkUrl", this.owner.zh()));
    this.contentEl.addClass("keyline-next-link-dialog");
    const current = selectedLink(this.context.text, this.context.from, this.context.to);
    let value = current?.kind === "url" ? current.destination : "";
    const form = this.contentEl.createEl("form");
    new Setting(form).setName(message("url", this.owner.zh())).addText(input => {
      input.setValue(value).setPlaceholder("https://…");
      input.inputEl.type = "url"; input.inputEl.required = true; input.inputEl.setAttribute("aria-label", message("url", this.owner.zh()));
      input.onChange(next => { value = next; }); input.inputEl.focus();
    });
    const status = form.createEl("p", { attr: { role: "status" } });
    const submit = form.createEl("button", { text: message("apply", this.owner.zh()), cls: "mod-cta" }); submit.type = "submit";
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!this.context.valid()) { status.setText(message("stale", this.owner.zh())); return; }
      if (!externalDestination(value)) { status.setText(message("invalidUrl", this.owner.zh())); return; }
      if (this.owner.url(this.context, value)) this.close();
    });
  }
  onClose(): void { this.owner.release(this); }
}
export class ColorModal extends Modal {
  constructor(app: App, private owner: RichFormatting, private context: FormatContext) { super(app); }
  onOpen(): void {
    this.setTitle(message("colors", this.owner.zh()));
    this.contentEl.addClass("keyline-next-color-dialog");
    const active = selectionInk(this.context.text, this.context.from, this.context.to);
    for (const kind of ["text", "background"] as const) {
      this.contentEl.createEl("h3", { text: message(kind === "text" ? "textColor" : "backgroundColor", this.owner.zh()) });
      const group = this.contentEl.createDiv({ cls: "keyline-next-color-grid" });
      for (const tone of ["default", ...tones] as Tone[]) {
        const button = group.createEl("button", { text: message(labels[tone], this.owner.zh()) }); button.type = "button";
        button.dataset.color = `${kind}:${tone}`; button.setAttribute("aria-pressed", String(active[kind] === tone));
        const sample = button.createSpan({ text: "Aa", cls: "keyline-next-color-sample", attr: { "aria-hidden": "true" } });
        if (kind === "text") sample.style.color = toneColor(tone);
        else sample.style.backgroundColor = tone === "default" ? "transparent" : `color-mix(in srgb, ${toneColor(tone)} ${tone === "yellow" ? 42 : 22}%, transparent)`;
        button.addEventListener("click", () => { if (this.owner.color(this.context, { [kind]: tone })) this.close(); });
      }
    }
    this.contentEl.addEventListener("keydown", event => {
      const target = event.target as HTMLElement;
      if ((event.key === "Enter" || event.key === " ") && target.tagName === "BUTTON") {
        event.preventDefault(); event.stopPropagation(); if (!event.repeat) target.click();
      }
    });
  }
  onClose(): void { this.owner.release(this); }
}
