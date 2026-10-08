import { useTranslations } from 'next-intl';

export function SkipLink() {
  const t = useTranslations('Layouts');
  return (
    <a className="skip-link" href="#main-content">
      {t('skip')}
    </a>
  );
}
