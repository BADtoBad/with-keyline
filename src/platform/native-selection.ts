import type { App, Editor } from "obsidian";
import type { EditorView } from "@codemirror/view";
export interface AnnotationProvider {
  apiVersion: 1; active: boolean;
  availability(view: EditorView): string | null;
  insertFromView(view: EditorView, kind: "sidenote" | "marginnote"): boolean;
}
export function annotationProvider(app: App): AnnotationProvider | null {
  try {
    const value = (app as App & { plugins?: { plugins?: Record<string, Partial<AnnotationProvider>> } }).plugins?.plugins?.["keyline-marginalia"];
    return value?.apiVersion === 1 && value.active === true && typeof value.availability === "function" && typeof value.insertFromView === "function"
      ? value as AnnotationProvider : null;
  } catch { return null; }
}
export function annotationStatus(app: App, view: EditorView): { provider: AnnotationProvider | null; reason: string | null; error: boolean } {
  const provider = annotationProvider(app);
  if (!provider) return { provider: null, reason: null, error: false };
  try {
    const reason: unknown = provider.availability(view);
    if (reason === null || (typeof reason === "string" && reason.trim())) return { provider, reason: reason as string | null, error: false };
  } catch { /* An optional plugin must not break the editor's toolbar. */ }
  return { provider: null, reason: null, error: true };
}
export function insertAnnotation(app: App, view: EditorView, kind: "sidenote" | "marginnote", valid: () => boolean): { status: "inserted" | "unavailable" | "failed" | "stale"; reason?: string } {
  if (!valid()) return { status: "stale" };
  const state = annotationStatus(app, view);
  if (state.error) return { status: "failed" };
  if (!state.provider || state.reason) return { status: "unavailable", ...(state.reason ? { reason: state.reason } : {}) };
  // Availability belongs to another plugin and can synchronously change the
  // document, selection or provider lifecycle. Validate again before writing.
  if (!valid() || annotationProvider(app) !== state.provider) return { status: "stale" };
  try { return { status: state.provider.insertFromView(view, kind) === true ? "inserted" : "failed" }; }
  catch { return { status: "failed" }; } // No retry or rollback of a possibly partial edit.
}
export const nativeSelectionCommands = {
  bold: "editor:toggle-bold", italic: "editor:toggle-italics",
  strike: "editor:toggle-strikethrough", code: "editor:toggle-code",
  link: "editor:insert-link", highlight: "editor:toggle-highlight"
} as const;
export type NativeSelectionAction = keyof typeof nativeSelectionCommands;

/** Match the integrated companion's core formatting behaviour, while refusing
 * a stale selection or a command routed to a different editor. */
export function nativeSelectionAction(app: App, editor: Editor, action: NativeSelectionAction, valid: () => boolean): boolean {
  const api = (app as App & { commands?: { executeCommandById?: (id: string) => boolean } }).commands;
  if (!valid() || !api?.executeCommandById) return false;
  editor.focus();
  if (!valid() || app.workspace.activeEditor?.editor !== editor) return false;
  try { return api.executeCommandById(nativeSelectionCommands[action]); } catch { return false; }
}
export function selectionBlockLabel(line: string, zh: boolean): string {
  // Match the integrated toolbar's physical-line label. Indented rows retain
  // its Text fallback; this display label never determines structural edits.
  const s = line, heading = /^(#{1,6})\s/u.exec(s);
  if (heading) return `${zh ? "标题" : "Heading"} ${heading[1].length}`;
  if (/^[-*+]\s+\[[ xX]\](?:\s|$)/u.test(s)) return zh ? "待办" : "Task";
  if (/^[-*+]\s/u.test(s)) return zh ? "项目符号列表" : "Bullet list";
  if (/^\d+[.)]\s/u.test(s)) return zh ? "编号列表" : "Numbered list";
  if (/^>\s*\[!/u.test(s)) return "Callout";
  if (/^>/u.test(s)) return zh ? "引用" : "Quote";
  if (/^(?:```|~~~)/u.test(s)) return zh ? "代码块" : "Code block";
  if (/^\$\$/u.test(s)) return zh ? "公式块" : "Math block";
  return zh ? "正文" : "Text";
}
