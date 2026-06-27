'use client';
import React from 'react';
import {
  HiArrowTrendingUp,
  HiCodeBracket,
  HiCog6Tooth,
  HiMagnifyingGlass,
  HiPencilSquare,
  HiRocketLaunch,
} from 'react-icons/hi2';

import { motion } from 'framer-motion';

import { useTheme } from '../../context/ThemeContext';
import styles from './WorkflowProcess.module.css';

const STEPS = [
  {
    num: '01',
    icon: HiMagnifyingGlass,
    title: 'Discover',
    desc: 'We audit your stack, map your goals and surface the highest-leverage opportunities.',
    accent: '#4573df',
  },
  {
    num: '02',
    icon: HiPencilSquare,
    title: 'Design',
    desc: 'Architecture, wireframes and UI specs — all aligned to your brand and users.',
    accent: '#2d4fa2',
  },
  {
    num: '03',
    icon: HiCodeBracket,
    title: 'Build',
    desc: 'Engineers ship tested, reviewed code in focused sprints — not months.',
    accent: '#4573df',
  },
  {
    num: '04',
    icon: HiCog6Tooth,
    title: 'Automate',
    desc: 'Workflows, integrations and AI agents eliminate repetitive overhead from your ops.',
    accent: '#2d4fa2',
  },
  {
    num: '05',
    icon: HiRocketLaunch,
    title: 'Deploy',
    desc: 'Production-ready cloud deployment with CI/CD, observability and clear SLAs.',
    accent: '#ff9800',
  },
  {
    num: '06',
    icon: HiArrowTrendingUp,
    title: 'Scale',
    desc: 'We measure outcomes, optimize performance and grow alongside your business.',
    accent: '#4573df',
  },
] as const;

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const cardIn = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE_OUT } },
};

const headIn = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};

const WorkflowProcess: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section
      className={`${styles.section} ${isDark ? styles.sectionDark : styles.sectionLight}`}
      aria-labelledby="process-heading"
    >
      {/* Gradient blobs */}
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />

      <div className={styles.inner}>
        {/* Header */}
        <motion.header
          className={styles.head}
          variants={headIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <span
            className={`${styles.eyebrow} ${isDark ? styles.eyebrowDark : styles.eyebrowLight}`}
          >
            How We Work
          </span>
          <h2
            id="process-heading"
            className={`${styles.title} ${isDark ? styles.titleDark : styles.titleLight}`}
          >
            From idea to impact — <span className={styles.titleAccent}>battle-tested process.</span>
          </h2>
          <p
            className={`${styles.subtitle} ${isDark ? styles.subtitleDark : styles.subtitleLight}`}
          >
            Six focused steps that turn your vision into a shipped, scaling product.
          </p>
        </motion.header>

        {/* Steps grid */}
        <motion.ol
          className={styles.stepsRow}
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          role="list"
        >
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isLast = i === STEPS.length - 1;

            return (
              <React.Fragment key={step.num}>
                <motion.li
                  className={`${styles.stepCard} ${isDark ? styles.stepCardDark : styles.stepCardLight}`}
                  variants={cardIn}
                  role="listitem"
                >
                  {/* Number badge */}
                  <span
                    className={styles.numBadge}
                    style={{
                      color: step.accent,
                      borderColor: `${step.accent}30`,
                      background: `${step.accent}0f`,
                    }}
                  >
                    {step.num}
                  </span>

                  {/* Icon */}
                  <div
                    className={styles.iconWrap}
                    style={{
                      background: `${step.accent}14`,
                      border: `1.5px solid ${step.accent}28`,
                    }}
                    aria-hidden="true"
                  >
                    <Icon size={26} style={{ color: step.accent }} />
                  </div>

                  {/* Text */}
                  <h3
                    className={`${styles.stepTitle} ${isDark ? styles.stepTitleDark : styles.stepTitleLight}`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`${styles.stepDesc} ${isDark ? styles.stepDescDark : styles.stepDescLight}`}
                  >
                    {step.desc}
                  </p>
                </motion.li>

                {/* Connector arrow between steps */}
                {!isLast && (
                  <motion.div
                    className={`${styles.connector} ${isDark ? styles.connectorDark : styles.connectorLight}`}
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.15 + i * 0.08, ease: EASE_OUT }}
                    aria-hidden="true"
                  >
                    <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
                      <path
                        d="M2 8 L22 8"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeDasharray="3 2"
                      />
                      <path
                        d="M19 5 L24 8 L19 11"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
};

export default WorkflowProcess;
