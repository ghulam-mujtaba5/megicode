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

const projectOfferMap: Record<
  string,
  {
    text: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  }
> = {
  'aesthetics-clinic-platform': {
    text: 'Want a similar clinic booking or operations system? Clinic AI Receptionist starts at $1,250 setup, and full clinic platforms start from $3,500.',
    primaryLabel: 'View Clinic Packages',
    primaryHref: '/pricing#packages',
    secondaryLabel: 'Book Fit Call',
    secondaryHref: '/contact?service=clinic-ai-receptionist',
  },
  'campusaxis-university-portal': {
    text: 'Need a platform with dashboards, resources, roles, and user workflows? Custom platforms start from $3,500.',
    primaryLabel: 'View Platform Packages',
    primaryHref: '/pricing#packages',
  },
  'wajdan-growth-system-website': {
    text: 'Need a conversion-focused website or funnel system? Start with a scope review before the build.',
    primaryLabel: 'Discuss My Website',
    primaryHref: '/contact?service=conversion-website',
  },
};

const ProjectsShowcase = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  return (
    <section className={`${styles.showcaseSection} ${themeStyles.showcaseSection}`}>
      <div className={styles.projectsGrid}>
        {projects.map((project) => {
          const offer = projectOfferMap[project.slug];

          return (
            <article
              key={project.slug}
              className={`${styles.projectCard} ${themeStyles.projectCard}`}
              aria-label={`Case study for ${project.title}`}
            >
              <div className={styles.imageContainer}>
                <Link href={`/projects/${project.slug}`} className={styles.imageLink}>
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={400}
                    height={300}
                    className={styles.projectImage}
                  />
                </Link>
                <div className={styles.cardBadges}>
                  {project.liveUrl && <span className={styles.liveBadge}>🟢 Live</span>}
                  {project.slug === 'campusaxis-university-portal' && (
                    <span className={styles.productBadge}>Community Initiative</span>
                  )}
                </div>
              </div>
              <div className={styles.projectContent}>
                <Link href={`/projects/${project.slug}`} className={styles.titleLink}>
                  <h3 className={`${styles.projectTitle} ${themeStyles.projectTitle}`}>
                    {project.title}
                  </h3>
                </Link>
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
                {offer && (
                  <div className={styles.offerBox}>
                    <p>{offer.text}</p>
                    <div className={styles.offerActions}>
                      <Link href={offer.primaryHref} className={styles.offerPrimary}>
                        {offer.primaryLabel} →
                      </Link>
                      {offer.secondaryHref && offer.secondaryLabel && (
                        <Link href={offer.secondaryHref} className={styles.offerSecondary}>
                          {offer.secondaryLabel} →
                        </Link>
                      )}
                    </div>
                  </div>
                )}
                <div className={styles.cardFooter}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className={`${styles.detailLink} ${themeStyles.detailLink}`}
                  >
                    View Case Study →
                  </Link>
                  {project.liveUrl && (
                    <span className={styles.liveUrlText}>
                      {project.liveUrl.replace('https://', '').replace('http://', '')}
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ProjectsShowcase;
