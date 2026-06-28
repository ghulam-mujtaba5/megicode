'use client';
import React from 'react';
import { FaAws, FaPalette } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi2';
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
  SiReact,
  SiTerraform,
  SiTypescript,
  SiZapier,
} from 'react-icons/si';

import Image from 'next/image';
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
  /** Branded SVG icon path (served from /public) */
  svgSrc: string;
  /** Dark-mode variant of the branded SVG (optional) */
  svgSrcDark?: string;
  title: string;
  tagline: string;
  /** Shown only on featured + wide cards */
  description?: string;
  cta: string;
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
    id: 'automation',
    gridClass: commonStyles.posAI,
    featured: true,
    illusType: 'automation' as ServiceIllusType,
    svgSrc: '/ds%26ai-icon.svg',
    title: 'AI Automation & Agents',
    tagline: 'Automate leads, replies, bookings, and repetitive workflows.',
    description:
      'We build AI agents and workflow automation that handle lead capture, customer replies, bookings, reminders, and repetitive operations inside your existing business systems.',
    cta: 'Automate My Leads',
    href: '/services/ai-automation-agents',
    techs: [
      { Icon: SiOpenai, name: 'OpenAI', color: '#4A90E2' },
      { Icon: SiPython, name: 'Python', color: '#3776AB' },
      { Icon: SiZapier, name: 'Zapier', color: '#FF4A00' },
      { Icon: SiNodedotjs, name: 'Node.js', color: '#339933' },
    ],
  },
  {
    id: 'ai-saas',
    gridClass: commonStyles.posSaaS,
    illusType: 'ai' as ServiceIllusType,
    svgSrc: '/Ai%20icon.svg',
    title: 'AI SaaS & MVP Development',
    tagline: 'Turn your AI idea into a launch-ready product.',
    cta: 'Plan My AI MVP',
    href: '/services/ai-saas-mvp-development',
    techs: [
      { Icon: SiNextdotjs, name: 'Next.js', color: '#000000', darkColor: '#e2e8f0' },
      { Icon: SiOpenai, name: 'OpenAI', color: '#4A90E2' },
      { Icon: SiTypescript, name: 'TypeScript', color: '#3178C6' },
    ],
  },
  {
    id: 'web',
    gridClass: commonStyles.posMobile,
    illusType: 'web' as ServiceIllusType,
    svgSrc: '/web%20app%20icon.svg',
    title: 'Custom Web Apps & Business Platforms',
    tagline: 'Build dashboards, portals, CRMs, and booking systems for real operations.',
    cta: 'Build My Platform',
    href: '/services/custom-web-development',
    techs: [
      { Icon: SiNextdotjs, name: 'Next.js', color: '#000000', darkColor: '#e2e8f0' },
      { Icon: SiReact, name: 'React', color: '#61DAFB' },
      { Icon: SiTypescript, name: 'TypeScript', color: '#3178C6' },
    ],
  },
  {
    id: 'uiux',
    gridClass: commonStyles.posUIUX,
    illusType: 'uiux' as ServiceIllusType,
    svgSrc: '/Ui%26Ux-icon.svg',
    title: 'UI/UX Product Design',
    tagline: 'Design interfaces users understand and trust.',
    cta: 'Improve My UX',
    href: '/services/ui-ux-design',
    techs: [
      { Icon: SiFigma, name: 'Figma', color: '#F24E1E' },
      { Icon: FaPalette, name: 'Adobe', color: '#FF0000' },
      { Icon: SiFramer, name: 'Framer', color: '#0055FF' },
    ],
  },
  {
    id: 'mobile',
    gridClass: commonStyles.posCloud,
    illusType: 'mobile' as ServiceIllusType,
    svgSrc: '/mobile%20app%20icon.svg',
    svgSrcDark: '/Mobile%20App%20Dark.svg',
    title: 'Mobile App Solutions',
    tagline: 'Bring your platform to iOS and Android.',
    cta: 'Discuss Mobile App',
    href: '/services/mobile-app-development',
    techs: [
      { Icon: SiReact, name: 'React Native', color: '#61DAFB' },
      { Icon: SiFlutter, name: 'Flutter', color: '#02569B' },
      { Icon: SiFirebase, name: 'Firebase', color: '#FFCA28' },
    ],
  },
  {
    id: 'cloud',
    gridClass: commonStyles.posData,
    illusType: 'cloud' as ServiceIllusType,
    svgSrc: '/devlopment-icon.svg',
    title: 'Cloud & DevOps',
    tagline: 'Launch faster with stable deployment and infrastructure.',
    cta: 'Prepare My Launch',
    href: '/services/cloud-devops',
    techs: [
      { Icon: FaAws, name: 'AWS', color: '#FF9900' },
      { Icon: SiDocker, name: 'Docker', color: '#2496ED' },
      { Icon: SiKubernetes, name: 'Kubernetes', color: '#326CE5' },
    ],
  },
  {
    id: 'data',
    gridClass: commonStyles.posAuto,
    isWide: true,
    illusType: 'data' as ServiceIllusType,
    svgSrc: '/Big%20Data%20Analytics.svg',
    title: 'Data Analytics & BI',
    tagline: 'Turn scattered data into clear decisions.',
    description:
      'We bring scattered business data into dashboards, reports, and decision views your team can trust without digging through disconnected spreadsheets and tools.',
    cta: 'Build My Dashboard',
    href: '/services/data-analytics',
    techs: [
      { Icon: SiPython, name: 'Python', color: '#3776AB' },
      { Icon: SiApachespark, name: 'Spark', color: '#E25A1C' },
      { Icon: SiLooker, name: 'Tableau', color: '#E97627' },
    ],
  },
  {
    id: 'consulting',
    gridClass: commonStyles.posConsult,
    illusType: 'consulting' as ServiceIllusType,
    svgSrc: '/it-consulting-support-icon.svg',
    title: 'Technical Consulting',
    tagline: 'Get the right roadmap before you build.',
    cta: 'Get Roadmap',
    href: '/services/technical-consulting',
    techs: [
      { Icon: SiGit, name: 'Git', color: '#F05032' },
      { Icon: SiGithub, name: 'GitHub', color: '#181717', darkColor: '#e2e8f0' },
      { Icon: SiTerraform, name: 'Terraform', color: '#7B42BC' },
    ],
  },
];

const BUYER_SITUATIONS = [
  {
    number: '01',
    badge: 'Lead automation',
    iconSrc: '/ds%26ai-icon.svg',
    problem: 'I am losing leads or wasting time manually',
    outcome: 'AI agents, instant replies, booking flows, follow-ups, and workflow automation.',
    result: 'Stop late replies and manual handoffs',
    href: '/services/ai-automation-agents',
  },
  {
    number: '02',
    badge: 'AI product build',
    iconSrc: '/Ai%20icon.svg',
    problem: 'I have an AI product or SaaS idea',
    outcome: 'MVP roadmap, product architecture, LLM features, dashboard, and launch support.',
    result: 'Move from idea to a buildable product',
    href: '/services/ai-saas-mvp-development',
  },
  {
    number: '03',
    badge: 'Business platform',
    iconSrc: '/web%20app%20icon.svg',
    problem: 'My business needs a custom portal or dashboard',
    outcome: 'Web apps, CRMs, booking systems, internal tools, client portals, and reports.',
    result: 'Replace scattered tools with one system',
    href: '/services/custom-web-development',
  },
  {
    number: '04',
    badge: 'Roadmap clarity',
    iconSrc: '/it-consulting-support-icon.svg',
    problem: 'I am not sure what to build first',
    outcome:
      'Technical roadmap, stack decision, risk review, and build plan before spending heavily.',
    result: 'Choose the right first move before committing budget',
    href: '/services/technical-consulting',
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
          What do you need help with?{' '}
          <span className={`${commonStyles.titleAccent} ${t.titleAccent}`}>
            Choose by business outcome.
          </span>
        </h2>
        <p className={`${commonStyles.sectionSub} ${t.sectionSub}`}>
          Start from the problem your buyer, team, or founder is feeling today, then move into the
          right Megicode service path.
        </p>
      </motion.header>

      <motion.div
        className={commonStyles.situationGrid}
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        aria-label="Service selection by buyer situation"
      >
        {BUYER_SITUATIONS.map((item, index) => (
          <motion.article
            key={item.problem}
            variants={cardIn}
            className={`${commonStyles.situationCard} ${t.situationCard}`}
            style={{ '--situation-index': index } as React.CSSProperties}
          >
            <Link href={item.href} className={commonStyles.situationLink}>
              <span className={commonStyles.situationTopline}>
                <span className={`${commonStyles.situationIcon} ${t.situationIcon}`}>
                  <Image src={item.iconSrc} alt="" width={32} height={32} unoptimized />
                </span>
                <span className={`${commonStyles.situationNumber} ${t.situationNumber}`}>
                  {item.number}
                </span>
              </span>
              <span className={`${commonStyles.situationBadge} ${t.situationBadge}`}>
                {item.badge}
              </span>
              <span className={commonStyles.situationBody}>
                <h3 className={`${commonStyles.situationTitle} ${t.situationTitle}`}>
                  {item.problem}
                </h3>
                <p className={`${commonStyles.situationOutcome} ${t.situationOutcome}`}>
                  {item.outcome}
                </p>
              </span>
              <span className={`${commonStyles.situationResult} ${t.situationResult}`}>
                {item.result}
              </span>
              <span className={`${commonStyles.situationCta} ${t.situationCta}`}>
                Match this service <HiArrowRight size={14} aria-hidden="true" />
              </span>
            </Link>
          </motion.article>
        ))}
      </motion.div>

      {/* Divider node between header and grid */}
      <div
        className="divider-node"
        aria-hidden="true"
        style={{ maxWidth: 320, margin: '42px auto 8px' }}
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

          // Icon wrapper class
          const iconWrapCls = isFeatured
            ? commonStyles.iconWrapFeatured
            : `${commonStyles.iconWrapStd} ${t.iconWrapStd}`;

          // Resolve theme-aware SVG src
          const iconSrc =
            theme === 'dark' && service.svgSrcDark ? service.svgSrcDark : service.svgSrc;
          const iconSize = isFeatured ? 28 : isWide ? 26 : 24;

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
                  <span className={iconWrapCls} aria-hidden="true">
                    <Image
                      src={iconSrc}
                      alt=""
                      width={iconSize}
                      height={iconSize}
                      unoptimized
                      style={{
                        display: 'block',
                        filter:
                          theme === 'dark' && !service.svgSrcDark ? 'brightness(1.2)' : undefined,
                      }}
                    />
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
                    {service.cta} <HiArrowRight size={13} aria-hidden="true" />
                  </span>
                )}

                {/* Hover arrow — standard cards only */}
                {!isFeatured && !isWide && (
                  <span className={`${commonStyles.hoverArrow} ${t.hoverArrow}`} aria-hidden="true">
                    <span className={commonStyles.hoverArrowText}>{service.cta}</span>
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
