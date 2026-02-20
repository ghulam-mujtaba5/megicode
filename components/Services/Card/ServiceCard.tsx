'use client';
import React from 'react';
import { motion, easeOut } from 'framer-motion';
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
  href?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  features,
  techs,
  delay = 0,
  href
}) => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        delay,
        ease: easeOut
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: delay + 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: easeOut
      }
    }
  };

  return (
    <motion.div
      className={`${commonStyles.card} ${themeStyles.card}`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      {/* Top accent bar */}
      <div className={commonStyles.accentBar} />

      <a
        href={href}
        className={commonStyles.cardLink}
        aria-label={`Learn more about ${title}`}
      >
        <div className={commonStyles.cardContent}>
          {/* Header: Icon + Title */}
          <div className={commonStyles.headerRow}>
            <motion.div
              className={`${commonStyles.iconWrapper} ${themeStyles.iconWrapper}`}
              whileHover={{ scale: 1.06 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
            >
              <img src={icon} alt="" className={commonStyles.icon} aria-hidden="true" />
            </motion.div>

            <motion.h3
              className={`${commonStyles.title} ${themeStyles.title}`}
              variants={itemVariants}
            >
              {title}
            </motion.h3>
          </div>

          <motion.div variants={contentVariants} initial="hidden" animate="visible">
            <motion.p
              className={`${commonStyles.description} ${themeStyles.description}`}
              variants={itemVariants}
            >
              {description}
            </motion.p>

            {/* Divider */}
            <hr className={`${commonStyles.divider} ${themeStyles.divider}`} />

            <motion.div
              className={`${commonStyles.featuresContainer} ${themeStyles.featuresContainer}`}
              variants={contentVariants}
            >
              {/* Features */}
              <motion.div className={commonStyles.featuresList}>
                {features.slice(0, 3).map((feature, index) => (
                  <motion.div
                    key={index}
                    className={`${commonStyles.feature} ${themeStyles.feature}`}
                    variants={itemVariants}
                  >
                    <span className={`${commonStyles.featureIcon} ${themeStyles.featureIcon}`}>
                      &#10003;
                    </span>
                    {feature}
                  </motion.div>
                ))}
              </motion.div>

              {/* Tech badges */}
              <motion.div className={commonStyles.techsList} variants={contentVariants}>
                {techs.slice(0, 4).map((tech, index) => (
                  <motion.span
                    key={index}
                    className={`${commonStyles.techBadge} ${themeStyles.techBadge}`}
                    variants={itemVariants}
                  >
                    {tech}
                  </motion.span>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div
                className={`${commonStyles.ctaRow} ${themeStyles.ctaRow}`}
                variants={itemVariants}
              >
                Explore service
                <span className={commonStyles.ctaIcon}>&#8594;</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </a>
    </motion.div>
  );
};

export default ServiceCard;
