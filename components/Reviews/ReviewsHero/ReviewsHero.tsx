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
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
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
            Discover what our clients say about their experience working with Megicode. Real stories
            from real clients who trusted us with their vision.
          </motion.p>
        </div>

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
