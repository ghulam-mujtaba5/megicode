'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import commonStyles from './AboutStatsCommon.module.css';
import lightStyles from './AboutStatsLight.module.css';
import darkStyles from './AboutStatsDark.module.css';
import { useTheme } from '../../context/ThemeContext';
import { ProjectsIcon, GlobalIcon, ClientsIcon, TechStackIcon } from '../IconSystem/StatsIcons';
import { staggerContainer, fadeInUp, scaleIn } from '../../utils/animations';

const LottiePlayer = dynamic(
  () => import('../LottiePlayer/LottiePlayer'),
  { ssr: false }
);

interface StatItemProps {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  number: string;
  label: string;
  delay: number;
}

const StatItem: React.FC<StatItemProps> = ({ Icon, number, label, delay }) => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;
  
  const iconColor = theme === 'dark' ? '#6b8ee6' : '#4573df';
  
  return (
    <motion.div 
      className={`${commonStyles.statItem} ${themeStyles.statItem}`}
      variants={scaleIn}
    >
      <div className={`${commonStyles.iconWrapper} ${themeStyles.iconWrapper}`}>
        <Icon size={40} color={iconColor} />
      </div>
      <motion.div 
        className={`${commonStyles.number} ${themeStyles.number}`}
        variants={fadeInUp}
      >
        {number}
      </motion.div>
      <div className={`${commonStyles.label} ${themeStyles.label}`}>{label}</div>
    </motion.div>
  );
};

const AboutStats = () => {  const stats = [
    {
      Icon: ProjectsIcon,
      number: '15+',
      label: 'AI & Software Products Built'
    },
    {
      Icon: GlobalIcon,
      number: '5+',
      label: 'Countries Served'
    },
    {      Icon: ClientsIcon,
      number: '10+',
      label: 'Startups & Businesses Partnered'
    },
    {
      Icon: TechStackIcon,
      number: '25+',
      label: 'AI & Dev Tools Mastered'
    }
  ];

  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

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
        {/* Analytics / data Lottie animation aligned with section title */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <LottiePlayer
            src="/lottie/analytics-data.json"
            loop
            style={{ width: 'clamp(180px, 25vw, 260px)', height: 'clamp(180px, 25vw, 260px)' }}
            ariaLabel="Animated data analytics chart illustration"
          />
        </div>
        <motion.div 
          className={commonStyles.statsGrid}
          variants={staggerContainer}
        >
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              Icon={stat.Icon}
              number={stat.number}
              label={stat.label}
              delay={index * 0.1}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutStats;
