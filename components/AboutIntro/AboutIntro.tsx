'use client';
import React from 'react';
import commonStyles from './AboutIntroCommon.module.css';
import lightStyles from './AboutIntroLight.module.css';
import darkStyles from './AboutIntroDark.module.css';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const AboutIntro = () => {
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
              <img src="/Ai icon.svg" alt="Mission Icon" width={40} height={40} style={{flexShrink: 0}} />
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
              <img src="/data visualization icon.svg" alt="Vision Icon" width={40} height={40} style={{flexShrink: 0}} />
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
