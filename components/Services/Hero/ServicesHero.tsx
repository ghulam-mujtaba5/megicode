'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import commonStyles from './ServicesHeroCommon.module.css';
import lightStyles from './ServicesHeroLight.module.css';
import darkStyles from './ServicesHeroDark.module.css';

const ServicesHero = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;
  
  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const highlightVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.3,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <section className={`${commonStyles.heroSection} ${themeStyles.heroSection}`}>
      <div className={commonStyles.container}>
        <motion.div 
          className={commonStyles.content}
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          <motion.h1 className={`${commonStyles.title} ${themeStyles.title}`}>
            Transformative Solutions for the{' '}
            <motion.span 
              className={`${commonStyles.highlight} ${themeStyles.highlight}`}
              variants={highlightVariants}
            >
              Digital Age
            </motion.span>
          </motion.h1>
          <p className={`${commonStyles.subtitle} ${themeStyles.subtitle}`}>
            Empowering businesses with cutting-edge AI and advanced technologies,{' '}
            crafting innovative solutions that drive exceptional growth and seamless{' '}
            digital transformation.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesHero;
