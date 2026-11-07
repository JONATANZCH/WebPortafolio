'use client';

import { useLocale, useTranslations } from 'next-intl';
import ArchitectureDiagram from './ArchitectureDiagram';
import styles from './Hero.module.css';

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const facts = t.raw('facts') as Array<{ label: string; value: string }>;

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.role}>
            <span className={styles.pulse} aria-hidden="true" />
            {t('role')}
          </p>
          <h1 id="hero-title" className={styles.title}>
            {t('title')}
          </h1>
          <p className={styles.lead}>{t('lead')}</p>

          <div className={styles.actions}>
            <a href={`/${locale}#contacto`} className={styles.btnPrimary}>
              {t('cta_contact')}
            </a>
            <a href={`/${locale}#proyectos`} className={styles.btnGhost}>
              {t('cta_projects')}
            </a>
          </div>

          <dl className={styles.facts}>
            {facts.map((f) => (
              <div key={f.label} className={styles.fact}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={styles.visual}>
          <ArchitectureDiagram />
        </div>
      </div>
    </section>
  );
}
