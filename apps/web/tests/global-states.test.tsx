import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePathname } from 'next/navigation';
import { describe, expect, it, vi } from 'vitest';

import ErrorPage from '../src/app/[locale]/error';
import NotFoundPage from '../src/app/[locale]/not-found';
import { routes } from '../src/config/routes';
import { renderWithIntl as render } from './test-utils';

vi.mock('next/navigation', () => ({
  permanentRedirect: vi.fn(),
  redirect: vi.fn(),
  useParams: vi.fn(() => ({ locale: 'es' })),
  usePathname: vi.fn(() => '/ruta-inexistente'),
  useRouter: vi.fn(() => ({ replace: vi.fn() })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

describe('estados globales', () => {
  it('ofrece una página 404 navegable y coherente con el shell público', () => {
    vi.mocked(usePathname).mockReturnValue('/ruta-inexistente');
    render(<NotFoundPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'Página no encontrada' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute(
      'href',
      routes.home.path,
    );
    expect(screen.getAllByRole('main')).toHaveLength(1);
  });

  it('muestra un error seguro y permite reintentar', async () => {
    const reset = vi.fn();
    const user = userEvent.setup();
    render(<ErrorPage reset={reset} />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'No pudimos completar la operación' }),
    ).toBeVisible();
    expect(screen.queryByText(/stack|trace|exception/i)).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Intentar nuevamente' }));
    expect(reset).toHaveBeenCalledOnce();
    expect(screen.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute(
      'href',
      routes.home.path,
    );
  });
});
