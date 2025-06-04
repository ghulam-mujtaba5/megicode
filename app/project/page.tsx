'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { LoadingSpinner } from '@/components/Icon/LoadingSpinner';
import { useTheme } from '@/context/ThemeContext';
import ProjectHero from '@/components/ProjectHero/ProjectHero';
import ProjectTestimonials from '@/components/ProjectTestimonials/ProjectTestimonials';

// Dynamic imports with loading states for better UX
const ProjectOverview = dynamic(() => import('@/components/ProjectOverview/ProjectOverview'), {
  loading: () => <LoadingSpinner aria-label="Loading overview section" />
});

const ProjectShowcase = dynamic(() => import('@/components/ProjectShowcase/ProjectShowcase'), {
  loading: () => <LoadingSpinner aria-label="Loading project showcase" />
});

const ProjectServices = dynamic(() => import('@/components/ProjectServices/ProjectServices'), {
  loading: () => <LoadingSpinner aria-label="Loading services section" />
});

const ProjectStack = dynamic(() => import('@/components/ProjectStack/ProjectStack'), {
  loading: () => <LoadingSpinner aria-label="Loading technology stack" />
});

const ProjectProcess = dynamic(() => import('@/components/ProjectProcess/ProjectProcess'), {
  loading: () => <LoadingSpinner aria-label="Loading process section" />
});

// Removed ProjectMetrics and ProjectIndustries for a more focused project page

const ProjectCaseStudies = dynamic(() => import('@/components/ProjectCaseStudies/ProjectCaseStudies'), {
  loading: () => <LoadingSpinner aria-label="Loading case studies" />
});

// Section definitions for navigation
const sections = [
  { id: 'overview', label: 'Overview', ariaLabel: 'Project overview section' },
  { id: 'services', label: 'Services', ariaLabel: 'Our services section' },
  { id: 'projects', label: 'Projects', ariaLabel: 'Featured projects section' },
  { id: 'process', label: 'Process', ariaLabel: 'Our process section' },
  { id: 'technologies', label: 'Tech Stack', ariaLabel: 'Technology stack section' },
  { id: 'testimonials', label: 'Testimonials', ariaLabel: 'Client testimonials section' }
];

const ProjectPage = () => {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState('overview');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSkipLinkVisible, setIsSkipLinkVisible] = useState(false);
  const mainContentRef = useRef<HTMLElement>(null);

  // Debounced scroll handler for performance
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + 100;
    const sectionElements = document.querySelectorAll('section[id]');

    sectionElements.forEach((section) => {
      const sectionTop = (section as HTMLElement).offsetTop;
      const sectionHeight = section.clientHeight;
      const sectionId = section.getAttribute('id') || '';

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        setActiveSection(sectionId);
        // Update URL hash without scrolling
        history.replaceState(null, '', `#${sectionId}`);
      }
    });
  }, []);

  // Smooth scroll with keyboard support
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      element.focus({ preventScroll: true });
    }
  }, []);

  // Keyboard navigation
  const handleKeyNavigation = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      setIsSkipLinkVisible(true);
    }
    
    if (e.key === 'Escape') {
      mainContentRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    const scrollHandler = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    window.addEventListener('keydown', handleKeyNavigation);
    setIsLoaded(true);

    return () => {
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('keydown', handleKeyNavigation);
    };
  }, [handleScroll, handleKeyNavigation]);

  return (
    <>
      <a
        href="#main-content"
        className={`${styles.skipLink} ${isSkipLinkVisible ? styles.visible : ''}`}
        onFocus={() => setIsSkipLinkVisible(true)}
        onBlur={() => setIsSkipLinkVisible(false)}
      >
        Skip to main content
      </a>

      <nav className={styles.pageNav} role="navigation" aria-label="Main navigation">
        <div className={styles.navContent}>
          {sections.map(({ id, label, ariaLabel }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`${styles.navLink} ${activeSection === id ? styles.active : ''}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(id);
              }}
              aria-current={activeSection === id ? 'true' : undefined}
              aria-label={ariaLabel}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <main
        id="main-content"
        ref={mainContentRef}
        className={`${styles.main} ${isLoaded ? styles.loaded : ''}`}
        tabIndex={-1}
      >
        <section 
          id="overview" 
          className={`${styles.section} ${styles.fadeInUp}`}
          aria-label="Project Overview"
        >
          <ProjectHero />
          <ProjectOverview />
        </section>

        <section 
          id="services" 
          className={`${styles.section} ${styles.fadeInUp}`}
          aria-label="Our Services"
        >
          <ProjectServices />
        </section>

        <section 
          id="projects" 
          className={`${styles.section} ${styles.fadeInUp}`}
          aria-label="Featured Projects"
        >
          <ProjectShowcase />
          <ProjectCaseStudies />
        </section>



        <section 
          id="process" 
          className={`${styles.section} ${styles.fadeInUp}`}
          aria-label="Our Process"
        >
          <ProjectProcess />
        </section>

        <section 
          id="technologies" 
          className={`${styles.section} ${styles.fadeInUp}`}
          aria-label="Technology Stack"
        >
          <ProjectStack />
        </section>

        <section
          id="testimonials"
          className={`${styles.section} ${styles.fadeInUp}`}
          aria-label="Client Testimonials"
        >
          <ProjectTestimonials />
        </section>
      </main>
    </>
  );
};

export default ProjectPage;
