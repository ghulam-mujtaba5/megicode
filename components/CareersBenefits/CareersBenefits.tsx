"use client";
import React from 'react';
import common from './CareersBenefitsCommon.module.css';
import light from './CareersBenefitsLight.module.css';
import dark from './CareersBenefitsDark.module.css';
import { useTheme } from '../../context/ThemeContext';

const benefits = [
  {
    title: "Competitive Salary",
    description: "We offer market-leading compensation and performance bonuses."
  },
  {
    title: "Health & Wellness",
    description: "Comprehensive medical coverage and wellness programs."
  },
  {
    title: "Remote/Hybrid Work",
    description: "Work from anywhere or join us at our collaborative office."
  },
  {
    title: "Learning Budget",
    description: "Annual budget for courses, certifications, and conferences."
  },
  {
    title: "Paid Time Off",
    description: "Generous vacation, sick leave, and public holidays."
  }
];

const CareersBenefits: React.FC = () => {
  const { theme } = useTheme();
  const themed = theme === 'dark' ? dark : light;
  const cx = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');
  return (
  <section className={cx(common.benefitsSection, themed.benefitsSection)}>
    <h2 className={cx(common.heading, themed.heading)}>Benefits & Perks</h2>
    <div className={common.benefitsGrid}>
      {benefits.map((benefit, idx) => (
        <div className={cx(common.benefitCard, themed.benefitCard)} key={idx}>
          <h3 className={cx(common.title, themed.title)}>{benefit.title}</h3>
          <p className={cx(common.description, themed.description)}>{benefit.description}</p>
        </div>
      ))}
    </div>
  </section>
  );
};

export default CareersBenefits;
