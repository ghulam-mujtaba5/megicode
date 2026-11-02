'use client';
import React, { Suspense } from 'react';

import { SITE_SOCIAL, getCopyrightText } from '@/lib/constants';

import LoadingAnimation from '@/components/LoadingAnimation/LoadingAnimation';

import Footer from '../../components/Footer/Footer';
import ThemeToggleIcon from '../../components/Icon/sbicon';
import NewNavBar from '../../components/NavBar_Desktop_Company/NewNavBar';
import NavBarMobile from '../../components/NavBar_Mobile/NavBar-mobile';
import ReviewsGrid from '../../components/Reviews/ReviewsGrid/ReviewsGrid';
import ReviewsHero from '../../components/Reviews/ReviewsHero/ReviewsHero';
import Breadcrumbs from '@/components/SEO/Breadcrumbs';
import { useTheme } from '../../context/ThemeContext';

export default function ReviewsPage() {
  const { theme } = useTheme();
  const { linkedinUrl, instagramUrl, githubUrl } = SITE_SOCIAL;
  const copyrightText = getCopyrightText();

  return (
    <div
      style={{
        backgroundColor:
          theme === 'dark' ? 'var(--page-bg-dark, #1d2127)' : 'var(--page-bg, #ffffff)',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      {/* Theme Toggle Icon */}
      <div id="theme-toggle" role="button" tabIndex={0}>
        <ThemeToggleIcon />
      </div>

      {/* Desktop NavBar */}
      <nav id="desktop-navbar" aria-label="Main Navigation">
        <NewNavBar />
      </nav>

      {/* Mobile NavBar */}
      <nav id="mobile-navbar" aria-label="Mobile Navigation">
        <NavBarMobile />
      </nav>

      <main id="main-content" className="relative" aria-label="Reviews Main Content">
        <div style={{ maxWidth: '1320px', margin: '20px auto 0', padding: '0 2rem' }}>
          <Breadcrumbs theme={theme as 'light' | 'dark'} />
        </div>
        <Suspense fallback={<LoadingAnimation size="medium" />}>
          <ReviewsHero />
          <ReviewsGrid />
        </Suspense>
      </main>

      <Footer
        linkedinUrl={linkedinUrl}
        instagramUrl={instagramUrl}
        githubUrl={githubUrl}
        copyrightText={copyrightText}
      />
    </div>
  );
}
