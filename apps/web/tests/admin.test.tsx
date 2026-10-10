import { fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { AdminForm } from '../src/admin/form';
import { renderWithIntl } from './test-utils';
import messages from '../src/messages/es.json';

afterEach(() => {
  vi.unstubAllGlobals();
});
it('anuncia error, conserva usuario, limpia contraseña y bloquea doble envío', async () => {
  let resolve: (value: Response) => void = () => {};
  const fetch = vi.fn(
    () =>
      new Promise<Response>((done) => {
        resolve = done;
      }),
  );
  vi.stubGlobal('fetch', fetch);
  renderWithIntl(<AdminForm />);
  fireEvent.change(screen.getByLabelText(messages.Admin.identifier), {
    target: { value: 'test-user' },
  });
  fireEvent.change(screen.getByLabelText(messages.Admin.password), {
    target: { value: crypto.randomUUID() },
  });
  fireEvent.submit(screen.getByRole('button').closest('form')!);
  fireEvent.submit(screen.getByRole('button').closest('form')!);
  expect(fetch).toHaveBeenCalledOnce();
  expect(screen.getByRole('button')).toBeDisabled();
  resolve(new Response(null, { status: 401 }));
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(messages.Admin.error));
  expect(screen.getByLabelText(messages.Admin.identifier)).toHaveValue('test-user');
  expect(screen.getByLabelText(messages.Admin.password)).toHaveValue('');
  expect(screen.getByRole('button')).toBeEnabled();
});
