'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import styles from './ReviewsHero.module.css';

const ReviewsHero = () => {
  const { theme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className={`${styles.heroSection} ${theme === 'dark' ? styles.dark : ''}`}>
      <motion.div 
        className={styles.content}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className={styles.title}
          variants={itemVariants}
        >
          Client Success Stories
        </motion.h1>
        <motion.p 
          className={styles.subtitle}
          variants={itemVariants}
        >
          Discover how Megicode has helped businesses transform their digital presence and achieve remarkable growth through innovative solutions.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default ReviewsHero;
