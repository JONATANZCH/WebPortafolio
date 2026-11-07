'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import styles from './Navigation.module.css';

const SECTIONS = [
  { id: 'capacidades', key: 'capabilities' },
  { id: 'proyectos', key: 'projects' },
  { id: 'experiencia', key: 'experience' },
] as const;

export default function Navigation() {
  const t = useTranslations('common');
  const locale = useLocale();
  const [active, setActive] = useState<string>('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? h.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header className={styles.header}>
      <div
        className={styles.progress}
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />
      <nav className={styles.nav} aria-label="Principal">
        <Link href={`/${locale}`} className={styles.logo} aria-label="David Jonatan Zapeta — inicio">
          <span className={styles.logoMark} aria-hidden="true">dz</span>
          <span className={styles.logoText}>David Zapeta</span>
        </Link>

        <ul className={styles.links} role="list">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <Link
                href={`/${locale}#${s.id}`}
                className={`${styles.link} ${active === s.id ? styles.linkActive : ''}`}
                aria-current={active === s.id ? 'true' : undefined}
              >
                {t(s.key)}
              </Link>
            </li>
          ))}
          <li>
            <Link href={`/${locale}/blog`} className={styles.link}>
              {t('blog')}
            </Link>
          </li>
        </ul>

        <div className={styles.rightSide}>
          <LanguageSwitcher />
          <Link href={`/${locale}#contacto`} className={styles.cta}>
            {t('contact')}
          </Link>
        </div>
      </nav>
    </header>
  );
}
