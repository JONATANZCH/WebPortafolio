'use client';

import { useTranslations } from 'next-intl';
import styles from './MessageTrace.module.css';

export interface ApiTrace {
  receivedMs?: number;
  dbMs?: number;
  emailMs?: number;
  emailStatus?: 'sent' | 'failed';
  provider?: string;
  totalMs?: number;
}

export interface MessageTraceData extends ApiTrace {
  /** Full round trip measured in the browser. */
  roundTripMs: number;
  messageId?: string;
}

interface Step {
  id: string;
  label: string;
  ms: number;
  state: 'ok' | 'warn';
  detail?: string;
}

const fmt = (ms: number) => (ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${Math.round(ms)} ms`);

/**
 * Shows how a message travelled after it was sent. Every number is real: the server
 * measures validation, database and email, and the browser measures the round trip.
 */
export default function MessageTrace({ trace }: { trace: MessageTraceData }) {
  const t = useTranslations('contact.trace');

  const server = trace.totalMs ?? 0;
  const roundTrip = Math.max(trace.roundTripMs, server);
  const network = Math.max(0, roundTrip - server);
  const steps: Step[] = [
    { id: 'network', label: t('network'), ms: network, state: 'ok' },
    { id: 'validation', label: t('validation'), ms: trace.receivedMs ?? 0, state: 'ok' },
    { id: 'database', label: t('database'), ms: trace.dbMs ?? 0, state: 'ok' },
    {
      id: 'email',
      label: t('email'),
      ms: trace.emailMs ?? 0,
      state: trace.emailStatus === 'failed' ? 'warn' : 'ok',
      detail: trace.emailStatus === 'failed' ? t('email_failed') : trace.provider ? `${trace.provider}` : undefined,
    },
  ];
  const max = Math.max(...steps.map((s) => s.ms), 1);
  const cold = network > 3000;

  return (
    <section className={styles.trace} aria-label={t('title')}>
      <h3 className={styles.title}>{t('title')}</h3>
      <ol className={styles.list}>
        {steps.map((s, i) => (
          <li key={s.id} className={styles.row} style={{ animationDelay: `${i * 260}ms` }}>
            <span className={`${styles.mark} ${s.state === 'warn' ? styles.warn : ''}`} aria-hidden="true">
              {s.state === 'warn' ? '!' : '✓'}
            </span>
            <span className={styles.label}>
              {s.label}
              {s.detail && <span className={styles.detail}>{s.detail}</span>}
            </span>
            <span className={styles.bar} aria-hidden="true">
              <span className={styles.fill} style={{ width: `${Math.max(4, (s.ms / max) * 100)}%`, animationDelay: `${i * 260 + 120}ms` }} />
            </span>
            <span className={styles.ms}>{fmt(s.ms)}</span>
          </li>
        ))}
      </ol>
      <p className={styles.total} style={{ animationDelay: `${steps.length * 260}ms` }}>
        <strong>{t('total')}</strong> {fmt(roundTrip)}
        {trace.messageId && <span className={styles.id}> · ID {trace.messageId.slice(0, 8)}</span>}
      </p>
      {trace.emailStatus === 'failed' && <p className={styles.note}>{t('saved')}</p>}
      {cold && <p className={styles.note}>{t('cold')}</p>}
      <p className={styles.footnote}>{t('note')}</p>
    </section>
  );
}
