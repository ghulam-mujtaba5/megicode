"use client";
import React, { Suspense, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import dynamic from 'next/dynamic';
import LoadingAnimation from '@/components/LoadingAnimation/LoadingAnimation';
import styles from '../../components/CareersCommon.module.css';
import '../../components/CareersLight.module.css';
import '../../components/CareersDark.module.css';

// Static imports for critical components
import NewNavBar from "../../components/NavBar_Desktop_Company/NewNavBar";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import ThemeToggleIcon from "../../components/Icon/sbicon";

// Component interfaces
interface FooterProps {
  linkedinUrl: string;
  instagramUrl: string;
  githubUrl: string;
  copyrightText: string;
}

// Dynamic imports for non-critical components with proper typing
const CareersHero = dynamic<Record<string, never>>(
  () => import("../../components/CareersHero/CareersHero").then(mod => mod.default), {
  loading: () => <LoadingAnimation size="medium" />
});

const WhyWorkWithUs = dynamic<Record<string, never>>(
  () => import("../../components/WhyWorkWithUs/WhyWorkWithUs").then(mod => mod.default), {
  loading: () => <LoadingAnimation size="medium" />
});

const OpenPositions = dynamic<Record<string, never>>(
  () => import("../../components/OpenPositions/OpenPositions").then(mod => mod.default), {
  loading: () => <LoadingAnimation size="medium" />
});

const CompanyCulture = dynamic<Record<string, never>>(
  () => import("../../components/CompanyCulture/CompanyCulture").then(mod => mod.default), {
  loading: () => <LoadingAnimation size="medium" />
});

const CareersBenefits = dynamic<Record<string, never>>(
  () => import("../../components/CareersBenefits/CareersBenefits").then(mod => mod.default), {
  loading: () => <LoadingAnimation size="medium" />
});

const CareersApplication = dynamic<Record<string, never>>(
  () => import("../../components/CareersApplication/CareersApplication").then(mod => mod.default), {
  loading: () => <LoadingAnimation size="medium" />
});

const Footer = dynamic<FooterProps>(
  () => import("../../components/Footer/Footer").then(mod => mod.default), {
  loading: () => <LoadingAnimation size="medium" />
});

export default function CareersPage() {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Ensure the theme is set on the server to avoid a hydration mismatch
  }, [theme]);

  // Navigation sections for consistent navigation
  const sections = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'about', label: 'About', href: '/about' },
    { id: 'services', label: 'Services', href: '/services' },
    { id: 'projects', label: 'Projects', href: '/projects' },
    { id: 'article', label: 'Article', href: '/article' },
    { id: 'contact', label: 'Contact', href: '/contact' },
    { id: 'reviews', label: 'Reviews', href: '/reviews' },
    { id: 'careers', label: 'Careers', href: '/careers' },
  ];

  // Social/contact info
  const linkedinUrl = "https://www.linkedin.com/company/megicode";
  const instagramUrl = "https://www.instagram.com/megicode/";
  const githubUrl = "https://github.com/megicodes";
  const copyrightText = "Copyright 2025 Megicode. All Rights Reserved.";

  return (
    <>
      <div className={[
        styles.careersPage,
        theme === 'dark' ? 'darkTheme' : 'lightTheme',
      ].join(' ')}>

        {/* Theme Toggle Icon */}
        <div
          id="theme-toggle"
          className={styles.themeToggle}
          role="button"
          tabIndex={0}
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          <ThemeToggleIcon />
        </div>

        <main className="main-content">
          {/* Navigation */}
          <NewNavBar />
          <NavBarMobile />

          {/* Page Content */}
          <Suspense fallback={<LoadingAnimation size="large" />}>
            <CareersHero />
          </Suspense>

          <Suspense fallback={<LoadingAnimation size="medium" />}>
            <WhyWorkWithUs />
          </Suspense>

          <Suspense fallback={<LoadingAnimation size="medium" />}>
            <CompanyCulture />
          </Suspense>

          <Suspense fallback={<LoadingAnimation size="medium" />}>
            <CareersBenefits />
          </Suspense>

          <Suspense fallback={<LoadingAnimation size="medium" />}>
            <OpenPositions />
          </Suspense>

          <Suspense fallback={<LoadingAnimation size="medium" />}>
            <CareersApplication />
          </Suspense>

          {/* Footer */}
          <Suspense fallback={<LoadingAnimation size="medium" />}>
            <Footer
              linkedinUrl={linkedinUrl}
              instagramUrl={instagramUrl}
              githubUrl={githubUrl}
              copyrightText={copyrightText}
            />
          </Suspense>
        </main>
      </div>


    </>
  );
}
