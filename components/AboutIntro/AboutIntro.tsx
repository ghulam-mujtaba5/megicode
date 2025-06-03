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
                  width: 52,
                  height: 52,
                  background: 'linear-gradient(135deg, #eaf1ff 0%, #f5f9ff 100%)',
                  borderRadius: 14,
                  boxShadow: '0 2px 12px #4573df22, inset 0 1px 1px #ffffff'
                }}
              >
                {/* Mission Icon */}
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Main circle background */}
                  <circle cx="16" cy="16" r="15" fill="url(#missionGradient)" fillOpacity="0.08"/>
                  <circle cx="16" cy="16" r="15" stroke="url(#missionStroke)" strokeWidth="1.5">
                    <animate
                      attributeName="stroke-dasharray"
                      values="0,100;100,0"
                      dur="3s"
                      begin="0s"
                      repeatCount="1"
                    />
                  </circle>
                  
                  {/* Rotating outer ring */}
                  <circle 
                    cx="16" 
                    cy="16" 
                    r="11" 
                    stroke="#4573df" 
                    strokeWidth="1.5" 
                    strokeDasharray="3 3"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 16 16"
                      to="360 16 16"
                      dur="20s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Middle ring with pulse */}
                  <circle 
                    cx="16" 
                    cy="16" 
                    r="7" 
                    stroke="#4573df" 
                    strokeWidth="1.5"
                  >
                    <animate
                      attributeName="stroke-opacity"
                      values="1;0.6;1"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  
                  {/* Center target dot with pulse and glow */}
                  <circle cx="16" cy="16" r="3" fill="#4573df">
                    <animate 
                      attributeName="r" 
                      values="2.5;3;2.5" 
                      dur="2s" 
                      repeatCount="indefinite"
                    />
                    <animate 
                      attributeName="fill-opacity" 
                      values="1;0.8;1" 
                      dur="2s" 
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Subtle crosshair lines with fade */}
                  <g>
                    <animate
                      attributeName="opacity"
                      values="0.4;0.8;0.4"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                    <path d="M16 5V7" stroke="#4573df" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M16 25V27" stroke="#4573df" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M27 16H25" stroke="#4573df" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M7 16H5" stroke="#4573df" strokeWidth="1.5" strokeLinecap="round"/>
                  </g>
                  
                  {/* Gradient definitions */}
                  <defs>
                    <linearGradient id="missionGradient" x1="16" y1="1" x2="16" y2="31" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#4573df"/>
                      <stop offset="1" stopColor="#2d4fa2"/>
                    </linearGradient>
                    <linearGradient id="missionStroke" x1="16" y1="1" x2="16" y2="31" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#4573df"/>
                      <stop offset="1" stopColor="#2d4fa2"/>
                    </linearGradient>
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
                  width: 52,
                  height: 52,
                  background: 'linear-gradient(135deg, #fffbe7 0%, #fff8e1 100%)',
                  borderRadius: 14,
                  boxShadow: '0 2px 12px #ffc10733, inset 0 1px 1px #ffffff'
                }}
              >
                {/* Vision Icon */}
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Background glow with pulse */}
                  <circle cx="16" cy="16" r="15" fill="url(#visionGradient)" fillOpacity="0.1">
                    <animate
                      attributeName="fill-opacity"
                      values="0.1;0.2;0.1"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  
                  {/* Main eye shape with reveal animation */}
                  <path 
                    d="M4 16C4 16 10 6 16 6C22 6 28 16 28 16C28 16 22 26 16 26C10 26 4 16 4 16Z" 
                    stroke="url(#visionStroke)" 
                    strokeWidth="1.5" 
                    fill="white"
                  >
                    <animate
                      attributeName="stroke-dasharray"
                      values="0,100;100,0"
                      dur="3s"
                      begin="0s"
                      repeatCount="1"
                    />
                  </path>
                  
                  {/* Scanning effect lines */}
                  <path 
                    d="M7 14C12 14 12 18 16 18C20 18 20 14 25 14" 
                    stroke="#ffc107" 
                    strokeWidth="1.5" 
                    strokeDasharray="2 2"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0 0; 0 2; 0 0"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </path>
                  
                  {/* Tech circuit paths with fade */}
                  <g>
                    <animate
                      attributeName="opacity"
                      values="0.4;0.8;0.4"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <path d="M16 9V11M16 21V23M9 16H11M21 16H23" 
                      stroke="#ffc107" 
                      strokeWidth="1.5" 
                      strokeLinecap="round"
                    />
                  </g>
                  
                  {/* Iris ring with rotation */}
                  <circle 
                    cx="16" 
                    cy="16" 
                    r="5" 
                    stroke="#ffc107" 
                    strokeWidth="1.5"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 16 16"
                      to="-360 16 16"
                      dur="15s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  
                  {/* Center pupil with pulse */}
                  <circle cx="16" cy="16" r="2" fill="#ffc107">
                    <animate 
                      attributeName="r" 
                      values="1.5;2;1.5" 
                      dur="2s" 
                      repeatCount="indefinite"
                    />
                    <animate 
                      attributeName="fill-opacity" 
                      values="1;0.8;1" 
                      dur="2s" 
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Gradient definitions */}
                  <defs>
                    <linearGradient id="visionGradient" x1="16" y1="1" x2="16" y2="31" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#ffc107"/>
                      <stop offset="1" stopColor="#ff9800"/>
                    </linearGradient>
                    <linearGradient id="visionStroke" x1="4" y1="16" x2="28" y2="16" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#ffc107"/>
                      <stop offset="1" stopColor="#ff9800"/>
                    </linearGradient>
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
