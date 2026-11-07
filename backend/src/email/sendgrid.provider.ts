import axios from 'axios';
import type { EmailMessage, EmailProvider } from './email.provider.js';

/** SendGrid v3 Mail Send. Kept for anyone who still has a paid or trial account. */
export class SendGridProvider implements EmailProvider {
  readonly name = 'sendgrid';

  constructor(private readonly apiKey: string) {}

  async send(message: EmailMessage): Promise<void> {
    await axios.post(
      'https://api.sendgrid.com/v3/mail/send',
      {
        personalizations: [{ to: [{ email: message.to }], subject: message.subject }],
        from: message.from,
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
        content: [{ type: 'text/html', value: message.html }],
      },
      {
        headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
        timeout: 8_000,
      },
    );
  }
}
