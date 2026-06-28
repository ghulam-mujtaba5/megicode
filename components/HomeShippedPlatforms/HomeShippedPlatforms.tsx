'use client';

import React from 'react';
import { HiArrowRight, HiCheckBadge, HiSparkles } from 'react-icons/hi2';

import Image from 'next/image';
import Link from 'next/link';

import { motion } from 'framer-motion';

import { useTheme } from '../../context/ThemeContext';
import commonStyles from './HomeShippedPlatformsCommon.module.css';
import darkStyles from './HomeShippedPlatformsDark.module.css';
import lightStyles from './HomeShippedPlatformsLight.module.css';

const platforms = [
  {
    badge: 'Clinic platform',
    title: 'Website + WhatsApp booking + patient records + billing portal.',
    result: 'Offline clinic operations became a searchable, bookable, managed digital system.',
    href: '/projects/aesthetics-clinic-platform',
    stats: ['7+ services showcased', 'Booking flow', 'Internal portal'],
  },
  {
    badge: 'Student platform',
    title: 'CampusAxis usage proof from Google Analytics, not a portfolio-only claim.',
    result:
      'A student platform with real tracked usage across resources, calculators, reviews, and community workflows.',
    href: '/projects/campusaxis-university-portal',
    stats: ['13K users', '24K views', '72K events'],
    proofImage: {
      src: '/Screenshot (1527).png',
      alt: 'Google Analytics dashboard for CampusAxis showing 13K users, 24K views, 13K active users, and 72K events.',
    },
  },
  {
    badge: 'Growth agency website',
    title: 'Conversion-focused website with funnel narrative, proof, pricing, and booking flow.',
    result: 'A premium website that explains the offer and pushes qualified visitors to book.',
    href: '/projects/wajdan-growth-system-website',
    stats: ['Funnel narrative', 'Proof blocks', 'Audit CTA'],
  },
];

export default function HomeShippedPlatforms() {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  return (
    <section
      className={`${commonStyles.section} ${themeStyles.section}`}
      aria-labelledby="home-platform-proof-heading"
    >
      <div className={commonStyles.inner}>
        <header className={commonStyles.header}>
          <span className={`${commonStyles.eyebrow} ${themeStyles.eyebrow}`}>
            <HiSparkles size={14} aria-hidden="true" />
            Real platforms shipped
          </span>
          <h2
            id="home-platform-proof-heading"
            className={`${commonStyles.title} ${themeStyles.title}`}
          >
            Proof that Megicode can build systems people actually use.
          </h2>
          <p className={`${commonStyles.subtitle} ${themeStyles.subtitle}`}>
            These are the kinds of outcomes buyers need to see before trusting a software partner:
            operational change, active usage, and a clear path to booked leads.
          </p>
        </header>

        <div className={commonStyles.grid}>
          {platforms.map((item, index) => (
            <motion.article
              key={item.badge}
              className={`${commonStyles.card} ${themeStyles.card}`}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
            >
              <span className={`${commonStyles.glow} ${themeStyles.glow}`} aria-hidden="true" />
              <div className={commonStyles.cardTop}>
                <span className={`${commonStyles.badge} ${themeStyles.badge}`}>
                  <HiCheckBadge size={14} aria-hidden="true" />
                  {item.badge}
                </span>
                <span className={`${commonStyles.index} ${themeStyles.index}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className={`${commonStyles.cardTitle} ${themeStyles.cardTitle}`}>{item.title}</h3>
              <p className={`${commonStyles.result} ${themeStyles.result}`}>{item.result}</p>
              {'proofImage' in item && item.proofImage ? (
                <div className={`${commonStyles.proofImageWrap} ${themeStyles.proofImageWrap}`}>
                  <Image
                    src={item.proofImage.src}
                    alt={item.proofImage.alt}
                    width={640}
                    height={292}
                    className={commonStyles.proofImage}
                    sizes="(max-width: 960px) 100vw, 33vw"
                  />
                </div>
              ) : null}
              <div className={commonStyles.stats}>
                {item.stats.map((stat) => (
                  <span key={stat} className={`${commonStyles.stat} ${themeStyles.stat}`}>
                    {stat}
                  </span>
                ))}
              </div>
              <Link href={item.href} className={`${commonStyles.cta} ${themeStyles.cta}`}>
                View case study
                <HiArrowRight size={15} aria-hidden="true" />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
