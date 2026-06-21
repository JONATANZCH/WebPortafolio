import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { getBlogPostBySlug, getBlogPosts } from '../../../lib/sanity.queries';
import { urlFor } from '../../../lib/sanity';
import styles from './page.module.css';

// ============================================================
// Types
// ============================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ============================================================
// Helpers
// ============================================================

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
}

// ============================================================
// Static generation
// ============================================================

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug.current }));
}

// ============================================================
// Metadata
// ============================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

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
  const { slug } = await params;

  const [post, allPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getBlogPosts(),
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
    : null;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Back link */}
        <nav className={styles.backNav} aria-label="Navegación">
          <Link href="/blog" className={styles.backLink}>
            &larr; Blog
          </Link>
        </nav>

        {/* Article */}
        <article>
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
              {post.author?.name && (
                <span className={styles.author}>{post.author.name}</span>
              )}
              {post.author?.name && <span className={styles.metaDivider} aria-hidden="true">·</span>}
              <time className={styles.date} dateTime={publishedDate}>
                {formatDate(publishedDate)}
              </time>
            </div>
          </header>

          {/* Cover image */}
          {coverImageUrl && (
            <div className={styles.coverImageWrapper}>
              <Image
                src={coverImageUrl}
                alt={`Imagen de portada: ${post.title}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 840px"
                className={styles.coverImage}
              />
            </div>
          )}

          {/* Body */}
          {post.body && post.body.length > 0 && (
            <div className={styles.prose}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <PortableText value={post.body as any} />
            </div>
          )}
        </article>

        {/* Prev / Next navigation */}
        {(prevPost || nextPost) && (
          <nav className={styles.postNav} aria-label="Navegación entre artículos">
            <div className={styles.postNavInner}>
              <div className={styles.postNavPrev}>
                {prevPost && (
                  <Link href={`/blog/${prevPost.slug.current}`} className={styles.postNavLink}>
                    <span className={styles.postNavLabel}>&larr; Anterior</span>
                    <span className={styles.postNavTitle}>{prevPost.title}</span>
                  </Link>
                )}
              </div>
              <div className={styles.postNavNext}>
                {nextPost && (
                  <Link href={`/blog/${nextPost.slug.current}`} className={styles.postNavLink}>
                    <span className={styles.postNavLabel}>Siguiente &rarr;</span>
                    <span className={styles.postNavTitle}>{nextPost.title}</span>
                  </Link>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </main>
  );
}
