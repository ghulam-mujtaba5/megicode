'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useTheme } from '../../context/ThemeContext';
import { projects } from '../../data/projects';
import styles from './ProjectsShowcaseCommon.module.css';
import darkStyles from './ProjectsShowcaseDark.module.css';
import lightStyles from './ProjectsShowcaseLight.module.css';

export interface Artifact {
  type: string;
  url: string;
}

export interface Project {
  slug: string;
  title: string;
  category: 'uiux' | 'mobile' | 'desktop' | 'ai' | 'data-engineering' | 'web';
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
  liveUrl?: string;
  screenshots?: string[];
  metrics?: Record<string, string>;
  testimonial?: string;
  image: string;
  clientName?: string;
  clientIndustry?: string;
  duration?: string;
  teamSize?: string;
  overview?: string;
}

const ProjectsShowcase = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  return (
    <section className={`${styles.showcaseSection} ${themeStyles.showcaseSection}`}>
      <div className={styles.projectsGrid}>
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className={styles.projectCardLink}
          >
            <div
              className={`${styles.projectCard} ${themeStyles.projectCard}`}
              tabIndex={0}
              aria-label={`View details for ${project.title}`}
            >
              <div className={styles.imageContainer}>
                <Image
                  src={project.image}
                  alt={project.title}
                  width={400}
                  height={300}
                  className={styles.projectImage}
                />
                <div className={styles.cardBadges}>
                  {project.liveUrl && <span className={styles.liveBadge}>🟢 Live</span>}
                  {project.slug === 'campusaxis-university-portal' && (
                    <span className={styles.productBadge}>Community Initiative</span>
                  )}
                </div>
              </div>
              <div className={styles.projectContent}>
                <h3 className={`${styles.projectTitle} ${themeStyles.projectTitle}`}>
                  {project.title}
                </h3>
                <p className={`${styles.projectDescription} ${themeStyles.projectDescription}`}>
                  {project.description}
                </p>
                <div className={styles.technologies}>
                  {project.techStack.map((tech, index) => (
                    <span key={index} className={`${styles.techTag} ${themeStyles.techTag}`}>
                      {tech}
                    </span>
                  ))}
                </div>
                <div className={styles.cardFooter}>
                  <span className={`${styles.detailLink} ${themeStyles.detailLink}`}>
                    View Case Study →
                  </span>
                  {project.liveUrl && (
                    <span className={styles.liveUrlText}>
                      {project.liveUrl.replace('https://', '').replace('http://', '')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProjectsShowcase;
