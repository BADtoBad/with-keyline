import { Modal, Notice, Setting, TFolder, type App, type TAbstractFile, type DropdownComponent, type TextComponent } from "obsidian";
import { identityGlyphs, paintIdentityGlyph } from "./identity-artwork";
import { cleanIconChoice, iconChoice, iconKinds, iconTintCss, iconTints, kindIdentity, kindLabels, resolveIdentity, setIconChoice,
  type IconChoice, type IconKind, type IconRule } from "../domain/icons";
import type { Preferences } from "../domain/preferences";
import { message } from "../strings";
import { iconOwnerPresent } from "./file-identities";

export function availableGlyphs(): string[] {
  return identityGlyphs();
}
interface IconHost {
  app: App; preferences: Preferences; readOnly: boolean; zh: boolean;
  update(patch: Partial<Preferences>): Promise<void>;
}
export class IconEditor {
  private live = true;
  private dialogs = new Set<IconDialog>();
  constructor(private owner: IconHost) {}
  file(file: TAbstractFile): void { this.open("path", file.path, file); }
  type(kind: IconKind): void { if (iconKinds.includes(kind)) this.open("type", kind); }
  private open(scope: IconRule["scope"], key: string, file?: TAbstractFile): void {
    if (!this.live || this.owner.readOnly) return;
    if (iconOwnerPresent(this.owner.app)) { new Notice(message("iconManaged", this.owner.zh)); return; }
    const initial = iconChoice(this.owner.preferences.iconRules, scope, key);
    const valid = () => this.live && !this.owner.readOnly && !iconOwnerPresent(this.owner.app) &&
      (!file || file.path === key && this.owner.app.vault.getAbstractFileByPath(key) === file) &&
      JSON.stringify(iconChoice(this.owner.preferences.iconRules, scope, key)) === JSON.stringify(initial);
    if (!valid()) return;
    const dialog: IconDialog = new IconDialog(this.owner.app, this.owner, scope, key, initial, file instanceof TFolder, valid,
      async choice => {
        if (!valid()) return false;
        const rules = setIconChoice(this.owner.preferences.iconRules, scope, key, choice);
        if (JSON.stringify(iconChoice(rules, scope, key)) !== JSON.stringify(cleanIconChoice(choice))) return false;
        await this.owner.update({ iconRules: rules }); return true;
      }, () => this.dialogs.delete(dialog));
    this.dialogs.add(dialog); dialog.open();
  }
  dispose(): void { this.live = false; for (const dialog of this.dialogs) dialog.close(); this.dialogs.clear(); }
}
const aliases: [string, string][] = [
  ["folder", "文件夹 目录"], ["file", "文件 笔记 文档"], ["calendar", "日历 日期"], ["star", "星 星标"],
  ["home", "主页 家"], ["house", "主页 家"], ["book", "书 阅读"], ["heart", "爱 喜欢"], ["music", "音乐"],
  ["audio", "音频 声音"], ["image", "图片"], ["video", "视频"], ["code", "代码"], ["archive", "归档 压缩"],
  ["briefcase", "工作 项目"], ["lightbulb", "想法 灵感"], ["check", "任务 完成"], ["tag", "标签"]
];
export function matchGlyph(id: string, query: string): boolean {
  const words = `${id} ${id.replace(/-/gu, " ")} ${aliases.filter(([key]) => id.split("-").includes(key)).map(([, words]) => words).join(" ")}`.toLowerCase();
  return query.trim().toLowerCase().split(/\s+/u).every(word => words.includes(word));
}
export class IconDialog extends Modal {
  constructor(app: App, private owner: IconHost, private targetScope: IconRule["scope"], private key: string,
    private choice: IconChoice, private folder: boolean, private valid: () => boolean,
    private save: (choice: IconChoice) => Promise<boolean>, private releasePicker: () => void) { super(app); }
  onOpen(): void {
    const zh = this.owner.zh;
    this.setTitle(message("changeIcon", zh));
    this.contentEl.addClass("keyline-next-icon-dialog");
    this.contentEl.createEl("p", { text: this.targetScope === "type" ? kindLabels[this.key as IconKind][zh ? 1 : 0] : this.key, cls: "keyline-next-icon-path" });
    const preview = this.contentEl.createDiv({ cls: "keyline-next-icon-preview" });
    const sample = preview.createSpan({ attr: { "aria-hidden": "true" } }), summary = preview.createSpan();
    let query = "", draft = { ...this.choice };
    const icons = availableGlyphs();
    new Setting(this.contentEl).setName(message("iconSearch", zh)).addSearch(search => {
      search.setPlaceholder(message("iconSearchHint", zh));
      search.inputEl.setAttribute("aria-label", message("iconSearch", zh));
      search.onChange(value => { query = value; render(); });
    });
    const count = this.contentEl.createEl("p", { cls: "setting-item-description", attr: { role: "status" } });
    const grid = this.contentEl.createDiv({ cls: "keyline-next-icon-grid" });
    let colors: DropdownComponent, custom: TextComponent;
    new Setting(this.contentEl).setName(message("iconColor", zh)).addDropdown(dropdown => {
      colors = dropdown;
      dropdown.addOption("", message("auto", zh));
      for (const tint of iconTints) dropdown.addOption(tint, message(tint === "cyan" ? "toneCyan" : `tone${tint[0].toUpperCase()}${tint.slice(1)}` as "toneBlue", zh));
      if (draft.tint === "yellow") dropdown.addOption("yellow", message("toneYellow", zh));
      if (draft.tint?.startsWith("#")) dropdown.addOption(draft.tint, draft.tint);
      dropdown.setValue(draft.tint ?? "").onChange(value => {
        draft = { ...draft, tint: value || undefined }; custom.setValue(value.startsWith("#") ? value : "");
        custom.inputEl.setAttribute("aria-invalid", "false"); status.setText(""); updatePreview();
      });
    }).addText(input => {
      custom = input;
      input.setPlaceholder("#336699").setValue(draft.tint?.startsWith("#") ? draft.tint : "");
      input.inputEl.setAttribute("aria-label", message("customIconColor", zh));
      input.onChange(value => {
        const valid = value === "" || /^#[\da-f]{6}$/iu.test(value);
        input.inputEl.setAttribute("aria-invalid", String(!valid));
        if (valid) {
          draft = { ...draft, tint: value.toLowerCase() || undefined };
          if (draft.tint) colors.addOption(draft.tint, draft.tint);
          colors.setValue(draft.tint ?? ""); status.setText(""); updatePreview();
        }
      });
    });
    const status = this.contentEl.createEl("p", { attr: { role: "status" } });
    new Setting(this.contentEl).addButton(button => button.setButtonText(message("iconAutomatic", zh)).onClick(() => {
      draft = {}; colors.setValue(""); custom.setValue(""); custom.inputEl.setAttribute("aria-invalid", "false"); status.setText(""); render(); updatePreview();
    })).addButton(button => button.setButtonText(message("cancel", zh)).onClick(() => this.close()))
      .addButton(button => button.setButtonText(message("save", zh)).setCta().onClick(async () => {
        if (!this.valid()) { status.setText(message("iconChanged", zh)); return; }
        if (this.contentEl.querySelector('[aria-invalid="true"]')) { status.setText(message("invalidIconColor", zh)); return; }
        button.setDisabled(true);
        try {
          if (await this.save(cleanIconChoice(draft))) this.close();
          else status.setText(message("iconChanged", zh));
        } catch { status.setText(message("failed", zh)); }
        finally { button.setDisabled(false); }
      }));
    const updatePreview = () => {
      const base = this.targetScope === "type" ? kindIdentity(this.key as IconKind) :
        resolveIdentity(this.key, this.owner.preferences.iconRules.filter(r => r.scope !== "path" || r.key !== this.key), false, this.folder);
      const glyph = draft.glyph ?? base.icon;
      paintIdentityGlyph(sample, icons.includes(glyph) ? glyph : base.icon); sample.style.color = iconTintCss(draft.tint ?? base.color);
      summary.setText(`${draft.glyph ?? message("auto", zh)} · ${draft.tint ?? message("auto", zh)}`);
    };
    const render = () => {
      grid.empty();
      const matches = icons.filter(id => matchGlyph(id, query)), visible = matches.slice(0, 120);
      count.setText(`${visible.length} / ${matches.length} · ${message("iconNarrowSearch", zh)}`);
      for (const id of visible) {
        const button = grid.createEl("button", { attr: { "aria-label": id, "aria-pressed": String(draft.glyph === id), title: id } });
        button.type = "button"; button.dataset.glyph = id; paintIdentityGlyph(button, id);
        button.addEventListener("click", () => {
          draft = { ...draft, glyph: id };
          grid.querySelectorAll("button").forEach(e => e.setAttribute("aria-pressed", String(e === button))); updatePreview();
        });
      }
    };
    render(); updatePreview();
    this.contentEl.addEventListener("keydown", event => {
      const button = event.target as HTMLElement;
      if (button.tagName === "BUTTON" && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault(); event.stopPropagation(); if (!event.repeat) button.click();
      }
    });
  }
  onClose(): void { this.releasePicker(); }
}
