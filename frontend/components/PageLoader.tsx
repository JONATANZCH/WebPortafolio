'use client';

import styles from './PageLoader.module.css';

export default function PageLoader() {
  return (
    <div className={styles.loaderContainer} aria-label="Cargando" role="status">
      <div className={styles.loaderWrapper}>
        {/* Animated gradient orb */}
        <div className={styles.orb} />

        {/* Rotating rings */}
        <div className={styles.ring1} />
        <div className={styles.ring2} />

        {/* Center pulse */}
        <div className={styles.pulse} />
      </div>

      <p className={styles.text}>Cargando...</p>
    </div>
  );
}
