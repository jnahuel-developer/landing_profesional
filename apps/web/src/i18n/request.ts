import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { defaultLocale, routing } from './routing';
import { getSafeMessageFallback, loadMessages } from './messages';

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale = hasLocale(routing.locales, requestedLocale) ? requestedLocale : defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
    onError(error) {
      if (process.env.NODE_ENV !== 'production') throw error;
      console.error('[i18n]', error.code);
    },
    getMessageFallback({ namespace }) {
      return getSafeMessageFallback(locale, namespace);
    },
  };
});
