'use client';
import React from 'react';
import Image from 'next/image';
import commonStyles from './AboutHeroCommon.module.css';
import lightStyles from './AboutHeroLight.module.css';
import darkStyles from './AboutHeroDark.module.css';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import LetsTalkButton from '../CTA/LetsTalkButton';

const AboutHero = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  const slideUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className={`${commonStyles.heroContainer} ${themeStyles.heroContainer}`}>
      <div className={commonStyles.backgroundEffect}>
        <div className={commonStyles.gradientOrb1}></div>
        <div className={commonStyles.gradientOrb2}></div>
        <div className={commonStyles.gridPattern}></div>
      </div>

      <motion.div 
        className={`${commonStyles.contentWrapper} ${themeStyles.contentWrapper}`}
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2
            }
          }
        }}
      >
        <motion.h1 
          className={`${commonStyles.heading} ${themeStyles.heading}`}
          variants={slideUp}
        >
          <span className={commonStyles.gradientText}>Transforming</span> Ideas into{' '}
          <span className={commonStyles.gradientText}>Intelligent</span> Solutions
        </motion.h1>

        <motion.p 
          className={`${commonStyles.subheading} ${themeStyles.subheading}`}
          variants={slideUp}
        >
          We craft scalable, AI-powered software solutions that drive innovation and empower businesses to achieve breakthrough results.
        </motion.p>

        <motion.div 
          className={commonStyles.statsContainer}
          variants={slideUp}
        >
          <div className={`${commonStyles.statItem} ${themeStyles.statItem}`}>
            <span className={commonStyles.statNumber}>98%</span>
            <span className={commonStyles.statLabel}>Client Satisfaction</span>
          </div>
          <div className={`${commonStyles.statItem} ${themeStyles.statItem}`}>
            <span className={commonStyles.statNumber}>50+</span>
            <span className={commonStyles.statLabel}>Projects Delivered</span>
          </div>
          <div className={`${commonStyles.statItem} ${themeStyles.statItem}`}>
            <span className={commonStyles.statNumber}>5★</span>
            <span className={commonStyles.statLabel}>Average Rating</span>
          </div>
        </motion.div>

        <motion.div 
          className={commonStyles.ctaContainer}
          variants={slideUp}
        >
          <LetsTalkButton />
          <motion.a 
            href="#portfolio"
            className={`${commonStyles.secondaryButton} ${themeStyles.secondaryButton}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View Our Work
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.div 
        className={commonStyles.heroGraphic}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <Image
          src="/images/hero-graphic.svg"
          alt="AI Technology Illustration"
          width={600}
          height={400}
          priority
        />
      </motion.div>

      <div className={commonStyles.scrollIndicator}>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
