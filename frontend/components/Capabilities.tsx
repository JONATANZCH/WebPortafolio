'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './Capabilities.module.css';

interface Item {
  id: string;
  title: string;
  summary: string;
  deliver: string[];
  approach: string[];
  tools: string[];
}

export default function Capabilities() {
  const t = useTranslations('capabilities');
  const items = t.raw('items') as Item[];
  const [index, setIndex] = useState(0);
  const current = items[index];

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      setIndex((i) => (i + 1) % items.length);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setIndex((i) => (i - 1 + items.length) % items.length);
    }
  };

  return (
    <section id="capacidades" className={styles.section} aria-labelledby="cap-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 id="cap-title">{t('title')}</h2>
          <p>{t('subtitle')}</p>
        </header>

        <div className={styles.layout}>
          <div className={styles.tabs} role="tablist" aria-orientation="vertical" onKeyDown={onKeyDown}>
            {items.map((item, i) => (
              <button
                key={item.id}
                role="tab"
                id={`tab-${item.id}`}
                aria-selected={i === index}
                aria-controls={`panel-${item.id}`}
                tabIndex={i === index ? 0 : -1}
                className={`${styles.tab} ${i === index ? styles.tabActive : ''}`}
                onClick={() => setIndex(i)}
              >
                <span className={styles.tabTitle}>{item.title}</span>
                <span className={styles.tabSummary}>{item.summary}</span>
              </button>
            ))}
          </div>

          <div
            key={current.id}
            className={styles.panel}
            role="tabpanel"
            id={`panel-${current.id}`}
            aria-labelledby={`tab-${current.id}`}
          >
            <div className={styles.cols}>
              <div>
                <h3 className={styles.colTitle}>{t('deliver')}</h3>
                <ul className={styles.list}>
                  {current.deliver.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className={styles.colTitle}>{t('approach')}</h3>
                <ul className={styles.list}>
                  {current.approach.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
            <ul className={styles.tools} role="list" aria-label={t('tools')}>
              {current.tools.map((tool) => (
                <li key={tool} className={styles.tool}>
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
