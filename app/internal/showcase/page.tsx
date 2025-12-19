"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import commonStyles from './ShowcasePageCommon.module.css';
import lightStyles from './ShowcasePageLight.module.css';
import darkStyles from './ShowcasePageDark.module.css';
import { motion } from 'framer-motion';

export default function ShowcasePage() {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  const sections = [
    {
      title: "Instant Monitoring",
      text: "Our portal doesn't poll; it listens. Using WebSockets and Webhooks, we achieve sub-500ms latency for all project updates. When a developer pushes code, the dashboard lights up instantly.",
      badge: "Real-Time",
      visual: "Live Dashboard Preview"
    },
    {
      title: "Automated Workflow",
      text: "Forget manual handoffs. Our state machine orchestrates the entire lifecycle. Code pushed? Task moves to Review. PR Merged? Task moves to QA. Deployment success? Client notified.",
      badge: "Zero-Touch",
      visual: "Workflow Engine Visualization"
    },
    {
      title: "Deep Integrations",
      text: "We don't reinvent the wheel; we connect the best ones. ClickUp for tasks, GitHub for code, Resend for emails. All synchronized into a single source of truth.",
      badge: "Connected",
      visual: "Integration Hub"
    }
  ];

  return (
    <div className={commonStyles.container}>
      <header className={commonStyles.header}>
        <h1 className={commonStyles.title}>System Showcase</h1>
        <p className={themeStyles.sectionText}>
          A deep dive into the technologies powering the Megicode Operating System.
        </p>
      </header>

      {sections.map((section, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          className={`${commonStyles.section} ${index % 2 === 1 ? commonStyles.sectionReverse : ''}`}
        >
          <div className={commonStyles.content}>
            <span className={commonStyles.badge}>{section.badge}</span>
            <h2 className={`${commonStyles.sectionTitle} ${themeStyles.sectionTitle}`}>
              {section.title}
            </h2>
            <p className={`${commonStyles.sectionText} ${themeStyles.sectionText}`}>
              {section.text}
            </p>
          </div>
          <div className={`${commonStyles.visual} ${themeStyles.visual}`}>
            {section.visual}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
