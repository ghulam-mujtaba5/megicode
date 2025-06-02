'use client';
import React from 'react';
import commonStyles from './AboutHeroCommon.module.css';
import lightStyles from './AboutHeroLight.module.css';
import darkStyles from './AboutHeroDark.module.css';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import LetsTalkButton from '../CTA/LetsTalkButton';

const AboutHero = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;
  return (
    <section className={`${commonStyles.heroContainer} ${themeStyles.heroContainer}`}>
      <div className={`${commonStyles.contentWrapper} ${themeStyles.contentWrapper}`}>
        <motion.h1 
          className={`${commonStyles.heading} ${themeStyles.heading}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Transforming Ideas into Intelligent Solutions
        </motion.h1>
        <motion.p 
          className={`${commonStyles.subheading} ${themeStyles.subheading}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          We build scalable, AI-powered software solutions that empower businesses to grow faster.
        </motion.p>
        <motion.div 
          className={commonStyles.ctaContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <LetsTalkButton />
        </motion.div>
      </div>
      {/* Neural network background animation */}
      <div className={commonStyles.backgroundAnimation}>
        {/* Neural network nodes and connections will be rendered here */}
      </div>
    </section>
  );
};

export default AboutHero;
