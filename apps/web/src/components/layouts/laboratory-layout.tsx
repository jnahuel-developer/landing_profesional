import { Container } from '@portfolio/ui';
import type { ReactNode } from 'react';

export function LaboratoryLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="laboratory-shell" data-layout="laboratory">
      <header className="section-shell-header">
        <Container>
          <p className="section-shell-label">Nahuel Martínez · Entorno preliminar</p>
        </Container>
      </header>
      <main className="shell-main" id="main-content" tabIndex={-1}>
        <Container>{children}</Container>
      </main>
    </div>
  );
}
