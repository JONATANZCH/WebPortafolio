'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import type { Testimonial } from '@/lib/sanity.queries';
import { urlFor } from '@/lib/sanity';
import styles from './TestimonialsCarousel.module.css';

interface Props {
  testimonials: Testimonial[];
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className={styles.stars} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>
          {i < rating ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
}

function AuthorAvatar({ testimonial }: { testimonial: Testimonial }) {
  if (testimonial.image) {
    const imageUrl = urlFor(testimonial.image).width(80).height(80).url();
    return (
      <div className={styles.avatarWrapper}>
        <Image
          src={imageUrl}
          alt={testimonial.author}
          width={80}
          height={80}
          className={styles.avatarImage}
        />
      </div>
    );
  }

  const initials = testimonial.author
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={styles.avatarInitials} aria-hidden="true">
      {initials}
    </div>
  );
}

export default function TestimonialsCarouselClient({ testimonials }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const goToIndex = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  useEffect(() => {
    if (isPaused || testimonials.length <= 1) return;
    const timer = setInterval(goToNext, 5000);
    return () => clearInterval(timer);
  }, [isPaused, goToNext, testimonials.length]);

  if (testimonials.length === 0) {
    return (
      <p className={styles.empty}>No hay testimonios disponibles aún.</p>
    );
  }

  const current = testimonials[currentIndex];
  const roleAndCompany =
    current.role && current.company
      ? `${current.role} at ${current.company}`
      : current.role ?? current.company ?? null;

  return (
    <div
      className={styles.carouselRoot}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide area */}
      <div className={styles.slideArea}>
        {/* Prev button */}
        <button
          className={styles.navButton}
          onClick={goToPrev}
          aria-label="Anterior testimonio"
          disabled={testimonials.length <= 1}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Animated slide */}
        <div className={styles.slideContainer} aria-live="polite" aria-atomic="true">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className={styles.slide}
            >
              {/* Quote mark */}
              <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>

              {/* Content */}
              <blockquote className={styles.content}>
                {current.content}
              </blockquote>

              {/* Rating */}
              {typeof current.rating === 'number' && current.rating > 0 && (
                <StarRating rating={current.rating} />
              )}

              {/* Author row */}
              <div className={styles.authorRow}>
                <AuthorAvatar testimonial={current} />
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{current.author}</span>
                  {roleAndCompany && (
                    <span className={styles.authorRole}>{roleAndCompany}</span>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next button */}
        <button
          className={styles.navButton}
          onClick={goToNext}
          aria-label="Siguiente testimonio"
          disabled={testimonials.length <= 1}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M7.5 5L12.5 10L7.5 15"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Dot indicators */}
      {testimonials.length > 1 && (
        <div className={styles.dots} role="tablist" aria-label="Testimonios">
          {testimonials.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`Testimonio ${i + 1}`}
              className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
              onClick={() => goToIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
