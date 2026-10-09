export const canonicalOrigin = 'https://www.nahuelmartinez.com.ar';
export const indexablePaths = ['/', '/privacidad', '/lab'] as const;

export function documentUrl(path: string, locale: string) {
  return `${canonicalOrigin}${locale === 'en' ? '/en' : ''}${path === '/' && locale === 'en' ? '' : path}`;
}

export function documentAlternates(path: string, locale: string) {
  return {
    canonical: documentUrl(path, locale),
    languages: {
      es: documentUrl(path, 'es'),
      en: documentUrl(path, 'en'),
      'x-default': documentUrl(path, 'es'),
    },
  };
}
