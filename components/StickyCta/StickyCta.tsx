'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import styles from './StickyCta.module.css';

/**
 * Mobile-only conversion bar (docs/PREMIUM-REDESIGN-PLAN.md §6).
 * Slides up once the hero has scrolled out, and yields when the contact
 * section or footer is on screen — never competing with the real form.
 */
export default function StickyCta() {
  const [heroGone, setHeroGone] = useState(false);
  const [endInView, setEndInView] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('welcome-section');
    const endings = [document.getElementById('contact-section'), document.querySelector('footer')];

    const observers: IntersectionObserver[] = [];

    if (hero) {
      const heroObserver = new IntersectionObserver(
        ([entry]) => setHeroGone(!entry.isIntersecting),
        { threshold: 0.05 }
      );
      heroObserver.observe(hero);
      observers.push(heroObserver);
    }

    const visibleEndings = new Set<Element>();
    const endObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visibleEndings.add(entry.target);
          else visibleEndings.delete(entry.target);
        }
        setEndInView(visibleEndings.size > 0);
      },
      { threshold: 0.1 }
    );
    for (const el of endings) {
      if (el) endObserver.observe(el);
    }
    observers.push(endObserver);

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const shown = heroGone && !endInView;

  return (
    <div className={`${styles.bar} ${shown ? styles.shown : ''}`} aria-hidden={!shown}>
      <span className={styles.anchor}>Projects from $400</span>
      <Link href="/contact?source=sticky-cta" className={styles.button} tabIndex={shown ? 0 : -1}>
        Book a free fit call
      </Link>
    </div>
  );
}
