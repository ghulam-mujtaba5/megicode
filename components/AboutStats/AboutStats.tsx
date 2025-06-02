'use client';
import React from 'react';
import { motion } from 'framer-motion';
import commonStyles from './AboutStatsCommon.module.css';
import lightStyles from './AboutStatsLight.module.css';
import darkStyles from './AboutStatsDark.module.css';
import { useTheme } from '../../context/ThemeContext';
import { ProjectsIcon, GlobalIcon, ClientsIcon, TechStackIcon } from '../IconSystem/StatsIcons';

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
      initial={{ scale: 0.9, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5,
        delay,
        type: "spring",
        stiffness: 100
      }}
    >
      <div className={`${commonStyles.iconWrapper} ${themeStyles.iconWrapper}`}>
        <Icon size={40} color={iconColor} />
      </div>
      <motion.div 
        className={`${commonStyles.number} ${themeStyles.number}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
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
      label: 'Projects Delivered'
    },
    {
      Icon: GlobalIcon,
      number: '5+',
      label: 'Countries Served'
    },
    {      Icon: ClientsIcon,
      number: '10+',
      label: 'Clients Served'
    },
    {
      Icon: TechStackIcon,
      number: '20+',
      label: 'Tools & Frameworks'
    }
  ];

  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  return (
    <section className={`${commonStyles.statsSection} ${themeStyles.statsSection}`}>
      <motion.div 
        className={commonStyles.container}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >        <h2 className={`${commonStyles.title} ${themeStyles.title}`}>Key Milestones & Metrics</h2>
        <div className={commonStyles.statsGrid}>
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              Icon={stat.Icon}
              number={stat.number}
              label={stat.label}
              delay={index * 0.1}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default AboutStats;
