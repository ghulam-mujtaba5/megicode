'use client';
import React from 'react';

import { motion } from 'framer-motion';

import { useTheme } from '../../context/ThemeContext';
import { fadeInUp, scaleIn, staggerContainer } from '../../utils/animations';
import LottiePlayer from '../LottiePlayer/LottiePlayer';
import commonStyles from './AboutStatsCommon.module.css';
import darkStyles from './AboutStatsDark.module.css';
import lightStyles from './AboutStatsLight.module.css';

interface StatItemProps {
  lottieFile: string;
  number: string;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ lottieFile, number, label }) => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  return (
    <motion.div className={`${commonStyles.statItem} ${themeStyles.statItem}`} variants={scaleIn}>
      <div className={`${commonStyles.iconWrapper} ${themeStyles.iconWrapper}`}>
        <LottiePlayer
          src={lottieFile}
          loop
          autoplay
          pauseWhenHidden
          speed={0.7}
          style={{ width: 56, height: 56 }}
        />
      </div>
      <motion.div className={`${commonStyles.number} ${themeStyles.number}`} variants={fadeInUp}>
        {number}
      </motion.div>
      <div className={`${commonStyles.label} ${themeStyles.label}`}>{label}</div>
    </motion.div>
  );
};

const AboutStats = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  const stats = [
    {
      lottieFile: '/lottie/03_software_development_code.json',
      number: '15+',
      label: 'AI & Software Products Built',
    },
    {
      lottieFile: '/lottie/07_data_analytics_growth.json',
      number: '5+',
      label: 'Countries Served',
    },
    {
      lottieFile: '/lottie/16_team_collaboration.json',
      number: '10+',
      label: 'Startups & Businesses Partnered',
    },
    {
      lottieFile: '/lottie/02_ai_automation_agent.json',
      number: '25+',
      label: 'AI & Dev Tools Mastered',
    },
  ];

  return (
    <section className={`${commonStyles.statsSection} ${themeStyles.statsSection}`}>
      <motion.div
        className={commonStyles.container}
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className={`${commonStyles.title} ${themeStyles.title}`}>Key Milestones & Metrics</h2>
        <motion.div className={commonStyles.statsGrid} variants={staggerContainer}>
          {stats.map((stat) => (
            <StatItem
              key={stat.label}
              lottieFile={stat.lottieFile}
              number={stat.number}
              label={stat.label}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutStats;
