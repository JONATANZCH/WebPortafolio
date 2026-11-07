import type { EmailProvider } from './email.provider.js';
import { ResendProvider } from './resend.provider.js';
import { SendGridProvider } from './sendgrid.provider.js';

/**
 * Picks the email provider from the environment.
 *
 *   EMAIL_PROVIDER=resend | sendgrid   (optional)
 *
 * When EMAIL_PROVIDER is not set, the provider is inferred from whichever API key exists
 * (RESEND_API_KEY first, then SENDGRID_API_KEY).
 */
export function createEmailProvider(env: NodeJS.ProcessEnv = process.env): { provider?: EmailProvider; missing: string[] } {
  const wanted = (env.EMAIL_PROVIDER ?? '').toLowerCase();
  const kind = wanted || (env.RESEND_API_KEY ? 'resend' : env.SENDGRID_API_KEY ? 'sendgrid' : '');

  if (kind === 'resend') {
    return env.RESEND_API_KEY ? { provider: new ResendProvider(env.RESEND_API_KEY), missing: [] } : { missing: ['RESEND_API_KEY'] };
  }
  if (kind === 'sendgrid') {
    return env.SENDGRID_API_KEY ? { provider: new SendGridProvider(env.SENDGRID_API_KEY), missing: [] } : { missing: ['SENDGRID_API_KEY'] };
  }
  if (kind) {
    return { missing: [`EMAIL_PROVIDER (unknown value "${kind}", use resend or sendgrid)`] };
  }
  return { missing: ['RESEND_API_KEY (or SENDGRID_API_KEY)'] };
}
