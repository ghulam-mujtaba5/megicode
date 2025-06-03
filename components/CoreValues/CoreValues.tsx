'use client';
import React from 'react';
import { motion } from 'framer-motion';
import commonStyles from './CoreValuesCommon.module.css';
import lightStyles from './CoreValuesLight.module.css';
import darkStyles from './CoreValuesDark.module.css';
import { useTheme } from '../../context/ThemeContext';
import IconWrapper from '../IconSystem/IconWrapper';
import {
  InnovationIcon,
  ExcellenceIcon,
  TeamworkIcon,
  GrowthIcon,
  ClientFocusIcon,
  IntegrityIcon
} from '../IconSystem/icons';

interface ValueCardProps {
  title: string;
  description: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  delay: number;
}

const ValueCard: React.FC<ValueCardProps> = ({ title, description, Icon, delay }) => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;
  
  return (
    <motion.div 
      className={`${commonStyles.valueCard} ${themeStyles.valueCard}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <div className={commonStyles.iconWrapper}>
        <IconWrapper size={72}>
          <Icon size={32} color={theme === 'dark' ? '#7ba0ff' : '#4573df'} />
        </IconWrapper>
      </div>
      <h3 className={`${commonStyles.valueTitle} ${themeStyles.valueTitle}`}>{title}</h3>
      <p className={`${commonStyles.valueDescription} ${themeStyles.valueDescription}`}>{description}</p>
    </motion.div>
  );
};

const CoreValues = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  const values = [
    {
      title: 'Innovation',
      description: 'Pioneering breakthrough solutions with cutting-edge AI and advanced technologies to transform businesses.',
      Icon: InnovationIcon
    },
    {
      title: 'Excellence',
      description: 'Delivering exceptional quality through robust, scalable, and secure software solutions.',
      Icon: ExcellenceIcon
    },
    {
      title: 'Collaboration',
      description: 'Building strong partnerships with clients through transparent communication and shared success.',
      Icon: TeamworkIcon
    },
    {
      title: 'Growth',
      description: 'Continuously evolving and adapting to drive measurable business outcomes.',
      Icon: GrowthIcon
    },
    {
      title: 'Client Focus',
      description: 'Understanding and exceeding client expectations with tailored solutions.',
      Icon: ClientFocusIcon
    },
    {
      title: 'Integrity',
      description: 'Operating with unwavering commitment to ethical practices and transparency.',
      Icon: IntegrityIcon
    }
  ];

  return (
    <section className={`${commonStyles.coreValuesSection} ${themeStyles.coreValuesSection}`}>
      <div className={commonStyles.container}>
        <motion.div 
          className={commonStyles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`${commonStyles.title} ${themeStyles.title}`}>Our Core Values</h2>
          <p className={`${commonStyles.subtitle} ${themeStyles.subtitle}`}>
            Guided by innovation and excellence, we deliver transformative solutions that drive success.
          </p>
        </motion.div>
        
        <div className={commonStyles.valuesGrid}>
          {values.map((value, index) => (
            <ValueCard
              key={value.title}
              title={value.title}
              description={value.description}
              Icon={value.Icon}
              delay={0.2 + index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;
