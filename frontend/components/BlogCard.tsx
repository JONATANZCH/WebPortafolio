import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '../lib/sanity.queries';
import { urlFor } from '../lib/sanity';
import styles from './BlogCard.module.css';

// ── Helpers ────────────────────────────────────────────────────

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
}

function getExcerpt(body: unknown[] | undefined): string {
  if (!body || body.length === 0) {
    return 'Lee el artículo completo para saber más sobre este tema.';
  }

  for (const block of body) {
    if (
      block !== null &&
      typeof block === 'object' &&
      '_type' in block &&
      (block as { _type: string })._type === 'block' &&
      'children' in block
    ) {
      const children = (block as { children: unknown[] }).children;
      const text = children
        .filter(
          (child): child is { _type: string; text: string } =>
            child !== null &&
            typeof child === 'object' &&
            '_type' in child &&
            (child as { _type: string })._type === 'span' &&
            'text' in child
        )
        .map((child) => child.text)
        .join('');

      if (text.trim()) {
        return text.length > 120 ? text.slice(0, 120).trimEnd() + '…' : text;
      }
    }
  }

  return 'Lee el artículo completo para saber más sobre este tema.';
}

// ── Sub-components ─────────────────────────────────────────────

function CardImage({ post }: { post: BlogPost }) {
  if (post.mainImage) {
    const imageUrl = urlFor(post.mainImage).width(640).height(360).url();
    return (
      <div className={styles.imageWrapper}>
        <Image
          src={imageUrl}
          alt={`Imagen de portada: ${post.title}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={styles.image}
        />
      </div>
    );
  }

  return <div className={styles.imagePlaceholder} aria-hidden="true" />;
}

function CategoryPills({ categories }: { categories: Array<{ title: string }> }) {
  return (
    <ul className={styles.categories} role="list" aria-label="Categorías">
      {categories.map((cat) => (
        <li key={cat.title} className={styles.categoryPill}>
          {cat.title}
        </li>
      ))}
    </ul>
  );
}

// ── Main Component ─────────────────────────────────────────────

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const date = post.publishedAt ?? post._createdAt;
  const excerpt = getExcerpt(post.body);

  return (
    <article className={styles.card}>
      <Link href={`/blog/${post.slug.current}`} className={styles.imageLink} tabIndex={-1} aria-hidden="true">
        <CardImage post={post} />
      </Link>

      <div className={styles.body}>
        {post.categories && post.categories.length > 0 && (
          <CategoryPills categories={post.categories} />
        )}

        <Link href={`/blog/${post.slug.current}`} className={styles.titleLink}>
          <h2 className={styles.title}>{post.title}</h2>
        </Link>

        <p className={styles.excerpt}>{excerpt}</p>

        <footer className={styles.footer}>
          <time className={styles.date} dateTime={date}>
            {formatDate(date)}
          </time>
          {post.author?.name && (
            <span className={styles.author}>{post.author.name}</span>
          )}
        </footer>
      </div>
    </article>
  );
}
