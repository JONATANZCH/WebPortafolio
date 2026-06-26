'use client';

import { useTranslations } from 'next-intl';
import { type About } from '@/lib/sanity.queries';
import styles from './Hero.module.css';

const TECH_STACK = [
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'NestJS',
  'PostgreSQL',
  'TypeORM',
  'Tailwind CSS',
  'Docker',
  'AWS',
  'Git',
  'GraphQL',
  'REST APIs',
  'Sanity CMS',
  'Vercel',
];

const MARQUEE_ITEMS = [...TECH_STACK, ...TECH_STACK];

interface HeroProps {
  about: About | null;
}

export default function Hero({ about }: HeroProps) {
  const t = useTranslations();

  // Parse fullName into first and last name
  const fullNameRaw = about?.fullName || 'David Jonatan';
  const nameParts = fullNameRaw.split(' ');
  const firstName = nameParts[0] || 'David';
  const lastName = nameParts.slice(1).join(' ') || 'Jonatan';

  // Get bio text from the bio array (first paragraph)
  let bioText = 'Cloud & DevOps Engineer with 5+ years of experience designing and scaling high-demand systems.';
  if (about?.bio && Array.isArray(about.bio) && about.bio[0]) {
    const firstBlock = about.bio[0] as any;
    if (firstBlock.children && firstBlock.children[0]) {
      bioText = firstBlock.children[0].text || bioText;
    }
  }

  // Get title (role) - e.g. "Cloud & DevOps Engineer | Backend Specialist" → "Cloud & DevOps Engineer"
  const title = about?.title?.split(' | ')[0]?.trim() || 'Cloud & DevOps Engineer';

  return (
    <section className={styles.hero} aria-label="Hero section">
      {/* Mesh gradient background orbs */}
      <div className={styles.meshWrapper} aria-hidden="true">
        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
        <div className={`${styles.orb} ${styles.orb3}`} />
        <div className={styles.noise} />
      </div>

      {/* Main content */}
      <div className={styles.content}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} aria-hidden="true" />
          <span>{title}</span>
        </div>

        <h1 className={styles.heading}>
          <span className={styles.firstName}>{firstName}</span>
          {' '}
          <span className={styles.lastName}>{lastName}</span>
        </h1>

        <p className={styles.bio}>
          {bioText}
        </p>

        {/* Stack chips */}
        <div className={styles.chips} role="list" aria-label="Primary tech stack">
          {TECH_STACK.slice(0, 6).map((tech) => (
            <span key={tech} className={styles.chip} role="listitem">
              {tech}
            </span>
          ))}
        </div>

        {/* CTA buttons */}
        <div className={styles.actions}>
          <a href="#proyectos" className={styles.btnPrimary}>
            {t('hero.cta_projects')}
          </a>
          <a href="#contacto" className={styles.btnSecondary}>
            {t('hero.cta_contact')}
          </a>
        </div>
      </div>

      {/* Scrolling marquee */}
      <div className={styles.marqueeWrapper} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {MARQUEE_ITEMS.map((tech, i) => (
            <span key={`${tech}-${i}`} className={styles.marqueeItem}>
              <span className={styles.marqueeDot}>▪</span>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
