import type { MetadataRoute } from 'next';
import { documentAlternates, documentUrl, indexablePaths } from '../lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return indexablePaths.flatMap((path) =>
    ['es', 'en'].map((locale) => ({
      url: documentUrl(path, locale),
      alternates: { languages: documentAlternates(path, locale).languages },
    })),
  );
}
