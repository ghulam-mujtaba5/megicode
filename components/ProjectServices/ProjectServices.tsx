'use client'
import React from 'react';
import styles from './ProjectServices.module.css';
import { useTheme } from '@/context/ThemeContext';

const services = [
  {
    title: 'AI & Machine Learning Solutions',
    description: 'Custom AI solutions to automate processes, gain insights, and drive innovation.',
    features: [
      'Computer Vision Systems',
      'Natural Language Processing',
      'Predictive Analytics',
      'Machine Learning Models'
    ],
    icon: '🤖'
  },
  {
    title: 'SaaS Development',
    description: 'Scalable cloud-based software solutions for modern businesses.',
    features: [
      'Custom SaaS Platforms',
      'Cloud Architecture',
      'Multi-tenant Systems',
      'API Development'
    ],
    icon: '☁️'
  },
  {
    title: 'Enterprise Solutions',
    description: 'Comprehensive enterprise software solutions for large-scale operations.',
    features: [
      'ERP Systems',
      'Business Intelligence',
      'Workflow Automation',
      'Data Integration'
    ],
    icon: '🏢'
  },
  {
    title: 'Digital Transformation',
    description: 'Strategic digital transformation services to modernize your business.',
    features: [
      'Process Digitization',
      'Legacy System Updates',
      'Digital Strategy',
      'Technology Consulting'
    ],
    icon: '🔄'
  }
];

const ProjectServices = () => {
  const { theme } = useTheme();

  return (
    <section className={`${styles.servicesSection} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Our Services</h2>
        <p className={styles.sectionSubtitle}>
          Comprehensive technology solutions tailored to your business needs
        </p>
        
        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <div key={index} className={styles.serviceCard}
                 style={{ animationDelay: `${index * 0.2}s` }}>
              <div className={styles.iconWrapper}>
                <span className={styles.icon} role="img" aria-label={service.title}>{service.icon}</span>
              </div>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
              <ul className={styles.featureList}>
                {service.features.map((feature, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.backgroundEffect}></div>
    </section>
  );
};

export default ProjectServices;
