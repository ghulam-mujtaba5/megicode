"use client";
import React, { useContext } from 'react';
import { LOGO_NAVBAR_DARK, LOGO_NAVBAR_LIGHT } from '@/lib/logo';
import Image from 'next/image';
import Link from 'next/link';
import { ThemeContext } from '../../context/ThemeContext';
import styles from './NewNavBar.module.css';
import lightStyles from './NewNavBar-light.module.css';
import darkStyles from './NewNavBar-dark.module.css';

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const NewNavBar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext) || { theme: 'light', toggleTheme: () => {} };
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;
  const logoSrc = theme === 'dark' ? LOGO_NAVBAR_DARK : LOGO_NAVBAR_LIGHT;

  return (
    <nav className={`${styles.navbar} ${themeStyles.navbar}`}>
      <div className={styles.navbarContent}>
        <div className={styles.logoContainer}>
          <Link href="/">
            <Image
              src={logoSrc}
              alt="Megicode Logo"
              width={150}
              height={40}
              className={styles.logo}
            />
          </Link>
        </div>
        <ul className={styles.navLinks}>
          <li><Link href="/" className={themeStyles.navLink}>Home</Link></li>
          <li><Link href="/about" className={themeStyles.navLink}>About</Link></li>
          <li><Link href="/services" className={themeStyles.navLink}>Services</Link></li>
          <li><Link href="/projects" className={themeStyles.navLink}>Project</Link></li>
          <li><Link href="/article" className={themeStyles.navLink}>Article</Link></li>
          <li><Link href="/contact" className={themeStyles.navLink}>Contact</Link></li>
          <li><Link href="/reviews" className={themeStyles.navLink}>Reviews</Link></li>
          <li><Link href="/careers" className={themeStyles.navLink}>Careers</Link></li>
          <li>
            <button
              className={`${styles.themeToggle} ${themeStyles.themeToggle}`}
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NewNavBar;
