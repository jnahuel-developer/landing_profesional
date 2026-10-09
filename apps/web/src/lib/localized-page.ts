import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { routes, type RouteId } from '../config/routes';

export async function getRouteMetadata(routeId: RouteId): Promise<Metadata> {
  const t = await getTranslations('Routes');
  return {
    title: t(`${routeId}.title`),
    description: t(`${routeId}.description`),
    ...(routes[routeId].kind === 'lab' || routes[routeId].kind === 'internal'
      ? { robots: { follow: false, index: false } }
      : {}),
  };
}
