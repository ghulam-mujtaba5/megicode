'use client';
import React from 'react';
import { FaAws, FaPalette } from 'react-icons/fa';
// Service icons — Heroicons v2 (geometric, purpose-matched, MIT)
import {
  HiArrowRight,
  HiBolt,
  HiChartBarSquare,
  HiCloud,
  HiComputerDesktop,
  HiDevicePhoneMobile,
  HiPaintBrush,
  HiShieldCheck,
  HiSparkles,
} from 'react-icons/hi2';
// Tech brand logos — Simple Icons (real brand marks, same source as TechStack)
import {
  SiApachespark,
  SiDocker,
  SiFigma,
  SiFirebase,
  SiFlutter,
  SiFramer,
  SiGit,
  SiGithub,
  SiKubernetes,
  SiLooker,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPython,
  SiPytorch,
  SiReact,
  SiTensorflow,
  SiTerraform,
  SiTypescript,
  SiZapier,
} from 'react-icons/si';

import Link from 'next/link';

import { motion } from 'framer-motion';

import { useTheme } from '../../context/ThemeContext';
import { type ServiceIllusType, ServiceIllustration } from '../IconSystem/ServiceIllustrations';
import lightStyles from './ServicesFrame.module.css';
import commonStyles from './ServicesFrameCommon.module.css';
import darkStyles from './ServicesFrameDark.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TechItem {
  Icon: React.ComponentType<{ size?: number }>;
  name: string;
  /** Official brand color (exact match to TechStack colorMap where applicable) */
  color: string;
  /** Override for dark mode — only needed for black/near-black logos */
  darkColor?: string;
}

interface ServiceItem {
  id: string;
  /** Pre-resolved CSS Module class string for grid position */
  gridClass: string;
  /** AI card only: full blue gradient treatment */
  featured?: true;
  /** Automation card: wide (2-col) glass card with description */
  isWide?: true;
  /** Custom icon accent color for wide/special cards */
  iconAccent?: string;
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  tagline: string;
  /** Shown only on featured + wide cards */
  description?: string;
  href: string;
  techs: TechItem[];
  /** Illustration type for inline SVG (replaces PNG) */
  illusType: ServiceIllusType;
}

// ─── Services data ────────────────────────────────────────────────────────────
// Colors match the project's TechStack colorMap exactly.
// Black-branded logos (Next.js, GitHub) carry darkColor for dark-mode legibility.

const SERVICES: ServiceItem[] = [
  {
    id: 'ai',
    gridClass: commonStyles.posAI,
    featured: true,
    illusType: 'ai' as ServiceIllusType,
    icon: HiSparkles,
    title: 'AI-Powered Development',
    tagline: 'Ship intelligent features in weeks, not quarters.',
    description:
      'We build LLM-powered products, RAG pipelines, and autonomous AI agents — integrated directly into your stack so your users experience real AI in production, not just a chatbot wrapper.',
    href: '/services/ai-machine-learning',
    techs: [
      { Icon: SiOpenai, name: 'OpenAI', color: '#4A90E2' },
      { Icon: SiPython, name: 'Python', color: '#3776AB' },
      { Icon: SiTensorflow, name: 'TensorFlow', color: '#FF6F00' },
      { Icon: SiPytorch, name: 'PyTorch', color: '#EE4C2C' },
    ],
  },
  {
    id: 'web',
    gridClass: commonStyles.posSaaS,
    illusType: 'web' as ServiceIllusType,
    icon: HiComputerDesktop,
    title: 'SaaS & Web Platforms',
    tagline: 'Full-stack products built to scale from day one.',
    href: '/services',
    techs: [
      { Icon: SiNextdotjs, name: 'Next.js', color: '#000000', darkColor: '#e2e8f0' },
      { Icon: SiReact, name: 'React', color: '#61DAFB' },
      { Icon: SiTypescript, name: 'TypeScript', color: '#3178C6' },
    ],
  },
  {
    id: 'mobile',
    gridClass: commonStyles.posMobile,
    illusType: 'mobile' as ServiceIllusType,
    icon: HiDevicePhoneMobile,
    title: 'Mobile App Solutions',
    tagline: 'Cross-platform apps with native feel and speed.',
    href: '/services',
    techs: [
      { Icon: SiReact, name: 'React Native', color: '#61DAFB' },
      { Icon: SiFlutter, name: 'Flutter', color: '#02569B' },
      { Icon: SiFirebase, name: 'Firebase', color: '#FFCA28' },
    ],
  },
  {
    id: 'uiux',
    gridClass: commonStyles.posUIUX,
    illusType: 'uiux' as ServiceIllusType,
    icon: HiPaintBrush,
    title: 'UI/UX Product Design',
    tagline: 'Interfaces users understand and actually enjoy.',
    href: '/services',
    techs: [
      { Icon: SiFigma, name: 'Figma', color: '#F24E1E' },
      { Icon: FaPalette, name: 'Adobe', color: '#FF0000' },
      { Icon: SiFramer, name: 'Framer', color: '#0055FF' },
    ],
  },
  {
    id: 'cloud',
    gridClass: commonStyles.posCloud,
    illusType: 'cloud' as ServiceIllusType,
    icon: HiCloud,
    title: 'Cloud & DevOps',
    tagline: 'Infrastructure that ships fast and stays up.',
    href: '/services',
    techs: [
      { Icon: FaAws, name: 'AWS', color: '#FF9900' },
      { Icon: SiDocker, name: 'Docker', color: '#2496ED' },
      { Icon: SiKubernetes, name: 'Kubernetes', color: '#326CE5' },
    ],
  },
  {
    id: 'data',
    gridClass: commonStyles.posData,
    illusType: 'data' as ServiceIllusType,
    icon: HiChartBarSquare,
    title: 'Data Analytics & BI',
    tagline: 'Turn raw data into decisions that compound.',
    href: '/services',
    techs: [
      { Icon: SiPython, name: 'Python', color: '#3776AB' },
      { Icon: SiApachespark, name: 'Spark', color: '#E25A1C' },
      { Icon: SiLooker, name: 'Tableau', color: '#E97627' },
    ],
  },
  {
    id: 'automation',
    gridClass: commonStyles.posAuto,
    isWide: true,
    iconAccent: '#ff9800',
    illusType: 'automation' as ServiceIllusType,
    icon: HiBolt,
    title: 'Automation & Integration',
    tagline: 'Connect everything. Eliminate the manual.',
    description:
      'We wire your entire SaaS stack — CRMs, databases, communication tools, internal workflows — so your team focuses on high-leverage work rather than repetitive tasks that machines should own.',
    href: '/services',
    techs: [
      { Icon: SiZapier, name: 'Zapier', color: '#FF4A00' },
      { Icon: SiNodedotjs, name: 'Node.js', color: '#339933' },
      { Icon: SiPython, name: 'Python', color: '#3776AB' },
      { Icon: SiGithub, name: 'GitHub', color: '#181717', darkColor: '#e2e8f0' },
    ],
  },
  {
    id: 'consulting',
    gridClass: commonStyles.posConsult,
    illusType: 'consulting' as ServiceIllusType,
    icon: HiShieldCheck,
    title: 'IT Consulting',
    tagline: 'Strategy that aligns your tech with business growth.',
    href: '/services',
    techs: [
      { Icon: SiGit, name: 'Git', color: '#F05032' },
      { Icon: SiGithub, name: 'GitHub', color: '#181717', darkColor: '#e2e8f0' },
      { Icon: SiTerraform, name: 'Terraform', color: '#7B42BC' },
    ],
  },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.085, delayChildren: 0.04 } },
};

const cardIn = {
  hidden: { opacity: 0, y: 22, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE_OUT } },
};

const headIn = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.58, ease: EASE_OUT } },
};

// ─── Tech logo row ────────────────────────────────────────────────────────────

interface TechRowProps {
  techs: TechItem[];
  isFeatured: boolean;
  theme: string;
}

const TechRow = ({ techs, isFeatured, theme }: TechRowProps) => (
  <div className={commonStyles.techRow}>
    {techs.map(({ Icon, name, color, darkColor }) => {
      // Use real brand color; fall back to darkColor in dark mode for black/near-black logos
      const resolvedColor = theme === 'dark' && darkColor ? darkColor : color;
      // Tinted pill background: brand color at ~10% opacity (hex + '1a')
      // For featured cards (gradient bg): white glass pill regardless of brand color
      const pillStyle = isFeatured
        ? { color: 'rgba(255,255,255,0.92)', background: 'rgba(255,255,255,0.16)' }
        : { color: resolvedColor, background: `${resolvedColor}1a` };

      return (
        <span
          key={name}
          className={commonStyles.techLogo}
          style={pillStyle}
          title={name}
          aria-label={name}
        >
          <Icon size={15} />
        </span>
      );
    })}
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const ServicesFrame = () => {
  const { theme } = useTheme();
  const t = theme === 'dark' ? darkStyles : lightStyles;

  return (
    <section
      className={`${commonStyles.section} ${t.section} bg-dots`}
      aria-labelledby="services-heading"
    >
      {/* Section header */}
      <motion.header
        className={commonStyles.sectionHead}
        variants={headIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <span className={`${commonStyles.eyebrow} ${t.eyebrow}`}>Services</span>

        {/* Connector dots flanking the eyebrow label */}
        <div
          aria-hidden="true"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            margin: '6px 0 0',
          }}
        >
          <div className="connector-dot connector-dot-sm" />
          <div className="connector-h" style={{ width: 40 }} />
          <div className="connector-dot connector-dot-accent connector-dot-sm" />
          <div className="connector-h" style={{ width: 40 }} />
          <div className="connector-dot connector-dot-sm" />
        </div>

        <h2 id="services-heading" className={`${commonStyles.sectionTitle} ${t.sectionTitle}`}>
          Everything you need to{' '}
          <span className={`${commonStyles.titleAccent} ${t.titleAccent}`}>
            build, scale &amp; grow.
          </span>
        </h2>
        <p className={`${commonStyles.sectionSub} ${t.sectionSub}`}>
          End-to-end software solutions — from AI-powered products to cloud infrastructure —
          delivered by a team obsessed with craft and outcomes.
        </p>
      </motion.header>

      {/* Divider node between header and grid */}
      <div
        className="divider-node"
        aria-hidden="true"
        style={{ maxWidth: 320, margin: '0 auto 8px' }}
      >
        <div className="divider-node-dot" />
      </div>

      {/* Bento grid */}
      <motion.div
        className={commonStyles.bentoGrid}
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        role="list"
      >
        {SERVICES.map((service) => {
          const isFeatured = service.featured === true;
          const isWide = service.isWide === true;
          const hasDescription = Boolean(service.description);

          // Card theme class
          const cardTheme = isFeatured ? t.primaryCard : isWide ? t.secondaryCard : t.standardCard;

          // Icon wrapper class + inline style
          const iconWrapCls = isFeatured
            ? commonStyles.iconWrapFeatured
            : `${commonStyles.iconWrapStd} ${t.iconWrapStd}`;

          const iconWrapStyle =
            !isFeatured && service.iconAccent
              ? { background: `${service.iconAccent}18`, color: service.iconAccent }
              : undefined;

          // Card inner: larger padding for featured/wide
          const innerCls = `${commonStyles.cardInner} ${isFeatured || isWide ? commonStyles.cardInnerLarge : ''}`;

          return (
            <motion.article
              key={service.id}
              variants={cardIn}
              className={`${commonStyles.card} ${service.gridClass} ${cardTheme}`}
              role="listitem"
            >
              <Link
                href={service.href}
                className={innerCls}
                aria-label={`Learn more about ${service.title}`}
              >
                {/* Icon row */}
                <div className={commonStyles.iconRow}>
                  <span className={iconWrapCls} style={iconWrapStyle} aria-hidden="true">
                    <service.icon size={isFeatured ? 22 : isWide ? 21 : 19} />
                  </span>
                  {isFeatured && <span className={commonStyles.featuredBadge}>Core Service</span>}
                </div>

                {/* Title block */}
                <div className={commonStyles.titleBlock}>
                  <h3
                    className={
                      isFeatured
                        ? commonStyles.cardTitleFeatured
                        : isWide
                          ? `${commonStyles.cardTitleWide} ${t.cardTitle}`
                          : `${commonStyles.cardTitle} ${t.cardTitle}`
                    }
                  >
                    {service.title}
                  </h3>
                  <p
                    className={
                      isFeatured
                        ? commonStyles.cardTaglineFeatured
                        : `${commonStyles.cardTagline} ${t.cardTagline}`
                    }
                  >
                    {service.tagline}
                  </p>
                </div>

                {/* Description — featured + wide cards only */}
                {hasDescription && (
                  <p
                    className={
                      isFeatured
                        ? commonStyles.cardDescFeatured
                        : `${commonStyles.cardDesc} ${t.cardDesc}`
                    }
                  >
                    {service.description}
                  </p>
                )}

                {/* Tech logos */}
                <TechRow techs={service.techs} isFeatured={isFeatured} theme={theme} />

                {/* CTA — featured + wide cards */}
                {(isFeatured || isWide) && (
                  <span
                    className={
                      isFeatured ? commonStyles.featuredCta : `${commonStyles.wideCta} ${t.wideCta}`
                    }
                  >
                    Explore service <HiArrowRight size={13} aria-hidden="true" />
                  </span>
                )}

                {/* Hover arrow — standard cards only */}
                {!isFeatured && !isWide && (
                  <span className={`${commonStyles.hoverArrow} ${t.hoverArrow}`} aria-hidden="true">
                    <HiArrowRight size={14} />
                  </span>
                )}

                {/* Service illustration — inline SVG, reveals on hover from bottom-right */}
                <span
                  className={`${commonStyles.cardIllus}${isFeatured ? ` ${commonStyles.cardIllusFeatured}` : isWide ? ` ${commonStyles.cardIllusWide}` : ''}`}
                  aria-hidden="true"
                >
                  <ServiceIllustration
                    type={service.illusType}
                    size={isFeatured ? 154 : isWide ? 116 : 92}
                    isDark={theme === 'dark'}
                  />
                </span>
              </Link>
            </motion.article>
          );
        })}
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        className={commonStyles.ctaRow}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.28 }}
      >
        <Link href="/services" className={`${commonStyles.ctaBtn} ${t.ctaBtn}`}>
          View all services
          <HiArrowRight size={15} aria-hidden="true" />
        </Link>
      </motion.div>
    </section>
  );
};

export default ServicesFrame;
