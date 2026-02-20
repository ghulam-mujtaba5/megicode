"use client";
import React from 'react';
import styles from './ProjectsShowcaseCommon.module.css';
import darkStyles from './ProjectsShowcaseDark.module.css';
import lightStyles from './ProjectsShowcaseLight.module.css';
import { useTheme } from '../../context/ThemeContext';
import { projects } from "../../data/projects";
import Image from 'next/image';

export interface Artifact {
  type: string;
  url: string;
}

export interface Project {
  slug: string;
  title: string;
  category: 'uiux' | 'mobile' | 'desktop' | 'ai' | 'data-engineering';
  description: string;
  problem: string;
  challenge?: string;
  solution: string;
  impact: string;
  implementation?: string;
  process?: string[];
  toolsUsed?: string[];
  artifacts?: Artifact[];
  lessonsLearned?: string[];
  nextSteps?: string;
  techStack: string[];
  github?: string;
  screenshots?: string[];
  metrics?: Record<string, string>;
  testimonial?: string;
  image: string;
}

import Link from "next/link";
const ProjectsShowcase = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;
  const [activeCategory, setActiveCategory] = React.useState<string>('all');
  const categories = [
    { key: 'all', label: 'All' },
    { key: 'uiux', label: 'UI/UX' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'desktop', label: 'Desktop' },
    { key: 'ai', label: 'AI' },
    { key: 'data-engineering', label: 'Data Engineering' }
  ];

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(project => project.category === activeCategory);

  return (
    <section className={`${styles.showcaseSection} ${themeStyles.showcaseSection}`}>
      <div className={styles.categoryFilter}>
        {categories.map(({ key, label }) => (
          <button
            key={key}
            className={`${styles.filterButton} ${themeStyles.filterButton} ${activeCategory === key ? styles.activeFilter : ''}`}
            onClick={() => setActiveCategory(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={styles.projectsGrid}>
        {filteredProjects.map((project) => (
          <Link key={project.slug} href={`/projects/${project.slug}`} className={styles.projectCardLink}>
            <div className={`${styles.projectCard} ${themeStyles.projectCard}`} tabIndex={0} aria-label={`View details for ${project.title}`}>
              <div className={styles.imageContainer}>
                <Image
                  src={project.image}
                  alt={project.title}
                  width={400}
                  height={300}
                  className={styles.projectImage}
                />
              </div>
              <div className={styles.projectContent}>
                <h3 className={`${styles.projectTitle} ${themeStyles.projectTitle}`}>{project.title}</h3>
                <p className={`${styles.projectDescription} ${themeStyles.projectDescription}`}>{project.description}</p>
                <div className={styles.technologies}>
                  {project.techStack.map((tech, index) => (
                    <span key={index} className={`${styles.techTag} ${themeStyles.techTag}`}>{tech}</span>
                  ))}
                </div>
                <span className={`${styles.detailLink} ${themeStyles.detailLink}`}>View Details →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProjectsShowcase;
