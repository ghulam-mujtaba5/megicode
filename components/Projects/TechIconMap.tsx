import React from 'react';
import { IconType } from 'react-icons';
import { FaFigma, FaPalette } from 'react-icons/fa';
import {
  SiDocker,
  SiFirebase,
  SiFramer,
  SiGithub,
  SiJira,
  SiJupyter,
  SiMaterialdesign,
  SiMiro,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPandas,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedux,
  SiScikitlearn,
  SiSlack,
  SiSqlite,
  SiStreamlit,
  SiSupabase,
  SiTailwindcss,
  SiTensorflow,
  SiTypescript,
  SiVercel,
} from 'react-icons/si';

import Image from 'next/image';

// Define types for the icon mapping
interface ReactIconInfo {
  type: 'react-icon';
  component: IconType;
  color: string;
}

interface SvgIconInfo {
  type: 'svg';
  src: string;
}

type TechIconInfo = ReactIconInfo | SvgIconInfo;

// Map tech/tool names to icon metadata
const techIconMap: Record<string, TechIconInfo> = {
  Figma: { type: 'react-icon', component: FaFigma, color: '#a259ff' },
  'Adobe XD': { type: 'react-icon', component: FaPalette, color: '#ff61f6' },
  'React Native': { type: 'react-icon', component: SiReact, color: '#61dafb' },
  'React Native CLI': { type: 'react-icon', component: SiReact, color: '#61dafb' },
  React: { type: 'react-icon', component: SiReact, color: '#61dafb' },
  'Material Design': { type: 'react-icon', component: SiMaterialdesign, color: '#757575' },
  Jira: { type: 'react-icon', component: SiJira, color: '#0052cc' },
  Amplitude: { type: 'svg', src: '/icons/amplitude.svg' },
  Redux: { type: 'react-icon', component: SiRedux, color: '#764abc' },
  Firebase: { type: 'react-icon', component: SiFirebase, color: '#ffca28' },
  Supabase: { type: 'react-icon', component: SiSupabase, color: '#3ecf8e' },
  'Node.js': { type: 'react-icon', component: SiNodedotjs, color: '#3c873a' },
  Python: { type: 'react-icon', component: SiPython, color: '#3776ab' },
  pandas: { type: 'react-icon', component: SiPandas, color: '#150458' },
  'scikit-learn': { type: 'react-icon', component: SiScikitlearn, color: '#f7931e' },
  Jupyter: { type: 'react-icon', component: SiJupyter, color: '#f37626' },
  Docker: { type: 'react-icon', component: SiDocker, color: '#2496ed' },
  Miro: { type: 'react-icon', component: SiMiro, color: '#ffd02f' },
  Slack: { type: 'react-icon', component: SiSlack, color: '#611f69' },
  GitHub: { type: 'react-icon', component: SiGithub, color: '#181717' },
  Git: { type: 'react-icon', component: SiGithub, color: '#181717' },
  Maven: { type: 'svg', src: '/icons/maven.svg' },
  PostgreSQL: { type: 'react-icon', component: SiPostgresql, color: '#336791' },
  'TensorFlow.js': { type: 'react-icon', component: SiTensorflow, color: '#ff6f00' },
  TensorFlow: { type: 'react-icon', component: SiTensorflow, color: '#ff6f00' },
  Seaborn: { type: 'svg', src: '/icons/seaborn.svg' },
  Streamlit: { type: 'react-icon', component: SiStreamlit, color: '#ff4b4b' },
  Airflow: { type: 'svg', src: '/icons/airflow.svg' },
  'Next.js': { type: 'react-icon', component: SiNextdotjs, color: '#000000' },
  MongoDB: { type: 'react-icon', component: SiMongodb, color: '#47a248' },
  TypeScript: { type: 'react-icon', component: SiTypescript, color: '#3178c6' },
  'Tailwind CSS': { type: 'react-icon', component: SiTailwindcss, color: '#06b6d4' },
  Vercel: { type: 'react-icon', component: SiVercel, color: '#000000' },
  LibSQL: { type: 'react-icon', component: SiSqlite, color: '#0f80c1' },
  'Framer Motion': { type: 'react-icon', component: SiFramer, color: '#0055ff' },
  // Add more mappings as needed
};

export function TechIcon({ name, size = 28 }: { name: string; size?: number }) {
  const iconInfo = techIconMap[name];

  if (iconInfo) {
    if (iconInfo.type === 'react-icon') {
      const IconComponent = iconInfo.component;
      return (
        <IconComponent
          size={size}
          color={iconInfo.color}
          style={{ verticalAlign: 'middle', marginRight: 6 }}
        />
      );
    } else if (iconInfo.type === 'svg') {
      return (
        <Image
          src={iconInfo.src}
          alt={`${name} icon`}
          width={size}
          height={size}
          style={{ verticalAlign: 'middle', marginRight: 6 }}
        />
      );
    }
  }

  // Fallback for icons not in the map
  const fileName = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.svg';
  return (
    <Image
      src={`/icons/${fileName}`}
      alt={`${name} icon`}
      width={size}
      height={size}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  );
}

export default techIconMap;
