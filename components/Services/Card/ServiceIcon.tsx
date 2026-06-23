'use client';

import React from 'react';
import type { IconType } from 'react-icons';
import {
  HiArrowTrendingUp,
  HiBolt,
  HiCloud,
  HiComputerDesktop,
  HiCpuChip,
  HiDevicePhoneMobile,
  HiPaintBrush,
  HiRocketLaunch,
  HiSparkles,
  HiSquares2X2,
} from 'react-icons/hi2';

import { motion, useReducedMotion } from 'framer-motion';

import { useTheme } from '../../../context/ThemeContext';
import styles from './ServiceIcon.module.css';

interface IconMeta {
  Icon: IconType;
  accent: string;
}

// Maps each service slug to a purpose-matched Heroicon + brand-cohesive accent.
const ICON_MAP: Record<string, IconMeta> = {
  'ai-machine-learning': { Icon: HiSparkles, accent: '#4573df' },
  'data-analytics-bi': { Icon: HiCpuChip, accent: '#8b5cf6' },
  'custom-web-development': { Icon: HiComputerDesktop, accent: '#2563eb' },
  'mobile-app-solutions': { Icon: HiDevicePhoneMobile, accent: '#06b6d4' },
  'cloud-devops-services': { Icon: HiCloud, accent: '#0ea5e9' },
  'automation-integration': { Icon: HiBolt, accent: '#f59e0b' },
  'ui-ux-product-design': { Icon: HiPaintBrush, accent: '#ec4899' },
  'it-consulting-support': { Icon: HiRocketLaunch, accent: '#10b981' },
  'growth-marketing-seo': { Icon: HiArrowTrendingUp, accent: '#f97316' },
};

const FALLBACK: IconMeta = { Icon: HiSquares2X2, accent: '#4573df' };

interface ServiceIconProps {
  slug?: string;
  /** Index used to stagger the idle float so icons don't pulse in unison. */
  index?: number;
}

const ServiceIcon: React.FC<ServiceIconProps> = ({ slug, index = 0 }) => {
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const isDark = theme === 'dark';

  const { Icon, accent } = (slug && ICON_MAP[slug]) || FALLBACK;

  // Theme-adaptive tinting derived from the accent colour.
  const wrapStyle: React.CSSProperties = {
    background: isDark
      ? `linear-gradient(135deg, ${accent}2e 0%, ${accent}12 100%)`
      : `linear-gradient(135deg, ${accent}1f 0%, ${accent}0d 100%)`,
    borderColor: isDark ? `${accent}4d` : `${accent}33`,
    color: accent,
  };

  const idle = reduce
    ? undefined
    : {
        y: [0, -3.5, 0],
        transition: {
          duration: 3.6,
          repeat: Infinity,
          ease: 'easeInOut' as const,
          delay: (index % 5) * 0.4,
        },
      };

  return (
    <motion.span
      className={styles.iconWrap}
      style={wrapStyle}
      aria-hidden="true"
      initial={reduce ? false : { scale: 0.6, opacity: 0, rotate: -12 }}
      whileInView={reduce ? undefined : { scale: 1, opacity: 1, rotate: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: index * 0.05 }}
      whileHover={
        reduce
          ? undefined
          : { scale: 1.12, rotate: [0, -8, 8, -4, 0], transition: { duration: 0.5 } }
      }
    >
      <span className={styles.glow} style={{ background: accent }} aria-hidden="true" />
      <motion.span className={styles.iconInner} animate={idle}>
        <Icon size={26} />
      </motion.span>
    </motion.span>
  );
};

export default ServiceIcon;
export { ICON_MAP };
