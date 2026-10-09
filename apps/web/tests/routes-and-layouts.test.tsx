import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import AdminPage from '../src/app/[locale]/admin/page';
import { ContinuousHome } from '../src/components/home/continuous-home';
import LaboratoryPage from '../src/app/[locale]/lab/page';
import { AdminLayout } from '../src/components/layouts/admin-layout';
import { LaboratoryLayout } from '../src/components/layouts/laboratory-layout';
import { PublicLayout } from '../src/components/layouts/public-layout';
import { PlaceholderPage } from '../src/components/placeholder-page';
import { appRoutes, documents, routes, sections } from '../src/config/routes';
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

describe('configuración de rutas', () => {
  it('distingue secciones estables de documentos independientes', () => {
    expect(sections.map(({ id }) => id)).toEqual([
      'home',
      'solutions',
      'experience',
      'process',
      'about',
      'contact',
    ]);
    expect(sections.every(({ path }) => path === '/')).toBe(true);
    expect(new Set(sections.map(({ hash }) => hash)).size).toBe(sections.length);
    expect(documents.map(({ path }) => path)).toEqual(['/privacidad', '/lab', '/admin']);
    expect(appRoutes).toHaveLength(9);
    expect(appRoutes.filter(({ kind }) => kind === 'lab')).toEqual([routes.laboratory]);
    expect(appRoutes.filter(({ kind }) => kind === 'internal')).toEqual([routes.admin]);
  });
});

describe.each([
  ['public', PublicLayout],
  ['laboratory', LaboratoryLayout],
  ['admin', AdminLayout],
] as const)('layout %s', (name, Layout) => {
  it('expone un único contenido principal semántico', () => {
    render(
      <Layout>
        <h1>Página de prueba</h1>
      </Layout>,
    );

    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
    expect(screen.getByRole('main').parentElement).toHaveAttribute('data-layout', name);
  });
});

describe('placeholders', () => {
  it.each(documents)('renderiza un único h1 para $path', (route) => {
    const { unmount } = render(<PlaceholderPage routeId={route.id} />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      messages.Routes[route.id].title,
    );
    unmount();
  });

  it('renderiza las seis secciones de la home en orden con un único h1', () => {
    const { container } = render(<ContinuousHome />);
    expect([...container.querySelectorAll('section')].map(({ id }) => id)).toEqual(
      sections.map(({ id }) => id),
    );
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(5);
  });

  it('mantiene laboratorio y administración como superficies separadas', () => {
    const { unmount } = render(<LaboratoryPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: messages.Routes.laboratory.title }),
    ).toBeVisible();

    unmount();
    render(<AdminPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: messages.Routes.admin.title }),
    ).toBeVisible();
  });

  it('no incluye administración entre las rutas visibles', () => {
    expect(appRoutes.filter(({ kind }) => kind !== 'internal')).not.toContainEqual(routes.admin);
  });
});
