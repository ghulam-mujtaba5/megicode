'use client'
import React from 'react';
import styles from './ProjectStats.module.css';
import { useTheme } from '@/context/ThemeContext';

const stats = [
  {
    number: '25+',
    label: 'Projects Completed',
    icon: '🚀'
  },
  {
    number: '10+',
    label: 'AI Solutions',
    icon: '🤖'
  },
  {
    number: '15+',
    label: 'Web Applications',
    icon: '💻'
  },
  {
    number: '5+',
    label: 'Years Experience',
    icon: '⭐'
  }
];

const ProjectStats = () => {
  const { theme } = useTheme();

  return (
    <section className={`${styles.statsSection} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <div className={styles.container}>
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.icon}>{stat.icon}</div>
              <div className={styles.number}>{stat.number}</div>
              <div className={styles.label}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.backgroundPattern}></div>
    </section>
  );
};

export default ProjectStats;
