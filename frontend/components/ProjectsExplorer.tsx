'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Project } from '@/lib/sanity.queries';
import styles from './ProjectsExplorer.module.css';

type Area = 'frontend' | 'backend' | 'cloud' | 'ai';

const AREA_KEYWORDS: Record<Area, string[]> = {
  frontend: ['react', 'next.js', 'vue', 'vite', 'material ui', 'micro-frontends', 'react native'],
  backend: ['nestjs', 'node.js', 'python', 'fastapi', 'postgresql', 'microservicios', 'microservices', 'graphql', 'auth0', 'oauth2'],
  cloud: ['aws', 'azure', 'terraform', 'docker', 'gitlab ci/cd', 'akamai cdn', 'dynatrace', 'contentstack'],
  ai: ['rag', 'langchain', 'embeddings', 'openai'],
};

const AREAS: Area[] = ['frontend', 'backend', 'cloud', 'ai'];

function areasOf(project: Project): Area[] {
  const stack = (project.stack ?? []).map((s) => s.toLowerCase());
  return AREAS.filter((a) => stack.some((s) => AREA_KEYWORDS[a].includes(s)));
}

export default function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const t = useTranslations('projects');
  const [filter, setFilter] = useState<'all' | Area>('all');
  const [tool, setTool] = useState<string | null>(null);

  useEffect(() => {
    const onTool = (e: Event) => {
      const next = (e as CustomEvent<{ tool: string }>).detail?.tool;
      if (next) {
        setTool(next);
        setFilter('all');
      }
    };
    window.addEventListener('portfolio:tool', onTool);
    return () => window.removeEventListener('portfolio:tool', onTool);
  }, []);

  const visible = useMemo(() => {
    const byArea = filter === 'all' ? projects : projects.filter((p) => areasOf(p).includes(filter));
    if (!tool) return byArea;
    const q = tool.toLowerCase();
    return byArea.filter((p) => (p.stack ?? []).some((s) => s.toLowerCase() === q));
  }, [projects, filter, tool]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length };
    AREAS.forEach((a) => (c[a] = projects.filter((p) => areasOf(p).includes(a)).length));
    return c;
  }, [projects]);

  return (
    <section id="proyectos" className={styles.section} aria-labelledby="projects-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 id="projects-title">{t('title')}</h2>
          <p>{t('subtitle')}</p>
        </header>

        <div className={styles.filters} role="group" aria-label={t('filter_label')}>
          {(['all', ...AREAS] as const).map((key) => (
            <button
              key={key}
              type="button"
              className={`${styles.filter} ${filter === key ? styles.filterOn : ''}`}
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
              disabled={counts[key] === 0}
            >
              {t(`filters.${key}`)}
              <span className={styles.count}>{counts[key]}</span>
            </button>
          ))}
        </div>

        {tool && (
          <p className={styles.toolBar}>
            <span>
              {t('tool_filter')}: <strong>{tool}</strong>
            </span>
            <button type="button" className={styles.clear} onClick={() => setTool(null)}>
              {t('clear')} ×
            </button>
          </p>
        )}

        {visible.length === 0 ? (
          <p className={styles.empty}>{tool ? t('empty_tool', { tool }) : t('empty')}</p>
        ) : (
          <ul className={styles.list} role="list">
            {visible.map((p) => {
              const href = p.slug ? `/${p.language}/projects/${p.slug.current}` : undefined;
              const decisions = p.caseStudy?.decisions?.slice(0, 3) ?? [];
              return (
                <li key={p._id} className={styles.card}>
                  <div className={styles.cardMain}>
                    <h3 className={styles.cardTitle}>
                      {href ? <Link href={href}>{p.title}</Link> : p.title}
                    </h3>
                    <p className={styles.cardText}>{p.caseStudy?.summary ?? p.description}</p>

                    {decisions.length > 0 && (
                      <div className={styles.decisions}>
                        <span className={styles.decisionsLabel}>{t('decisions')}</span>
                        <ul>
                          {decisions.map((d) => (
                            <li key={d.title}>{d.title}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className={styles.cardSide}>
                    <ul className={styles.chips} role="list">
                      {(p.stack ?? []).map((s) => (
                        <li key={s}>
                          <button
                            type="button"
                            className={`${styles.chip} ${tool?.toLowerCase() === s.toLowerCase() ? styles.chipOn : ''}`}
                            aria-pressed={tool?.toLowerCase() === s.toLowerCase()}
                            onClick={() => setTool(tool?.toLowerCase() === s.toLowerCase() ? null : s)}
                          >
                            {s}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className={styles.actions}>
                      {href && (
                        <Link href={href} className={styles.primary}>
                          {t('read')}
                        </Link>
                      )}
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.secondary}>
                          {t('visit')} ↗
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
