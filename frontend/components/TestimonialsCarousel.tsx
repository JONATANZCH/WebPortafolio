import { getTestimonials } from '@/lib/sanity.queries';
import TestimonialsCarouselClient from './TestimonialsCarouselClient';
import styles from './TestimonialsCarousel.module.css';

export default async function TestimonialsCarousel() {
  const testimonials = await getTestimonials();

  return (
    <section id="testimonios" aria-label="Testimonials" className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>Comentarios</h2>
        <TestimonialsCarouselClient testimonials={testimonials} />
      </div>
    </section>
  );
}
