import { Notice, SuggestModal, type App, type Editor, type Menu } from "obsidian";
import { applyBlockEdit, blockSelection, convertBlocks, deleteBlocks, duplicateBlocks, parseBlocks, shiftBlocks, type BlockEdit, type Blocks, type Block, type Conversion } from "../domain/blocks";
import { message, type Message } from "../strings";
import { changeBlockIndent } from "../domain/relocation";

export type BlockAction = "select" | "up" | "down" | "indent" | "outdent" | "duplicate" | "delete";
export const blockActions: { id: BlockAction; label: Message; icon: string }[] = [
  { id: "select", label: "selectBlock", icon: "scan" },
  { id: "up", label: "moveBlockUp", icon: "arrow-up" },
  { id: "down", label: "moveBlockDown", icon: "arrow-down" },
  { id: "indent", label: "indentBlock", icon: "indent-increase" },
  { id: "outdent", label: "outdentBlock", icon: "indent-decrease" },
  { id: "duplicate", label: "duplicateBlock", icon: "copy" },
  { id: "delete", label: "deleteBlock", icon: "trash-2" }
];
export interface EditContext {
  editor: Editor; model: { text: string };
  valid: () => boolean;
}
export interface BlockContext extends EditContext {
  model: Blocks; blocks: Block[]; from: number; to: number;
}
const cache = new WeakMap<Editor, Blocks>();
export function captureBlock(editor: Editor, guard: () => boolean = () => true, range?: { from: number; to: number }): BlockContext | null {
  if (!guard() || editor.listSelections().length !== 1) return null;
  const text = editor.getValue();
  // Bound synchronous work. Ordinary editor operations remain available for
  // exceptionally large documents; do not stall input to draw a handle.
  if (text.length > 2 * 1024 * 1024) return null;
  let model = cache.get(editor);
  if (!model || model.text !== text) { model = parseBlocks(text); cache.set(editor, model); }
  const selectedFrom = editor.posToOffset(editor.getCursor("from")), selectedTo = editor.posToOffset(editor.getCursor("to"));
  const from = range?.from ?? selectedFrom, to = range?.to ?? selectedTo;
  const blocks = blockSelection(model, from, to);
  if (!blocks.length || blocks.some(b => b.locked)) return null;
  return { editor, model, blocks, from, to, valid: () => guard() && editor.getValue() === text &&
    editor.listSelections().length === 1 && editor.posToOffset(editor.getCursor("from")) === selectedFrom && editor.posToOffset(editor.getCursor("to")) === selectedTo };
}
export function blockActionPlan(context: BlockContext, action: BlockAction): BlockEdit | null {
  const blocks = context.blocks, model = context.model;
  return action === "up" ? shiftBlocks(model, blocks, -1) : action === "down" ? shiftBlocks(model, blocks, 1) :
    action === "indent" ? changeBlockIndent(model, blocks, 1) : action === "outdent" ? changeBlockIndent(model, blocks, -1) :
    action === "duplicate" ? duplicateBlocks(model, blocks) : action === "delete" ? deleteBlocks(model, blocks) : null;
}
export function commitBlockEdit(context: EditContext, plan: BlockEdit): boolean {
  if (!context.valid() || applyBlockEdit(context.model.text, plan) === null) return false;
  const editor = context.editor;
  // This is a fully planned structural replacement, not typed list input.
  // The native Editor origin "set" keeps automatic list renumbering from
  // altering unselected siblings while retaining normal history and filters.
  editor.replaceRange(plan.insert, editor.offsetToPos(plan.from), editor.offsetToPos(plan.to), "set");
  editor.setSelection(editor.offsetToPos(plan.anchor), editor.offsetToPos(plan.head));
  editor.focus();
  return true;
}
export function performBlock(context: BlockContext, action: BlockAction): boolean {
  if (!context.valid()) return false;
  if (action === "select") {
    const first = context.blocks[0], last = context.blocks[context.blocks.length - 1];
    context.editor.setSelection(context.editor.offsetToPos(first.from), context.editor.offsetToPos(last.to));
    context.editor.focus(); return true;
  }
  const plan = blockActionPlan(context, action);
  return !!plan && commitBlockEdit(context, plan);
}
export function appendBlockMenu(menu: Menu, app: App, context: BlockContext, zh: boolean, convert?: () => void): void {
  menu.addSeparator();
  for (const action of blockActions) menu.addItem(item => item.setTitle(message(action.label, zh)).setIcon(action.icon)
    .setDisabled(action.id !== "select" && !blockActionPlan(context, action.id))
    .onClick(() => { if (!performBlock(context, action.id)) new Notice(message("blockUnavailable", zh)); }));
  if (context.blocks.length) menu.addItem(item => item.setTitle(message("convertBlock", zh)).setIcon("replace")
    .onClick(convert ?? (() => new BlockConvertPicker(app, context, zh).open())));
}
export const conversions: Conversion[] = ["paragraph", "h1", "h2", "h3", "h4", "h5", "h6", "task", "bullet", "number", "quote"];
export const conversionLabels: Record<Conversion, [string, string]> = {
  paragraph: ["Text", "正文"], h1: ["Heading 1", "标题 1"], h2: ["Heading 2", "标题 2"], h3: ["Heading 3", "标题 3"],
  h4: ["Heading 4", "标题 4"], h5: ["Heading 5", "标题 5"], h6: ["Heading 6", "标题 6"],
  bullet: ["Bullet list", "列表"], number: ["Numbered list", "序号"], task: ["Task", "任务"], quote: ["Quote", "引用"]
};
export class BlockConvertPicker extends SuggestModal<Conversion> {
  private plans = new Map<Conversion, BlockEdit | null>();
  constructor(app: App, private context: BlockContext, private zh: boolean) { super(app); this.setPlaceholder(message("convertBlock", zh)); }
  private plan(target: Conversion): BlockEdit | null {
    if (!this.context.valid()) return null;
    if (!this.plans.has(target)) this.plans.set(target, convertBlocks(this.context.model, this.context.blocks, target));
    return this.plans.get(target) ?? null;
  }
  getSuggestions(query: string): Conversion[] {
    if (!this.context.blocks.length || !this.context.valid()) return [];
    return conversions.filter(target => conversionLabels[target].join(" ").toLowerCase().includes(query.toLowerCase()) &&
      this.plan(target));
  }
  renderSuggestion(value: Conversion, el: HTMLElement): void { el.setText(conversionLabels[value][this.zh ? 1 : 0]); }
  onChooseSuggestion(target: Conversion): void {
    const plan = this.plan(target);
    if (!plan || !commitBlockEdit(this.context, plan)) new Notice(message("blockUnavailable", this.zh));
  }
}
