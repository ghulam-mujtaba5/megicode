import React from 'react';
import styles from './ProjectIndustries.module.css';

const ProjectIndustries = () => {
  const industries = [
    {
      name: 'Financial Services',
      icon: '💰',
      description: 'Secure and scalable solutions for fintech and banking sector'
    },
    {
      name: 'Healthcare',
      icon: '🏥',
      description: 'HIPAA-compliant systems for healthcare providers'
    },
    {
      name: 'E-commerce',
      icon: '🛍️',
      description: 'High-performance platforms for online retail'
    },
    {
      name: 'Manufacturing',
      icon: '🏭',
      description: 'IoT and automation solutions for smart manufacturing'
    },
    {
      name: 'Education',
      icon: '📚',
      description: 'Digital learning platforms and management systems'
    },
    {
      name: 'Real Estate',
      icon: '🏢',
      description: 'Property management and marketplace solutions'
    }
  ];

  return (
    <section className={styles.industries}>
      <div className={styles.container}>
        <h2 className={styles.title}>Industries We Serve</h2>
        <p className={styles.subtitle}>
          Delivering innovative solutions across diverse sectors
        </p>
        
        <div className={styles.grid}>
          {industries.map((industry, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.icon} role="img" aria-label={industry.name}>{industry.icon}</div>
              <h3 className={styles.industryName}>{industry.name}</h3>
              <p className={styles.description}>{industry.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectIndustries;
