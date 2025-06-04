'use client'
import React, { useState } from 'react';
import styles from './ProjectShowcase.module.css';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';
import ProjectFilter from '../ProjectFilter/ProjectFilter';

type Project = {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  projectUrl?: string;
  category: string;
};

const projects: Project[] = [
  {
    id: 1,
    title: "Enterprise AI Analytics Platform",
    description: "A comprehensive analytics platform leveraging AI for business intelligence, predictive modeling, and data visualization.",
    technologies: ["Python", "TensorFlow", "React", "AWS"],
    imageUrl: "/images/projects/ai-analytics.jpg",
    projectUrl: "https://github.com/ghulam-mujtaba5/AI-chatBot",
    category: "AI & Machine Learning"
  },
  {
    id: 2,
    title: "Healthcare SaaS Solution",
    description: "Complete healthcare management system with patient records, appointments, analytics, and AI-powered diagnostics.",
    technologies: ["Next.js", "Node.js", "MongoDB", "Machine Learning"],
    imageUrl: "/images/projects/healthcare.jpg",
    projectUrl: "https://github.com/ghulam-mujtaba5/healthcare-Management-System",
    category: "SaaS Solutions"
  },
  {
    id: 3,
    title: "Intelligent Face Recognition System",
    description: "Enterprise-grade face recognition system with real-time processing and advanced security features.",
    technologies: ["Python", "OpenCV", "TensorFlow", "React"],
    imageUrl: "/images/projects/face-recognition.jpg",
    projectUrl: "https://github.com/ghulam-mujtaba5/Face-Recognition",
    category: "AI & Machine Learning"
  },
  {
    id: 4,
    title: "E-Commerce SaaS Platform",
    description: "Multi-tenant e-commerce platform with AI-powered recommendations and analytics.",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Redis"],
    imageUrl: "/images/projects/ecommerce-saas.jpg",
    projectUrl: "https://github.com/ghulam-mujtaba5/Portfolio",
    category: "SaaS Solutions"
  },
  {
    id: 5,
    title: "Enterprise Resource Planning System",
    description: "Comprehensive ERP solution with modules for HR, finance, inventory, and business intelligence.",
    technologies: ["React", "Node.js", "GraphQL", "PostgreSQL"],
    imageUrl: "/images/projects/erp-system.jpg",
    category: "Enterprise Solutions"
  },
  {
    id: 6,
    title: "AI-Powered Customer Service Platform",
    description: "Intelligent customer service automation with NLP and machine learning capabilities.",
    technologies: ["Python", "NLP", "React", "MongoDB"],
    imageUrl: "/images/projects/customer-service.jpg",
    category: "AI & Machine Learning"
  }
];

const filters = ["All", "AI & Machine Learning", "SaaS Solutions", "Enterprise Solutions"];

const ProjectShowcase = () => {
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects = projects.filter(
    project => activeFilter === "All" || project.category === activeFilter
  );

  return (
    <section className={`${styles.showcase} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <ProjectFilter
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        filters={filters}
      />
      <div className={styles.container}>
        {filteredProjects.map((project) => (
          <div key={project.id} className={styles.projectCard}>
            <div className={styles.imageWrapper}>
              <Image
                src={project.imageUrl}
                alt={project.title}
                width={600}
                height={400}
                className={styles.projectImage}
              />
            </div>
            <div className={styles.projectInfo}>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.projectDescription}>{project.description}</p>
              <div className={styles.technologies}>
                {project.technologies.map((tech, index) => (
                  <span key={index} className={styles.techBadge}>
                    {tech}
                  </span>
                ))}
              </div>
              {project.projectUrl && (
                <a href={project.projectUrl} className={styles.projectLink} target="_blank" rel="noopener noreferrer">
                  View Project
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectShowcase;
