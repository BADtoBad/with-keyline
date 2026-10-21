import { Modal, Setting, SuggestModal, type App } from "obsidian";
import type KeylineNext from "../main";
import { customInsertId, insertionEntries } from "../domain/insertion";
import { hostCommands } from "./insertion";
import { message } from "../strings";

export class InsertSettingsModal extends Modal {
  private picker?: CommandPicker;
  constructor(app: App, private owner: KeylineNext) { super(app); }
  onOpen(): void { this.render(); }
  render(): void {
    this.setTitle(message("insertMenu", this.owner.zh));
    this.contentEl.empty(); this.contentEl.addClass("keyline-next-insert-settings");
    new Setting(this.contentEl).setName(message("customCommand", this.owner.zh)).addButton(b => b.setButtonText(message("add", this.owner.zh))
      .setDisabled(this.owner.readOnly).onClick(() => {
        this.picker = new CommandPicker(this.app, this.owner.manifest.id, async item => {
          const customInsert = this.owner.preferences.customInsert.filter(c => customInsertId(c) !== `command:${item.id}`);
          customInsert.push({ command: item.id, label: item.name });
          await this.owner.update({ customInsert }); this.render();
        }); this.picker.open();
      }));
    const entries = insertionEntries(this.owner.preferences, this.owner.zh, "", true);
    entries.forEach((entry, index) => {
      const row = new Setting(this.contentEl).setName(entry.label);
      row.settingEl.setAttribute("data-insert-id", entry.id);
      if (entry.command) row.setDesc(entry.command);
      const move = async (direction: -1 | 1) => {
        const ids = entries.map(e => e.id), next = index + direction;
        [ids[index], ids[next]] = [ids[next], ids[index]];
        await this.owner.update({ insertOrder: ids }); this.render();
        const moved = this.contentEl.querySelectorAll<HTMLElement>(".setting-item")[next + 1];
        moved?.scrollIntoView({ block: "nearest" });
        const buttons = moved?.querySelectorAll<HTMLElement>(".clickable-icon");
        const button = buttons?.[direction < 0 ? 0 : 1];
        if (button?.getAttribute("aria-disabled") !== "true") button?.focus();
        else moved?.querySelector<HTMLElement>(".checkbox-container")?.focus();
      };
      row.addExtraButton(b => b.setIcon("arrow-up").setTooltip(message("up", this.owner.zh)).setDisabled(index === 0 || this.owner.readOnly).onClick(() => move(-1)));
      row.addExtraButton(b => b.setIcon("arrow-down").setTooltip(message("down", this.owner.zh)).setDisabled(index === entries.length - 1 || this.owner.readOnly).onClick(() => move(1)));
      row.addToggle(toggle => {
        toggle.toggleEl.setAttribute("aria-label", `${message("visible", this.owner.zh)}: ${entry.label}`);
        toggle.setValue(!this.owner.preferences.hiddenInsert.includes(entry.id)).setDisabled(this.owner.readOnly).onChange(async enabled => {
          const hiddenInsert = this.owner.preferences.hiddenInsert.filter(id => id !== entry.id);
          if (!enabled) hiddenInsert.push(entry.id);
          await this.owner.update({ hiddenInsert });
        });
      });
      if (entry.command) row.addExtraButton(b => b.setIcon("x").setTooltip(message("remove", this.owner.zh)).setDisabled(this.owner.readOnly)
        .onClick(async () => { await this.owner.update({ customInsert: this.owner.preferences.customInsert.filter(c => customInsertId(c) !== entry.id) }); this.render(); }));
    });
    new Setting(this.contentEl).setName(message("reset", this.owner.zh)).addButton(b => b.setButtonText(message("reset", this.owner.zh)).setDisabled(this.owner.readOnly)
      .onClick(async () => { await this.owner.update({ insertOrder: [], hiddenInsert: [] }); this.render(); }));
  }
  onClose(): void { this.picker?.close(); }
}
class CommandPicker extends SuggestModal<{ id: string; name: string }> {
  constructor(app: App, private pluginId: string, private choose: (value: { id: string; name: string }) => Promise<void>) { super(app); }
  getSuggestions(query: string): { id: string; name: string }[] {
    return (hostCommands(this.app)?.listCommands() ?? []).filter(c => !c.id.startsWith(`${this.pluginId}:insert`) &&
      `${c.name} ${c.id}`.toLowerCase().includes(query.toLowerCase())).slice(0, 100);
  }
  renderSuggestion(value: { id: string; name: string }, el: HTMLElement): void { el.createDiv({ text: value.name }); el.createDiv({ text: value.id, cls: "setting-item-description" }); }
  onChooseSuggestion(value: { id: string; name: string }): void { void this.choose(value); }
}
