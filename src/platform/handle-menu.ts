import { Notice, type App, type Editor, type TFile } from "obsidian";
import { applyBlockEdit, blockSelection, convertBlocks, parseBlocks, type BlockEdit, type Conversion } from "../domain/blocks";
import { handleConversion, handleDelete, handleRow } from "../domain/handle-menu";
import { colorSelection } from "../domain/rich-format";
import { blockLinkPlan, selectionBlockPlan } from "../domain/selection-blocks";
import type { FormatContext } from "./rich-format";
import type { FormatMenuActions } from "./selection-menu";

/** Capture the hovered row and the *actual* directed editor selection separately.
 * Opening a menu must not select the row or borrow an unrelated text selection. */
export function captureHandleMenu(app: App, editor: Editor, file: TFile, at: number, guard: () => boolean,
  doc: Document, zh: boolean): { context: FormatContext; actions: FormatMenuActions } | null {
  const text = editor.getValue(), path = file.path;
  if (!guard() || text.length > 2 * 1024 * 1024 || editor.listSelections().length !== 1) return null;
  const selection = JSON.stringify(editor.listSelections()), model = parseBlocks(text), row = handleRow(model, at);
  const blocks = blockSelection(model, at, at);
  if (!row && (!blocks.length || blocks.some(b => b.locked))) return null;
  const valid = () => guard() && file.path === path && app.vault.getAbstractFileByPath(path) === file &&
    editor.getValue() === text && JSON.stringify(editor.listSelections()) === selection;
  const context: FormatContext = { editor, file, text, from: row?.bodyFrom ?? at, to: row?.to ?? at, valid };
  const commit = (plan: BlockEdit): boolean => {
    if (!valid() || applyBlockEdit(text, plan) === null) return false;
    // Retain native position mapping, including an unrelated directed selection.
    // "set" avoids typed-list renumbering; no explicit selection rewrite occurs.
    editor.replaceRange(plan.insert, editor.offsetToPos(plan.from), editor.offsetToPos(plan.to), "set");
    editor.focus(); return true;
  };
  const remove = row && handleDelete(model, row), clipboard = doc.defaultView?.navigator.clipboard;
  const copyPlan = blockLinkPlan(model, blocks, path, "ki-probe");
  const actions: FormatMenuActions = {
    plain: !!row?.plain, commit,
    conversion(target) {
      if (row) return handleConversion(model, row, target);
      // The primary grip addresses a physical row. A newly supported whole-
      // block conversion must not silently widen that contract for nested
      // items or rows owning children. Explicit selection/structural commands
      // retain those safe planners; copy-link still uses its parsed block.
      if (blocks.some(b => b.kind === "item" && (b.depth > 1 || b.children.length > 0))) return null;
      return target === "code" || target === "math" || target === "divider" || target.startsWith("callout-")
        ? selectionBlockPlan(model, blocks, target as Parameters<typeof selectionBlockPlan>[2])
        : convertBlocks(model, blocks, target as Conversion);
    },
    canColor: !!row && !!(colorSelection(text, row.bodyFrom, row.to, { text: "blue" }) || colorSelection(text, row.bodyFrom, row.to, { text: "red" })),
    color(patch) {
      const edit = row && colorSelection(text, row.bodyFrom, row.to, patch);
      if (!edit || !commit({ ...edit, before: text.slice(edit.from, edit.to) })) return false;
      editor.setCursor(editor.offsetToPos(edit.head)); return true;
    },
    remove: remove ? () => { commit(remove); } : undefined,
    copy: copyPlan && clipboard ? () => {
      if (!valid()) return;
      const entropy = new Uint32Array(2); doc.defaultView!.crypto.getRandomValues(entropy);
      const plan = blockLinkPlan(model, blocks, path, `ki-${Array.from(entropy, n => n.toString(36)).join("-")}`);
      if (!plan || plan.edit && !commit(plan.edit)) return;
      void clipboard.writeText(plan.link).then(() => new Notice(zh ? "区块链接已复制" : "Block link copied"),
        () => new Notice(zh ? "无法写入剪贴板。新增的区块 ID 可撤销。" : "Could not write to clipboard. A newly added block ID can be undone."));
    } : undefined
  };
  return { context, actions };
}
