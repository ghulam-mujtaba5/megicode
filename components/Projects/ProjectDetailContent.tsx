import React, { useState } from 'react';
import {
  FaArrowRight,
  FaBriefcase,
  FaClock,
  FaExternalLinkAlt,
  FaGithub,
  FaIndustry,
  FaQuoteLeft,
  FaUsers,
} from 'react-icons/fa';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

import { useTheme } from '../../context/ThemeContext';
import styles from './ProjectDetailCommon.module.css';
import darkStyles from './ProjectDetailDark.module.css';
import lightStyles from './ProjectDetailLight.module.css';
import { SectionIcon } from './SectionIconMap';
import { TechIcon } from './TechIconMap';

const LottiePlayer = dynamic(() => import('../LottiePlayer/LottiePlayer'), { ssr: false });

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
  clientName?: string;
  clientIndustry?: string;
  duration?: string;
  teamSize?: string;
  overview?: string;
}

const categoryLabels: Record<string, string> = {
  web: 'Web Development',
  ai: 'AI & Machine Learning',
  mobile: 'Mobile App',
  desktop: 'Desktop App',
  uiux: 'UI/UX Design',
  'data-engineering': 'Data Engineering',
};

export default function ProjectDetailContent({ project }: { project: ProjectDetail }) {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  return (
    <article className={`${styles.caseStudy} ${themeStyles.caseStudy}`}>
      {/* ═══ HERO — two-column on desktop ═══ */}
      <header className={`${styles.hero} ${themeStyles.hero}`}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <span className={styles.categoryBadge}>
              {categoryLabels[project.category] || project.category}
            </span>
            <h1 className={styles.heroTitle}>{project.title}</h1>
            {project.overview && <p className={styles.heroOverview}>{project.overview}</p>}
            <div className={styles.heroActions}>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.heroCta} ${themeStyles.heroCta}`}
                >
                  Visit Live Site <FaExternalLinkAlt size={13} />
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.heroCtaSecondary} ${themeStyles.heroCtaSecondary}`}
                >
                  <FaGithub size={15} /> View Code
                </a>
              )}
            </div>
          </div>
          {project.image && (
            <div className={`${styles.heroImageWrap} ${themeStyles.heroImageWrap}`}>
              <Image
                src={project.image}
                alt={project.title}
                width={560}
                height={360}
                className={styles.heroImage}
                priority
              />
            </div>
          )}
        </div>
      </header>

      {/* ═══ QUICK FACTS BAR ═══ */}
      {(project.clientName || project.clientIndustry || project.duration || project.teamSize) && (
        <div className={`${styles.quickFacts} ${themeStyles.quickFacts}`}>
          {project.clientName && (
            <div className={styles.factItem}>
              <FaBriefcase size={15} className={styles.factIcon} />
              <div>
                <span className={styles.factLabel}>Client</span>
                <span className={styles.factValue}>{project.clientName}</span>
              </div>
            </div>
          )}
          {project.clientIndustry && (
            <div className={styles.factItem}>
              <FaIndustry size={15} className={styles.factIcon} />
              <div>
                <span className={styles.factLabel}>Industry</span>
                <span className={styles.factValue}>{project.clientIndustry}</span>
              </div>
            </div>
          )}
          {project.duration && (
            <div className={styles.factItem}>
              <FaClock size={15} className={styles.factIcon} />
              <div>
                <span className={styles.factLabel}>Duration</span>
                <span className={styles.factValue}>{project.duration}</span>
              </div>
            </div>
          )}
          {project.teamSize && (
            <div className={styles.factItem}>
              <FaUsers size={15} className={styles.factIcon} />
              <div>
                <span className={styles.factLabel}>Team</span>
                <span className={styles.factValue}>{project.teamSize}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ KEY METRICS — prominent strip ═══ */}
      {project.metrics && (
        <section className={styles.metricsSection}>
          <div className={styles.metricsGrid}>
            {Object.entries(project.metrics).map(([label, value]) => (
              <div key={label} className={`${styles.metricCard} ${themeStyles.metricCard}`}>
                <span className={styles.metricValue}>{value}</span>
                <span className={styles.metricLabel}>{label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ CHALLENGE ═══ */}
      <section className={styles.contentSection}>
        <div className={styles.sectionHeader}>
          <SectionIcon name="Problem" size={22} />
          <h2 className={styles.sectionTitle}>The Challenge</h2>
        </div>
        <p
          className={`${styles.sectionText} ${styles.sectionTextCard} ${themeStyles.sectionTextCard}`}
        >
          {project.problem}
        </p>
        {project.challenge && (
          <div className={`${styles.challengeCallout} ${themeStyles.challengeCallout}`}>
            <SectionIcon name="Challenge" size={18} />
            <p>{project.challenge}</p>
          </div>
        )}
      </section>

      <div className={styles.sectionDivider} />

      {/* ═══ SOLUTION ═══ */}
      <section className={styles.contentSection}>
        <div className={styles.sectionHeader}>
          <SectionIcon name="Solution" size={22} />
          <h2 className={styles.sectionTitle}>Our Solution</h2>
        </div>
        <p
          className={`${styles.sectionText} ${styles.sectionTextCard} ${themeStyles.sectionTextCard}`}
        >
          {project.solution}
        </p>
      </section>

      {/* ═══ TESTIMONIAL ═══ */}
      {project.testimonial && (
        <>
          <div className={styles.sectionDivider} />
          <section className={`${styles.testimonialSection} ${themeStyles.testimonialSection}`}>
            <FaQuoteLeft size={32} className={styles.quoteIcon} />
            <blockquote className={styles.testimonialText}>{project.testimonial}</blockquote>
          </section>
        </>
      )}

      <div className={styles.sectionDivider} />

      {/* ═══ PROCESS — step cards grid ═══ */}
      {project.process && project.process.length > 0 && (
        <section className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <SectionIcon name="Process" size={22} />
            <h2 className={styles.sectionTitle}>Our Process</h2>
          </div>
          <div className={styles.stepsGrid}>
            {project.process.map((step, idx) => (
              <div key={idx} className={`${styles.stepCard} ${themeStyles.stepCard}`}>
                <div className={styles.stepNum}>{idx + 1}</div>
                <p className={styles.stepText}>{step}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className={styles.sectionDivider} />

      {/* ═══ IMPACT & RESULTS ═══ */}
      <section className={styles.contentSection}>
        <div className={styles.sectionHeader}>
          <SectionIcon name="Impact" size={22} />
          <h2 className={styles.sectionTitle}>Impact & Results</h2>
        </div>
        <p
          className={`${styles.sectionText} ${styles.sectionTextCard} ${themeStyles.sectionTextCard}`}
        >
          {project.impact}
        </p>
      </section>

      {/* ═══ IMPLEMENTATION ═══ */}
      {project.implementation && (
        <section className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <SectionIcon name="Implementation" size={22} />
            <h2 className={styles.sectionTitle}>Implementation</h2>
          </div>
          <p
            className={`${styles.sectionText} ${styles.sectionTextCard} ${themeStyles.sectionTextCard}`}
          >
            {project.implementation}
          </p>
        </section>
      )}

      {/* ═══ TECH STACK ═══ */}
      <section className={styles.contentSection}>
        <div className={styles.sectionHeader}>
          <SectionIcon name="Tech Stack" size={22} />
          <h2 className={styles.sectionTitle}>Tech Stack</h2>
        </div>
        <div className={styles.techGrid}>
          {project.techStack.map((tech, idx) => (
            <div key={idx} className={`${styles.techChip} ${themeStyles.techChip}`}>
              <TechIcon name={tech} size={22} />
              <span>{tech}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ TOOLS USED ═══ */}
      {project.toolsUsed &&
        project.toolsUsed.length > 0 &&
        JSON.stringify(project.toolsUsed) !== JSON.stringify(project.techStack) && (
          <section className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <SectionIcon name="Tools Used" size={22} />
              <h2 className={styles.sectionTitle}>Tools & Technologies</h2>
            </div>
            <div className={styles.techGrid}>
              {project.toolsUsed.map((tool, idx) => (
                <div key={idx} className={`${styles.techChip} ${themeStyles.techChip}`}>
                  <TechIcon name={tool} size={22} />
                  <span>{tool}</span>
                </div>
              ))}
            </div>
          </section>
        )}

      <div className={styles.sectionDivider} />

      {/* ═══ LESSONS LEARNED ═══ */}
      {project.lessonsLearned && project.lessonsLearned.length > 0 && (
        <section className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <SectionIcon name="Lessons Learned" size={22} />
            <h2 className={styles.sectionTitle}>Key Takeaways</h2>
          </div>
          <div className={styles.lessonsGrid}>
            {project.lessonsLearned.map((lesson, idx) => (
              <div key={idx} className={`${styles.lessonCard} ${themeStyles.lessonCard}`}>
                <span className={styles.lessonNumber}>{idx + 1}</span>
                <p>{lesson}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ NEXT STEPS ═══ */}
      {project.nextSteps && (
        <section className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <SectionIcon name="Next Steps" size={22} />
            <h2 className={styles.sectionTitle}>What&apos;s Next</h2>
          </div>
          <p
            className={`${styles.sectionText} ${styles.sectionTextCard} ${themeStyles.sectionTextCard}`}
          >
            {project.nextSteps}
          </p>
        </section>
      )}

      {/* ═══ ARTIFACTS ═══ */}
      {project.artifacts && project.artifacts.length > 0 && (
        <section className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <SectionIcon name="Artifacts" size={22} />
            <h2 className={styles.sectionTitle}>Artifacts & Deliverables</h2>
          </div>
          <div className={styles.artifactsList}>
            {project.artifacts.map((artifact, idx) => (
              <a
                key={idx}
                href={artifact.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.artifactLink} ${themeStyles.artifactLink}`}
              >
                <SectionIcon name="Artifacts" size={16} />
                <span>{artifact.type}</span>
                <FaExternalLinkAlt size={11} />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ═══ SCREENSHOTS ═══ */}
      {project.screenshots && project.screenshots.length > 0 && (
        <section className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <SectionIcon name="Artifacts" size={22} />
            <h2 className={styles.sectionTitle}>Screenshots</h2>
          </div>
          <ScreenshotGallery images={project.screenshots} projectTitle={project.title} />
        </section>
      )}

      {/* ═══ CTA ═══ */}
      <section className={`${styles.ctaSection} ${themeStyles.ctaSection}`}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <LottiePlayer
            src="/lottie/10_product_launch_rocket.json"
            loop
            style={{ width: 96, height: 96 }}
            ariaLabel="Animated rocket illustration"
          />
        </div>
        <h2 className={styles.ctaTitle}>Want a Similar Solution?</h2>
        <p className={styles.ctaText}>
          Let&apos;s discuss how Megicode can build something like this for your business.
        </p>
        <Link href="/contact" className={`${styles.ctaButton} ${themeStyles.ctaButton}`}>
          Start a Conversation <FaArrowRight size={13} />
        </Link>
      </section>
    </article>
  );
}

function ScreenshotGallery({ images, projectTitle }: { images: string[]; projectTitle: string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <>
      <div className={styles.screenshotGrid}>
        {images.map((src, idx) => (
          <button
            key={idx}
            className={styles.screenshotButton}
            onClick={() => setOpenIdx(idx)}
            aria-label={`View ${projectTitle} screenshot ${idx + 1}`}
          >
            <Image
              src={src}
              alt={`${projectTitle} screenshot ${idx + 1}`}
              width={480}
              height={300}
              className={styles.screenshotImg}
            />
          </button>
        ))}
      </div>
      {openIdx !== null && (
        <div
          className={styles.screenshotModal}
          onClick={() => setOpenIdx(null)}
          role="dialog"
          aria-label="Screenshot preview"
        >
          <Image
            src={images[openIdx]}
            alt={`${projectTitle} screenshot ${openIdx + 1}`}
            width={1000}
            height={650}
            className={styles.screenshotModalImg}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenIdx(null);
            }}
            className={styles.screenshotClose}
            aria-label="Close preview"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
