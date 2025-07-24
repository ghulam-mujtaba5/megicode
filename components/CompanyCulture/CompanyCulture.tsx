"use client";
import React from 'react';
import styles from './CompanyCulture.module.css';

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

const CompanyCulture: React.FC = () => (
  <section className={styles.cultureSection}>
    <h2 className={styles.heading}>Our Company Culture</h2>
    <div className={styles.cultureGrid}>
      {culturePoints.map((point, idx) => (
        <div className={styles.cultureCard} key={idx}>
          <h3 className={styles.title}>{point.title}</h3>
          <p className={styles.description}>{point.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default CompanyCulture;
