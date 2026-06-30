'use client';
import React from 'react';

import Image from 'next/image';

import { useTheme } from '../../context/ThemeContext';
import styles from './ProjectHeroCommon.module.css';
import darkStyles from './ProjectHeroDark.module.css';
import lightStyles from './ProjectHeroLight.module.css';

const ProjectHero = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  return (
    <section className={`${styles.heroSection} ${themeStyles.heroSection}`}>
      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          <span className={`${styles.eyebrow} ${themeStyles.eyebrow}`}>
            Case Studies &amp; Products
          </span>
          <h1 className={`${styles.title} ${themeStyles.title}`}>
            Built. Shipped.{' '}
            <span className={`${styles.accent} ${themeStyles.accent}`}>Proven.</span>
          </h1>
          <p className={`${styles.subtitle} ${themeStyles.subtitle}`}>
            From clinic management systems to university portals — real platforms built for real
            businesses.
          </p>
          <p className={`${styles.description} ${themeStyles.description}`}>
            We don&#39;t just write code — we build complete platforms that solve real problems for
            real businesses and users. Explore our client case studies and our own products below.
          </p>
          <div className={styles.statRow}>
            <div className={`${styles.stat} ${themeStyles.stat}`}>
              <span className={styles.statNum}>3+</span>
              <span className={styles.statLabel}>Platforms shipped</span>
            </div>
            <div className={`${styles.statDivider} ${themeStyles.statDivider}`} />
            <div className={`${styles.stat} ${themeStyles.stat}`}>
              <span className={styles.statNum}>15K+</span>
              <span className={styles.statLabel}>Active users</span>
            </div>
            <div className={`${styles.statDivider} ${themeStyles.statDivider}`} />
            <div className={`${styles.stat} ${themeStyles.stat}`}>
              <span className={styles.statNum}>100%</span>
              <span className={styles.statLabel}>Client satisfaction</span>
            </div>
          </div>
        </div>

        <div className={styles.heroVisual} aria-hidden="true">
          <picture>
            <source
              srcSet="/images/assets/casestudies@2x.webp 1.5x, /images/assets/casestudies.webp 1x"
              type="image/webp"
            />
            <source srcSet="/images/assets/casestudies.png" type="image/png" />
            <Image
              src="/images/assets/casestudies.webp"
              alt="Megicode — Digital Products, Custom Platforms and Growth Websites"
              width={520}
              height={420}
              priority
              className={styles.heroImage}
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 520px"
            />
          </picture>
        </div>
      </div>
      <div className={styles.heroPattern} aria-hidden="true" />
    </section>
  );
};

export default ProjectHero;
