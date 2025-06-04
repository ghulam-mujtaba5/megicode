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
          <span className={styles.highlight}>Innovative</span> Projects
        </h1>
        <p className={styles.subtitle}>
          Exploring the intersection of AI, Machine Learning, and Full-Stack Development
        </p>
        <div className={styles.tags}>
          <span className={styles.tag}>Artificial Intelligence</span>
          <span className={styles.tag}>Web Development</span>
          <span className={styles.tag}>Machine Learning</span>
          <span className={styles.tag}>Full Stack</span>
        </div>
      </div>
      <div className={styles.overlay}></div>
    </section>
  );
};

export default ProjectHero;
