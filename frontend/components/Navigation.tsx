'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import styles from './Navigation.module.css';

export default function Navigation() {
  const t = useTranslations();

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* Logo */}
        <Link href="/" className={styles.logo} aria-label="Jonatan Zarate — home">
          jz.
        </Link>

        {/* Navigation links */}
        <ul className={styles.links} role="list">
          <li>
            <Link href="/#proyectos" className={styles.link}>
              {t('common.projects')}
            </Link>
          </li>
          <li>
            <Link href="/blog" className={styles.link}>
              {t('common.blog')}
            </Link>
          </li>
          <li>
            <Link href="/#contacto" className={styles.link}>
              {t('common.contact')}
            </Link>
          </li>
        </ul>

        {/* Right side: Status badge + Language switcher */}
        <div className={styles.rightSide}>
          {/* Status badge */}
          <div className={styles.badge} aria-label="Currently available for work">
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.badgeText}>{t('common.available')}</span>
          </div>

          {/* Language switcher */}
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}
