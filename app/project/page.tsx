'use client'
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import ProjectHero from '@/components/ProjectHero/ProjectHero';
const ProjectOverview = dynamic(() => import('@/components/ProjectOverview/ProjectOverview'));
const ProjectShowcase = dynamic(() => import('@/components/ProjectShowcase/ProjectShowcase'));
const ProjectServices = dynamic(() => import('@/components/ProjectServices/ProjectServices'));
const ProjectStack = dynamic(() => import('@/components/ProjectStack/ProjectStack'));
import ProjectProcess from '@/components/ProjectProcess/ProjectProcess';
import ProjectMetrics from '@/components/ProjectMetrics/ProjectMetrics';

// Dynamic imports for performance
const ProjectIndustries = dynamic(() => import('@/components/ProjectIndustries/ProjectIndustries'), {
  ssr: false,
  loading: () => <div className={styles.loading}>Loading...</div>
});

const ProjectCaseStudies = dynamic(() => import('@/components/ProjectCaseStudies/ProjectCaseStudies'), {
  ssr: false,
  loading: () => <div className={styles.loading}>Loading...</div>
});

const ProjectPage = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initialize animations and scroll handling
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id') || '';

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    // Add smooth scroll behavior for navigation
    const handleNavClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.hash) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    // Initialize intersection observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('section').forEach((section) => {
      observer.observe(section);
    });

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleNavClick);
    setIsLoaded(true);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleNavClick);
      observer.disconnect();
    };
  }, []);

  return (
    <main className={`${styles.main} ${isLoaded ? styles.loaded : ''}`}>
      <nav className={styles.pageNav}>
        <div className={styles.navContent}>
          {['overview', 'services', 'projects', 'process', 'technologies'].map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className={`${styles.navLink} ${activeSection === section ? styles.active : ''}`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </a>
          ))}
        </div>
      </nav>

      <section id="overview" className={styles.section}>
        <ProjectHero />
        <ProjectOverview />
      </section>

      <section id="services" className={styles.section}>
        <ProjectServices />
      </section>

      <section id="projects" className={styles.section}>
        <ProjectShowcase />
        <ProjectCaseStudies />
      </section>

      <section id="industries" className={styles.section}>
        <ProjectIndustries />
        <ProjectMetrics />
      </section>

      <section id="process" className={styles.section}>
        <ProjectProcess />
      </section>      <section id="technologies" className={styles.section}>
        <ProjectStack />
      </section>
    </main>
  );
};

export default ProjectPage;
