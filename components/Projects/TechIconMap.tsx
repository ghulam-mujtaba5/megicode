import React from 'react';
import Image from 'next/image';
import { FaFigma } from 'react-icons/fa';
import { SiAdobexd, SiReact, SiMaterialdesign, SiJira, SiRedux, SiFirebase, SiSupabase, SiNodedotjs, SiPython, SiPandas, SiScikitlearn, SiJupyter, SiDocker, SiMiro, SiSlack, SiGithub, SiPostgresql, SiTensorflow, SiStreamlit } from 'react-icons/si';
// Note: Amplitude, Maven, Seaborn, Airflow icons are not available in react-icons/si. Will use SVG fallback or generic icon.

// Map tech/tool names to icon components or SVG/image paths
const techIconMap: Record<string, React.ReactNode> = {
  'Figma': <FaFigma color="#a259ff" />,
  'Adobe XD': <SiAdobexd color="#ff61f6" />,
  'React Native': <SiReact color="#61dafb" />,
  'React Native CLI': <SiReact color="#61dafb" />,
  'React': <SiReact color="#61dafb" />,
  'Material Design': <SiMaterialdesign color="#757575" />,
  'Jira': <SiJira color="#0052cc" />,
  'Amplitude': <Image src="/icons/amplitude.svg" alt="Amplitude icon" width={28} height={28} style={{verticalAlign:'middle',marginRight:6}} />,
  'Redux': <SiRedux color="#764abc" />,
  'Firebase': <SiFirebase color="#ffca28" />,
  'Supabase': <SiSupabase color="#3ecf8e" />,
  'Node.js': <SiNodedotjs color="#3c873a" />,
  'Python': <SiPython color="#3776ab" />,
  'pandas': <SiPandas color="#150458" />,
  'scikit-learn': <SiScikitlearn color="#f7931e" />,
  'Jupyter': <SiJupyter color="#f37626" />,
  'Docker': <SiDocker color="#2496ed" />,
  'Miro': <SiMiro color="#ffd02f" />,
  'Slack': <SiSlack color="#611f69" />,
  'GitHub': <SiGithub color="#181717" />,
  'Git': <SiGithub color="#181717" />,
  'Maven': <Image src="/icons/maven.svg" alt="Maven icon" width={28} height={28} style={{verticalAlign:'middle',marginRight:6}} />,
  'PostgreSQL': <SiPostgresql color="#336791" />,
  'TensorFlow.js': <SiTensorflow color="#ff6f00" />,
  'TensorFlow': <SiTensorflow color="#ff6f00" />,
  'Seaborn': <Image src="/icons/seaborn.svg" alt="Seaborn icon" width={28} height={28} style={{verticalAlign:'middle',marginRight:6}} />,
  'Streamlit': <SiStreamlit color="#ff4b4b" />,
  'Airflow': <Image src="/icons/airflow.svg" alt="Airflow icon" width={28} height={28} style={{verticalAlign:'middle',marginRight:6}} />,
  // Add more mappings as needed
};

export function TechIcon({ name, size = 28 }: { name: string, size?: number }) {
  const icon = techIconMap[name];
  if (icon) {
    // Clone to set size
    return React.cloneElement(icon as React.ReactElement, { size });
  }
  // fallback: try to load from public/icons/{name}.svg
  const fileName = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.svg';
  return (
    <Image
      src={`/icons/${fileName}`}
      alt={name + ' icon'}
      width={size}
      height={size}
      style={{ verticalAlign: 'middle', marginRight: 6 }}
      onError={(e: any) => { e.target.style.display = 'none'; }}
    />
  );
}

export default techIconMap;
