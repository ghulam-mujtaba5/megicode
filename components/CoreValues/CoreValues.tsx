'use client';
import React from 'react';

import { motion } from 'framer-motion';

import { useTheme } from '../../context/ThemeContext';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import LottiePlayer from '../LottiePlayer/LottiePlayer';
import commonStyles from './CoreValuesCommon.module.css';
import darkStyles from './CoreValuesDark.module.css';
import lightStyles from './CoreValuesLight.module.css';

interface ValueCardProps {
  title: string;
  description: string;
  lottieFile: string;
}

const ValueCard: React.FC<ValueCardProps> = ({ title, description, lottieFile }) => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  return (
    <motion.div
      className={`${commonStyles.valueCard} ${themeStyles.valueCard}`}
      variants={fadeInUp}
    >
      <div className={commonStyles.iconWrapper}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background:
              'linear-gradient(135deg, rgba(69,115,223,0.12) 0%, rgba(69,115,223,0.05) 100%)',
            boxShadow: '0 8px 24px rgba(69,115,223,0.1)',
            border: '1px solid rgba(69,115,223,0.15)',
          }}
        >
          <LottiePlayer
            src={lottieFile}
            loop
            autoplay
            pauseWhenHidden
            speed={0.65}
            style={{ width: 48, height: 48 }}
          />
        </div>
      </div>
      <h3 className={`${commonStyles.valueTitle} ${themeStyles.valueTitle}`}>{title}</h3>
      <p className={`${commonStyles.valueDescription} ${themeStyles.valueDescription}`}>
        {description}
      </p>
    </motion.div>
  );
};

const CoreValues = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  const values = [
    {
      title: 'Innovation',
      description:
        'Pioneering breakthrough solutions with cutting-edge AI and advanced technologies to transform businesses.',
      lottieFile: '/lottie/10_product_launch_rocket.json',
    },
    {
      title: 'Excellence',
      description:
        'Delivering exceptional quality through robust, scalable, and secure software solutions.',
      lottieFile: '/lottie/14_uiux_web_design.json',
    },
    {
      title: 'Collaboration',
      description:
        'Building strong partnerships with clients through transparent communication and shared success.',
      lottieFile: '/lottie/16_team_collaboration.json',
    },
    {
      title: 'Growth',
      description: 'Continuously evolving and adapting to drive measurable business outcomes.',
      lottieFile: '/lottie/07_data_analytics_growth.json',
    },
    {
      title: 'Client Focus',
      description: 'Understanding and exceeding client expectations with tailored solutions.',
      lottieFile: '/lottie/12_customer_support_agent.json',
    },
    {
      title: 'Integrity',
      description: 'Operating with unwavering commitment to ethical practices and transparency.',
      lottieFile: '/lottie/06_cybersecurity_trust.json',
    },
  ];

  return (
    <section className={`${commonStyles.coreValuesSection} ${themeStyles.coreValuesSection}`}>
      <div className={commonStyles.container}>
        <motion.div className={commonStyles.header} variants={fadeInUp}>
          <h2 className={`${commonStyles.title} ${themeStyles.title}`}>Our Core Values</h2>
          <p className={`${commonStyles.subtitle} ${themeStyles.subtitle}`}>
            Guided by innovation and excellence, we deliver transformative solutions that drive
            success.
          </p>
        </motion.div>

        <motion.div className={commonStyles.valuesGrid} variants={staggerContainer}>
          {values.map((value) => (
            <ValueCard
              key={value.title}
              title={value.title}
              description={value.description}
              lottieFile={value.lottieFile}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CoreValues;
