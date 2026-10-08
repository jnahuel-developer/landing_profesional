import { describe, expect, it } from 'vitest';
import {
  formatCurrency,
  formatDateTime,
  formatNumber,
  platformTimeZone,
  regionalLocales,
} from '../src/i18n/formats';

const normalizeSpaces = (value: string) => value.replace(/[\s\u00a0\u202f]+/g, ' ');

describe('formatos regionales', () => {
  it('documenta locales y zona horaria de plataforma', () => {
    expect(regionalLocales).toEqual({ es: 'es-AR', en: 'en-US' });
    expect(platformTimeZone).toBe('America/Argentina/Buenos_Aires');
  });
  it('formatea fechas limítrofes con zona explícita y override', () => {
    const instant = new Date('2027-01-01T01:30:00.000Z');
    expect(formatDateTime(instant, 'es')).toContain('2026');
    expect(
      formatDateTime(instant, 'en', { dateStyle: 'short', timeStyle: undefined, timeZone: 'UTC' }),
    ).toMatch(/1\/1\/27/);
  });
  it.each([0, 1234.5, -1234.5])('formatea el número %s según locale', (value) => {
    expect(formatNumber(value, 'es')).toBe(new Intl.NumberFormat('es-AR').format(value));
    expect(formatNumber(value, 'en')).toBe(new Intl.NumberFormat('en-US').format(value));
  });
  it('exige moneda ISO explícita y tolera espacios Unicode regionales', () => {
    expect(normalizeSpaces(formatCurrency(0, 'ARS', 'es'))).toContain('$ 0');
    expect(normalizeSpaces(formatCurrency(-1234.5, 'USD', 'en'))).toContain('-$1,234.50');
    expect(formatCurrency(42, 'EUR', 'en')).toContain('€');
  });
});
