'use client';

import { Container } from '@portfolio/ui';
import { useTranslations } from 'next-intl';
import { useRef, useState, type MouseEvent } from 'react';

import { primaryRoutes, routes } from '../../config/routes';
import { Link } from '../../i18n/navigation';
import { LanguageSelector } from '../preferences/language-selector';
import { PreferencesControls } from '../preferences/preferences-controls';
import { RouteLink } from './route-link';

export function PublicHeader() {
  const t = useTranslations('Navigation');
  const menuRef = useRef<HTMLDetailsElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu(event: MouseEvent<HTMLAnchorElement>) {
    if (menuRef.current) menuRef.current.open = false;
    setMenuOpen(false);
    event.currentTarget.blur();
  }

  return (
    <header className="public-header">
      <Container className="public-header__inner">
        <Link className="professional-identity" href={routes.home.path}>
          Nahuel Martínez
        </Link>

        <nav aria-label={t('primary')} className="desktop-navigation">
          {primaryRoutes.map((route) => (
            <RouteLink className="navigation-link" key={route.path} route={route} />
          ))}
        </nav>

        <div className="desktop-navigation header-actions">
          <LanguageSelector />
          <PreferencesControls />
          <RouteLink className="laboratory-cta" route={routes.laboratory} />
        </div>

        <details
          className="compact-navigation"
          onToggle={(event) => setMenuOpen(event.currentTarget.open)}
          ref={menuRef}
        >
          <summary>
            <span>{menuOpen ? t('close') : t('open')}</span>
          </summary>
          <nav aria-label={t('compact')} className="compact-navigation__panel">
            <LanguageSelector />
            <PreferencesControls />
            {primaryRoutes.map((route) => (
              <RouteLink
                className="navigation-link"
                key={route.path}
                onClick={closeMenu}
                route={route}
              />
            ))}
            <RouteLink className="laboratory-cta" onClick={closeMenu} route={routes.laboratory} />
          </nav>
        </details>
      </Container>
    </header>
  );
}
