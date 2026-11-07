import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import styles from './AuthorCard.module.css';

export default async function AuthorCard({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'blog' });

  return (
    <aside className={styles.card} aria-label={t('written_by')}>
      <Image src="/david-zapeta.jpg" alt="David Jonatan Zapeta Chavez" width={72} height={72} className={styles.photo} />
      <div className={styles.text}>
        <span className={styles.label}>{t('written_by')}</span>
        <strong className={styles.name}>David Zapeta</strong>
        <span className={styles.role}>{t('author_role')}</span>
      </div>
      <Link href={`/${locale}/about`} className={styles.cta}>
        {t('author_cta')} →
      </Link>
    </aside>
  );
}
