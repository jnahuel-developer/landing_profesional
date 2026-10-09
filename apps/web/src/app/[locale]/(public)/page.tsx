import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { solutionAreas } from '../../../components/home/business-sections';
import { ContinuousHome } from '../../../components/home/continuous-home';
import { getRouteMetadata } from '../../../lib/localized-page';
import { defaultLocale, routing } from '../../../i18n/routing';

export const generateMetadata = () => getRouteMetadata('home');

export default async function HomePage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale: localeValue } = await params;
  const locale = hasLocale(routing.locales, localeValue) ? localeValue : defaultLocale;
  const t = await getTranslations({ locale, namespace: 'Home.hero' });
  const solutions = await getTranslations({ locale, namespace: 'Home.solutions' });
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
        serviceType: solutionAreas.map((area) => solutions(`areas.${area}.title`)),
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
