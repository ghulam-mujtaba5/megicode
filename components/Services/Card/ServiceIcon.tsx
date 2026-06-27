'use client';

import React from 'react';

import Image from 'next/image';

import { motion, useReducedMotion } from 'framer-motion';

import { useTheme } from '../../../context/ThemeContext';
import styles from './ServiceIcon.module.css';

interface IconMeta {
  src: string;
  darkSrc?: string;
  accent: string;
}

const SVG_MAP: Record<string, IconMeta> = {
  'ai-machine-learning': { src: '/Ai%20icon.svg', accent: '#4573df' },
  'data-analytics-bi': { src: '/Big%20Data%20Analytics.svg', accent: '#8b5cf6' },
  'custom-web-development': { src: '/web%20app%20icon.svg', accent: '#2563eb' },
  'mobile-app-solutions': {
    src: '/mobile%20app%20icon.svg',
    darkSrc: '/Mobile%20App%20Dark.svg',
    accent: '#06b6d4',
  },
  'cloud-devops-services': { src: '/devlopment-icon.svg', accent: '#0ea5e9' },
  'automation-integration': { src: '/ds%26ai-icon.svg', accent: '#f59e0b' },
  'ui-ux-product-design': { src: '/Ui%26Ux-icon.svg', accent: '#ec4899' },
  'it-consulting-support': { src: '/it-consulting-support-icon.svg', accent: '#10b981' },
  'growth-marketing-seo': { src: '/data%20visualization%20icon.svg', accent: '#f97316' },
};

const FALLBACK: IconMeta = { src: '/Ai%20icon.svg', accent: '#4573df' };

interface ServiceIconProps {
  slug?: string;
  index?: number;
}

const ServiceIcon: React.FC<ServiceIconProps> = ({ slug, index = 0 }) => {
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const isDark = theme === 'dark';

  const { src, darkSrc, accent } = (slug && SVG_MAP[slug]) || FALLBACK;
  const imgSrc = isDark && darkSrc ? darkSrc : src;

  const wrapStyle: React.CSSProperties = {
    background: isDark
      ? `linear-gradient(135deg, ${accent}2e 0%, ${accent}12 100%)`
      : `linear-gradient(135deg, ${accent}1f 0%, ${accent}0d 100%)`,
    borderColor: isDark ? `${accent}4d` : `${accent}33`,
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
        <Image
          src={imgSrc}
          alt=""
          width={32}
          height={32}
          unoptimized
          style={{
            display: 'block',
            filter: isDark && !darkSrc ? 'brightness(1.2)' : undefined,
          }}
        />
      </motion.span>
    </motion.span>
  );
};

export default ServiceIcon;
