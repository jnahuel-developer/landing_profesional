export class AdminRateLimit {
  private entries = new Map<string, { count: number; expires: number; reported: boolean }>();
  private global = { count: 0, expires: 0, reported: false };
  constructor(
    private attempts = 5,
    private globalAttempts = 100,
    private capacity = 10000,
  ) {}
  take(ip: string, now: number) {
    for (const [key, entry] of this.entries) if (entry.expires <= now) this.entries.delete(key);
    if (this.global.expires <= now)
      this.global = { count: 0, expires: now + 900000, reported: false };
    const existing = this.entries.get(ip);
    const limited =
      this.global.count >= this.globalAttempts
        ? this.global
        : existing && existing.count >= this.attempts
          ? existing
          : !existing && this.entries.size >= this.capacity
            ? this.global
            : undefined;
    if (limited) {
      const report = !limited.reported;
      limited.reported = true;
      return {
        allowed: false as const,
        retry: Math.max(1, Math.ceil((limited.expires - now) / 1000)),
        report,
        delay: 0,
      };
    }
    const entry = existing ?? { count: 0, expires: now + 900000, reported: false };
    entry.count++;
    this.global.count++;
    this.entries.set(ip, entry);
    return {
      allowed: true as const,
      retry: 0,
      report: false,
      delay: Math.min((entry.count - 1) * 200, 800),
    };
  }
}
