'use client';
import React from 'react';

import Link from 'next/link';

import { motion } from 'framer-motion';

import { useTheme } from '../../context/ThemeContext';
import { useCalendlyModal } from '../CalendlyModal';
import commonStyles from './welcomeCommon.module.css';
import darkStyles from './welcomeDark.module.css';
import styles from './welcomeLight.module.css';

const Frame = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : styles;
  const [openCalendly, calendlyModal] = useCalendlyModal();

  return (
    <section
      className={`${commonStyles.container} ${theme === 'dark' ? darkStyles.darkContainer : styles.container}`}
      aria-label="Megicode — AI-powered software, websites, and automation"
    >
      <motion.div
        className={`${commonStyles.textContainer} ${themeStyles.textContainer}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={commonStyles.heroHeading}>
          {/* Eyebrow — concrete descriptor above the brand name */}
          <motion.span
            className={`${commonStyles.welcomeEyebrow} ${themeStyles.welcomeEyebrow}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            AI Automation &amp; Custom Software Systems
          </motion.span>

          {/* Brand name on its own line */}
          <span className={commonStyles.brandLine}>
            {/* "Megi" — white (dark) / dark navy (light) */}
            <motion.span
              className={`${commonStyles.brandMegi} ${themeStyles.brandMegi}`}
              initial={{ opacity: 0, y: 22, scale: 0.88, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.55, delay: 0.55, ease: [0.16, 1, 0.3, 1] as const }}
              style={{ display: 'inline-block', position: 'relative' }}
            >
              Megi
              <motion.span
                className={commonStyles.shimmer}
                initial={{ left: '-100%' }}
                animate={{ left: '200%' }}
                transition={{ duration: 1.1, delay: 1.5, ease: 'easeInOut' }}
                aria-hidden="true"
              />
            </motion.span>
            {/* "code" — brand blue always */}
            <motion.span
              className={`${commonStyles.brandCode} ${themeStyles.brandCode}`}
              initial={{ opacity: 0, y: 22, scale: 0.88, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.55, delay: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
              style={{ display: 'inline-block' }}
            >
              code
            </motion.span>
          </span>

          {/* Value-proposition headline — the actual SEO/conversion h1 text */}
          <motion.span
            className={`${commonStyles.heroHeadline} ${themeStyles.heroHeadline}`}
            initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.55, delay: 1.15, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            AI Automation and Software Systems for Startups, Clinics, Agencies, and Growing
            Businesses
          </motion.span>
        </h1>

        {/* Subheadline — who it's for and what they get */}
        <motion.p
          className={`${commonStyles.paragraph} ${themeStyles.paragraph}`}
          initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.55, delay: 1.45, ease: [0.25, 0.1, 0.25, 1] as const }}
        >
          We design and build AI agents, SaaS MVPs, clinic software, custom booking platforms,
          dashboards, and automated workflows — custom software that saves hours every week and
          drives real revenue growth.
        </motion.p>

        {/* Hero CTAs */}
        <motion.div
          className={commonStyles.heroActions}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 2.0, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <button
            onClick={openCalendly}
            className={`${commonStyles.heroPrimary} ${themeStyles.heroPrimary}`}
          >
            Start Your Project →
          </button>
          <Link
            href="/projects"
            className={`${commonStyles.heroSecondary} ${themeStyles.heroSecondary}`}
          >
            View Our Work →
          </Link>
        </motion.div>
        {calendlyModal}
      </motion.div>
    </section>
  );
};

export default Frame;
