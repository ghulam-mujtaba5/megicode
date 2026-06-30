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
          <h1 className={`${styles.title} ${themeStyles.title}`}>Case Studies &amp; Products</h1>
          <p className={`${styles.subtitle} ${themeStyles.subtitle}`}>
            From clinic management systems to university portals — see what we build and ship.
          </p>
          <p className={`${styles.description} ${themeStyles.description}`}>
            We don&#39;t just write code — we build complete platforms that solve real problems for
            real businesses and users. Explore our client case studies and our own products below.
          </p>
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
              alt=""
              width={480}
              height={400}
              priority
              className={styles.heroImage}
              sizes="(max-width: 900px) 0px, (max-width: 1200px) 40vw, 480px"
            />
          </picture>
        </div>
      </div>
      <div className={styles.heroPattern} aria-hidden="true" />
    </section>
  );
};

export default ProjectHero;
