'use client';
import React from 'react';
import commonStyles from './AboutIntroCommon.module.css';
import lightStyles from './AboutIntroLight.module.css';
import darkStyles from './AboutIntroDark.module.css';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

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
            At Megicode, we are a next-generation technology company specializing in cutting-edge solutions 
            in AI, ML, software development, and web applications. Our goal is to revolutionize the way 
            businesses operate by building smart, scalable, and secure systems tailored to each client's needs.
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
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
              <span 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  background: 'linear-gradient(135deg, #eaf1ff 0%, #f5f9ff 100%)',
                  borderRadius: 16,
                  boxShadow: '0 2px 12px #4573df22, inset 0 1px 1px #ffffff',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Add a subtle background pattern */}
                <svg width="100%" height="100%" style={{position: 'absolute', opacity: 0.1}} viewBox="0 0 56 56">
                  <pattern id="circuitPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M1 1h2v2H1V1zm4 4h2v2H5V5z" fill="#4573df"/>
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#circuitPattern)"/>
                </svg>
                
                <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer glow effect */}
                  <circle cx="20" cy="20" r="19" stroke="url(#missionGlowGradient)" strokeWidth="0.5" opacity="0.5">
                    <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite"/>
                  </circle>
                  
                  {/* Main circle with gradient */}
                  <circle cx="20" cy="20" r="18" fill="url(#missionGradient)" fillOpacity="0.1"/>
                  <circle cx="20" cy="20" r="18" stroke="url(#missionStroke)" strokeWidth="1.5"/>
                  
                  {/* Tech circuit paths with animations */}
                  <path d="M20 5C22 5 24 6 26 8" stroke="#4573df" strokeWidth="1.5" strokeLinecap="round">
                    <animate attributeName="d" values="M20 5C22 5 24 6 26 8;M20 5C23 5 25 7 26 9;M20 5C22 5 24 6 26 8" dur="3s" repeatCount="indefinite"/>
                  </path>
                  <path d="M28 20C28 18 29 16 31 14" stroke="#4573df" strokeWidth="1.5" strokeLinecap="round">
                    <animate attributeName="d" values="M28 20C28 18 29 16 31 14;M28 20C29 17 30 15 31 13;M28 20C28 18 29 16 31 14" dur="3.5s" repeatCount="indefinite"/>
                  </path>
                  
                  {/* Rotating inner ring */}
                  <circle cx="20" cy="20" r="13" stroke="#4573df" strokeWidth="1.5" strokeDasharray="2 4">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 20 20"
                      to="360 20 20"
                      dur="20s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  
                  {/* Inner rings with pulse effect */}
                  <circle cx="20" cy="20" r="9" stroke="#4573df" strokeWidth="1.5">
                    <animate attributeName="r" values="8;9;8" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="20" cy="20" r="5" stroke="#4573df" strokeWidth="1.5"/>
                  
                  {/* Center dot with glow */}
                  <circle cx="20" cy="20" r="2.5" fill="#4573df">
                    <animate attributeName="r" values="2;2.5;2" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="fill-opacity" values="1;0.8;1" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  
                  {/* Data points */}
                  <circle cx="20" cy="8" r="1" fill="#4573df">
                    <animate attributeName="r" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="32" cy="20" r="1" fill="#4573df">
                    <animate attributeName="r" values="0.5;1;0.5" dur="1.5s" begin="0.5s" repeatCount="indefinite"/>
                  </circle>
                  
                  {/* Enhanced gradients */}
                  <defs>
                    <linearGradient id="missionGradient" x1="20" y1="2" x2="20" y2="38" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#4573df"/>
                      <stop offset="50%" stopColor="#3d66cc"/>
                      <stop offset="100%" stopColor="#2d4fa2"/>
                    </linearGradient>
                    <linearGradient id="missionStroke" x1="20" y1="2" x2="20" y2="38" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#4573df"/>
                      <stop offset="100%" stopColor="#2d4fa2"/>
                    </linearGradient>
                    <radialGradient id="missionGlowGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                      <stop offset="0%" stopColor="#4573df"/>
                      <stop offset="100%" stopColor="#4573df" stopOpacity="0"/>
                    </radialGradient>
                  </defs>
                </svg>
              </span>
              <h3 className={themeStyles['mission h3']}>Our Mission</h3>
            </div>
            <p className={themeStyles['mission p']}>
              To deliver impactful AI-driven software and digital experiences that help organizations 
              innovate, optimize, and lead in their industries.
            </p>
          </motion.div>

          <motion.div 
            className={`${commonStyles.vision} ${themeStyles.vision}`}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
              <span 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  background: 'linear-gradient(135deg, #fffbe7 0%, #fff8e1 100%)',
                  borderRadius: 16,
                  boxShadow: '0 2px 12px #ffc10733, inset 0 1px 1px #ffffff',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Add a subtle background pattern */}
                <svg width="100%" height="100%" style={{position: 'absolute', opacity: 0.1}} viewBox="0 0 56 56">
                  <pattern id="dataPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M1 1h4v4H1V1zm10 10h4v4h-4v-4z" fill="#ffc107"/>
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#dataPattern)"/>
                </svg>
                
                <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Background glow */}
                  <circle cx="20" cy="20" r="19" fill="url(#visionGlowGradient)" fillOpacity="0.3">
                    <animate attributeName="fill-opacity" values="0.3;0.5;0.3" dur="3s" repeatCount="indefinite"/>
                  </circle>
                  
                  {/* Main eye shape with enhanced details */}
                  <path 
                    d="M6 20C6 20 13 8 20 8C27 8 34 20 34 20C34 20 27 32 20 32C13 32 6 20 6 20Z" 
                    stroke="url(#visionStroke)" 
                    strokeWidth="1.5"
                    fill="white"
                  >
                    <animate attributeName="d" 
                      values="M6 20C6 20 13 8 20 8C27 8 34 20 34 20C34 20 27 32 20 32C13 32 6 20 6 20Z;
                              M7 20C7 20 13 9 20 9C27 9 33 20 33 20C33 20 27 31 20 31C13 31 7 20 7 20Z;
                              M6 20C6 20 13 8 20 8C27 8 34 20 34 20C34 20 27 32 20 32C13 32 6 20 6 20Z"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </path>
                  
                  {/* Tech circuit paths with pulse effect */}
                  <g>
                    <path d="M20 11V13" stroke="#ffc107" strokeWidth="1.5" strokeLinecap="round">
                      <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
                    </path>
                    <path d="M20 27V29" stroke="#ffc107" strokeWidth="1.5" strokeLinecap="round">
                      <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" begin="0.5s" repeatCount="indefinite"/>
                    </path>
                    <path d="M11 20H13" stroke="#ffc107" strokeWidth="1.5" strokeLinecap="round">
                      <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" begin="1s" repeatCount="indefinite"/>
                    </path>
                    <path d="M27 20H29" stroke="#ffc107" strokeWidth="1.5" strokeLinecap="round">
                      <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" begin="1.5s" repeatCount="indefinite"/>
                    </path>
                  </g>
                  
                  {/* Rotating scan line */}
                  <line x1="20" y1="15" x2="20" y2="25" stroke="#ffc107" strokeWidth="0.5" opacity="0.5">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 20 20"
                      to="360 20 20"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </line>
                  
                  {/* Inner eye details */}
                  <circle cx="20" cy="20" r="6" stroke="#ffc107" strokeWidth="1.5">
                    <animate attributeName="r" values="5;6;5" dur="3s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="20" cy="20" r="3" fill="#ffc107">
                    <animate attributeName="r" values="2.5;3;2.5" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="fill-opacity" values="1;0.8;1" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  
                  {/* Data flow visualization */}
                  <path 
                    d="M8 18C14 18 14 22 20 22C26 22 26 18 32 18" 
                    stroke="#ffc107" 
                    strokeWidth="1.5" 
                    strokeDasharray="2 2"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;-8"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </path>
                  
                  {/* Enhanced gradients */}
                  <defs>
                    <linearGradient id="visionGradient" x1="20" y1="8" x2="20" y2="32" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#ffc107"/>
                      <stop offset="50%" stopColor="#ffb300"/>
                      <stop offset="100%" stopColor="#ff9800"/>
                    </linearGradient>
                    <linearGradient id="visionStroke" x1="6" y1="20" x2="34" y2="20" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#ffc107"/>
                      <stop offset="100%" stopColor="#ff9800"/>
                    </linearGradient>
                    <radialGradient id="visionGlowGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                      <stop offset="0%" stopColor="#ffc107"/>
                      <stop offset="100%" stopColor="#ffc107" stopOpacity="0"/>
                    </radialGradient>
                  </defs>
                </svg>
              </span>
              <h3 className={themeStyles['vision h3']}>Our Vision</h3>
            </div>
            <p className={themeStyles['vision p']}>
              To become a global leader in AI and intelligent software systems, enabling businesses to 
              unlock the full potential of data and automation.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutIntro;
