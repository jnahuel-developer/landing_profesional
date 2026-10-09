import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { PublicLayout } from '../src/components/layouts/public-layout';
import { PublicHeader } from '../src/components/navigation/public-header';
import { getSectionHref, primaryRoutes } from '../src/config/routes';
import messages from '../src/messages/es.json';
import { renderWithIntl as render } from './test-utils';

vi.mock('next/navigation', () => ({
  permanentRedirect: vi.fn(),
  redirect: vi.fn(),
  useParams: vi.fn(() => ({ locale: 'es' })),
  usePathname: vi.fn(() => '/'),
  useRouter: vi.fn(() => ({ replace: vi.fn() })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

describe('navegación pública', () => {
  it('renderiza los enlaces desde la configuración y excluye administración', () => {
    render(<PublicHeader />);
    const primary = screen.getByRole('navigation', { name: 'Navegación principal' });

    for (const route of primaryRoutes) {
      expect(
        within(primary).getByRole('link', { name: messages.Routes[route.id].label }),
      ).toHaveAttribute('href', getSectionHref(route.id));
    }
    expect(within(primary).queryByRole('link', { name: messages.Routes.admin.label })).toBeNull();
    expect(screen.queryByRole('link', { name: messages.Routes.admin.label })).toBeNull();
  });

  it('marca Inicio como ubicación activa por defecto', () => {
    render(<PublicHeader />);
    const primary = screen.getByRole('navigation', { name: 'Navegación principal' });

    expect(within(primary).getByRole('link', { name: messages.Routes.home.label })).toHaveAttribute(
      'aria-current',
      'location',
    );
  });

  it('abre, comunica y cierra el menú reducido mediante teclado', async () => {
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
    await user.click(within(compact).getByRole('link', { name: messages.Routes.contact.label }));
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
    expect(screen.queryByRole('link', { name: messages.Routes.admin.label })).toBeNull();

    skipLink.focus();
    expect(skipLink).toHaveFocus();
  });
});
