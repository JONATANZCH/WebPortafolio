import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import styles from './AboutTeaser.module.css';

export default async function AboutTeaser({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'teaser' });
  const steps = t.raw('steps') as Array<{ year: string; text: string }>;

  return (
    <section className={styles.section} aria-labelledby="teaser-title">
      <div className={styles.inner}>
        <div className={styles.photo}>
          <Image
            src="/david-zapeta.jpg" unoptimized
            alt="David Jonatan Zapeta Chavez"
            width={160}
            height={160}
            className={styles.img}
          />
        </div>
        <div className={styles.copy}>
          <h2 id="teaser-title">{t('title')}</h2>
          <p className={styles.text}>{t('text')}</p>
          <ol className={styles.steps}>
            {steps.map((s) => (
              <li key={s.year} className={styles.step}>
                <span className={styles.year}>{s.year}</span>
                <span>{s.text}</span>
              </li>
            ))}
          </ol>
          <Link href={`/${locale}/about`} className={styles.cta}>
            {t('cta')} →
          </Link>
        </div>
      </div>
    </section>
  );
}
