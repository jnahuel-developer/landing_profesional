import type { Locale } from './routing';

export const platformTimeZone = 'America/Argentina/Buenos_Aires';
export const regionalLocales = { es: 'es-AR', en: 'en-US' } as const satisfies Record<
  Locale,
  string
>;

export function formatDateTime(
  value: Date | number | string,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = {},
) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(regionalLocales[locale], {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: platformTimeZone,
    ...options,
  }).format(date);
}

export function formatNumber(
  value: number,
  locale: Locale,
  options: Intl.NumberFormatOptions = {},
) {
  return new Intl.NumberFormat(regionalLocales[locale], options).format(value);
}

export function formatCurrency(
  value: number,
  currency: string,
  locale: Locale,
  options: Omit<Intl.NumberFormatOptions, 'currency' | 'style'> = {},
) {
  return new Intl.NumberFormat(regionalLocales[locale], {
    style: 'currency',
    currency,
    ...options,
  }).format(value);
}
