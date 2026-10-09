import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { ContinuousHome } from '../../../components/home/continuous-home';
import { defaultLocale, routing } from '../../../i18n/routing';

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>): Promise<Metadata> {
  const { locale: localeValue } = await params;
  const locale = hasLocale(routing.locales, localeValue) ? localeValue : defaultLocale;
  const t = await getTranslations({ locale, namespace: 'Routes.home' });
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'es_AR',
      title: t('title'),
      description: t('description'),
      siteName: 'Nahuel Martínez',
    },
    twitter: {
      card: 'summary',
      title: t('title'),
      description: t('description'),
    },
  };
}

export default async function HomePage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale: localeValue } = await params;
  const locale = hasLocale(routing.locales, localeValue) ? localeValue : defaultLocale;
  const t = await getTranslations({ locale, namespace: 'Home.hero' });
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': 'https://www.nahuelmartinez.com.ar/#person',
        name: 'Nahuel Martínez',
        url: 'https://www.nahuelmartinez.com.ar/',
        jobTitle: t('eyebrow'),
      },
      {
        '@type': 'ProfessionalService',
        '@id': 'https://www.nahuelmartinez.com.ar/#service',
        name: t('eyebrow'),
        description: t('description'),
        provider: { '@id': 'https://www.nahuelmartinez.com.ar/#person' },
        serviceType: [
          t('capabilities.product'),
          t('capabilities.architecture'),
          t('capabilities.development'),
          t('capabilities.operations'),
        ],
        inLanguage: locale,
      },
    ],
  };
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replaceAll('<', '\\u003c'),
        }}
        id="home-structured-data"
        type="application/ld+json"
      />
      <ContinuousHome />
    </>
  );
}
