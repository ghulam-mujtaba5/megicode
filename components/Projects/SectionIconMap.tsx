import React from 'react';
import { FaPuzzlePiece, FaLightbulb, FaChartLine, FaCogs, FaTasks, FaTools, FaFileAlt, FaGraduationCap, FaArrowRight, FaRocket, FaUsers, FaQuoteLeft, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

const sectionIconMap: Record<string, React.ReactNode> = {
  'Problem': <FaPuzzlePiece color="#1e90ff" />,
  'Challenge': <FaLightbulb color="#f6c700" />,
  'Solution': <FaLightbulb color="#1e90ff" />,
  'Impact': <FaChartLine color="#22c55e" />,
  'Implementation': <FaCogs color="#6366f1" />,
  'Process': <FaTasks color="#6366f1" />,
  'Tools Used': <FaTools color="#1e90ff" />,
  'Artifacts': <FaFileAlt color="#6366f1" />,
  'Lessons Learned': <FaGraduationCap color="#f6c700" />,
  'Next Steps': <FaArrowRight color="#6366f1" />,
  'Tech Stack': <FaRocket color="#6366f1" />,
  'Testimonial': <FaQuoteLeft color="#f6c700" />,
  'Process Step': <FaCheckCircle color="#22c55e" />,
  'Timeline': <FaCalendarAlt color="#1e90ff" />,
  // Add more as needed
};

export function SectionIcon({ name, size = 22 }: { name: string, size?: number }) {
  const icon = sectionIconMap[name];
  if (icon) {
    return React.cloneElement(icon as React.ReactElement, { size });
  }
  return null;
}

export default sectionIconMap;
