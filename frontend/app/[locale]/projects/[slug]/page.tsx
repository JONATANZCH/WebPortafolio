import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { getProjectBySlug, getProjects, type Language } from '@/lib/sanity.queries';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

const LABELS = {
  es: {
    back: '← Proyectos',
    role: 'Mi rol',
    challenge: 'El reto de negocio',
    decisions: 'Decisiones técnicas',
    business: 'Trabajo con negocio',
    leadership: 'Liderazgo',
    practices: 'Metodología y patrones aplicados',
    results: 'Resultados',
    stack: 'Stack',
    prev: 'Caso anterior',
    next: 'Siguiente caso',
    live: 'Ver proyecto',
  },
  en: {
    back: '← Projects',
    role: 'My role',
    challenge: 'The business challenge',
    decisions: 'Technical decisions',
    business: 'Working with the business',
    leadership: 'Leadership',
    practices: 'Methodology and patterns applied',
    results: 'Results',
    stack: 'Stack',
    prev: 'Previous case',
    next: 'Next case',
    live: 'View project',
  },
} as const;

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const [es, en] = await Promise.all([getProjects('es'), getProjects('en')]);
    return [
      ...es.filter((p) => p.slug).map((p) => ({ locale: 'es', slug: p.slug!.current })),
      ...en.filter((p) => p.slug).map((p) => ({ locale: 'en', slug: p.slug!.current })),
    ];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const project = await getProjectBySlug(slug, locale as Language);
  if (!project) return { title: 'Not found' };
  return {
    title: project.title,
    description: project.caseStudy?.summary ?? project.description,
  };
}

export default async function ProjectCaseStudyPage({ params }: PageProps) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const l = LABELS[(locale as Language) === 'en' ? 'en' : 'es'];

  const [project, allProjects] = await Promise.all([
    getProjectBySlug(slug, locale as Language),
    getProjects(locale as Language),
  ]);
  if (!project) notFound();
  const navProjects = allProjects.filter((p) => p.slug);
  const idx = navProjects.findIndex((p) => p.slug!.current === slug);
  const prev = idx > 0 ? navProjects[idx - 1] : null;
  const next = idx !== -1 && idx < navProjects.length - 1 ? navProjects[idx + 1] : null;
  const cs = project.caseStudy;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.backNav}>
          <Link href={`/${locale}#proyectos`} className={styles.backLink}>
            {l.back}
          </Link>
        </nav>

        <header className={styles.hero}>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.summary}>{cs?.summary ?? project.description}</p>
          <div className={styles.links}>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
                {l.live} ↗
              </a>
            )}
          </div>
        </header>

        {cs?.role && (
          <section className={styles.block}>
            <h2 className={styles.h2}>{l.role}</h2>
            <p>{cs.role}</p>
          </section>
        )}

        {cs?.challenge && (
          <section className={styles.block}>
            <h2 className={styles.h2}>{l.challenge}</h2>
            <p>{cs.challenge}</p>
          </section>
        )}

        {cs?.decisions && cs.decisions.length > 0 && (
          <section className={styles.block}>
            <h2 className={styles.h2}>{l.decisions}</h2>
            <ol className={styles.decisions}>
              {cs.decisions.map((d, i) => (
                <li key={d.title} className={styles.decision}>
                  <span className={styles.num} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className={styles.h3}>{d.title}</h3>
                    <p>{d.body}</p>
                    {d.principles && d.principles.length > 0 && (
                      <ul className={styles.chips} role="list">
                        {d.principles.map((p) => (
                          <li key={p} className={styles.chip}>
                            {p}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {cs?.practices && cs.practices.length > 0 && (
          <section className={styles.block}>
            <h2 className={styles.h2}>{l.practices}</h2>
            <ul className={styles.chips} role="list">
              {cs.practices.map((p) => (
                <li key={p} className={styles.chip}>
                  {p}
                </li>
              ))}
            </ul>
          </section>
        )}

        {cs?.business && (
          <section className={styles.block}>
            <h2 className={styles.h2}>{l.business}</h2>
            <p>{cs.business}</p>
          </section>
        )}

        {cs?.leadership && (
          <section className={styles.block}>
            <h2 className={styles.h2}>{l.leadership}</h2>
            <p>{cs.leadership}</p>
          </section>
        )}

        {cs?.results && cs.results.length > 0 && (
          <section className={styles.block}>
            <h2 className={styles.h2}>{l.results}</h2>
            <ul className={styles.results}>
              {cs.results.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
        )}

        {project.stack && project.stack.length > 0 && (
          <section className={styles.block}>
            <h2 className={styles.h2}>{l.stack}</h2>
            <ul className={styles.chips} role="list">
              {project.stack.map((s) => (
                <li key={s} className={styles.chip}>
                  {s}
                </li>
              ))}
            </ul>
          </section>
        )}

        {(prev || next) && (
          <nav className={styles.caseNav} aria-label="Case studies">
            <div>
              {prev && (
                <Link href={`/${locale}/projects/${prev.slug!.current}`} className={styles.caseNavLink}>
                  <span className={styles.caseNavLabel}>← {l.prev}</span>
                  <span className={styles.caseNavTitle}>{prev.title}</span>
                </Link>
              )}
            </div>
            <div className={styles.caseNavRight}>
              {next && (
                <Link href={`/${locale}/projects/${next.slug!.current}`} className={styles.caseNavLink}>
                  <span className={styles.caseNavLabel}>{l.next} →</span>
                  <span className={styles.caseNavTitle}>{next.title}</span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </main>
  );
}
