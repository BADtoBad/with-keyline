import { Notice, Platform, Plugin } from "obsidian";
import { decodePreferences, defaults, editingPreferences, writablePreferences, type Preferences } from "./domain/preferences";
import { inlineEdit } from "./domain/format";
import { FileIdentities } from "./platform/file-identities";
import { MentionController } from "./platform/mention-menu";
import { FormatPicker, formatSelection, inlineStyles } from "./platform/format-command";
import { VerifiedStore } from "./platform/persistence";
import { NextSettings } from "./settings";
import { isChinese, message } from "./strings";
import { TypographyController } from "./platform/typography";
import { EditorRhythmController } from "./platform/editor-rhythm";
import { ToolbarController } from "./platform/selection-toolbar";
import { WorkspaceController } from "./platform/workspaces";
import { appendBlockMenu, BlockConvertPicker, blockActions, blockActionPlan, captureBlock, performBlock } from "./platform/block-commands";
import { InsertionController } from "./platform/insertion";
import { InsertionMenus } from "./platform/insertion-menus";
import { WritingController } from "./platform/writing";
import { BlockHandles } from "./platform/block-handles";
import { BlockKeys } from "./platform/block-keys";
import { RowSelection } from "./platform/row-selection";
import { RichFormatting } from "./platform/rich-format";
import { inProtectedSyntax } from "./domain/blocks";
import { IconEditor } from "./platform/icon-editor";
import { renameIconRules } from "./domain/icons";
import { ExplorerActions } from "./platform/explorer";
import { HoverHints, MenuMode } from "./platform/interface";
import { ShellPresentation } from "./platform/shell";
import { SyncStatusPresentation } from "./platform/sync-status";
import { SettingsTransfer } from "./platform/settings-transfer";
import { platformPreferences } from "./domain/mobile";

export default class KeylineNext extends Plugin {
  preferences: Preferences = { ...defaults };
  readOnly = false;
  store!: VerifiedStore<Preferences>;
  transfer?: SettingsTransfer;
  private identities?: FileIdentities;
  iconEditor?: IconEditor;
  explorer?: ExplorerActions;
  menuMode?: MenuMode;
  private hints?: HoverHints;
  private shell?: ShellPresentation;
  private syncStatus?: SyncStatusPresentation;
  private typography?: TypographyController;
  private rhythm?: EditorRhythmController;
  private rowSelection?: RowSelection;
  private toolbar?: ToolbarController;
  private mentions?: MentionController;
  private rich?: RichFormatting;
  workspaces?: WorkspaceController;
  insertion?: InsertionController;
  private insertMenus?: InsertionMenus;
  writing?: WritingController;
  private handles?: BlockHandles;
  private warning?: Notice;
  private betaNotice?: Notice;
  private composition = new WeakSet<Document>();
  private ready = false;
  private active = true;
  get zh(): boolean { return isChinese(this.preferences); }
  get mobile(): boolean { return Platform.isMobile; }
  get effectivePreferences(): Preferences { return platformPreferences(this.preferences, this.mobile); }
  private get editorPreferences(): Preferences { return editingPreferences(this.effectivePreferences); }
  watchInterfaceDocument(doc: Document): void { this.hints?.watch(doc); }

  async onload(): Promise<void> {
    this.register(() => { this.active = false; });
    try {
      const data: unknown = await this.loadData();
      this.preferences = decodePreferences(data);
      this.readOnly = !writablePreferences(data);
    } catch { this.readOnly = true; }
    if (!this.active) return;
    if (this.mobile) {
      this.betaNotice = new Notice(message("mobileBeta", this.zh), 12000);
      this.register(() => this.betaNotice?.hide());
    }
    this.store = new VerifiedStore(value => this.saveData(value), () => this.loadData(), state => this.saveStatus(state));
    this.register(() => { this.store.close(); this.warning?.hide(); });
    const adapter = this.app.vault.adapter, directory = this.manifest.dir ?? `${this.app.vault.configDir}/plugins/${this.manifest.id}`;
    const dataPath = `${directory}/data.json`, backups = `${directory}/settings-backups`;
    this.transfer = new SettingsTransfer({
      read: async () => await adapter.exists(dataPath) ? adapter.read(dataPath) : null,
      write: async value => { if (value === null) { if (await adapter.exists(dataPath)) await adapter.remove(dataPath); } else await adapter.write(dataPath,value); },
      createBackup: async (name,value) => {
        if (!await adapter.exists(backups)) await adapter.mkdir(backups);
        const target = `${backups}/${name}`;
        if (await adapter.exists(target)) throw Error("Backup already exists; no overwrite");
        await adapter.write(target,value);
      },
      readBackup: name => adapter.read(`${backups}/${name}`),
      listBackups: async () => await adapter.exists(backups) ? (await adapter.list(backups)).files.map(path=>path.slice(path.lastIndexOf("/")+1)) : []
    }, () => this.preferences, () => this.active && !this.readOnly && !this.store.dirty,
    value => { this.preferences = value; this.refreshPreferences(); }, () => { this.readOnly = true; });
    this.register(() => this.transfer?.close());
    this.identities = new FileIdentities(this.app, () => this.preferences);
    this.register(() => this.identities?.dispose());
    this.iconEditor = new IconEditor(this);
    this.register(() => this.iconEditor?.dispose());
    if (!this.mobile) this.explorer = new ExplorerActions(this);
    this.register(() => this.explorer?.dispose());
    this.menuMode = new MenuMode(this.app);
    this.register(() => this.menuMode?.dispose());
    if (!this.mobile) this.hints = new HoverHints(() => this.preferences.hints);
    this.hints?.watch(document);
    this.register(() => this.hints?.dispose());
    if (!this.mobile) this.shell = new ShellPresentation(this.app, () => this.zh);
    this.register(() => this.shell?.dispose());
    if (!this.mobile) this.syncStatus = new SyncStatusPresentation();
    this.register(() => this.syncStatus?.dispose());
    this.registerEvent(this.app.workspace.on("window-open", (_workspace, win) => {
      this.hints?.watch(win.document); this.explorer?.schedule();
      this.shell?.watch(win.document);
      this.syncStatus?.watch(win.document);
    }));
    this.registerEvent(this.app.workspace.on("file-menu", (menu, file) => {
      menu.addItem(item => item.setTitle(message("changeIcon", this.zh)).setIcon("palette").setDisabled(this.readOnly)
        .onClick(() => this.iconEditor?.file(file)));
    }));
    this.addCommand({ id: "file-icon", name: message("currentFileIcon", this.zh), checkCallback: checking => {
      const file = this.app.workspace.getActiveFile();
      if (!file || this.readOnly) return false;
      if (!checking) this.iconEditor?.file(file);
      return true;
    } });
    this.typography = new TypographyController(this.app, () => this.effectivePreferences);
    this.register(() => this.typography?.dispose());
    this.rhythm = new EditorRhythmController(() => this.editorPreferences);
    this.registerEditorExtension(this.rhythm.extension());
    this.register(() => this.rhythm?.dispose());
    if (!this.mobile) {
      this.rowSelection = new RowSelection(() => this.editorPreferences);
      this.registerEditorExtension(this.rowSelection.extension());
      this.register(() => this.rowSelection?.dispose());
    }
    this.rich = new RichFormatting(this.app, () => this.zh, () => this.insertion, editor =>
      this.app.workspace.getLeavesOfType("markdown").some(leaf => (leaf.view as typeof leaf.view & { editor?: unknown }).editor === editor && this.composition.has(leaf.view.containerEl.ownerDocument)));
    this.register(() => this.rich?.dispose());
    if (!this.mobile) {
      this.toolbar = new ToolbarController(this.app, () => this.editorPreferences, () => this.zh, this.rich);
      this.registerEditorExtension(this.toolbar.extension());
      this.register(() => this.toolbar?.dispose());
      this.workspaces = new WorkspaceController(this.app, this.addStatusBarItem(),
        this.manifest.dir ?? `${this.app.vault.configDir}/plugins/${this.manifest.id}`,
        () => !this.readOnly && this.preferences.workspaces, () => this.zh);
      this.register(() => this.workspaces?.dispose());
    }
    const watched = new WeakSet<Document>();
    const bindDocuments = () => {
      this.app.workspace.iterateAllLeaves(leaf => {
        const doc = leaf.view.containerEl.ownerDocument;
        if (watched.has(doc)) return;
        watched.add(doc);
        this.hints?.watch(doc);
        this.shell?.watch(doc);
        this.syncStatus?.watch(doc);
        this.registerDomEvent(doc, "compositionstart", () => this.composition.add(doc));
        this.registerDomEvent(doc, "compositionend", () => this.composition.delete(doc));
      });
    };
    this.app.workspace.onLayoutReady(() => {
      if (!this.active) return;
      this.ready = true; this.shell?.watch(document); this.syncStatus?.watch(document); bindDocuments(); this.identities?.refresh(); this.explorer?.refresh(); this.typography?.refresh(); this.workspaces?.refresh();
    });
    this.registerEvent(this.app.workspace.on("layout-change", () => { if (this.ready) { bindDocuments(); this.shell?.refresh(); this.identities?.schedule(); this.explorer?.schedule(); this.typography?.refresh(); this.workspaces?.refresh(); } }));
    this.registerEvent(this.app.workspace.on("css-change", () => { this.shell?.refresh(); this.syncStatus?.refresh(); this.identities?.schedule(); this.explorer?.schedule(); this.typography?.refresh(); this.rhythm?.refresh(); this.rowSelection?.refresh(); this.workspaces?.refresh(); }));
    this.registerEvent(this.app.vault.on("rename", (file, before) => {
      const result = renameIconRules(this.preferences.iconRules, before, file.path);
      if (result.conflict) new Notice(message("iconRenameConflict", this.zh));
      else if (JSON.stringify(result.rules) !== JSON.stringify(this.preferences.iconRules)) void this.update({ iconRules: result.rules });
      this.identities?.schedule();
      this.explorer?.schedule();
    }));
    this.insertion = new InsertionController(this.app, () => this.editorPreferences, () => this.zh, editor =>
      this.app.workspace.getLeavesOfType("markdown").some(leaf => (leaf.view as typeof leaf.view & { editor?: unknown }).editor === editor && this.composition.has(leaf.view.containerEl.ownerDocument)));
    this.register(() => this.insertion?.dispose());
    this.insertMenus = new InsertionMenus(this.insertion);
    this.registerEditorExtension(this.insertMenus.extension());
    this.register(() => this.insertMenus?.dispose());
    if (!this.mobile) {
      this.handles = new BlockHandles(this.app, () => this.editorPreferences, () => this.zh, this.insertion,
        dragGranularity => this.update({ dragGranularity }));
      this.registerEditorExtension(this.handles.extension());
      this.register(() => this.handles?.dispose());
      const blockKeys = new BlockKeys(() => this.editorPreferences);
      this.registerEditorExtension(blockKeys.extension());
      this.register(() => blockKeys.dispose());
      this.addCommand({
        id: "focus-block-handle", name: message("focusBlockHandle", this.zh),
        editorCheckCallback: (checking, editor, view) => {
          if (!view.file || !this.editorPreferences.blockHandles || editor.listSelections().length !== 1) return false;
          return checking ? !!this.handles?.canFocus(editor) : !!this.handles?.focus(editor);
        }
      });
    }
    this.mentions = new MentionController(this.app, () => this.editorPreferences, () => this.zh);
    this.registerEditorExtension(this.mentions.extension());
    this.register(() => this.mentions?.dispose());
    if (!this.mobile) {
      this.writing = new WritingController(() => this.editorPreferences, () => this.zh);
      this.registerEditorExtension(this.writing.extension());
      this.register(() => this.writing?.dispose());
      this.addCommand({ id: "toggle-markers", name: message("toggleMarkers", this.zh),
        callback: () => { void this.update({ hideMarkers: !this.preferences.hideMarkers }); } });
      this.addCommand({ id: "next-suspicious", name: message("nextSuspicious", this.zh),
        editorCheckCallback: (checking, editor, view) => {
          if (!view.file || editor.listSelections().length !== 1) return false;
          return checking || !!this.writing?.next(editor);
        } });
    }
    const settings = new NextSettings(this);
    this.addSettingTab(settings);
    this.register(() => settings.hide());
    this.addCommand({
      id: "insert", name: message("openInsert", this.zh),
      editorCheckCallback: (checking, editor, view) => {
        const context = view.file && this.insertion?.capture(editor, view.file);
        const eligible = !!context?.valid();
        if (eligible && !checking) this.insertion?.open(context!);
        return eligible;
      }
    });
    if (!this.mobile) {
      for (const action of blockActions) this.addCommand({
        id: `block-${action.id}`, name: message(action.label, this.zh),
        editorCheckCallback: (checking, editor, view) => {
          const file = view.file, doc = "containerEl" in view ? view.containerEl.ownerDocument : undefined;
          const context = captureBlock(editor, () => this.active && !!doc && !!file && view.file === file &&
            !this.composition.has(doc));
          const eligible = !!context && (action.id === "select" || !!blockActionPlan(context, action.id));
          if (eligible && !checking) performBlock(context!, action.id);
          return eligible;
        }
      });
      this.addCommand({
        id: "block-convert", name: message("convertBlock", this.zh),
        editorCheckCallback: (checking, editor, view) => {
          const file = view.file, doc = "containerEl" in view ? view.containerEl.ownerDocument : undefined;
          const context = captureBlock(editor, () => this.active && !!doc && !!file && view.file === file && !this.composition.has(doc));
          if (context && !checking) new BlockConvertPicker(this.app, context, this.zh).open();
          return !!context;
        }
      });
      for (const [id, label, run] of [
        ["switch-workspace", "switchWorkspace", () => this.workspaces?.open()],
        ["save-workspace", "saveWorkspace", () => this.workspaces?.save()],
        ["save-workspace-as", "saveWorkspaceAs", () => this.workspaces?.saveAs()],
        ["restore-workspace", "restoreWorkspace", () => { void this.workspaces?.restore(); }]
      ] as const) this.addCommand({ id, name: message(label, this.zh), callback: run });
      this.addCommand({
        id: "focus-toolbar", name: message("focusToolbar", this.zh),
        editorCheckCallback: (checking, editor) => {
          const selected = editor.getSelection(), text = editor.getValue();
          const eligible = this.editorPreferences.toolbar && editor.listSelections().length === 1 && !!selected.trim() &&
            selected.length <= 16000 && text.length <= 2 * 1024 * 1024 &&
            !inProtectedSyntax(text, editor.posToOffset(editor.getCursor("from")), editor.posToOffset(editor.getCursor("to")));
          if (eligible && !checking) this.toolbar?.focus(editor);
          return eligible;
        }
      });
      for (const action of ["colors", "link"] as const) this.addCommand({
        id: `selection-${action}`, name: message(action, this.zh),
        editorCheckCallback: (checking, editor, view) => {
          const context = view.file && this.rich?.capture(editor, view.file);
          if (!context?.valid()) return false;
          if (!checking) {
            if (action === "colors") this.rich!.colors(context);
            else if ("containerEl" in view) {
              const rect = view.containerEl.getBoundingClientRect();
              this.rich!.link(context, { x: rect.left + 24, y: rect.top + 80 }, view.containerEl.ownerDocument);
            }
          }
          return true;
        }
      });
    }
    for (const style of inlineStyles) this.addCommand({
      id: `format-${style}`, name: message(style, this.zh),
      editorCheckCallback: (checking, editor) => {
        const eligible = editor.listSelections().length === 1 && inlineEdit(editor.getSelection(), style) !== null;
        if (eligible && !checking) formatSelection(editor, style);
        return eligible;
      }
    });
    this.addCommand({
      id: "format-selection", name: message("format", this.zh),
      editorCheckCallback: (checking, editor) => {
        const eligible = editor.listSelections().length === 1 && inlineEdit(editor.getSelection(), "bold") !== null;
        if (eligible && !checking) new FormatPicker(this.app, editor, this.zh).open();
        return eligible;
      }
    });
    this.registerEvent(this.app.workspace.on("editor-menu", (menu, editor, view) => {
      const file = view.file, doc = "containerEl" in view ? view.containerEl.ownerDocument : undefined;
      const context = captureBlock(editor, () => this.active && !!doc && !!file && view.file === file &&
        !this.composition.has(doc));
      if (context && !this.mobile) appendBlockMenu(menu, this.app, context, this.zh);
      if (editor.listSelections().length !== 1 || !inlineEdit(editor.getSelection(), "bold")) return;
      menu.addItem(item => item.setTitle(message("format", this.zh)).setIcon("type").onClick(() => new FormatPicker(this.app, editor, this.zh).open()));
    }));
  }

  async update(patch: Partial<Preferences>): Promise<void> {
    if (this.readOnly || !this.store || this.transfer?.busy) return;
    this.preferences = decodePreferences({ ...this.preferences, ...patch });
    this.refreshPreferences();
    await this.store.save(this.preferences);
  }
  private refreshPreferences(): void {
    this.identities?.refresh();
    this.explorer?.refresh(); this.hints?.refresh(); this.shell?.refresh();
    this.typography?.refresh(); this.rhythm?.refresh(); this.rowSelection?.refresh(); this.toolbar?.refresh(); this.workspaces?.refresh();
    this.writing?.refresh(); this.handles?.refresh(); this.mentions?.refresh(); this.insertMenus?.close();
  }
  private saveStatus(state: "saved" | "failed"): void {
    if (state === "saved") {
      if (this.warning) { this.warning.hide(); this.warning = undefined; new Notice(message("saved", this.zh)); }
    } else if (!this.warning?.noticeEl.isConnected) {
      const doc = this.app.workspace.getMostRecentLeaf()?.view.containerEl.ownerDocument ?? document;
      const fragment = doc.createDocumentFragment();
      fragment.createDiv({ text: message("failed", this.zh) });
      const retry = fragment.createEl("button", { text: message("retry", this.zh) });
      retry.type = "button";
      retry.addEventListener("click", event => { event.stopPropagation(); void this.store.retry(); });
      this.warning = new Notice(fragment, 0);
    }
  }
}
