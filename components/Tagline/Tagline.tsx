"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './Tagline.module.css';
import { useTheme } from '../../context/ThemeContext';
import { fadeInUp } from '../../utils/animations';

const Tagline = () => {
  const { theme } = useTheme();
  return (
    <section className={`${styles.taglineSection} ${theme === 'dark' ? styles.dark : ''}`}>
      <motion.h2
        className={styles.taglineText}
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        If You Can <span className={styles.highlight}>Imagine</span> It, We Can <span className={styles.highlight}>Build</span> It
      </motion.h2>
    </section>
  );
};

export default Tagline;
