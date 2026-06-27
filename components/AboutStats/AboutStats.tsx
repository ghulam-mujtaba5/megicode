'use client';
import React from 'react';

import Image from 'next/image';

import { motion } from 'framer-motion';

import { useTheme } from '../../context/ThemeContext';
import { fadeInUp, scaleIn, staggerContainer } from '../../utils/animations';
import commonStyles from './AboutStatsCommon.module.css';
import darkStyles from './AboutStatsDark.module.css';
import lightStyles from './AboutStatsLight.module.css';

interface StatItemProps {
  iconSrc: string;
  number: string;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ iconSrc, number, label }) => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  return (
    <motion.div className={`${commonStyles.statItem} ${themeStyles.statItem}`} variants={scaleIn}>
      <div className={`${commonStyles.iconWrapper} ${themeStyles.iconWrapper}`}>
        <Image
          src={iconSrc}
          alt={label}
          width={72}
          height={72}
          style={{
            objectFit: 'contain',
          }}
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
      iconSrc: '/icons/about-stats/software-development.png',
      number: '15+',
      label: 'AI & Software Products Built',
    },
    {
      iconSrc: '/icons/about-stats/global-reach.png',
      number: '5+',
      label: 'Countries Served',
    },
    {
      iconSrc: '/icons/about-stats/partnerships.png',
      number: '10+',
      label: 'Startups & Businesses Partnered',
    },
    {
      iconSrc: '/icons/about-stats/tools-mastered.png',
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
              iconSrc={stat.iconSrc}
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
