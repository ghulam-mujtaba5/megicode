"use client";
import React from 'react';
import NewNavBar from "../../components/NavBar_Desktop_Company/NewNavBar";
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
  const githubUrl = "https://github.com/megicodes";
  const copyrightText = "Copyright 2025 Megicode. All Rights Reserved.";
  const contactEmail = "contact@megicode.com";
  const contactPhoneNumber = "+123 456 7890";
  const sections = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'about', label: 'About', href: '/about' },
    { id: 'services', label: 'Services', href: '/services' },
    { id: 'projects', label: 'Projects', href: '/projects' },
    { id: 'article', label: 'Article', href: '/article' },
    { id: 'contact', label: 'Contact', href: '/contact' },
    { id: 'reviews', label: 'Reviews', href: '/reviews' },
    { id: 'careers', label: 'Careers', href: '/careers' },
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
      <main className="relative z-10 min-h-screen" aria-label="Projects Main Content">
        {/* Theme Toggle Icon - consistent with services page */}
        <div id="theme-toggle" role="button" tabIndex={0} onClick={onDarkModeButtonContainerClick} style={{ margin: '0 0 0 1.5rem', cursor: 'pointer', alignSelf: 'flex-start' }}>
          <ThemeToggleIcon />
        </div>
        <h1 style={{position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden'}}>Projects Portfolio</h1>
        <NewNavBar />
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
