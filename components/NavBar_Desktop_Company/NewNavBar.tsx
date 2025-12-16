"use client";
import React, { useContext } from 'react';
import { LOGO_NAVBAR_DARK, LOGO_NAVBAR_LIGHT } from '@/lib/logo';
import Image from 'next/image';
import Link from 'next/link';

// NOTE: You will need to create this context file.
// Example: e:\temp\megicode\context\ThemeContext.tsx
//
// import { createContext, useState } from 'react';
// export const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });
//
// export const ThemeProvider = ({ children }) => {
//   const [theme, setTheme] = useState('light');
//   const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
//   return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
// };
import { ThemeContext } from '../../context/ThemeContext';

import styles from './NewNavBar.module.css';
import lightStyles from './NewNavBar-light.module.css';
import darkStyles from './NewNavBar-dark.module.css';

const NewNavBar = () => {
  // Default to 'light' theme if context is not available, to prevent errors.
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

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
            <Link href="/internal/login" className={`${themeStyles.navLink} ${styles.internalPortalLink}`} title="Team Portal">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Portal
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NewNavBar;
