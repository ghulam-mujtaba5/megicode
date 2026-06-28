'use client';
import React from 'react';
import { DiDatabase } from 'react-icons/di';
import { FaAws, FaPalette } from 'react-icons/fa';
import { HiArrowTrendingUp, HiBolt, HiCpuChip, HiShieldCheck } from 'react-icons/hi2';
import {
  SiApachespark,
  SiDocker,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiFlutter,
  SiInvision,
  SiJenkins,
  SiKotlin,
  SiKubernetes,
  SiLooker,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPython,
  SiPytorch,
  SiReact,
  SiScikitlearn,
  SiSketch,
  SiSpringboot,
  SiSwift,
  SiTensorflow,
  SiTerraform,
} from 'react-icons/si';

import { motion } from 'framer-motion';

import { useTheme } from '../../context/ThemeContext';
import { fadeIn } from '../../utils/animations';
import common from './TechStackCommon.module.css';
import dark from './TechStackDark.module.css';
import light from './TechStackLight.module.css';

const techCategories = {
  'AI & Machine Learning': {
    outcome: 'Agents, LLM features, classification, automation, and decision systems.',
    proof: 'Used for intelligent workflows',
    Icon: HiCpuChip,
    techs: ['TensorFlow', 'PyTorch', 'OpenAI', 'Scikit-learn'],
  },
  'Data & Analytics': {
    outcome: 'Dashboards, reporting layers, data pipelines, and business intelligence.',
    proof: 'Turns scattered data into clarity',
    Icon: HiArrowTrendingUp,
    techs: ['Python', 'Tableau', 'SQL', 'Spark'],
  },
  'Web Development': {
    outcome: 'Fast marketing sites, SaaS platforms, portals, CRMs, and internal tools.',
    proof: 'Core stack for production apps',
    Icon: HiBolt,
    techs: ['React', 'Next.js', 'Node.js', 'Spring Boot', 'Express.js'],
  },
  'Mobile Development': {
    outcome: 'Mobile apps, companion products, and cross-platform customer experiences.',
    proof: 'For iOS, Android, and Firebase-backed apps',
    Icon: HiCpuChip,
    techs: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
  },
  'Cloud & DevOps': {
    outcome: 'Reliable deployments, containers, automation, monitoring, and launch readiness.',
    proof: 'Keeps products stable after launch',
    Icon: HiShieldCheck,
    techs: ['Amazon Web Services', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins'],
  },
  Design: {
    outcome: 'Product UX, interface systems, prototypes, and conversion-focused visuals.',
    proof: 'Makes products easier to trust',
    Icon: HiSparkleProxy,
    techs: ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Adobe Creative'],
  },
};

function HiSparkleProxy(props: React.ComponentProps<typeof HiBolt>) {
  return <HiBolt {...props} />;
}

const colorMap: { [key: string]: string } = {
  TensorFlow: '#FF6F00',
  PyTorch: '#EE4C2C',
  OpenAI: '#4A90E2',
  'Scikit-learn': '#F7931E',
  Python: '#3776AB',
  Tableau: '#E97627',
  SQL: '#00758F',
  Spark: '#E25A1C',
  React: '#61DAFB',
  'Next.js': '#000000',
  'Node.js': '#339933',
  'Spring Boot': '#6DB33F',
  'Express.js': '#000000',
  'React Native': '#61DAFB',
  Flutter: '#02569B',
  Swift: '#F05138',
  Kotlin: '#7F52FF',
  Firebase: '#FFCA28',
  'Amazon Web Services': '#FF9900',
  Docker: '#2496ED',
  Kubernetes: '#326CE5',
  Terraform: '#7B42BC',
  Jenkins: '#D24939',
  Figma: '#F24E1E',
  'Adobe XD': '#FF61F6',
  Sketch: '#F7B500',
  InVision: '#FF3366',
  'Adobe Creative': '#FF0000',
};

const iconMap: { [key: string]: React.ElementType } = {
  TensorFlow: SiTensorflow,
  PyTorch: SiPytorch,
  OpenAI: SiOpenai,
  'Scikit-learn': SiScikitlearn,
  Python: SiPython,
  Tableau: SiLooker,
  SQL: DiDatabase,
  Spark: SiApachespark,
  React: SiReact,
  'Next.js': SiNextdotjs,
  'Node.js': SiNodedotjs,
  'Spring Boot': SiSpringboot,
  'Express.js': SiExpress,
  'React Native': SiReact,
  Flutter: SiFlutter,
  Swift: SiSwift,
  Kotlin: SiKotlin,
  Firebase: SiFirebase,
  'Amazon Web Services': FaAws,
  Docker: SiDocker,
  Kubernetes: SiKubernetes,
  Terraform: SiTerraform,
  Jenkins: SiJenkins,
  Figma: SiFigma,
  'Adobe XD': FaPalette,
  Sketch: SiSketch,
  InVision: SiInvision,
  'Adobe Creative': FaPalette,
};

const TechStack: React.FC = () => {
  const { theme } = useTheme();
  const themed = theme === 'dark' ? dark : light;
  const cx = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');

  return (
    <section className={cx(common.techStackSection, themed.techStackSection)}>
      <div className={common.container}>
        <motion.header
          className={common.header}
          variants={fadeIn('up', 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <span className={cx(common.eyebrow, themed.eyebrow)}>Technology stack</span>
          <h2 className={cx(common.heading, themed.heading)}>
            Built with tools that support real product outcomes.
          </h2>
          <p className={cx(common.subheading, themed.subheading)}>
            Megicode picks technology by business need: speed to launch, reliability, automation,
            analytics, and interfaces your team can actually operate.
          </p>
        </motion.header>
        <div className={common.categoriesGrid}>
          {Object.entries(techCategories).map(([category, config], index) => {
            const CategoryIcon = config.Icon;
            return (
              <motion.div
                key={category}
                className={cx(common.categoryCard, themed.categoryCard)}
                variants={fadeIn('up', 0.2 * (index + 2))}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
              >
                <span className={cx(common.cardGlow, themed.cardGlow)} aria-hidden="true" />
                <div className={common.categoryTop}>
                  <span className={cx(common.categoryIcon, themed.categoryIcon)}>
                    <CategoryIcon size={20} aria-hidden="true" />
                  </span>
                  <span className={cx(common.techCount, themed.techCount)}>
                    {config.techs.length} tools
                  </span>
                </div>
                <h3 className={cx(common.categoryTitle, themed.categoryTitle)}>{category}</h3>
                <p className={cx(common.categoryOutcome, themed.categoryOutcome)}>
                  {config.outcome}
                </p>
                <span className={cx(common.categoryProof, themed.categoryProof)}>
                  {config.proof}
                </span>
                <div className={common.techGrid}>
                  {config.techs.map((tech) => {
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
