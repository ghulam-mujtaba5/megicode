'use client';
import React from 'react';
import styles from './AboutHero.module.css';
import { motion } from 'framer-motion';
import LetsTalkButton from '../CTA/LetsTalkButton';

const AboutHero = () => {
  return (
    <section className={styles.heroContainer}>
      <div className={styles.contentWrapper}>
        <motion.h1 
          className={styles.heading}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Transforming Ideas into Intelligent Solutions
        </motion.h1>
        
        <motion.p 
          className={styles.subheading}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          We build scalable, AI-powered software solutions that empower businesses to grow faster.
        </motion.p>
        
        <motion.div 
          className={styles.ctaContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <LetsTalkButton />
        </motion.div>
      </div>
      
      {/* Neural network background animation */}
      <div className={styles.backgroundAnimation}>
        {/* Neural network nodes and connections will be rendered here */}
      </div>
    </section>
  );
};

export default AboutHero;
