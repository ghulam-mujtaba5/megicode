'use client';
import React from 'react';

import { easeOut, motion } from 'framer-motion';

import { useTheme } from '../../../context/ThemeContext';
import commonStyles from './ServicesHeroCommon.module.css';
import darkStyles from './ServicesHeroDark.module.css';
import lightStyles from './ServicesHeroLight.module.css';

const ServicesHero = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const highlightVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 20,
        delay: 0.3,
      },
    },
  };

  const gradientVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: easeOut,
      },
    },
  };

  return (
    <section className={`${commonStyles.heroSection} ${themeStyles.heroSection}`}>
      <motion.div
        className={`${commonStyles.gradientBg} ${themeStyles.gradientBg}`}
        variants={gradientVariants}
        initial="hidden"
        animate="visible"
      />

      <div className={commonStyles.container}>
        <motion.div
          className={commonStyles.content}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className={`${commonStyles.title} ${themeStyles.title}`}
            variants={titleVariants}
          >
            What Megicode builds —{' '}
            <motion.span
              className={`${commonStyles.highlight} ${themeStyles.highlight}`}
              variants={highlightVariants}
            >
              and what each service is for
            </motion.span>
          </motion.h1>

          <motion.p
            className={`${commonStyles.subtitle} ${themeStyles.subtitle}`}
            variants={titleVariants}
          >
            Three core services — AI automation, AI product builds, and custom business platforms —
            plus six supporting capabilities. Pick by the outcome your team needs.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesHero;
