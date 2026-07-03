'use client';

import React, { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import { useInView, useReducedMotion } from 'framer-motion';

import styles from './HomeProof.module.css';

const proofItems = [
  {
    target: 15,
    suffix: '+',
    label: 'AI & software products built',
    note: 'Real product delivery, not demo screens',
  },
  {
    target: 5,
    suffix: '+',
    label: 'countries served',
    note: 'Remote-ready delivery for global clients',
  },
  {
    target: 10,
    suffix: '+',
    label: 'startups & businesses partnered',
    note: 'Founder-friendly software and automation',
  },
];

/** Counts from 0 to `target` once when scrolled into view; static under reduced motion. */
function CountUpValue({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? target : 0);

  useEffect(() => {
    if (!inView) return;
    const duration = reduceMotion ? 0 : 500;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion, target]);

  return (
    <span ref={ref} className={styles.value} aria-label={`${target}${suffix}`}>
      {display}
      {suffix}
    </span>
  );
}

export default function HomeProof() {
  return (
    <section className={styles.section} aria-label="Megicode proof">
      <div className={styles.rail}>
        {proofItems.map(({ target, suffix, label, note }) => (
          <div key={label} className={styles.item}>
            <CountUpValue target={target} suffix={suffix} />
            <span className={styles.label}>{label}</span>
            <span className={styles.note}>{note}</span>
          </div>
        ))}
      </div>
      <div className={styles.evidenceRow}>
        <Link href="/projects" className={styles.evidenceLink}>
          See the work behind these numbers →
        </Link>
      </div>
    </section>
  );
}
