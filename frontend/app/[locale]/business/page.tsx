import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n.config';
import { getAbout, type Language } from '@/lib/sanity.queries';
import { getBusinessContent } from '@/lib/business';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Diagnostic from '@/components/business/Diagnostic';
import QualityBoard from '@/components/business/QualityBoard';
import ToolGuide from '@/components/business/ToolGuide';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://calendly.com/jonatanzch';
const SECTION_IDS = ['diagnostico', 'atributos', 'guia', 'proceso'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const c = getBusinessContent(locale);
  return { title: c.meta.title, description: c.meta.description };
}

export default async function BusinessPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = getBusinessContent(locale);
  const about = await getAbout(locale as Language).catch(() => null);

  return (
    <>
      <Navigation />
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.inner}>
            <p className={styles.eyebrow}>{c.hero.eyebrow}</p>
            <h1 className={styles.title}>{c.hero.title}</h1>
            <p className={styles.lead}>{c.hero.lead}</p>
            <div className={styles.ctas}>
              <a href="#diagnostico" className={styles.primary} data-umami-event="business-hero-check">{c.hero.primary}</a>
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={styles.secondary} data-umami-event="calendly-click" data-umami-event-from="business-hero">
                {c.hero.secondary} ↗
              </a>
            </div>
            <nav className={styles.jump} aria-label={c.hero.eyebrow}>
              {c.hero.jump.map((label, i) => (
                <a key={label} href={`#${SECTION_IDS[i]}`}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        <section id="diagnostico" className={styles.section} aria-labelledby="diag-title">
          <div className={styles.inner}>
            <div className={styles.head}>
              <p className={styles.eyebrow}>{c.diagnostic.eyebrow}</p>
              <h2 id="diag-title">{c.diagnostic.title}</h2>
              <p>{c.diagnostic.subtitle}</p>
            </div>
            <Diagnostic text={c.diagnostic} calendlyUrl={CALENDLY_URL} />
          </div>
        </section>

        <section id="atributos" className={`${styles.section} ${styles.alt}`} aria-labelledby="quality-title">
          <div className={styles.inner}>
            <div className={styles.head}>
              <p className={styles.eyebrow}>{c.quality.eyebrow}</p>
              <h2 id="quality-title">{c.quality.title}</h2>
              <p>{c.quality.subtitle}</p>
            </div>
            <QualityBoard text={c.quality} />
          </div>
        </section>

        <section id="guia" className={styles.section} aria-labelledby="guide-title">
          <div className={styles.inner}>
            <div className={styles.head}>
              <p className={styles.eyebrow}>{c.guide.eyebrow}</p>
              <h2 id="guide-title">{c.guide.title}</h2>
              <p>{c.guide.subtitle}</p>
            </div>
            <ToolGuide text={c.guide} sizeNames={c.sizeNames} />
          </div>
        </section>

        <section id="proceso" className={`${styles.section} ${styles.alt}`} aria-labelledby="engagement-title">
          <div className={styles.inner}>
            <div className={styles.head}>
              <p className={styles.eyebrow}>{c.engagement.eyebrow}</p>
              <h2 id="engagement-title">{c.engagement.title}</h2>
              <p>{c.engagement.subtitle}</p>
            </div>
            <ol className={styles.steps}>
              {c.engagement.steps.map((s, i) => (
                <li key={s.title}>
                  <span className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={styles.closing} aria-labelledby="closing-title">
          <div className={styles.closingInner}>
            <h2 id="closing-title">{c.closing.title}</h2>
            <p>{c.closing.text}</p>
            <div className={styles.ctas}>
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={styles.primaryLight} data-umami-event="calendly-click" data-umami-event-from="business-closing">
                {c.closing.calendly} ↗
              </a>
              <Link href={`/${locale}#contacto`} className={styles.secondaryLight} data-umami-event="cta-contact" data-umami-event-from="business-closing">
                {c.closing.contact}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer about={about} />
    </>
  );
}
