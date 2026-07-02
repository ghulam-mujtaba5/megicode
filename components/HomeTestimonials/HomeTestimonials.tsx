'use client';

import React from 'react';
import { HiArrowRight, HiSparkles } from 'react-icons/hi2';

import Link from 'next/link';

import { useTheme } from '../../context/ThemeContext';
import ReviewCard from '../Reviews/ReviewCard/ReviewCard';
import commonStyles from './HomeTestimonialsCommon.module.css';
import darkStyles from './HomeTestimonialsDark.module.css';
import lightStyles from './HomeTestimonialsLight.module.css';

const testimonials = [
  {
    tagline: 'Operations proof',
    icon: '/images/logos/aesthetics-place-logo.jpg',
    review:
      'Megicode transformed our clinic operations completely. We went from paper files and WhatsApp chaos to a professional website that brings in new patients and an internal system that manages everything.',
    name: 'Clinic Owner',
    company: 'The Aesthetics Place',
    rating: 5 as const,
  },
  {
    tagline: 'Product adoption',
    icon: '/images/logos/campusaxis-review-logo.webp',
    review:
      'CampusAxis changed my university experience. Past papers, GPA calculator, faculty reviews, timetable, everything I need is in one place and it takes seconds to find.',
    name: 'Student User',
    company: 'CampusAxis — University Platform',
    rating: 5 as const,
  },
  {
    tagline: 'Conversion proof',
    icon: '/images/logos/wajdan-logo-light.png',
    iconDark: '/images/logos/wajdan-logo-dark.png',
    review:
      'Megicode built us a website that actually sells. It captures our entire system in a way prospects instantly understand, looks premium, and turns ad traffic into booked audits.',
    name: 'Founder',
    company: 'Wajdan Digital Alchemy',
    rating: 5 as const,
  },
];

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
          {testimonials.map((item) => (
            <ReviewCard key={item.company} {...item} />
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
