import { useTranslations } from 'next-intl';

import type { RouteId } from '../config/routes';

export function PlaceholderPage({ routeId }: Readonly<{ routeId: RouteId }>) {
  const routes = useTranslations('Routes');
  const layouts = useTranslations('Layouts');
  return (
    <section aria-labelledby="page-title" className="placeholder-page">
      <p className="placeholder-page__eyebrow">{layouts('placeholder')}</p>
      <h1 id="page-title">{routes(`${routeId}.title`)}</h1>
      <p>{routes(`${routeId}.description`)}</p>
    </section>
  );
}
