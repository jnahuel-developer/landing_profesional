import type spanishMessages from './messages/es.json';
import type { formats } from './i18n/typed-formats';
import type { Locale } from './i18n/routing';

declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof spanishMessages;
    Formats: typeof formats;
  }
}
