'use client'
import React from 'react';
import styles from './ProjectOverview.module.css';
import { useTheme } from '@/context/ThemeContext';

const stats = [
  {
    number: '150+',
    label: 'Enterprise Clients',
    description: 'Trusted by leading companies worldwide',
    icon: '🏢'
  },
  {
    number: '200+',
    label: 'Projects Delivered',
    description: 'Successful project completions',
    icon: '✅'
  },
  {
    number: '98%',
    label: 'Client Satisfaction',
    description: 'Based on client feedback and reviews',
    icon: '⭐'
  },
  {
    number: '24/7',
    label: 'Support Available',
    description: 'Round-the-clock technical assistance',
    icon: '🔧'
  }
];

const achievements = [
  'Industry-leading AI solutions',
  'Cutting-edge technology stack',
  'Scalable enterprise architecture',
  'Agile development methodology',
  'Cloud-native applications',
  'Robust security measures'
];

const ProjectOverview = () => {
  const { theme } = useTheme();

  return (
    <section className={`${styles.overview} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            Transforming Ideas into
            <span className={styles.highlight}> Enterprise Solutions</span>
          </h2>
          
          <p className={styles.description}>
            We specialize in developing enterprise-grade software solutions that drive innovation and 
            business growth. Our expertise spans artificial intelligence, cloud computing, and full-stack 
            development, ensuring cutting-edge solutions for modern businesses.
          </p>

          <div className={styles.achievements}>
            {achievements.map((achievement, index) => (
              <div key={index} className={styles.achievement}>
                <span className={styles.checkmark}>✓</span>
                {achievement}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.stats}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statContent}>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
                <div className={styles.statDescription}>{stat.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.backgroundEffect}></div>
    </section>
  );
};

export default ProjectOverview;
