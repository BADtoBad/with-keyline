import { Notice, PluginSettingTab, Setting, setIcon } from "obsidian";
import type KeylineNext from "./main";
import type { Preferences } from "./domain/preferences";
import { normalizeTypography, typographyKeys, typographySpecs, typographyVariables } from "./domain/typography";
import { message, type Message } from "./strings";
import { validSlashTrigger } from "./domain/insertion";
import { InsertSettingsModal } from "./platform/insert-settings";
import { formattedDates } from "./platform/dates";
import { iconKinds, kindLabels } from "./domain/icons";
import { SettingsTransferModal } from "./platform/transfer-modal";

const sections = ["interface", "typography", "icons", "editing", "insert", "advanced"] as const;
let settingsSerial = 0;
type Section = typeof sections[number];
const sectionIcons = ["panels-top-left", "type", "palette", "pencil", "plus", "settings"];
const descriptions: Record<Section, [string, string]> = {
  interface: ["Navigation, menus and hints.", "导航、菜单与提示。"],
  typography: ["Page, body, lists and headings.", "页面、正文、列表与标题。"],
  icons: ["File types, artwork and colours.", "文件类型、图形与颜色。"],
  editing: ["Writing guards, selection and block actions.", "书写保护、文本选择与块操作。"],
  insert: ["Triggers, attachments and menu items.", "触发方式、附件与菜单项目。"],
  advanced: ["Compatibility and settings transfer.", "兼容说明与设置导入。"]
};
interface ToggleRow { section: Section; key: "editingEnabled" | "hints" | "fileNavigation" | "workspaces" | "toolbar" | "fileIcons" | "monochrome" | "mentions" | "typographyEnabled" | "slash" | "inlineSlash" | "embedAttachments" | "hideMarkers" | "markSuspicious" | "optionReveal" | "pasteHints" | "fullwidthLinks" | "blockHandles" | "handlePinned" | "handleFold" | "handlePlus" | "snapSelection" | "blockKeys"; label: Message; hint?: Message }
const rows: ToggleRow[] = [
  { section: "interface", key: "hints", label: "hints", hint: "hintsHint" },
  { section: "interface", key: "fileNavigation", label: "fileNavigation", hint: "fileNavigationHint" },
  { section: "interface", key: "workspaces", label: "workspace", hint: "workspaceHint" },
  { section: "typography", key: "typographyEnabled", label: "typographyEnabled", hint: "typographyHint" },
  { section: "icons", key: "fileIcons", label: "fileIcons", hint: "iconsHint" },
  { section: "icons", key: "monochrome", label: "monochrome" },
  { section: "editing", key: "editingEnabled", label: "editingEnabled", hint: "editingEnabledHint" },
  { section: "editing", key: "toolbar", label: "toolbar", hint: "toolbarHint" },
  { section: "editing", key: "hideMarkers", label: "hideMarkers", hint: "hideMarkersHint" },
  { section: "editing", key: "markSuspicious", label: "markSuspicious", hint: "markSuspiciousHint" },
  { section: "editing", key: "optionReveal", label: "optionReveal" },
  { section: "editing", key: "pasteHints", label: "pasteHints" },
  { section: "editing", key: "blockHandles", label: "blockHandles", hint: "blockHandlesHint" },
  { section: "editing", key: "handlePinned", label: "handlePinned" },
  { section: "editing", key: "handleFold", label: "handleFold" },
  { section: "editing", key: "handlePlus", label: "handlePlus" },
  { section: "editing", key: "snapSelection", label: "snapSelection", hint: "snapSelectionHint" },
  { section: "editing", key: "blockKeys", label: "blockKeys", hint: "blockKeysHint" },
  { section: "insert", key: "fullwidthLinks", label: "fullwidthLinks", hint: "fullwidthHint" },
  { section: "insert", key: "mentions", label: "mentions", hint: "mentionsHint" },
  { section: "insert", key: "slash", label: "slash", hint: "slashHint" },
  { section: "insert", key: "inlineSlash", label: "inlineSlash" },
  { section: "insert", key: "embedAttachments", label: "embedAttachments" }
];
export class NextSettings extends PluginSettingTab {
  private readonly panelId = `keyline-next-panel-${++settingsSerial}`;
  private unsubscribe?: () => void;
  private section: Section = "interface";
  private query = "";
  private insertModal?: InsertSettingsModal;
  private transferModal?: SettingsTransferModal;
  private shown = false;
  private resize?: ResizeObserver;
  constructor(private readonly owner: KeylineNext) { super(owner.app, owner); }
  display(): void {
    this.shown = true;
    this.unsubscribe?.();
    this.resize?.disconnect();
    const { containerEl: root, owner } = this, zh = owner.zh;
    owner.watchInterfaceDocument(root.ownerDocument);
    root.empty(); root.addClass("keyline-next-settings");
    const header = root.createDiv({ cls: "keyline-next-settings-header" });
    header.createEl("h2", { text: message("title", zh) });
    header.createSpan({ text: owner.manifest.version, cls: "keyline-next-settings-version" });
    if (owner.readOnly) root.createEl("p", { text: message("incompatible", zh) });
    const status = root.createDiv({ cls: "keyline-next-save-status", attr: { "aria-live": "polite" } });
    const refreshStatus = () => {
      if (!status.isConnected) return;
      status.empty();
      if (owner.store.dirty) new Setting(status).setName(message("failed", owner.zh)).addButton(b => b.setButtonText(message("retry", owner.zh)).onClick(async () => { await owner.store.retry(); refreshStatus(); }));
    };
    this.unsubscribe = owner.store.subscribe(refreshStatus);
    const update = async (patch: Partial<Preferences>) => { await owner.update(patch); refreshStatus(); };
    const searchInput = header.createEl("input", { cls: "keyline-next-settings-search", attr: { type: "search", placeholder: message("search", zh), "aria-label": message("search", zh) } });
    searchInput.value = this.query;
    searchInput.addEventListener("input", () => { this.query = searchInput.value; renderPanel(); });
    searchInput.addEventListener("keydown", event => {
      if (event.key !== "Escape" || !searchInput.value) return;
      event.preventDefault(); event.stopPropagation(); this.query = ""; searchInput.value = ""; renderPanel();
    });
    const select = root.createEl("select", { cls: "dropdown keyline-next-settings-select", attr: { "aria-label": zh ? "设置分类" : "Settings category" } });
    const layout = root.createDiv({ cls: "keyline-next-settings-layout" });
    const nav = layout.createDiv({ cls: "keyline-next-settings-nav", attr: { role: "tablist", "aria-orientation": "vertical", "aria-label": message("title", zh) } });
    const panel = layout.createDiv({ cls: "keyline-next-settings-panel", attr: { role: "tabpanel", id: this.panelId } });
    const tabs: HTMLButtonElement[] = [];
    sections.forEach((section, index) => {
      const button = nav.createEl("button", { attr: { role: "tab", id: `${this.panelId}-${section}`, "aria-controls": this.panelId } });
      const icon = button.createSpan({ cls: "keyline-next-settings-tab-icon", attr: { "aria-hidden": "true" } });
      setIcon(icon, sectionIcons[index]); button.createSpan({ text: message(section, zh) });
      select.createEl("option", { text: message(section, zh), value: section });
      button.type = "button"; tabs.push(button);
      button.addEventListener("click", () => { this.section = section; this.query = ""; searchInput.value = ""; renderPanel(); button.focus(); });
      button.addEventListener("keydown", event => {
        if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        const direction = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1;
        const next = event.key === "Home" ? 0 : event.key === "End" ? sections.length - 1 : (index + direction + sections.length) % sections.length;
        this.section = sections[next]; this.query = ""; searchInput.value = ""; renderPanel(); tabs[next].focus(); event.preventDefault();
      });
    });
    select.addEventListener("change", () => { this.section = select.value as Section; this.query = ""; searchInput.value = ""; renderPanel(); });
    const matches = (...values: string[]) => !this.query.trim() || values.join(" ").toLocaleLowerCase().includes(this.query.trim().toLocaleLowerCase());
    const labelMatches = (...keys: Message[]) => matches(...keys.reduce<string[]>((all, key) => all.concat(message(key, false), message(key, true)), []));
    const updatePreview = () => {
      const preview = panel.querySelector<HTMLElement>(".keyline-next-type-preview");
      if (preview) for (const [name, value] of Object.entries(typographyVariables(owner.preferences.typography))) preview.style.setProperty(name, value);
    };
    const renderPanel = () => {
      panel.empty();
      panel.setAttribute("aria-labelledby", `${this.panelId}-${this.section}`);
      select.value = this.section;
      tabs.forEach((tab, i) => { const selected = sections[i] === this.section; tab.setAttribute("aria-selected", String(selected)); tab.tabIndex = selected ? 0 : -1; });
      const shown = this.query.trim() ? sections : [this.section];
      for (const section of shown) {
        const group = panel.createDiv({ cls: "keyline-next-settings-group" });
        group.createEl("h3", { text: message(section, zh) });
        group.createEl("p", { text: descriptions[section][zh ? 1 : 0], cls: "keyline-next-settings-description" });
        let count = 0;
        if (section === "interface" && labelMatches("language", "languageHint")) {
          new Setting(group).setName(message("language", zh)).setDesc(message("languageHint", zh)).addDropdown(d => {
            d.addOption("auto", message("auto", zh)).addOption("en", "English").addOption("zh", "中文");
            d.setValue(owner.preferences.language).setDisabled(owner.readOnly).onChange(async value => {
              if (value !== "auto" && value !== "en" && value !== "zh") return;
              await update({ language: value }); this.display();
            });
          }); count++;
        }
        if (section === "interface" && labelMatches("menuStyle", "menuStyleHint")) {
          const current = owner.menuMode?.read() ?? null;
          new Setting(group).setName(message("menuStyle", zh))
            .setDesc(message(current === null ? "menuUnavailable" : "menuStyleHint", zh)).addDropdown(d => {
              d.selectEl.dataset.keylineMenuMode = "true";
              d.addOption("themed", message("menuThemed", zh)).addOption("system", message("menuNative", zh))
                .setValue(current ? "system" : "themed").setDisabled(owner.readOnly || current === null)
                .onChange(async value => {
                  if (value !== "system" && value !== "themed") return;
                  d.setDisabled(true);
                  try { if (!await owner.menuMode?.set(value === "system")) new Notice(message("menuFailed", owner.zh)); }
                  finally {
                    const actual = owner.menuMode?.read() ?? null;
                    d.setValue(actual ? "system" : "themed").setDisabled(owner.readOnly || actual === null);
                  }
                });
            }); count++;
        }
        for (const row of rows.filter(row => row.section === section && labelMatches(row.label, ...(row.hint ? [row.hint] : [])))) {
          const setting = new Setting(group).setName(message(row.label, zh));
          if (row.hint) setting.setDesc(message(row.hint, zh));
          setting.addToggle(t => t.setValue(owner.preferences[row.key]).setDisabled(owner.readOnly).onChange(value => update({ [row.key]: value })));
          count++;
        }
        if (section === "icons") {
          for (const kind of iconKinds) if (matches(...kindLabels[kind], message("changeIcon", zh))) {
            new Setting(group).setName(kindLabels[kind][zh ? 1 : 0]).addButton(b => b.setButtonText(message("changeIcon", zh))
              .setDisabled(owner.readOnly).onClick(() => owner.iconEditor?.type(kind))); count++;
          }
          if (!this.query) group.createEl("p", { text: message("iconRulesHint", zh), cls: "setting-item-description" });
        }
        if (section === "editing") {
          if (labelMatches("dragGranularity", "dragGranularityHint", "dragLine", "dragBlock")) {
            new Setting(group).setName(message("dragGranularity", zh)).setDesc(message("dragGranularityHint", zh)).addDropdown(d => {
              d.selectEl.dataset.keylineDragGranularity = "true";
              d.addOption("block", message("dragBlock", zh)).addOption("line", message("dragLine", zh))
                .setValue(owner.preferences.dragGranularity).setDisabled(owner.readOnly)
                .onChange(value => { if (value === "line" || value === "block") void update({ dragGranularity: value }); });
            }); count++;
          }
          if (labelMatches("handleSide")) {
            new Setting(group).setName(message("handleSide", zh)).addDropdown(d => {
              d.addOption("left", message("left", zh)).addOption("right", message("right", zh))
                .setValue(owner.preferences.handleSide).setDisabled(owner.readOnly)
                .onChange(value => update({ handleSide: value === "right" ? "right" : "left" }));
            }); count++;
          }
          for (const key of ["handleHoverDelay", "handleHideDelay"] as const) if (labelMatches(key)) {
            new Setting(group).setName(message(key, zh)).addSlider(slider => {
              slider.sliderEl.setAttribute("aria-label", message(key, zh));
              slider.setLimits(0, key === "handleHoverDelay" ? 1000 : 1500, 10)
                .setDisplayFormat(value => `${value} ms`).setValue(owner.preferences[key])
                .setInstant(true).setDisabled(owner.readOnly).onChange(value => update({ [key]: value }));
            }); count++;
          }
        }
        if (section === "insert") {
          if (labelMatches("trigger")) {
            const setting = new Setting(group).setName(message("trigger", zh));
            setting.addText(input => input.setValue(owner.preferences.slashTrigger).setDisabled(owner.readOnly).onChange(async value => {
              input.inputEl.setAttribute("aria-invalid", String(!validSlashTrigger(value)));
              setting.setDesc(validSlashTrigger(value) ? "" : message("invalidTrigger", zh));
              if (validSlashTrigger(value)) await update({ slashTrigger: value });
            })); count++;
          }
          for (const key of ["dateFormat", "timeFormat"] as const) if (labelMatches(key)) {
            const setting = new Setting(group).setName(message(key, zh));
            const preview = () => setting.setDesc(formattedDates(owner.preferences, zh)[key === "dateFormat" ? "today" : "time"]);
            setting.addText(input => input.setValue(owner.preferences[key]).setDisabled(owner.readOnly).onChange(async value => {
              if (!value.trim() || value.length > 80 || /[\x00-\x1f]/u.test(value)) return;
              await update({ [key]: value }); preview();
            })); preview(); count++;
          }
          if (labelMatches("insertMenu", "customCommand")) {
            new Setting(group).setName(message("insertMenu", zh)).setDesc(zh ? "排序、隐藏与自定义命令。" : "Order, visibility and custom commands.")
              .addButton(b => b.setButtonText(message("insertMenu", zh)).setDisabled(owner.readOnly).onClick(() => {
                this.insertModal?.close(); this.insertModal = new InsertSettingsModal(owner.app, owner); this.insertModal.open();
              })); count++;
          }
        }
        if (section === "typography") {
          for (const key of typographyKeys) {
            const spec = typographySpecs[key];
            if (!matches(...spec.label)) continue;
            const setting = new Setting(group).setName(spec.label[zh ? 1 : 0]);
            setting.addSlider(slider => {
              slider.sliderEl.setAttribute("aria-label", spec.label[zh ? 1 : 0]);
              slider.setLimits(spec.min, spec.max, spec.step).setDisplayFormat(value =>
                key === "inset" && value < 0 ? message("auto", zh) : `${value}${spec.unit}`
              ).setValue(owner.preferences.typography[key]).setInstant(true).setDisabled(owner.readOnly).onChange(async value => {
                await update({ typography: { ...owner.preferences.typography, [key]: value } }); updatePreview();
              });
            });
            count++;
          }
          if (!this.query) {
            new Setting(group).setName(message("reset", zh)).addButton(b => b.setButtonText(message("reset", zh)).setDisabled(owner.readOnly).onClick(async () => { await update({ typography: normalizeTypography(null) }); renderPanel(); }));
            const preview = group.createDiv({ cls: "keyline-next-type-preview" });
            preview.createEl("h4", { text: message("preview", zh) });
            preview.createEl("p", { text: message("previewText", zh) });
            preview.createEl("p", { text: message("previewText", zh) });
            preview.createEl("ul").createEl("li", { text: message("previewText", zh) });
          }
        }
        if (section === "advanced" && labelMatches("compatibility")) { group.createEl("p", { text: message("compatibility", zh) }); count++; }
        if (section === "advanced" && labelMatches("settingsTransfer", "settingsTransferHint")) {
          new Setting(group).setName(message("settingsTransfer",zh)).setDesc(message("settingsTransferHint",zh))
            .addButton(button => button.setButtonText(message("settingsTransfer",zh)).setDisabled(owner.readOnly || !owner.transfer)
              .onClick(() => { this.transferModal?.close(); this.transferModal = new SettingsTransferModal(owner,()=>{ this.transferModal=undefined; if(this.shown&&root.isConnected)this.display(); }); this.transferModal.open(); })); count++;
        }
        if (!count) group.remove();
        else {
          // Group the existing native controls without changing their handlers.
          // Layout dimensions follow the accepted companion; no runtime is reused.
          const cards = new Map<string, HTMLElement>();
          for (const child of Array.from(group.children)) {
            if (!child.matches(".setting-item")) continue;
            const name = child.querySelector(".setting-item-name")?.textContent ?? "";
            let label = message(section, zh);
            if (section === "typography") {
              const index = typographyKeys.findIndex(key => typographySpecs[key].label.some(label => label === name));
              label = index < 2 ? (zh ? "页面" : "Page") : index < 8 ? (zh ? "正文" : "Body") : index < 13 ? (zh ? "列表" : "Lists") : (zh ? "引用与标题" : "Quotes and headings");
              if (index < 0) label = zh ? "页面" : "Page";
            } else if (section === "interface") label = [message("fileNavigation", zh), message("workspace", zh)].includes(name) ? (zh ? "导航" : "Navigation") : (zh ? "显示" : "Display");
            let card = cards.get(label);
            if (!card) {
              const sectionEl = group.createEl("section", { cls: "keyline-next-settings-card", attr: { "aria-label": label } });
              sectionEl.createEl("h4", { text: label });
              card = sectionEl.createDiv({ cls: "keyline-next-settings-items" }); cards.set(label, card);
            }
            card.appendChild(child);
          }
          const preview = group.querySelector(".keyline-next-type-preview");
          if (preview) group.appendChild(preview);
        }
      }
      if (!panel.children.length) panel.createEl("p", { text: message("noResults", zh), attr: { role: "status" } });
      updatePreview();
    };
    renderPanel(); refreshStatus();
    const win = root.ownerDocument.defaultView as Window & typeof globalThis;
    const resize = () => root.classList.toggle("is-narrow", root.getBoundingClientRect().width < 640);
    this.resize = new win.ResizeObserver(resize); this.resize.observe(root); resize();
  }
  hide(): void { this.shown=false; this.resize?.disconnect(); this.resize=undefined; this.unsubscribe?.(); this.unsubscribe = undefined; this.insertModal?.close(); const modal=this.transferModal;this.transferModal=undefined;modal?.close(); }
}
