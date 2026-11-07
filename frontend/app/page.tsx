import Link from 'next/link';

export default function RootPage() {
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0; url=/es/" />
      </head>
      <body>
        <p>Redirecting to <Link href="/es/">Spanish</Link> / <Link href="/en/">English</Link></p>
      </body>
    </html>
  );
}
