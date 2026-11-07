/**
 * Email delivery port. The contact service depends on this interface only, so the
 * provider (Resend, SendGrid, ...) can be swapped with an environment variable and
 * no change to business logic (Strategy + Adapter patterns).
 *
 * Providers must use an HTTPS API: Render's free web services block outbound SMTP
 * ports (25, 465 and 587).
 */
export interface EmailMessage {
  from: { email: string; name?: string };
  to: string;
  replyTo?: { email: string; name?: string };
  subject: string;
  html: string;
}

export interface EmailProvider {
  readonly name: string;
  send(message: EmailMessage): Promise<void>;
}
