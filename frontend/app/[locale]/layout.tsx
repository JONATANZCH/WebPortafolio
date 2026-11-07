import type { Metadata } from 'next';
import { Suspense } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n.config';
import '@/app/globals.css';
import PageLoader from '@/components/PageLoader';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: {
    default: 'David Jonatan Zapeta Chavez | Backend, Cloud & IA Engineer',
    template: '%s | David Jonatan Zapeta Chavez',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  description:
    'Ingeniería backend, cloud e IA generativa con más de 5 años de experiencia. Diseño APIs, microservicios, plataformas cloud, seguridad y soluciones de IA en AWS y Azure listas para producción.',
  keywords: [
    'ingeniero backend',
    'ia generativa',
    'rag',
    'devsecops',
    'arquitectura de microservicios',
    'cloud engineer',
    'devops',
    'backend developer',
    'microservicios',
    'aws',
    'azure',
    'terraform',
    'nestjs',
    'node.js',
    'postgresql',
    'kubernetes',
    'docker',
  ],
  authors: [{ name: 'David Jonatan Zapeta Chavez', url: 'https://jonatanzarate.dev' }],
  creator: 'David Jonatan Zapeta Chavez',
  metadataBase: new URL('https://jonatanzarate.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://jonatanzarate.dev',
    siteName: 'David Jonatan Zapeta Chavez',
    title: 'David Jonatan Zapeta Chavez | Backend, Cloud & IA Engineer',
    description:
      'Ingeniería backend, cloud e IA generativa. APIs, microservicios, RAG e infraestructura como código en AWS y Azure.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jonatan Zarate — Desarrollador Full-Stack',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'David Jonatan Zapeta Chavez | Backend, Cloud & IA Engineer',
    description:
      'Cloud & DevOps Engineer. Microservicios, Terraform, AWS/Azure. Desde CDMX.',
    images: ['/og-image.png'],
    creator: '@jonatanzch',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout(props: LocaleLayoutProps) {
  const params = await props.params;
  const { locale } = params;
  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Suspense fallback={<PageLoader />}>
            {props.children}
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
