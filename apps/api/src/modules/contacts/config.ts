import { ContactNotifier, ResendTransport, SmtpTransport } from './mail.js';

function mailbox(value: string | undefined, key: string): string {
  if (!value || !/^[^\s@<>]+@[^\s@<>]+$/.test(value))
    throw new Error(`${key} debe ser un buzón válido.`);
  return value;
}
export function loadContactConfig(env: NodeJS.ProcessEnv) {
  const transport = env.MAIL_TRANSPORT ?? 'smtp';
  if (transport !== 'smtp' && transport !== 'resend') throw new Error('MAIL_TRANSPORT inválido.');
  const from = mailbox(env.MAIL_FROM, 'MAIL_FROM');
  const to = mailbox(env.MAIL_TO, 'MAIL_TO');
  const rateLimit = Number(env.CONTACT_RATE_LIMIT ?? '5');
  if (!Number.isSafeInteger(rateLimit) || rateLimit < 1 || rateLimit > 10000)
    throw new Error('CONTACT_RATE_LIMIT inválido.');
  if (transport === 'resend') {
    if (!env.RESEND_API_KEY?.trim()) throw new Error('RESEND_API_KEY requerida.');
    return {
      rateLimit,
      notifier: new ContactNotifier(new ResendTransport(env.RESEND_API_KEY), from, to),
    };
  }
  const port = Number(env.SMTP_PORT ?? '1025');
  if (!Number.isSafeInteger(port) || port < 1 || port > 65535 || !env.SMTP_HOST?.trim())
    throw new Error('Configuración SMTP inválida.');
  return {
    rateLimit,
    notifier: new ContactNotifier(new SmtpTransport(env.SMTP_HOST, port), from, to),
  };
}
