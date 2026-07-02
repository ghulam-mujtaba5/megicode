'use client';
import React from 'react';

import Image from 'next/image';

import { motion } from 'framer-motion';

import { useTheme } from '../../context/ThemeContext';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import commonStyles from './CoreValuesCommon.module.css';
import darkStyles from './CoreValuesDark.module.css';
import lightStyles from './CoreValuesLight.module.css';

interface ValueCardProps {
  title: string;
  description: string;
  iconSrc: string;
}

const ValueCard: React.FC<ValueCardProps> = ({ title, description, iconSrc }) => {
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
            width: 110,
            height: 110,
            borderRadius: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background:
              'linear-gradient(135deg, rgba(69,115,223,0.12) 0%, rgba(69,115,223,0.05) 100%)',
            boxShadow: '0 8px 24px rgba(69,115,223,0.1)',
            border: '1px solid rgba(69,115,223,0.15)',
          }}
        >
          <Image
            src={iconSrc}
            alt={title}
            width={100}
            height={100}
            style={{
              objectFit: 'contain',
            }}
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
        'We use AI where it earns its place — automating real work and adding product features that users actually need.',
      iconSrc: '/icons/core-values/innovation.png',
    },
    {
      title: 'Excellence',
      description:
        'Code you can maintain, systems that stay up, and details finished properly — because you will live with this software for years.',
      iconSrc: '/icons/core-values/excellence.png',
    },
    {
      title: 'Collaboration',
      description:
        'You talk directly to the people building your product. Weekly progress you can see, no account-manager buffer.',
      iconSrc: '/icons/core-values/collaboration.png',
    },
    {
      title: 'Growth',
      description:
        'We measure our work by your outcomes: leads captured, hours saved, users active — not features shipped.',
      iconSrc: '/icons/core-values/growth.png',
    },
    {
      title: 'Client Focus',
      description:
        'We scope around your budget and business stage, and tell you when something is not worth building yet.',
      iconSrc: '/icons/core-values/client-focus.png',
    },
    {
      title: 'Integrity',
      description:
        'Honest timelines, transparent pricing, and your code in your own repositories from day one.',
      iconSrc: '/icons/core-values/integrity.png',
    },
  ];

  return (
    <section className={`${commonStyles.coreValuesSection} ${themeStyles.coreValuesSection}`}>
      <div className={commonStyles.container}>
        <motion.div className={commonStyles.header} variants={fadeInUp}>
          <h2 className={`${commonStyles.title} ${themeStyles.title}`}>Our Core Values</h2>
          <p className={`${commonStyles.subtitle} ${themeStyles.subtitle}`}>
            How we work when we build your product — the standards behind every project.
          </p>
        </motion.div>

        <motion.div className={commonStyles.valuesGrid} variants={staggerContainer}>
          {values.map((value) => (
            <ValueCard
              key={value.title}
              title={value.title}
              description={value.description}
              iconSrc={value.iconSrc}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CoreValues;
