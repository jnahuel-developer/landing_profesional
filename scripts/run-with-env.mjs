import { constants } from 'node:fs';
import { access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from 'node:process';
import { spawn } from 'node:child_process';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const environmentFile = resolve(repositoryRoot, '.env');
const scriptName = process.argv[2];

if (!scriptName) {
  console.error('Se requiere el nombre del script interno que se desea ejecutar.');
  process.exitCode = 1;
} else {
  try {
    await access(environmentFile, constants.R_OK);
    loadEnvFile(environmentFile);
  } catch (error) {
    if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) {
      throw new Error('No se pudo cargar el archivo .env raíz.', { cause: error });
    }
  }

  const child = spawn(process.execPath, ['--run', scriptName, '--', ...process.argv.slice(3)], {
    cwd: repositoryRoot,
    env: process.env,
    stdio: 'inherit',
  });

  child.once('error', () => {
    console.error(`No se pudo iniciar el script ${scriptName}.`);
    process.exitCode = 1;
  });

  child.once('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exitCode = code ?? 1;
  });
}
