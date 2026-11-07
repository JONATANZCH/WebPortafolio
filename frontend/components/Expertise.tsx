import { getTranslations } from 'next-intl/server';
import styles from './Expertise.module.css';

const KEYS = ['oop', 'nest', 'rag', 'business', 'leadership'] as const;

export default async function Expertise({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'expertise' });

  return (
    <section id="expertise" className={styles.section} aria-labelledby="expertise-heading">
      <div className={styles.inner}>
        <h2 id="expertise-heading" className={styles.heading}>
          {t('title')}
        </h2>
        <p className={styles.sub}>{t('subtitle')}</p>
        <ul className={styles.grid} role="list">
          {KEYS.map((k) => (
            <li key={k} className={styles.card}>
              <h3 className={styles.cardTitle}>{t(`items.${k}.title`)}</h3>
              <p className={styles.cardBody}>{t(`items.${k}.body`)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
