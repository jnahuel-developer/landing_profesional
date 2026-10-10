export interface AdminConfig {
  webOrigin: string;
  secure: boolean;
  attempts: number;
  globalAttempts: number;
}
export function loadAdminConfig(env: NodeJS.ProcessEnv = process.env): AdminConfig {
  let url: URL;
  try {
    url = new URL(env.WEB_ORIGIN ?? '');
  } catch {
    throw new Error('WEB_ORIGIN_INVALID');
  }
  if (
    url.origin !== env.WEB_ORIGIN ||
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    (env.NODE_ENV === 'production' && url.protocol !== 'https:')
  )
    throw new Error('WEB_ORIGIN_INVALID');
  const limit = (key: string, fallback: number) => {
    const value = env[key] ?? String(fallback);
    if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) > 100000)
      throw new Error(`${key}_INVALID`);
    return Number(value);
  };
  return {
    webOrigin: url.origin,
    secure: env.NODE_ENV === 'production',
    attempts: limit('ADMIN_LOGIN_ATTEMPTS', 5),
    globalAttempts: limit('ADMIN_LOGIN_GLOBAL_ATTEMPTS', 100),
  };
}
