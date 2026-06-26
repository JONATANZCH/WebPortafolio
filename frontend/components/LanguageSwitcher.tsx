'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  // Remove locale from pathname to get the relative path
  const pathWithoutLocale = pathname.replace(/^\/(es|en)/, '') || '/';

  const toggleLocale = (newLocale: string) => {
    const newPathname = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPathname);
  };

  return (
    <div className={styles.switcher}>
      <button
        onClick={() => toggleLocale('es')}
        className={`${styles.button} ${locale === 'es' ? styles.active : ''}`}
        aria-label="Cambiar a español"
      >
        Español
      </button>
      <span className={styles.divider}>|</span>
      <button
        onClick={() => toggleLocale('en')}
        className={`${styles.button} ${locale === 'en' ? styles.active : ''}`}
        aria-label="Switch to English"
      >
        English
      </button>
    </div>
  );
}
