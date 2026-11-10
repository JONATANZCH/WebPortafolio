'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AREAS, QUESTION_AREAS, SIZES, STAGE_THRESHOLDS, TARGETS, fill, type AreaId, type Size } from '@/lib/business/data';
import type { DiagnosticText } from '@/lib/business/types';
import { track } from '@/lib/analytics';
import Radar from './Radar';
import styles from './Diagnostic.module.css';

interface Props {
  text: DiagnosticText;
  calendlyUrl: string;
}

const TOTAL = QUESTION_AREAS.length;

function scoresFrom(answers: (number | null)[]): Record<AreaId, number> {
  const out = {} as Record<AreaId, number>;
  for (const area of AREAS) {
    const vals = answers.filter((a, i) => a !== null && QUESTION_AREAS[i] === area) as number[];
    out[area] = vals.length ? Math.round((vals.reduce((s, v) => s + v, 0) / (vals.length * 3)) * 100) : 0;
  }
  return out;
}

export default function Diagnostic({ text, calendlyUrl }: Props) {
  const [size, setSize] = useState<Size | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(TOTAL).fill(null));
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const scores = useMemo(() => scoresFrom(answers), [answers]);
  const target = size ? TARGETS[size] : null;
  const overall = Math.round(AREAS.reduce((s, a) => s + scores[a], 0) / AREAS.length);
  const stageIndex = STAGE_THRESHOLDS.reduce((acc, min, i) => (overall >= min ? i : acc), 0);

  const priorities = useMemo(() => {
    if (!target) return [];
    return [...AREAS]
      .map((a) => ({ area: a, gap: target[a] - scores[a] }))
      .sort((x, y) => y.gap - x.gap || scores[x.area] - scores[y.area])
      .slice(0, 2);
  }, [scores, target]);

  const pickSize = (s: Size) => {
    setSize(s);
    track('business-diagnostic-start', { size: s });
  };

  const answer = (value: number) => {
    const next = answers.slice();
    next[step] = value;
    setAnswers(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (step < TOTAL - 1) setStep(step + 1);
      else {
        setDone(true);
        const s = scoresFrom(next);
        const avg = Math.round(AREAS.reduce((acc, a) => acc + s[a], 0) / AREAS.length);
        const stage = STAGE_THRESHOLDS.reduce((acc, min, i) => (avg >= min ? i : acc), 0);
        track('business-diagnostic-complete', { size: size ?? 'unknown', stage });
        requestAnimationFrame(() => resultRef.current?.focus());
      }
    }, 260);
  };

  const restart = () => {
    setAnswers(Array(TOTAL).fill(null));
    setStep(0);
    setDone(false);
  };

  const level = (v: number) => (v < 40 ? 'low' : v < 70 ? 'mid' : 'high') as 'low' | 'mid' | 'high';
  const q = text.questions[step];
  const answered = answers.filter((a) => a !== null).length;

  return (
    <div className={styles.grid}>
      <div className={styles.panel}>
        {!size && (
          <div className={styles.sizePick}>
            <h3 className={styles.question}>{text.sizeQuestion}</h3>
            <div className={styles.sizes}>
              {SIZES.map((s) => (
                <button key={s} type="button" className={styles.sizeBtn} onClick={() => pickSize(s)} data-umami-event="business-size" data-umami-event-size={s}>
                  <span className={styles.sizeName}>{text.sizes[s].label}</span>
                  <span className={styles.sizeRange}>{text.sizes[s].range}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {size && !done && (
          <div key={step} className={styles.card}>
            <div className={styles.meta}>
              <span>{fill(text.progress, { n: step + 1, total: TOTAL })}</span>
              <span className={styles.areaTag}>{text.areas[QUESTION_AREAS[step]].name}</span>
            </div>
            <div className={styles.bar} aria-hidden="true"><span style={{ width: `${(answered / TOTAL) * 100}%` }} /></div>
            <h3 className={styles.question} id="diag-q">{q.text}</h3>
            <div className={styles.options} role="group" aria-labelledby="diag-q">
              {q.options.map((opt, i) => (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={answers[step] === i}
                  className={`${styles.option} ${answers[step] === i ? styles.optionOn : ''}`}
                  onClick={() => answer(i)}
                >
                  <span className={styles.optionKey}>{String.fromCharCode(65 + i)}</span>
                  {opt}
                </button>
              ))}
            </div>
            <div className={styles.nav}>
              <button type="button" className={styles.ghost} onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
                {text.back}
              </button>
              <button type="button" className={styles.ghost} onClick={() => { setSize(null); restart(); }}>
                {text.changeSize} · {text.sizes[size].label}
              </button>
            </div>
          </div>
        )}

        {size && done && target && (
          <div className={styles.result} ref={resultRef} tabIndex={-1} aria-live="polite">
            <p className={styles.kicker}>{text.resultTitle} · {text.sizes[size].label}</p>
            <div className={styles.stage}>
              <span className={styles.stageLabel}>{text.stageLabel} {stageIndex + 1}/4</span>
              <h3>{text.stages[stageIndex].title}</h3>
              <p>{text.stages[stageIndex].text}</p>
              <ol className={styles.stageTrack} aria-hidden="true">
                {text.stages.map((s, i) => <li key={s.title} className={i <= stageIndex ? styles.stageOn : ''}>{s.title}</li>)}
              </ol>
            </div>

            <h4 className={styles.subhead}>{text.priorities}</h4>
            <ol className={styles.priorities}>
              {priorities.map(({ area, gap }) => (
                <li key={area}>
                  <div className={styles.prioHead}>
                    <strong>{text.areas[area].name}</strong>
                    <span className={styles.gap}>{gap > 0 ? `${text.gapLabel}: ${gap}` : '✓'}</span>
                  </div>
                  <p>{text.areas[area].advice[level(scores[area])]}</p>
                </li>
              ))}
            </ol>

            <div className={styles.notYet}>
              <h4 className={styles.subhead}>{text.notYetTitle}</h4>
              <p>{text.sizes[size].notYet}</p>
            </div>

            <div className={styles.actions}>
              <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className={styles.primary} data-umami-event="calendly-click" data-umami-event-from="business-diagnostic">
                {text.cta} ↗
              </a>
              <button type="button" className={styles.ghost} onClick={restart}>{text.restart}</button>
            </div>
          </div>
        )}
      </div>

      <aside className={styles.chart}>
        <Radar
          title={text.chartTitle}
          labels={AREAS.map((a) => text.areas[a].name)}
          current={AREAS.map((a) => scores[a])}
          target={target ? AREAS.map((a) => target[a]) : null}
          currentLabel={text.legendCurrent}
          targetLabel={text.legendTarget}
        />
        <p className={styles.hint}>{text.chartHint}</p>
        <table className={styles.table}>
          <caption>{text.scoresTitle}</caption>
          <thead>
            <tr><th scope="col" /><th scope="col">{text.scoreCurrent}</th>{target && <th scope="col">{text.scoreTarget}</th>}</tr>
          </thead>
          <tbody>
            {AREAS.map((a) => (
              <tr key={a}>
                <th scope="row">{text.areas[a].name}</th>
                <td>
                  <span className={styles.meter}><span style={{ width: `${scores[a]}%` }} /></span>
                  {scores[a]}
                </td>
                {target && <td>{target[a]}</td>}
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.note}>{text.note}</p>
      </aside>
    </div>
  );
}
