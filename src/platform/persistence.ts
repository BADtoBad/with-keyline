/**
 * Immutable, ordered snapshots. A failed write is retryable without rollback;
 * later writes wait for read-back too. No background/timed writes.
 */
export class VerifiedStore<T> {
  private tail: Promise<void> = Promise.resolve();
  private revision = 0;
  private saved = 0;
  private live = true;
  private latest: T | undefined;
  private listeners = new Set<() => void>();
  constructor(
    private readonly write: (value: T) => Promise<void>,
    private readonly read: () => Promise<unknown>,
    private readonly notify: (state: "saved" | "failed") => void
  ) {}
  get dirty(): boolean { return this.saved < this.revision; }
  subscribe(listener: () => void): () => void {
    if (this.live) this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }
  save(value: T): Promise<void> {
    if (!this.live) return Promise.resolve();
    this.latest = JSON.parse(JSON.stringify(value)) as T;
    const snapshot = this.latest;
    const revision = ++this.revision;
    this.tail = this.tail.catch(() => {}).then(async () => {
      if (!this.live) return;
      try {
        await this.write(snapshot);
        const actual = await this.read();
        if (!equalJson(snapshot, actual)) throw new Error("Read-back mismatch");
        if (!this.live) return;
        this.saved = revision;
        if (revision === this.revision) this.notify("saved");
      } catch {
        if (this.live) this.notify("failed");
      } finally {
        // Update an open settings tab even if the retry came from a Notice.
        if (this.live) for (const listener of this.listeners) listener();
      }
    });
    return this.tail;
  }
  retry(): Promise<void> {
    return this.dirty && this.latest !== undefined ? this.save(this.latest) : this.tail;
  }
  close(): void { this.live = false; this.listeners.clear(); }
}

export function equalJson(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
  if (Array.isArray(a)) return Array.isArray(b) && a.length === b.length && a.every((v, i) => equalJson(v, b[i]));
  if (Array.isArray(b)) return false;
  const left = a as Record<string, unknown>, right = b as Record<string, unknown>;
  const keys = Object.keys(left);
  return keys.length === Object.keys(right).length && keys.every(k => Object.prototype.hasOwnProperty.call(right, k) && equalJson(left[k], right[k]));
}
