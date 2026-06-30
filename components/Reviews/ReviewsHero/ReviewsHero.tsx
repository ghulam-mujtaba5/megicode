'use client';
import React from 'react';

import Image from 'next/image';

import { easeOut, motion } from 'framer-motion';

import { useTheme } from '../../../context/ThemeContext';
import commonStyles from './ReviewsHeroCommon.module.css';
import darkStyles from './ReviewsHeroDark.module.css';
import lightStyles from './ReviewsHeroLight.module.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { y: 22, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: easeOut } },
};

const ReviewsHero: React.FC = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  return (
    <motion.section
      className={`${commonStyles.heroContainer} ${themeStyles.heroContainer}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className={commonStyles.heroInner}>
        {/* Text column */}
        <div className={commonStyles.heroContent}>
          <motion.h1
            className={`${commonStyles.title} ${themeStyles.title}`}
            variants={itemVariants}
          >
            Client <span className={themeStyles.highlight}>Reviews</span> &amp; Testimonials
          </motion.h1>

          <motion.p
            className={`${commonStyles.subtitle} ${themeStyles.subtitle}`}
            variants={itemVariants}
          >
            Real outcomes from real clients who trusted Megicode with their vision. Every project
            here is a platform that&apos;s live, used, and proven.
          </motion.p>

          <motion.div className={commonStyles.statsRow} variants={itemVariants}>
            <div className={commonStyles.statItem}>
              <span className={commonStyles.statValue}>5★</span>
              <span className={`${commonStyles.statLabel} ${themeStyles.statLabel}`}>
                Average rating
              </span>
            </div>
            <div className={`${commonStyles.statDivider} ${themeStyles.statDivider}`} />
            <div className={commonStyles.statItem}>
              <span className={commonStyles.statValue}>100%</span>
              <span className={`${commonStyles.statLabel} ${themeStyles.statLabel}`}>
                Satisfaction
              </span>
            </div>
            <div className={`${commonStyles.statDivider} ${themeStyles.statDivider}`} />
            <div className={commonStyles.statItem}>
              <span className={commonStyles.statValue}>3+</span>
              <span className={`${commonStyles.statLabel} ${themeStyles.statLabel}`}>
                Live platforms
              </span>
            </div>
          </motion.div>
        </div>

        {/* Illustration column */}
        <motion.div className={commonStyles.heroVisual} variants={itemVariants} aria-hidden="true">
          <picture>
            <source
              srcSet="/images/assets/reviews-hero@2x.webp 1.5x, /images/assets/reviews-hero.webp 1x"
              type="image/webp"
            />
            <source srcSet="/images/assets/reviews-hero.png" type="image/png" />
            <Image
              src="/images/assets/reviews-hero.webp"
              alt=""
              width={340}
              height={310}
              priority
              className={`${commonStyles.heroImage} ${themeStyles.heroImage}`}
              sizes="(max-width: 900px) 260px, 340px"
            />
          </picture>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ReviewsHero;
