export interface AnalyticsConfig {
  secret: string;
  webOrigin: string;
  secure: boolean;
}
export function loadAnalyticsConfig(environment: NodeJS.ProcessEnv = process.env): AnalyticsConfig {
  const secret = environment.ANALYTICS_COOKIE_SECRET;
  if (!secret || secret.length < 32)
    throw new Error('ANALYTICS_COOKIE_SECRET requiere al menos 32 caracteres y sólo uso servidor.');
  let url: URL;
  try {
    url = new URL(environment.WEB_ORIGIN ?? '');
  } catch {
    throw new Error('WEB_ORIGIN requiere un origen web válido.');
  }
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.origin !== environment.WEB_ORIGIN ||
    url.username ||
    url.password ||
    (environment.NODE_ENV === 'production' && url.protocol !== 'https:')
  )
    throw new Error(
      'WEB_ORIGIN debe ser un origen sin ruta, credenciales o query; HTTPS en producción.',
    );
  return { secret, webOrigin: url.origin, secure: environment.NODE_ENV === 'production' };
}
