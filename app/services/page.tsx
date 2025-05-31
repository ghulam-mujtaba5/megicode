
"use client";
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import NavBarDesktop from "../../components/NavBar_Desktop_Company/nav-bar-Company";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import Footer from "../../components/Footer/Footer";
import ThemeToggleIcon from "../../components/Icon/sbicon";

export default function ServicesPage() {
  const { theme } = useTheme();

  const linkedinUrl = "https://www.linkedin.com/company/megicode";
  const instagramUrl = "https://www.instagram.com/megicode/";
  const githubUrl = "https://github.com/megicode";
  const copyrightText = "Copyright 2025 Megicode. All Rights Reserved.";

  const sections = [
    { id: "services-section", label: "Services" },
  ];

  const services = [
    { icon: "🧠", title: "AI-Powered Software Development" },
    { icon: "🎨", title: "UI/UX Design" },
    { icon: "🖥️", title: "Desktop Applications" },
    { icon: "🌐", title: "Web Applications" },
    { icon: "📱", title: "Mobile Applications" },
    { icon: "📊", title: "Data Science & AI" },
    { icon: "🧬", title: "AI Agent Development" },
    { icon: "📈", title: "Big Data Analytics" },
    { icon: "📤", title: "Data Scraping & Automation" },
    { icon: "📉", title: "Data Visualization" },
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

      {/* Services Section */}
      <section id="services-section" aria-labelledby="services-heading" style={{ width: "100%", overflow: "hidden", padding: "2rem 0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", background: theme === "dark" ? "#23272f" : "#fff", borderRadius: 16, boxShadow: theme === "dark" ? "0 2px 16px #1116" : "0 2px 16px #ccc6", padding: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, textAlign: "center", color: theme === "dark" ? "#fff" : "#1d2127", marginBottom: 24 }}>Our Services</h1>
          <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, listStyle: "none", padding: 0, margin: 0 }}>
            {services.map((service, idx) => (
              <li key={idx} style={{ display: "flex", alignItems: "center", gap: 16, background: theme === "dark" ? "#1d2127" : "#f9f9f9", borderRadius: 12, padding: 20, boxShadow: theme === "dark" ? "0 1px 8px #1114" : "0 1px 8px #ccc4" }}>
                <span style={{ fontSize: 32 }}>{service.icon}</span>
                <span style={{ fontSize: 18, fontWeight: 500, color: theme === "dark" ? "#fff" : "#1d2127" }}>{service.title}</span>
              </li>
            ))}
          </ul>
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
