import axios from 'axios';
import type { EmailMessage, EmailProvider } from './email.provider.js';

const formatAddress = (a: { email: string; name?: string }) => (a.name ? `${a.name.replace(/[<>"]/g, '')} <${a.email}>` : a.email);

/**
 * Resend (https://resend.com). With the shared sender `onboarding@resend.dev` it can
 * only deliver to the email of the Resend account owner, which is enough for
 * notifications to yourself. To send to anyone else, verify a domain in Resend.
 */
export class ResendProvider implements EmailProvider {
  readonly name = 'resend';

  constructor(
    private readonly apiKey: string,
    private readonly baseUrl = process.env.RESEND_API_URL ?? 'https://api.resend.com',
  ) {}

  async send(message: EmailMessage): Promise<void> {
    await axios.post(
      `${this.baseUrl}/emails`,
      {
        from: formatAddress(message.from),
        to: [message.to],
        subject: message.subject,
        html: message.html,
        ...(message.replyTo ? { reply_to: formatAddress(message.replyTo) } : {}),
      },
      {
        headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
        timeout: 8_000,
      },
    );
  }
}
