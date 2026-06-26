'use client';
import React from 'react';

import Image from 'next/image';

import { useTheme } from '../../context/ThemeContext';
import common from './WhyWorkWithUsCommon.module.css';
import dark from './WhyWorkWithUsDark.module.css';
import light from './WhyWorkWithUsLight.module.css';

const reasons = [
  {
    title: 'Innovative Projects',
    description:
      'Shape the future with AI-driven, web, and mobile solutions for forward-thinking businesses.',
    icon: '/icons/innovation-icon.png',
  },
  {
    title: 'Growth & Learning',
    description:
      'Accelerate your career with continuous learning, mentorship, and real-world challenges.',
    icon: '/icons/growth-icon.png',
  },
  {
    title: 'Collaborative Culture',
    description: 'Thrive in a team that values openness, creativity, and diverse perspectives.',
    icon: '/icons/collaboration-icon.png',
  },
  {
    title: 'Flexible Work',
    description:
      'Enjoy hybrid/remote options and a healthy work-life balance—your well-being matters.',
    icon: '/icons/flexibility-icon.png',
  },
  {
    title: 'Real Impact',
    description:
      'See your ideas come to life and drive meaningful results for clients and industries.',
    icon: '/icons/impact-icon.png',
  },
];

const WhyWorkWithUs: React.FC = () => {
  const { theme } = useTheme();
  const themed = theme === 'dark' ? dark : light;
  const cx = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');

  return (
    <section className={cx(common.whyWorkSection, themed.whyWorkSection)}>
      <h2 className={cx(common.heading, themed.heading)}>Why Work With Us?</h2>
      <div className={cx(common.reasonsGrid, themed.reasonsGrid)}>
        {reasons.map((reason, idx) => (
          <div className={cx(common.reasonCard, themed.reasonCard)} key={idx}>
            <div className={cx(common.icon, themed.icon)}>
              <Image src={reason.icon} alt={`${reason.title} icon`} width={80} height={80} />
            </div>
            <h3 className={cx(common.title, themed.title)}>{reason.title}</h3>
            <p className={cx(common.description, themed.description)}>{reason.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyWorkWithUs;
