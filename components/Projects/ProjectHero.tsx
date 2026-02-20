"use client";
import React from 'react';
import styles from './ProjectHeroCommon.module.css';
import darkStyles from './ProjectHeroDark.module.css';
import lightStyles from './ProjectHeroLight.module.css';
import { useTheme } from '../../context/ThemeContext';

const ProjectHero = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  return (
    <section className={`${styles.heroSection} ${themeStyles.heroSection}`}>
      <div className={styles.heroContent}>
        <h1 className={`${styles.title} ${themeStyles.title}`}>
          Our Projects & Products
        </h1>
        <p className={`${styles.subtitle} ${themeStyles.subtitle}`}>
          Transforming Ideas into Digital Reality
        </p>
        <p className={`${styles.description} ${themeStyles.description}`}>
          Explore our portfolio of innovative solutions across web, mobile, 
          desktop applications, AI implementations, and data science projects.
        </p>
      </div>
      <div className={styles.heroPattern}></div>
    </section>
  );
};

export default ProjectHero;
