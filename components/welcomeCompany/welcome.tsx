"use client";
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import styles from './welcomeLight.module.css';
import darkStyles from './welcomeDark.module.css';
import commonStyles from './welcomeCommon.module.css';

const welcomeChars = 'Welcome to'.split('');
const serviceWords = 'Elevate Your Business with AI-Driven Innovation'.split(' ');

const charStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.2 },
  },
};

const charVariant = {
  hidden: { opacity: 0, y: 12, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const wordStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 1.8 },
  },
};

const wordVariant = {
  hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const Frame = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : styles;

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
        <h1 className={`${commonStyles.text} ${themeStyles.text}`}>
          {/* "Welcome to" - character stagger with blur reveal */}
          <motion.span
            variants={charStagger}
            initial="hidden"
            animate="visible"
            style={{ display: 'inline-block' }}
          >
            {welcomeChars.map((char, i) => (
              <motion.span
                key={i}
                variants={charVariant}
                style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : undefined }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.span>
          {' '}
          {/* "Megicode" - word-level animation so background-clip:text works correctly */}
          <motion.span
            className={`${commonStyles.softBuilt} ${themeStyles.softBuilt}`}
            initial={{ opacity: 0, y: 18, scale: 0.85, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, delay: 0.9, ease: [0.16, 1, 0.3, 1] as const }}
            style={{ display: 'inline-block' }}
          >
            Megicode
            {/* Shimmer sweep overlay */}
            <motion.span
              className={commonStyles.shimmer}
              initial={{ left: '-100%' }}
              animate={{ left: '200%' }}
              transition={{ duration: 1.2, delay: 1.8, ease: 'easeInOut' }}
              aria-hidden="true"
            />
          </motion.span>
        </h1>

        {/* Subtitle - word-by-word blur reveal */}
        <motion.p
          className={`${commonStyles.paragraph} ${themeStyles.paragraph}`}
          variants={wordStagger}
          initial="hidden"
          animate="visible"
        >
          {serviceWords.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariant}
              style={{ display: 'inline-block', marginRight: '0.3em' }}
            >
              {word}
            </motion.span>
          ))}
        </motion.p>

        {/* Tagline — appears after subtitle finishes */}
        <motion.p
          className={`${commonStyles.tagline} ${themeStyles.tagline}`}
          initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.55, delay: 3.1, ease: [0.16, 1, 0.3, 1] as const }}
        >
          Elevate Your Business with{' '}
          <span className={`${commonStyles.taglineAccent} ${themeStyles.taglineAccent}`}>
            AI-Driven Innovation
          </span>
        </motion.p>
      </motion.div>
    </section>
  );
};

export default Frame;
