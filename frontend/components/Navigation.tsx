import Link from 'next/link';
import styles from './Navigation.module.css';

export default function Navigation() {
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
              proyectos
            </Link>
          </li>
          <li>
            <Link href="/blog" className={styles.link}>
              blog
            </Link>
          </li>
          <li>
            <Link href="/#contacto" className={styles.link}>
              contacto
            </Link>
          </li>
        </ul>

        {/* Status badge */}
        <div className={styles.badge} aria-label="Currently available for work">
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.badgeText}>disponible</span>
        </div>
      </nav>
    </header>
  );
}
