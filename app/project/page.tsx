
"use client";
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import NavBarDesktop from "../../components/NavBar_Desktop_Company/nav-bar-Company";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import Footer from "../../components/Footer/Footer";
import ThemeToggleIcon from "../../components/Icon/sbicon";

export default function ProjectPage() {
  const { theme } = useTheme();

  const linkedinUrl = "https://www.linkedin.com/company/megicode";
  const instagramUrl = "https://www.instagram.com/megicode/";
  const githubUrl = "https://github.com/megicode";
  const copyrightText = "Copyright 2025 Megicode. All Rights Reserved.";

  const sections = [
    { label: "Home", route: "/" },
    { label: "About", route: "/about" },
    { label: "Services", route: "/services" },
    { label: "Reviews", route: "/reviews" },
    { label: "Project", route: "/project" },
    { label: "Contact", route: "/contact" },
  ];

  return (
    <div style={{ backgroundColor: theme === "dark" ? "#1d2127" : "#ffffff", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Theme Toggle Icon */}
      <div id="theme-toggle" role="button" tabIndex={0}>
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

      {/* Projects Section */}
      <section id="project-section" aria-labelledby="project-heading" style={{ width: "100%", overflow: "hidden", padding: "2rem 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", background: theme === "dark" ? "#23272f" : "#fff", borderRadius: 16, boxShadow: theme === "dark" ? "0 2px 16px #1116" : "0 2px 16px #ccc6", padding: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, textAlign: "center", color: theme === "dark" ? "#fff" : "#1d2127", marginBottom: 24 }}>Our Portfolio & Projects</h1>
          <p style={{ marginBottom: 32, fontSize: 18, textAlign: "center", color: theme === "dark" ? "#cbd5e1" : "#555" }}>
            Explore a selection of Megicode’s recent projects, showcasing our expertise in web, mobile, and AI-driven solutions.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32 }}>
            <div style={{ background: theme === "dark" ? "#1d2127" : "#f9f9f9", padding: 24, borderRadius: 12, boxShadow: theme === "dark" ? "0 1px 8px #1114" : "0 1px 8px #ccc4" }}>
              <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>AI Analytics Dashboard</h2>
              <p style={{ marginBottom: 8, color: theme === "dark" ? "#cbd5e1" : "#666" }}>A scalable analytics platform for real-time business intelligence, built with Next.js and Python.</p>
              <span style={{ display: "inline-block", background: "#3b82f6", color: "#fff", padding: "4px 16px", borderRadius: 8, fontSize: 14 }}>Web App</span>
            </div>
            <div style={{ background: theme === "dark" ? "#1d2127" : "#f9f9f9", padding: 24, borderRadius: 12, boxShadow: theme === "dark" ? "0 1px 8px #1114" : "0 1px 8px #ccc4" }}>
              <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Mobile E-Commerce Suite</h2>
              <p style={{ marginBottom: 8, color: theme === "dark" ? "#cbd5e1" : "#666" }}>A cross-platform mobile app for seamless shopping experiences, featuring AI-powered recommendations.</p>
              <span style={{ display: "inline-block", background: "#3b82f6", color: "#fff", padding: "4px 16px", borderRadius: 8, fontSize: 14 }}>Mobile App</span>
            </div>
          </div>
        </div>
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
