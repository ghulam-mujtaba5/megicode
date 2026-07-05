'use client';
import React from 'react';

import dynamic from 'next/dynamic';

import { CONTACT_EMAIL, SITE_SOCIAL, getCopyrightText } from '@/lib/constants';

import LoadingAnimation from '@/components/LoadingAnimation/LoadingAnimation';

import Footer from '../components/Footer/Footer';
import ThemeToggleIcon from '../components/Icon/sbicon';
import NewNavBar from '../components/NavBar_Desktop_Company/NewNavBar';
import NavBarMobile from '../components/NavBar_Mobile/NavBar-mobile';
import PipelineDivider from '../components/Pipeline/PipelineDivider';
import WelcomeFrame from '../components/welcomeCompany/welcome';
import { useTheme } from '../context/ThemeContext';
import MegicodeHeroAnimationAdvancedClient from './megicode/MegicodeHeroAnimationAdvancedClient';

// Below-the-fold components loaded lazily
const AboutMeSection = dynamic(() => import('../components/AboutMeCompany/AboutMeSectionLight'), {
  loading: () => <LoadingAnimation size="medium" />,
});
const HomeProof = dynamic(() => import('../components/HomeProof/HomeProof'));
const ServicesFrame = dynamic(() => import('../components/About-page-Services/ServicesFrame'), {
  loading: () => <LoadingAnimation size="medium" />,
});
const HomePricingPreview = dynamic(() => import('../components/Pricing/HomePricingPreview'), {
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
const ContactSection = dynamic(() => import('../components/Contact/ContactUs'), {
  loading: () => <LoadingAnimation size="medium" />,
});
const StickyCta = dynamic(() => import('../components/StickyCta/StickyCta'));

export default function HomePageClient() {
  const { theme } = useTheme();

  const { linkedinUrl, instagramUrl, githubUrl } = SITE_SOCIAL;
  const copyrightText = getCopyrightText();
  const contactEmail = CONTACT_EMAIL;

  return (
    <>
      <div className={`page-container ${theme}`}>
        <main id="main-content" className="main-content">
          <div id="theme-toggle" role="button" tabIndex={0}>
            <ThemeToggleIcon />
          </div>
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
          <PipelineDivider />
          {/* Services Frame — buyers self-select before meeting the team */}
          <section
            id="services-section"
            aria-labelledby="services-heading"
            className="content-section"
          >
            <ServicesFrame />
          </section>

          <HomeShippedPlatforms />
          <PipelineDivider />
          <HomePricingPreview />
          <HomeTestimonials />
          <PipelineDivider />
          {/* About Section — team story after the proof; closes with the merged tagline */}
          <section id="about-section" aria-labelledby="about-heading" className="content-section">
            <AboutMeSection />
          </section>
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
          <StickyCta />
        </main>
      </div>
    </>
  );
}
