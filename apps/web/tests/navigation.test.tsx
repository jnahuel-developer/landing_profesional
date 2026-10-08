import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePathname } from 'next/navigation';
import { describe, expect, it, vi } from 'vitest';

import { PublicLayout } from '../src/components/layouts/public-layout';
import { PublicHeader } from '../src/components/navigation/public-header';
import { isRouteActive, primaryRoutes, routes } from '../src/config/routes';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

describe('navegación pública', () => {
  it('renderiza los enlaces desde la configuración y excluye administración', () => {
    render(<PublicHeader />);
    const primary = screen.getByRole('navigation', { name: 'Navegación principal' });

    for (const route of primaryRoutes) {
      expect(within(primary).getByRole('link', { name: route.label })).toHaveAttribute(
        'href',
        route.path,
      );
    }
    expect(within(primary).queryByRole('link', { name: routes.admin.label })).toBeNull();
    expect(screen.queryByRole('link', { name: routes.admin.label })).toBeNull();
  });

  it('marca la coincidencia exacta y descendiente sin activar Inicio globalmente', () => {
    vi.mocked(usePathname).mockReturnValue('/soluciones/caso');
    render(<PublicHeader />);
    const primary = screen.getByRole('navigation', { name: 'Navegación principal' });

    expect(within(primary).getByRole('link', { name: routes.solutions.label })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(within(primary).getByRole('link', { name: routes.home.label })).not.toHaveAttribute(
      'aria-current',
    );
    expect(isRouteActive('/soluciones', routes.solutions.path)).toBe(true);
    expect(isRouteActive('/soluciones/caso', routes.solutions.path)).toBe(true);
    expect(isRouteActive('/contacto', routes.home.path)).toBe(false);
  });

  it('abre, comunica y cierra el menú reducido mediante teclado', async () => {
    vi.mocked(usePathname).mockReturnValue('/');
    const user = userEvent.setup();
    render(<PublicHeader />);
    const summary = screen.getByText('Abrir navegación');
    const details = summary.closest('details');

    summary.focus();
    await user.keyboard('{Enter}');
    if (details && !details.open) {
      details.open = true;
      details.dispatchEvent(new Event('toggle'));
    }
    expect(details).toHaveAttribute('open');
    expect(await screen.findByText('Cerrar navegación')).toBeVisible();

    const compact = screen.getByRole('navigation', { name: 'Navegación reducida' });
    await user.click(within(compact).getByRole('link', { name: routes.contact.label }));
    expect(details).not.toHaveAttribute('open');
  });
});

describe('shell público', () => {
  it('incluye skip link, landmarks y pie sin enlaces internos', () => {
    render(
      <PublicLayout>
        <h1>Contenido</h1>
      </PublicLayout>,
    );

    const skipLink = screen.getByRole('link', { name: 'Saltar al contenido principal' });
    expect(skipLink).toHaveAttribute('href', '#main-content');
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getAllByRole('navigation')).toHaveLength(3);
    expect(screen.queryByRole('link', { name: routes.admin.label })).toBeNull();

    skipLink.focus();
    expect(skipLink).toHaveFocus();
  });
});
