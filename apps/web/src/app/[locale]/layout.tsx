import { hasLocale, NextIntlClientProvider } from 'next-intl';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { routing } from '../../i18n/routing';
import { appearanceBootstrap } from '../../preferences/bootstrap';
import { PreferencesProvider } from '../../preferences/preferences-provider';

import '../../styles/globals.css';

const geist = localFont({
  src: '../../../public/fonts/geist-variable.woff2',
  display: 'swap',
  variable: '--font-geist',
  weight: '100 900',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return { title: t('siteTitle'), description: t('siteDescription') };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      className={geist.variable}
      data-density="comfortable"
      data-motion="full"
      data-motion-preference="system"
      data-theme="light"
      data-theme-preference="system"
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <Script
          dangerouslySetInnerHTML={{ __html: appearanceBootstrap }}
          id="appearance-bootstrap"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <NextIntlClientProvider>
          <PreferencesProvider>{children}</PreferencesProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
