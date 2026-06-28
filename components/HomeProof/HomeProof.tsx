'use client';

import React from 'react';

import Image from 'next/image';

import { useTheme } from '../../context/ThemeContext';
import commonStyles from './HomeProofCommon.module.css';
import darkStyles from './HomeProofDark.module.css';
import lightStyles from './HomeProofLight.module.css';

const proofItems = [
  {
    iconSrc: '/icons/about-stats/software-development.png',
    value: '15+',
    label: 'AI & software products built',
    note: 'Real product delivery, not demo screens',
  },
  {
    iconSrc: '/icons/about-stats/global-reach.png',
    value: '5+',
    label: 'countries served',
    note: 'Remote-ready delivery for global clients',
  },
  {
    iconSrc: '/icons/about-stats/partnerships.png',
    value: '10+',
    label: 'startups & businesses partnered',
    note: 'Founder-friendly software and automation',
  },
];

export default function HomeProof() {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  return (
    <section
      className={`${commonStyles.section} ${themeStyles.section}`}
      aria-label="Megicode proof"
    >
      <div className={commonStyles.container}>
        {proofItems.map(({ iconSrc, value, label, note }) => (
          <div key={label} className={`${commonStyles.item} ${themeStyles.item}`}>
            <span className={`${commonStyles.icon} ${themeStyles.icon}`} aria-hidden="true">
              <Image
                src={iconSrc}
                alt=""
                width={72}
                height={72}
                className={commonStyles.iconImage}
              />
            </span>
            <span className={commonStyles.copy}>
              <span className={`${commonStyles.value} ${themeStyles.value}`}>{value}</span>
              <span className={`${commonStyles.label} ${themeStyles.label}`}>{label}</span>
              <span className={`${commonStyles.note} ${themeStyles.note}`}>{note}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
