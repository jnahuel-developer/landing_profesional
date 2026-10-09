import { Container } from '@portfolio/ui';
import type { ReactNode } from 'react';

import { PublicFooter } from '../navigation/public-footer';
import { PublicHeader } from '../navigation/public-header';
import { SectionNavigationProvider } from '../navigation/section-navigation';
import { SkipLink } from '../navigation/skip-link';

export function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <SectionNavigationProvider>
      <div className="public-shell" data-layout="public">
        <SkipLink />
        <PublicHeader />
        <main className="shell-main" id="main-content" tabIndex={-1}>
          <Container>{children}</Container>
        </main>
        <PublicFooter />
      </div>
    </SectionNavigationProvider>
  );
}
