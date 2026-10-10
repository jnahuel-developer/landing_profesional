import { Type, type Static } from 'typebox';

export const ANALYTICS_VERSION = 1;
export const publicPages = ['home', 'privacy', 'laboratory'] as const;
export const commercialSections = [
  'home',
  'solutions',
  'experience',
  'process',
  'about',
  'contact',
] as const;
export const destinations = [...commercialSections, 'privacy', 'laboratory'] as const;
export const locations = [
  'header',
  'footer',
  'home',
  'solutions',
  'experience',
  'process',
  'about',
  'contact',
  'laboratory',
  'privacy',
] as const;
export function category<T extends string>(values: readonly T[]) {
  return Type.Enum(values);
}
const closed = { additionalProperties: false } as const;
const page = category(publicPages);
const language = category(['es', 'en']);
const theme = category(['light', 'dark']);
export const ConsentChoiceSchema = Type.Object({ analytics: Type.Boolean() }, closed);
export const ConsentStateSchema = Type.Object(
  {
    state: category(['undecided', 'accepted', 'rejected']),
    expiresAt: Type.Union([Type.Number(), Type.Null()]),
  },
  closed,
);
export type ConsentState = Static<typeof ConsentStateSchema>;
export const AnalyticsDimensionsSchema = Type.Object(
  {
    page,
    language,
    theme,
    device: category(['mobile', 'tablet', 'desktop']),
    browser: category(['chromium', 'firefox', 'safari', 'other']),
    referrer: Type.Optional(
      Type.String({
        maxLength: 253,
        pattern: '^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z]{2,63}$',
      }),
    ),
    utm_source: Type.Optional(Type.String({ maxLength: 40, pattern: '^[a-z0-9_-]+$' })),
    utm_medium: Type.Optional(Type.String({ maxLength: 40, pattern: '^[a-z0-9_-]+$' })),
    utm_campaign: Type.Optional(Type.String({ maxLength: 40, pattern: '^[a-z0-9_-]+$' })),
  },
  closed,
);
const properties = {
  page_view: Type.Object({ page }, closed),
  navigation_used: Type.Object(
    { origin: category(locations), destination: category(destinations) },
    closed,
  ),
  cta_clicked: Type.Object(
    { location: category(locations), destination: category(['contact', 'laboratory']) },
    closed,
  ),
  language_changed: Type.Object({ previous: language, next: language }, closed),
  theme_changed: Type.Object({ previous: theme, next: theme }, closed),
  contact_started: Type.Object({ page }, closed),
  contact_submitted: Type.Object({ page }, closed),
  contact_failed: Type.Object(
    { category: category(['validation', 'rate_limit', 'unavailable', 'too_fast', 'payload']) },
    closed,
  ),
  lab_viewed: Type.Object({ page: Type.Literal('laboratory') }, closed),
  demo_card_selected: Type.Object(
    { company: category(['cafe', 'logistics']), location: category(locations) },
    closed,
  ),
  section_viewed: Type.Object({ section: category(commercialSections) }, closed),
  carousel_changed: Type.Object(
    {
      company: category(['cafe', 'logistics']),
      scene: Type.Integer({ minimum: 1, maximum: 5 }),
      method: category(['dots', 'keyboard', 'swipe']),
    },
    closed,
  ),
};
function event<K extends keyof typeof properties>(name: K) {
  return Type.Object(
    {
      id: Type.String({
        pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
      }),
      name: Type.Literal(name),
      at: Type.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
      dimensions: AnalyticsDimensionsSchema,
      properties: properties[name],
    },
    closed,
  );
}
export const AnalyticsEventSchema = Type.Union([
  event('page_view'),
  event('navigation_used'),
  event('cta_clicked'),
  event('language_changed'),
  event('theme_changed'),
  event('contact_started'),
  event('contact_submitted'),
  event('contact_failed'),
  event('lab_viewed'),
  event('demo_card_selected'),
  event('section_viewed'),
  event('carousel_changed'),
]);
export const AnalyticsBatchSchema = Type.Object(
  {
    version: Type.Literal(ANALYTICS_VERSION),
    events: Type.Array(AnalyticsEventSchema, { minItems: 1, maxItems: 20 }),
  },
  closed,
);
export type AnalyticsEvent = Static<typeof AnalyticsEventSchema>;
export type AnalyticsDimensions = Static<typeof AnalyticsDimensionsSchema>;
export type AnalyticsBatch = Static<typeof AnalyticsBatchSchema>;
export type AnalyticsAction = {
  [K in AnalyticsEvent['name']]: {
    name: K;
    properties: Extract<AnalyticsEvent, { name: K }>['properties'];
  };
}[AnalyticsEvent['name']];

export type CampaignCatalog = Readonly<
  Record<'utm_source' | 'utm_medium' | 'utm_campaign', readonly string[]>
>;
// Only explicitly declared campaign values may cross either boundary.
export const campaignCatalog: CampaignCatalog = {
  utm_source: [],
  utm_medium: [],
  utm_campaign: [],
};
export function permittedCampaigns(
  search: URLSearchParams,
  catalog: CampaignCatalog = campaignCatalog,
) {
  const result: Partial<Record<keyof CampaignCatalog, string>> = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign'] as const) {
    const value = search.get(key);
    if (value && catalog[key].includes(value)) result[key] = value;
  }
  return result;
}
export function normalizePublicPage(path: string): (typeof publicPages)[number] | null {
  const normalized = path.replace(/^\/(es|en)(?=\/|$)/, '') || '/';
  return (
    ({ '/': 'home', '/privacidad': 'privacy', '/lab': 'laboratory' } as const)[normalized as '/'] ??
    null
  );
}
export function referrerDomain(value: string): string | undefined {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (
      ['http:', 'https:'].includes(url.protocol) &&
      host.length <= 253 &&
      /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(host)
    )
      return host;
  } catch {
    /* Invalid or absent references are discarded. */
  }
  return undefined;
}
