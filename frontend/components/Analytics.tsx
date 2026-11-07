'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/analytics';

const DEPTHS = [25, 50, 75, 100];
const SECTIONS = ['capacidades', 'proyectos', 'proceso', 'blog', 'contacto'];

/**
 * Measures how far people get on each page (scroll depth) and which home sections
 * they actually reach. Each signal is sent at most once per page view.
 *
 * Opening any page with ?notrack=1 turns analytics off for that browser (your own
 * visits); ?notrack=0 turns it back on.
 */
export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const flag = new URLSearchParams(window.location.search).get('notrack');
      if (flag === '1') window.localStorage.setItem('umami.disabled', '1');
      if (flag === '0') window.localStorage.removeItem('umami.disabled');
    } catch {
      // Storage may be unavailable (private mode): analytics simply keeps its default.
    }
  }, []);

  useEffect(() => {
    const sentDepths = new Set<number>();
    const sentSections = new Set<string>();

    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const pct = ((window.scrollY / total) * 100) | 0;
      for (const d of DEPTHS) {
        if (pct >= d && !sentDepths.has(d)) {
          sentDepths.add(d);
          track(`scroll-${d}`, { path: pathname });
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const id = e.target.id;
          if (e.isIntersecting && !sentSections.has(id)) {
            sentSections.add(id);
            track('section-view', { section: id, path: pathname });
          }
        });
      },
      { threshold: 0.35 },
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
