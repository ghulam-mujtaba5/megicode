"use client";
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import NavBarDesktop from "../../components/NavBar_Desktop_Company/nav-bar-Company";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import ThemeToggleIcon from "../../components/Icon/sbicon";
import AboutHero from "../../components/AboutHero/AboutHero";
import AboutIntro from "../../components/AboutIntro/AboutIntro";
import CoreValues from "../../components/CoreValues/CoreValues";
import AboutFounder from "../../components/AboutFounder/AboutFounder";
import AboutStats from "../../components/AboutStats/AboutStats";
import Footer from "../../components/Footer/Footer";

export default function AboutPage() {
  const { theme } = useTheme();

  // Social/contact info (reuse from MegicodePage)
  const linkedinUrl = "https://www.linkedin.com/company/megicode";
  const instagramUrl = "https://www.instagram.com/megicode/";
  const githubUrl = "https://github.com/megicode";
  const copyrightText = "Copyright 2025 Megicode. All Rights Reserved.";

  const sections = [
    { label: "Home", route: "/" },
    { label: "About", route: "/about" },
    { label: "Services", route: "/services" },
    { label: "Reviews", route: "/reviews" },
    { label: "Project", route: "/project" },
    { label: "Contact", route: "/contact" },
  ];

  return (
    <div style={{ backgroundColor: theme === "dark" ? "#1d2127" : "#ffffff", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Theme Toggle Icon */}
      <div id="theme-toggle" role="button" tabIndex={0}>
        <ThemeToggleIcon />
      </div>

      {/* Desktop NavBar */}
      <nav id="desktop-navbar" aria-label="Main Navigation">
        <NavBarDesktop />
      </nav>

      {/* Mobile NavBar */}
      <nav id="mobile-navbar" aria-label="Mobile Navigation">
        <NavBarMobile sections={sections} />
      </nav>      {/* Main Content */}
      <main style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
        {/* Hero Section */}
        <AboutHero />

        {/* Stats Section - Moved up to establish credibility early */}
        <AboutStats />

        {/* Introduction Section */}
        <AboutIntro />

        {/* Core Values Section */}
        <CoreValues />

        {/* Founder Section - Moved to end for personal connection */}
        <AboutFounder />
      </main>

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
