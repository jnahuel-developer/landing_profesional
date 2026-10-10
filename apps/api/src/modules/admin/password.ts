import { randomBytes, createHash } from 'node:crypto';
import * as argon2 from 'argon2';

export const argonParameters = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 1,
} as const;
export const digestToken = (token: string) => createHash('sha256').update(token).digest('hex');
export const randomToken = () => randomBytes(32).toString('hex');
export function normalizeIdentifier(identifier: string) {
  const normalized = identifier.trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9._@-]{0,99}$/.test(normalized)) throw new Error('ADMIN_IDENTIFIER_INVALID');
  return normalized;
}
export function hashPassword(password: string) {
  if ([...password].length < 12 || [...password].length > 128)
    throw new Error('ADMIN_PASSWORD_LENGTH');
  return argon2.hash(password, argonParameters);
}
// Ephemeral, never serialized; no account/hash is required in configuration or builds.
let dummyHash: Promise<string> | undefined;
export async function verifyPassword(hash: string | undefined, password: string) {
  dummyHash ??= hashPassword(randomToken());
  const valid = await argon2.verify(hash ?? (await dummyHash), password);
  return hash !== undefined && valid;
}
