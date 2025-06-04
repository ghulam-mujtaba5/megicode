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
    title: "Enterprise AI Analytics Suite",
    description: "An award-winning analytics platform that processes over 1M data points daily, providing real-time business intelligence and predictive insights for Fortune 500 companies.",
    technologies: ["Python", "TensorFlow", "React", "AWS", "Kubernetes"],
    imageUrl: "/images/projects/ai-analytics.jpg",
    projectUrl: "#",
    category: "Enterprise Solutions"
  },
  {
    id: 2,
    title: "Smart Healthcare Platform",
    description: "HIPAA-compliant healthcare management system serving 200+ clinics, featuring AI-driven diagnostics with 98% accuracy and real-time patient monitoring.",
    technologies: ["Next.js", "Node.js", "MongoDB", "TensorFlow", "AWS"],
    imageUrl: "/images/projects/healthcare.jpg",
    projectUrl: "#",
    category: "SaaS Solutions"
  },
  {
    id: 3,
    title: "Advanced Security System",
    description: "Enterprise-grade security system with facial recognition, anomaly detection, and predictive threat analysis, deployed across 50+ corporate locations.",
    technologies: ["Python", "OpenCV", "TensorFlow", "React", "Azure"],
    imageUrl: "/images/projects/security.jpg",
    projectUrl: "#",
    category: "AI & Machine Learning"
  },
  {
    id: 4,
    title: "Global E-Commerce Platform",
    description: "Scalable multi-tenant e-commerce solution handling $100M+ in annual transactions, featuring AI-powered recommendations and real-time analytics.",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Redis", "Docker"],
    imageUrl: "/images/projects/ecommerce.jpg",
    projectUrl: "#",
    category: "Enterprise Solutions"
  },
  {
    id: 5,
    title: "Industrial IoT Platform",
    description: "Smart manufacturing solution that reduced operational costs by 35% for clients, integrating IoT sensors, real-time analytics, and predictive maintenance.",
    technologies: ["Python", "TensorFlow", "React", "AWS IoT", "Time Series DB"],
    imageUrl: "/images/projects/iot.jpg",
    projectUrl: "#",
    category: "AI & Machine Learning"
  },
  {
    id: 6,
    title: "Financial Analysis Suite",
    description: "AI-powered financial analysis platform processing $50B+ in transactions monthly, providing fraud detection and investment insights for banking institutions.",
    technologies: ["Python", "Machine Learning", "React", "PostgreSQL", "Redis"],
    imageUrl: "/images/projects/fintech.jpg",
    projectUrl: "#",
    category: "Enterprise Solutions"
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
