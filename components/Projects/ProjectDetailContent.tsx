import React from "react";
import styles from "./ProjectDetailCommon.module.css";
import darkStyles from "./ProjectDetailDark.module.css";
import lightStyles from "./ProjectDetailLight.module.css";
import { useTheme } from "../../context/ThemeContext";
import Image from "next/image";
import { TechIcon } from "./TechIconMap";
import { SectionIcon } from "./SectionIconMap";

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
      <div className={styles.visualSectionHeader}><SectionIcon name="Problem" /> <span>Problem</span></div>
      <div className={styles.sectionText}>{project.problem}</div>
      {project.challenge && (
        <>
          <div className={styles.visualSectionHeader}><SectionIcon name="Challenge" /> <span>Challenge</span></div>
          <div className={styles.sectionText}>{project.challenge}</div>
        </>
      )}
      <div className={styles.visualSectionHeader}><SectionIcon name="Solution" /> <span>Solution</span></div>
      <div className={styles.sectionText}>{project.solution}</div>
      <div className={styles.visualSectionHeader}><SectionIcon name="Impact" /> <span>Impact</span></div>
      <div className={styles.sectionText}>{project.impact}</div>
      {project.implementation && (
        <>
          <div className={styles.visualSectionHeader}><SectionIcon name="Implementation" /> <span>Implementation</span></div>
          <div className={styles.sectionText}>{project.implementation}</div>
        </>
      )}
      {project.process && project.process.length > 0 && (
        <>
          <div className={styles.visualSectionHeader}><SectionIcon name="Process" /> <span>Process</span></div>
          <div className={styles.timelineWrapper}>
            {project.process.map((step, idx) => (
              <div key={idx} className={styles.timelineStep}>
                <div className={styles.timelineIcon}><SectionIcon name="Process Step" size={18} /></div>
                <div className={styles.timelineContent}>{step}</div>
                {idx < project.process.length - 1 && <div className={styles.timelineConnector} />}
              </div>
            ))}
          </div>
        </>
      )}
      {project.toolsUsed && project.toolsUsed.length > 0 && (
        <>
          <div className={styles.visualSectionHeader}><SectionIcon name="Tools Used" /> <span>Tools Used</span></div>
          <div className={styles.iconRow}>
            {project.toolsUsed.map((tool, idx) => (
              <span key={idx} className={styles.techWithIcon}><TechIcon name={tool} size={28} />{tool}</span>
            ))}
          </div>
        </>
      )}
      {project.artifacts && project.artifacts.length > 0 && (
        <>
          <div className={styles.visualSectionHeader}><SectionIcon name="Artifacts" /> <span>Artifacts</span></div>
          <div className={styles.artifactGallery}>
            {project.artifacts.map((artifact, idx) => (
              <a key={idx} href={artifact.url} target="_blank" rel="noopener noreferrer" className={styles.artifactCard}>
                <SectionIcon name="Artifacts" size={18} />
                <span>{artifact.type}</span>
              </a>
            ))}
          </div>
        </>
      )}
      {project.lessonsLearned && project.lessonsLearned.length > 0 && (
        <>
          <div className={styles.visualSectionHeader}><SectionIcon name="Lessons Learned" /> <span>Lessons Learned</span></div>
          <div className={styles.lessonsList}>
            {project.lessonsLearned.map((lesson, idx) => (
              <div key={idx} className={styles.lessonCard}><SectionIcon name="Lessons Learned" size={18} /> {lesson}</div>
            ))}
          </div>
        </>
      )}
      {project.nextSteps && (
        <>
          <div className={styles.visualSectionHeader}><SectionIcon name="Next Steps" /> <span>Next Steps</span></div>
          <div className={styles.sectionText}>{project.nextSteps}</div>
        </>
      )}
      {project.metrics && (
        <>
          <div className={styles.visualSectionHeader}><SectionIcon name="Impact" /> <span>Key Metrics</span></div>
          <div className={styles.metricsCards}>
            {Object.entries(project.metrics).map(([k, v]) => (
              <div key={k} className={styles.metricCard}>
                <SectionIcon name="Impact" size={20} />
                <span className={styles.metricLabel}>{k}</span>
                <span className={styles.metricValue}>{v}</span>
              </div>
            ))}
          </div>
        </>
      )}
      <div className={styles.visualSectionHeader}><SectionIcon name="Tech Stack" /> <span>Tech Stack</span></div>
      <div className={styles.iconRow}>
        {project.techStack.map((tech, idx) => (
          <span key={idx} className={styles.techWithIcon}><TechIcon name={tech} size={28} />{tech}</span>
        ))}
      </div>
      {project.github && (
        <div className={styles.section}>
          <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
            View on GitHub
          </a>
        </div>
      )}
      {project.screenshots && project.screenshots.length > 0 && (
        <div className={styles.screenshotsSection}>
          <strong>Screenshots:</strong>
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
        </div>
      )}
      {project.testimonial && (
        <blockquote className={styles.testimonial}>{project.testimonial}</blockquote>
      )}
    </div>
  );
}
