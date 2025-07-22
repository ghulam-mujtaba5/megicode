"use client";
import React, { useCallback } from "react";
import { useTheme } from "../context/ThemeContext";
import NavBarDesktop from "../components/NavBar_Desktop_Company/nav-bar-Company";
import NavBarMobile from "../components/NavBar_Mobile/NavBar-mobile";
import WelcomeFrame from "../components/welcomeCompany/welcome";
import AboutMeSection from "../components/AboutMeCompany/AboutMeSectionLight";
import ServicesFrame from "../components/About-page-Services/ServicesFrame";
import ContactSection from "../components/Contact/ConatctUs";
import Footer from "../components/Footer/Footer";
import ThemeToggleIcon from "../components/Icon/sbicon";
import MegicodeHeroAnimationAdvancedClient from "./megicode/MegicodeHeroAnimationAdvancedClient";
import ParticleBackgroundClient from "./megicode/ParticleBackgroundClient";

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();

  const onDarkModeButtonContainerClick = useCallback(() => {
    toggleTheme && toggleTheme();
  }, [toggleTheme]);

  // Social/contact info
  const linkedinUrl = "https://www.linkedin.com/company/megicode";
  const instagramUrl = "https://www.instagram.com/megicode/";
  const githubUrl = "https://github.com/megicode";
  const copyrightText = "Copyright 2025 Megicode. All Rights Reserved.";
  const contactEmail = "info@megicode.com";
  const contactPhoneNumber = "+123 456 7890";

  return (
    <>
      <style jsx global>{`
        html, body {
          background: ${theme === "dark" ? "#1d2127" : "#f8fafc"} !important;
        }
      `}</style>
      <div
        style={{
          background: theme === "dark"
            ? "#1d2127"
            : "linear-gradient(135deg, #f8fafc 0%, #e8eaf6 100%)",
          minHeight: "100vh",
          overflowX: "hidden",
          position: "relative",
          colorScheme: theme === "dark" ? "dark" : "light",
          border: theme === "dark" ? "1.5px solid #23272f" : "1.5px solid #e3e8ee",
          boxShadow: theme === "dark"
            ? "0 4px 32px 0 rgba(0,0,0,0.25)"
            : "0 4px 24px 0 rgba(60,60,120,0.07)",
          transition: "background 0.4s, box-shadow 0.3s, border 0.3s"
        }}
        className={theme === "dark" ? "dark" : "light"}
      >
        {/* Subtle animated background */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "150vh",
            pointerEvents: "none",
            zIndex: 0
          }}
        >
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
        <main className="relative z-10 min-h-screen" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <NavBarDesktop />
          <NavBarMobile />
          {/* Welcome Frame + Advanced Hero Animation */}
          <section
            id="welcome-section"
            aria-labelledby="welcome-heading"
            style={{ width: "100%", overflow: "hidden", position: "relative" }}
          >
            <WelcomeFrame />
            <MegicodeHeroAnimationAdvancedClient />
          </section>
          {/* About Me Section */}
          <section
            id="about-section"
            aria-labelledby="about-heading"
            style={{ width: "100%", overflow: "hidden" }}
          >
            <AboutMeSection />
          </section>
          {/* Services Frame */}
          <section
            id="services-section"
            aria-labelledby="services-heading"
            style={{ width: "100%", overflow: "hidden" }}
          >
            <ServicesFrame />
          </section>
          {/* Contact Section */}
          <section
            id="contact-section"
            aria-labelledby="contact-heading"
            style={{ width: "100%", overflow: "hidden" }}
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
