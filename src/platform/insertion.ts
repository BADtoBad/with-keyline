import { Modal, Notice, SuggestModal, TFile, type App, type Editor, type EditorPosition, type EditorSuggestContext, type EditorSuggestTriggerInfo } from "obsidian";
import { inProtectedSyntax, parseBlocks } from "../domain/blocks";
import { insertionEntries, makeSnippet, planAfterBlock, planInsertion, slashAt, type InsertEntry, type InsertPlan, type InsertPreferences, type Snippet } from "../domain/insertion";
import { safeWikiTarget } from "../domain/mentions";
import { formattedDates } from "./dates";
import { message } from "../strings";
import { availableNotePath } from "../domain/explorer";
import { AttachmentImports } from "./attachment-imports";
import { planAttachmentInsertion } from "../domain/attachments";

export interface InsertContext {
  editor: Editor; file: TFile; text: string; from: number; to: number; selected: string; after?: string; valid(): boolean;
}
interface HostCommands { listCommands(): { id: string; name: string }[]; executeCommandById(id: string): boolean }
export function hostCommands(app: App): HostCommands | null {
  // Optional compatibility boundary. Never synthesize/evaluate host commands.
  const api = (app as App & { commands?: Partial<HostCommands> }).commands;
  return typeof api?.listCommands === "function" && typeof api.executeCommandById === "function" ? api as HostCommands : null;
}
export class InsertionController {
  live = true;
  private dialogs = new Set<Modal>();
  private creating = new WeakSet<Editor>();
  presenter?: { open(context: InsertContext, point?: {x:number; y:number}): void; close(): void };
  readonly suggest: SlashSuggest;
  readonly attachments: AttachmentImports;
  constructor(readonly app: App, readonly preferences: () => InsertPreferences, readonly zh: () => boolean, private composing: (editor: Editor) => boolean) {
    this.suggest = new SlashSuggest(app, this);
    this.attachments = new AttachmentImports(this);
  }
  capture(editor: Editor, file: TFile, range?: { from: number; to: number }, after?: string): InsertContext | null {
    if (!this.live || this.composing(editor) || editor.listSelections().length !== 1) return null;
    const text = editor.getValue(), start = editor.posToOffset(editor.getCursor("from")), end = editor.posToOffset(editor.getCursor("to")), head = editor.posToOffset(editor.getCursor());
    const from = range?.from ?? start, to = range?.to ?? end;
    if (after) {
      if (text.length > 2 * 1024 * 1024 || !parseBlocks(text).blocks.some(b => b.id === after && !b.locked && b.to === from && from === to)) return null;
    } else if (inProtectedSyntax(text, from, to)) return null;
    const valid = () => this.live && !this.composing(editor) && this.app.vault.getAbstractFileByPath(file.path) === file &&
      this.app.workspace.getLeavesOfType("markdown").some(leaf => {
        const view = leaf.view as typeof leaf.view & { editor?: Editor; file?: TFile };
        return view.editor === editor && view.file === file;
      }) && editor.getValue() === text && editor.listSelections().length === 1 &&
      editor.posToOffset(editor.getCursor("from")) === start && editor.posToOffset(editor.getCursor("to")) === end && editor.posToOffset(editor.getCursor()) === head;
    return { editor, file, text, from, to, selected: range ? "" : text.slice(from, to), after, valid };
  }
  open(context: InsertContext, point?: {x:number; y:number}): void { if (context.valid()) this.presenter?.open(context, point); }
  pickFile(context: InsertContext, kind: "wiki" | "image" | "attachment"): void {
    // Explicit selection-link editing needs a target picker; /Internal link
    // intentionally does not. Keep those independently chosen entry points.
    if (context.valid()) this.show(new FileInsertPicker(this.app, this, context, kind));
  }
  show(dialog: Modal): void { if (!this.live) return; this.dialogs.add(dialog); dialog.open(); }
  release(dialog: Modal): void { this.dialogs.delete(dialog); }
  dispose(): void { this.live = false; this.attachments.dispose(); this.presenter?.close(); this.suggest.close(); for (const dialog of this.dialogs) dialog.close(); this.dialogs.clear(); }
  commit(context: InsertContext, value: Snippet): boolean {
    if (!context.valid()) { if (this.live) new Notice(message("stale", this.zh())); return false; }
    const plan = context.after ? planAfterBlock(context.text, context.after, value) : planInsertion(context.text, context.from, context.to, value);
    if (!plan) { new Notice(message("blockUnavailable", this.zh())); return false; }
    commitInsertion(context.editor, context.text, plan);
    return true;
  }
  commitAttachment(context: InsertContext, text: string): boolean {
    if (!context.valid()) { if (this.live) new Notice(message("stale", this.zh())); return false; }
    // Selecting text before the explicit menu is not permission to delete it.
    // Preserve it and use the directed caret, just like the integrated menu.
    const caret = context.editor.posToOffset(context.editor.getCursor());
    const plan = context.after ? planAfterBlock(context.text, context.after, {text,from:text.length,to:text.length,block:true}) :
      planAttachmentInsertion(context.text, context.selected ? caret : context.from, context.selected ? caret : context.to, text);
    if (!plan) { new Notice(message("blockUnavailable", this.zh())); return false; }
    commitInsertion(context.editor, context.text, plan);
    return true;
  }
  async choose(context: InsertContext, entry: InsertEntry): Promise<void> {
    if (!context.valid()) { if (this.live) new Notice(message("stale", this.zh())); return; }
    if (entry.mode === "command") {
      const api = hostCommands(this.app);
      if (!entry.command || !api?.listCommands().some(c => c.id === entry.command)) { new Notice(message("commandMissing", this.zh())); return; }
      if (context.after) {
        // An explicit custom-command choice establishes a new sibling first.
        // The host command then owns its effects/undo. Restore the blank only
        // if a failed command left the entire document and caret untouched.
        const originalSelection = { from: context.editor.getCursor("from"), to: context.editor.getCursor("to") };
        const plan = planAfterBlock(context.text, context.after, { text: "", from: 0, to: 0, block: true });
        if (!plan || !this.commit(context, { text: "", from: 0, to: 0, block: true })) return;
        let succeeded = false;
        try { succeeded = api.executeCommandById(entry.command); } catch {}
        if (!succeeded) {
          const expected = context.text.slice(0, plan.from) + plan.insert + context.text.slice(plan.to);
          const current = this.capture(context.editor, context.file);
          if (current?.valid() && current.text === expected && current.from === plan.anchor && current.to === plan.anchor) {
            context.editor.replaceRange("", context.editor.offsetToPos(plan.from), context.editor.offsetToPos(plan.from + plan.insert.length), "keyline-next-insert");
            context.editor.setSelection(originalSelection.from, originalSelection.to);
          }
          new Notice(message("commandUnavailable", this.zh()));
        }
        return;
      }
      // Only explicit selection can dispatch a stored command. Remove only its
      // trigger first; the host owns the command's effects and undo behaviour.
      const trigger = context.selected ? "" : context.text.slice(context.from, context.to);
      if (trigger && !this.commit(context, { text: "", from: 0, to: 0, block: false })) return;
      let succeeded = false;
      try {
        succeeded = api.executeCommandById(entry.command);
      } catch { /* Restore only an untouched trigger range, never host edits. */ }
      if (!succeeded) {
        const expected = context.text.slice(0, context.from) + context.text.slice(context.to);
        const current = this.capture(context.editor, context.file);
        if (trigger && current?.valid() && current.text === expected && current.from === context.from && current.to === context.from)
          this.commit(current, { text: trigger, from: trigger.length, to: trigger.length, block: false });
        new Notice(message("commandUnavailable", this.zh()));
      }
      return;
    }
    if (entry.id === "image" || entry.id === "attachment") { this.attachments.open(context, entry.id); return; }
    if (entry.id === "newpage") { await this.createPage(context); return; }
    const value = makeSnippet(entry.id, context.text, context.selected, this.zh(), formattedDates(this.preferences(), this.zh()));
    if (!value) { new Notice(message(entry.id === "toc" ? "noHeadings" : "blockUnavailable", this.zh())); return; }
    this.commit(context, value);
  }
  private async createPage(context: InsertContext): Promise<void> {
    // Freeze the originating view and source path before the asynchronous write.
    // The old interaction is immediate creation beside this note, not a modal
    // and not the global new-file destination. Never navigate a later tab.
    if (this.creating.has(context.editor)) return;
    const sourcePath = context.file.path, folder = context.file.parent, folderPath = folder?.path;
    const leaf = this.app.workspace.getLeavesOfType("markdown").find(l => {
      const view = l.view as typeof l.view & { editor?: Editor; file?: TFile };
      return view.editor === context.editor && view.file === context.file;
    });
    const valid = () => context.valid() && context.file.path === sourcePath && !!folder && folder.path === folderPath &&
      context.file.parent === folder && this.app.vault.getAbstractFileByPath(folder.path) === folder &&
      this.app.workspace.activeLeaf === leaf;
    if (!leaf || !valid()) return;
    const target = availableNotePath(folder!.path, this.zh(), p => this.app.vault.getAbstractFileByPath(p) !== null);
    if (!target) { new Notice(message("createFailed", this.zh())); return; }
    this.creating.add(context.editor);
    let created: TFile | undefined;
    try {
      // create rejects a collision. Do not retry an ambiguous failed write or
      // delete a file on link undo/cancellation; the file is a separate resource.
      created = await this.app.vault.create(target, "");
      if (!valid() || this.app.vault.getAbstractFileByPath(created.path) !== created) {
        if (this.live) new Notice(`${message("createdUnlinked", this.zh())} ${created.path}`);
        return;
      }
      const text = this.app.fileManager.generateMarkdownLink(created, sourcePath);
      if (!this.commit(context, { text, from: text.length, to: text.length, block: false })) {
        if (this.live) new Notice(`${message("createdUnlinked", this.zh())} ${created.path}`);
        return;
      }
      // No await between the final context check, link insertion and opening
      // this exact leaf. Its own undo history retains the link transaction.
      try { await leaf.openFile(created); }
      catch { if (this.live) new Notice(`${message("createdNotOpened", this.zh())} ${created.path}`); }
    } catch {
      if (this.live) new Notice(created ? `${message("createdUnlinked", this.zh())} ${created.path}` : message("createFailed", this.zh()));
    } finally { this.creating.delete(context.editor); }
  }
  link(context: InsertContext, file: TFile, kind: string): boolean {
    if (this.app.vault.getAbstractFileByPath(file.path) !== file) { new Notice(message("missing", this.zh())); return false; }
    let text: string;
    if (kind === "wiki") {
      const target = this.app.metadataCache.fileToLinktext(file, context.file.path, true);
      if (!safeWikiTarget(target)) { new Notice(message("unsafeLink", this.zh())); return false; }
      const alias = context.selected && !/[\[\]|\r\n]/u.test(context.selected) ? `|${context.selected}` : "";
      text = `[[${target}${alias}]]`;
    } else {
      text = this.app.fileManager.generateMarkdownLink(file, context.file.path);
      if ((kind === "image" || this.preferences().embedAttachments) && !text.startsWith("!")) text = "!" + text;
    }
    return this.commit(context, { text, from: text.length, to: text.length, block: false });
  }
}
export function commitInsertion(editor: Editor, text: string, plan: InsertPlan): void {
  const end = editor.offsetToPos(text.length), from = editor.offsetToPos(plan.from), to = editor.offsetToPos(plan.to);
  if (plan.append && plan.to !== text.length) editor.transaction({ changes: [
    { from, to, text: plan.insert }, { from: end, text: plan.append }
  ] }, "keyline-next-insert");
  else editor.replaceRange(plan.insert + (plan.append ?? ""), from, to, "keyline-next-insert");
  editor.setSelection(editor.offsetToPos(plan.anchor), editor.offsetToPos(plan.head));
  editor.focus();
}
export class SlashSuggest {
  context: EditorSuggestContext | null = null;
  constructor(_app: App, private owner: InsertionController) {}
  close(): void { this.context = null; }
  onTrigger(cursor: EditorPosition, editor: Editor, file: TFile | null): EditorSuggestTriggerInfo | null {
    if (!file || !this.owner.live || editor.somethingSelected() || editor.listSelections().length !== 1) return null;
    // Cheap check before parsing: most keystrokes contain no trigger at all.
    if (!editor.getLine(cursor.line).includes(this.owner.preferences().slashTrigger)) return null;
    const hit = slashAt(editor.getValue(), editor.posToOffset(cursor), this.owner.preferences());
    if (!hit || !this.owner.capture(editor, file, hit)?.valid()) return null;
    return { start: editor.offsetToPos(hit.from), end: cursor, query: hit.query };
  }
  getSuggestions(context: EditorSuggestContext): InsertEntry[] { return insertionEntries(this.owner.preferences(), this.owner.zh(), context.query); }
  renderSuggestion(entry: InsertEntry, el: HTMLElement): void {
    el.addClass("keyline-next-insert-suggestion"); el.setAttribute("data-insert-id", entry.id); el.setText(entry.label);
  }
  selectSuggestion(entry: InsertEntry): void {
    const current = this.context;
    if (!current || !this.owner.preferences().slash) return;
    const { editor, file, start, end } = current;
    const hit = this.onTrigger(editor.getCursor(), editor, file);
    if (!hit || editor.getRange(start, end) !== this.owner.preferences().slashTrigger + current.query || hit.start.line !== start.line || hit.start.ch !== start.ch ||
      hit.end.line !== end.line || hit.end.ch !== end.ch) { this.close(); return; }
    const context = this.owner.capture(editor, file, { from: editor.posToOffset(start), to: editor.posToOffset(end) });
    this.close();
    if (context) void this.owner.choose(context, entry);
  }
}
class FileInsertPicker extends SuggestModal<TFile> {
  constructor(app: App, private owner: InsertionController, private context: InsertContext, private kind: string) { super(app); this.setPlaceholder(message("selectFile", owner.zh())); }
  getSuggestions(query: string): TFile[] {
    const files = this.kind === "wiki" ? this.app.vault.getMarkdownFiles() : this.app.vault.getFiles().filter(file =>
      this.kind === "image" ? /^(png|jpe?g|gif|webp|svg|bmp|avif)$/iu.test(file.extension) : file.extension !== "md");
    return files.filter(file => (this.kind !== "wiki" || safeWikiTarget(file.path)) && file.path.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.path.localeCompare(b.path)).slice(0, 100);
  }
  renderSuggestion(file: TFile, el: HTMLElement): void { el.createDiv({ text: file.basename }); el.createDiv({ text: file.path, cls: "setting-item-description" }); }
  onChooseSuggestion(file: TFile): void { this.owner.link(this.context, file, this.kind); }
  onClose(): void { super.onClose(); this.owner.release(this); }
}
