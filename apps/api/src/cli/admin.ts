import {
  createAdminRepository,
  createDatabaseClient,
  createPool,
  loadDatabaseConfig,
} from '@portfolio/database';
import { runAdminCommand } from '../modules/admin/commands.js';
import { terminalInput } from '../modules/admin/terminal.js';

let pool: ReturnType<typeof createPool> | undefined;
try {
  if (process.argv.length !== 3) throw new Error('ADMIN_ARGUMENTS_INVALID');
  const command = process.argv[2]!;
  // Fail before touching DB if a password would be requested without a terminal.
  const input = ['create', 'password'].includes(command)
    ? terminalInput()
    : {
        read: async () => {
          throw new Error('ADMIN_INPUT_UNEXPECTED');
        },
      };
  pool = createPool(loadDatabaseConfig().databaseUrl);
  await runAdminCommand(command, createAdminRepository(createDatabaseClient(pool)), input);
  console.info('Operación administrativa completada.');
} catch (error) {
  const code =
    error instanceof Error && /^ADMIN_[A-Z_]+$/.test(error.message)
      ? error.message
      : 'ADMIN_OPERATION_FAILED';
  console.error(
    code === 'ADMIN_TTY_REQUIRED'
      ? 'ADMIN_TTY_REQUIRED: se requiere una terminal interactiva con entrada sin eco.'
      : code,
  );
  process.exitCode = 1;
} finally {
  await pool?.end();
}
