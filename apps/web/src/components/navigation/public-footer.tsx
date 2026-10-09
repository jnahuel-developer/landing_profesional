import { Container } from '@portfolio/ui';
import { useTranslations } from 'next-intl';

import { footerRoutes, routes } from '../../config/routes';
import { Link } from '../../i18n/navigation';
import { RouteLink } from './route-link';

export function PublicFooter() {
  const layouts = useTranslations('Layouts');
  const navigation = useTranslations('Navigation');
  return (
    <footer className="public-footer">
      <Container className="public-footer__inner">
        <div>
          <Link className="professional-identity" href={routes.home.path}>
            Nahuel Martínez
          </Link>
          <p>{layouts('copyright')}</p>
        </div>
        <nav aria-label={navigation('secondary')} className="footer-navigation">
          {footerRoutes.map((route) => (
            <RouteLink key={route.id} route={route} />
          ))}
        </nav>
      </Container>
    </footer>
  );
}
