'use client';
import React from 'react';
import { motion } from 'framer-motion';
import commonStyles from './AboutStatsCommon.module.css';
import lightStyles from './AboutStatsLight.module.css';
import darkStyles from './AboutStatsDark.module.css';
import { useTheme } from '../../context/ThemeContext';
import { ProjectsIcon, GlobalIcon, ClientsIcon, TechStackIcon } from '../IconSystem/StatsIcons';
import { staggerContainer, fadeInUp, scaleIn } from '../../utils/animations';

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
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className={`${commonStyles.title} ${themeStyles.title}`}>Key Milestones & Metrics</h2>
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
