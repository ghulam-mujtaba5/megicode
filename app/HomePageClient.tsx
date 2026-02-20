"use client";
import React, { useCallback } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "../context/ThemeContext";
import NewNavBar from "../components/NavBar_Desktop_Company/NewNavBar";
import NavBarMobile from "../components/NavBar_Mobile/NavBar-mobile";
import WelcomeFrame from "../components/welcomeCompany/welcome";
import Footer from "../components/Footer/Footer";
import ThemeToggleIcon from "../components/Icon/sbicon";
import MegicodeHeroAnimationAdvancedClient from "./megicode/MegicodeHeroAnimationAdvancedClient";
import ParticleBackgroundClient from "./megicode/ParticleBackgroundClient";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { SITE_SOCIAL, getCopyrightText, CONTACT_EMAIL } from "@/lib/constants";

// Below-the-fold components loaded lazily
const AboutMeSection = dynamic(() => import("../components/AboutMeCompany/AboutMeSectionLight"), {
  loading: () => <LoadingAnimation size="medium" />
});
const Tagline = dynamic(() => import("../components/Tagline/Tagline"));
const ServicesFrame = dynamic(() => import("../components/About-page-Services/ServicesFrame"), {
  loading: () => <LoadingAnimation size="medium" />
});
const TechStack = dynamic(() => import("../components/TechStack/TechStack"), {
  loading: () => <LoadingAnimation size="medium" />
});
const ContactSection = dynamic(() => import("../components/Contact/ConatctUs"), {
  loading: () => <LoadingAnimation size="medium" />
});

export default function HomePageClient() {
  const { theme, toggleTheme } = useTheme();

  const onDarkModeButtonContainerClick = useCallback(() => {
    toggleTheme && toggleTheme();
  }, [toggleTheme]);

  const { linkedinUrl, instagramUrl, githubUrl } = SITE_SOCIAL;
  const copyrightText = getCopyrightText();
  const contactEmail = CONTACT_EMAIL;


  return (
    <>
      <div className={`page-container ${theme}`}>

        {/* Subtle animated background */}
        <div className="particle-background">
          <ParticleBackgroundClient />
        </div>
        {/* Theme Toggle Icon - match services page style */}
        <div
          id="theme-toggle"
          role="button"
          tabIndex={0}
          aria-label="Toggle theme"
          onClick={onDarkModeButtonContainerClick}
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
          {/* About Me Section */}
          <section
            id="about-section"
            aria-labelledby="about-heading"
            className="content-section"
          >
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

          {/* Tech Stack Section */}
          <section
            id="tech-stack-section"
            aria-labelledby="tech-stack-heading"
            className="content-section"
          >
            <TechStack />
          </section>
          {/* Contact Section */}
          <section
            id="contact-section"
            aria-labelledby="contact-heading"
            className="content-section"
          >
            <ContactSection
              email={contactEmail}

              showCertificationBadge={false}
            />
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
