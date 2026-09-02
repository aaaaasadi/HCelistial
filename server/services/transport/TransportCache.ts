interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class TransportCache {
  private static store = new Map<string, CacheEntry<any>>();

  // Default TTLs in seconds
  public static readonly LIVE_STATUS_TTL_SEC = 30;
  public static readonly SEARCH_OPTIONS_TTL_SEC = 600; // 10 minutes

  /**
   * Retrieves an entry if present and not expired.
   */
  public static get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Sets an entry with a specific TTL in seconds.
   */
  public static set<T>(key: string, data: T, ttlSeconds: number): void {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  }

  /**
   * Removes a specific key or clears all expired entries.
   */
  public static delete(key: string): void {
    this.store.delete(key);
  }

  public static clear(): void {
    this.store.clear();
  }

  public static cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }

  public static size(): number {
    return this.store.size;
  }
}
