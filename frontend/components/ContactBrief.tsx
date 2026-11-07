'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import ContactForm from './ContactForm';
import type { Language } from '@/lib/sanity.queries';
import styles from './ContactBrief.module.css';

export default function ContactBrief({ locale }: { locale: Language }) {
  const t = useTranslations('contact');
  const topics = t.raw('brief.topics') as string[];
  const stages = t.raw('brief.stages') as string[];
  const times = t.raw('brief.timeframes') as string[];

  const [picked, setPicked] = useState<number[]>([]);
  const [stage, setStage] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);

  const toggle = (i: number) =>
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  const prefill = useMemo(() => {
    if (picked.length === 0) return null;
    const lines = [
      t('brief.intro'),
      '',
      `${t('brief.topics_line')}:`,
      ...picked.map((i) => `- ${topics[i]}`),
    ];
    if (stage !== null) lines.push('', `${t('brief.stage_line')}: ${stages[stage]}`);
    if (time !== null) lines.push(`${t('brief.time_line')}: ${times[time]}`);
    return {
      subject: `${t('brief.subject')}: ${picked.map((i) => topics[i]).join(', ')}`.slice(0, 140),
      message: lines.join('\n'),
    };
  }, [picked, stage, time, t, topics, stages, times]);

  return (
    <div className={styles.wrap}>
      <div className={styles.brief}>
        <fieldset className={styles.group}>
          <legend className={styles.legend}>
            {t('brief.q1')} <span className={styles.hint}>{t('brief.q1_hint')}</span>
          </legend>
          <div className={styles.options}>
            {topics.map((label, i) => (
              <button
                key={label}
                type="button"
                aria-pressed={picked.includes(i)}
                className={`${styles.option} ${picked.includes(i) ? styles.optionOn : ''}`}
                onClick={() => toggle(i)}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.group}>
          <legend className={styles.legend}>{t('brief.q2')}</legend>
          <div className={styles.options}>
            {stages.map((label, i) => (
              <button
                key={label}
                type="button"
                aria-pressed={stage === i}
                className={`${styles.option} ${stage === i ? styles.optionOn : ''}`}
                onClick={() => setStage(stage === i ? null : i)}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.group}>
          <legend className={styles.legend}>{t('brief.q3')}</legend>
          <div className={styles.options}>
            {times.map((label, i) => (
              <button
                key={label}
                type="button"
                aria-pressed={time === i}
                className={`${styles.option} ${time === i ? styles.optionOn : ''}`}
                onClick={() => setTime(time === i ? null : i)}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className={styles.preview} aria-live="polite">
          <span className={styles.previewLabel}>{t('brief.preview')}</span>
          {prefill ? (
            <pre className={styles.previewText}>{prefill.message}</pre>
          ) : (
            <p className={styles.previewEmpty}>{t('brief.empty')}</p>
          )}
        </div>
      </div>

      <div className={styles.formCard}>
        <ContactForm locale={locale} prefill={prefill} />
      </div>
    </div>
  );
}
