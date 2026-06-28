'use client';
import React, { useCallback } from 'react';

import dynamic from 'next/dynamic';

import { CONTACT_EMAIL, SITE_SOCIAL, getCopyrightText } from '@/lib/constants';

import LoadingAnimation from '@/components/LoadingAnimation/LoadingAnimation';

import Footer from '../components/Footer/Footer';
import ThemeToggleIcon from '../components/Icon/sbicon';
import NewNavBar from '../components/NavBar_Desktop_Company/NewNavBar';
import NavBarMobile from '../components/NavBar_Mobile/NavBar-mobile';
import WelcomeFrame from '../components/welcomeCompany/welcome';
import { useTheme } from '../context/ThemeContext';
import MegicodeHeroAnimationAdvancedClient from './megicode/MegicodeHeroAnimationAdvancedClient';

// Below-the-fold components loaded lazily
const AboutMeSection = dynamic(() => import('../components/AboutMeCompany/AboutMeSectionLight'), {
  loading: () => <LoadingAnimation size="medium" />,
});
const HomeProof = dynamic(() => import('../components/HomeProof/HomeProof'));
const Tagline = dynamic(() => import('../components/Tagline/Tagline'));
const ServicesFrame = dynamic(() => import('../components/About-page-Services/ServicesFrame'), {
  loading: () => <LoadingAnimation size="medium" />,
});
const HomeShippedPlatforms = dynamic(
  () => import('../components/HomeShippedPlatforms/HomeShippedPlatforms'),
  {
    loading: () => <LoadingAnimation size="medium" />,
  }
);
const HomeTestimonials = dynamic(() => import('../components/HomeTestimonials/HomeTestimonials'), {
  loading: () => <LoadingAnimation size="medium" />,
});
const ContactSection = dynamic(() => import('../components/Contact/ConatctUs'), {
  loading: () => <LoadingAnimation size="medium" />,
});

export default function HomePageClient() {
  const { theme, toggleTheme } = useTheme();

  const onDarkModeButtonContainerClick = useCallback(() => {
    if (toggleTheme) toggleTheme();
  }, [toggleTheme]);

  const { linkedinUrl, instagramUrl, githubUrl } = SITE_SOCIAL;
  const copyrightText = getCopyrightText();
  const contactEmail = CONTACT_EMAIL;

  return (
    <>
      <div className={`page-container ${theme}`}>
        {/* Theme Toggle Icon - match services page style */}
        <div
          id="theme-toggle"
          role="button"
          tabIndex={0}
          aria-label="Toggle theme"
          onClick={onDarkModeButtonContainerClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onDarkModeButtonContainerClick();
            }
          }}
        >
          <ThemeToggleIcon />
        </div>
        <main id="main-content" className="main-content">
          <NewNavBar />
          <NavBarMobile />
          {/* Welcome Frame + Advanced Hero Animation */}
          <section
            id="welcome-section"
            aria-labelledby="welcome-heading"
            className="content-section"
          >
            <WelcomeFrame />
            <MegicodeHeroAnimationAdvancedClient />
          </section>
          <HomeProof />
          {/* About Me Section */}
          <section id="about-section" aria-labelledby="about-heading" className="content-section">
            <AboutMeSection />
          </section>
          <Tagline />
          {/* Services Frame */}
          <section
            id="services-section"
            aria-labelledby="services-heading"
            className="content-section"
          >
            <ServicesFrame />
          </section>

          <HomeShippedPlatforms />
          <HomeTestimonials />
          {/* Contact Section */}
          <section
            id="contact-section"
            aria-labelledby="contact-heading"
            className="content-section"
          >
            <ContactSection email={contactEmail} />
          </section>
          {/* Footer */}
          <Footer
            linkedinUrl={linkedinUrl}
            instagramUrl={instagramUrl}
            githubUrl={githubUrl}
            copyrightText={copyrightText}
          />
        </main>
      </div>
    </>
  );
}
