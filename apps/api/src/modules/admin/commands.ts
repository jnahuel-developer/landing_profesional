import type { AdminRepository } from '@portfolio/database';
import { hashPassword, normalizeIdentifier } from './password.js';

export interface AdminInput {
  read(label: string, hidden: boolean): Promise<string>;
}
export async function runAdminCommand(
  command: string,
  repository: AdminRepository,
  input: AdminInput,
) {
  if (command === 'retain') {
    await repository.retain(new Date());
    return;
  }
  if (!['create', 'password', 'revoke-sessions'].includes(command))
    throw new Error('ADMIN_COMMAND_INVALID');
  if (command === 'revoke-sessions') {
    await repository.invalidate();
    return;
  }
  const user = await repository.user();
  if (command === 'create' && user) throw new Error('ADMIN_ACCOUNT_EXISTS');
  if (command === 'password' && !user) throw new Error('ADMIN_ACCOUNT_ABSENT');
  const identifier =
    command === 'create'
      ? normalizeIdentifier(await input.read('Identificador: ', false))
      : undefined;
  const password = await input.read('Contraseña (12–128 caracteres): ', true);
  const confirmation = await input.read('Confirmar contraseña: ', true);
  if (password !== confirmation) throw new Error('ADMIN_PASSWORD_CONFIRMATION');
  const hash = await hashPassword(password);
  if (identifier !== undefined) await repository.create(identifier, hash);
  else await repository.invalidate(hash);
}
