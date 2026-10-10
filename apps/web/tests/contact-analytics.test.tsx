import { act, renderHook } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import type { ContactInput } from '@portfolio/contracts';
import { analytics } from '../src/analytics/client';
import { ContactQueryProvider, useContactMutation } from '../src/components/home/contact-mutation';

afterEach(() => {
  analytics.stop();
  vi.restoreAllMocks();
});
it('los callbacks sólo convierten recibo 201 humano y exponen fallos categóricos, sin valores del formulario', async () => {
  analytics.start();
  const track = vi.spyOn(analytics, 'track').mockImplementation(() => {});
  vi.spyOn(globalThis, 'fetch')
    .mockResolvedValueOnce(new Response('{"received":true}', { status: 201 }))
    .mockResolvedValueOnce(new Response('{"received":true}', { status: 200 }))
    .mockResolvedValueOnce(new Response('{"received":true}', { status: 201 }))
    .mockResolvedValueOnce(new Response('{"code":"VALIDATION_ERROR"}', { status: 400 }));
  const input: ContactInput = {
    name: 'Private test',
    email: 'test@example.com',
    message: 'Private query',
    privacyAccepted: true,
    locale: 'es',
    website: '',
    formStartedAt: 0,
  };
  const { result } = renderHook(useContactMutation, { wrapper: ContactQueryProvider });
  await act(async () => {
    await result.current.mutateAsync({ ...input, website: 'trap' });
  });
  expect(track).not.toHaveBeenCalled();
  await act(async () => {
    await result.current.mutateAsync(input);
  });
  expect(track).not.toHaveBeenCalled();
  await act(async () => {
    await result.current.mutateAsync(input);
  });
  expect(track).toHaveBeenCalledExactlyOnceWith({
    name: 'contact_submitted',
    properties: { page: 'home' },
  });
  await act(async () => {
    await expect(result.current.mutateAsync(input)).rejects.toThrow('VALIDATION_ERROR');
  });
  expect(track).toHaveBeenLastCalledWith({
    name: 'contact_failed',
    properties: { category: 'validation' },
  });
  expect(JSON.stringify(track.mock.calls)).not.toMatch(/Private test|test@example|Private query/);
});
