import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n.config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',
    // Set a cookie to remember the previous locale for all requests that have a locale prefix
    '/(es|en)/:path*',
    // Also match request paths without a trailing slash
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
};
