"use client";
import React from 'react';
import common from './OpenPositionsCommon.module.css';
import light from './OpenPositionsLight.module.css';
import dark from './OpenPositionsDark.module.css';
import { useTheme } from '../../context/ThemeContext';

const positions = [
  {
    title: "Frontend Engineer",
    location: "Remote / Lahore, PK",
    type: "Full Time",
    description: "Build beautiful, scalable user interfaces with React, TypeScript, and Next.js.",
    requirements: [
      "2+ years React/Next.js experience",
      "Strong CSS/JS/TS skills",
      "Passion for UX/UI"
    ],
    applyLink: "mailto:careers@megicode.com?subject=Application%20for%20Frontend%20Engineer"
  },
  {
    title: "Backend Engineer",
    location: "Remote / Lahore, PK",
    type: "Full Time",
    description: "Design and build robust, scalable APIs and backend systems.",
    requirements: [
      "2+ years Node.js/Express",
      "Familiarity with databases (SQL/NoSQL)",
      "API design best practices"
    ],
    applyLink: "mailto:careers@megicode.com?subject=Application%20for%20Backend%20Engineer"
  },
  {
    title: "AI/ML Engineer",
    location: "Remote / Lahore, PK",
    type: "Full Time",
    description: "Develop intelligent solutions using machine learning and AI frameworks.",
    requirements: [
      "Experience with Python ML stack",
      "Familiarity with LLMs, NLP, or CV",
      "Problem-solving mindset"
    ],
    applyLink: "mailto:careers@megicode.com?subject=Application%20for%20AI%2FML%20Engineer"
  }
];

const OpenPositions: React.FC = () => {
  const { theme } = useTheme();
  const themed = theme === 'dark' ? dark : light;
  const cx = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');
  return (
  <section className={cx(common.positionsSection, themed.positionsSection)}>
    <h2 className={cx(common.heading, themed.heading)}>Open Positions</h2>
    <div className={common.positionsGrid}>
      {positions.map((pos, idx) => (
        <div className={cx(common.positionCard, themed.positionCard)} key={idx}>
          <h3 className={cx(common.title, themed.title)}>{pos.title}</h3>
          <div className={cx(common.meta, themed.meta)}>
            <span className={cx(common.location, themed.location)}>{pos.location}</span>
            <span className={cx(common.type, themed.type)}>{pos.type}</span>
          </div>
          <p className={cx(common.description, themed.description)}>{pos.description}</p>
          <ul className={cx(common.requirements, themed.requirements)}>
            {pos.requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
          <a href={pos.applyLink} className={cx(common.applyBtn, themed.applyBtn)} target="_blank" rel="noopener noreferrer">
            Apply Now
          </a>
        </div>
      ))}
    </div>
  </section>
  );
};

export default OpenPositions;
