import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTranslator } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import { LanguageSelector } from '../src/components/preferences/language-selector';
import { appRoutes, getSectionHref, isDocumentActive } from '../src/config/routes';
import { getSafeMessageFallback, loadMessages } from '../src/i18n/messages';
import {
  defaultLocale,
  localeCookieMaxAge,
  localeCookieName,
  locales,
  routing,
} from '../src/i18n/routing';
import { renderWithIntl as render } from './test-utils';
import spanishMessages from '../src/messages/es.json';

const mocks = vi.hoisted(() => ({ replace: vi.fn() }));

vi.mock('next/navigation', () => ({
  permanentRedirect: vi.fn(),
  redirect: vi.fn(),
  useParams: vi.fn(() => ({ locale: 'es' })),
  usePathname: vi.fn(() => '/soluciones'),
  useRouter: vi.fn(() => ({ replace: mocks.replace })),
  useSearchParams: vi.fn(() => new URLSearchParams('origen=prueba')),
}));

describe('configuración internacional', () => {
  it('mantiene locales, prefijo y cookie en una única configuración tipada', () => {
    expect(locales).toEqual(['es', 'en']);
    expect(defaultLocale).toBe('es');
    expect(routing.localePrefix).toBe('as-needed');
    expect(localeCookieName).toBe('NEXT_LOCALE');
    expect(localeCookieMaxAge).toBe(31_536_000);
  });

  it('carga de forma diferida diccionarios completos para cada locale', async () => {
    const [spanish, english] = await Promise.all([loadMessages('es'), loadMessages('en')]);
    expect(Object.keys(english)).toEqual(Object.keys(spanish));
    for (const route of appRoutes) {
      expect(spanish.Routes[route.id].label).toBeTruthy();
      expect(english.Routes[route.id].label).toBeTruthy();
    }
  });

  it('distingue documentos de destinos de sección', () => {
    expect(isDocumentActive('/privacidad/detalle', '/privacidad')).toBe(true);
    expect(isDocumentActive('/en/privacidad', '/privacidad')).toBe(false);
    expect(getSectionHref('contact')).toBe('/#contact');
  });

  it('ofrece un fallback localizado sin revelar identificadores', () => {
    expect(getSafeMessageFallback('es', 'Common')).toBe('Contenido no disponible');
    expect(getSafeMessageFallback('en', 'Routes')).toBe('Content temporarily unavailable');
  });

  it('soporta interpolación y pluralización ICU', () => {
    const t = createTranslator({ locale: 'es', messages: spanishMessages, namespace: 'Common' });
    expect(t('welcome', { name: 'Nahuel' })).toBe('Hola, Nahuel');
    expect(t('itemCount', { count: 0 })).toBe('Ningún elemento');
    expect(t('itemCount', { count: 1 })).toBe('1 elemento');
    expect(t('itemCount', { count: 2 })).toBe('2 elementos');
  });

  it('cambia locale mediante navegación localizada conservando ruta, query y hash', async () => {
    window.history.replaceState(null, '', '/soluciones?origen=prueba#detalle');
    const user = userEvent.setup();
    render(<LanguageSelector />);
    await user.selectOptions(screen.getByRole('combobox', { name: 'Idioma' }), 'en');
    expect(mocks.replace).toHaveBeenCalledWith('/en/soluciones?origen=prueba#detalle');
  });
});
