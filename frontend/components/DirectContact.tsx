import { getTranslations } from 'next-intl/server';
import CopyEmail from './CopyEmail';
import styles from './DirectContact.module.css';

const EMAIL = 'jonatanzch@gmail.com';
// Override with NEXT_PUBLIC_CALENDLY_URL (Netlify env var), e.g. the link of a specific 30-minute event.
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://calendly.com/jonatanzch';

export default async function DirectContact({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'contact.direct' });

  return (
    <aside className={styles.box} aria-label={t('title')}>
      <h3 className={styles.title}>{t('title')}</h3>
      <div className={styles.row}>
        {CALENDLY_URL && (
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={styles.primary} data-umami-event="calendly-click">
            {t('calendly')} ↗
          </a>
        )}
        <p className={styles.mail}>
          {t('email')}{' '}
          <a href={`mailto:${EMAIL}`} className={styles.link} data-umami-event="email-click">
            {EMAIL}
          </a>{' '}
          <CopyEmail email={EMAIL} />
        </p>
      </div>
      <p className={styles.hint}>{t('hint')}</p>
    </aside>
  );
}
