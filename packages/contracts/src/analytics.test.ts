import { randomUUID } from 'node:crypto';
import { Value } from 'typebox/value';
import { expect, it } from 'vitest';
import {
  AnalyticsBatchSchema,
  normalizePublicPage,
  permittedCampaigns,
  referrerDomain,
} from './analytics.js';
const event = {
  id: randomUUID(),
  at: 1000,
  name: 'page_view',
  dimensions: { page: 'home', language: 'es', theme: 'light', device: 'desktop', browser: 'other' },
  properties: { page: 'home' },
};
it('cierra lote, evento, dimensiones y propiedades y limita a 20', () => {
  expect(Value.Check(AnalyticsBatchSchema, { version: 1, events: [event] })).toBe(true);
  for (const batch of [
    { version: 1, events: [event], consent: true },
    { version: 1, events: [{ ...event, email: 'forbidden' }] },
    { version: 1, events: [{ ...event, properties: { page: 'home', text: 'forbidden' } }] },
    {
      version: 1,
      events: [{ ...event, dimensions: { ...event.dimensions, url: '/?email=forbidden' } }],
    },
    { version: 1, events: [{ ...event, name: 'demo_started' }] },
    { version: 1, events: [{ ...event, dimensions: { ...event.dimensions, page: 'admin' } }] },
    { version: 1, events: Array.from({ length: 21 }, () => event) },
  ])
    expect(Value.Check(AnalyticsBatchSchema, batch)).toBe(false);
});
it('sólo normaliza documentos conocidos y descarta parámetros y referencias libres', () => {
  expect(normalizePublicPage('/en/lab')).toBe('laboratory');
  for (const path of [
    '/admin',
    '/en/admin',
    '/dev',
    '/api/v1',
    '/lab/demo',
    '/unknown',
    '/?private=true',
  ])
    expect(normalizePublicPage(path)).toBeNull();
  expect(
    permittedCampaigns(new URLSearchParams('utm_source=private&utm_medium=email&utm_campaign=x')),
  ).toEqual({});
  expect(
    permittedCampaigns(
      new URLSearchParams('utm_source=fiction&utm_medium=private&utm_campaign=test'),
      { utm_source: ['fiction'], utm_medium: [], utm_campaign: ['test'] },
    ),
  ).toEqual({ utm_source: 'fiction', utm_campaign: 'test' });
  expect(referrerDomain('https://example.com/private?secret=never#private')).toBe('example.com');
  for (const value of [
    'invalid',
    'file:///private',
    'http://127.0.0.1/private',
    'https://localhost/private',
  ])
    expect(referrerDomain(value)).toBeUndefined();
});
