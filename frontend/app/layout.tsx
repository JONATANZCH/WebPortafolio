import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Jonatan Zarate | Desarrollador Full-Stack',
    template: '%s | Jonatan Zarate',
  },
  description:
    'Desarrollador Full-Stack especializado en TypeScript, React y Node.js. Construyo productos digitales con atención al detalle — APIs escalables e interfaces que los usuarios disfrutan usar.',
  keywords: [
    'desarrollador full-stack',
    'software engineer',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'NestJS',
    'PostgreSQL',
    'portfolio',
    'México',
    'CDMX',
  ],
  authors: [{ name: 'Jonatan Zarate', url: 'https://jonatanzarate.dev' }],
  creator: 'Jonatan Zarate',
  metadataBase: new URL('https://jonatanzarate.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://jonatanzarate.dev',
    siteName: 'Jonatan Zarate',
    title: 'Jonatan Zarate | Desarrollador Full-Stack',
    description:
      'Desarrollador Full-Stack especializado en TypeScript, React y Node.js. Proyectos, artículos y experiencia profesional.',
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
    title: 'Jonatan Zarate | Desarrollador Full-Stack',
    description:
      'Desarrollador Full-Stack — TypeScript, React, Node.js. Hecho desde la CDMX.',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
