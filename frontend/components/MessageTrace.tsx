'use client';

import { Component, type ReactNode } from 'react';
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
  /** The API may return a numeric or a text id depending on the database column type. */
  messageId?: string | number;
}

interface Step {
  id: string;
  label: string;
  ms: number;
  state: 'ok' | 'warn';
  detail?: string;
}

const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
const fmt = (ms: number) => (ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${Math.round(ms)} ms`);

/**
 * Shows how a message travelled after it was sent. Every number is real: the server
 * measures validation, database and email, and the browser measures the round trip.
 */
export default function MessageTrace({ trace }: { trace: MessageTraceData }) {
  const t = useTranslations('contact.trace');

  const server = num(trace.totalMs);
  const roundTrip = Math.max(num(trace.roundTripMs), server);
  const network = Math.max(0, roundTrip - server);
  const steps: Step[] = [
    { id: 'network', label: t('network'), ms: network, state: 'ok' },
    { id: 'validation', label: t('validation'), ms: num(trace.receivedMs), state: 'ok' },
    { id: 'database', label: t('database'), ms: num(trace.dbMs), state: 'ok' },
    {
      id: 'email',
      label: t('email'),
      ms: num(trace.emailMs),
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
        {(typeof trace.messageId === 'string' || typeof trace.messageId === 'number') && (
          <span className={styles.id}> · ID {String(trace.messageId).slice(0, 8)}</span>
        )}
      </p>
      {trace.emailStatus === 'failed' && <p className={styles.note}>{t('saved')}</p>}
      {cold && <p className={styles.note}>{t('cold')}</p>}
      <p className={styles.footnote}>{t('note')}</p>
    </section>
  );
}

/**
 * The trace is a nicety shown after the message was already sent: if it ever fails to
 * render, it must disappear quietly instead of taking the whole page down.
 */
export class SafeMessageTrace extends Component<{ trace: MessageTraceData }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render(): ReactNode {
    return this.state.failed ? null : <MessageTrace trace={this.props.trace} />;
  }
}
