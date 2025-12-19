"use client";

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import AnimatedCard from '@/components/AnimatedCard/AnimatedCard';
import commonStyles from './ExplorePageCommon.module.css';
import lightStyles from './ExplorePageLight.module.css';
import darkStyles from './ExplorePageDark.module.css';

export default function ExplorePage() {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  const features = [
    {
      title: "Feature Showcase",
      description: "Experience the Silicon Valley-standard capabilities of our portal, including instant monitoring and automated workflows.",
      link: "/internal/showcase",
      linkText: "View Showcase →"
    },
    {
      title: "Live Monitoring",
      description: "Watch the pulse of the organization with real-time metrics on system health, project velocity, and team performance.",
      link: "/internal/monitoring",
      linkText: "Open Dashboard →"
    },
    {
      title: "Process Visualization",
      description: "Understand the 'Megicode Way' of software delivery through our interactive BPMN diagrams and workflow steps.",
      link: "/internal/process",
      linkText: "View Process →"
    },
    {
      title: "Project Instances",
      description: "Deep dive into active project instances, tracking every task, commit, and deployment in real-time.",
      link: "/internal/instances",
      linkText: "View Instances →"
    }
  ];

  return (
    <div className={commonStyles.container}>
      <header className={commonStyles.header}>
        <h1 className={`${commonStyles.title} ${themeStyles.title}`}>Explore Megicode Portal</h1>
        <p className={`${commonStyles.subtitle} ${themeStyles.subtitle}`}>
          Your gateway to understanding our advanced software delivery operating system.
        </p>
      </header>

      <div className={commonStyles.grid}>
        {features.map((feature, index) => (
          <AnimatedCard 
            key={index} 
            className={`${commonStyles.card} ${themeStyles.card}`}
            hoverGlow={true}
          >
            <div>
              <h2 className={`${commonStyles.cardTitle} ${themeStyles.cardTitle}`}>{feature.title}</h2>
              <p className={`${commonStyles.cardDescription} ${themeStyles.cardDescription}`}>
                {feature.description}
              </p>
            </div>
            <Link href={feature.link} className={`${commonStyles.cardLink} ${themeStyles.cardLink}`}>
              {feature.linkText}
            </Link>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );
}
