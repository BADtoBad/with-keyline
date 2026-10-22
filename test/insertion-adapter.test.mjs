import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const moment = createRequire(require.resolve("obsidian/package.json"))("moment");
const { normalizeInsert, insertionEntries, makeSnippet, planInsertion } = require("../.test-build/domain/insertion.cjs");
const { parseBlocks, blockAt } = require("../.test-build/domain/blocks.cjs");
class Editor {
  constructor(text) { this.text = text; this.from = this.to = text.length; this.edits = []; this.multiple = false; }
  getValue() { return this.text; }
  getLine(n) { return this.text.split("\n")[n]; }
  getCursor(which) { return this.offsetToPos(which === "from" ? this.from : this.to); }
  somethingSelected() { return this.from !== this.to; }
  listSelections() { return this.multiple ? [{}, {}] : [{}]; }
  posToOffset(p) { return this.text.split("\n").slice(0, p.line).reduce((n, s) => n + s.length + 1, p.ch); }
  offsetToPos(offset) { const lines = this.text.slice(0, offset).split("\n"); return { line: lines.length - 1, ch: lines.at(-1).length }; }
  getRange(a, b) { return this.text.slice(this.posToOffset(a), this.posToOffset(b)); }
  setSelection(a, b) { this.from = this.posToOffset(a); this.to = this.posToOffset(b); }
  replaceRange(insert, a, b) {
    const from = this.posToOffset(a), to = this.posToOffset(b);
    this.edits.push(this.text); this.text = this.text.slice(0, from) + insert + this.text.slice(to);
  }
  transaction({ changes }) {
    this.edits.push(this.text);
    const edits = changes.map(c => ({ from: this.posToOffset(c.from), to: this.posToOffset(c.to ?? c.from), insert: c.text }));
    for (const c of edits.sort((a, b) => b.from - a.from)) this.text = this.text.slice(0, c.from) + c.insert + this.text.slice(c.to);
  }
  focus() {}
}
function setup(text = "/h6", patch = {}) {
  const notices = [], dialogs = [];
  class Modal {
    constructor(app) { this.app = app; }
    open() { dialogs.push(this); }
    close() { this.closed = true; this.onClose?.(); }
  }
  class SuggestModal extends Modal { setPlaceholder() {} onClose() { this.cleaned = true; } }
  class TFile { constructor(path) { this.path = path; this.basename = path.split("/").at(-1).replace(/\.[^.]+$/u, ""); this.extension = path.split(".").at(-1); } }
  class EditorSuggest { constructor(app) { this.app = app; } close() { this.closed = true; } }
  const host = { Modal, SuggestModal, EditorSuggest, TFile, moment, Notice: class { constructor(s) { notices.push(s); } } };
  const load = file => {
    const module = { exports: {} };
    vm.runInNewContext(readFileSync(new URL(`../.test-build/${file}.cjs`, import.meta.url), "utf8"), {
      module, exports: module.exports, require: name => { assert.equal(name, "obsidian"); return host; }, console
    });
    return module.exports;
  };
  const api = load("platform/insertion");
  const editor = new Editor(text), file = new TFile("Start.md"), page = new TFile("Work/Plan.md"), svg = new TFile("Assets/Color.svg");
  const folder = { path: "/" }; file.parent = folder;
  const state = { composing: false, removed: false, changedFile: false, files: [file, page, svg], executed: [], result: true, created: [], opened: [] };
  const leaf = { view: { editor, get file() { return state.changedFile ? page : file; } }, openFile: async f => { if(state.openError)throw state.openError; state.opened.push(f); } };
  const app = {
    vault: { getAbstractFileByPath: path => state.removed ? null : path===folder.path ? folder : state.files.find(f => f.path === path)??null, getFiles: () => state.files, getMarkdownFiles: () => state.files.filter(f => f.extension === "md"),
      create: async (path, contents) => {state.created.push({path,contents});await state.createHook?.();if(state.createError)throw state.createError;if(state.files.some(f=>f.path===path))throw Error('collision');const f=new TFile(path);f.parent=folder;state.files.push(f);return f;} },
    workspace: { getLeavesOfType: () => [leaf], activeLeaf: leaf },
    metadataCache: { fileToLinktext: f => f.path.replace(/\.md$/u, "") },
    fileManager: { generateMarkdownLink: f => `[[${f.path.replace(/\.md$/u, "")}]]` },
    commands: { listCommands: () => [{ id: "test:command", name: "Fixture" }], executeCommandById: id => {
      state.executed.push(id);
      if (state.result instanceof Error) throw state.result;
      if (typeof state.result === "function") return state.result();
      return state.result;
    } }
  };
  const prefs = normalizeInsert(patch), controller = new api.InsertionController(app, () => prefs, () => !!state.zh, () => state.composing);
  const hit = controller.suggest.onTrigger(editor.getCursor(), editor, file);
  if (hit) controller.suggest.context = { ...hit, file, editor };
  const context = () => controller.capture(editor, file, hit ? { from: editor.posToOffset(hit.start), to: editor.posToOffset(hit.end) } : undefined);
  const entry = id => insertionEntries(prefs, false).find(e => e.id === id);
  return { ...api, ...load("platform/dates"), controller, editor, state, file, page, svg, dialogs, notices, context, entry, prefs, app, folder, leaf };
}
test("slash cancellation and explicit existing-file picker cancellation preserve literal input", async () => {
  const s = setup("/image");
  s.controller.suggest.close(); assert.equal(s.editor.text, "/image"); assert.equal(s.editor.edits.length, 0);
  s.controller.pickFile(s.context(), "image");
  assert.equal(s.dialogs.length, 1); s.dialogs[0].close();
  assert.equal(s.editor.text, "/image"); assert.equal(s.editor.edits.length, 0); assert.equal(s.dialogs[0].cleaned, true);
});
for (const trigger of ["/", "、"]) test(`${trigger} suggestion selection replaces only the literal query in one undoable edit`, () => {
  const s = setup(`Before\n${trigger}h2`);
  assert.ok(s.controller.suggest.context);
  s.controller.suggest.selectSuggestion(s.entry('h2'));
  assert.equal(s.editor.text, 'Before\n## ');
  assert.deepEqual(s.editor.edits, [`Before\n${trigger}h2`]);
});
test("ideographic comma suggestion cancellation and stale query never write", () => {
  const cancelled = setup('、task');
  assert.ok(cancelled.controller.suggest.context);
  cancelled.controller.suggest.close();
  cancelled.controller.suggest.selectSuggestion(cancelled.entry('task'));
  assert.equal(cancelled.editor.text, '、task');assert.deepEqual(cancelled.editor.edits, []);
  const stale = setup('、task');
  stale.editor.text = '、code';
  stale.controller.suggest.selectSuggestion(stale.entry('task'));
  assert.equal(stale.editor.text, '、code');assert.deepEqual(stale.editor.edits, []);
});
test("plus opens without writing blanks, and commits after code in one edit", async () => {
  const s = setup("```\nCode\n```\n\nTail."), block = blockAt(parseBlocks(s.editor.text), 0);
  const context = s.controller.capture(s.editor, s.file, { from: block.to, to: block.to }, block.id);
  assert.ok(context?.valid());
  let presented;
  s.controller.presenter = { open: value => { presented = value; }, close() {} };
  s.controller.open(context);
  assert.equal(presented, context); assert.equal(s.dialogs.length, 0);
  assert.equal(s.editor.edits.length, 0);
  await s.controller.choose(context, s.entry("h6"));
  assert.equal(s.editor.text, "```\nCode\n```\n\n###### \n\nTail.");
  assert.equal(s.editor.edits.length, 1);
});
test("plus custom-command failure restores only an untouched blank insertion", async () => {
  for (const result of [false, new Error("Fixture")]) {
    const s = setup("Note.", { customInsert: [{ command: "test:command", label: "Fixture" }] });
    s.state.result = result;
    s.editor.from = s.editor.to = 2;
    const block = blockAt(parseBlocks(s.editor.text), 0);
    const context = s.controller.capture(s.editor, s.file, { from: block.to, to: block.to }, block.id);
    await s.controller.choose(context, s.entry("command:test:command"));
    assert.equal(s.editor.text, "Note.");
    assert.equal(s.editor.from, 2); assert.equal(s.editor.to, 2);
    assert.deepEqual(s.state.executed, ["test:command"]);
  }
});
test("explicit slash choice writes only its range and leaves a blank heading caret", () => {
  const s = setup("Before /h6");
  s.controller.suggest.selectSuggestion(s.entry("h6"));
  assert.equal(s.editor.text, "Before \n###### "); assert.equal(s.editor.edits.length, 1);
  assert.equal(s.editor.from, s.editor.text.length); assert.equal(s.editor.to, s.editor.from);
});
for (const change of ["text", "cursor", "file", "removed", "multiple", "composition", "disposed"]) test(`captured insertion fails closed after ${change}`, async () => {
  const s = setup(), context = s.context();
  if (change === "text") s.editor.text = "/h5";
  if (change === "cursor") s.editor.from = s.editor.to = 1;
  if (change === "file") s.state.changedFile = true;
  if (change === "removed") s.state.removed = true;
  if (change === "multiple") s.editor.multiple = true;
  if (change === "composition") s.state.composing = true;
  if (change === "disposed") s.controller.dispose();
  await s.controller.choose(context, s.entry("h6"));
  assert.equal(s.editor.edits.length, 0);
});
test("a selected range containing code never enters insertion", () => {
  const s = setup("Text\n\n```\nCode\n```"); s.editor.from = 0;
  assert.equal(s.controller.capture(s.editor, s.file), null);
});
test("footnote reference and definition use one transaction", async () => {
  const s = setup("Before /footnote after\n\n[^1]: Existing");
  s.editor.from = s.editor.to = 16;
  const context = s.controller.capture(s.editor, s.file, { from: 7, to: 16 });
  await s.controller.choose(context, s.entry("footnote"));
  assert.equal(s.editor.text, "Before [^2] after\n\n[^1]: Existing\n\n[^2]: ");
  assert.equal(s.editor.edits.length, 1); assert.equal(s.editor.from, 11);
});
test("wiki and attachment insertion use host paths and optional embed preference", async () => {
  const s = setup("/wiki");
  assert.equal(s.controller.link(s.context(), s.page, "wiki"), true);
  assert.equal(s.editor.text, "[[Work/Plan]]");
  for (const [kind, embed, prefix] of [["image", false, "!"], ["attachment", false, ""], ["attachment", true, "!"]]) {
    const a = setup("/attachment", { embedAttachments: embed });
    assert.equal(a.controller.link(a.context(), a.svg, kind), true);
    assert.equal(a.editor.text, `${prefix}[[Assets/Color.svg]]`);
  }
});
test("controller unload closes both suggestion and owned dialogs", async () => {
  const s = setup("/image"); s.controller.pickFile(s.context(), "image");
  s.controller.dispose();
  assert.ok(s.dialogs.every(d => d.closed)); assert.equal(s.controller.suggest.context, null);
});
test('slash image and attachment choices use the system import route, not an existing-vault modal',async()=>{
  for(const kind of ['image','attachment']){
    const s=setup('/'+kind),context=s.context(),calls=[];
    s.controller.attachments.open=(c,k)=>calls.push({c,k});
    await s.controller.choose(context,s.entry(kind));
    assert.equal(calls.length,1);assert.equal(calls[0].c,context);assert.equal(calls[0].k,kind);assert.equal(s.dialogs.length,0);assert.equal(s.editor.edits.length,0);
  }
});
test('attachment commit preserves the line suffix with a single native undo entry',()=>{
  const s=setup('Intro /image tail.\n\nAfter');s.editor.from=s.editor.to=12;
  const context=s.controller.capture(s.editor,s.file,{from:6,to:12});
  assert.equal(s.controller.commitAttachment(context,'![[A.svg]]'),true);
  assert.equal(s.editor.text,'Intro  tail.\n![[A.svg]]\n\nAfter');assert.equal(s.editor.edits.length,1);
  assert.equal(s.editor.edits[0],context.text);assert.equal(s.editor.from,s.editor.text.indexOf('\n\nAfter'));
});
test('manual attachment insertion preserves selected content and uses its directed caret',()=>{
  for(const reverse of [false,true]){
    const s=setup('First selected line.\nSecond selected line.\n\nAfter');s.editor.from=6;s.editor.to=27;
    const original=s.editor.getCursor.bind(s.editor);s.editor.getCursor=which=>original(which??(reverse?'from':'to'));
    const context=s.controller.capture(s.editor,s.file);
    assert.equal(s.controller.commitAttachment(context,'[A](A.pdf)'),true);assert.equal(s.editor.edits.length,1);
    assert.equal(s.editor.text,reverse?'First selected line.\n[A](A.pdf)\nSecond selected line.\n\nAfter':'First selected line.\nSecond selected line.\n[A](A.pdf)\n\nAfter');
  }
});
test('attachment after-block route retains the existing structural sibling planner',()=>{
  const s=setup('```\nCode\n```\n\nAfter'),block=blockAt(parseBlocks(s.editor.text),0);
  const context=s.controller.capture(s.editor,s.file,{from:block.to,to:block.to},block.id);
  assert.equal(s.controller.commitAttachment(context,'![[A.svg]]'),true);
  assert.equal(s.editor.text,'```\nCode\n```\n\n![[A.svg]]\n\nAfter');assert.equal(s.editor.edits.length,1);
});
test('stale attachment context cannot write to changed text or a moved caret',()=>{
  for(const change of ['text','cursor','unload']){
    const s=setup('/image'),context=s.context();
    if(change==='text')s.editor.text+=' changed';else if(change==='cursor')s.editor.from=s.editor.to=0;else s.controller.dispose();
    assert.equal(s.controller.commitAttachment(context,'![[A.svg]]'),false);assert.equal(s.editor.edits.length,0);
  }
});
test('reversing a captured manual selection invalidates its delayed import even with unchanged bounds',()=>{
  const s=setup('First line.\nSecond line.');s.editor.from=2;s.editor.to=16;
  const context=s.controller.capture(s.editor,s.file),original=s.editor.getCursor.bind(s.editor);
  s.editor.getCursor=which=>original(which??'from');
  assert.equal(context.valid(),false);assert.equal(s.controller.commitAttachment(context,'![[A.svg]]'),false);
  assert.equal(s.editor.edits.length,0);
});
test("stored commands only execute after explicit selection", async () => {
  const s = setup("/Fixture", { customInsert: [{ command: "test:command", label: "Fixture" }] });
  const entry = s.entry("command:test:command");
  assert.deepEqual(s.state.executed, []);
  await s.controller.choose(s.context(), entry);
  assert.deepEqual(s.state.executed, ["test:command"]); assert.equal(s.editor.text, "");
});
for (const result of [false, new Error("Fixture failure")]) test(`failed custom command restores untouched literal query (${String(result)})`, async () => {
  const s = setup("/Fixture", { customInsert: [{ command: "test:command", label: "Fixture" }] });
  s.state.result = result;
  await s.controller.choose(s.context(), s.entry("command:test:command"));
  assert.equal(s.editor.text, "/Fixture"); assert.ok(s.notices.length);
});
test("failing custom command cannot overwrite its own edits", async () => {
  const s = setup("/Fixture", { customInsert: [{ command: "test:command", label: "Fixture" }] });
  s.state.result = () => { s.editor.text = "Host result"; return false; };
  await s.controller.choose(s.context(), s.entry("command:test:command"));
  assert.equal(s.editor.text, "Host result");
});
test("custom command selected from a manual menu retains the selected text", async () => {
  const s = setup("Selected", { customInsert: [{ command: "test:command", label: "Fixture" }] });
  s.editor.from = 0;
  s.state.result = () => { assert.equal(s.editor.text.slice(s.editor.from, s.editor.to), "Selected"); return true; };
  await s.controller.choose(s.context(), s.entry("command:test:command"));
  assert.equal(s.editor.text, "Selected"); assert.equal(s.editor.edits.length, 0);
});
test("unknown custom command cannot consume its trigger", async () => {
  const s = setup("/Fixture");
  await s.controller.choose(s.context(), { id: "command:unknown", command: "unknown", mode: "command" });
  assert.equal(s.editor.text, "/Fixture"); assert.deepEqual(s.state.executed, []);
});
test("wiki choice directly inserts empty brackets at the native completion caret without a modal", async () => {
  const s=setup('/wiki');await s.controller.choose(s.context(),s.entry('wiki'));
  assert.equal(s.dialogs.length,0);assert.equal(s.editor.text,'[[]]');assert.equal(s.editor.from,2);assert.equal(s.editor.to,2);assert.equal(s.editor.edits.length,1);
});
test('explicit selection-link target picker remains separate from blank wiki insertion and preserves alias/cancel',()=>{
  const s=setup('Selected');s.editor.from=0;const context=s.controller.capture(s.editor,s.file);
  s.controller.pickFile(context,'wiki');assert.equal(s.dialogs.length,1);assert.equal(s.editor.edits.length,0);
  s.dialogs[0].close();assert.equal(s.editor.text,'Selected');
  s.controller.pickFile(context,'wiki');s.dialogs[1].onChooseSuggestion(s.page);
  assert.equal(s.editor.text,'[[Work/Plan|Selected]]');assert.equal(s.editor.edits.length,1);
});
for(const zh of [false,true]) test(`Page creates an untitled sibling, follows host link style and opens the original leaf (${zh})`,async()=>{
  const s=setup('/newpage');s.state.zh=zh;s.folder.path='Research';s.file.path='Research/Start.md';
  const path=`Research/${zh?'未命名':'Untitled'}.md`;
  s.app.fileManager.generateMarkdownLink=(f,source)=>{assert.equal(source,s.file.path);return `[New note](${f.path})`;};
  await s.controller.choose(s.context(),s.entry('newpage'));
  assert.deepEqual(s.state.created,[{path,contents:''}]);assert.equal(s.editor.text,`[New note](${path})`);
  assert.equal(s.state.opened[0].path,path);assert.equal(s.editor.edits.length,1);assert.equal(s.dialogs.length,0);
});
test('Page uses the next unused sibling name without overwriting earlier files',async()=>{
  const s=setup('/newpage');s.state.files.push({path:'Untitled.md'},{path:'Untitled 1.md'});
  await s.controller.choose(s.context(),s.entry('newpage'));
  assert.equal(s.state.created[0].path,'Untitled 2.md');assert.equal(s.editor.text,'[[Untitled 2]]');assert.equal(s.state.files.filter(f=>f.path==='Untitled.md').length,1);
});
for(const change of ['text','cursor','file','rename','folder','active','composition','disposed'])test(`Page preserves the created file without linking or navigating after asynchronous ${change}`,async()=>{
  const s=setup('/newpage'),context=s.context();
  s.state.createHook=()=>{
    if(change==='text')s.editor.text='New work';
    if(change==='cursor')s.editor.from=s.editor.to=0;
    if(change==='file')s.state.changedFile=true;
    if(change==='rename')s.file.path='Moved.md';
    if(change==='folder')s.folder.path='Moved';
    if(change==='active')s.app.workspace.activeLeaf={};
    if(change==='composition')s.state.composing=true;
    if(change==='disposed')s.controller.dispose();
  };
  await s.controller.choose(context,s.entry('newpage'));
  assert.equal(s.editor.edits.length,0);assert.equal(s.state.opened.length,0);assert.ok(s.state.files.some(f=>f.path==='Untitled.md'));
  if(change!=='disposed')assert.match(s.notices.at(-1),/file was kept/u);
});
test('Page coalesces repeated choice while the file write is pending',async()=>{
  const s=setup('/newpage'),context=s.context();let resolve;s.state.createHook=()=>new Promise(r=>{resolve=r;});
  const pending=s.controller.choose(context,s.entry('newpage'));await s.controller.choose(context,s.entry('newpage'));
  assert.equal(s.state.created.length,1);resolve();await pending;assert.equal(s.state.opened.length,1);
});
test('Page write failure or raced collision preserves literal query, with no ambiguous retry',async()=>{
  for(const collision of [false,true]){
    const s=setup('/newpage');
    if(collision)s.state.createHook=()=>s.state.files.push({path:'Untitled.md'});else s.state.createError=Error('disk unavailable');
    await s.controller.choose(s.context(),s.entry('newpage'));
    assert.equal(s.editor.text,'/newpage');assert.equal(s.state.created.length,1);assert.equal(s.state.opened.length,0);assert.match(s.notices.at(-1),/not overwritten/u);
  }
});
test('Page open failure keeps the file and successful source link',async()=>{
  const s=setup('/newpage');s.state.openError=Error('window unavailable');
  await s.controller.choose(s.context(),s.entry('newpage'));
  assert.equal(s.editor.text,'[[Untitled]]');assert.ok(s.state.files.some(f=>f.path==='Untitled.md'));assert.match(s.notices.at(-1),/not be opened/u);
});
test('Page link serialization failure keeps the created file and literal query',async()=>{
  const s=setup('/newpage');s.app.fileManager.generateMarkdownLink=()=>{throw Error('link failure');};
  await s.controller.choose(s.context(),s.entry('newpage'));
  assert.equal(s.editor.text,'/newpage');assert.equal(s.state.opened.length,0);assert.match(s.notices.at(-1),/file was kept/u);
});
test("native date formatting supports custom patterns without changing global locale", () => {
  const s = setup();
  const before = moment.locale(), date = new Date(2024, 1, 29, 13, 45, 12);
  const values = s.formattedDates({ dateFormat: "DD/MM/YYYY", timeFormat: "HH:mm:ss" }, false, date);
  assert.equal(values.today, "29/02/2024"); assert.equal(values.tomorrow, "01/03/2024");
  assert.equal(values.yesterday, "28/02/2024"); assert.equal(values.time, "13:45:12");
  s.formattedDates(s.prefs, true, date); assert.equal(moment.locale(), before);
});
