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

export default function Hero() {
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
          <span>Full-Stack Developer</span>
        </div>

        <h1 className={styles.heading}>
          <span className={styles.firstName}>Jonatan</span>
          {' '}
          <span className={styles.lastName}>Zarate</span>
        </h1>

        <p className={styles.bio}>
          Construyo productos digitales con atención al detalle — desde APIs escalables
          hasta interfaces que los usuarios disfrutan usar. Especializado en TypeScript,
          React y Node.js con un fuerte enfoque en rendimiento y experiencia de usuario.
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
            Ver proyectos
          </a>
          <a href="#contacto" className={styles.btnSecondary}>
            Contáctame
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
