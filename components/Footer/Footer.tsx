"use client";
import React, { useCallback, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import commonStyles from './FooterCommon.module.css'; // Import common styles
import lightStyles from './FooterLight.module.css'; // Import light mode styles
import darkStyles from './FooterDark.module.css'; // Import dark mode styles

const Footer = ({
  copyrightText = "Copyright 2024 Ghulam Mujtaba Official",
  linkedinUrl = "https://www.linkedin.com/in/ghulamujtabaofficial",
  instagramUrl = "https://www.instagram.com/ghulamujtabaofficial/",
  githubUrl = "https://github.com/ghulam-mujtaba5"
}) => {
  const { theme } = useTheme();

  const themeStyles = useMemo(() => (theme === 'dark' ? darkStyles : lightStyles), [theme]);


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
    <footer className={`${commonStyles.footer} ${themeStyles.footer}`}>
      <div className={commonStyles.footerFrame}>
        <div className={`${commonStyles.footerBackground} ${themeStyles.footerBackground}`} />
        <img
          className={commonStyles.copyrightIcon}
          alt="Copyright Icon"
          src={theme === 'dark' ? "/CopyrightDark.svg" : "/copyright-icon.svg"}
        />
        <p className={commonStyles.copyrightLabel}>
          {copyrightText}
        </p>
        <img
          className={commonStyles.linkedinIcon}
          alt="LinkedIn"
          src={theme === 'dark' ? "/LinkedinDark.svg" : "/linkedin-icon.svg"}
          onClick={() => openLink(linkedinUrl)}
          onKeyDown={e => handleKeyDown(e, linkedinUrl)}
          tabIndex={0}
          role="button"
          aria-label="LinkedIn"
        />
        <img
          className={commonStyles.instagramIcon}
          alt="Instagram"
          src={theme === 'dark' ? "/InstagramDark.svg" : "/Instagram-icon.svg"}
          onClick={() => openLink(instagramUrl)}
          onKeyDown={e => handleKeyDown(e, instagramUrl)}
          tabIndex={0}
          role="button"
          aria-label="Instagram"
        />
        <img
          className={commonStyles.githubIcon}
          alt="GitHub"
          src={theme === 'dark' ? "/GithubDark.svg" : "/github_icon.svg"}
          onClick={() => openLink(githubUrl)}
          onKeyDown={e => handleKeyDown(e, githubUrl)}
          tabIndex={0}
          role="button"
          aria-label="GitHub"
        />
      </div>
    </footer>
  );
};

export default Footer;
