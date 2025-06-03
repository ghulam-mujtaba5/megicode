'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import styles from './ServicesHero.module.css';

const ServicesHero = () => {
  const { theme } = useTheme();
  
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

  const statsVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.4,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <section className={`${styles.heroSection} ${theme === 'dark' ? styles.dark : ''}`}>
      <div className={styles.container}>        <motion.div 
          className={styles.content}
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          <motion.h1 className={styles.title}>
            Transformative Solutions for the{' '}
            <motion.span 
              className={styles.highlight}
              variants={highlightVariants}
            >
              Digital Age
            </motion.span>
          </motion.h1>
          <p className={styles.subtitle}>
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
