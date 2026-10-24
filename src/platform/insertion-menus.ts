import { Prec } from "@codemirror/state";
import { EditorView, ViewPlugin, keymap, type ViewUpdate } from "@codemirror/view";
import { editorInfoField, setIcon } from "obsidian";
import { insertionEntries, slashTriggers, type InsertEntry } from "../domain/insertion";
import type { InsertionController, InsertContext } from "./insertion";
import { bindMobileMenuTouch, mobileDocument, positionMobileMenu, watchMobileViewport } from "./mobile-menu";

const callouts = [
  ["note","Note","便签","pencil"], ["info","Info","信息","info"], ["todo","Todo","待办","check-circle"],
  ["tip","Tip","提示","flame"], ["success","Success","成功","check"], ["question","Question","问题","help-circle"],
  ["warning","Warning","警告","alert-triangle"], ["failure","Failure","失败","x-circle"], ["danger","Danger","危险","zap"],
  ["bug","Bug","缺陷","bug"], ["example","Example","示例","list"], ["quote","Quote","引用","quote"]
] as const;
const extras = new Set(["text","h6","bullet","number","quote"]);
const links = new Set(["newpage","wiki","link","image","attachment"]);
const datesAndInline = new Set(["today","yesterday","tomorrow","time","footnote","comment"]);
let menuSerial = 0;

/** Both slash typing and explicit + insertion use the same anchored surface.
 * The controller only presents choices; existing validated planners own edits. */
export class InsertionMenus {
  private views = new Map<EditorView, InsertMenu>();
  constructor(readonly owner: InsertionController) { owner.presenter = this; }
  extension() {
    const controller = this;
    return [ViewPlugin.define(view => {
      const menu = new InsertMenu(view, controller); controller.views.set(view, menu); return menu;
    }), Prec.highest(keymap.of(["ArrowDown","ArrowUp","ArrowRight","ArrowLeft","Enter","Tab","Escape"].map(key => ({
      key, run: (view: EditorView) => controller.views.get(view)?.key(key) ?? false
    }))))];
  }
  open(context: InsertContext, point?: {x:number;y:number}): void {
    this.close();
    for (const [view,menu] of this.views) if (view.state.field(editorInfoField,false)?.editor === context.editor) {
      menu.open(context,point); return;
    }
  }
  claim(active: InsertMenu): void { for(const menu of this.views.values()) if(menu!==active)menu.close(); }
  close(): void { for(const menu of this.views.values())menu.close(); }
  remove(view: EditorView): void { this.views.delete(view); }
  dispose(): void { for(const menu of [...this.views.values()])menu.destroy(); if(this.owner.presenter===this)this.owner.presenter=undefined; }
}

class InsertMenu {
  private root?: HTMLDivElement;
  private submenu?: HTMLDivElement;
  private entries: InsertEntry[] = [];
  private active = 0;
  private subActive = -1;
  private context?: InsertContext;
  private anchor = -1;
  private point?: {x:number;y:number};
  private typed = false;
  private pending?: number;
  private generation = 0;
  private disposed = false;
  private ariaValues = new Map<string,{before:string|null;value:string}>();
  private outside: (event: Event) => void;
  private viewport: (event: Event) => void;
  private composing = false;
  private composition = () => {
    if (!mobileDocument(this.boundDocument)) { this.close(); return; }
    this.composing = true; this.context = undefined; this.active = -1;
    this.closeSubmenu(); this.root?.remove(); this.root = undefined;
    for (const name of [...this.ariaValues.keys()]) this.restoreAria(name);
  };
  private composed = () => {
    this.composing = false;
    if (mobileDocument(this.boundDocument) && this.anchor >= 0) this.schedule();
  };
  private boundDocument: Document;
  private stopViewport?: () => void;
  constructor(private view: EditorView, private controller: InsertionMenus) {
    const doc=view.dom.ownerDocument;
    this.boundDocument=doc;
    this.outside=event=>{if(!this.contains(event.target as Node))this.close();};
    this.viewport=event=>{
      if(mobileDocument(this.boundDocument)) {
        if(event.type==='resize'||!this.contains(event.target as Node))this.position();
        return;
      }
      if(event.type==='resize'||!this.contains(event.target as Node))this.close();
    };
    this.bindDocument(doc);
    view.contentDOM.addEventListener('compositionstart',this.composition);
    view.contentDOM.addEventListener('compositionend',this.composed);
  }
  private bindDocument(doc: Document): void {
    this.stopViewport=watchMobileViewport(doc,()=>this.position());
    doc.addEventListener('pointerdown',this.outside,true);doc.addEventListener('focusin',this.outside,true);
    doc.addEventListener('scroll',this.viewport,true);doc.defaultView?.addEventListener('resize',this.viewport);
  }
  private unbindDocument(doc: Document): void {
    this.stopViewport?.();this.stopViewport=undefined;
    doc.removeEventListener('pointerdown',this.outside,true);doc.removeEventListener('focusin',this.outside,true);doc.removeEventListener('scroll',this.viewport,true);
    doc.defaultView?.removeEventListener('resize',this.viewport);
  }
  private syncDocument(): void {
    const doc=this.view.dom.ownerDocument;
    if(doc===this.boundDocument)return;
    this.close();this.unbindDocument(this.boundDocument);this.boundDocument=doc;this.bindDocument(doc);
  }
  private get owner() { return this.controller.owner; }
  private contains(node: Node): boolean { return !!this.root?.contains(node)||!!this.submenu?.contains(node); }
  private eligible(previewComposition = false): boolean {
    const state=this.view.state,info=state.field(editorInfoField,false);
    return !this.disposed && this.owner.live && !state.readOnly && (previewComposition || (!this.view.composing && !this.composing)) && this.view.hasFocus &&
      this.view.dom.ownerDocument.activeElement===this.view.contentDOM && state.doc.length<=2*1024*1024 &&
      state.selection.ranges.length===1 && !!info?.file && !!info.editor;
  }
  open(context: InsertContext, point?: {x:number;y:number}): void {
    this.syncDocument();
    context.editor.focus();
    if(!context.valid()||!this.eligible())return;
    this.typed=false;this.context=context;this.point=point;this.entries=this.choices('');this.render();this.position();
  }
  update(update: ViewUpdate): void {
    if(this.disposed)return;
    this.syncDocument();
    if(update.focusChanged&&!this.view.hasFocus){this.close();return;}
    if(!update.docChanged&&!update.selectionSet)return;
    const mobile=mobileDocument(this.boundDocument);
    const input=update.transactions.some(t=>t.isUserEvent('input.type')&&(mobile||!t.isUserEvent('input.type.compose')));
    const deletion=update.transactions.some(t=>t.isUserEvent('delete'));
    if(this.root||this.anchor>=0){
      if(this.typed&&update.docChanged&&(input||deletion)){
        this.active=-1;this.context=undefined;this.schedule();
      }else if(!mobile||(!this.composing&&!this.view.composing)||update.docChanged)this.close();
      return;
    }
    if(!input||!this.eligible(mobile))return;
    const triggers=slashTriggers(this.owner.preferences());
    let trigger='';
    update.changes.iterChanges((_a,_b,_c,end,text)=>{if(triggers.includes(text.toString())&&end===update.state.selection.main.head)trigger=text.toString();});
    if(!trigger)return;
    const info=this.view.state.field(editorInfoField,false)!;
    if(!info.editor||!info.file)return;
    // Mobile IMEs may commit the trigger inside composition; validation and
    // display are deferred until the IME has finished. No edit occurs here.
    if(!mobile&&!this.owner.suggest.onTrigger(info.editor.getCursor(),info.editor,info.file))return;
    this.anchor=update.state.selection.main.head-trigger.length;this.typed=true;
    this.controller.claim(this);this.schedule();
  }
  private schedule(attempt = 0): void {
    const win=this.view.dom.ownerDocument.defaultView;if(!win)return;
    if(this.pending!==undefined)win.clearTimeout(this.pending);
    const generation=this.generation;
    this.pending=win.setTimeout(()=>{
      if(generation!==this.generation)return;
      this.pending=undefined;
      if(mobileDocument(this.boundDocument)&&(this.composing||this.view.composing)){
        if(!this.composing&&attempt<10)this.schedule(attempt+1);
        return;
      }
      if(!this.eligible()){this.close();return;}
      const info=this.view.state.field(editorInfoField,false)!;
      if(!info.editor||!info.file){this.close();return;}
      const hit=this.owner.suggest.onTrigger(info.editor.getCursor(),info.editor,info.file);
      if(!hit||info.editor.posToOffset(hit.start)!==this.anchor){this.close();return;}
      this.context=this.owner.capture(info.editor,info.file,{from:this.anchor,to:info.editor.posToOffset(hit.end)})??undefined;
      if(!this.context){this.close();return;}
      this.entries=this.choices(hit.query);this.active=0;this.render();this.position();
    },attempt?20:0);
  }
  private choices(query: string): InsertEntry[] {
    const entries=insertionEntries(this.owner.preferences(),this.owner.zh(),query);
    const label=this.owner.zh()?"关闭菜单":"Close menu";
    if(this.typed&&(!query||`close menu 关闭菜单`.includes(query.toLowerCase())))entries.push({id:'close',label,search:'',icon:'x',mode:'action'});
    return entries;
  }
  private panel(sub=false): HTMLDivElement {
    const p=this.view.dom.ownerDocument.createElement('div');p.className=`keyline-next-insert-menu${sub?' is-callout':''}`;
    p.id=`keyline-next-insert-${++menuSerial}`;
    p.setAttribute('role','listbox');p.setAttribute('aria-label',sub?'Callout':this.owner.zh()?'插入':'Insert');
    p.addEventListener('mousedown',e=>e.preventDefault());bindMobileMenuTouch(p);this.view.dom.ownerDocument.body.append(p);return p;
  }
  private render(): void {
    this.closeSubmenu();if(!this.root)this.root=this.panel();this.root.replaceChildren();
    const list=this.root.createDiv({cls:'keyline-next-insert-list'});let group='',band='';
    for(const [index,entry] of this.entries.entries()){
      const next=entry.id==='close'?'':entry.mode==='command'?'Custom':extras.has(entry.id)?'More':/^h[1-5]$/u.test(entry.id)?'Headings':'Insert';
      const nextBand=links.has(entry.id)?'links':datesAndInline.has(entry.id)?'dates':'blocks';
      if(next==='Insert'&&group===next&&band!==nextBand)list.createDiv({cls:'keyline-next-insert-separator'});
      if(next&&next!==group){if(group)list.createDiv({cls:'keyline-next-insert-separator'});const labels:{[key:string]:string}={Headings:'标题',Insert:'新增',More:'更多',Custom:'自定义'};list.createDiv({cls:'keyline-next-insert-heading',text:this.owner.zh()?labels[next]:next}).setAttribute('aria-hidden','true');group=next;}
      band=nextBand;
      if(entry.id==='close')list.createDiv({cls:'keyline-next-insert-separator'});
      const row=this.row(list,entry.label,entry.icon,entry.id==='callout');row.dataset.insertId=entry.id;
      row.addEventListener('pointermove',event=>{if(event.pointerType==='touch')return;this.setActive(index);if(entry.id==='callout')this.showCallouts(false);else this.closeSubmenu();});
      row.addEventListener('click',()=>{this.setActive(index);if(entry.id==='callout')this.showCallouts(false);else this.activate();});
    }
    if(!this.entries.length)list.createDiv({cls:'keyline-next-insert-empty',text:this.owner.zh()?'没有匹配项':'No results'});
    this.aria('aria-expanded','true');this.aria('aria-autocomplete','list');
    this.setActive(Math.min(this.active,this.entries.length-1),false);
  }
  private row(parent: HTMLElement,label: string,icon: string,branch=false): HTMLDivElement {
    const row=parent.createDiv({cls:'keyline-next-insert-suggestion'});row.setAttribute('role','option');row.setAttribute('aria-selected','false');
    row.id=`keyline-next-insert-option-${++menuSerial}`;
    const glyph=row.createSpan({cls:'keyline-next-insert-icon'});glyph.setAttribute('aria-hidden','true');setIcon(glyph,icon);
    row.createSpan({cls:'keyline-next-insert-label',text:label});
    if(branch){const chevron=row.createSpan({cls:'keyline-next-insert-chevron'});setIcon(chevron,'chevron-right');}
    return row;
  }
  private rows(sub=false): HTMLElement[] { return Array.from((sub?this.submenu:this.root)?.querySelectorAll<HTMLElement>('[role=option]')??[]); }
  private setActive(index: number,scroll=true): void {
    this.active=index;
    this.rows().forEach((row,i)=>{row.classList.toggle('is-active',i===index);row.setAttribute('aria-selected',String(i===index));if(i===index&&scroll)row.scrollIntoView({block:'nearest'});});
    this.syncAria();
  }
  private showCallouts(keyboard: boolean): void {
    if(!this.submenu){
      this.submenu=this.panel(true);const list=this.submenu.createDiv({cls:'keyline-next-insert-list'});
      if(mobileDocument(this.boundDocument)) {
        const back=this.row(list,this.owner.zh()?'返回':'Back','arrow-left');
        back.removeAttribute('role');back.setAttribute('role','button');back.tabIndex=0;
        back.addEventListener('click',()=>this.closeSubmenu());
        back.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();this.closeSubmenu();}});
      }
      list.createDiv({cls:'keyline-next-insert-heading',text:'Callout'});
      callouts.forEach(([id,en,zh,icon],i)=>{const row=this.row(list,this.owner.zh()?zh:en,icon);row.dataset.insertId=`callout-${id}`;
        row.addEventListener('pointermove',event=>{if(event.pointerType!=='touch')this.setSubActive(i);});row.addEventListener('click',()=>this.commitCallout(i));});
      const base=this.root!.getBoundingClientRect(),win=this.view.dom.ownerDocument.defaultView!;
      this.submenu.style.left=`${Math.max(8,base.right+6+164>win.innerWidth-8?base.left-170:base.right+6)}px`;
      this.submenu.style.top=`${Math.max(8,Math.min(base.top,win.innerHeight-this.submenu.offsetHeight-8))}px`;
      if(mobileDocument(this.boundDocument)) positionMobileMenu(this.submenu,{x:base.left,y:base.top});
    }
    if(keyboard)this.setSubActive(0);
  }
  private setSubActive(index: number): void {this.subActive=index;this.rows(true).forEach((r,i)=>{r.classList.toggle('is-active',i===index);r.setAttribute('aria-selected',String(i===index));if(i===index)r.scrollIntoView({block:'nearest'});});this.syncAria();}
  private closeSubmenu(): void {this.submenu?.remove();this.submenu=undefined;this.subActive=-1;this.syncAria();}
  private aria(name: string,value: string): void {
    const el=this.view.contentDOM,previous=this.ariaValues.get(name);
    this.ariaValues.set(name,{before:previous?previous.before:el.getAttribute(name),value});el.setAttribute(name,value);
  }
  private restoreAria(name: string): void {
    const item=this.ariaValues.get(name),el=this.view.contentDOM;
    if(item&&el.getAttribute(name)===item.value){if(item.before===null)el.removeAttribute(name);else el.setAttribute(name,item.before);}
    this.ariaValues.delete(name);
  }
  private syncAria(): void {
    const sub=this.subActive>=0,panel=sub?this.submenu:this.root,row=this.rows(sub)[sub?this.subActive:this.active];
    if(panel)this.aria('aria-controls',panel.id);
    if(row)this.aria('aria-activedescendant',row.id);else this.restoreAria('aria-activedescendant');
  }
  private position(): void {
    if(!this.root||!this.context)return;
    const coords=this.view.coordsAtPos(this.typed?this.anchor:this.context.from),win=this.view.dom.ownerDocument.defaultView!;
    if(!coords&&!this.point){this.close();return;}
    const point=this.point??{x:coords!.left,y:coords!.bottom+6};
    if(mobileDocument(this.boundDocument)) {
      positionMobileMenu(this.root,point);
      if(this.submenu){const base=this.root.getBoundingClientRect();positionMobileMenu(this.submenu,{x:base.left,y:base.top});}
      return;
    }
    this.root.style.left=`${Math.max(8,Math.min(point.x,win.innerWidth-this.root.offsetWidth-8))}px`;
    this.root.style.top=`${Math.max(8,Math.min(point.y,win.innerHeight-this.root.offsetHeight-8))}px`;
  }
  key(key: string): boolean {
    this.syncDocument();
    if(!this.root)return false;
    if(!this.context?.valid()||!this.eligible()){this.close();return false;}
    if(key==='Escape'){if(this.subActive>=0)this.closeSubmenu();else this.close();return true;}
    if(key==='ArrowLeft'){if(this.submenu){this.closeSubmenu();return true;}this.close();return false;}
    if(key==='ArrowRight'){if(this.entries[this.active]?.id==='callout'){this.showCallouts(true);return true;}this.close();return false;}
    if(key==='ArrowDown'||key==='ArrowUp'){
      const count=this.subActive>=0?callouts.length:this.entries.length;if(!count)return true;
      const at=this.subActive>=0?this.subActive:this.active,next=(at+(key==='ArrowDown'?1:count-1))%count;
      if(this.subActive>=0)this.setSubActive(next);else{this.closeSubmenu();this.setActive(next);}return true;
    }
    if(key==='Enter'||key==='Tab'){if(this.subActive>=0)this.commitCallout(this.subActive);else this.activate();return true;}
    return false;
  }
  private activate(): void {
    const entry=this.entries[this.active];if(!entry)return;
    if(entry.id==='callout'){this.showCallouts(true);return;}
    this.commit(entry);
  }
  private commitCallout(index: number): void {
    const item=callouts[index];if(item)this.commit({id:`callout-${item[0]}`,label:item[1],search:'',icon:item[3],mode:'block'});
  }
  private commit(entry: InsertEntry): void {
    const context=this.context,valid=context?.valid()&&this.eligible();this.close();
    if(valid&&context&&entry.id!=='close')void this.owner.choose(context,entry);
  }
  close(): void {
    this.generation++;if(this.pending!==undefined)this.boundDocument.defaultView?.clearTimeout(this.pending);
    this.pending=undefined;this.context=undefined;this.anchor=-1;this.point=undefined;this.typed=false;this.active=0;
    this.root?.remove();this.root=undefined;this.closeSubmenu();
    for(const name of [...this.ariaValues.keys()])this.restoreAria(name);
  }
  destroy(): void {
    if(this.disposed)return;this.disposed=true;this.close();this.unbindDocument(this.boundDocument);
    this.view.contentDOM.removeEventListener('compositionstart',this.composition);this.controller.remove(this.view);
    this.view.contentDOM.removeEventListener('compositionend',this.composed);
  }
}
