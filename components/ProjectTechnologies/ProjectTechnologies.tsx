'use client'
import React from 'react';
import styles from './ProjectTechnologies.module.css';
import { useTheme } from '@/context/ThemeContext';

const technologies = {
  'AI & Machine Learning': [
    { name: 'TensorFlow', level: 90 },
    { name: 'PyTorch', level: 85 },
    { name: 'Scikit-learn', level: 88 },
    { name: 'OpenCV', level: 82 },
    { name: 'NLP', level: 85 }
  ],
  'Web Development': [
    { name: 'React.js', level: 92 },
    { name: 'Next.js', level: 88 },
    { name: 'TypeScript', level: 85 },
    { name: 'CSS/SASS', level: 90 },
    { name: 'Material-UI', level: 87 }
  ],
  'Backend & Database': [
    { name: 'Node.js', level: 88 },
    { name: 'Express.js', level: 85 },
    { name: 'MongoDB', level: 86 },
    { name: 'PostgreSQL', level: 82 },
    { name: 'RESTful APIs', level: 90 }
  ],
  'Tools & Others': [
    { name: 'Git', level: 90 },
    { name: 'Docker', level: 83 },
    { name: 'AWS', level: 80 },
    { name: 'CI/CD', level: 82 },
    { name: 'Linux', level: 85 }
  ]
};

const ProjectTechnologies = () => {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = React.useState('AI & Machine Learning');

  return (
    <section className={`${styles.techSection} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Technology Stack</h2>
        <div className={styles.techCategories}>
          {Object.keys(technologies).map((category) => (
            <button
              key={category}
              className={`${styles.categoryButton} ${activeCategory === category ? styles.active : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className={styles.techGrid}>
          {technologies[activeCategory].map((tech, index) => (
            <div key={tech.name} className={styles.techCard}
                 style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={styles.techInfo}>
                <h3 className={styles.techName}>{tech.name}</h3>
                <span className={styles.techLevel}>{tech.level}%</span>
              </div>
              <div className={styles.progressBarWrapper}>
                <div 
                  className={styles.progressBar}
                  style={{ width: `${tech.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.backgroundEffect}></div>
    </section>
  );
};

export default ProjectTechnologies;
