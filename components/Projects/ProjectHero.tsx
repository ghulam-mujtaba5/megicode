'use client';
import React from 'react';

import { useTheme } from '../../context/ThemeContext';
import styles from './ProjectHeroCommon.module.css';
import darkStyles from './ProjectHeroDark.module.css';
import lightStyles from './ProjectHeroLight.module.css';

const ProjectHero = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  return (
    <section className={`${styles.heroSection} ${themeStyles.heroSection}`}>
      <div className={styles.heroContent}>
        <h1 className={`${styles.title} ${themeStyles.title}`}>Case Studies &amp; Products</h1>
        <p className={`${styles.subtitle} ${themeStyles.subtitle}`}>
          From clinic management systems to university portals — see what we build and ship.
        </p>
        <p className={`${styles.description} ${themeStyles.description}`}>
          We don&#39;t just write code — we build complete platforms that solve real problems for
          real businesses and users. Explore our client case studies and our own products below.
        </p>
      </div>
      <div className={styles.heroPattern}></div>
    </section>
  );
};

export default ProjectHero;
