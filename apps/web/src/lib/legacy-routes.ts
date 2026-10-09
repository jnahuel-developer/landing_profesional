import { permanentRedirect } from 'next/navigation';

import { findLegacySection, getLocalizedSectionHref, type SectionId } from '../config/routes';
import { defaultLocale, locales, type Locale } from '../i18n/routing';

type SearchParams = Record<string, string | string[] | undefined>;

function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

function appendSearchParams(href: string, values: SearchParams) {
  const [path, hash] = href.split('#');
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (Array.isArray(value)) value.forEach((item) => search.append(key, item));
    else if (value !== undefined) search.set(key, value);
  }
  const query = search.toString();
  return `${path}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`;
}

export function redirectLegacySection(
  localeValue: string,
  id: SectionId,
  search: SearchParams = {},
) {
  const locale = isLocale(localeValue) ? localeValue : defaultLocale;
  permanentRedirect(appendSearchParams(getLocalizedSectionHref(locale, id), search));
}

export function findLocalizedLegacySection(localeValue: string, segments: readonly string[]) {
  const locale = isLocale(localeValue) ? localeValue : defaultLocale;
  return findLegacySection(locale, segments);
}
