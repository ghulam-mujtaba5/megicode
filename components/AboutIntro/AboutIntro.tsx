'use client';
import React from 'react';

import { motion } from 'framer-motion';

import { useTheme } from '../../context/ThemeContext';
import commonStyles from './AboutIntroCommon.module.css';
import darkStyles from './AboutIntroDark.module.css';
import lightStyles from './AboutIntroLight.module.css';

const AboutIntro: React.FC = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  return (
    <section className={`${commonStyles.introSection} ${themeStyles.introSection}`}>
      <div className={commonStyles.container}>
        <motion.div
          className={`${commonStyles.whoWeAre} ${themeStyles.whoWeAre}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={themeStyles['whoWeAre h2']}>Who We Are</h2>
          <p className={themeStyles['whoWeAre p']}>
            At Megicode, we are a next-generation technology company specializing in cutting-edge
            solutions in AI, ML, software development, and web applications. Our goal is to
            revolutionize the way businesses operate by building smart, scalable, and secure systems
            tailored to each client{"'"}s needs.
          </p>
        </motion.div>

        <div className={commonStyles.missionVision}>
          <motion.div
            className={`${commonStyles.mission} ${themeStyles.mission}`}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 52,
                  height: 52,
                  background: 'linear-gradient(135deg, #eaf1ff 0%, #f0f5ff 100%)',
                  borderRadius: 14,
                  boxShadow: '0 2px 12px rgba(69,115,223,0.14), inset 0 1px 1px #ffffff',
                  flexShrink: 0,
                }}
              >
                {/* Mission: Compass rose — directional, purpose-driven */}
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    fill="#4573df"
                    fillOpacity="0.08"
                    stroke="#4573df"
                    strokeWidth="1.2"
                    strokeOpacity="0.3"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="10"
                    fill="none"
                    stroke="#4573df"
                    strokeWidth="1"
                    strokeOpacity="0.2"
                    strokeDasharray="2 3"
                  />
                  {/* Compass needle — North (brand blue) */}
                  <path d="M16 4 L18 15 L16 14 L14 15 Z" fill="#4573df" fillOpacity="0.9" />
                  {/* South needle (light) */}
                  <path d="M16 28 L14 17 L16 18 L18 17 Z" fill="#4573df" fillOpacity="0.25" />
                  {/* East / West arms */}
                  <path d="M28 16 L17 14 L18 16 L17 18 Z" fill="#4573df" fillOpacity="0.3" />
                  <path d="M4 16 L15 18 L14 16 L15 14 Z" fill="#4573df" fillOpacity="0.3" />
                  {/* Center pivot */}
                  <circle cx="16" cy="16" r="2.8" fill="#4573df" fillOpacity="0.85" />
                  <circle cx="16" cy="16" r="1.2" fill="#ffffff" fillOpacity="0.9" />
                  {/* Cardinal tick marks */}
                  <line
                    x1="16"
                    y1="3"
                    x2="16"
                    y2="5"
                    stroke="#4573df"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeOpacity="0.5"
                  />
                  <line
                    x1="29"
                    y1="16"
                    x2="27"
                    y2="16"
                    stroke="#4573df"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeOpacity="0.35"
                  />
                  <line
                    x1="3"
                    y1="16"
                    x2="5"
                    y2="16"
                    stroke="#4573df"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeOpacity="0.35"
                  />
                  <line
                    x1="16"
                    y1="29"
                    x2="16"
                    y2="27"
                    stroke="#4573df"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeOpacity="0.3"
                  />
                  {/* Sparkle dots */}
                  <circle cx="7.5" cy="7.5" r="0.9" fill="#4573df" fillOpacity="0.35" />
                  <circle cx="24.5" cy="7.5" r="0.9" fill="#4573df" fillOpacity="0.35" />
                </svg>
              </span>
              <h3 className={themeStyles['mission h3']}>Our Mission</h3>
            </div>
            <p className={themeStyles['mission p']}>
              We deliver excellence in every project—building intelligent, scalable solutions that
              create lasting value for our clients, teams, and the global digital ecosystem.
            </p>
          </motion.div>

          <motion.div
            className={`${commonStyles.vision} ${themeStyles.vision}`}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 52,
                  height: 52,
                  background: 'linear-gradient(135deg, #eef6ff 0%, #f0f5ff 100%)',
                  borderRadius: 14,
                  boxShadow: '0 2px 12px rgba(69,115,223,0.12), inset 0 1px 1px #ffffff',
                  flexShrink: 0,
                }}
              >
                {/* Vision: Telescope pointing at a star — far-sighted, ambitious */}
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <circle cx="16" cy="16" r="14" fill="#4573df" fillOpacity="0.07" />
                  {/* Telescope barrel — wide end at bottom-left, eyepiece at top-right */}
                  <rect
                    x="7"
                    y="17"
                    width="12"
                    height="5"
                    rx="2.5"
                    fill="#4573df"
                    fillOpacity="0.18"
                    stroke="#4573df"
                    strokeWidth="1.4"
                    transform="rotate(-40 7 17)"
                  />
                  {/* Eyepiece (narrow end) */}
                  <rect
                    x="16.5"
                    y="9.5"
                    width="6"
                    height="3.5"
                    rx="1.75"
                    fill="#4573df"
                    fillOpacity="0.28"
                    stroke="#4573df"
                    strokeWidth="1.3"
                    transform="rotate(-40 16.5 9.5)"
                  />
                  {/* Tripod legs */}
                  <line
                    x1="12"
                    y1="22"
                    x2="8"
                    y2="28"
                    stroke="#4573df"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeOpacity="0.5"
                  />
                  <line
                    x1="14"
                    y1="22"
                    x2="16"
                    y2="28"
                    stroke="#4573df"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeOpacity="0.5"
                  />
                  {/* Sight line from eyepiece to star */}
                  <line
                    x1="20"
                    y1="9"
                    x2="27"
                    y2="4"
                    stroke="#4573df"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    strokeOpacity="0.4"
                    strokeLinecap="round"
                  />
                  {/* Star target */}
                  <circle
                    cx="27"
                    cy="4"
                    r="2.5"
                    fill="#4573df"
                    fillOpacity="0.1"
                    stroke="#4573df"
                    strokeWidth="1.2"
                  />
                  <circle cx="27" cy="4" r="1" fill="#4573df" fillOpacity="0.8" />
                  {/* Lens glint on barrel */}
                  <circle
                    cx="10.5"
                    cy="20"
                    r="1.8"
                    fill="#4573df"
                    fillOpacity="0.25"
                    stroke="#4573df"
                    strokeWidth="0.8"
                  />
                  <circle cx="10.5" cy="20" r="0.7" fill="#4573df" fillOpacity="0.5" />
                  {/* Small stars */}
                  <circle cx="24" cy="9" r="0.8" fill="#4573df" fillOpacity="0.45" />
                  <circle cx="22" cy="5" r="0.6" fill="#4573df" fillOpacity="0.3" />
                  <circle cx="28" cy="9" r="0.6" fill="#4573df" fillOpacity="0.35" />
                  <circle cx="6" cy="6" r="0.7" fill="#4573df" fillOpacity="0.25" />
                </svg>
              </span>
              <h3 className={themeStyles['vision h3']}>Our Vision</h3>
            </div>
            <p className={themeStyles['vision p']}>
              To set the ideal standard of quality and innovation in business and technology,
              shaping a better digital world.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutIntro;
