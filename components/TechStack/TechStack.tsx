"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import common from './TechStackCommon.module.css';
import light from './TechStackLight.module.css';
import dark from './TechStackDark.module.css';
import { fadeIn } from '../../utils/animations';
import {
  SiTensorflow, SiPytorch, SiOpenai, SiScikitlearn,
  SiPython, SiTableau, SiApachespark, SiReact, SiNextdotjs,
  SiNodedotjs, SiTypescript, SiGraphql, SiFlutter, SiSwift, SiKotlin,
  SiFirebase, SiAmazon, SiDocker, SiKubernetes, SiTerraform, SiJenkins,
  SiFigma, SiAdobexd, SiSketch, SiInvision, SiAdobe,
} from 'react-icons/si';
import { DiDatabase } from 'react-icons/di';

const techCategories = {
  'AI & Machine Learning': ['TensorFlow', 'PyTorch', 'OpenAI', 'Scikit-learn'],
  'Data & Analytics': ['Python', 'Tableau', 'SQL', 'Spark'],
  'Web Development': ['React', 'Next.js', 'Node.js', 'TypeScript', 'GraphQL'],
  'Mobile Development': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
  'Cloud & DevOps': ['Amazon Web Services', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins'],
  'Design': ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Adobe Creative'],
};

const colorMap: { [key: string]: string } = {
  'TensorFlow': '#FF6F00',
  'PyTorch': '#EE4C2C',
  'OpenAI': '#4A90E2',
  'Scikit-learn': '#F7931E',
  'Python': '#3776AB',
  'Tableau': '#E97627',
  'SQL': '#00758F',
  'Spark': '#E25A1C',
  'React': '#61DAFB',
  'Next.js': '#000000',
  'Node.js': '#339933',
  'TypeScript': '#3178C6',
  'GraphQL': '#E10098',
  'React Native': '#61DAFB',
  'Flutter': '#02569B',
  'Swift': '#F05138',
  'Kotlin': '#7F52FF',
  'Firebase': '#FFCA28',
  'Amazon Web Services': '#FF9900',
  'Docker': '#2496ED',
  'Kubernetes': '#326CE5',
  'Terraform': '#7B42BC',
  'Jenkins': '#D24939',
  'Figma': '#F24E1E',
  'Adobe XD': '#FF61F6',
  'Sketch': '#F7B500',
  'InVision': '#FF3366',
  'Adobe Creative': '#FF0000',
};

const iconMap: { [key: string]: React.ElementType } = {
  'TensorFlow': SiTensorflow,
  'PyTorch': SiPytorch,
  'OpenAI': SiOpenai,
  'Scikit-learn': SiScikitlearn,
  'Python': SiPython,
  'Tableau': SiTableau,
  'SQL': DiDatabase,
  'Spark': SiApachespark,
  'React': SiReact,
  'Next.js': SiNextdotjs,
  'Node.js': SiNodedotjs,
  'TypeScript': SiTypescript,
  'GraphQL': SiGraphql,
  'React Native': SiReact,
  'Flutter': SiFlutter,
  'Swift': SiSwift,
  'Kotlin': SiKotlin,
  'Firebase': SiFirebase,
  'Amazon Web Services': SiAmazon,
  'Docker': SiDocker,
  'Kubernetes': SiKubernetes,
  'Terraform': SiTerraform,
  'Jenkins': SiJenkins,
  'Figma': SiFigma,
  'Adobe XD': SiAdobexd,
  'Sketch': SiSketch,
  'InVision': SiInvision,
  'Adobe Creative': SiAdobe,
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
                {techs.map((tech) => {
                  const Icon = iconMap[tech];
                  const color = colorMap[tech];
                  return (
                    <div key={tech} className={cx(common.techItem, themed.techItem)}>
                      {Icon && <Icon className={common.techIcon} style={{ color }} />}
                      <span className={cx(common.techName, themed.techName)}>{tech}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
