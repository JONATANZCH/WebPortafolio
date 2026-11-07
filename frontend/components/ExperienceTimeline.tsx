import { getTranslations } from 'next-intl/server';
import { getExperience, getEducation, type Experience, type Education, type Language } from '../lib/sanity.queries';
import styles from './ExperienceTimeline.module.css';

function fmt(dateStr: string | undefined | null, locale: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-MX', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function ExperienceEntry({ entry, locale, present }: { entry: Experience; locale: string; present: string }) {
  const start = fmt(entry.startDate, locale);
  const end = entry.endDate ? fmt(entry.endDate, locale) : present;
  return (
    <li className={styles.item}>
      <div className={styles.when}>
        <span className={styles.dates}>{start} – {end}</span>
        {!entry.endDate && <span className={styles.now} aria-hidden="true" />}
      </div>
      <div className={styles.body}>
        <h3 className={styles.role}>{entry.role}</h3>
        <p className={styles.company}>{entry.company}</p>
        {entry.description && <p className={styles.description}>{entry.description}</p>}
        {entry.skills && entry.skills.length > 0 && (
          <ul className={styles.chips} role="list">
            {entry.skills.map((s) => (
              <li key={s} className={styles.chip}>{s}</li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

function EducationEntry({ entry }: { entry: Education }) {
  return (
    <li className={styles.eduItem}>
      <h3 className={styles.eduTitle}>{[entry.degree, entry.field].filter(Boolean).join(' · ')}</h3>
      <p className={styles.company}>{entry.school}</p>
      {entry.description && <p className={styles.description}>{entry.description}</p>}
    </li>
  );
}

export default async function ExperienceTimeline({ locale = 'es' }: { locale?: string }) {
  const t = await getTranslations({ locale, namespace: 'experience' });
  const [experience, education] = await Promise.all([
    getExperience(locale as Language),
    getEducation(locale as Language),
  ]);

  return (
    <section id="experiencia" className={styles.section} aria-labelledby="exp-title">
      <div className={styles.container}>
        <h2 id="exp-title" className={styles.heading}>{t('title')}</h2>
        {experience.length === 0 ? (
          <p className={styles.empty}>{t('empty')}</p>
        ) : (
          <ol className={styles.timeline}>
            {experience.map((e) => (
              <ExperienceEntry key={e._id} entry={e} locale={locale} present={t('present')} />
            ))}
          </ol>
        )}

        {education.length > 0 && (
          <>
            <h2 className={`${styles.heading} ${styles.headingSecond}`}>{t('education')}</h2>
            <ul className={styles.eduList}>
              {education.map((e) => (
                <EducationEntry key={e._id} entry={e} />
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
