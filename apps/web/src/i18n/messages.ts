import type { Locale } from './routing';

export async function loadMessages(locale: Locale) {
  return (await import(`../messages/${locale}.json`)).default;
}

export function getSafeMessageFallback(namespace?: string) {
  return namespace === 'Common'
    ? 'Contenido no disponible'
    : 'Contenido temporalmente no disponible';
}
