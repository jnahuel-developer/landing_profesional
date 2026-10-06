import { describe, expect, it } from 'vitest';

import { parseDatabaseUrl } from '../../src/config.js';

describe('configuración de base de datos', () => {
  it('rechaza valores inválidos con mensajes que no incluyen el valor recibido', () => {
    const secret = 'mysql://usuario:secreto@localhost/base';

    expect(() => parseDatabaseUrl(secret)).toThrow(
      'DATABASE_URL debe usar el protocolo PostgreSQL.',
    );

    try {
      parseDatabaseUrl(secret);
    } catch (error) {
      expect(String(error)).not.toContain('secreto');
    }
  });
});
