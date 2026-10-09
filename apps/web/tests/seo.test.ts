import { describe, expect, it, vi } from 'vitest';
import sitemap from '../src/app/sitemap';
import robots from '../src/app/robots';
import { canonicalOrigin, documentAlternates } from '../src/lib/seo';
import { getRouteMetadata } from '../src/lib/localized-page';

const mocks = vi.hoisted(() => ({ locale: 'es' }));
vi.mock('next-intl/server', () => ({
  getLocale: () => mocks.locale,
  getTranslations: async () => (key: string) => key,
}));

describe('documentos indexables y metadata', () => {
  it('sólo incluye seis documentos y alternates absolutos sin fragmentos', () => {
    const entries = sitemap();
    expect(entries.map(({ url }) => url)).toEqual(
      ['/', '/en', '/privacidad', '/en/privacidad', '/lab', '/en/lab'].map(
        (path) => canonicalOrigin + path,
      ),
    );
    for (const entry of entries) {
      expect(entry.url).not.toContain('#');
      expect(Object.keys(entry.alternates?.languages ?? {})).toEqual(['es', 'en', 'x-default']);
    }
  });
  it.each(['es', 'en'])(
    'canonical y metadata social únicos por documento en %s',
    async (locale) => {
      mocks.locale = locale;
      for (const [id, path] of [
        ['home', '/'],
        ['privacy', '/privacidad'],
        ['laboratory', '/lab'],
      ] as const) {
        const metadata = await getRouteMetadata(id);
        expect(metadata.alternates).toEqual(documentAlternates(path, locale));
        expect(metadata.openGraph).toMatchObject({
          title: `${id}.title`,
          description: `${id}.description`,
          url: documentAlternates(path, locale).canonical,
        });
        expect(metadata.twitter).toMatchObject({ card: 'summary' });
        expect(metadata.robots).toBeUndefined();
      }
      const admin = await getRouteMetadata('admin');
      expect(admin.robots).toEqual({ index: false, follow: false });
      expect(admin.alternates).toBeUndefined();
    },
  );
  it('robots excluye superficies privadas y futuras sesiones', () => {
    expect(robots().sitemap).toBe(`${canonicalOrigin}/sitemap.xml`);
    expect(robots().rules).toMatchObject({
      userAgent: '*',
      allow: '/',
      disallow: expect.arrayContaining([
        '/admin',
        '/en/admin',
        '/dev',
        '/api',
        '/lab/demo',
        '/en/lab/session',
      ]),
    });
  });
});
