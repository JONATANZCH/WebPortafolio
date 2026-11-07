import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { getBlogPostBySlug, getBlogPosts, type Language } from '@/lib/sanity.queries';
import { setRequestLocale } from 'next-intl/server';
import { urlFor } from '@/lib/sanity';
import { coverFor } from '@/lib/blogCover';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AuthorCard from '@/components/AuthorCard';
import styles from './page.module.css';

// ============================================================
// Types
// ============================================================

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

// ============================================================
// Helpers
// ============================================================

function readingMinutes(body: unknown[] | undefined): number {
  const text = (body ?? [])
    .map((b) => {
      const blk = b as { _type?: string; children?: Array<{ text?: string }> };
      return blk._type === 'block' ? (blk.children ?? []).map((c) => c.text ?? '').join('') : '';
    })
    .join(' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(dateString: string, locale: Language): string {
  const localeStr = locale === 'es' ? 'es-MX' : 'en-US';
  return new Intl.DateTimeFormat(localeStr, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
}

// ============================================================
// Static generation
// ============================================================

export const dynamicParams = true; // new Sanity posts render on demand (no rebuild needed)

export async function generateStaticParams() {
  try {
    const postsEs = await getBlogPosts('es');
    const postsEn = await getBlogPosts('en');
    return [
      ...postsEs.map((post) => ({ locale: 'es', slug: post.slug.current })),
      ...postsEn.map((post) => ({ locale: 'en', slug: post.slug.current })),
    ];
  } catch {
    return [];
  }
}

// ============================================================
// Metadata
// ============================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getBlogPostBySlug(slug, locale as Language);

  if (!post) {
    return { title: 'Artículo no encontrado' };
  }

  return {
    title: post.title,
    description: `Artículo de blog: ${post.title}${post.author ? ` por ${post.author.name}` : ''}`,
  };
}

// ============================================================
// Page component
// ============================================================

export default async function BlogPostPage({ params }: PageProps) {
  const { slug, locale } = await params;
  const language = locale as Language;
  setRequestLocale(locale);

  const [post, allPosts] = await Promise.all([
    getBlogPostBySlug(slug, language),
    getBlogPosts(language),
  ]);

  if (!post) {
    notFound();
  }

  // Prev / Next navigation
  // allPosts is ordered desc (newest first), so:
  // prev = newer post (lower index) / next = older post (higher index)
  const currentIndex = allPosts.findIndex((p) => p.slug.current === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex !== -1 && currentIndex < allPosts.length - 1
    ? allPosts[currentIndex + 1]
    : null;

  const publishedDate = post.publishedAt ?? post._createdAt;

  // Cover image URL
  const coverImageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : coverFor(slug);

  return (
    <>
    <Navigation />
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Back link */}
        <nav className={styles.backNav} aria-label={language === 'en' ? 'Navigation' : 'Navegación'}>
          <Link href={`/${locale}/blog`} className={styles.backLink}>
            &larr; Blog
          </Link>
        </nav>

        {/* Article */}
        <article>
          {/* Cover image */}
          {coverImageUrl && (
            <div className={styles.coverImageWrapper}>
              <Image
                src={coverImageUrl}
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 840px"
                className={styles.coverImage}
              />
            </div>
          )}

          {/* Hero */}
          <header className={styles.hero}>
            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <ul className={styles.categories} role="list" aria-label="Categorías">
                {post.categories.map((cat) => (
                  <li key={cat.title} className={styles.categoryPill}>
                    {cat.title}
                  </li>
                ))}
              </ul>
            )}

            <h1 className={styles.title}>{post.title}</h1>

            {/* Meta */}
            <div className={styles.meta}>
              <Link href={`/${locale}/about`} className={styles.bylineLink}>
                <Image src="/david-zapeta.jpg" unoptimized alt="" width={28} height={28} className={styles.bylineAvatar} />
                <span className={styles.author}>David Zapeta</span>
              </Link>
              <span className={styles.metaDivider} aria-hidden="true">·</span>
              <time className={styles.date} dateTime={publishedDate}>
                {formatDate(publishedDate, language)}
              </time>
              <span className={styles.metaDivider} aria-hidden="true">·</span>
              <span>{readingMinutes(post.body)} min {language === 'en' ? 'read' : 'de lectura'}</span>
            </div>
          </header>

          {/* Body */}
          {post.body && post.body.length > 0 && (
            <div className={styles.prose}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <PortableText value={post.body as any} />
            </div>
          )}
        </article>

        <div className={styles.authorBlock}>
          <AuthorCard locale={locale} />
        </div>

        {/* Prev / Next navigation */}
        {(prevPost || nextPost) && (
          <nav className={styles.postNav} aria-label={language === 'en' ? 'Article navigation' : 'Navegación entre artículos'}>
            <div className={styles.postNavInner}>
              <div className={styles.postNavPrev}>
                {prevPost && (
                  <Link href={`/${locale}/blog/${prevPost.slug.current}`} className={styles.postNavLink}>
                    <span className={styles.postNavLabel}>&larr; {language === 'en' ? 'Previous' : 'Anterior'}</span>
                    <span className={styles.postNavTitle}>{prevPost.title}</span>
                  </Link>
                )}
              </div>
              <div className={styles.postNavNext}>
                {nextPost && (
                  <Link href={`/${locale}/blog/${nextPost.slug.current}`} className={styles.postNavLink}>
                    <span className={styles.postNavLabel}>{language === 'en' ? 'Next' : 'Siguiente'} &rarr;</span>
                    <span className={styles.postNavTitle}>{nextPost.title}</span>
                  </Link>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </main>
    <Footer about={null} />
    </>
  );
}
