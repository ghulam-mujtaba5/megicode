import { FaExclamationCircle, FaLightbulb, FaChartLine, FaCogs, FaTools, FaRoute, FaBookOpen, FaArrowUp, FaRegFileAlt, FaRocket, FaCheckCircle, FaUserTie, FaQuoteLeft, FaListAlt } from 'react-icons/fa';

export const sectionIconMap: Record<string, JSX.Element> = {
  Problem: <FaExclamationCircle color="#e57373" />,
  Challenge: <FaLightbulb color="#fbc02d" />,
  Solution: <FaCogs color="#64b5f6" />,
  Impact: <FaChartLine color="#43a047" />,
  Implementation: <FaTools color="#7e57c2" />,
  Process: <FaRoute color="#29b6f6" />,
  Tools: <FaTools color="#ffa726" />,
  Artifacts: <FaRegFileAlt color="#90a4ae" />,
  Lessons: <FaBookOpen color="#ffb300" />,
  NextSteps: <FaRocket color="#00bcd4" />,
  Metrics: <FaArrowUp color="#43a047" />,
  Testimonial: <FaQuoteLeft color="#ab47bc" />,
  TechStack: <FaListAlt color="#1976d2" />,
};
