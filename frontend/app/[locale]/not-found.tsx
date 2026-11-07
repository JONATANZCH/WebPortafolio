'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import styles from './not-found.module.css';

export default function NotFound() {
  const locale = useLocale();
  const es = locale !== 'en';

  return (
    <main className={styles.page}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>{es ? 'No encontramos esa página' : "We couldn't find that page"}</h1>
      <p className={styles.text}>
        {es
          ? 'Puede que el enlace haya cambiado o que la página ya no exista. Estos accesos te devuelven al camino:'
          : 'The link may have changed or the page may no longer exist. These shortcuts get you back on track:'}
      </p>
      <div className={styles.actions}>
        <Link href={`/${locale}`} className={styles.primary}>
          {es ? 'Ir al inicio' : 'Go home'}
        </Link>
        <Link href={`/${locale}/blog`} className={styles.ghost}>
          Blog
        </Link>
        <Link href={`/${locale}#contacto`} className={styles.ghost}>
          {es ? 'Contacto' : 'Contact'}
        </Link>
      </div>
    </main>
  );
}
