import {
  normalizePublicPage,
  permittedCampaigns,
  referrerDomain,
  type AnalyticsAction,
  type AnalyticsDimensions,
  type AnalyticsEvent,
} from '@portfolio/contracts';

export class AnalyticsClient {
  private enabled = false;
  private queue: AnalyticsEvent[] = [];
  private pending = 0;
  private controller: AbortController | null = null;
  private retry: ReturnType<typeof setTimeout> | undefined;
  private interval: ReturnType<typeof setInterval> | undefined;
  private generation = 0;
  private seen = new Set<string>();
  private lastActivity = 0;
  private documentKey: string | null = null;
  private language: 'es' | 'en' | null = null;
  constructor(
    private dimensions: () => AnalyticsDimensions | null,
    private transport: typeof fetch = (...args) => fetch(...args),
    private now = Date.now,
  ) {}
  get size() {
    return this.queue.length + this.pending;
  }
  get active() {
    return this.enabled;
  }
  start() {
    if (this.enabled) return;
    this.enabled = true;
    this.interval = setInterval(() => {
      void this.flush();
    }, 10_000);
  }
  stop() {
    this.enabled = false;
    this.generation++;
    this.queue = [];
    this.pending = 0;
    this.seen.clear();
    this.documentKey = null;
    this.language = null;
    this.controller?.abort();
    this.controller = null;
    clearTimeout(this.retry);
    clearInterval(this.interval);
  }
  activate(key: string) {
    if (!this.enabled || this.documentKey === key) return;
    const dimensions = this.dimensions();
    if (!dimensions) return;
    const previous = this.language;
    this.language = dimensions.language;
    this.documentKey = key;
    if (previous && previous !== dimensions.language)
      this.track({ name: 'language_changed', properties: { previous, next: dimensions.language } });
    this.track({ name: 'page_view', properties: { page: dimensions.page } });
    if (dimensions.page === 'laboratory')
      this.track({ name: 'lab_viewed', properties: { page: 'laboratory' } });
  }
  track(action: AnalyticsAction) {
    if (!this.enabled) return;
    const dimensions = this.dimensions();
    if (!dimensions) return;
    const now = this.now();
    if (now - this.lastActivity >= 30 * 60_000) this.seen.clear();
    this.lastActivity = now;
    const once =
      action.name === 'contact_started'
        ? action.name
        : action.name === 'section_viewed'
          ? `${action.name}:${action.properties.section}`
          : null;
    if (once && this.seen.has(once)) return;
    if (once) this.seen.add(once);
    if (this.size >= 100) return;
    this.queue.push({ ...action, id: crypto.randomUUID(), at: now, dimensions } as AnalyticsEvent);
    if (this.queue.length >= 20) void this.flush();
  }
  private take() {
    const now = this.now();
    this.queue = this.queue.filter((event) => now - event.at <= 4 * 60_000);
    return this.queue.splice(0, 20);
  }
  async flush() {
    if (!this.enabled || this.controller || this.retry) return;
    const events = this.take();
    if (!events.length) return;
    this.pending = events.length;
    const controller = new AbortController();
    this.controller = controller;
    const generation = this.generation;
    const body = JSON.stringify({ version: 1, events });
    const send = async (attempt: number) => {
      let transient = false;
      try {
        const response = await this.transport('/api/v1/analytics/events', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body,
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(8000)]),
        });
        transient = response.status >= 500 || response.status === 429;
        if (response.status === 403 && generation === this.generation) this.stop();
      } catch {
        transient = !controller.signal.aborted;
      }
      if (generation !== this.generation) return;
      if (transient && attempt === 0 && this.enabled) {
        this.retry = setTimeout(() => {
          this.retry = undefined;
          void send(1);
        }, 1000);
      } else {
        this.pending = 0;
        this.controller = null;
      }
    };
    await send(0);
  }
  beacon(send: (url: string, body: Blob) => boolean) {
    if (!this.enabled) return;
    // In-flight batches belong to fetch; only unsent batches can be handed to Beacon.
    while (this.queue.length) {
      const events = this.take();
      if (!events.length) break;
      if (
        !send(
          '/api/v1/analytics/events',
          new Blob([JSON.stringify({ version: 1, events })], { type: 'application/json' }),
        )
      )
        break;
    }
  }
}

export function browserDimensions(): AnalyticsDimensions | null {
  const page = normalizePublicPage(window.location.pathname);
  if (!page) return null;
  const domain = referrerDomain(document.referrer);
  const ua = navigator.userAgent;
  return {
    page,
    language: document.documentElement.lang === 'en' ? 'en' : 'es',
    theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
    device: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
    browser: /Firefox\//.test(ua)
      ? 'firefox'
      : /Chrome\/|Chromium\/|Edg\//.test(ua)
        ? 'chromium'
        : /Safari\//.test(ua)
          ? 'safari'
          : 'other',
    ...(domain ? { referrer: domain } : {}),
    ...permittedCampaigns(new URLSearchParams(window.location.search)),
  };
}
export const analytics = new AnalyticsClient(browserDimensions);
export function trackContact(name: 'contact_started' | 'contact_submitted') {
  if (!analytics.active) return;
  const dimensions = browserDimensions();
  if (dimensions) analytics.track({ name, properties: { page: dimensions.page } });
}
