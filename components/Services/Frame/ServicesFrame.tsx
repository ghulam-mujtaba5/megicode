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
      title: "AI-Powered Development",
      titleicon: "/Ai icon.svg",
      description: "Building intelligent products with AI and machine learning at the core",
      skills: [
        { 
          name: "AI-Powered SaaS MVPs", 
          icon: "/web app icon.svg",
          description: "Launch your AI product idea as a production-ready SaaS"
        },
        { 
          name: "LLM & GPT Integration", 
          icon: "/Ai icon.svg",
          description: "Add ChatGPT, RAG systems, and AI agents to any product"
        },
        { 
          name: "Custom ML Models", 
          icon: "/ds&ai-icon.svg",
          description: "Predictive analytics and intelligent automation"
        },
      ],
      cardClass: themeStyles.uiuxCard
    },
    {
      title: "Startup Technical Partnership",
      titleicon: "/it-consulting-support-icon.svg",
      description: "Your technical co-founder — from first line of code to scale",
      skills: [
        { 
          name: "SaaS & Web Platforms", 
          icon: "/web app icon.svg",
          description: "Full-stack web apps built for startups and growth"
        },
        { 
          name: "Mobile Apps", 
          icon: "/mobile app icon.svg", 
          darkIcon: "/Mobile App Dark.svg",
          description: "Cross-platform iOS & Android with AI features"
        },
        { 
          name: "CTO as a Service", 
          icon: "/Desktop-App-icon.svg", 
          darkIcon: "/Desktop App Dark.svg",
          description: "Tech strategy & team building for non-technical founders"
        },
      ],
      cardClass: themeStyles.developmentCard
    },
    {
      title: "AI Automation & Integration",
      titleicon: "/data scrapping icon.svg",
      description: "Replacing manual work with intelligent automation for SMEs",
      skills: [
        { 
          name: "Workflow Automation", 
          icon: "/data scrapping icon.svg",
          description: "AI-powered process automation that saves hours weekly"
        },
        { 
          name: "Smart Chatbots", 
          icon: "/Ai icon.svg",
          description: "AI assistants and chatbots for customer support & ops"
        },
        { 
          name: "System Integration", 
          icon: "/data visualization icon.svg",
          description: "Connect your tools with intelligent API integrations"
        },
        { 
          name: "AI-Powered Analytics", 
          icon: "/Big Data Analytics.svg",
          description: "Dashboards and insights powered by machine learning"
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
