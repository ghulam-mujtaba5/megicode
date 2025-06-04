'use client'
import React, { useState } from 'react';
import styles from './ProjectStack.module.css';
import { useTheme } from '@/context/ThemeContext';

const technologies = {
  'AI & ML': [
    { name: 'TensorFlow', icon: '🧠', level: 90 },
    { name: 'PyTorch', icon: '🔥', level: 85 },
    { name: 'Scikit-learn', icon: '📊', level: 88 },
    { name: 'OpenCV', icon: '👁️', level: 85 },
    { name: 'NLTK', icon: '💬', level: 82 }
  ],
  'Frontend': [
    { name: 'React', icon: '⚛️', level: 95 },
    { name: 'Next.js', icon: '⚡', level: 92 },
    { name: 'TypeScript', icon: '📘', level: 90 },
    { name: 'Tailwind CSS', icon: '🎨', level: 88 },
    { name: 'Material-UI', icon: '🎯', level: 85 }
  ],
  'Backend': [
    { name: 'Node.js', icon: '🟢', level: 92 },
    { name: 'Python', icon: '🐍', level: 90 },
    { name: 'FastAPI', icon: '🚀', level: 85 },
    { name: 'GraphQL', icon: '📡', level: 88 },
    { name: 'Express.js', icon: '🌐', level: 90 }
  ],
  'Cloud & DevOps': [
    { name: 'AWS', icon: '☁️', level: 88 },
    { name: 'Docker', icon: '🐋', level: 85 },
    { name: 'Kubernetes', icon: '⚓', level: 82 },
    { name: 'CI/CD', icon: '🔄', level: 85 },
    { name: 'Terraform', icon: '🏗️', level: 80 }
  ],
  'Database': [
    { name: 'MongoDB', icon: '🍃', level: 90 },
    { name: 'PostgreSQL', icon: '🐘', level: 88 },
    { name: 'Redis', icon: '🔴', level: 85 },
    { name: 'Elasticsearch', icon: '🔍', level: 82 },
    { name: 'MySQL', icon: '💾', level: 85 }
  ]
};

const ProjectStack = () => {
  const { theme } = useTheme();
  const [activeStack, setActiveStack] = useState('AI & ML');

  return (
    <div className={`${styles.stack} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <div className={styles.container}>
        <h2 className={styles.title}>Technology Stack</h2>
        <p className={styles.subtitle}>
          Our comprehensive tech stack powers innovative solutions across all domains
        </p>

        <div className={styles.categories}>
          {Object.keys(technologies).map((category) => (
            <button
              key={category}
              className={`${styles.categoryBtn} ${activeStack === category ? styles.active : ''}`}
              onClick={() => setActiveStack(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className={styles.techGrid}>
          {technologies[activeStack].map((tech, index) => (
            <div 
              key={tech.name} 
              className={styles.techCard}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                '--progress': `${tech.level}%`
              } as React.CSSProperties}
            >
              <div className={styles.techHeader}>
                <span className={styles.techIcon} role="img" aria-label={tech.name}>{tech.icon}</span>
                <h3 className={styles.techName}>{tech.name}</h3>
                <span className={styles.techLevel}>{tech.level}%</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progress}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.backgroundEffect}></div>
    </div>
  );
};

export default ProjectStack;
