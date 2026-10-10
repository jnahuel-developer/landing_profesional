import { screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import ProtectedAdminLayout from '../src/app/[locale]/admin/(protected)/layout';
import { renderWithIntl } from './test-utils';

const mocks = vi.hoisted(() => ({ state: 'unauthorized', locale: 'es' }));
vi.mock('../src/admin/server', () => ({ getAdminSession: async () => ({ state: mocks.state }) }));
vi.mock('next/navigation', () => ({
  redirect: (path: string) => {
    throw new Error(`REDIRECT:${path}`);
  },
}));
vi.mock('next-intl/server', () => ({
  getLocale: async () => mocks.locale,
  getTranslations: async () => (key: string) => key,
}));

it('redirige sesión ausente al login localizado sin render privado', async () => {
  for (const locale of ['es', 'en']) {
    mocks.locale = locale;
    mocks.state = 'unauthorized';
    await expect(ProtectedAdminLayout({ children: <p>private-child</p> })).rejects.toThrow(
      `REDIRECT:${locale === 'en' ? '/en' : ''}/admin/login`,
    );
  }
});
it('indisponibilidad permite reintentar y nunca muestra hijos privados', async () => {
  mocks.state = 'unavailable';
  mocks.locale = 'en';
  renderWithIntl(<>{await ProtectedAdminLayout({ children: <p>private-child</p> })}</>);
  expect(screen.queryByText('private-child')).toBeNull();
  expect(screen.getByRole('status')).toHaveTextContent('unavailable');
  expect(screen.getByRole('link')).toHaveAttribute('href', '/en/admin');
});
it('sólo una sesión autorizada permite mostrar los hijos', async () => {
  mocks.state = 'authorized';
  renderWithIntl(<>{await ProtectedAdminLayout({ children: <p>private-child</p> })}</>);
  expect(screen.getByText('private-child')).toBeVisible();
});
