"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import common from './TechStackCommon.module.css';
import light from './TechStackLight.module.css';
import dark from './TechStackDark.module.css';
import { fadeIn } from '../../utils/animations';

const techCategories = {
  'AI & Machine Learning': ['TensorFlow', 'PyTorch', 'OpenAI', 'Scikit-learn', 'Azure AI'],
  'Data & Analytics': ['Python', 'Power BI', 'Tableau', 'SQL', 'Spark'],
  'Web Development': ['React', 'Next.js', 'Node.js', 'TypeScript', 'GraphQL'],
  'Mobile Development': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
  'Cloud & DevOps': ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins'],
  'Design': ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Zeplin'],
};

const TechStack: React.FC = () => {
  const { theme } = useTheme();
  const themed = theme === 'dark' ? dark : light;
  const cx = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');

  return (
    <section className={cx(common.techStackSection, themed.techStackSection)}>
      <div className={common.container}>
        <motion.h2 
          className={cx(common.heading, themed.heading)}
          variants={fadeIn('up', 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          Technologies We Use
        </motion.h2>
        <motion.p 
          className={cx(common.subheading, themed.subheading)}
          variants={fadeIn('up', 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          We leverage the latest and greatest technologies to deliver robust, scalable, and innovative solutions.
        </motion.p>
        <div className={common.categoriesGrid}>
          {Object.entries(techCategories).map(([category, techs], index) => (
            <motion.div 
              key={category} 
              className={cx(common.categoryCard, themed.categoryCard)}
              variants={fadeIn('up', 0.2 * (index + 2))}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <h3 className={cx(common.categoryTitle, themed.categoryTitle)}>{category}</h3>
              <div className={common.techGrid}>
                {techs.map((tech) => (
                  <div key={tech} className={cx(common.techItem, themed.techItem)}>
                    {/* Placeholder for icon */}
                    <span className={cx(common.techName, themed.techName)}>{tech}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
