import React, { useState } from 'react';
import styles from './ProjectCaseStudies.module.css';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';

interface CaseStudy {
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  technologies: string[];
  logo?: string;
  imageUrl?: string;
}

const ProjectCaseStudies = () => {
  const { theme } = useTheme();
  const [activeStudy, setActiveStudy] = useState<number>(0);

  const caseStudies: CaseStudy[] = [
    {
      title: 'AI-Powered Healthcare Platform',
      client: 'MediTech Solutions',
      industry: 'Healthcare',
      challenge: 'Needed an efficient system for patient data analysis and diagnosis prediction with compliance to healthcare regulations.',
      solution: 'Developed an AI-driven platform for automated diagnosis and patient care optimization, featuring secure data handling and HIPAA compliance.',
      results: [
        '40% faster diagnosis time',
        '95% accuracy in predictions',
        '60% reduction in manual data processing',
        '$2.5M annual cost savings'
      ],
      technologies: ['Python', 'TensorFlow', 'React', 'AWS', 'Docker'],
      imageUrl: '/images/projects/healthcare-case.jpg'
    },
    {
      title: 'Enterprise Resource Management System',
      client: 'Global Manufacturing Co.',
      industry: 'Manufacturing',
      challenge: 'Required streamlined operations across multiple facilities and integration with legacy systems.',
      solution: 'Implemented a comprehensive ERP system with real-time monitoring, predictive maintenance, and supply chain optimization.',
      results: [
        '30% increase in productivity',
        '25% cost reduction',
        '50% faster reporting',
        '35% improved inventory turnover'
      ],
      technologies: ['Node.js', 'React', 'PostgreSQL', 'Docker', 'Kubernetes'],
      imageUrl: '/images/projects/manufacturing-case.jpg'
    },
    {
      title: 'Fintech Trading Platform',
      client: 'InvestSmart',
      industry: 'Financial Services',
      challenge: 'Needed a secure and scalable trading platform with real-time analytics and regulatory compliance.',
      solution: 'Built a high-performance trading system with AI-powered insights, real-time market analysis, and automated risk management.',
      results: [
        '1M+ daily transactions',
        '99.99% uptime',
        '45% increase in user engagement',
        '15% higher trade success rate'
      ],
      technologies: ['Java', 'Spring Boot', 'React', 'MongoDB', 'Redis'],
      imageUrl: '/images/projects/fintech-case.jpg'
    }
  ];

  return (
    <section className={`${styles.caseStudiesContainer} ${styles[theme]}`}>
      <h2 className={styles.sectionTitle}>Case Studies</h2>
      <p className={styles.sectionDescription}>
        Discover how we've helped enterprises transform their businesses through innovative technology solutions.
      </p>

      <div className={styles.caseStudiesGrid}>
        <div className={styles.studySelector}>
          {caseStudies.map((study, index) => (
            <div
              key={index}
              className={`${styles.studyTab} ${activeStudy === index ? styles.activeTab : ''}`}
              onClick={() => setActiveStudy(index)}
            >
              <h3>{study.title}</h3>
              <p>{study.client}</p>
            </div>
          ))}
        </div>

        <div className={styles.studyDetails}>
          <div className={styles.studyContent}>
            <div className={styles.imageContainer}>
              {caseStudies[activeStudy].imageUrl && (
                <Image
                  src={caseStudies[activeStudy].imageUrl}
                  alt={caseStudies[activeStudy].title}
                  fill
                  className={styles.studyImage}
                  objectFit="cover"
                />
              )}
            </div>

            <div className={styles.studyInfo}>
              <div className={styles.infoHeader}>
                <h3>{caseStudies[activeStudy].title}</h3>
                <span className={styles.industry}>{caseStudies[activeStudy].industry}</span>
              </div>

              <div className={styles.infoSection}>
                <h4>Challenge</h4>
                <p>{caseStudies[activeStudy].challenge}</p>
              </div>

              <div className={styles.infoSection}>
                <h4>Solution</h4>
                <p>{caseStudies[activeStudy].solution}</p>
              </div>

              <div className={styles.resultsSection}>
                <h4>Key Results</h4>
                <div className={styles.resultsList}>
                  {caseStudies[activeStudy].results.map((result, index) => (
                    <div key={index} className={styles.resultItem}>
                      <span className={styles.resultMetric}>{result}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.techStack}>
                <h4>Technologies Used</h4>
                <div className={styles.techList}>
                  {caseStudies[activeStudy].technologies.map((tech, index) => (
                    <span key={index} className={styles.techBadge}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectCaseStudies;
