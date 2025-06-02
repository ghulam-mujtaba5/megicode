"use client";
import React, { Suspense } from "react";
import { useTheme } from "../../context/ThemeContext";
import dynamic from 'next/dynamic';
import Loading from '../loading';

// Static imports for critical components
import NavBarDesktop from "../../components/NavBar_Desktop_Company/nav-bar-Company";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import ThemeToggleIcon from "../../components/Icon/sbicon";
import AboutHero from "../../components/AboutHero/AboutHero";

// Dynamic imports for non-critical components
const AboutIntro = dynamic(() => import("../../components/AboutIntro/AboutIntro"), {
  loading: () => <Loading />
});
const CoreValues = dynamic(() => import("../../components/CoreValues/CoreValues"), {
  loading: () => <Loading />
});
const AboutFounder = dynamic(() => import("../../components/AboutFounder/AboutFounder"), {
  loading: () => <Loading />
});
const AboutStats = dynamic(() => import("../../components/AboutStats/AboutStats"), {
  loading: () => <Loading />
});
const Footer = dynamic(() => import("../../components/Footer/Footer"), {
  loading: () => <Loading />
});

export default function AboutPage() {
  const { theme } = useTheme();

  // Social/contact info
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
    <div 
      style={{ 
        backgroundColor: theme === "dark" ? "#1d2127" : "#ffffff", 
        minHeight: "100vh", 
        overflowX: "hidden" 
      }}
    >
      {/* Theme Toggle Icon */}
      <div 
        id="theme-toggle" 
        role="button" 
        tabIndex={0} 
        aria-label="Toggle theme"
      >
        <ThemeToggleIcon />
      </div>

      {/* Navigation */}
      <header>
        {/* Desktop NavBar */}
        <nav 
          id="desktop-navbar" 
          aria-label="Main Navigation"
          className="hidden md:block"
        >
          <NavBarDesktop />
        </nav>

        {/* Mobile NavBar */}
        <nav 
          id="mobile-navbar" 
          aria-label="Mobile Navigation"
          className="block md:hidden"
        >
          <NavBarMobile sections={sections} />
        </nav>
      </header>

      {/* Main Content */}
      <main 
        style={{ 
          background: "var(--color-bg)", 
          color: "var(--color-text)" 
        }}
      >
        {/* Critical Path - Load Immediately */}
        <AboutHero />

        {/* Non-Critical Components - Load Dynamically */}
        <Suspense fallback={<Loading />}>
          {/* Stats Section - Establish credibility early */}
          <section aria-label="Company Statistics">
            <AboutStats />
          </section>

          {/* Introduction Section */}
          <section aria-label="About Company">
            <AboutIntro />
          </section>

          {/* Core Values Section */}
          <section aria-label="Our Core Values">
            <CoreValues />
          </section>

          {/* Founder Section */}
          <section aria-label="About Founder">
            <AboutFounder />
          </section>
        </Suspense>
      </main>

      {/* Footer */}
      <footer 
        id="footer-section" 
        aria-label="Footer" 
        style={{ width: "100%", overflow: "hidden" }}
      >
        <Suspense fallback={<Loading />}>
          <Footer
            linkedinUrl={linkedinUrl}
            instagramUrl={instagramUrl}
            githubUrl={githubUrl}
            copyrightText={copyrightText}
          />
        </Suspense>
      </footer>
    </div>
  );
}
