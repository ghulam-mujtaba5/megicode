'use client';
import React from 'react';
import { motion } from 'framer-motion';
import styles from './AboutStats.module.css';

interface StatItemProps {
  icon: string;
  number: string;
  label: string;
  delay: number;
}

const StatItem: React.FC<StatItemProps> = ({ icon, number, label, delay }) => (
  <motion.div 
    className={styles.statItem}
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
    <div className={styles.icon}>{icon}</div>
    <motion.div 
      className={styles.number}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay + 0.2 }}
    >
      {number}
    </motion.div>
    <div className={styles.label}>{label}</div>
  </motion.div>
);

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

  return (
    <section className={styles.statsSection}>
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className={styles.title}>Our Impact in Numbers</h2>
        
        <div className={styles.statsGrid}>
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
      
      <div className={styles.backgroundDecoration}></div>
    </section>
  );
};

export default AboutStats;
