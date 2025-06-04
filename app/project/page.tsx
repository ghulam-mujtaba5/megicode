'use client'
import React, { useEffect } from 'react';
import ProjectHero from '@/components/ProjectHero/ProjectHero';
import ProjectStats from '@/components/ProjectStats/ProjectStats';
import ProjectServices from '@/components/ProjectServices/ProjectServices';
import ProjectProcess from '@/components/ProjectProcess/ProjectProcess';
import ProjectShowcase from '@/components/ProjectShowcase/ProjectShowcase';
import ProjectTechnologies from '@/components/ProjectTechnologies/ProjectTechnologies';
import ProjectTimeline from '@/components/ProjectTimeline/ProjectTimeline';
import styles from './page.module.css';

const ProjectPage = () => {
  useEffect(() => {
    // Add smooth scroll behavior for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.hash) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <main className={styles.main}>
      <ProjectHero />
      <ProjectStats />
      <ProjectServices />
      <ProjectProcess />
      <ProjectShowcase />
      <ProjectTechnologies />
      <ProjectTimeline />
    </main>
  );
};

export default ProjectPage;
