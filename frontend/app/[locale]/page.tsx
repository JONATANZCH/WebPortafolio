import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import {
  getAbout,
  getBlogPosts,
  type Language,
} from '@/lib/sanity.queries';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import ProjectsGrid from '@/components/ProjectsGrid';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import Link from 'next/link';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home(props: PageProps) {
  const params = await props.params;
  const locale = params.locale as Language;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const [about, blogPosts] = await Promise.all([
    getAbout(locale),
    getBlogPosts(locale),
  ]);

  const recentPosts = blogPosts.slice(0, 3);

  return (
    <>
      <Navigation />

      <main>
        <Hero about={about} />

        <ProjectsGrid locale={locale} />

        <ExperienceTimeline locale={locale} />

        <TestimonialsCarousel locale={locale} />

        {/* Blog preview section */}
        {recentPosts.length > 0 && (
          <section id="blog" className={styles.blogPreview}>
            <div className={styles.blogInner}>
              <div className={styles.blogHeader}>
                <h2 className={styles.blogHeading}>{t('blog.title')}</h2>
                <Link href="/blog" className={styles.blogSeeAll}>
                  {t('blog.see_all')} →
                </Link>
              </div>
              <ul className={styles.blogGrid} role="list">
                {recentPosts.map((post) => (
                  <li key={post._id}>
                    <BlogCard post={post} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
        {/* Contact section */}
        <section id="contacto" className={styles.contactSection}>
          <div className={styles.contactInner}>
            <h2 className={styles.contactHeading}>{t('contact.title')}</h2>
            <p className={styles.contactSubheading}>
              {t('contact.subtitle')}
            </p>
            <ContactForm locale={locale} />
          </div>
        </section>
      </main>

      <Footer about={about} />
    </>
  );
}
