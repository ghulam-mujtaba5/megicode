'use client';
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import commonStyles from './ServicesFrameCommon.module.css';
import lightStyles from './ServicesFrameLight.module.css';
import darkStyles from './ServicesFrameDark.module.css';

const ServicesFrame = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;
  const [visible, setVisible] = useState<boolean[]>([]);
  const skillCardRefs = useRef<(HTMLElement | null)[]>([]);

  const skillsData = [
    {
      title: "UI & UX Designing",
      titleicon: "Ui&Ux-icon.svg",
      skills: [
        { name: "Desktop Application", icon: "Desktop-App-icon.svg", darkIcon: "Desktop App Dark.svg" },
        { name: "Web Application", icon: "web app icon.svg" },
        { name: "Mobile App", icon: "mobile app icon.svg", darkIcon: "Mobile App Dark.svg" },
      ],
      cardClass: themeStyles.uiuxCard
    },
    {
      title: "Development",
      titleicon: "devlopment-icon.svg",
      skills: [
        { name: "Desktop Application", icon: "Desktop-App-icon.svg", darkIcon: "Desktop App Dark.svg" },
        { name: "Web Application", icon: "web app icon.svg" },
        { name: "Mobile App", icon: "mobile app icon.svg", darkIcon: "Mobile App Dark.svg" },
      ],
      cardClass: themeStyles.developmentCard
    },
    {
      title: "Data Science & AI",
      titleicon: "ds&ai-icon.svg",
      skills: [
        { name: "Data Scraping", icon: "data scrapping icon.svg" },
        { name: "Data Visualization", icon: "data visualization icon.svg" },
        { name: "Big Data Analytics", icon: "Big Data Analytics.svg" },
        { name: "AI Solution Development", icon: "Ai icon.svg" }
      ],
      cardClass: themeStyles.dataScienceCard
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const cardsVisible = skillCardRefs.current.map(ref => {
        if (ref) {
          const { top, bottom } = ref.getBoundingClientRect();
          return bottom >= 0 && top <= window.innerHeight;
        }
        return false;
      });
      setVisible(cardsVisible);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className={`${commonStyles.skillFrame} ${themeStyles.skillFrame}`} aria-labelledby="services-heading">
      <motion.h2 
        id="services-heading" 
        className={`${commonStyles.skillsTitle} ${themeStyles.skillsTitle}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Our Services
      </motion.h2>

      {skillsData.map((category, index) => (
        <motion.article
          className={`${commonStyles.skillCard} ${themeStyles.skillCard} ${category.cardClass} ${visible[index] ? commonStyles.animateIn : ''}`}
          key={index}
          ref={el => { skillCardRefs.current[index] = el; }}
          aria-labelledby={`${category.title.replace(/ /g, '-')}-title`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
        >
          <header className={`${commonStyles.header} ${themeStyles.header}`}>
            <img 
              className={`${commonStyles.categoryIcon} ${themeStyles.categoryIcon}`} 
              alt={`${category.title} icon`} 
              src={category.titleicon} 
            />
            <h3 
              id={`${category.title.replace(/ /g, '-')}-title`} 
              className={`${commonStyles.title} ${themeStyles.title}`}
            >
              {category.title}
            </h3>
          </header>

          {category.skills.map((skill, skillIndex) => (
            <motion.div 
              key={skillIndex} 
              className={`${commonStyles.skillRow} ${themeStyles.skillRow}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: (index * 0.2) + (skillIndex * 0.1) }}
            >
              <img 
                className={`${commonStyles.icon} ${themeStyles.icon}`} 
                alt={`${skill.name} icon`} 
                src={theme === 'dark' && skill.darkIcon ? skill.darkIcon : skill.icon} 
              />
              <div className={commonStyles.skillNameContainer}>
                <div className={`${commonStyles.skillName} ${themeStyles.skillName}`}>
                  {skill.name}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.article>
      ))}
    </section>
  );
};

export default ServicesFrame;
