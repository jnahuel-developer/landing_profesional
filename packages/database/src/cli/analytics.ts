import { closePool, createDatabaseClient, createPool } from '../client.js';
import { loadDatabaseConfig } from '../config.js';
import { aggregateAnalytics, analyticsDay, retainAnalytics } from '../analytics.js';

const mode = process.argv[2];
if (!['aggregate', 'retain'].includes(mode ?? '')) throw new Error('ANALYTICS_COMMAND_INVALID');
if (process.argv.length > (mode === 'aggregate' ? 4 : 3))
  throw new Error('ANALYTICS_ARGUMENTS_INVALID');
const day =
  mode === 'aggregate' ? analyticsDay(process.argv[3] ?? process.env.ANALYTICS_DAY) : undefined;
const pool = createPool(loadDatabaseConfig().databaseUrl);
try {
  const db = createDatabaseClient(pool);
  if (day) {
    const replaced = await aggregateAnalytics(db, day);
    console.log(
      replaced ? `Analítica UTC agregada: ${day}` : `Día conservado sin reescritura: ${day}`,
    );
  } else {
    await retainAnalytics(db);
    console.log('Retención analítica aplicada.');
  }
} finally {
  await closePool(pool);
}
