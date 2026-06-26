import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPosts, type Language } from '@/lib/sanity.queries';
import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n.config';
import BlogCard from '@/components/BlogCard';
import Navigation from '@/components/Navigation';
import styles from './page.module.css';

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Technical writing and thoughts on software engineering',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function BlogPage(props: BlogPageProps) {
  const params = await props.params;
  const locale = params.locale as Language;
  setRequestLocale(locale);
  const posts = await getBlogPosts(locale);

  return (
    <>
      <Navigation />
      <main className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.backNav}>
          <Link href="/" className={styles.backLink}>← Inicio</Link>
        </nav>
        <header className={styles.header}>
          <h1 className={styles.heading}>Artículos</h1>
          <p className={styles.subheading}>
            Reflexiones técnicas, aprendizajes y pensamientos sobre ingeniería de software.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyText}>
              Aún no hay artículos publicados. ¡Vuelve pronto!
            </p>
          </div>
        ) : (
          <section aria-label="Lista de artículos">
            <ul className={styles.grid} role="list">
              {posts.map((post) => (
                <li key={post._id}>
                  <BlogCard post={post} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
    </>
  );
}
