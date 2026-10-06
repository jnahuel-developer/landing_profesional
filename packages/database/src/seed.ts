import type { Pool } from 'pg';

import { checkDatabase } from './client.js';

export async function seedDatabase(pool: Pool): Promise<void> {
  await checkDatabase(pool);
}
