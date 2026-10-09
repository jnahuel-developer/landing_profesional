import { Container } from '@portfolio/ui';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import { routes } from '../../config/routes';
import { Link } from '../../i18n/navigation';
import { LanguageSelector } from '../preferences/language-selector';
import { ThemeToggle } from '../preferences/theme-toggle';
import { PublicFooter } from '../navigation/public-footer';
import { SkipLink } from '../navigation/skip-link';

export function LaboratoryLayout({ children }: Readonly<{ children: ReactNode }>) {
  const t = useTranslations('Layouts');
  return (
    <div className="laboratory-shell" data-layout="laboratory">
      <SkipLink />
      <header className="section-shell-header">
        <Container className="section-shell-header__inner">
          <p className="section-shell-label">{t('labLabel')}</p>
          <div className="section-shell-actions">
            <LanguageSelector />
            <ThemeToggle />
            <Link href={routes.home.path}>{t('backPortfolio')}</Link>
          </div>
        </Container>
      </header>
      <main className="shell-main" id="main-content" tabIndex={-1}>
        <Container>{children}</Container>
      </main>
      <PublicFooter />
    </div>
  );
}
