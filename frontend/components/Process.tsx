'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './Process.module.css';

interface Step {
  title: string;
  text: string;
  practices: string[];
}
interface Method {
  name: string;
  text: string;
  practice: string[];
}
interface Pattern {
  name: string;
  group: string;
  text: string;
}

export default function Process() {
  const t = useTranslations('process');
  const tm = useTranslations('methodology');
  const steps = t.raw('steps') as Step[];
  const methods = tm.raw('methods') as Method[];
  const patterns = tm.raw('patterns') as Pattern[];

  const [stepIndex, setStepIndex] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const step = steps[stepIndex];

  const resolve = (ref: string) => {
    const i = Number(ref.slice(1));
    if (ref[0] === 'm') {
      const m = methods[i];
      return { ref, name: m.name, text: m.text, bullets: m.practice, tag: null as string | null };
    }
    const p = patterns[i];
    return { ref, name: p.name, text: p.text, bullets: [] as string[], tag: tm(`groups.${p.group}`) };
  };
  const items = step.practices.map(resolve);
  const detail = items.find((i) => i.ref === open);

  return (
    <section id="proceso" className={styles.section} aria-labelledby="process-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 id="process-title">{t('title')}</h2>
          <p>{t('subtitle')}</p>
        </header>

        <ol className={styles.steps}>
          {steps.map((s, i) => (
            <li key={s.title}>
              <button
                type="button"
                className={`${styles.step} ${i === stepIndex ? styles.stepOn : ''}`}
                aria-pressed={i === stepIndex}
                data-umami-event="process-step"
                data-umami-event-step={i + 1}
                onClick={() => {
                  setStepIndex(i);
                  setOpen(null);
                }}
              >
                <span className={styles.index} aria-hidden="true">
                  {i + 1}
                </span>
                <span className={styles.stepTitle}>{s.title}</span>
                <span className={styles.stepText}>{s.text}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className={styles.panel} aria-live="polite">
          <p className={styles.panelLabel}>
            {t('practices_label')} <span className={styles.hint}>{t('hint')}</span>
          </p>
          <ul className={styles.chips} role="list">
            {items.map((it) => (
              <li key={it.ref}>
                <button
                  type="button"
                  className={`${styles.chip} ${open === it.ref ? styles.chipOn : ''}`}
                  aria-pressed={open === it.ref}
                  data-umami-event="practice-open"
                  data-umami-event-practice={it.name}
                  onClick={() => setOpen(open === it.ref ? null : it.ref)}
                >
                  {it.name}
                </button>
              </li>
            ))}
          </ul>

          {detail && (
            <div className={styles.detail} key={detail.ref}>
              {detail.tag && <span className={styles.tag}>{detail.tag}</span>}
              <h3 className={styles.detailTitle}>{detail.name}</h3>
              <p className={styles.detailText}>{detail.text}</p>
              {detail.bullets.length > 0 && (
                <>
                  <h4 className={styles.detailSub}>{t('practice')}</h4>
                  <ul className={styles.bullets}>
                    {detail.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
