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
}

import { useState } from "react";

export default function ProjectDetailContent({ project }: { project: ProjectDetail }) {
  const { theme } = useTheme();
  const themeStyles = theme === "dark" ? darkStyles : lightStyles;
  return (
    <div className={`${styles.detailWrapper} ${themeStyles.detailWrapper}`}>  
      <h1 className={styles.title}>{project.title}</h1>
      <div className={styles.visualSectionHeader}><SectionIcon name="Problem" /> <span>Problem</span></div>
      <div className={styles.metricCard} style={{display:'flex',alignItems:'center',gap:12,background:'var(--background, #f5f7fa)'}}>
        <SectionIcon name="Problem" size={26} />
        <span style={{fontWeight:600,fontSize:'1.1rem'}}>{project.problem}</span>
      </div>
      {project.challenge && (
        <div>
          <div className={styles.visualSectionHeader}><SectionIcon name="Challenge" /> <span>Challenge</span></div>
          <div className={styles.metricCard} style={{display:'flex',alignItems:'center',gap:12,background:'var(--background, #fffbe7)'}}>
            <SectionIcon name="Challenge" size={26} />
            <span style={{fontWeight:600,fontSize:'1.1rem'}}>{project.challenge}</span>
          </div>
        </div>
      )}
      <div className={styles.visualSectionHeader}><SectionIcon name="Solution" /> <span>Solution</span></div>
      <div className={styles.metricCard} style={{display:'flex',alignItems:'center',gap:12,background:'var(--background, #e6f7ff)'}}>
        <SectionIcon name="Solution" size={26} />
        <span style={{fontWeight:600,fontSize:'1.1rem'}}>{project.solution}</span>
      </div>
      <div className={styles.visualSectionHeader}><SectionIcon name="Impact" /> <span>Impact</span></div>
      <div className={styles.metricCard} style={{display:'flex',alignItems:'center',gap:12,background:'var(--background, #e7fff3)'}}>
        <SectionIcon name="Impact" size={26} />
        <span style={{fontWeight:600,fontSize:'1.1rem'}}>{project.impact}</span>
      </div>
      {project.implementation && (
        <div>
          <div className={styles.visualSectionHeader}><SectionIcon name="Implementation" /> <span>Implementation</span></div>
          <div className={styles.metricCard} style={{display:'flex',alignItems:'center',gap:12,background:'var(--background, #f0f7ff)'}}>
            <SectionIcon name="Implementation" size={26} />
            <span style={{fontWeight:600,fontSize:'1.1rem'}}>{project.implementation}</span>
          </div>
        </div>
      )}
      {project.process && project.process.length > 0 && (
        <div>
          <div className={styles.visualSectionHeader}><SectionIcon name="Process" /> <span>Process</span></div>
          <div className={styles.timelineWrapper}>
            {project.process.map((step, idx) => (
              <div key={idx} className={styles.timelineStep}>
                <div className={styles.timelineIcon}><SectionIcon name="Process Step" size={22} /></div>
                <div className={styles.timelineContent}><span style={{fontWeight:500}}>{step}</span></div>
                {idx < project.process.length - 1 && <div className={styles.timelineConnector} />}
              </div>
            ))}
          </div>
        </div>
      )}
      {project.toolsUsed && project.toolsUsed.length > 0 && (
        <div>
          <div className={styles.visualSectionHeader}><SectionIcon name="Tools Used" /> <span>Tools Used</span></div>
          <div className={styles.iconRow}>
            {project.toolsUsed.map((tool, idx) => (
              <span key={idx} className={styles.techWithIcon}><TechIcon name={tool} size={28} /><span style={{marginLeft:4,fontWeight:500}}>{tool}</span></span>
            ))}
          </div>
        </div>
      )}
      {project.artifacts && project.artifacts.length > 0 && (
        <div>
          <div className={styles.visualSectionHeader}><SectionIcon name="Artifacts" /> <span>Artifacts</span></div>
          <div className={styles.artifactGallery}>
            {project.artifacts.map((artifact, idx) => (
              <a key={idx} href={artifact.url} target="_blank" rel="noopener noreferrer" className={styles.artifactCard}>
                <SectionIcon name="Artifacts" size={22} />
                <span style={{fontWeight:500}}>{artifact.type}</span>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{marginLeft:8}} aria-hidden="true"><circle cx="10" cy="10" r="9" stroke="#4573df" strokeWidth="2"/><path d="M7 10l2 2 4-4" stroke="#22c55e" strokeWidth="2" fill="none"/></svg>
              </a>
            ))}
          </div>
        </div>
      )}
      {project.lessonsLearned && project.lessonsLearned.length > 0 && (
        <div>
          <div className={styles.visualSectionHeader}><SectionIcon name="Lessons Learned" /> <span>Lessons Learned</span></div>
          <div className={styles.lessonsList}>
            {project.lessonsLearned.map((lesson, idx) => (
              <div key={idx} className={styles.lessonCard}>
                <SectionIcon name="Lessons Learned" size={22} />
                <span style={{fontWeight:500}}>{lesson}</span>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{marginLeft:8}} aria-hidden="true"><rect x="3" y="3" width="14" height="14" rx="4" stroke="#f6c700" strokeWidth="2"/><path d="M7 10l2 2 4-4" stroke="#22c55e" strokeWidth="2" fill="none"/></svg>
              </div>
            ))}
          </div>
        </div>
      )}
      {project.nextSteps && (
        <div>
          <div className={styles.visualSectionHeader}><SectionIcon name="Next Steps" /> <span>Next Steps</span></div>
          <div className={styles.metricCard} style={{display:'flex',alignItems:'center',gap:12,background:'var(--background, #e7f7ff)'}}>
            <SectionIcon name="Next Steps" size={26} />
            <span style={{fontWeight:600,fontSize:'1.1rem'}}>{project.nextSteps}</span>
          </div>
        </div>
      )}
      {project.metrics && (
        <div>
          <div className={styles.visualSectionHeader}><SectionIcon name="Impact" /> <span>Key Metrics</span></div>
          <div className={styles.metricsCards}>
            {Object.entries(project.metrics).map(([k, v]) => (
              <div key={k} className={styles.metricCard} style={{display:'flex',alignItems:'center',gap:10}}>
                <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2" y="2" width="16" height="16" rx="5" stroke="#4573df" strokeWidth="2"/><path d="M7 10l2 2 4-4" stroke="#22c55e" strokeWidth="2" fill="none"/></svg>
                <span className={styles.metricLabel}>{k}</span>
                <span className={styles.metricValue}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className={styles.visualSectionHeader}><SectionIcon name="Tech Stack" /> <span>Tech Stack</span></div>
      <div className={styles.iconRow}>
        {project.techStack.map((tech, idx) => (
          <span key={idx} className={styles.techWithIcon}><TechIcon name={tech} size={28} /><span style={{marginLeft:4,fontWeight:500}}>{tech}</span></span>
        ))}
      </div>
      {project.github && (
        <div className={styles.section}>
          <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" style={{verticalAlign:'middle',marginRight:6}} aria-hidden="true"><circle cx="10" cy="10" r="9" stroke="#23272f" strokeWidth="2"/><path d="M7 10l2 2 4-4" stroke="#4573df" strokeWidth="2" fill="none"/></svg>
            View on GitHub
          </a>
        </div>
      )}
      {project.liveUrl && (
        <div className={styles.section}>
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" style={{verticalAlign:'middle',marginRight:6}} aria-hidden="true"><circle cx="10" cy="10" r="9" stroke="#4573df" strokeWidth="2"/><path d="M6 10h8M13 7l3 3-3 3" stroke="#22c55e" strokeWidth="2" fill="none"/></svg>
            Visit Live Site
          </a>
        </div>
      )}
      {/* Screenshot gallery with modal/zoom */}
      {project.screenshots && project.screenshots.length > 0 && (
        <ScreenshotGallery images={project.screenshots} projectTitle={project.title} />
      )}
      {project.testimonial && (
        <blockquote className={styles.testimonial}>
          <SectionIcon name="Testimonial" size={24} />
          <span style={{marginLeft:10}}>{project.testimonial}</span>
        </blockquote>
      )}

    {/* ScreenshotGallery component for modal/zoom, below */}
    </div>
  );
}

// ScreenshotGallery: visual gallery with modal/zoom and SVG overlays
function ScreenshotGallery({ images, projectTitle }: { images: string[], projectTitle: string }) {
  const [openIdx, setOpenIdx] = useState<number|null>(null);
  return (
    <div className={styles.screenshotsSection}>
      <div className={styles.visualSectionHeader} style={{marginBottom:8}}>
        <SectionIcon name="Artifacts" /> <span>Screenshots</span>
      </div>
      <div className={styles.screenshotGrid}>
        {images.map((src, idx) => (
          <div key={idx} style={{position:'relative',cursor:'zoom-in'}} onClick={() => setOpenIdx(idx)}>
            <Image
              src={src}
              alt={projectTitle + " screenshot " + (idx + 1)}
              width={400}
              height={250}
              className={styles.screenshotImg}
              style={{border:'2px solid #4573df'}}
            />
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{position:'absolute',top:8,right:8,background:'#fff',borderRadius:'50%',boxShadow:'0 2px 8px rgba(69,115,223,0.11)'}} aria-hidden="true"><rect x="8" y="8" width="16" height="16" rx="4" stroke="#4573df" strokeWidth="2"/><path d="M12 16h8M16 12v8" stroke="#4573df" strokeWidth="2"/></svg>
          </div>
        ))}
      </div>
      {openIdx !== null && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(20,24,31,0.86)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={() => setOpenIdx(null)}>
          <Image
            src={images[openIdx]}
            alt={projectTitle + " screenshot " + (openIdx+1)}
            width={900}
            height={600}
            style={{borderRadius:18,boxShadow:'0 8px 48px #23272f'}}
          />
          <button onClick={e => {e.stopPropagation();setOpenIdx(null);}} style={{position:'absolute',top:32,right:32,background:'#fff',border:'none',borderRadius:'50%',width:44,height:44,boxShadow:'0 2px 8px #23272f',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}} aria-label="Close gallery">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="13" stroke="#4573df" strokeWidth="2"/><path d="M10 10l8 8M18 10l-8 8" stroke="#ff9800" strokeWidth="2"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}
