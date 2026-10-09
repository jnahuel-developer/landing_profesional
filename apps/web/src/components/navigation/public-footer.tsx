import { Container } from '@portfolio/ui';
import { useTranslations } from 'next-intl';

import { footerRoutes, routes } from '../../config/routes';
import { Link } from '../../i18n/navigation';

export function PublicFooter() {
  const layouts = useTranslations('Layouts');
  const navigation = useTranslations('Navigation');
  const routeMessages = useTranslations('Routes');
  return (
    <footer className="public-footer">
      <Container className="public-footer__inner">
        <div>
          <Link className="professional-identity" href={routes.home.path}>
            Nahuel Martínez
          </Link>
          <p>{layouts('portfolio')}</p>
          <p>{layouts('copyright')}</p>
        </div>
        <nav aria-label={navigation('secondary')} className="footer-navigation">
          {footerRoutes.map((route) => (
            <Link key={route.path} href={route.path}>
              {routeMessages(`${route.id}.label`)}
            </Link>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
