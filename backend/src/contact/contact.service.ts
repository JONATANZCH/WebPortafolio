import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { ContactMessage } from './contact.entity.js';
import { ContactResponseDto, CreateContactDto } from './contact.dto.js';

@Injectable()
export class ContactService implements OnModuleInit {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @InjectRepository(ContactMessage)
    private readonly contactRepository: Repository<ContactMessage>,
  ) {}

  onModuleInit() {
    const missing: string[] = [];
    if (!process.env.SENDGRID_API_KEY) missing.push('SENDGRID_API_KEY');
    if (!process.env.CONTACT_EMAIL_TO) missing.push('CONTACT_EMAIL_TO');
    if (!process.env.CONTACT_FROM_EMAIL) missing.push('CONTACT_FROM_EMAIL');

    if (missing.length > 0) {
      const msg = `Missing required environment variables: ${missing.join(', ')}`;
      this.logger.error(msg);
      throw new Error(msg);
    }
  }

  /**
   * Persists the message to the database and dispatches a notification email
   * via the SendGrid v3 Mail Send API.
   */
  async createContact(dto: CreateContactDto, ip?: string): Promise<ContactResponseDto> {
    this.logger.log(`Contact form submission from IP: ${ip || 'unknown'}, email: ${dto.email}`);
    // 1. Persist to database
    let saved: ContactMessage;
    try {
      const entity = this.contactRepository.create({
        name: dto.name,
        email: dto.email,
        subject: dto.subject,
        message: dto.message,
        read: false,
      });
      saved = await this.contactRepository.save(entity);
    } catch (dbError) {
      this.logger.error('Failed to save contact message to DB', dbError);
      throw new BadRequestException(
        'No se pudo guardar el mensaje. Inténtalo de nuevo.',
      );
    }

    // 2. Send email notification via SendGrid (best-effort — do not fail the
    //    request if the email service is unavailable)
    try {
      await this.sendEmail(saved);
    } catch (emailError) {
      this.logger.warn(
        `Email notification failed for message ${saved.id}`,
        emailError,
      );
      // We intentionally do not rethrow: the record is already saved.
    }

    return {
      success: true,
      messageId: saved.id,
    };
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  /**
   * Sends a notification email via SendGrid's Mail Send v3 endpoint.
   */
  private async sendEmail(message: ContactMessage): Promise<void> {
    const apiKey = process.env.SENDGRID_API_KEY!;
    const toEmail = process.env.CONTACT_EMAIL_TO!;
    const fromEmail = process.env.CONTACT_FROM_EMAIL!;

    const html = this.buildEmailHtml(message);

    await axios.post(
      'https://api.sendgrid.com/v3/mail/send',
      {
        personalizations: [
          {
            to: [{ email: toEmail }],
            subject: `[Portfolio] Nuevo mensaje: ${message.subject}`,
          },
        ],
        from: { email: fromEmail, name: 'Portfolio Contact Form' },
        reply_to: { email: message.email, name: message.name },
        content: [{ type: 'text/html', value: html }],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 8_000,
      },
    );

    this.logger.log(`Email sent for message ${message.id}`);
  }

  /**
   * Builds the HTML body of the notification email.
   */
  private buildEmailHtml(message: ContactMessage): string {
    const formattedDate = new Intl.DateTimeFormat('es-MX', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'America/Mexico_City',
    }).format(message.createdAt);

    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nuevo mensaje de contacto</title>
</head>
<body style="
  margin: 0;
  padding: 0;
  background-color: #0a0a0f;
  font-family: 'Segoe UI', Arial, sans-serif;
  color: #e8e8f0;
">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="
          background-color: #111118;
          border-radius: 12px;
          border: 1px solid #1e1e2e;
          overflow: hidden;
          max-width: 600px;
          width: 100%;
        ">
          <!-- Header -->
          <tr>
            <td style="
              background: linear-gradient(135deg, #c084fc, #f472b6);
              padding: 28px 32px;
            ">
              <h1 style="
                margin: 0;
                font-size: 22px;
                font-weight: 700;
                color: #0a0a0f;
                letter-spacing: -0.02em;
              ">
                Nuevo mensaje de contacto
              </h1>
              <p style="margin: 4px 0 0; font-size: 13px; color: #0a0a0f; opacity: 0.7;">
                Portfolio — jonatanzarate.dev
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <!-- Meta row -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #1e1e2e;">
                    <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #6b6b80;">Nombre</span><br />
                    <span style="font-size: 15px; color: #e8e8f0; margin-top: 4px; display: block;">${this.escapeHtml(message.name)}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #1e1e2e;">
                    <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #6b6b80;">Email</span><br />
                    <a href="mailto:${this.escapeHtml(message.email)}" style="font-size: 15px; color: #2dd4bf; margin-top: 4px; display: block; text-decoration: none;">
                      ${this.escapeHtml(message.email)}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #1e1e2e;">
                    <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #6b6b80;">Asunto</span><br />
                    <span style="font-size: 15px; color: #e8e8f0; margin-top: 4px; display: block;">${this.escapeHtml(message.subject)}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #1e1e2e;">
                    <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #6b6b80;">Fecha</span><br />
                    <span style="font-size: 13px; color: #6b6b80; margin-top: 4px; display: block;">${formattedDate}</span>
                  </td>
                </tr>
              </table>

              <!-- Message body -->
              <div style="
                background-color: #0a0a0f;
                border: 1px solid #1e1e2e;
                border-radius: 8px;
                padding: 20px;
              ">
                <p style="
                  margin: 0 0 8px;
                  font-size: 11px;
                  text-transform: uppercase;
                  letter-spacing: 0.08em;
                  color: #6b6b80;
                ">Mensaje</p>
                <p style="
                  margin: 0;
                  font-size: 15px;
                  line-height: 1.7;
                  color: #e8e8f0;
                  white-space: pre-wrap;
                ">${this.escapeHtml(message.message)}</p>
              </div>

              <!-- ID badge -->
              <p style="
                margin: 24px 0 0;
                font-size: 11px;
                color: #6b6b80;
                text-align: center;
                letter-spacing: 0.04em;
              ">
                ID: <code style="color: #c084fc;">${message.id}</code>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }

  /** Minimal HTML-escape to prevent injection in the email template. */
  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
