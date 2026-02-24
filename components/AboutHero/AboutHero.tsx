'use client';
import React from 'react';
import commonStyles from './AboutHeroCommon.module.css';
import lightStyles from './AboutHeroLight.module.css';
import darkStyles from './AboutHeroDark.module.css';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../../utils/animations';

const AboutHero = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;



  return (
    <section className={`${commonStyles.heroContainer} ${themeStyles.heroContainer}`}>
      <div className={commonStyles.backgroundEffect}>
        <div className={commonStyles.gradientOrb1} />
        <div className={commonStyles.gradientOrb2} />
      </div>

      <motion.div 
        className={commonStyles.contentWrapper}
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.h1 
          className={`${commonStyles.heading} ${themeStyles.heading}`}
          variants={fadeInUp}
        >
          Your <span className={commonStyles.gradientText}>AI-Powered</span> Technical{' '}
          <span className={commonStyles.gradientText}>Partner</span>
        </motion.h1>

        <motion.p 
          className={`${commonStyles.subheading} ${themeStyles.subheading}`}
          variants={fadeInUp}
        >
          We build intelligent software for startups, founders, and growing businesses
          — from first MVP to production-ready AI products.
        </motion.p>
      </motion.div>

      <motion.div 
        className={commonStyles.scrollIndicator}
        animate={{ 
          y: [0, 5, 0],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{ 
          y: { duration: 1.5, repeat: Infinity },
          opacity: { duration: 1.5, repeat: Infinity }
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </motion.div>
    </section>
  );
};

export default AboutHero;
