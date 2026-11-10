'use client';

import { useState } from 'react';
import styles from './Radar.module.css';

interface RadarProps {
  labels: string[];
  current: number[];
  target: number[] | null;
  currentLabel: string;
  targetLabel: string;
  title: string;
}

const W = 460;
const H = 310;
const CX = W / 2;
const CY = 160;
const R = 104;

const angle = (i: number, n: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
const point = (i: number, n: number, v: number) => {
  const a = angle(i, n);
  const r = (Math.max(0, Math.min(100, v)) / 100) * R;
  return [CX + Math.cos(a) * r, CY + Math.sin(a) * r] as const;
};
const pathOf = (values: number[]) =>
  values.map((v, i) => point(i, values.length, v)).map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') + ' Z';

/** Radar de 5 ejes: situación actual (relleno) contra lo recomendado (línea punteada). */
export default function Radar({ labels, current, target, currentLabel, targetLabel, title }: RadarProps) {
  const n = labels.length;
  const [hover, setHover] = useState<number | null>(null);

  return (
    <figure className={styles.figure}>
      <figcaption className={styles.caption}>{title}</figcaption>
      <ul className={styles.legend} aria-hidden="true">
        <li><span className={styles.swCurrent} />{currentLabel}</li>
        {target && <li><span className={styles.swTarget} />{targetLabel}</li>}
      </ul>
      <div className={styles.wrap}>
        <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} role="img" aria-label={title}>
          {[25, 50, 75, 100].map((lvl) => (
            <path key={lvl} d={pathOf(Array(n).fill(lvl))} className={styles.ring} />
          ))}
          {labels.map((_, i) => {
            const [x, y] = point(i, n, 100);
            return <line key={i} x1={CX} y1={CY} x2={x} y2={y} className={styles.axis} />;
          })}
          {target && <path d={pathOf(target)} className={styles.target} />}
          <path d={pathOf(current)} className={styles.current} />
          {current.map((v, i) => {
            const [x, y] = point(i, n, v);
            return <circle key={i} cx={x} cy={y} r={4.5} className={`${styles.dot} ${hover === i ? styles.dotOn : ''}`} />;
          })}
          {labels.map((label, i) => {
            const a = angle(i, n);
            const x = CX + Math.cos(a) * (R + 20);
            const y = CY + Math.sin(a) * (R + 20);
            const anchor = Math.abs(Math.cos(a)) < 0.2 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end';
            return (
              <text key={label} x={x} y={y + (Math.sin(a) > 0.5 ? 10 : Math.sin(a) < -0.5 ? -4 : 4)} textAnchor={anchor} className={`${styles.label} ${hover === i ? styles.labelOn : ''}`}>
                {label}
              </text>
            );
          })}
          {/* Zonas de interacción más grandes que la marca */}
          {labels.map((label, i) => {
            const [x, y] = point(i, n, 72);
            return (
              <circle
                key={`hit-${label}`}
                cx={x}
                cy={y}
                r={30}
                className={styles.hit}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                tabIndex={0}
                aria-label={`${label}: ${currentLabel} ${current[i]}${target ? `, ${targetLabel} ${target[i]}` : ''}`}
              />
            );
          })}
        </svg>
        {hover !== null && (
          <div
            className={styles.tip}
            style={{ left: `${(point(hover, n, 60)[0] / W) * 100}%`, top: `${(point(hover, n, 60)[1] / H) * 100}%` }}
            role="status"
          >
            <strong>{labels[hover]}</strong>
            <span><i className={styles.swCurrent} />{currentLabel}: <b>{current[hover]}</b></span>
            {target && <span><i className={styles.swTarget} />{targetLabel}: <b>{target[hover]}</b></span>}
          </div>
        )}
      </div>
    </figure>
  );
}
