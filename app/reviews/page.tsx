"use client";
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import NavBarDesktop from "../../components/NavBar_Desktop_Company/nav-bar-Company";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import Footer from "../../components/Footer/Footer";
import ThemeToggleIcon from "../../components/Icon/sbicon";
import ReviewsHero from "../../components/Reviews/ReviewsHero";
import ReviewsGrid from "../../components/Reviews/ReviewsGrid";

export default function ReviewsPage() {
  const { theme } = useTheme();

  const sections = [
    { label: "Home", route: "/" },
    { label: "About", route: "/about" },
    { label: "Services", route: "/services" },
    { label: "Reviews", route: "/reviews" },
    { label: "Project", route: "/project" },
    { label: "Contact", route: "/contact" },
  ];

  const linkedinUrl = "https://www.linkedin.com/company/megicode";
  const instagramUrl = "https://www.instagram.com/megicode/";
  const githubUrl = "https://github.com/megicode";
  const copyrightText = "Copyright 2025 Megicode. All Rights Reserved.";

  return (
    <div style={{ backgroundColor: theme === "dark" ? "#1d2127" : "#ffffff", minHeight: "100vh", overflowX: "hidden", color: theme === "dark" ? "#ffffff" : "#1d2127" }}>
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

      {/* Reviews Page Content */}
      <main>
        <ReviewsHero />
        <ReviewsGrid />
      </main>

      {/* Footer */}
      <Footer
        linkedinUrl={linkedinUrl}
        instagramUrl={instagramUrl}
        githubUrl={githubUrl}
        copyrightText={copyrightText}
      />
    </div>
  );
}
