import { Container } from '@portfolio/ui';
import type { ReactNode } from 'react';

export function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="public-shell" data-layout="public">
      <main className="shell-main" id="main-content" tabIndex={-1}>
        <Container>{children}</Container>
      </main>
    </div>
  );
}
