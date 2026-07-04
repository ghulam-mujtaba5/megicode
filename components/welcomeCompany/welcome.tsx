'use client';
import React from 'react';

import Link from 'next/link';

import { motion } from 'framer-motion';

import { useTheme } from '../../context/ThemeContext';
import { useCalendlyModal } from '../CalendlyModal';
import commonStyles from './welcomeCommon.module.css';
import darkStyles from './welcomeDark.module.css';
import styles from './welcomeLight.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;

const Frame = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : styles;
  const [openCalendly, calendlyModal] = useCalendlyModal();

  return (
    <section
      className={`${commonStyles.container} ${theme === 'dark' ? darkStyles.darkContainer : styles.container}`}
      aria-label="Megicode — AI software, automation, and SaaS MVPs for growing businesses"
    >
      <motion.div
        className={`${commonStyles.textContainer} ${themeStyles.textContainer}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className={commonStyles.heroHeading}>
          {/* Outcome-first headline — the conversion h1 */}
          <motion.span
            className={`${commonStyles.heroTitle} ${themeStyles.heroHeadline}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: EASE }}
          >
            AI software, automation &amp; SaaS MVPs{' '}
            <span className={commonStyles.heroTitleAccent}>built for real business growth</span>
          </motion.span>
        </h1>

        {/* Subheadline — who it's for and what they get */}
        <motion.p
          className={`${commonStyles.paragraph} ${themeStyles.paragraph}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
        >
          Megicode helps founders, clinics, agencies, and growing businesses turn ideas, workflows,
          and operations into launch-ready AI products, automation systems, and custom platforms.
        </motion.p>

        {/* Hero CTAs — interactive well under one second */}
        <motion.div
          className={commonStyles.heroActions}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.45, ease: EASE }}
        >
          <button
            onClick={openCalendly}
            className={`${commonStyles.heroPrimary} ${themeStyles.heroPrimary}`}
          >
            Book a Free Fit Call →
          </button>
          <Link
            href="/projects"
            className={`${commonStyles.heroSecondary} ${themeStyles.heroSecondary}`}
          >
            View Case Studies →
          </Link>
        </motion.div>

        {calendlyModal}
      </motion.div>
    </section>
  );
};

export default Frame;
