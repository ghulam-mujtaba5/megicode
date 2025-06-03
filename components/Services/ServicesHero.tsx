'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import styles from './ServicesHero.module.css';

const ServicesHero = () => {
  const { theme } = useTheme();
  
  return (
    <section className={`${styles.heroSection} ${theme === 'dark' ? styles.dark : ''}`}>
      <div className={styles.container}>
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={styles.title}>
            Transformative Solutions for the 
            <span className={styles.highlight}> Digital Age</span>
          </h1>
          <p className={styles.subtitle}>
            Leveraging cutting-edge AI and advanced technologies to deliver innovative solutions 
            that drive business growth and digital transformation.
          </p>
        </motion.div>
        
        <motion.div 
          className={styles.statsGrid}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.statItem}>
            <h3>10+</h3>
            <p>Technology Stacks</p>
          </div>
          <div className={styles.statItem}>
            <h3>50+</h3>
            <p>Projects Delivered</p>
          </div>
          <div className={styles.statItem}>
            <h3>99%</h3>
            <p>Client Satisfaction</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesHero;
