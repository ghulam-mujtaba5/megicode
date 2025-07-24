"use client";
import React, { Suspense } from "react";
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
const CareersHero = dynamic<{}>(
  () => import("../../components/CareersHero/CareersHero").then(mod => mod.default), {
  loading: () => <LoadingAnimation size="medium" />
});

const WhyWorkWithUs = dynamic<{}>(
  () => import("../../components/WhyWorkWithUs/WhyWorkWithUs").then(mod => mod.default), {
  loading: () => <LoadingAnimation size="medium" />
});

const OpenPositions = dynamic<{}>(
  () => import("../../components/OpenPositions/OpenPositions").then(mod => mod.default), {
  loading: () => <LoadingAnimation size="medium" />
});

const CompanyCulture = dynamic<{}>(
  () => import("../../components/CompanyCulture/CompanyCulture").then(mod => mod.default), {
  loading: () => <LoadingAnimation size="medium" />
});

const CareersBenefits = dynamic<{}>(
  () => import("../../components/CareersBenefits/CareersBenefits").then(mod => mod.default), {
  loading: () => <LoadingAnimation size="medium" />
});

const CareersApplication = dynamic<{}>(
  () => import("../../components/CareersApplication/CareersApplication").then(mod => mod.default), {
  loading: () => <LoadingAnimation size="medium" />
});

const Footer = dynamic<FooterProps>(
  () => import("../../components/Footer/Footer").then(mod => mod.default), {
  loading: () => <LoadingAnimation size="medium" />
});

export default function CareersPage() {
  const { theme } = useTheme();

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
          role="button"
          tabIndex={0}
          aria-label="Toggle theme"
          onClick={() => {}}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            cursor: 'pointer',
          }}
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
