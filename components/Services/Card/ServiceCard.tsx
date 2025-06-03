'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import commonStyles from './ServiceCardCommon.module.css';
import lightStyles from './ServiceCardLight.module.css';
import darkStyles from './ServiceCardDark.module.css';

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  features: string[];
  techs: string[];
  delay?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  icon, 
  title, 
  description, 
  features, 
  techs,
  delay = 0 
}) => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: "easeOut"
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: delay + 0.1 + i * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  const techVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: delay + 0.2 + i * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div 
      className={`${commonStyles.card} ${themeStyles.card}`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.div 
        className={`${commonStyles.iconWrapper} ${themeStyles.iconWrapper}`}
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        <img src={icon} alt={`${title} icon`} className={commonStyles.icon} />
      </motion.div>

      <h3 className={`${commonStyles.title} ${themeStyles.title}`}>{title}</h3>
      <p className={`${commonStyles.description} ${themeStyles.description}`}>{description}</p>
      
      <motion.div 
        className={`${commonStyles.featuresContainer} ${themeStyles.featuresContainer}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: delay + 0.1 }}
      >
        <h4 className={`${commonStyles.title} ${themeStyles.title}`}>Key Features</h4>
        <ul className={commonStyles.featuresList}>
          {features.map((feature, index) => (
            <motion.li 
              key={index} 
              className={`${commonStyles.feature} ${themeStyles.feature}`}
              custom={index}
              variants={featureVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <svg className={`${commonStyles.checkIcon} ${themeStyles.checkIcon}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {feature}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.div 
        className={`${commonStyles.techsContainer} ${themeStyles.techsContainer}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: delay + 0.2 }}
      >
        <h4 className={`${commonStyles.title} ${themeStyles.title}`}>Technologies</h4>
        <div className={commonStyles.techsList}>
          {techs.map((tech, index) => (
            <motion.span 
              key={index} 
              className={`${commonStyles.techBadge} ${themeStyles.techBadge}`}
              custom={index}
              variants={techVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.1, y: -2 }}
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ServiceCard;
