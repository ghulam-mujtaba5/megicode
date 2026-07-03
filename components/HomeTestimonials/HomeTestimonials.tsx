'use client';

import React from 'react';
import { HiArrowRight, HiSparkles } from 'react-icons/hi2';

import Image from 'next/image';
import Link from 'next/link';

import { motion } from 'framer-motion';

import { cardIn, fadeUp, stagger, viewportOnce } from '@/lib/motion';

import styles from './HomeTestimonials.module.css';

type Testimonial = {
  quote: string;
  name: string;
  clientType: string;
  outcome: string;
  outcomeHref: string;
  image?: string;
  rating: 5;
};

const testimonials: Testimonial[] = [
  {
    quote:
      'Megicode helped us move from scattered offline operations to a proper digital clinic experience — a professional website, consultation booking, WhatsApp flow, patient records, billing, and staff roles in one system.',
    name: 'Dr. Qandeel Sardar',
    clientType: 'Clinic founder — Aesthetics Place',
    outcome: 'Booking automation',
    outcomeHref: '/services/ai-automation-agents',
    image: '/images/team/dr-qandeel-sardar.webp',
    rating: 5,
  },
  {
    quote:
      'CampusAxis changed my university experience. Past papers, GPA calculator, faculty reviews, timetable, everything I need is in one place and it takes seconds to find.',
    name: 'Student user',
    clientType: 'CampusAxis — university platform',
    outcome: 'SaaS platform',
    outcomeHref: '/services/ai-saas-mvp-development',
    rating: 5,
  },
  {
    quote:
      'Megicode turned our growth system into a conversion-focused website. The site now explains our offer, funnel, automation, proof, pricing, and booking flow in a way cold visitors can understand and act on.',
    name: 'M. Wajahat Ali',
    clientType: 'Agency co-founder — Wajdan Digital Alchemy',
    outcome: 'Conversion website',
    outcomeHref: '/services/custom-web-development',
    image: '/images/team/wajahat-ali.webp',
    rating: 5,
  },
];

const initialsOf = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

function Stars({ rating }: { rating: number }) {
  return (
    <span className={styles.stars} aria-label={`Rated ${rating} out of 5`} role="img">
      {Array.from({ length: rating }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2.5l2.9 6.03 6.6.86-4.85 4.6 1.24 6.51L12 17.35 6.11 20.5l1.24-6.51L2.5 9.39l6.6-.86L12 2.5z" />
        </svg>
      ))}
    </span>
  );
}

export default function HomeTestimonials() {
  return (
    <section className={styles.section} aria-labelledby="home-testimonials-heading">
      <div className={styles.inner}>
        <motion.header
          className={styles.header}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <span className={styles.eyebrow}>
            <HiSparkles size={14} aria-hidden="true" />
            Reviews &amp; outcomes
          </span>
          <h2 id="home-testimonials-heading" className={styles.title}>
            Proof from products, platforms, and business systems we have shipped.
          </h2>
          <p className={styles.subtitle}>
            Megicode is built for founders and teams who need real software outcomes, not vague
            technical promises.
          </p>
        </motion.header>

        <motion.ul
          className={styles.grid}
          variants={stagger()}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {testimonials.map((item) => (
            <motion.li key={item.name} className={styles.card} variants={cardIn}>
              <div className={styles.cardTop}>
                <Link href={item.outcomeHref} className={styles.outcomeChip}>
                  {item.outcome}
                </Link>
                <Stars rating={item.rating} />
              </div>
              <blockquote className={styles.quote}>
                <p>{item.quote}</p>
              </blockquote>
              <div className={styles.attribution}>
                {item.image ? (
                  <Image src={item.image} alt="" width={40} height={40} className={styles.avatar} />
                ) : (
                  <span className={styles.initials} aria-hidden="true">
                    {initialsOf(item.name)}
                  </span>
                )}
                <div className={styles.who}>
                  <span className={styles.name}>{item.name}</span>
                  <span className={styles.clientType}>{item.clientType}</span>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        <div className={styles.ctaRow}>
          <Link href="/reviews" className={styles.cta}>
            Read more reviews
            <HiArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
