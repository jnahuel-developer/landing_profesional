'use client';

import { useTranslations } from 'next-intl';

import { PublicLayout } from '../../components/layouts/public-layout';
import { routes } from '../../config/routes';
import { Link } from '../../i18n/navigation';

export default function ErrorPage({ reset }: Readonly<{ reset: () => void }>) {
  const t = useTranslations('States');
  return (
    <PublicLayout>
      <section aria-labelledby="error-title" className="placeholder-page">
        <p className="placeholder-page__eyebrow">{t('errorEyebrow')}</p>
        <h1 id="error-title">{t('errorTitle')}</h1>
        <p>{t('errorDescription')}</p>
        <div className="error-actions">
          <button className="inline-action" onClick={reset} type="button">
            {t('retry')}
          </button>
          <Link className="inline-action inline-action--secondary" href={routes.home.path}>
            {t('backHome')}
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
