import { readFile } from 'node:fs/promises';

import { compareDictionaries } from './i18n-validator.ts';

const directory = new URL('../src/messages/', import.meta.url);
const [spanish, english]: unknown[] = await Promise.all([
  readFile(new URL('es.json', directory), 'utf8').then(JSON.parse),
  readFile(new URL('en.json', directory), 'utf8').then(JSON.parse),
]);
const errors = compareDictionaries(spanish, english);
if (errors.length) {
  console.error(`Diccionario inglés inválido:\n${errors.map((error) => `- ${error}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log('Diccionarios i18n válidos: es (canónico) y en.');
}
