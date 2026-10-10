import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import {
  createTemporaryDatabase,
  dropTemporaryDatabase,
} from '../../../../packages/database/tests/helpers/temporary-database.js';

const source =
  process.env.DATABASE_URL ??
  'postgresql://portfolio:portfolio_local_only@127.0.0.1:5432/portfolio';
const database = await createTemporaryDatabase(source);
try {
  const status = await new Promise<number>((resolveStatus, reject) => {
    const child = spawn(
      process.execPath,
      [process.env.npm_execpath!, 'exec', 'playwright', 'test', ...process.argv.slice(2)],
      {
        cwd: resolve('../..'),
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL: database.url, ADMIN_E2E_DATABASE: database.name },
      },
    );
    child.once('error', reject);
    child.once('exit', (code) => resolveStatus(code ?? 1));
  });
  process.exitCode = status;
} finally {
  await dropTemporaryDatabase(source, database.name);
}
