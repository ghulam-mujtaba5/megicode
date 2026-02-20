"use client";
import React, { useCallback } from "react";
import { notFound } from "next/navigation";
import ProjectDetailContent from "../../../components/Projects/ProjectDetailContent";
import NewNavBar from "../../../components/NavBar_Desktop_Company/NewNavBar";
import NavBarMobile from "../../../components/NavBar_Mobile/NavBar-mobile";
import Footer from "../../../components/Footer/Footer";
import { useTheme } from "../../../context/ThemeContext";
import ThemeToggleIcon from "../../../components/Icon/sbicon";
import styles from './ProjectDetailLayout.module.css';
import { projects } from "../../../data/projects";

export default function ProjectDetailClient({ slug }: { slug: string }) {
  const { theme, toggleTheme } = useTheme();

  const onDarkModeButtonContainerClick = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return notFound();
  }

  const linkedinUrl = "https://www.linkedin.com/company/megicode";
  const instagramUrl = "https://www.instagram.com/megicode/";
  const githubUrl = "https://github.com/megicodes";
  const copyrightText = "Copyright 2025 Megicode. All Rights Reserved.";

  return (
    <div className={styles.pageWrapper} style={{ backgroundColor: theme === "dark" ? "#1d2127" : "#ffffff" }}>
      <main className="relative z-10 min-h-screen">
        <div 
          id="theme-toggle" 
          role="button" 
          tabIndex={0} 
          onClick={onDarkModeButtonContainerClick} 
          className={styles.themeToggle}
          aria-label="Toggle theme"
        >
          <ThemeToggleIcon />
        </div>
        <NewNavBar />
        <NavBarMobile />
        <ProjectDetailContent project={project} />
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
