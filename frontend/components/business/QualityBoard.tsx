'use client';

import { useMemo, useState } from 'react';
import { ATTRS, BUCKETS, MAX_MUST, PRESETS, TENSIONS, fill, insightsFor, type Attr, type Bucket, type PresetId } from '@/lib/business/data';
import type { QualityText } from '@/lib/business/types';
import styles from './QualityBoard.module.css';

interface Props { text: QualityText }

const W = 440;
const H = 400;
const CX = W / 2;
const CY = 196;
const R = 150;
const NODE_W = 124;
const NODE_H = 34;

const pos = (i: number) => {
  const a = (Math.PI * 2 * i) / ATTRS.length - Math.PI / 2;
  return { x: CX + Math.cos(a) * R, y: CY + Math.sin(a) * R };
};

const DEFAULT: Record<Attr, Bucket> = Object.fromEntries(ATTRS.map((a) => [a, 'enough'])) as Record<Attr, Bucket>;
const NEXT: Record<Bucket, Bucket> = { enough: 'must', must: 'flex', flex: 'enough' };

type EdgeState = 'conflict' | 'decided' | 'active' | 'idle';

export default function QualityBoard({ text }: Props) {
  const [sel, setSel] = useState<Record<Attr, Bucket>>(DEFAULT);
  const [preset, setPreset] = useState<PresetId | null>(null);
  const [focus, setFocus] = useState<Attr | null>(null);

  const set = (a: Attr, b: Bucket) => { setSel((s) => ({ ...s, [a]: b })); setPreset(null); };
  const mustCount = ATTRS.filter((a) => sel[a] === 'must').length;

  const edges = useMemo(() => TENSIONS.map(([a, b]) => {
    const pa = sel[a];
    const pb = sel[b];
    let state: EdgeState = 'idle';
    if (pa === 'must' && pb === 'must') state = 'conflict';
    else if ((pa === 'must' && pb === 'flex') || (pa === 'flex' && pb === 'must')) state = 'decided';
    else if (pa === 'must' || pb === 'must') state = 'active';
    return { a, b, state, key: `${a}|${b}` };
  }), [sel]);

  const order: Record<EdgeState, number> = { conflict: 0, decided: 1, active: 2, idle: 3 };
  const visible = edges.filter((e) => e.state !== 'idle').sort((x, y) => order[x.state] - order[y.state]);
  const insights = insightsFor(sel);
  const warn = new Set(['tooMany', 'none', 'secFlex', 'availConsConflict', 'costAvailConflict']);

  return (
    <div className={styles.board}>
      <div className={styles.toolbar}>
        <span className={styles.toolbarLabel}>{text.presetsLabel}</span>
        <div className={styles.presets}>
          {(Object.keys(PRESETS) as PresetId[]).map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={preset === p}
              className={`${styles.chip} ${preset === p ? styles.chipOn : ''}`}
              onClick={() => { setSel({ ...PRESETS[p] }); setPreset(p); }}
              data-umami-event="business-quality-preset"
              data-umami-event-preset={p}
            >
              {text.presets[p]}
            </button>
          ))}
          <button type="button" className={styles.reset} onClick={() => { setSel(DEFAULT); setPreset(null); }}>{text.reset}</button>
        </div>
        <span className={`${styles.counter} ${mustCount > MAX_MUST ? styles.counterWarn : ''}`}>
          {fill(text.counter, { n: mustCount, max: MAX_MUST })}
        </span>
      </div>

      {preset && (
        <p className={styles.presetNote} key={preset}>
          <strong>{text.presetWhy}:</strong> {text.presetNotes[preset]}
        </p>
      )}

      <ul className={styles.legend}>
        {BUCKETS.map((b) => (
          <li key={b}>
            <span className={`${styles.sw} ${styles[`sw_${b}`]}`} aria-hidden="true" />
            <strong>{text.buckets[b].label}</strong>
            <span>{text.buckets[b].hint}</span>
          </li>
        ))}
      </ul>

      <div className={styles.grid}>
        <figure className={styles.diagram}>
          <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} role="img" aria-label={text.title}>
            <path
              d={ATTRS.map((_, i) => pos(i)).map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ') + ' Z'}
              className={styles.outline}
            />
            {edges.map((e) => {
              const pa = pos(ATTRS.indexOf(e.a));
              const pb = pos(ATTRS.indexOf(e.b));
              const on = focus === e.a || focus === e.b;
              return (
                <line
                  key={e.key}
                  x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                  className={`${styles.edge} ${styles[`edge_${e.state}`]} ${on ? styles.edgeFocus : ''}`}
                >
                  <title>{`${text.attrs[e.a].name} ↔ ${text.attrs[e.b].name}: ${text.tensions[e.key]}`}</title>
                </line>
              );
            })}
            {ATTRS.map((a, i) => {
              const p = pos(i);
              const b = sel[a];
              return (
                <g
                  key={a}
                  className={`${styles.node} ${styles[`node_${b}`]} ${focus === a ? styles.nodeFocus : ''}`}
                  transform={`translate(${p.x - NODE_W / 2} ${p.y - NODE_H / 2})`}
                  onClick={() => set(a, NEXT[b])}
                  onMouseEnter={() => setFocus(a)}
                  onMouseLeave={() => setFocus(null)}
                  onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); set(a, NEXT[b]); } }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${text.attrs[a].name}: ${text.buckets[b].label}`}
                >
                  <rect width={NODE_W} height={NODE_H} rx={9} />
                  <text x={NODE_W / 2} y={NODE_H / 2 + 4.5} textAnchor="middle">{text.attrs[a].name}</text>
                  {b === 'must' && <circle cx={NODE_W - 2} cy={2} r={5} className={styles.pin} />}
                </g>
              );
            })}
          </svg>
          <figcaption className={styles.hint}>{text.diagramHint}</figcaption>
        </figure>

        <ul className={styles.attrs}>
          {ATTRS.map((a) => (
            <li key={a} className={`${styles.attr} ${focus === a ? styles.attrFocus : ''}`} onMouseEnter={() => setFocus(a)} onMouseLeave={() => setFocus(null)}>
              <div className={styles.attrHead}>
                <span className={styles.attrName}>{text.attrs[a].name}</span>
                <div className={styles.segment} role="group" aria-label={text.attrs[a].name}>
                  {BUCKETS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      aria-pressed={sel[a] === b}
                      className={`${styles.seg} ${sel[a] === b ? styles[`seg_${b}`] : ''}`}
                      onClick={() => set(a, b)}
                    >
                      {text.buckets[b].label}
                    </button>
                  ))}
                </div>
              </div>
              <p className={styles.def}>{text.attrs[a].definition}</p>
              <p className={styles.metric}><span>{text.metricLabel}:</span> {text.attrs[a].metric}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.outcome}>
        <section>
          <h3 className={styles.outTitle}>{text.tensionsTitle}</h3>
          {visible.length === 0 ? (
            <p className={styles.empty}>{text.noTensions}</p>
          ) : (
            <ul className={styles.tensions}>
              {visible.map((e) => (
                <li key={e.key} className={styles[`t_${e.state}`]}>
                  <div className={styles.tHead}>
                    <strong>{text.attrs[e.a].name} ↔ {text.attrs[e.b].name}</strong>
                    {e.state === 'conflict' && <span className={styles.badgeConflict}>⚠ {text.conflict}</span>}
                    {e.state === 'decided' && <span className={styles.badgeDecided}>✓ {text.decided}</span>}
                  </div>
                  <p>{text.tensions[e.key]}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h3 className={styles.outTitle}>{text.insightsTitle}</h3>
          <ul className={styles.insights} aria-live="polite">
            {insights.map((id) => (
              <li key={id} className={warn.has(id) ? styles.insightWarn : ''}>
                <strong>{text.insights[id].title}</strong>
                <p>{text.insights[id].text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
