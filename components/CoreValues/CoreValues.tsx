'use client';
import React from 'react';
import styles from './CoreValues.module.css';
import { motion } from 'framer-motion';

interface ValueCardProps {
  title: string;
  description: string;
  icon: string;
  delay: number;
}

const ValueCard: React.FC<ValueCardProps> = ({ title, description, icon, delay }) => (
  <motion.div 
    className={styles.valueCard}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <div className={styles.icon}>{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </motion.div>
);

const CoreValues = () => {
  const values = [
    {
      title: 'Innovation',
      description: 'We stay ahead of the curve by using the latest technologies like GPT, transformers, and generative AI.',
      icon: '🔮'
    },
    {
      title: 'Excellence',
      description: 'Every line of code we write is tested, secure, and scalable.',
      icon: '⭐'
    },
    {
      title: 'Collaboration',
      description: 'We see clients as partners, not just customers.',
      icon: '🤝'
    },
    {
      title: 'Transparency',
      description: 'Open communication and ethical practices in every interaction.',
      icon: '🔍'
    },
    {
      title: 'Growth',
      description: 'We scale your business — and ourselves — through continuous improvement.',
      icon: '📈'
    }
  ];

  return (
    <section className={styles.coreValues}>
      <motion.h2 
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Our Core Values
      </motion.h2>
      
      <div className={styles.valuesGrid}>
        {values.map((value, index) => (
          <ValueCard
            key={value.title}
            title={value.title}
            description={value.description}
            icon={value.icon}
            delay={index * 0.2}
          />
        ))}
      </div>
    </section>
  );
};

export default CoreValues;
