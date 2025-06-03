"use client";
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import NavBarDesktop from "../../components/NavBar_Desktop_Company/nav-bar-Company";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import Footer from "../../components/Footer/Footer";
import ThemeToggleIcon from "../../components/Icon/sbicon";
import ReviewsHero from "../../components/Reviews/ReviewsHero";
import ReviewsGrid from "../../components/Reviews/ReviewsGrid";
import styles from './reviews.module.css';

export default function ReviewsPage() {
  const { theme } = useTheme();

  const sections = [
    { label: "Home", route: "/" },
    { label: "About", route: "/about" },
    { label: "Services", route: "/services" },
    { label: "Reviews", route: "/reviews" },
    { label: "Project", route: "/project" },
    { label: "Contact", route: "/contact" },
  ];

  const linkedinUrl = "https://www.linkedin.com/company/megicode";
  const instagramUrl = "https://www.instagram.com/megicode/";
  const githubUrl = "https://github.com/megicode";
  const copyrightText = "Copyright 2025 Megicode. All Rights Reserved.";

  // CSS variable for accent color based on theme
  const accentColorVar = {
    '--accent-color': theme === 'dark' ? '100, 150, 255' : '0, 100, 255'
  } as React.CSSProperties;

  return (
    <div 
      className={styles.pageContainer}
      style={{ 
        backgroundColor: theme === "dark" ? "#1d2127" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#1d2127",
        ...accentColorVar
      }}
    >
      {/* Theme Toggle Icon */}
      <div id="theme-toggle" className={styles.themeToggle} role="button" tabIndex={0}>
        <ThemeToggleIcon />
      </div>

      {/* Navigation */}
      <header className={`${styles.header} ${theme === 'dark' ? styles.headerDark : styles.headerLight}`}>
        <div className={styles.desktopNav}>
          <NavBarDesktop />
        </div>
        <div className={styles.mobileNav}>
          <NavBarMobile sections={sections} />
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Hero Section with Background Decoration */}
        <section className={styles.heroSection}>
          <div className={styles.backgroundDecoration} />
          <div className={styles.contentWrapper}>
            <ReviewsHero />
          </div>
        </section>

        {/* Reviews Grid Section */}
        <section className={styles.reviewsSection}>
          <div className={styles.backgroundDecoration} />
          <div className={styles.contentWrapper}>
            <ReviewsGrid />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
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
