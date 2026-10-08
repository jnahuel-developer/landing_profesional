import { useTranslations } from 'next-intl';

import { PublicLayout } from '../../components/layouts/public-layout';
import { routes } from '../../config/routes';
import { Link } from '../../i18n/navigation';

export default function NotFoundPage() {
  const t = useTranslations('States');
  return (
    <PublicLayout>
      <section aria-labelledby="not-found-title" className="placeholder-page">
        <p className="placeholder-page__eyebrow">{t('notFoundEyebrow')}</p>
        <h1 id="not-found-title">{t('notFoundTitle')}</h1>
        <p>{t('notFoundDescription')}</p>
        <Link className="inline-action" href={routes.home.path}>
          {t('backHome')}
        </Link>
      </section>
    </PublicLayout>
  );
}
