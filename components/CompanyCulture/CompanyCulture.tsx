"use client";
import React from 'react';
import common from './CompanyCultureCommon.module.css';
import light from './CompanyCultureLight.module.css';
import dark from './CompanyCultureDark.module.css';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const culturePoints = [
  {
    title: "Diversity & Inclusion",
    description: "We celebrate diverse backgrounds and believe great ideas come from everywhere."
  },
  {
    title: "Open Communication",
    description: "Transparent, honest, and respectful communication is at the heart of our team."
  },
  {
    title: "Ownership & Impact",
    description: "Everyone is empowered to take initiative and make a real difference."
  },
  {
    title: "Continuous Learning",
    description: "We invest in our people’s growth through mentorship, training, and feedback."
  },
  {
    title: "Fun & Collaboration",
    description: "We work hard, but we also celebrate wins and enjoy the journey together!"
  }
];

const CompanyCulture: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const themed = theme === 'dark' ? dark : light;

  return (
    <section className={[
      common.cultureSection,
      themed.cultureSection
    ].join(' ')}>
      <h2 className={[
        common.heading,
        themed.heading
      ].join(' ')}>Our Company Culture</h2>
      <div className={[
        common.cultureGrid,
        themed.cultureGrid
      ].join(' ')}>
        {culturePoints.map((point, idx) => (
          <div className={[
            common.cultureCard,
            themed.cultureCard
          ].join(' ')} key={idx}>
            <h3 className={[
              common.title,
              themed.title
            ].join(' ')}>{point.title}</h3>
            <p className={[
              common.description,
              themed.description
            ].join(' ')}>{point.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CompanyCulture;
