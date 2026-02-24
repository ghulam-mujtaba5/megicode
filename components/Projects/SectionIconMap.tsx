import React from 'react';
import {
  FaPuzzlePiece, FaLightbulb, FaChartLine, FaCogs, FaTasks, FaTools,
  FaFileAlt, FaGraduationCap, FaArrowRight, FaRocket, FaUsers,
  FaQuoteLeft, FaCalendarAlt, FaCheckCircle
} from 'react-icons/fa';
import { IconType } from 'react-icons';

// Define a type for the icon mapping
interface IconInfo {
  component: IconType;
  color: string;
}

const sectionIconMap: Record<string, IconInfo> = {
  'Problem': { component: FaPuzzlePiece, color: "#4573df" },
  'Challenge': { component: FaLightbulb, color: "#f6c700" },
  'Solution': { component: FaLightbulb, color: "#4573df" },
  'Impact': { component: FaChartLine, color: "#22c55e" },
  'Implementation': { component: FaCogs, color: "#6366f1" },
  'Process': { component: FaTasks, color: "#6366f1" },
  'Tools Used': { component: FaTools, color: "#4573df" },
  'Artifacts': { component: FaFileAlt, color: "#6366f1" },
  'Lessons Learned': { component: FaGraduationCap, color: "#f6c700" },
  'Next Steps': { component: FaArrowRight, color: "#6366f1" },
  'Tech Stack': { component: FaRocket, color: "#6366f1" },
  'Testimonial': { component: FaQuoteLeft, color: "#f6c700" },
  'Process Step': { component: FaCheckCircle, color: "#22c55e" },
  'Timeline': { component: FaCalendarAlt, color: "#4573df" },
  // Add more as needed
};

export function SectionIcon({ name, size = 22 }: { name: string; size?: number }) {
  const iconInfo = sectionIconMap[name];
  if (iconInfo) {
    const IconComponent = iconInfo.component;
    return <IconComponent size={size} color={iconInfo.color} />;
  }
  return null;
}

export default sectionIconMap;
