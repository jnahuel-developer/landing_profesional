import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import AdminPage from '../src/app/admin/page';
import LaboratoryPage from '../src/app/lab/page';
import { AdminLayout } from '../src/components/layouts/admin-layout';
import { LaboratoryLayout } from '../src/components/layouts/laboratory-layout';
import { PublicLayout } from '../src/components/layouts/public-layout';
import { PlaceholderPage } from '../src/components/placeholder-page';
import { appRoutes, routes } from '../src/config/routes';

describe('configuración de rutas', () => {
  it('mantiene rutas absolutas y únicas con la clasificación aprobada', () => {
    const paths = appRoutes.map(({ path }) => path);

    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.every((path) => path.startsWith('/'))).toBe(true);
    expect(appRoutes.filter(({ kind }) => kind === 'primary')).toHaveLength(6);
    expect(appRoutes.filter(({ kind }) => kind === 'secondary')).toHaveLength(1);
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
  it.each(appRoutes)('renderiza un único h1 para $path', (route) => {
    const { unmount } = render(<PlaceholderPage route={route} />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(route.title);
    unmount();
  });

  it('mantiene laboratorio y administración como superficies separadas', () => {
    const { rerender } = render(<LaboratoryPage />);
    expect(screen.getByRole('heading', { level: 1, name: routes.laboratory.title })).toBeVisible();

    rerender(<AdminPage />);
    expect(screen.getByRole('heading', { level: 1, name: routes.admin.title })).toBeVisible();
  });

  it('no incluye administración entre las rutas visibles', () => {
    expect(appRoutes.filter(({ kind }) => kind !== 'internal')).not.toContainEqual(routes.admin);
  });
});
