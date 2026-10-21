import { Modal, Setting, type ButtonComponent } from "obsidian";
import type KeylineNext from "../main";
import { importLimit, legacyVersion } from "../domain/legacy-import";
import { TransferFailure, type TransferPreview } from "./settings-transfer";
import { message } from "../strings";

/** Reads only explicitly selected file copies. No legacy-vault discovery or
 * implicit import happens when this modal or the plugin opens. */
export class SettingsTransferModal extends Modal {
  private generation = {manifest:0,data:0};
  private closed = true;
  private source: Partial<Record<"manifest"|"data",string>> = {};
  private preview?: TransferPreview;
  private status!: HTMLElement;
  private details!: HTMLElement;
  private applyButton!: HTMLButtonElement;
  private applyControl!: ButtonComponent;
  constructor(private owner: KeylineNext, private done: () => void) { super(owner.app); }
  onOpen(): void {
    this.closed = false; const zh = this.owner.zh, root = this.contentEl;
    this.setTitle(message("settingsTransfer",zh)); root.addClass("keyline-next-transfer");
    root.createEl("p",{text: zh ? `选择整合版 Keyline ${legacyVersion} 的 manifest.json 与 data.json 副本。只读取选中的文件，不启停旧插件、不修改笔记、主题或系统菜单。请勿同时启用新旧插件。`
      : `Choose manifest.json and data.json copies from integrated Keyline ${legacyVersion}. Only selected files are read. The old plugin, notes, theme and system menus are not changed. Do not enable both companions together.`});
    for (const kind of ["manifest","data"] as const) {
      const setting = new Setting(root).setName(kind === "manifest" ? (zh ? "旧版版本文件" : "Legacy manifest") : (zh ? "旧版设置文件" : "Legacy settings"));
      const input = setting.controlEl.createEl("input",{attr:{type:"file",accept:".json,application/json","aria-label":`${kind}.json`}});
      input.dataset.transferSource = kind;
      input.addEventListener("change",() => { void this.readFile(kind,input); });
    }
    new Setting(root).setName(zh ? "先查看导入预览" : "Review before importing").addButton(button => button.setButtonText(zh?"预览导入":"Review import")
      .onClick(()=>this.work(async()=>{if(!this.source.manifest || !this.source.data)throw Error(zh?"请先选择两个文件":"Choose both files first");
        this.show(await this.owner.transfer!.previewImport(this.source.manifest,this.source.data));})));
    const restore = new Setting(root).setName(zh?"从备份回退":"Restore a backup");
    let selected = "";
    restore.addDropdown(dropdown => {
      dropdown.selectEl.dataset.transferBackup = "true"; dropdown.addOption("",zh?"选择备份":"Choose backup").onChange(value=>{selected=value;this.invalidate();});
      void this.owner.transfer!.backups().then(names=>{ if(!this.closed)for(const name of names)dropdown.addOption(name,name); },error=>{if(!this.closed)this.status.textContent=String(error);});
    }).addButton(button=>button.setButtonText(zh?"预览回退":"Review restore").onClick(()=>this.work(async()=>{if(!selected)throw Error(zh?"请选择备份":"Choose a backup");this.show(await this.owner.transfer!.previewRestore(selected));})));
    this.details = root.createDiv({cls:"keyline-next-transfer-preview"});
    this.status = root.createEl("p",{attr:{role:"status","aria-live":"polite"}});
    new Setting(root).addButton(button=>{
      this.applyControl = button; this.applyButton = button.buttonEl; button.buttonEl.dataset.transferApply = "true";
      button.setButtonText(zh?"备份并应用":"Back up and apply").setCta().setDisabled(true).onClick(()=>this.work(async()=>{
        if(!this.preview)throw Error("Review settings first");const preview=this.preview;this.invalidate();
        const backup=await this.owner.transfer!.apply(preview);
        if(!this.closed) {this.status.textContent=(zh?"已验证保存。备份：settings-backups/":"Saved and verified. Backup: settings-backups/")+backup;this.details.empty();this.details.createEl("p",{text:zh?"关闭后可重新打开此窗口，预览并回退本次更改。":"Close and reopen this window to review and restore this change."});}
      }));
    }).addButton(button=>button.setButtonText(message("close",zh)).onClick(()=>this.close()));
  }
  private invalidate(): void { this.preview=undefined; this.applyControl?.setDisabled(true); this.details?.empty(); }
  private async readFile(kind:"manifest"|"data",input:HTMLInputElement): Promise<void> {
    const generation=++this.generation[kind];this.invalidate();delete this.source[kind];
    const file=input.files?.[0];if(!file)return;
    try {
      if(file.size>(kind==="manifest"?16000:importLimit))throw Error("File too large");
      const value=await file.text();if(this.closed||generation!==this.generation[kind])return;
      this.source[kind]=value;this.status.textContent="";
    } catch(error) {if(!this.closed)this.status.textContent=String(error);}
  }
  private show(preview:TransferPreview): void {
    if(this.closed)return;this.preview=preview;this.details.empty();const zh=this.owner.zh;
    this.details.createEl("h3",{text:preview.kind==="import"?(zh?"导入预览":"Import preview"):(zh?"回退预览":"Restore preview")});
    this.details.createEl("p",{text:preview.kind==="import"?(zh?`将更改 ${preview.changes.length} 项设置；语言和新版独有选项保留。`:`${preview.changes.length} preference fields will change; language and rewrite-only options are retained.`)
      :(zh?"将恢复所选操作前的设置；你之后的设置更改会先另存备份。":"Restore settings from before the selected operation. Later settings will be backed up first.")});
    if(preview.kind==="import")this.details.createEl("pre",{text:preview.changes.join("\n")});
    const expanded=this.details.createEl("details");expanded.createEl("summary",{text:zh?"转换后的设置（JSON）":"Resulting settings (JSON)"});
    const result=preview.result??(zh?"无原设置文件：回退将删除本次创建的 data.json，恢复默认设置。":"No prior settings file: restore removes the new data.json and returns to defaults.");
    expanded.createEl("pre",{text:result.length<=20000?result:result.slice(0,20000)+(zh?"\n…预览截断，完整内容会保存在备份中。":"\n…Preview truncated; the backup retains the complete content.")});
    for(const notice of preview.notices){
      const labels:Record<string,[string,string]>={"marginalia-excluded":["Marginalia preference is excluded; the separate plugin is untouched.","不导入 Marginalia 设置；独立插件不受影响。"],
        "commands-not-executed":["Custom command bindings are imported but never executed by this operation.","只导入自定义命令绑定，不执行命令。"],
        "notes-and-host-preferences-untouched":["Notes, original files and host preferences remain unchanged.","笔记、源文件和宿主偏好不改动。"]};
      if(labels[notice])this.details.createEl("p",{text:labels[notice][zh?1:0]});
    }
    this.status.textContent=zh?"确认预览后，点击“备份并应用”。":"After reviewing, choose Back up and apply.";
    this.applyControl.setDisabled(false);
  }
  private async work(action:()=>Promise<void>): Promise<void> {
    if(this.owner.transfer?.busy)return;
    const controls=Array.from(this.contentEl.querySelectorAll<HTMLInputElement|HTMLButtonElement|HTMLSelectElement>("input,button,select"));
    const previous=controls.map(c=>c.disabled);controls.forEach(c=>c.disabled=true);
    try {await action();} catch(error) {
      this.invalidate();if(!this.closed)this.status.textContent=(this.owner.zh?"未完成：":"Not completed: ")+String(error)+
        (error instanceof TransferFailure && error.backup ? `\nsettings-backups/${error.backup}`:"");
    } finally {if(!this.closed){controls.forEach((c,i)=>c.disabled=previous[i]);this.applyControl.setDisabled(!this.preview||this.owner.readOnly);}}
  }
  onClose(): void {if(this.closed)return;this.closed=true;this.generation.manifest++;this.generation.data++;this.source={};this.preview=undefined;this.done();}
}
