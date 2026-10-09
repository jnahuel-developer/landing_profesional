'use client';

import { useSyncExternalStore } from 'react';
import english from '../messages/en.json';
import spanish from '../messages/es.json';

const subscribe = () => () => {};
const getLocale = () => (/^\/en(?:\/|$)/.test(window.location.pathname) ? 'en' : 'es');
const serverLocale = () => 'es' as const;

// This boundary remains usable if the locale layout or its providers fail.
export default function GlobalError({ reset }: Readonly<{ reset: () => void }>) {
  const locale = useSyncExternalStore(subscribe, getLocale, serverLocale);
  return (
    <html lang={locale}>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, sans-serif',
          background: '#fff',
          color: '#17202a',
        }}
      >
        <GlobalErrorContent locale={locale} reset={reset} />
      </body>
    </html>
  );
}

export function GlobalErrorContent({
  locale,
  reset,
}: Readonly<{ locale: 'es' | 'en'; reset: () => void }>) {
  const t = (locale === 'en' ? english : spanish).States;
  const home = locale === 'en' ? '/en' : '/';
  return (
    <main style={{ maxWidth: '48rem', padding: '3rem 1.5rem', margin: '0 auto' }}>
      <title>{t.errorTitle}</title>
      <p>{t.errorEyebrow}</p>
      <h1>{t.errorTitle}</h1>
      <p>{t.errorDescription}</p>
      <button
        type="button"
        onClick={reset}
        style={{ minHeight: '44px', padding: '0.5rem 1rem', font: 'inherit' }}
      >
        {t.retry}
      </button>
      <p>
        <a href={home}>{t.backHome}</a>
      </p>
      <p>
        <a href={`${home}#contact`}>{t.contact}</a>
      </p>
    </main>
  );
}
