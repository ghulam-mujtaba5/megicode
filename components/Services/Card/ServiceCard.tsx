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
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay,
        ease: "easeOut"
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay + 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className={`${commonStyles.card} ${themeStyles.card}`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className={commonStyles.cardContent}>
        <motion.div 
          className={`${commonStyles.iconWrapper} ${themeStyles.iconWrapper}`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <img src={icon} alt={`${title} icon`} className={commonStyles.icon} />
        </motion.div>

        <motion.div variants={contentVariants} initial="hidden" animate="visible">
          <motion.h3 
            className={`${commonStyles.title} ${themeStyles.title}`}
            variants={itemVariants}
          >
            {title}
          </motion.h3>
          
          <motion.p 
            className={`${commonStyles.description} ${themeStyles.description}`}
            variants={itemVariants}
          >
            {description}
          </motion.p>
          
          <motion.div 
            className={`${commonStyles.featuresContainer} ${themeStyles.featuresContainer}`}
            variants={contentVariants}
          >
            <motion.div className={commonStyles.featuresList}>
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className={`${commonStyles.feature} ${themeStyles.feature}`}
                  variants={itemVariants}
                >
                  <span className={`${commonStyles.featureDot} ${themeStyles.featureDot}`} />
                  {feature}
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className={commonStyles.techsList}
              variants={contentVariants}
            >
              {techs.map((tech, index) => (
                <motion.span
                  key={index}
                  className={`${commonStyles.techBadge} ${themeStyles.techBadge}`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
