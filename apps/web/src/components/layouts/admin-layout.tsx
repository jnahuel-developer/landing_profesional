import { Container } from '@portfolio/ui';
import type { ReactNode } from 'react';

export function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="admin-shell" data-layout="admin">
      <header className="section-shell-header">
        <Container>
          <p className="section-shell-label">Área técnica preliminar</p>
        </Container>
      </header>
      <main className="shell-main" id="main-content" tabIndex={-1}>
        <Container>{children}</Container>
      </main>
    </div>
  );
}
