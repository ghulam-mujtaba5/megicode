'use client';
import React from 'react';
import styles from './ProjectProcess.module.css';
import { useTheme } from '@/context/ThemeContext';

const processSteps = [
  {
    step: 1,
    title: 'Discovery & Planning',
    description: 'Deep analysis of requirements, market research, and strategic planning to ensure optimal solutions.',
    features: [
      'Requirements Analysis',
      'Technical Feasibility',
      'Market Research',
      'Solution Architecture'
    ],
    icon: '🎯'
  },
  {
    step: 2,
    title: 'Design & Prototyping',
    description: 'Creating intuitive user experiences with modern design principles and rapid prototyping.',
    features: [
      'UI/UX Design',
      'Wireframing',
      'Interactive Prototypes',
      'User Testing'
    ],
    icon: '✨'
  },
  {
    step: 3,
    title: 'Development & Testing',
    description: 'Agile development process with continuous integration and comprehensive testing.',
    features: [
      'Agile Development',
      'Quality Assurance',
      'Performance Testing',
      'Security Testing'
    ],
    icon: '⚡'
  },
  {
    step: 4,
    title: 'Deployment & Support',
    description: 'Seamless deployment with ongoing support and maintenance for optimal performance.',
    features: [
      'CI/CD Pipeline',
      '24/7 Monitoring',
      'Performance Optimization',
      'Regular Updates'
    ],
    icon: '🚀'
  }
];

const ProjectProcess = () => {
  const { theme } = useTheme();

  return (
    <section className={`${styles.processSection} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Development Process</h2>
        <p className={styles.sectionSubtitle}>
          Our proven methodology ensures successful project delivery and exceptional results
        </p>
        
        <div className={styles.processGrid}>
          {processSteps.map((step, index) => (
            <div key={index} className={styles.processCard}
                 style={{ animationDelay: `${index * 0.2}s` }}>
              <div className={styles.stepNumber}>Step {step.step}</div>
              <div className={styles.icon}>{step.icon}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
              <ul className={styles.featureList}>
                {step.features.map((feature, idx) => (
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

export default ProjectProcess;
