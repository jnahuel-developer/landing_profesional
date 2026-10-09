import type { Locale } from './routing';

export async function loadMessages(locale: Locale) {
  return (await import(`../messages/${locale}.json`)).default;
}

export function getSafeMessageFallback(locale: Locale, namespace?: string) {
  if (locale === 'en')
    return namespace === 'Common' ? 'Content unavailable' : 'Content temporarily unavailable';
  return namespace === 'Common'
    ? 'Contenido no disponible'
    : 'Contenido temporalmente no disponible';
}
