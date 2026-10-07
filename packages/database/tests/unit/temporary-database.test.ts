import { describe, expect, it } from 'vitest';

import { dropTemporaryDatabase, generateTestDatabaseName } from '../helpers/temporary-database.js';

describe('bases temporales de integración', () => {
  it('acepta identificadores controlados con el prefijo reservado', () => {
    expect(generateTestDatabaseName('portfolio_test_controlled')).toBe('portfolio_test_controlled');
  });

  it('rechaza una eliminación fuera del prefijo antes de conectarse', async () => {
    await expect(
      dropTemporaryDatabase('postgresql://invalid:invalid@127.0.0.1:1/portfolio', 'portfolio'),
    ).rejects.toThrow('La base temporal debe usar el prefijo portfolio_test_.');
  });
});
