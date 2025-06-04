'use client'
import React from 'react';
import styles from './ProjectTimeline.module.css';
import { useTheme } from '@/context/ThemeContext';

const timelineData = [
  {
    year: '2023-Present',
    title: 'AI & Machine Learning Focus',
    description: 'Developing cutting-edge AI solutions and machine learning models for real-world applications.',
    projects: ['Face Recognition System', 'AI ChatBot', 'Predictive Analytics Platform'],
    tech: ['Python', 'TensorFlow', 'PyTorch', 'Computer Vision']
  },
  {
    year: '2022-2023',
    title: 'Full Stack Development',
    description: 'Building comprehensive web applications with modern technologies and frameworks.',
    projects: ['Healthcare Management System', 'E-commerce Platform', 'Portfolio System'],
    tech: ['React', 'Node.js', 'MongoDB', 'Next.js']
  },
  {
    year: '2021-2022',
    title: 'Web Development',
    description: 'Creating responsive and interactive web applications with focus on user experience.',
    projects: ['Landing Page Design', 'Company Website', 'Admin Dashboard'],
    tech: ['JavaScript', 'React', 'CSS3', 'HTML5']
  },
  {
    year: '2020-2021',
    title: 'Foundation Building',
    description: 'Learning and implementing core programming concepts and basic web technologies.',
    projects: ['Personal Blog', 'Calculator App', 'Task Manager'],
    tech: ['HTML', 'CSS', 'JavaScript', 'jQuery']
  }
];

const ProjectTimeline = () => {
  const { theme } = useTheme();

  return (
    <section className={`${styles.timelineSection} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Development Journey</h2>
        <div className={styles.timeline}>
          {timelineData.map((item, index) => (
            <div key={index} className={`${styles.timelineItem} ${index % 2 === 0 ? styles.left : styles.right}`}>
              <div className={styles.timelineContent}>
                <div className={styles.year}>{item.year}</div>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.description}>{item.description}</p>
                <div className={styles.projectsList}>
                  <h4>Key Projects:</h4>
                  <ul>
                    {item.projects.map((project, idx) => (
                      <li key={idx}>{project}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.techStack}>
                  {item.tech.map((tech, idx) => (
                    <span key={idx} className={styles.techBadge}>{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.backgroundEffect}></div>
    </section>
  );
};

export default ProjectTimeline;
