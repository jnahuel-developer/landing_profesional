import { describe, expect, it } from 'vitest';

import { loadRuntimeConfig } from '../../src/config/env.js';

describe('configuración de runtime', () => {
  it('rechaza configuración inválida sin imprimir secretos', () => {
    const secret = 'mysql://usuario:secreto@localhost/base';

    try {
      loadRuntimeConfig({
        NODE_ENV: 'development',
        API_PORT: '4000',
        DATABASE_URL: secret,
      });
      throw new Error('La configuración inválida fue aceptada.');
    } catch (error) {
      expect(String(error)).not.toContain('secreto');
      expect(String(error)).toContain('PostgreSQL');
    }
  });
});
