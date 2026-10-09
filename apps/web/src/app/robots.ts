import type { MetadataRoute } from 'next';
import { canonicalOrigin } from '../lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/en/admin',
        '/dev',
        '/en/dev',
        '/api',
        '/en/api',
        '/lab/demo',
        '/en/lab/demo',
        '/lab/session',
        '/en/lab/session',
        '/lab/sessions',
        '/en/lab/sessions',
      ],
    },
    sitemap: `${canonicalOrigin}/sitemap.xml`,
    host: canonicalOrigin,
  };
}
