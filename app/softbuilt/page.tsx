"use client";
import React, { useCallback } from "react";
import { useTheme } from "../../context/ThemeContext";
import NavBarDesktop from "../../components/NavBar_Desktop_Company/nav-bar-Company";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import WelcomeFrame from "../../components/welcomeCompany/welcome";
import AboutMeSection from "../../components/AboutMeCompany/AboutMeSectionLight";
import ServicesFrame from "../../components/Services/ServicesFrame";
import ContactSection from "../../components/Contact/ConatctUs";
import Footer from "../../components/Footer/Footer";
import ThemeToggleIcon from "../../components/Icon/sbicon";

export default function SoftbuiltPage() {
  const { theme } = useTheme();

  const onDarkModeButtonContainerClick = useCallback(() => {
    // Add your dark mode toggle logic here
  }, []);

  // Define paths for social media links
  const linkedinUrl = "https://www.linkedin.com/in/ghulamujtabaofficial";
  const instagramUrl = "https://www.instagram.com/ghulamujtabaofficial/";
  const githubUrl = "https://github.com/ghulam-mujtaba5";
  const copyrightText = "Copyright 2024 Soft Built. All Rights Reserved.";
  const contactEmail = "softbuilt@ghulammujtaba.com";
  const contactPhoneNumber = "+123 456 7890";

  // Sample menu list override
  const sections = [
    { id: "home-section", label: "Home" },
    { id: "about-section", label: "About" },
    { id: "services-section", label: "Services" },
    { id: "contact-section", label: "Contact" },
  ];

  return (
    <div style={{ backgroundColor: theme === "dark" ? "#1d2127" : "#ffffff", overflowX: "hidden" }}>
      {/* Theme Toggle Icon */}
      <div id="theme-toggle" role="button" tabIndex={0} onClick={onDarkModeButtonContainerClick}>
        <ThemeToggleIcon />
      </div>

      {/* Desktop NavBar */}
      <nav id="desktop-navbar" aria-label="Main Navigation">
        <NavBarDesktop />
      </nav>

      {/* Mobile NavBar */}
      <nav id="mobile-navbar" aria-label="Mobile Navigation">
        <NavBarMobile sections={sections} />
      </nav>

      {/* Welcome Frame */}
      <section id="welcome-section" aria-labelledby="welcome-heading" style={{ width: "100%", overflow: "hidden" }}>
        <WelcomeFrame />
      </section>

      {/* About Me Section */}
      <section id="about-section" aria-labelledby="about-heading" style={{ width: "100%", overflow: "hidden" }}>
        <AboutMeSection />
      </section>

      {/* Services Frame */}
      <section id="services-section" aria-labelledby="services-heading" style={{ width: "100%", overflow: "hidden" }}>
        <ServicesFrame />
      </section>

      {/* Contact Section */}
      <section id="contact-section" aria-labelledby="contact-heading" style={{ width: "100%", overflow: "hidden" }}>
        <ContactSection email={contactEmail} phoneNumber={contactPhoneNumber} showCertificationBadge={false} />
      </section>

      {/* Footer */}
      <footer id="footer-section" aria-label="Footer" style={{ width: "100%", overflow: "hidden" }}>
        <Footer
          linkedinUrl={linkedinUrl}
          instagramUrl={instagramUrl}
          githubUrl={githubUrl}
          copyrightText={copyrightText}
        />
      </footer>
    </div>
  );
}
