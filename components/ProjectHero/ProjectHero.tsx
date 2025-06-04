'use client'
import React from 'react';
import styles from './ProjectHero.module.css';
import { useTheme } from '@/context/ThemeContext';

const ProjectHero = () => {
  const { theme } = useTheme();

  return (
    <section className={`${styles.heroSection} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Transforming Ideas into <span className={styles.highlight}>Digital Excellence</span>
        </h1>
        <p className={styles.subtitle}>
          We deliver cutting-edge solutions at the intersection of AI, Machine Learning, and Enterprise Development.
          Our portfolio showcases how we help businesses innovate and scale.
        </p>
        <div className={styles.tags}>
          <span className={styles.tag}>Enterprise Solutions</span>
          <span className={styles.tag}>AI & Machine Learning</span>
          <span className={styles.tag}>Cloud Architecture</span>
          <span className={styles.tag}>Digital Transformation</span>
        </div>
        <div className={styles.cta}>
          <a href="#projects" className={styles.primary}>View Our Work</a>
          <a href="#technologies" className={styles.secondary}>Our Tech Stack</a>
        </div>
      </div>
      <div className={styles.overlay}></div>
    </section>
  );
};

export default ProjectHero;
