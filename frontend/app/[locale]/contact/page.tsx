import type { Metadata } from 'next';
import { type Language } from '@/lib/sanity.queries';
import ContactForm from '@/components/ContactForm';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Ponte en contacto conmigo',
};

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage(props: ContactPageProps) {
  const params = await props.params;
  const locale = params.locale as Language;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* ---- Header ---- */}
        <section className={styles.header}>
          <h1 className={styles.heading}>Hablemos</h1>
          <p className={styles.subheading}>
            ¿Tienes un proyecto en mente? Me encantaría escucharte.
          </p>
        </section>

        {/* ---- Content grid ---- */}
        <div className={styles.grid}>
          {/* Form column */}
          <div className={styles.formColumn}>
            <ContactForm locale={locale} />
          </div>

          {/* Info column */}
          <aside className={styles.infoColumn}>
            <div className={styles.infoCard}>
              <h2 className={styles.infoTitle}>Información de contacto</h2>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Correo</span>
                <a
                  href="mailto:jonatanzch@gmail.com"
                  className={styles.infoLink}
                >
                  jonatanzch@gmail.com
                </a>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>GitHub</span>
                <a
                  href="https://github.com/jonatanzch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.infoLink}
                >
                  github.com/jonatanzch
                </a>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>LinkedIn</span>
                <a
                  href="https://linkedin.com/in/jonatanzch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.infoLink}
                >
                  linkedin.com/in/jonatanzch
                </a>
              </div>

              <p className={styles.availability}>
                <span className={styles.availabilityDot} aria-hidden="true" />
                Disponible para proyectos freelance
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
