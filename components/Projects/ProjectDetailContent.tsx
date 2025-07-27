import React from "react";
import styles from "./ProjectDetailCommon.module.css";
import darkStyles from "./ProjectDetailDark.module.css";
import lightStyles from "./ProjectDetailLight.module.css";
import { useTheme } from "../../context/ThemeContext";
import Image from "next/image";
import { TechIcon } from "./TechIconMap";
import { sectionIconMap } from "./SectionIconMap";

interface Artifact {
  type: string;
  url: string;
}

interface ProjectDetail {
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

export default function ProjectDetailContent({ project }: { project: ProjectDetail }) {
  const { theme } = useTheme();
  const themeStyles = theme === "dark" ? darkStyles : lightStyles;
  return (
    <div className={`${styles.detailWrapper} ${themeStyles.detailWrapper}`}>  
      <h1 className={styles.title}>{project.title}</h1>
      <div className={styles.visualSectionHeader}>{sectionIconMap.Problem} <span>Problem</span></div>
      <div className={styles.visualSectionContent}>{project.problem}</div>
      {project.challenge && (
        <>
          <div className={styles.visualSectionHeader}>{sectionIconMap.Challenge} <span>Challenge</span></div>
          <div className={styles.visualSectionContent}>{project.challenge}</div>
        </>
      )}
      <div className={styles.visualSectionHeader}>{sectionIconMap.Solution} <span>Solution</span></div>
      <div className={styles.visualSectionContent}>{project.solution}</div>
      <div className={styles.visualSectionHeader}>{sectionIconMap.Impact} <span>Impact</span></div>
      <div className={styles.visualSectionContent}>{project.impact}</div>
      {project.implementation && (
        <>
          <div className={styles.visualSectionHeader}>{sectionIconMap.Implementation} <span>Implementation</span></div>
          <div className={styles.visualSectionContent}>{project.implementation}</div>
        </>
      )}
      {project.process && project.process.length > 0 && (
        <>
          <div className={styles.visualSectionHeader}>{sectionIconMap.Process} <span>Process</span></div>
          <div className={styles.timelineContainer}>
            {project.process.map((step, idx) => (
              <div key={idx} className={styles.timelineStep}>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineContent}>{step}</div>
              </div>
            ))}
          </div>
        </>
      )}
      {project.toolsUsed && project.toolsUsed.length > 0 && (
        <>
          <div className={styles.visualSectionHeader}>{sectionIconMap.Tools} <span>Tools Used</span></div>
          <div className={styles.iconRow}>
            {project.toolsUsed.map((tool, idx) => (
              <span key={idx} className={styles.techWithIcon}><TechIcon name={tool} size={28} />{tool}</span>
            ))}
          </div>
        </>
      )}
      {project.artifacts && project.artifacts.length > 0 && (
        <>
          <div className={styles.visualSectionHeader}>{sectionIconMap.Artifacts} <span>Artifacts</span></div>
          <div className={styles.artifactGallery}>
            {project.artifacts.map((artifact, idx) => (
              <a key={idx} href={artifact.url} target="_blank" rel="noopener noreferrer" className={styles.artifactCard}>
                <div className={styles.artifactType}>{artifact.type}</div>
                <div className={styles.artifactLinkIcon}>🔗</div>
              </a>
            ))}
          </div>
        </>
      )}
      {project.lessonsLearned && project.lessonsLearned.length > 0 && (
        <>
          <div className={styles.visualSectionHeader}>{sectionIconMap.Lessons} <span>Lessons Learned</span></div>
          <ul className={styles.lessonsList}>
            {project.lessonsLearned.map((lesson, idx) => (
              <li key={idx} className={styles.lessonItem}>{lesson}</li>
            ))}
          </ul>
        </>
      )}
      {project.nextSteps && (
        <>
          <div className={styles.visualSectionHeader}>{sectionIconMap.NextSteps} <span>Next Steps</span></div>
          <div className={styles.visualSectionContent}>{project.nextSteps}</div>
        </>
      )}
      {project.metrics && (
        <>
          <div className={styles.visualSectionHeader}>{sectionIconMap.Metrics} <span>Key Metrics</span></div>
          <div className={styles.metricsCardGrid}>
            {Object.entries(project.metrics).map(([k, v]) => (
              <div key={k} className={styles.metricCard}>
                <div className={styles.metricLabel}>{k}</div>
                <div className={styles.metricValue}>{v}</div>
              </div>
            ))}
          </div>
        </>
      )}
      <div className={styles.visualSectionHeader}>{sectionIconMap.TechStack} <span>Tech Stack</span></div>
      <div className={styles.iconRow}>
        {project.techStack.map((tech, idx) => (
          <span key={idx} className={styles.techWithIcon}><TechIcon name={tech} size={28} />{tech}</span>
        ))}
      </div>
      {project.github && (
        <div className={styles.visualSectionHeader}>
          <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
            View on GitHub ↗
          </a>
        </div>
      )}
      {project.screenshots && project.screenshots.length > 0 && (
        <>
          <div className={styles.visualSectionHeader}><span>Gallery</span></div>
          <div className={styles.screenshotGrid}>
            {project.screenshots.map((src, idx) => (
              <Image
                key={idx}
                src={src}
                alt={project.title + " screenshot " + (idx + 1)}
                width={400}
                height={250}
                className={styles.screenshotImg}
              />
            ))}
          </div>
        </>
      )}
      {project.testimonial && (
        <div className={styles.testimonialCard}>
          <div className={styles.testimonialIcon}>{sectionIconMap.Testimonial}</div>
          <blockquote className={styles.testimonialText}>{project.testimonial}</blockquote>
        </div>
      )}
    </div>
  );
}
