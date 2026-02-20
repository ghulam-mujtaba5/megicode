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
import { SITE_SOCIAL, getCopyrightText } from '@/lib/constants';

export default function ProjectsPage() {
  const { theme, toggleTheme } = useTheme();
  
  
  const onDarkModeButtonContainerClick = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  const { linkedinUrl, instagramUrl, githubUrl } = SITE_SOCIAL;
  const copyrightText = getCopyrightText();  return (
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
      <main id="main-content" className="relative z-10 min-h-screen" aria-label="Projects Main Content">
        {/* Theme Toggle Icon - consistent with services page */}
                <div id="theme-toggle" role="button" tabIndex={0} onClick={onDarkModeButtonContainerClick} style={{ margin: '0 0 0 1.5rem', cursor: 'pointer', alignSelf: 'flex-start', paddingTop: '1.5rem' }}>
          <ThemeToggleIcon />
        </div>

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
