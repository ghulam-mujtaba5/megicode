'use client';

import React from 'react';
import { HiArrowRight, HiBolt, HiCheckBadge, HiSparkles } from 'react-icons/hi2';

import Link from 'next/link';

import { motion } from 'framer-motion';

import { useTheme } from '../../context/ThemeContext';
import commonStyles from './HomeTestimonialsCommon.module.css';
import darkStyles from './HomeTestimonialsDark.module.css';
import lightStyles from './HomeTestimonialsLight.module.css';

const testimonials = [
  {
    type: 'Operations proof',
    quote:
      'Megicode transformed our clinic operations completely. We went from paper files and WhatsApp chaos to a professional website that brings in new patients and an internal system that manages everything.',
    name: 'Dr. Owner',
    company: 'The Aesthetics Place',
    proof: 'Clinic website + internal operations portal',
    outcome: 'Lead flow + staff operations',
    metric: 'From manual chaos to managed workflows',
  },
  {
    type: 'Product adoption',
    quote:
      'CampusAxis changed my university experience. Past papers, GPA calculator, faculty reviews, timetable, everything I need is in one place and it takes seconds to find.',
    name: 'CampusAxis User',
    company: 'University Student Platform',
    proof: 'Google Analytics proof: 13K users / 24K views',
    outcome: 'Student product used daily',
    metric: '72K tracked events',
  },
  {
    type: 'Conversion proof',
    quote:
      'Megicode built us a website that actually sells. It captures our entire system in a way prospects instantly understand, looks premium, and turns ad traffic into booked audits.',
    name: 'Founder',
    company: 'Wajdan Digital Alchemy',
    proof: 'Conversion-focused growth agency site',
    outcome: 'Clear offer + booked audits',
    metric: 'Premium sales narrative',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.56,
      delay: index * 0.08,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export default function HomeTestimonials() {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  return (
    <section
      className={`${commonStyles.section} ${themeStyles.section}`}
      aria-labelledby="home-testimonials-heading"
    >
      <div className={commonStyles.inner}>
        <header className={commonStyles.header}>
          <span className={`${commonStyles.eyebrow} ${themeStyles.eyebrow}`}>
            <HiSparkles size={14} aria-hidden="true" />
            Reviews & outcomes
          </span>
          <h2
            id="home-testimonials-heading"
            className={`${commonStyles.title} ${themeStyles.title}`}
          >
            Proof from products, platforms, and business systems we have shipped.
          </h2>
          <p className={`${commonStyles.subtitle} ${themeStyles.subtitle}`}>
            Megicode is built for founders and teams who need real software outcomes, not vague
            technical promises.
          </p>
        </header>

        <div className={commonStyles.grid}>
          {testimonials.map((item, index) => (
            <motion.article
              key={item.company}
              className={`${commonStyles.card} ${themeStyles.card}`}
              custom={index}
              variants={cardVariants}
              initial="show"
              whileInView="show"
              viewport={{ once: true, margin: '-70px' }}
              whileHover={{ y: -7 }}
            >
              <span
                className={`${commonStyles.cardGlow} ${themeStyles.cardGlow}`}
                aria-hidden="true"
              />
              <div className={commonStyles.cardTop}>
                <span className={`${commonStyles.typePill} ${themeStyles.typePill}`}>
                  <HiCheckBadge size={14} aria-hidden="true" />
                  {item.type}
                </span>
                <div
                  className={`${commonStyles.stars} ${themeStyles.stars}`}
                  aria-label="5 out of 5 stars"
                >
                  ★★★★★
                </div>
              </div>
              <p className={`${commonStyles.quote} ${themeStyles.quote}`}>{item.quote}</p>
              <div className={`${commonStyles.outcomeBox} ${themeStyles.outcomeBox}`}>
                <HiBolt size={16} aria-hidden="true" />
                <span>{item.metric}</span>
              </div>
              <div className={commonStyles.footer}>
                <div>
                  <h3 className={`${commonStyles.name} ${themeStyles.name}`}>{item.name}</h3>
                  <p className={`${commonStyles.company} ${themeStyles.company}`}>{item.company}</p>
                </div>
                <span className={`${commonStyles.proof} ${themeStyles.proof}`}>{item.proof}</span>
                <span className={`${commonStyles.outcome} ${themeStyles.outcome}`}>
                  {item.outcome}
                </span>
              </div>
            </motion.article>
          ))}
        </div>

        <div className={commonStyles.ctaRow}>
          <Link href="/reviews" className={`${commonStyles.cta} ${themeStyles.cta}`}>
            Read more reviews
            <HiArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
