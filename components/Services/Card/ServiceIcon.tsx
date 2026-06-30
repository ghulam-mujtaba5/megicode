'use client';

import React from 'react';

import Image from 'next/image';

import { motion, useReducedMotion } from 'framer-motion';

import { useTheme } from '../../../context/ThemeContext';
import styles from './ServiceIcon.module.css';

interface IconMeta {
  src: string;
  accent: string;
}

const SVG_MAP: Record<string, IconMeta> = {
  'ai-automation-agents': { src: '/service-icons/ai-automation.png', accent: '#4573df' },
  'ai-saas-mvp-development': { src: '/service-icons/ai-saas-mvp.png', accent: '#4573df' },
  'custom-web-development': { src: '/service-icons/custom-web.png', accent: '#2563eb' },
  'ui-ux-design': { src: '/service-icons/ui-ux.png', accent: '#ec4899' },
  'mobile-app-development': { src: '/service-icons/mobile-app.png', accent: '#06b6d4' },
  'cloud-devops': { src: '/service-icons/cloud-devops.png', accent: '#0ea5e9' },
  'data-analytics': { src: '/service-icons/data-analytics.png', accent: '#8b5cf6' },
  'technical-consulting': { src: '/service-icons/consulting.png', accent: '#10b981' },
  'growth-marketing-seo': { src: '/service-icons/growth-marketing.png', accent: '#f97316' },
};

const FALLBACK: IconMeta = { src: '/service-icons/ai-automation.png', accent: '#4573df' };

interface ServiceIconProps {
  slug?: string;
  index?: number;
}

const ServiceIcon: React.FC<ServiceIconProps> = ({ slug, index = 0 }) => {
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const isDark = theme === 'dark';

  const { src, accent } = (slug && SVG_MAP[slug]) || FALLBACK;

  const wrapStyle: React.CSSProperties = {
    background: isDark
      ? `linear-gradient(135deg, ${accent}22 0%, ${accent}0e 100%)`
      : `linear-gradient(135deg, ${accent}16 0%, ${accent}08 100%)`,
    borderColor: isDark ? `${accent}40` : `${accent}28`,
  };

  const idle = reduce
    ? undefined
    : {
        y: [0, -4, 0],
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
      initial={reduce ? false : { scale: 0.6, opacity: 0, rotate: -8 }}
      whileInView={reduce ? undefined : { scale: 1, opacity: 1, rotate: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: index * 0.05 }}
      whileHover={
        reduce
          ? undefined
          : { scale: 1.1, rotate: [0, -6, 6, -3, 0], transition: { duration: 0.45 } }
      }
    >
      <span className={styles.glow} style={{ background: accent }} aria-hidden="true" />
      <motion.span className={styles.iconInner} animate={idle}>
        <Image src={src} alt="" width={64} height={64} unoptimized style={{ display: 'block' }} />
      </motion.span>
    </motion.span>
  );
};

export default ServiceIcon;
