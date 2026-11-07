import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getEducation, type Language } from '@/lib/sanity.queries';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const LINKEDIN = 'https://www.linkedin.com/in/jonatanzch-web-developer/';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('title'), description: t('lead') };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'about' });
  const story = t.raw('story') as string[];
  const facts = t.raw('facts') as Array<{ label: string; value: string }>;
  const principles = t.raw('principles') as Array<{ title: string; text: string }>;

  const education = await getEducation(locale as Language);
  const certs = education.filter((e) => /certific|certificate/i.test(`${e.degree ?? ''}`));

  return (
    <>
      <Navigation />
      <main className={styles.page}>
        <div className={styles.container}>
          <Link href={`/${locale}`} className={styles.back}>
            {t('back')}
          </Link>

          <header className={styles.hero}>
            <Image
              src="/david-zapeta.jpg" unoptimized
              alt="David Jonatan Zapeta Chavez"
              width={144}
              height={144}
              className={styles.photo}
              priority
            />
            <div>
              <h1 className={styles.title}>{t('title')}</h1>
              <p className={styles.lead}>{t('lead')}</p>
              {locale === 'es' && (
                <a
                  href="/CV-David-Zapeta.pdf"
                  download="CV David Jonatan Zapeta.pdf"
                  className={styles.cv}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3v12M7 11l5 5 5-5M5 21h14" />
                  </svg>
                  {t('cv_cta')}
                </a>
              )}
            </div>
          </header>

          <dl className={styles.facts}>
            {facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.story}>
            {story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <section aria-labelledby="principles-title" className={styles.block}>
            <h2 id="principles-title">{t('principles_title')}</h2>
            <ul className={styles.principles} role="list">
              {principles.map((p) => (
                <li key={p.title} className={styles.principle}>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <ExperienceTimeline locale={locale} />

        <div className={styles.container}>
          <section aria-labelledby="certs-title" className={styles.block}>
            <h2 id="certs-title">{t('certs_title')}</h2>
            <ul className={styles.certs} role="list">
              {certs.map((c) => (
                <li key={c._id} className={styles.cert}>
                  <h3>{c.degree}</h3>
                  <p>{c.school}</p>
                </li>
              ))}
            </ul>
            <p className={styles.note}>
              {t('linkedin_note')}{' '}
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className={styles.link}>
                {t('linkedin_cta')} ↗
              </a>
            </p>
          </section>

          <section className={styles.cta}>
            <h2>{t('cta_title')}</h2>
            <Link href={`/${locale}#contacto`} className={styles.button}>
              {t('cta')}
            </Link>
          </section>
        </div>
      </main>
      <Footer about={null} />
    </>
  );
}
