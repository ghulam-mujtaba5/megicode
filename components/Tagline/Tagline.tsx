'use client';
import React from 'react';

import { motion } from 'framer-motion';

import { useTheme } from '../../context/ThemeContext';
import { fadeInUp } from '../../utils/animations';
import styles from './Tagline.module.css';

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
        One team that takes your product from <span className={styles.highlight}>idea</span> to{' '}
        <span className={styles.highlight}>launch</span> — and stays after it ships
      </motion.h2>
    </section>
  );
};

export default Tagline;
