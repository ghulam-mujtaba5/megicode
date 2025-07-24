"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './Tagline.module.css';
import { useTheme } from '../../context/ThemeContext';

const Tagline = () => {
  const { theme } = useTheme();
  return (
    <section className={`${styles.taglineSection} ${theme === 'dark' ? styles.dark : ''}`}>
      <motion.h2
        className={styles.taglineText}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
      >
        If You Can <span className={styles.highlight}>Imagine</span> It, We Can <span className={styles.highlight}>Build</span> It
      </motion.h2>
    </section>
  );
};

export default Tagline;
