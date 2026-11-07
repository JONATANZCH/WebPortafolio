import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage } from './contact.entity.js';
import { ContactResponseDto, CreateContactDto, Language } from './contact.dto.js';
import { I18nService } from '../i18n/i18n.service.js';
import { createEmailProvider } from '../email/email.factory.js';
import type { EmailProvider } from '../email/email.provider.js';

@Injectable()
export class ContactService implements OnModuleInit {
  private readonly logger = new Logger(ContactService.name);
  private emailProvider!: EmailProvider;

  constructor(
    @InjectRepository(ContactMessage)
    private readonly contactRepository: Repository<ContactMessage>,
    private readonly i18nService: I18nService,
  ) {}

  onModuleInit() {
    const { provider, missing } = createEmailProvider();
    if (!process.env.CONTACT_EMAIL_TO) missing.push('CONTACT_EMAIL_TO');
    if (!process.env.CONTACT_FROM_EMAIL) missing.push('CONTACT_FROM_EMAIL');

    if (missing.length > 0 || !provider) {
      const msg = `Missing required environment variables: ${missing.join(', ')}`;
      this.logger.error(msg);
      throw new Error(msg);
    }

    this.emailProvider = provider;
    this.logger.log(`Email provider: ${provider.name}`);
  }

  /**
   * Persists the message to the database and dispatches a notification email
   * through the configured email provider (Resend or SendGrid).
   */
  async createContact(
    dto: CreateContactDto,
    ip?: string,
    language: Language = 'es',
  ): Promise<ContactResponseDto> {
    this.logger.log(`Contact form submission from IP: ${ip || 'unknown'}, language: ${language}`);
    // 1. Persist to database
    let saved: ContactMessage;
    const dbStart = performance.now();
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
        this.i18nService.getErrorMessage('SAVE_FAILED', language),
      );
    }

    const dbMs = performance.now() - dbStart;

    // 2. Send the email notification (best-effort — do not fail the request if
    //    the email provider is unavailable)
    const emailStart = performance.now();
    let emailStatus: 'sent' | 'failed' = 'sent';
    try {
      await this.sendEmail(saved, language);
    } catch (emailError) {
      emailStatus = 'failed';
      this.logger.warn(
        `Email notification failed for message ${saved.id}`,
        emailError,
      );
      // We intentionally do not rethrow: the record is already saved.
    }

    const round = (n: number) => Math.round(n * 10) / 10;
    return {
      success: true,
      messageId: saved.id,
      trace: {
        dbMs: round(dbMs),
        emailMs: round(performance.now() - emailStart),
        emailStatus,
        provider: this.emailProvider.name,
      },
    };
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  /**
   * Sends a notification email via SendGrid's Mail Send v3 endpoint.
   */
  private async sendEmail(message: ContactMessage, language: Language = 'es'): Promise<void> {
    const html = this.buildEmailHtml(message, language);
    const subjectPrefix = this.i18nService.getEmailMessage('SUBJECT_PREFIX', language);

    await this.emailProvider.send({
      from: { email: process.env.CONTACT_FROM_EMAIL!, name: 'Portfolio Contact Form' },
      to: process.env.CONTACT_EMAIL_TO!,
      replyTo: { email: message.email, name: message.name },
      subject: `${subjectPrefix} ${message.subject}`.replace(/[\r\n]+/g, ' '),
      html,
    });

    this.logger.log(`Email sent for message ${message.id} via ${this.emailProvider.name} (language: ${language})`);
  }

  /**
   * Builds the HTML body of the notification email.
   */
  private buildEmailHtml(message: ContactMessage, language: Language = 'es'): string {
    const locale = language === 'en' ? 'en-US' : 'es-MX';
    const formattedDate = new Intl.DateTimeFormat(locale, {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'America/Mexico_City',
    }).format(message.createdAt);

    // Get email messages in the specified language
    const msg = (key: string) => this.i18nService.getEmailMessage(key, language);
    const headerTitle = msg('HEADER_TITLE');
    const headerSubtitle = msg('HEADER_SUBTITLE');
    const labelName = msg('LABEL_NAME');
    const labelEmail = msg('LABEL_EMAIL');
    const labelSubject = msg('LABEL_SUBJECT');
    const labelDate = msg('LABEL_DATE');
    const labelMessage = msg('LABEL_MESSAGE');
    const footerId = msg('FOOTER_ID');

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
                ${headerTitle}
              </h1>
              <p style="margin: 4px 0 0; font-size: 13px; color: #0a0a0f; opacity: 0.7;">
                ${headerSubtitle}
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
                    <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #6b6b80;">${labelName}</span><br />
                    <span style="font-size: 15px; color: #e8e8f0; margin-top: 4px; display: block;">${this.escapeHtml(message.name)}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #1e1e2e;">
                    <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #6b6b80;">${labelEmail}</span><br />
                    <a href="mailto:${this.escapeHtml(message.email)}" style="font-size: 15px; color: #2dd4bf; margin-top: 4px; display: block; text-decoration: none;">
                      ${this.escapeHtml(message.email)}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #1e1e2e;">
                    <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #6b6b80;">${labelSubject}</span><br />
                    <span style="font-size: 15px; color: #e8e8f0; margin-top: 4px; display: block;">${this.escapeHtml(message.subject)}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #1e1e2e;">
                    <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #6b6b80;">${labelDate}</span><br />
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
                ">${labelMessage}</p>
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
                ${footerId} <code style="color: #c084fc;">${message.id}</code>
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
