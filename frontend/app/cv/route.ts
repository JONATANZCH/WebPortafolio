import { readFile } from 'node:fs/promises';
import path from 'node:path';

// The PDF lives in /private (not in /public), so the only way to get it is through
// this route. That lets every download be counted, whatever link it came from.
const CV_PATH = path.join(process.cwd(), 'private', 'CV-David-Zapeta.pdf');

export const dynamic = 'force-dynamic';

/** Keeps the optional ?c= label (who the link was sent to) short and harmless. */
function cleanLabel(value: string | null): string | null {
  if (!value) return null;
  const label = value.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40);
  return label || null;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const campaign = cleanLabel(url.searchParams.get('c'));
  const asAttachment = url.searchParams.get('download') === '1';

  let file: Buffer;
  try {
    file = await readFile(CV_PATH);
  } catch {
    return new Response('CV not available', { status: 404 });
  }

  // One structured line per download: no IP, no personal data. (Alerts will hook in here.)
  console.log(
    JSON.stringify({
      event: 'cv-download',
      at: new Date().toISOString(),
      campaign,
      referrerHost: (() => {
        try {
          const ref = request.headers.get('referer');
          return ref ? new URL(ref).host : null;
        } catch {
          return null;
        }
      })(),
    }),
  );

  return new Response(new Uint8Array(file), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Length': String(file.length),
      'Content-Disposition': `${asAttachment ? 'attachment' : 'inline'}; filename="CV David Jonatan Zapeta.pdf"`,
      // Every request must reach the server to be counted; never cache or index it.
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
