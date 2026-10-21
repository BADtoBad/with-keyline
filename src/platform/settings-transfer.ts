import { importLimit, jsonObject, planLegacyImport, type ImportPlan } from "../domain/legacy-import";
import { decodePreferences, writablePreferences, type Preferences } from "../domain/preferences";

export interface TransferIO {
  read(): Promise<string | null>;
  write(text: string | null): Promise<void>;
  createBackup(name: string, text: string): Promise<void>;
  readBackup(name: string): Promise<string>;
  listBackups(): Promise<string[]>;
}
interface Payload {
  schema: 1; kind: "import" | "restore"; before: string | null; after: string | null;
  manifest?: string; source?: string; restoredFrom?: string;
}
export interface TransferPreview {
  readonly kind: "import" | "restore";
  readonly changes: readonly string[];
  readonly notices: readonly string[];
  readonly result: string | null;
}
export class TransferFailure extends Error {
  constructor(message: string, readonly backup?: string, readonly uncertain = false) { super(message); }
}
const safeName = (name: string) => /^settings-[a-z0-9-]{1,100}\.json$/u.test(name);
export async function transferDigest(text: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(bytes), n => n.toString(16).padStart(2,"0")).join("");
}
/** Explicit, backed-up settings transactions. The owning plugin prevents other
 * preference updates while busy and requires its normal save queue to be clean.
 * Backup files are immutable snapshots, never deletion candidates. */
export class SettingsTransfer {
  busy = false;
  private live = true;
  private previews = new WeakMap<TransferPreview,Payload>();
  constructor(private io: TransferIO, private current: () => Preferences, private ready: () => boolean,
    private committed: (value: Preferences) => void, private uncertain: () => void,
    private name: () => string = () => `settings-${Date.now()}-${crypto.randomUUID()}.json`) {}
  close(): void { this.live = false; }
  private check(): void { if (!this.live || !this.ready()) throw Error("Settings are read-only, unsaved or no longer active"); }
  private async run<T>(action: () => Promise<T>): Promise<T> {
    if (this.busy) throw Error("Another settings transfer is running");
    this.check(); this.busy = true;
    try { return await action(); } finally { this.busy = false; }
  }
  private parsed(raw: string | null): unknown {
    const value = raw === null ? null : jsonObject(raw,"current settings");
    if (!writablePreferences(value)) throw Error("Unknown settings schema; no overwrite allowed");
    return value;
  }
  private async baseline(): Promise<string | null> {
    const raw = await this.io.read(); this.check();
    const decoded = decodePreferences(this.parsed(raw));
    if (JSON.stringify(decoded) !== JSON.stringify(this.current())) throw Error("Settings changed outside this session; reload before importing");
    return raw;
  }
  private issue(payload: Payload, plan?: ImportPlan): TransferPreview {
    const preview = Object.freeze({ kind: payload.kind, result: payload.after, changes: Object.freeze(plan?.changed.slice() ?? ["restore-snapshot"]),
      notices: Object.freeze(plan?.notices.slice() ?? ["later-settings-replaced","notes-and-host-preferences-untouched"]) });
    this.previews.set(preview,payload); return preview;
  }
  previewImport(manifest: string, source: string): Promise<TransferPreview> {
    return this.run(async () => {
      const before = await this.baseline(), plan = planLegacyImport(manifest,source,this.current());
      return this.issue({schema:1,kind:"import",before,after:JSON.stringify(plan.preferences,null,2),manifest,source},plan);
    });
  }
  async backups(): Promise<string[]> { return (await this.io.listBackups()).filter(safeName).sort().reverse(); }
  previewRestore(name: string): Promise<TransferPreview> {
    return this.run(async () => {
      if (!safeName(name)) throw Error("Invalid backup name");
      const record = jsonObject(await this.io.readBackup(name),"backup",importLimit*4);
      if (Object.keys(record).some(k=>!["payload","sha256"].includes(k)) || typeof record.payload !== "string" ||
          record.sha256 !== await transferDigest(record.payload)) throw Error("Backup integrity check failed");
      const payload = jsonObject(record.payload,"backup payload",importLimit*4);
      if (payload.schema !== 1 || !["import","restore"].includes(payload.kind as string) ||
          Object.keys(payload).some(k=>!["schema","kind","before","after","manifest","source","restoredFrom"].includes(k)) ||
          !(payload.before === null || typeof payload.before === "string") || !(payload.after === null || typeof payload.after === "string")) throw Error("Unsupported backup schema");
      this.parsed(payload.before); // Never restore a future/unreadable schema.
      const before = await this.baseline();
      return this.issue({schema:1,kind:"restore",before,after:payload.before,restoredFrom:name});
    });
  }
  apply(preview: TransferPreview): Promise<string> {
    return this.run(async () => {
      const payload = this.previews.get(preview);
      if (!payload) throw Error("Preview expired; review settings again");
      this.previews.delete(preview);
      if (await this.baseline() !== payload.before) throw Error("Settings changed after preview; review again");
      const name = this.name(); if (!safeName(name)) throw Error("Invalid generated backup name");
      const serialized = JSON.stringify(payload), record = JSON.stringify({payload:serialized,sha256:await transferDigest(serialized)},null,2);
      if (record.length > importLimit*4) throw Error("Backup would exceed the verified recovery limit");
      await this.io.createBackup(name,record);
      if (await this.io.readBackup(name) !== record) throw new TransferFailure("Backup read-back failed; settings were not changed",name);
      this.check();
      if (await this.io.read() !== payload.before) throw new TransferFailure("Settings changed while backing up; no overwrite",name);
      this.check();
      try {
        await this.io.write(payload.after);
        if (await this.io.read() !== payload.after) throw Error("Settings read-back failed");
      } catch {
        // Do not overwrite an unrelated concurrent value. Restore only a value
        // proved to be ours, or accept that the original was never changed.
        let restored = false;
        try {
          const actual = await this.io.read();
          if (actual === payload.before) restored = true;
          else if (actual === payload.after) {
            await this.io.write(payload.before); restored = await this.io.read() === payload.before;
          }
        } catch { /* Keep backup and require explicit recovery after reload. */ }
        if (!restored && this.live) this.uncertain();
        throw new TransferFailure(restored ? "Write failed; original settings retained" : "Write state uncertain; settings locked. Keep the backup and reload before recovery",name,!restored);
      }
      if (this.live) this.committed(decodePreferences(this.parsed(payload.after)));
      return name;
    });
  }
}
