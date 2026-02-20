"use client";
import React, { useCallback, useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import commonStyles from './FooterCommon.module.css'; // Import common styles
import lightStyles from './FooterLight.module.css'; // Import light mode styles
import darkStyles from './FooterDark.module.css'; // Import dark mode styles

const Footer = ({
  copyrightText = `Copyright ${new Date().getFullYear()} Megicode. All Rights Reserved.`,
  linkedinUrl = "https://www.linkedin.com/company/megicode",
  instagramUrl = "https://www.instagram.com/megicode/",
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
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
        staggerChildren: 0.1,
      },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
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
        <motion.a
          href="/internal/login"
          className={`${commonStyles.internalPortalLink} ${themeStyles.internalPortalLink}`}
          variants={iconVariants}
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          title="Team Portal Access"
          aria-label="Access Internal Portal"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Portal
        </motion.a>
        <motion.a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={commonStyles.linkedinIcon}
          aria-label="LinkedIn"
          variants={iconVariants}
          whileHover={{ scale: 1.15, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            alt=""
            src={theme === 'dark' ? "/LinkedinDark.svg" : "/linkedin-icon.svg"}
            style={{ width: '100%', height: '100%' }}
          />
        </motion.a>
        <motion.a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={commonStyles.instagramIcon}
          aria-label="Instagram"
          variants={iconVariants}
          whileHover={{ scale: 1.15, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            alt=""
            src={theme === 'dark' ? "/InstagramDark.svg" : "/Instagram-icon.svg"}
            style={{ width: '100%', height: '100%' }}
          />
        </motion.a>
        <motion.a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={commonStyles.githubIcon}
          aria-label="GitHub"
          variants={iconVariants}
          whileHover={{ scale: 1.15, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            alt=""
            src={theme === 'dark' ? "/GithubDark.svg" : "/github_icon.svg"}
            style={{ width: '100%', height: '100%' }}
          />
        </motion.a>
      </div>
    </motion.footer>
  );
};

export default Footer;
