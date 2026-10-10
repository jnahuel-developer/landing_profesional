import { normalizePublicPage, type ConsentState } from '@portfolio/contracts';
import { analytics, type AnalyticsClient } from './client';

export const pendingWithdrawalKey = 'privacy-withdrawal-pending-v1';
interface Snapshot {
  state: ConsentState['state'];
  pending: boolean;
  failed: boolean;
}
interface ConsentStorage {
  pending(): boolean;
  remember(value: boolean): void;
}
export class ConsentController {
  private snapshot: Snapshot = { state: 'undecided', pending: false, failed: false };
  private listeners = new Set<() => void>();
  private revision = 0;
  private expiry: ReturnType<typeof setTimeout> | undefined;
  constructor(
    private client: AnalyticsClient,
    private storage: ConsentStorage,
    private transport: typeof fetch,
    private broadcast: (accepted: boolean) => void = () => {},
    private now = Date.now,
  ) {}
  getSnapshot = () => this.snapshot;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private publish(snapshot: Snapshot) {
    this.snapshot = snapshot;
    for (const listener of this.listeners) listener();
  }
  private disable() {
    clearTimeout(this.expiry);
    this.client.stop();
  }
  remote(accepted: boolean) {
    this.disable();
    if (!accepted) {
      this.storage.remember(true);
      this.publish({ state: 'rejected', pending: true, failed: false });
    }
    void this.refresh();
  }
  async refresh() {
    if (this.storage.pending()) {
      await this.choose(false, false);
      return;
    }
    const revision = ++this.revision;
    try {
      const response = await this.transport('/api/v1/privacy/consent', {
        credentials: 'same-origin',
        cache: 'no-store',
      });
      if (!response.ok) throw new Error('CONSENT_UNAVAILABLE');
      const state = (await response.json()) as ConsentState;
      if (revision !== this.revision || this.storage.pending()) return;
      this.apply(state);
    } catch {
      if (revision !== this.revision) return;
      this.disable();
      this.publish({ state: 'undecided', pending: false, failed: true });
    }
  }
  private apply(state: ConsentState) {
    if (
      !['accepted', 'rejected', 'undecided'].includes(state.state) ||
      (state.state !== 'undecided' && (!state.expiresAt || state.expiresAt <= this.now()))
    )
      throw new Error('CONSENT_INVALID');
    const preserve =
      state.state === 'accepted' && this.snapshot.state === 'accepted' && this.client.active;
    if (!preserve) this.disable();
    else clearTimeout(this.expiry);
    this.publish({ state: state.state, pending: false, failed: false });
    if (state.state === 'accepted') this.client.start();
    if (state.expiresAt) {
      // Browsers clamp timeouts to signed 32-bit milliseconds.
      const expires = state.expiresAt;
      const schedule = () => {
        const delay = expires - this.now();
        if (delay <= 0) {
          this.disable();
          this.publish({ state: 'undecided', pending: false, failed: false });
        } else this.expiry = setTimeout(schedule, Math.min(delay, 2_000_000_000));
      };
      schedule();
    }
  }
  async choose(accepted: boolean, announce = true) {
    const revision = ++this.revision;
    this.disable();
    if (!accepted) {
      this.storage.remember(true);
      this.publish({ state: 'rejected', pending: true, failed: false });
      if (announce) this.broadcast(false);
    }
    try {
      const response = await this.transport(
        '/api/v1/privacy/consent',
        accepted
          ? {
              method: 'POST',
              credentials: 'same-origin',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ analytics: true }),
            }
          : { method: 'DELETE', credentials: 'same-origin' },
      );
      if (!response.ok) throw new Error('CONSENT_UNAVAILABLE');
      const state = (await response.json()) as ConsentState;
      if (revision !== this.revision) return;
      if (state.state !== (accepted ? 'accepted' : 'rejected')) throw new Error('CONSENT_INVALID');
      this.storage.remember(false);
      this.apply(state);
      if (accepted && announce) this.broadcast(true);
    } catch {
      if (revision !== this.revision) return;
      this.disable();
      this.publish({
        state: accepted ? 'undecided' : 'rejected',
        pending: !accepted,
        failed: true,
      });
    }
  }
  suspend() {
    this.revision++;
    this.disable();
  }
}
let channel: BroadcastChannel | undefined;
const storage: ConsentStorage = {
  pending: () => {
    if (typeof window === 'undefined') return false;
    let local = false;
    try {
      local = localStorage.getItem(pendingWithdrawalKey) === '1';
    } catch {
      /* Necessary cookie fallback. */
    }
    return (
      local ||
      document.cookie.split(';').some((part) => part.trim() === `${pendingWithdrawalKey}=1`)
    );
  },
  remember: (value) => {
    try {
      if (value) localStorage.setItem(pendingWithdrawalKey, '1');
      else localStorage.removeItem(pendingWithdrawalKey);
    } catch {
      /* Cookie fallback remains available. */
    }
    document.cookie = `${pendingWithdrawalKey}=${value ? '1' : ''}; Max-Age=${value ? 180 * 86400 : 0}; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
  },
};
export const consent = new ConsentController(
  analytics,
  storage,
  (...args) => fetch(...args),
  (accepted) => channel?.postMessage({ accepted }),
);
export function synchronizeConsent() {
  if (typeof BroadcastChannel !== 'undefined') {
    channel = new BroadcastChannel('portfolio-privacy');
    channel.onmessage = (event: MessageEvent<{ accepted?: unknown }>) => {
      if (typeof event.data?.accepted === 'boolean') consent.remote(event.data.accepted);
    };
  }
  const changed = (event: StorageEvent) => {
    if (event.key === pendingWithdrawalKey && event.newValue === '1') consent.remote(false);
  };
  const online = () => {
    void consent.refresh();
  };
  window.addEventListener('storage', changed);
  window.addEventListener('online', online);
  const retry = setInterval(() => {
    if (consent.getSnapshot().pending) void consent.choose(false, false);
  }, 10_000);
  void consent.refresh();
  return () => {
    channel?.close();
    channel = undefined;
    window.removeEventListener('storage', changed);
    window.removeEventListener('online', online);
    clearInterval(retry);
    if (!normalizePublicPage(window.location.pathname)) consent.suspend();
  };
}
