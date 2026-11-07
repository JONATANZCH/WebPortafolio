/**
 * Anonymous, cookie-less analytics with Umami (https://umami.is).
 * No personal data is ever sent: only event names and small anonymous labels.
 * The website id is public by design (it appears in the script tag of any Umami site).
 */
export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_ID ?? '08f3b46b-10ed-4519-bb56-3edcb86414fe';

/** Only these hosts report. Local development and preview URLs are ignored. */
export const UMAMI_DOMAINS = 'jonatanchz.netlify.app,jonatanzarate.dev,www.jonatanzarate.dev';

declare global {
  interface Window {
    umami?: { track: (name: string, data?: Record<string, string | number | boolean>) => void };
  }
}

/** Sends a custom event. Safe to call anywhere: it does nothing if analytics is not loaded or disabled. */
export function track(name: string, data?: Record<string, string | number | boolean>): void {
  try {
    if (typeof window === 'undefined') return;
    if (window.localStorage.getItem('umami.disabled')) return;
    window.umami?.track(name, data);
  } catch {
    // Analytics must never break the page.
  }
}
