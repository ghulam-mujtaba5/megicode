'use client';
import React, { Suspense } from 'react';

import dynamic from 'next/dynamic';

import { SITE_SOCIAL, getCopyrightText } from '@/lib/constants';

import LoadingAnimation from '@/components/LoadingAnimation/LoadingAnimation';

import styles from '../../components/CareersCommon.module.css';
import darkStyles from '../../components/CareersDark.module.css';
import lightStyles from '../../components/CareersLight.module.css';
import ThemeToggleIcon from '../../components/Icon/sbicon';
// Static imports for critical components
import NewNavBar from '../../components/NavBar_Desktop_Company/NewNavBar';
import NavBarMobile from '../../components/NavBar_Mobile/NavBar-mobile';
import { useTheme } from '../../context/ThemeContext';

// Component interfaces
interface FooterProps {
  linkedinUrl: string;
  instagramUrl: string;
  githubUrl: string;
  copyrightText: string;
}

// Dynamic imports for non-critical components with proper typing
const Footer = dynamic<FooterProps>(
  () => import('../../components/Footer/Footer').then((mod) => mod.default),
  {
    loading: () => <LoadingAnimation size="medium" />,
  }
);

export default function CareersPage() {
  const { theme, toggleTheme } = useTheme();

  const { linkedinUrl, instagramUrl, githubUrl } = SITE_SOCIAL;
  const copyrightText = getCopyrightText();

  return (
    <>
      <div
        className={`${styles.careersPage} ${theme === 'dark' ? darkStyles.darkTheme : lightStyles.lightTheme}`}
      >
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

        <main id="main-content" className="main-content">
          {/* Navigation */}
          <NewNavBar />
          <NavBarMobile />

          <section
            style={{
              minHeight: '62vh',
              display: 'grid',
              alignItems: 'center',
              maxWidth: 920,
              margin: '0 auto',
              padding: '140px 24px 80px',
              textAlign: 'center',
            }}
          >
            <div>
              <span
                style={{
                  display: 'inline-flex',
                  borderRadius: 999,
                  padding: '7px 14px',
                  background: theme === 'dark' ? 'rgba(69,115,223,0.18)' : 'rgba(69,115,223,0.1)',
                  color: theme === 'dark' ? '#c0d4ff' : '#4573df',
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                }}
              >
                Careers
              </span>
              <h1
                style={{
                  margin: '18px 0 14px',
                  color: theme === 'dark' ? '#f8fafc' : '#111827',
                  fontSize: 'clamp(2.2rem, 5vw, 4.2rem)',
                  lineHeight: 1.05,
                }}
              >
                Future collaborators are welcome.
              </h1>
              <p
                style={{
                  maxWidth: 680,
                  margin: '0 auto 28px',
                  color: theme === 'dark' ? '#cbd5e1' : '#526070',
                  fontSize: 17,
                  lineHeight: 1.75,
                }}
              >
                We are not hiring actively right now, but we are open to hearing from developers,
                designers, and AI builders who want to work with Megicode in the future.
              </p>
              <a
                href="mailto:contact@megicode.com?subject=Future%20Megicode%20collaboration"
                style={{
                  minHeight: 48,
                  display: 'inline-flex',
                  alignItems: 'center',
                  borderRadius: 999,
                  padding: '0 22px',
                  color: theme === 'dark' ? '#f8fafc' : '#1d2127',
                  border: '1px solid rgba(255, 152, 0, 0.72)',
                  background:
                    theme === 'dark' ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.78)',
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow:
                    theme === 'dark'
                      ? '0 14px 30px rgba(0,0,0,0.18)'
                      : '0 14px 30px rgba(15,23,42,0.08)',
                }}
              >
                Send your profile →
              </a>
            </div>
          </section>

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
