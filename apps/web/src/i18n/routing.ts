import { defineRouting } from 'next-intl/routing';

export const locales = ['es', 'en'] as const;
export const defaultLocale = 'es' as const;
export const localeCookieName = 'NEXT_LOCALE';
export const localeCookieMaxAge = 60 * 60 * 24 * 365;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: true,
  localeCookie: {
    name: localeCookieName,
    maxAge: localeCookieMaxAge,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
});

export type Locale = (typeof locales)[number];
