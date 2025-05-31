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
        >
          <Image
            src={theme === 'dark' ? '/gmVectorDark.svg' : '/gmVector.svg'}
            alt="Logo"
            width={80}
            height={80}
            className={styles.logo}
            priority
          />
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
