import { getTranslations } from 'next-intl/server';
import styles from './Process.module.css';

export default async function Process({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'process' });
  const steps = t.raw('steps') as Array<{ title: string; text: string }>;

  return (
    <section className={styles.section} aria-labelledby="process-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 id="process-title">{t('title')}</h2>
          <p>{t('subtitle')}</p>
        </header>
        <ol className={styles.steps}>
          {steps.map((s, i) => (
            <li key={s.title} className={styles.step}>
              <span className={styles.index} aria-hidden="true">
                {i + 1}
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
