import { Container } from '@portfolio/ui';
import Link from 'next/link';

import { footerRoutes, routes } from '../../config/routes';

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <Container className="public-footer__inner">
        <div>
          <Link className="professional-identity" href={routes.home.path}>
            Nahuel Martínez
          </Link>
          <p>Portfolio profesional.</p>
          <p>© 2026 Nahuel Martínez.</p>
        </div>
        <nav aria-label="Navegación secundaria" className="footer-navigation">
          {footerRoutes.map((route) => (
            <Link key={route.path} href={route.path}>
              {route.label}
            </Link>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
