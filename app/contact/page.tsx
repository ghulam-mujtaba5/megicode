"use client";
import React, { useCallback } from "react";
import { useTheme } from "../../context/ThemeContext";
import NavBarDesktop from "../../components/NavBar_Desktop_Company/nav-bar-Company";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import Footer from "../../components/Footer/Footer";
import ThemeToggleIcon from "../../components/Icon/sbicon";
import ContactSection from "../../components/Contact/ConatctUs";
import ContactInfoCard from "../../components/Contact/ContactInfoCard";
import ParticleBackground from "../../components/ParticleBackground/ParticleBackground";

export default function ContactPage() {
  const { theme, toggleTheme } = useTheme();
  const onDarkModeButtonContainerClick = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  const linkedinUrl = "https://www.linkedin.com/company/megicode";
  const instagramUrl = "https://www.instagram.com/megicode/";
  const githubUrl = "https://github.com/megicode";
  const copyrightText = "Copyright 2025 Megicode. All Rights Reserved.";
  const contactEmail = "megicode@gmail.com";
  const contactPhoneNumber = "+123 456 7890";

  return (
    <div style={{ backgroundColor: theme === "dark" ? "#1d2127" : "#ffffff", overflowX: "hidden", position: "relative" }}>
      {/* Subtle animated background */}
      <ParticleBackground />
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "150vh",
        pointerEvents: "none",
        zIndex: 0
      }}>
        {/* Background container */}
      </div>
      <main className="relative z-10 min-h-screen">
        {/* Theme Toggle Icon - consistent with services page */}
        <div id="theme-toggle" role="button" tabIndex={0} onClick={onDarkModeButtonContainerClick} style={{ margin: '0 0 0 1.5rem', cursor: 'pointer', alignSelf: 'flex-start' }}>
          <ThemeToggleIcon />
        </div>
        <NavBarDesktop />
        <NavBarMobile />
        <ContactInfoCard />
        {/* Business Hours Section */}
        <div style={{
          maxWidth: 400,
          margin: "0 auto 1.5rem auto",
          padding: "1.1rem 1.5rem 1rem 1.5rem",
          borderRadius: 16,
          background: theme === "dark" ? "#23272f" : "#f5f7fa",
          boxShadow: theme === "dark"
            ? "0 2px 12px 0 rgba(30,33,39,0.10)"
            : "0 2px 12px 0 rgba(69,115,223,0.05)",
          border: theme === "dark" ? "1px solid #23272f" : "1px solid #e5e7eb",
          textAlign: "center",
          fontSize: 17,
          color: theme === "dark" ? "#cbd5e1" : "#475569",
          fontWeight: 500,
          letterSpacing: 0.1,
        }}>
          <span role="img" aria-label="clock" style={{marginRight: 8}}>552</span>
          <span>Business Hours: <span style={{color: theme === "dark" ? "#fff" : "#1d2127", fontWeight: 700}}>24/7</span></span>
        </div>
        <section id="contact-section" aria-labelledby="contact-heading" style={{ width: "100%", overflow: "hidden", padding: "2rem 0" }}>
          <ContactSection email={contactEmail} phoneNumber={contactPhoneNumber} showCertificationBadge={false} />
        </section>
        <Footer
          linkedinUrl={linkedinUrl}
          instagramUrl={instagramUrl}
          githubUrl={githubUrl}
          copyrightText={copyrightText}
        />
      </main>
    </div>
  );
}
