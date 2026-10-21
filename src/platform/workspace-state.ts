import { equalJson } from "./persistence";

export type WorkspaceLayout = Record<string, unknown>;
export interface WorkspaceCore {
  workspaces: Record<string, WorkspaceLayout>;
  activeWorkspace: string;
  saveData(): Promise<unknown> | unknown;
  onOpenModal?(): void;
}
export type WorkspaceProblem = "unavailable" | "conflict" | "busy" | "stale" | "invalid" | "duplicate" | "missing" | "recovery" | "failed";
export class WorkspaceFailure extends Error {
  constructor(readonly problem: WorkspaceProblem) { super(problem); }
}
const fail = (problem: WorkspaceProblem): never => { throw new WorkspaceFailure(problem); };
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const own = (v: object, key: string): boolean => Object.prototype.hasOwnProperty.call(v, key);
export function validWorkspaceName(name: string): boolean {
  name = name.trim();
  return !!name.trim() && name.length <= 80 && !/[\x00-\x1f\x7f]/u.test(name) &&
    name !== "prototype" && !Object.getOwnPropertyNames(Object.prototype).includes(name.trim());
}
function copy<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }
export function workspaceLayout(value: unknown): WorkspaceLayout {
  if (!object(value) || !object(value.main)) return fail("invalid");
  return copy(value);
}
/** Compare the requested scene, not derived tab captions. The native missing-
 * plugin view keeps its type and opaque state but changes its icon/title.
 * Only those two leaf presentation fields and the save timestamp are omitted;
 * custom state (even keys named title/icon/children) is never traversed. */
function scene(value: WorkspaceLayout): WorkspaceLayout {
  const result = workspaceLayout(value); delete result.mtime;
  const visit = (node: unknown): void => {
    if (!object(node)) return;
    if (node.type === "leaf") {
      if (object(node.state)) { delete node.state.icon; delete node.state.title; }
      return;
    }
    if (Array.isArray(node.children)) node.children.forEach(visit);
  };
  for (const key of ["main", "left", "right", "floating"]) visit(result[key]);
  return result;
}
const sameScene = (actual: WorkspaceLayout, target: WorkspaceLayout): boolean => equalJson(scene(actual), scene(target));
interface Snapshot { schema: 1; layout: WorkspaceLayout; active: string; at: string }
interface Journal extends Omit<Snapshot, "schema"> { schema: 2; sequence: number }
export function validRecovery(value: unknown): value is Snapshot {
  return object(value) && value.schema === 1 && typeof value.active === "string" &&
    typeof value.at === "string" && Number.isFinite(Date.parse(value.at)) && object(value.layout) && object(value.layout.main);
}
function journal(value: unknown): value is Journal {
  return object(value) && value.schema === 2 && Number.isSafeInteger(value.sequence) && (value.sequence as number) > 0 &&
    validRecovery({ ...value, schema: 1 });
}
export interface WorkspaceDisk {
  exists(path: string): Promise<boolean>;
  read(path: string): Promise<string>;
  write(path: string, content: string): Promise<unknown>;
}
/** Recovery is separate from settings and core data. A write may only replace
 * an empty/torn slot or the older valid slot, never the last verified copy or
 * an unknown schema. No startup writes, filesystem renames or deletion. */
export class WorkspaceJournal {
  private paths: string[];
  constructor(private disk: WorkspaceDisk, private directory: string) {
    this.paths = [0, 1].map(n => `${directory}/workspace-recovery.${n}.json`);
  }
  private async slots() {
    return Promise.all(this.paths.map(async path => {
      if (!await this.disk.exists(path)) return { path, text: null, value: null, future: false };
      const text = await this.disk.read(path);
      let parsed: unknown;
      try { parsed = JSON.parse(text); } catch { parsed = null; }
      return { path, text, value: journal(parsed) ? parsed : null, future: object(parsed) && parsed.schema !== 2 };
    }));
  }
  async read(): Promise<Snapshot | Journal | null> {
    const slots = await this.slots();
    const values = slots.map(s => s.value).filter((s): s is Journal => s !== null).sort((a, b) => b.sequence - a.sequence);
    if (values.length) return copy(values[0]);
    if (slots.some(s => s.text !== null)) return fail("recovery");
    const legacy = `${this.directory}/workspace-recovery.json`;
    if (!await this.disk.exists(legacy)) return null;
    const value: unknown = JSON.parse(await this.disk.read(legacy));
    if (!validRecovery(value)) return fail("recovery");
    return value; // Existing development snapshots are readable, never rewritten.
  }
  async write(snapshot: Snapshot, valid: () => void): Promise<void> {
    const slots = await this.slots(); valid();
    const good = slots.filter(s => s.value).sort((a, b) => b.value!.sequence - a.value!.sequence);
    if (!good.length && slots.some(s => s.text !== null)) return fail("recovery");
    const target = slots.find(s => !s.value && !s.future) ?? (good.length === 2 ? good[1] : undefined);
    if (!target) return fail("recovery");
    const sequence = (good[0]?.value?.sequence ?? 0) + 1;
    if (!Number.isSafeInteger(sequence)) return fail("recovery");
    const text = JSON.stringify({ ...snapshot, schema: 2, sequence });
    // Catch an external edit while the journal was inspected.
    const now = await this.disk.exists(target.path) ? await this.disk.read(target.path) : null;
    valid(); if (now !== target.text) return fail("stale");
    await this.disk.write(target.path, text);
    if (await this.disk.read(target.path) !== text) return fail("recovery");
    valid();
  }
}
export interface WorkspacePort {
  core(): WorkspaceCore | null;
  conflict(): boolean;
  allowed(): boolean;
  current(): WorkspaceLayout;
  apply(layout: WorkspaceLayout): Promise<unknown>;
  readSaved(): Promise<unknown>;
}
/** Independent transaction boundary. UI callbacks never operate on a freshly
 * discovered active layout after an await: validate the captured core, source,
 * selected definition and current scene before every destructive step. */
export class WorkspaceActions {
  busy = false;
  private live = true;
  constructor(private port: WorkspacePort, private recovery: WorkspaceJournal) {}
  core(): WorkspaceCore {
    if (!this.live || !this.port.allowed()) return fail("stale");
    if (this.port.conflict()) return fail("conflict");
    const c = this.port.core();
    if (!c) return fail("unavailable");
    return c;
  }
  stop(): void { this.live = false; }
  private async operation(action: (c: WorkspaceCore) => Promise<void>): Promise<void> {
    if (this.busy) return fail("busy");
    const c = this.core(); this.busy = true;
    try { await action(c); } finally { this.busy = false; }
  }
  private same(c: WorkspaceCore): void { if (this.core() !== c) fail("stale"); }
  private snapshot(c: WorkspaceCore): Snapshot {
    return { schema: 1, layout: workspaceLayout(this.port.current()), active: c.activeWorkspace || "", at: new Date().toISOString() };
  }
  private unchanged(c: WorkspaceCore, before: Snapshot): void {
    this.same(c);
    if (c.activeWorkspace !== before.active || !equalJson(workspaceLayout(this.port.current()), before.layout)) fail("stale");
  }
  private async persist(c: WorkspaceCore): Promise<void> {
    const expected = copy({ workspaces: c.workspaces, active: c.activeWorkspace });
    await c.saveData();
    const actual = await this.port.readSaved();
    this.same(c);
    if (!object(actual) || !equalJson(actual.workspaces, expected.workspaces) || actual.active !== expected.active ||
      !equalJson(copy(c.workspaces), expected.workspaces) || c.activeWorkspace !== expected.active) fail("failed");
  }
  async switchTo(name: string): Promise<void> {
    return this.operation(async c => {
      if (!own(c.workspaces, name)) return fail("missing");
      const selected = c.workspaces[name], target = workspaceLayout(selected), before = this.snapshot(c);
      const valid = () => {
        this.unchanged(c, before);
        if (!own(c.workspaces, name) || c.workspaces[name] !== selected || !equalJson(workspaceLayout(selected), target)) fail("stale");
      };
      await this.recovery.write(before, valid);
      await this.apply(c, target, name, before);
    });
  }
  async restore(): Promise<void> {
    return this.operation(async c => {
      const before = this.snapshot(c), saved = await this.recovery.read(); this.unchanged(c, before);
      if (!saved) return fail("missing");
      await this.recovery.write(before, () => this.unchanged(c, before));
      await this.apply(c, workspaceLayout(saved.layout), own(c.workspaces, saved.active) ? saved.active : "", before);
    });
  }
  private async apply(c: WorkspaceCore, target: WorkspaceLayout, name: string, before: Snapshot): Promise<void> {
    await this.port.apply(copy(target)); this.same(c);
    // A delayed native operation must not relabel a newer scene opened by the user.
    const applied = workspaceLayout(this.port.current());
    if (!sameScene(applied, target) || c.activeWorkspace !== before.active) return fail("stale");
    c.activeWorkspace = name;
    try { await this.persist(c); }
    catch (error) {
      // Roll back only our still-current scene. A newer/foreign change wins.
      this.same(c);
      if (c.activeWorkspace === name && equalJson(workspaceLayout(this.port.current()), applied)) {
        await this.port.apply(copy(before.layout)); this.same(c);
        if (sameScene(workspaceLayout(this.port.current()), before.layout) && c.activeWorkspace === name) {
          c.activeWorkspace = before.active; await this.persist(c);
        }
      }
      throw error;
    }
  }
  async save(name: string, overwrite: boolean): Promise<void> {
    return this.operation(async c => {
      name = name.trim();
      if (!validWorkspaceName(name)) return fail("invalid");
      const exists = own(c.workspaces, name), previous = c.workspaces[name], active = c.activeWorkspace;
      if (exists && !overwrite) return fail("duplicate");
      if (overwrite && (!exists || name !== active)) return fail("stale");
      const next = workspaceLayout(this.port.current()); next.mtime = new Date().toISOString();
      const intended = copy(next);
      c.workspaces[name] = next; c.activeWorkspace = name;
      try { await this.persist(c); }
      catch (error) {
        // Do not erase changes made through the native manager during I/O.
        if (this.live && this.port.allowed() && this.port.core() === c && c.workspaces[name] === next && equalJson(next, intended)) {
          if (exists) c.workspaces[name] = previous; else delete c.workspaces[name];
          if (c.activeWorkspace === name) c.activeWorkspace = active;
        }
        throw error;
      }
    });
  }
  async manage(): Promise<void> {
    return this.operation(async c => {
      if (typeof c.onOpenModal !== "function") return fail("unavailable");
      const before = this.snapshot(c);
      await this.recovery.write(before, () => this.unchanged(c, before));
      c.onOpenModal();
    });
  }
}
