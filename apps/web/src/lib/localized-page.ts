import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { routes, type RouteId } from '../config/routes';
import { documentAlternates, documentUrl } from './seo';

export async function getRouteMetadata(routeId: RouteId): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations('Routes');
  const route = routes[routeId];
  const title = t(`${routeId}.title`);
  const description = t(`${routeId}.description`);
  if (route.kind === 'internal' || (route.kind === 'section' && routeId !== 'home')) {
    return { title, description, robots: { follow: false, index: false } };
  }
  return {
    title,
    description,
    alternates: documentAlternates(route.path, locale),
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'es_AR',
      alternateLocale: locale === 'en' ? 'es_AR' : 'en_US',
      url: documentUrl(route.path, locale),
      title,
      description,
      siteName: 'Nahuel Martínez',
    },
    twitter: { card: 'summary', title, description },
  };
}
