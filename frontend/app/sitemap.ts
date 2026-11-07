import type { MetadataRoute } from 'next';
import { getBlogPosts, getProjects } from '@/lib/sanity.queries';

const BASE = 'https://jonatanzarate.dev';
const LOCALES = ['es', 'en'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    entries.push(
      { url: `${BASE}/${locale}`, changeFrequency: 'weekly', priority: 1 },
      { url: `${BASE}/${locale}/about`, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${BASE}/${locale}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    );

    try {
      const [projects, posts] = await Promise.all([getProjects(locale), getBlogPosts(locale)]);
      for (const p of projects) {
        if (p.slug) entries.push({ url: `${BASE}/${locale}/projects/${p.slug.current}`, changeFrequency: 'monthly', priority: 0.7 });
      }
      for (const post of posts) {
        entries.push({
          url: `${BASE}/${locale}/blog/${post.slug.current}`,
          lastModified: post.publishedAt ?? post._createdAt,
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    } catch {
      // Sanity unreachable at build time: keep the static pages only.
    }
  }

  return entries;
}
