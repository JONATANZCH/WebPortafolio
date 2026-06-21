import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Jonatan Zarate | Software Engineer',
    template: '%s | Jonatan Zarate',
  },
  description:
    'Full-stack software engineer specializing in modern web applications. Explore my projects, technical writing, and professional experience.',
  keywords: [
    'software engineer',
    'full-stack developer',
    'web development',
    'React',
    'Next.js',
    'TypeScript',
    'portfolio',
  ],
  authors: [{ name: 'Jonatan Zarate', url: 'https://jonatanzarate.dev' }],
  creator: 'Jonatan Zarate',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jonatanzarate.dev',
    siteName: 'Jonatan Zarate',
    title: 'Jonatan Zarate | Software Engineer',
    description:
      'Full-stack software engineer specializing in modern web applications. Explore my projects, technical writing, and professional experience.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jonatan Zarate - Software Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jonatan Zarate | Software Engineer',
    description:
      'Full-stack software engineer specializing in modern web applications.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
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
