"use client";
import React, { useCallback } from "react";
import { useTheme } from "../context/ThemeContext";
import NewNavBar from "../components/NavBar_Desktop_Company/NewNavBar";
import NavBarMobile from "../components/NavBar_Mobile/NavBar-mobile";
import WelcomeFrame from "../components/welcomeCompany/welcome";
import AboutMeSection from "../components/AboutMeCompany/AboutMeSectionLight";
import ServicesFrame from "../components/About-page-Services/ServicesFrame";
import ContactSection from "../components/Contact/ConatctUs";
import Footer from "../components/Footer/Footer";
import ThemeToggleIcon from "../components/Icon/sbicon";
import MegicodeHeroAnimationAdvancedClient from "./megicode/MegicodeHeroAnimationAdvancedClient";
import ParticleBackgroundClient from "./megicode/ParticleBackgroundClient";
import Tagline from "../components/Tagline/Tagline";

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();

  const onDarkModeButtonContainerClick = useCallback(() => {
    toggleTheme && toggleTheme();
  }, [toggleTheme]);

  // Social/contact info
  const linkedinUrl = "https://www.linkedin.com/company/megicode";
  const instagramUrl = "https://www.instagram.com/megicode/";
  const githubUrl = "https://github.com/megicodes";
  const copyrightText = "Copyright 2025 Megicode. All Rights Reserved.";
  const contactEmail = "info@megicode.com";
  const contactPhoneNumber = "+123 456 7890";

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
        <main className="main-content">
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
          {/* Contact Section */}
          <section
            id="contact-section"
            aria-labelledby="contact-heading"
            className="content-section"
          >
            <ContactSection
              email={contactEmail}
              phoneNumber={contactPhoneNumber}
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
