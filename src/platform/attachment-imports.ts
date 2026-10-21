import { Notice, type App, type Editor, type TFile } from "obsidian";
import { attachmentLink, attachmentName, imageAccept, isImageName } from "../domain/attachments";
import type { InsertContext } from "./insertion";
import { message } from "../strings";

type Kind = "image" | "attachment";
interface Owner {
  app: App; live: boolean; zh(): boolean; preferences(): {embedAttachments: boolean};
  commitAttachment(context: InsertContext, text: string): boolean;
}
/** File handles come only from explicit native file-input selection. Every
 * awaited step rechecks the captured source; partial files are kept/reported. */
export class AttachmentImports {
  private inputs = new Map<Editor, { input: HTMLInputElement; cancel(): void }>();
  constructor(private owner: Owner) {}
  open(context: InsertContext, kind: Kind): void {
    if (!context.valid()) return;
    const leaf = this.owner.app.workspace.getLeavesOfType("markdown").find(l =>
      (l.view as typeof l.view & {editor?: Editor}).editor === context.editor);
    const doc = leaf?.view.containerEl.ownerDocument;
    if (!leaf || !doc || this.owner.app.workspace.activeLeaf !== leaf) return;
    this.inputs.get(context.editor)?.cancel();
    const input = doc.createElement("input"); input.type = "file"; input.multiple = true; input.hidden = true;
    input.className = "keyline-next-attachment-input";
    if (kind === "image") input.accept = imageAccept;
    let cancelled = false, started = false;
    const cancel = () => { cancelled = true; input.remove(); if (this.inputs.get(context.editor)?.input === input) this.inputs.delete(context.editor); };
    const sourcePath = context.file.path;
    const valid = () => !cancelled && this.owner.live && context.valid() && context.file.path === sourcePath && this.owner.app.workspace.activeLeaf === leaf;
    input.addEventListener("cancel", cancel, {once:true});
    input.addEventListener("change", () => {
      if (started || !valid()) { cancel(); return; }
      started = true;
      void this.import(context, Array.from(input.files ?? []), kind, valid).finally(cancel);
    }, {once:true});
    this.inputs.set(context.editor, {input, cancel}); doc.body.append(input);
    try { input.click(); } catch { cancel(); if (this.owner.live) new Notice(message("attachmentFailed", this.owner.zh())); }
  }
  async import(context: InsertContext, chosen: readonly File[], kind: Kind, valid: () => boolean = context.valid): Promise<void> {
    const files = kind === "image" ? chosen.filter(f => isImageName(f.name)) : chosen;
    if (!files.length) { if (chosen.length && this.owner.live) new Notice(message("selectImage", this.owner.zh())); return; }
    const saved: TFile[] = [], links: string[] = [], sourcePath = context.file.path;
    const embed = this.owner.preferences().embedAttachments;
    const current = () => this.owner.live && valid() && context.valid() && context.file.path === sourcePath;
    try {
      for (const file of files) {
        if (!current()) throw Error("Stale import");
        const bytes = await file.arrayBuffer();
        if (!current()) throw Error("Stale import");
        const path = await this.owner.app.fileManager.getAvailablePathForAttachment(attachmentName(file.name), sourcePath);
        if (!current()) throw Error("Stale import");
        // The host resolves an unused path; createBinary still rejects a racing
        // collision. No overwrite, auto-delete or retry after an uncertain save.
        const created = await this.owner.app.vault.createBinary(path, bytes); saved.push(created);
        if (!current() || this.owner.app.vault.getAbstractFileByPath(created.path) !== created) throw Error("Stale import");
        const link = attachmentLink(this.owner.app.fileManager.generateMarkdownLink(created, sourcePath), created.basename, kind === "image", embed);
        if (!link) throw Error("Invalid host link");
        links.push(link);
      }
      const text = links.join("\n");
      if (!current() || !this.owner.commitAttachment(context, text)) throw Error("Stale insertion");
    } catch {
      if (this.owner.live) new Notice(message(saved.length ? "attachmentsKept" : "attachmentFailed", this.owner.zh()) + (saved.length ? "\n" + saved.map(f => f.path).join("\n") : ""));
    }
  }
  dispose(): void { for (const {cancel} of [...this.inputs.values()]) cancel(); this.inputs.clear(); }
}
