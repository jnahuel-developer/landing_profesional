'use client';

import { Container } from '@portfolio/ui';
import Link from 'next/link';
import { useRef, useState, type MouseEvent } from 'react';

import { primaryRoutes, routes } from '../../config/routes';
import { RouteLink } from './route-link';

export function PublicHeader() {
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

        <nav aria-label="Navegación principal" className="desktop-navigation">
          {primaryRoutes.map((route) => (
            <RouteLink className="navigation-link" key={route.path} route={route} />
          ))}
        </nav>

        <RouteLink className="laboratory-cta desktop-navigation" route={routes.laboratory} />

        <details
          className="compact-navigation"
          onToggle={(event) => setMenuOpen(event.currentTarget.open)}
          ref={menuRef}
        >
          <summary>
            <span>{menuOpen ? 'Cerrar navegación' : 'Abrir navegación'}</span>
          </summary>
          <nav aria-label="Navegación reducida" className="compact-navigation__panel">
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
