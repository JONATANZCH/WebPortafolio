'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './ArchitectureDiagram.module.css';

type NodeId =
  | 'client'
  | 'gateway'
  | 'services'
  | 'events'
  | 'data'
  | 'ai'
  | 'platform'
  | 'observability';

const W = 132;
const H = 64;

const NODES: Array<{ id: NodeId; x: number; y: number }> = [
  { id: 'observability', x: 172, y: 24 },
  { id: 'ai', x: 336, y: 24 },
  { id: 'client', x: 8, y: 178 },
  { id: 'gateway', x: 172, y: 178 },
  { id: 'services', x: 336, y: 178 },
  { id: 'data', x: 500, y: 178 },
  { id: 'platform', x: 172, y: 332 },
  { id: 'events', x: 336, y: 332 },
];

const EDGES: Array<{ a: NodeId; b: NodeId; dashed?: boolean }> = [
  { a: 'client', b: 'gateway' },
  { a: 'gateway', b: 'services' },
  { a: 'services', b: 'data' },
  { a: 'services', b: 'ai' },
  { a: 'services', b: 'events' },
  { a: 'events', b: 'data' },
  { a: 'observability', b: 'services', dashed: true },
  { a: 'observability', b: 'ai', dashed: true },
  { a: 'platform', b: 'events', dashed: true },
  { a: 'platform', b: 'gateway', dashed: true },
];

const center = (id: NodeId) => {
  const n = NODES.find((x) => x.id === id)!;
  return { x: n.x + W / 2, y: n.y + H / 2 };
};

export default function ArchitectureDiagram() {
  const t = useTranslations('hero.diagram');
  const [active, setActive] = useState<NodeId>('services');
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    setMotion(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const tools = t.raw(`nodes.${active}.tools`) as string[];
  const y = center('client').y;

  return (
    <figure className={styles.wrap}>
      <figcaption className={styles.caption}>
        <span className={styles.captionTitle}>{t('title')}</span>
        <span className={styles.captionHint}>{t('hint')}</span>
      </figcaption>

      <svg
        viewBox="0 0 640 420"
        className={styles.svg}
        role="group"
        aria-label={t('title')}
      >
        {EDGES.map((e) => {
          const a = center(e.a);
          const b = center(e.b);
          const on = e.a === active || e.b === active;
          return (
            <line
              key={`${e.a}-${e.b}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              className={`${styles.edge} ${e.dashed ? styles.edgeDashed : ''} ${on ? styles.edgeOn : ''}`}
            />
          );
        })}

        {motion && (
          <circle r="4" className={styles.packet}>
            <animateMotion
              dur="4.5s"
              repeatCount="indefinite"
              path={`M ${center('client').x} ${y} L ${center('gateway').x} ${y} L ${center('services').x} ${y} L ${center('data').x} ${y}`}
            />
          </circle>
        )}

        {NODES.map((n) => {
          const on = n.id === active;
          return (
            <g
              key={n.id}
              role="button"
              tabIndex={0}
              aria-pressed={on}
              aria-label={`${t(`nodes.${n.id}.label`)} — ${t(`nodes.${n.id}.sub`)}`}
              className={`${styles.node} ${on ? styles.nodeOn : ''}`}
              onClick={() => setActive(n.id)}
              onMouseEnter={() => setActive(n.id)}
              onFocus={() => setActive(n.id)}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                  ev.preventDefault();
                  setActive(n.id);
                }
              }}
            >
              <rect x={n.x} y={n.y} width={W} height={H} rx="10" className={styles.box} />
              <text x={n.x + 14} y={n.y + 28} className={styles.label}>
                {t(`nodes.${n.id}.label`)}
              </text>
              <text x={n.x + 14} y={n.y + 47} className={styles.sub}>
                {t(`nodes.${n.id}.sub`)}
              </text>
            </g>
          );
        })}
      </svg>

      <div className={styles.panel} aria-live="polite">
        <h3 className={styles.panelTitle}>
          {t(`nodes.${active}.label`)}
          <span className={styles.panelSub}>{t(`nodes.${active}.sub`)}</span>
        </h3>
        <p className={styles.panelText}>{t(`nodes.${active}.text`)}</p>
        <ul className={styles.tools} role="list" aria-label={t('tools')}>
          {tools.map((tool) => (
            <li key={tool} className={styles.tool}>
              {tool}
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
