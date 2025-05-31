"use client";

import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/404.module.css';
import NavBarDesktop from '../components/NavBar_Desktop_Company/nav-bar-Company';
import NavBarMobile from '../components/NavBar_Mobile/NavBar-mobile';
import Footer from '../components/Footer/Footer';
import ThemeToggleIcon from '../components/Icon/sbicon';


export default function NotFound() {
  const { theme } = useTheme();

  // Social/contact info (reuse from other pages)
  const linkedinUrl = "https://www.linkedin.com/company/megicode";
  const instagramUrl = "https://www.instagram.com/megicode/";
  const githubUrl = "https://github.com/megicode";
  const copyrightText = "Copyright 2025 Megicode. All Rights Reserved.";
  const sections = [
    { id: "home-section", label: "Home" },
    { id: "about-section", label: "About" },
    { id: "services-section", label: "Services" },
    { id: "project-section", label: "Projects" },
    { id: "reviews-section", label: "Reviews" },
    { id: "contact-section", label: "Contact" },
  ];

  return (
    <div style={{ backgroundColor: theme === "dark" ? "#1d2127" : "#ffffff", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Theme Toggle Icon */}
      <div id="theme-toggle" role="button" tabIndex={0} style={{ position: 'absolute', top: 24, right: 32 }}>
        <ThemeToggleIcon />
      </div>

      {/* Desktop NavBar */}
      <nav id="desktop-navbar" aria-label="Main Navigation">
        <NavBarDesktop />
      </nav>

      {/* Mobile NavBar */}
      <nav id="mobile-navbar" aria-label="Mobile Navigation">
        <NavBarMobile sections={sections} />
      </nav>

      {/* 404 Content */}
      <div className={styles.wrapper} data-theme={theme}>
        <motion.div
          className={styles.logoContainer}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          aria-label="Navigation Vector Graphic"
          style={{ width: '100%', maxWidth: 340, margin: '0 auto' }}
        >
          {/* Responsive, animated, world-class navigation SVG */}
          <motion.svg
            viewBox="0 0 340 140"
            width="100%"
            height="auto"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block', margin: '0 auto' }}
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          >
            <defs>
              <radialGradient id="nav-bg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={theme === 'dark' ? '#3b82f6' : '#0D47A1'} stopOpacity="0.7" />
                <stop offset="100%" stopColor={theme === 'dark' ? '#181c20' : '#f5f5f5'} stopOpacity="0.2" />
              </radialGradient>
              <linearGradient id="nav-path" x1="0" y1="0" x2="340" y2="140" gradientUnits="userSpaceOnUse">
                <stop stopColor={theme === 'dark' ? '#fff' : '#0D47A1'} />
                <stop offset="1" stopColor={theme === 'dark' ? '#3b82f6' : '#1565c0'} />
              </linearGradient>
              <linearGradient id="nav-arrow" x1="0" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor={theme === 'dark' ? '#fff' : '#0D47A1'} />
                <stop offset="1" stopColor={theme === 'dark' ? '#3b82f6' : '#1565c0'} />
              </linearGradient>
            </defs>
            {/* Background globe */}
            <ellipse cx="170" cy="70" rx="120" ry="60" fill="url(#nav-bg)" />
            {/* Animated navigation path */}
            <motion.path
              d="M40 110 Q170 10 300 110"
              stroke="url(#nav-path)"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: 'easeInOut' }}
            />
            {/* Animated moving dot on path */}
            <motion.circle
              r="13"
              fill={theme === 'dark' ? '#3b82f6' : '#0D47A1'}
              stroke="#fff"
              strokeWidth="3"
              initial={{ cx: 40, cy: 110 }}
              animate={{ cx: 170, cy: 40 }}
              transition={{ duration: 1.2, delay: 1, ease: 'easeInOut' }}
            />
            {/* Arrow at the end of the path */}
            <motion.polygon
              points="170,25 180,45 170,40 160,45"
              fill="url(#nav-arrow)"
              initial={{ opacity: 0, scale: 0.7, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.5, ease: 'easeOut' }}
            />
            {/* Decorative navigation markers */}
            <circle cx="40" cy="110" r="6" fill={theme === 'dark' ? '#fff' : '#3b82f6'} />
            <circle cx="300" cy="110" r="6" fill={theme === 'dark' ? '#fff' : '#3b82f6'} />
            <circle cx="170" cy="40" r="6" fill={theme === 'dark' ? '#fff' : '#3b82f6'} />
          </motion.svg>
        </motion.div>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
        >
          404 - Page Not Found
        </motion.h1>
        <motion.p
          className={styles.description}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
        >
          Oops! The page you are looking for doesn’t exist or has been moved.<br />
          Let’s get you back to something awesome.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
        >
          <Link href="/" className={styles.homeLink} aria-label="Go back home">
            <span className={styles.homeBtnBg} />
            <span className={styles.homeBtnText}>Go Back Home</span>
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <footer id="footer-section" aria-label="Footer" style={{ width: "100%", overflow: "hidden" }}>
        <Footer
          linkedinUrl={linkedinUrl}
          instagramUrl={instagramUrl}
          githubUrl={githubUrl}
          copyrightText={copyrightText}
        />
      </footer>
    </div>
  );
}
