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

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const stats = [
    { number: "98%", label: "Client Satisfaction" },
    { number: "50+", label: "Projects Delivered" },
    { number: "5★", label: "Average Rating" }
  ];

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
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.15
            }
          }
        }}
      >
        <motion.h1 
          className={`${commonStyles.heading} ${themeStyles.heading}`}
          variants={fadeInUp}
        >
          <span className={commonStyles.gradientText}>Transforming</span> Ideas into{' '}
          <span className={commonStyles.gradientText}>Intelligent</span> Solutions
        </motion.h1>

        <motion.p 
          className={`${commonStyles.subheading} ${themeStyles.subheading}`}
          variants={fadeInUp}
        >
          We craft scalable, AI-powered software solutions that drive innovation 
          and empower businesses to achieve breakthrough results.
        </motion.p>

        <motion.div 
          className={commonStyles.statsContainer}
          variants={fadeInUp}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.label}
              className={`${commonStyles.statItem} ${themeStyles.statItem}`}
              variants={fadeInUp}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <span className={commonStyles.statNumber}>{stat.number}</span>
              <span className={commonStyles.statLabel}>{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className={commonStyles.ctaContainer}
          variants={fadeInUp}
        >
          <LetsTalkButton />
        </motion.div>
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
