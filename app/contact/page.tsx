
"use client";
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import NavBarDesktop from "../../components/NavBar_Desktop_Company/nav-bar-Company";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import Footer from "../../components/Footer/Footer";
import ThemeToggleIcon from "../../components/Icon/sbicon";

export default function ContactPage() {
  const { theme } = useTheme();

  const linkedinUrl = "https://www.linkedin.com/company/megicode";
  const instagramUrl = "https://www.instagram.com/megicode/";
  const githubUrl = "https://github.com/megicode";
  const copyrightText = "Copyright 2025 Megicode. All Rights Reserved.";
  const contactEmail = "megicode@gmail.com";
  const contactPhoneNumber = "+123 456 7890";

  const sections = [
    { id: "contact-section", label: "Contact" },
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

      {/* Contact Section */}
      <section id="contact-section" aria-labelledby="contact-heading" style={{ width: "100%", overflow: "hidden", padding: "2rem 0" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", background: theme === "dark" ? "#23272f" : "#fff", borderRadius: 16, boxShadow: theme === "dark" ? "0 2px 16px #1116" : "0 2px 16px #ccc6", padding: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, textAlign: "center", color: theme === "dark" ? "#fff" : "#1d2127", marginBottom: 24 }}>Contact Megicode</h1>
          <p style={{ marginBottom: 24, fontSize: 18, textAlign: "center", color: theme === "dark" ? "#cbd5e1" : "#555" }}>
            Ready to start your next project or have a question? Reach out to our team and we’ll get back to you promptly.
          </p>
          <form style={{ display: "flex", flexDirection: "column", gap: 16 }} action={`mailto:${contactEmail}`} method="POST" encType="text/plain">
            <div>
              <label htmlFor="name" style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>Name</label>
              <input type="text" id="name" name="name" required style={{ width: "100%", border: "1px solid #ccc", borderRadius: 8, padding: 12, fontSize: 16 }} />
            </div>
            <div>
              <label htmlFor="email" style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>Email</label>
              <input type="email" id="email" name="email" required style={{ width: "100%", border: "1px solid #ccc", borderRadius: 8, padding: 12, fontSize: 16 }} />
            </div>
            <div>
              <label htmlFor="message" style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>Message</label>
              <textarea id="message" name="message" rows={5} required style={{ width: "100%", border: "1px solid #ccc", borderRadius: 8, padding: 12, fontSize: 16 }}></textarea>
            </div>
            <button type="submit" style={{ width: "100%", background: "#3b82f6", color: "#fff", padding: 12, borderRadius: 8, fontWeight: 600, fontSize: 18, border: 0, cursor: "pointer", transition: "background 0.2s" }}>Send Message</button>
          </form>
          <div style={{ marginTop: 32, textAlign: "center", color: theme === "dark" ? "#cbd5e1" : "#666" }}>
            <p>Email: <a href={`mailto:${contactEmail}`} style={{ color: "#3b82f6", textDecoration: "underline" }}>{contactEmail}</a></p>
            <p>Phone: <a href={`tel:${contactPhoneNumber}`} style={{ color: "#3b82f6", textDecoration: "underline" }}>{contactPhoneNumber}</a></p>
            <p>Location: Remote / Global</p>
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
