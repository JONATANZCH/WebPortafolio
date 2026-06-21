import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';

// ============================================================
// Sanity Client
// ============================================================
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
});

// ============================================================
// Image URL Builder
// ============================================================
const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// ============================================================
// sanityFetch — cache-aware data fetcher
// ============================================================
interface SanityFetchOptions {
  query: string;
  params?: Record<string, unknown>;
  revalidate?: number | false;
  tags?: string[];
}

export async function sanityFetch<T = unknown>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: SanityFetchOptions): Promise<T> {
  const fetchOptions: Record<string, any> = {};

  if (revalidate === false) {
    fetchOptions.cache = 'no-store';
  } else {
    fetchOptions.next = {
      revalidate,
      ...(tags.length > 0 ? { tags } : {}),
    };
  }

  return client.fetch<T>(query, params, fetchOptions);
}
