import nodemailer from 'nodemailer';
import type { ContactInput } from '@portfolio/contracts';

export interface MailMessage {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
}
export interface MailTransport {
  send(message: MailMessage, signal: AbortSignal): Promise<void>;
}

export class SmtpTransport implements MailTransport {
  constructor(
    private readonly host: string,
    private readonly port: number,
  ) {}
  async send(message: MailMessage, signal: AbortSignal): Promise<void> {
    const client = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      secure: false,
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
    });
    const abort = () => client.close();
    signal.addEventListener('abort', abort, { once: true });
    try {
      signal.throwIfAborted();
      await client.sendMail(message);
    } finally {
      signal.removeEventListener('abort', abort);
      client.close();
    }
  }
}

export class ResendTransport implements MailTransport {
  constructor(
    private readonly apiKey: string,
    private readonly http: typeof fetch = fetch,
  ) {}
  async send(message: MailMessage, signal: AbortSignal): Promise<void> {
    const response = await this.http('https://api.resend.com/emails', {
      method: 'POST',
      signal,
      headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: message.from,
        to: [message.to],
        reply_to: message.replyTo,
        subject: message.subject,
        text: message.text,
      }),
    });
    if (!response.ok) throw new Error('MAIL_PROVIDER_FAILED');
  }
}

export class ContactNotifier {
  constructor(
    private readonly transport: MailTransport,
    private readonly from: string,
    private readonly to: string,
    private readonly timeoutMs = 5000,
  ) {}
  async notify(input: ContactInput): Promise<'SENT' | 'FAILED'> {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      await Promise.race([
        this.transport.send(
          {
            from: this.from,
            to: this.to,
            replyTo: input.email,
            subject: 'Nueva consulta de contacto',
            text: `Nombre: ${input.name}\nCorreo: ${input.email}\nEmpresa: ${input.company ?? ''}\nCategoría: ${input.projectType ?? ''}\nIdioma: ${input.locale}\n\n${input.message}`,
          },
          controller.signal,
        ),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => {
            controller.abort();
            reject(new Error('MAIL_TIMEOUT'));
          }, this.timeoutMs);
        }),
      ]);
      return 'SENT';
    } catch {
      return 'FAILED';
    } finally {
      clearTimeout(timer);
    }
  }
}
