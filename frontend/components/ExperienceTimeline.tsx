import { getExperience, getEducation, Experience, Education } from '../lib/sanity.queries';
import styles from './ExperienceTimeline.module.css';

function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return 'Presente';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-MX', { month: 'short', year: 'numeric' });
}

function formatDateRange(startDate?: string, endDate?: string | null): string {
  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : 'Presente';
  return `${start} — ${end}`;
}

function ExperienceEntry({ entry }: { entry: Experience }) {
  return (
    <div className={styles.timelineItem}>
      <div className={styles.connectorWrapper} aria-hidden="true">
        <div className={styles.dot} />
      </div>
      <div className={styles.card}>
        <p className={styles.role}>{entry.title}</p>
        <p className={styles.organization}>{entry.company}</p>
        {entry.location && (
          <p className={styles.location}>{entry.location}</p>
        )}
        <p className={styles.dates}>
          {formatDateRange(entry.startDate, entry.endDate)}
        </p>
        {entry.description && (
          <p className={styles.description}>{entry.description}</p>
        )}
        {entry.responsibilities && entry.responsibilities.length > 0 && (
          <ul className={styles.responsibilities}>
            {entry.responsibilities.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function EducationEntry({ entry }: { entry: Education }) {
  const degreeField = [entry.degree, entry.field].filter(Boolean).join(' en ');

  return (
    <div className={styles.timelineItem}>
      <div className={styles.connectorWrapper} aria-hidden="true">
        <div className={styles.dot} />
      </div>
      <div className={styles.card}>
        {degreeField && <p className={styles.role}>{degreeField}</p>}
        <p className={styles.organization}>{entry.school}</p>
        <p className={styles.dates}>
          {formatDateRange(entry.startDate, entry.endDate)}
        </p>
        {entry.description && (
          <p className={styles.description}>{entry.description}</p>
        )}
      </div>
    </div>
  );
}

export default async function ExperienceTimeline() {
  const [experience, education] = await Promise.all([
    getExperience(),
    getEducation(),
  ]);

  return (
    <section id="experiencia" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionHeading}>Experiencia</h2>
        <div className={styles.timeline}>
          {experience.map((entry) => (
            <ExperienceEntry key={entry._id} entry={entry} />
          ))}
          {experience.length === 0 && (
            <p className={styles.empty}>No hay experiencia disponible.</p>
          )}
        </div>

        <h2 className={styles.sectionHeading}>Educación</h2>
        <div className={styles.timeline}>
          {education.map((entry) => (
            <EducationEntry key={entry._id} entry={entry} />
          ))}
          {education.length === 0 && (
            <p className={styles.empty}>No hay educación disponible.</p>
          )}
        </div>
      </div>
    </section>
  );
}
