'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import styles from './BackToTop.module.css';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 900);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`${styles.btn} ${visible ? styles.show : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={locale === 'en' ? 'Back to top' : 'Volver arriba'}
      tabIndex={visible ? 0 : -1}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
