"use client";
import React from 'react';
import NavBarDesktop from "../../components/NavBar_Desktop_Company/nav-bar-Company";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import Footer from "../../components/Footer/Footer";
import ProjectsShowcase from '../../components/Projects/ProjectsShowcase';
import ProjectHero from '../../components/Projects/ProjectHero';
import { useTheme } from "../../context/ThemeContext";
import ThemeToggleIcon from "../../components/Icon/sbicon";
import { useCallback } from "react";

export default function ProjectsPage() {
  const { theme, toggleTheme } = useTheme();
  
  const onDarkModeButtonContainerClick = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  // Define paths for social media links and contact info
  const linkedinUrl = "https://www.linkedin.com/company/megicode";
  const instagramUrl = "https://www.instagram.com/megicode/";
  const githubUrl = "https://github.com/megicode";
  const copyrightText = "Copyright 2025 Megicode. All Rights Reserved.";
  const contactEmail = "megicode@gmail.com";
  const contactPhoneNumber = "+123 456 7890";
  const sections = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'about', label: 'About', href: '/about' },
    { id: 'services', label: 'Services', href: '/services' },
    { id: 'projects', label: 'Projects', href: '/projects' },
    { id: 'reviews', label: 'Reviews', href: '/reviews' },
    { id: 'contact', label: 'Contact', href: '/contact' },
  ];  return (
    <div style={{ backgroundColor: theme === "dark" ? "#1d2127" : "#ffffff", overflowX: "hidden", position: "relative" }}>
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
      {/* Theme Toggle Icon */}
      <div id="theme-toggle" role="button" tabIndex={0} onClick={onDarkModeButtonContainerClick} style={{ position: 'absolute', top: 24, left: 24, zIndex: 20, cursor: 'pointer' }}>
        <ThemeToggleIcon />
      </div>
      <main className="relative z-10 min-h-screen">
        <NavBarDesktop />
        <NavBarMobile />
        <ProjectHero />
        <ProjectsShowcase />
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
