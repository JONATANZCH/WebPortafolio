'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import CommandPalette from './CommandPalette';
import styles from './Navigation.module.css';

const SECTIONS = [
  { id: 'capacidades', key: 'capabilities' },
  { id: 'proyectos', key: 'projects' },
] as const;

export default function Navigation() {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const isHome = pathname === `/${locale}`;
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

  const toTop = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.progress} style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <nav className={styles.nav} aria-label="Principal">
        <div className={styles.brand}>
          <Link
            href={`/${locale}`}
            onClick={toTop}
            className={styles.logoMark}
            aria-label={isHome ? 'Volver arriba' : t('home_top')}
            title={t('home_top')}
          >
            dz
          </Link>
          <Link href={`/${locale}/about`} className={styles.author} title={t('about_me')}>
            <span className={styles.authorName}>David Zapeta</span>
            <span className={styles.authorHint}>{t('about_me')} →</span>
          </Link>
        </div>

        <ul className={styles.links} role="list">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <Link
                href={`/${locale}#${s.id}`}
                className={`${styles.link} ${isHome && active === s.id ? styles.linkActive : ''}`}
                aria-current={isHome && active === s.id ? 'true' : undefined}
              >
                {t(s.key)}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={`/${locale}/blog`}
              className={`${styles.link} ${pathname.startsWith(`/${locale}/blog`) ? styles.linkActive : ''}`}
            >
              {t('blog')}
            </Link>
          </li>
        </ul>

        <div className={styles.rightSide}>
          <CommandPalette />
          <LanguageSwitcher />
          <Link href={`/${locale}#contacto`} className={styles.cta}>
            {t('contact')}
          </Link>
        </div>
      </nav>
    </header>
  );
}
