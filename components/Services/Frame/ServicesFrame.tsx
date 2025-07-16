'use client';
import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import commonStyles from './ServicesFrameCommon.module.css';
import lightStyles from './ServicesFrameLight.module.css';
import darkStyles from './ServicesFrameDark.module.css';

const ServicesFrame = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });

  const skillsData = [
    {
      title: "UI & UX Designing",
      titleicon: "/Ui&Ux-icon.svg",
      description: "Creating intuitive and engaging user experiences across all platforms",
      skills: [
        { 
          name: "Desktop Application", 
          icon: "/Desktop-App-icon.svg", 
          darkIcon: "/Desktop App Dark.svg",
          description: "Powerful native applications with smooth performance"
        },
        { 
          name: "Web Application", 
          icon: "/web app icon.svg",
          description: "Responsive and modern web solutions"
        },
        { 
          name: "Mobile App", 
          icon: "/mobile app icon.svg", 
          darkIcon: "/Mobile App Dark.svg",
          description: "Native and cross-platform mobile experiences"
        },
      ],
      cardClass: themeStyles.uiuxCard
    },
    {
      title: "Development",
      titleicon: "/devlopment-icon.svg",
      description: "Building robust and scalable solutions with cutting-edge technology",
      skills: [
        { 
          name: "Desktop Application", 
          icon: "/Desktop-App-icon.svg", 
          darkIcon: "/Desktop App Dark.svg",
          description: "High-performance desktop software solutions"
        },
        { 
          name: "Web Application", 
          icon: "/web app icon.svg",
          description: "Full-stack web development with modern frameworks"
        },
        { 
          name: "Mobile App", 
          icon: "/mobile app icon.svg", 
          darkIcon: "/Mobile App Dark.svg",
          description: "Cross-platform mobile development"
        },
      ],
      cardClass: themeStyles.developmentCard
    },
    {
      title: "Data Science & AI",
      titleicon: "/ds&ai-icon.svg",
      description: "Leveraging data and AI to drive insights and innovation",
      skills: [
        { 
          name: "Data Scraping", 
          icon: "/data scrapping icon.svg",
          description: "Automated data collection and processing"
        },
        { 
          name: "Data Visualization", 
          icon: "/data visualization icon.svg",
          description: "Interactive and insightful data presentations"
        },
        { 
          name: "Big Data Analytics", 
          icon: "/Big Data Analytics.svg",
          description: "Large-scale data processing and analysis"
        },
        { 
          name: "AI Solution Development", 
          icon: "/Ai icon.svg",
          description: "Custom AI and machine learning solutions"
        }
      ],
      cardClass: themeStyles.dataScienceCard
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
        mass: 1
      }
    }
  };

  const skillVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <section 
      ref={containerRef}
      className={`${commonStyles.skillFrame} ${themeStyles.skillFrame}`} 
      aria-labelledby="services-heading"
    >
      <motion.h2 
        id="services-heading" 
        className={`${commonStyles.skillsTitle} ${themeStyles.skillsTitle}`}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        Our Services
      </motion.h2>

      <motion.div
        className={commonStyles.skillsContainer}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {skillsData.map((category, index) => (
          <motion.article
            className={`${commonStyles.skillCard} ${themeStyles.skillCard} ${category.cardClass}`}
            key={index}
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <header className={`${commonStyles.header} ${themeStyles.header}`}>
              <motion.img 
                className={`${commonStyles.categoryIcon} ${themeStyles.categoryIcon}`} 
                alt={`${category.title} icon`} 
                src={category.titleicon}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              />
              <h3 className={`${commonStyles.title} ${themeStyles.title}`}>
                {category.title}
              </h3>
            </header>

            <p className={`${commonStyles.description} ${themeStyles.description}`}>
              {category.description}
            </p>

            <motion.div 
              className={commonStyles.skillsGrid}
              variants={containerVariants}
            >
              {category.skills.map((skill, skillIndex) => (
                <motion.div
                  key={skillIndex}
                  className={`${commonStyles.skillItem} ${themeStyles.skillItem}`}
                  variants={skillVariants}
                  whileHover={{ scale: 1.03, x: 5 }}
                >
                  <img 
                    src={theme === 'dark' && skill.darkIcon ? skill.darkIcon : skill.icon}
                    alt={`${skill.name} icon`}
                    className={commonStyles.skillIcon}
                  />
                  <div className={commonStyles.skillContent}>
                    <h4 className={`${commonStyles.skillName} ${themeStyles.skillName}`}>
                      {skill.name}
                    </h4>
                    <p className={`${commonStyles.skillDescription} ${themeStyles.skillDescription}`}>
                      {skill.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
};

export default ServicesFrame;
