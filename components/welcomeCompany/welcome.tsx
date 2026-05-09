"use client";
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCalendlyModal } from '../CalendlyModal';
import styles from './welcomeLight.module.css';
import darkStyles from './welcomeDark.module.css';
import commonStyles from './welcomeCommon.module.css';


const Frame = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : styles;
  const [openCalendly, calendlyModal] = useCalendlyModal();

  return (
    <section
      className={`${commonStyles.container} ${theme === 'dark' ? darkStyles.darkContainer : styles.container}`}
      aria-label="Welcome to Megicode — Software Design & Development"
    >
      <motion.div
        className={`${commonStyles.textContainer} ${themeStyles.textContainer}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={commonStyles.heroHeading}>
          {/* "Welcome to" \u2014 small eyebrow label */}
          <motion.span
            className={`${commonStyles.welcomeEyebrow} ${themeStyles.welcomeEyebrow}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            Welcome to
          </motion.span>

          {/* Brand name on its own line */}
          <span className={commonStyles.brandLine}>
            {/* "Megi" \u2014 white (dark) / dark navy (light) */}
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
            {/* "code" \u2014 brand blue always */}
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
        </h1>

        {/* Subtitle */}
        <motion.p
          className={`${commonStyles.paragraph} ${themeStyles.paragraph}`}
          initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.55, delay: 1.4, ease: [0.25, 0.1, 0.25, 1] as const }}
        >
          Elevate Your Business with AI-Driven Innovation
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
            Start a Project
          </button>
          <Link
            href="/services"
            className={`${commonStyles.heroSecondary} ${themeStyles.heroSecondary}`}
          >
            Our Services
          </Link>
        </motion.div>
        {calendlyModal}

      </motion.div>
    </section>
  );
};

export default Frame;
