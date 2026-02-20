"use client";
import React, { Suspense } from "react";
import { useTheme } from "../../context/ThemeContext";
import dynamic from 'next/dynamic';
import LoadingAnimation from '@/components/LoadingAnimation/LoadingAnimation';



// Static imports for critical components
import NewNavBar from "../../components/NavBar_Desktop_Company/NewNavBar";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import ThemeToggleIcon from "../../components/Icon/sbicon";
import AboutHero from "../../components/AboutHero/AboutHero";
import { SITE_SOCIAL, getCopyrightText } from '@/lib/constants';

// Component interfaces
interface FooterProps {
  linkedinUrl: string;
  instagramUrl: string;
  githubUrl: string;
  copyrightText: string;
}

// Dynamic imports for non-critical components with proper typing
const AboutIntro = dynamic<Record<string, never>>(
  () => import("../../components/AboutIntro/AboutIntro").then(mod => mod.default), {
  loading: () => <LoadingAnimation size="medium" />
});
const CoreValues = dynamic<Record<string, never>>(
  () => import("../../components/CoreValues/CoreValues").then(mod => mod.default), {
  loading: () => <LoadingAnimation size="medium" />
});
const AboutFounder = dynamic<Record<string, never>>(
  () => import("../../components/AboutFounder/AboutFounder").then(mod => mod.default), {
  loading: () => <LoadingAnimation size="medium" />
});
const AboutStats = dynamic<Record<string, never>>(
  () => import("../../components/AboutStats/AboutStats").then(mod => mod.default), {
  loading: () => <LoadingAnimation size="medium" />
});
const Footer = dynamic<FooterProps>(
  () => import("../../components/Footer/Footer").then(mod => mod.default), {
  loading: () => <LoadingAnimation size="medium" />
});

export default function AboutPage() {
  const { theme } = useTheme();

  const { linkedinUrl, instagramUrl, githubUrl } = SITE_SOCIAL;
  const copyrightText = getCopyrightText();

  return (
    <div 
      style={{ 
        backgroundColor: theme === "dark" ? "var(--page-bg-dark, #1d2127)" : "var(--page-bg, #ffffff)", 
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
          <NewNavBar />
        </nav>

        {/* Mobile NavBar */}
        <nav 
          id="mobile-navbar" 
          aria-label="Mobile Navigation"
          className="block md:hidden"
        >
          <NavBarMobile />
        </nav>
      </header>

      {/* Main Content */}
      <main 
        id="main-content"
        style={{ 
          background: "var(--color-bg)", 
          color: "var(--color-text)" 
        }}
      >
        {/* Critical Path - Load Immediately */}
        <AboutHero />

        {/* Non-Critical Components - Load Dynamically */}
        <Suspense fallback={<LoadingAnimation size="medium" />}>
          {/* Introduction Section - Start with who we are */}
          <section aria-label="About Company">
            <AboutIntro />
          </section>

          {/* Founder Section - Move up for personal connection */}
          <section aria-label="About Founder">
            <AboutFounder />
          </section>

          {/* Stats Section - Show achievements after intro/founder */}
          <section aria-label="Company Statistics">
            <AboutStats />
          </section>

          {/* Core Values Section */}
          <section aria-label="Our Core Values">
            <CoreValues />
          </section>
        </Suspense>
      </main>

      {/* Footer */}
      <footer 
        id="footer-section" 
        aria-label="Footer" 
        style={{ width: "100%", overflow: "hidden" }}
      >
        <Suspense fallback={<LoadingAnimation size="medium" />}>
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
