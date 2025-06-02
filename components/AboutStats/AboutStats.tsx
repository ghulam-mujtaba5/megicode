'use client';
import React from 'react';
import { motion } from 'framer-motion';
import commonStyles from './AboutStatsCommon.module.css';
import lightStyles from './AboutStatsLight.module.css';
import darkStyles from './AboutStatsDark.module.css';
import { useTheme } from '../../context/ThemeContext';

interface StatItemProps {
  icon: string;
  number: string;
  label: string;
  delay: number;
}

const StatItem: React.FC<StatItemProps> = ({ icon, number, label, delay }) => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;
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
      <div className={`${commonStyles.icon} ${themeStyles.icon}`}>{icon}</div>
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

const AboutStats = () => {
  const stats = [
    {
      icon: '🚀',
      number: '15+',
      label: 'Projects Delivered'
    },
    {
      icon: '🌍',
      number: '5+',
      label: 'Countries Served'
    },
    {
      icon: '🧠',
      number: '100%',
      label: 'AI/ML Integration'
    },
    {
      icon: '⏱️',
      number: '2-6',
      label: 'Weeks Delivery'
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
      >
        <h2 className={`${commonStyles.title} ${themeStyles.title}`}>Our Impact in Numbers</h2>
        <div className={commonStyles.statsGrid}>
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              icon={stat.icon}
              number={stat.number}
              label={stat.label}
              delay={index * 0.1}
            />
          ))}
        </div>
      </motion.div>
      <div className={commonStyles.backgroundDecoration}></div>
    </section>
  );
};

export default AboutStats;
