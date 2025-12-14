"use client";
import React, { useCallback, useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import commonStyles from './FooterCommon.module.css'; // Import common styles
import lightStyles from './FooterLight.module.css'; // Import light mode styles
import darkStyles from './FooterDark.module.css'; // Import dark mode styles

const Footer = ({
  copyrightText = "Copyright 2025 Megicode. All Rights Reserved.",
  linkedinUrl = "https://www.linkedin.com/company/megicode",
  instagramUrl = "https://www.instagram.com/ghulamujtabaofficial/",
  githubUrl = "https://github.com/megicodes"
}) => {
  const { theme } = useTheme();
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.3 });

  const themeStyles = useMemo(() => (theme === 'dark' ? darkStyles : lightStyles), [theme]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.1,
      },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  // Keyboard and mouse interactivity for icons
  const openLink = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLImageElement>, url: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      openLink(url);
    }
  }, [openLink]);

  return (
    <motion.footer
      ref={footerRef}
      className={`${commonStyles.footer} ${themeStyles.footer}`}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      <div className={commonStyles.footerFrame}>
        <div className={`${commonStyles.footerBackground} ${themeStyles.footerBackground}`} />
        <motion.img
          className={commonStyles.copyrightIcon}
          alt="Copyright Icon"
          src={theme === 'dark' ? "/CopyrightDark.svg" : "/copyright-icon.svg"}
          variants={iconVariants}
        />
        <motion.p
          className={commonStyles.copyrightLabel}
          variants={iconVariants}
        >
          {copyrightText}
        </motion.p>
        <motion.img
          className={commonStyles.linkedinIcon}
          alt="LinkedIn"
          src={theme === 'dark' ? "/LinkedinDark.svg" : "/linkedin-icon.svg"}
          onClick={() => openLink(linkedinUrl)}
          onKeyDown={e => handleKeyDown(e, linkedinUrl)}
          tabIndex={0}
          role="button"
          aria-label="LinkedIn"
          variants={iconVariants}
          whileHover={{ scale: 1.15, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.95 }}
        />
        <motion.img
          className={commonStyles.instagramIcon}
          alt="Instagram"
          src={theme === 'dark' ? "/InstagramDark.svg" : "/Instagram-icon.svg"}
          onClick={() => openLink(instagramUrl)}
          onKeyDown={e => handleKeyDown(e, instagramUrl)}
          tabIndex={0}
          role="button"
          aria-label="Instagram"
          variants={iconVariants}
          whileHover={{ scale: 1.15, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.95 }}
        />
        <motion.img
          className={commonStyles.githubIcon}
          alt="GitHub"
          src={theme === 'dark' ? "/GithubDark.svg" : "/github_icon.svg"}
          onClick={() => openLink(githubUrl)}
          onKeyDown={e => handleKeyDown(e, githubUrl)}
          tabIndex={0}
          role="button"
          aria-label="GitHub"
          variants={iconVariants}
          whileHover={{ scale: 1.15, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.95 }}
        />
      </div>
    </motion.footer>
  );
};

export default Footer;
