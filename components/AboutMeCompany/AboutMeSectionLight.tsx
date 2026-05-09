
"use client";
import React, { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi2';
import { fadeInUp, fadeInDown, staggerContainer } from '../../utils/animations';
import commonStyles from './AboutMeSectionCommon.module.css';
import lightStyles from './AboutMeSectionLight.module.css';
import darkStyles from './AboutMeSectionDark.module.css';

const AboutMeSection = () => {
  const { theme } = useTheme();

  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  const containerClass = useMemo(
    () => `${commonStyles.container} ${themeStyles.container}`,
    [theme, themeStyles.container]
  );

  const sectionClass = useMemo(
    () => `${commonStyles.aboutMeSection} ${themeStyles.aboutMeSection}`,
    [theme, themeStyles.aboutMeSection]
  );

  const titleClass = useMemo(
    () => `${commonStyles.title} ${themeStyles.title}`,
    [theme, themeStyles.title]
  );

  const descriptionClass = useMemo(
    () => `${commonStyles.description} ${themeStyles.description}`,
    [theme, themeStyles.description]
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
        <motion.div 
          className={sectionClass}
          variants={staggerContainer}
        >
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
              Megicode is an AI-focused software company that partners with startups, non-technical founders, and growing businesses to build intelligent products. We handle the tech — from AI-powered MVPs to production-ready SaaS platforms — so you can focus on your vision.
            </p>
            <p className={`${commonStyles.missionStatement} ${themeStyles.missionStatement} ${themeStyles['mission-gradient']}`}>
              Our mission is to be the technical co-founder every startup deserves — delivering AI-powered software, strategic CTO-level guidance, and automation that gives small teams an unfair advantage.
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
