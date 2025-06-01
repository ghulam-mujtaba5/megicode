
"use client";
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import NavBarDesktop from "../../components/NavBar_Desktop_Company/nav-bar-Company";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import Footer from "../../components/Footer/Footer";
import ThemeToggleIcon from "../../components/Icon/sbicon";

export default function ReviewsPage() {
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

      {/* Reviews Section */}
      <section id="reviews-section" aria-labelledby="reviews-heading" style={{ width: "100%", overflow: "hidden", padding: "2rem 0" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", background: theme === "dark" ? "#23272f" : "#fff", borderRadius: 16, boxShadow: theme === "dark" ? "0 2px 16px #1116" : "0 2px 16px #ccc6", padding: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, textAlign: "center", color: theme === "dark" ? "#fff" : "#1d2127", marginBottom: 24 }}>Client Reviews & Testimonials</h1>
          <p style={{ marginBottom: 32, fontSize: 18, textAlign: "center", color: theme === "dark" ? "#cbd5e1" : "#555" }}>
            Discover what our clients say about Megicode. We pride ourselves on delivering exceptional results and building lasting partnerships.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <blockquote style={{ background: theme === "dark" ? "#1d2127" : "#f9f9f9", padding: 24, borderRadius: 12, boxShadow: theme === "dark" ? "0 1px 8px #1114" : "0 1px 8px #ccc4" }}>
              <p style={{ fontStyle: "italic", fontSize: 18, color: theme === "dark" ? "#cbd5e1" : "#444" }}>“Megicode transformed our digital presence. Their team is creative, responsive, and truly understands our business needs.”</p>
              <footer style={{ marginTop: 16, textAlign: "right", fontWeight: 600, color: theme === "dark" ? "#fff" : "#1d2127" }}>— Sarah L., CEO, TechNova</footer>
            </blockquote>
            <blockquote style={{ background: theme === "dark" ? "#1d2127" : "#f9f9f9", padding: 24, borderRadius: 12, boxShadow: theme === "dark" ? "0 1px 8px #1114" : "0 1px 8px #ccc4" }}>
              <p style={{ fontStyle: "italic", fontSize: 18, color: theme === "dark" ? "#cbd5e1" : "#444" }}>“Professional, reliable, and innovative. Highly recommended for any business looking to scale with technology.”</p>
              <footer style={{ marginTop: 16, textAlign: "right", fontWeight: 600, color: theme === "dark" ? "#fff" : "#1d2127" }}>— David M., Founder, MarketLeap</footer>
            </blockquote>
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
