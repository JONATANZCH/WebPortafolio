import { getTestimonials, type Language } from '@/lib/sanity.queries';
import TestimonialsCarouselClient from './TestimonialsCarouselClient';
import styles from './TestimonialsCarousel.module.css';

export default async function TestimonialsCarousel({ locale = 'es' }: { locale?: string }) {
  const testimonials = await getTestimonials(locale as Language);
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonios" aria-label="Testimonials" className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>{locale === 'en' ? 'Testimonials' : 'Testimonios'}</h2>
        <TestimonialsCarouselClient testimonials={testimonials} />
      </div>
    </section>
  );
}
