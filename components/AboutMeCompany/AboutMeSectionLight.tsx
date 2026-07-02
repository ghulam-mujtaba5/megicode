'use client';
import React, { useMemo } from 'react';
import { HiArrowRight } from 'react-icons/hi2';

import { motion } from 'framer-motion';

import { useTheme } from '../../context/ThemeContext';
import { fadeInDown, fadeInUp, staggerContainer } from '../../utils/animations';
import commonStyles from './AboutMeSectionCommon.module.css';
import darkStyles from './AboutMeSectionDark.module.css';
import lightStyles from './AboutMeSectionLight.module.css';

const AboutMeSection = () => {
  const { theme } = useTheme();

  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  const containerClass = useMemo(
    () => `${commonStyles.container} ${themeStyles.container}`,
    [themeStyles.container]
  );

  const sectionClass = useMemo(
    () => `${commonStyles.aboutMeSection} ${themeStyles.aboutMeSection}`,
    [themeStyles.aboutMeSection]
  );

  return (
    <>
      <motion.section
        className={`${commonStyles.cardSurface} ${themeStyles.cardSurface} ${containerClass}`}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        role="region"
        aria-labelledby="aboutus-heading"
      >
        <motion.div className={sectionClass} variants={staggerContainer}>
          <div className={`${commonStyles.accentBar} ${themeStyles.accentBar}`} />
          <motion.h2
            id="aboutus-heading"
            className={`${commonStyles.title} ${themeStyles.title}`}
            variants={fadeInDown}
          >
            ABOUT US
          </motion.h2>
          <motion.p
            className={`${commonStyles.subtitle} ${themeStyles.subtitle} ${themeStyles['subtitle-gradient']}`}
            variants={fadeInDown}
          >
            Your AI Tech Partner — From Idea to Scale
          </motion.p>
          <motion.div
            className={`${commonStyles.description} ${themeStyles.description}`}
            variants={fadeInUp}
          >
            <p className={`${commonStyles.aboutDescription} ${themeStyles.aboutDescription}`}>
              Megicode is a software company that partners with startups, non-technical founders,
              and growing businesses to build AI products, websites, and business platforms. We
              handle the tech — roadmap, design, build, launch, and support — so you can focus on
              customers.
            </p>
            <p
              className={`${commonStyles.missionStatement} ${themeStyles.missionStatement} ${themeStyles['mission-gradient']}`}
            >
              We work like a technical co-founder: clear scope before code, honest trade-off advice,
              working software shipped in weeks, and a team that stays accountable after launch.
            </p>
          </motion.div>

          {/* Explicit click affordance */}
          <motion.a
            href="/about"
            className={`${commonStyles.learnMore} ${themeStyles.learnMore}`}
            variants={fadeInUp}
            aria-label="Learn more about Megicode"
          >
            Learn more about us
            <HiArrowRight size={15} aria-hidden="true" />
          </motion.a>
        </motion.div>
      </motion.section>
    </>
  );
};

export default AboutMeSection;
