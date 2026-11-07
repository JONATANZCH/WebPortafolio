'use client';

import styles from './PageLoader.module.css';

export default function PageLoader() {
  return (
    <div className={styles.loaderContainer} aria-label="Cargando" role="status">
      <div className={styles.loaderWrapper} />
      <p className={styles.text}>Cargando...</p>
    </div>
  );
}
