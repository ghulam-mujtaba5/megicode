'use client';
import React from 'react';
import { BsCheckCircleFill } from 'react-icons/bs';
import {
  FaBrain,
  FaEye,
  FaLayerGroup,
  FaLifeRing,
  FaPalette,
  FaPencilRuler,
  FaRegObjectGroup,
  FaRocket,
  FaUserCheck,
  FaUsers,
} from 'react-icons/fa';
// Import additional icons we'll need
import { RiPriceTag3Fill, RiTeamFill, RiTimeFill } from 'react-icons/ri';
import { SiFigma, SiInvision, SiSketch } from 'react-icons/si';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import Breadcrumbs from '@/components/SEO/Breadcrumbs';
import ServiceSchema from '@/components/SEO/ServiceSchema';

import { useCalendlyModal } from '../../../components/CalendlyModal';
import Footer from '../../../components/Footer/Footer';
import GmIcon from '../../../components/Icon/sbicon';
import NewNavBar from '../../../components/NavBar_Desktop_Company/NewNavBar';
import NavBarMobile from '../../../components/NavBar_Mobile/NavBar-mobile';
import { useTheme } from '../../../context/ThemeContext';
import { useInViewAnimation } from '../../../hooks/useInViewAnimation';
import {
  ServiceDecisionGuide,
  ServiceFAQs,
  ServiceProofStrip,
  ServiceUsabilityBlocks,
} from '../ServiceDetailSections';
import servicePageCopy from '../servicePageCopy';
import servicesData from '../servicesData';
import commonStyles from './ui-ux-product-design-common.module.css';
import darkStyles from './ui-ux-product-design-dark.module.css';
import lightStyles from './ui-ux-product-design-light.module.css';
import styles from './ui-ux-product-design.module.css';

const LottiePlayer = dynamic(() => import('../../../components/LottiePlayer/LottiePlayer'), {
  ssr: false,
});

const service = {
  ...servicesData.find((s) => s.slug === 'ui-ux-product-design'),
  techs: ['Figma', 'Adobe XD', 'Sketch', 'InVision'],
};
const serviceCopy = servicePageCopy['ui-ux-product-design'];

const engagementModels = [
  {
    title: 'Fixed Price',
    icon: <RiPriceTag3Fill size={40} />,
    benefits: ['Defined Project Scope', 'Predictable Budget', 'Milestone-Based Billing'],
    color: '#2d4fa2',
    isPopular: false,
  },
  {
    title: 'Dedicated Team',
    icon: <RiTeamFill size={40} />,
    benefits: ['Scalable Team Extension', 'Direct Expert Access', 'Seamless Integration'],
    color: '#4573df',
    isPopular: true,
  },
  {
    title: 'Time & Material',
    icon: <RiTimeFill size={40} />,
    benefits: ['Flexible Scope', 'Agile Development', 'Pay-as-you-go'],
    color: '#ff9800',
    isPopular: false,
  },
];

const processSteps = [
  {
    title: 'Research & Discovery',
    desc: 'User & business research.',
    icon: <FaUsers color="#4573df" size={36} title="Research & Discovery" />,
  },
  {
    title: 'Wireframing & Prototyping',
    desc: 'Flows & prototypes.',
    icon: <FaPencilRuler color="#4573df" size={36} title="Wireframing & Prototyping" />,
  },
  {
    title: 'UI/UX Design',
    desc: 'Visual & UX design.',
    icon: <FaPalette color="#4573df" size={36} title="UI/UX Design" />,
  },
  {
    title: 'Usability Testing',
    desc: 'Test & iterate.',
    icon: <FaUserCheck color="#4573df" size={36} title="Usability Testing" />,
  },
  {
    title: 'Handoff & Support',
    desc: 'Dev handoff & support.',
    icon: <FaLifeRing color="#4573df" size={36} title="Handoff & Support" />,
  },
];

const faqs = [
  {
    q: 'Do you provide design systems?',
    a: 'Yes, we create scalable design systems for consistency and efficiency.',
  },
  {
    q: 'Can you work with our branding?',
    a: 'Absolutely. We align all designs with your brand guidelines.',
  },
  {
    q: 'What tools do you use?',
    a: 'Figma, Adobe XD, Sketch, InVision, and other modern design tools.',
  },
  { q: 'Do you test with real users?', a: 'Yes, usability testing is a core part of our process.' },
];

// Features/deliverables with icons
const features = [
  {
    icon: <FaRegObjectGroup color="#4573df" size={36} title="Design Systems" />,
    label: 'Design Systems',
  },
  { icon: <FaPalette color="#4573df" size={36} title="Brand Identity" />, label: 'Brand Identity' },
  {
    icon: <FaPencilRuler color="#4573df" size={36} title="Wireframes & Prototypes" />,
    label: 'Wireframes & Prototypes',
  },
  { icon: <FaUserCheck color="#4573df" size={36} title="User Testing" />, label: 'User Testing' },
  {
    icon: <FaLifeRing color="#4573df" size={36} title="Ongoing Support" />,
    label: 'Ongoing Support',
  },
];

// Design psychology insights - each backed by named cognitive/behavioral research
const psychInsights = [
  {
    Icon: FaBrain,
    color: '#4573df',
    title: 'Cognitive Load Reduction',
    desc: "Miller's Law: working memory holds 7 plus or minus 2 chunks at once. We chunk information, simplify navigation, and progressively disclose complexity so users never feel overwhelmed.",
  },
  {
    Icon: FaEye,
    color: '#2d4fa2',
    title: 'Visual Hierarchy & F-Pattern',
    desc: 'Eye-tracking research shows users scan in F or Z patterns. We place key headlines, CTAs, and value props exactly where natural gaze lands - before conscious thought kicks in.',
  },
  {
    Icon: FaPalette,
    color: '#ff9800',
    title: 'Color Psychology',
    desc: 'Blue communicates trust. Orange triggers urgency. Green signals permission. We map your brand palette to emotional outcomes, not just aesthetics - so every color earns its place.',
  },
  {
    Icon: FaRocket,
    color: '#4573df',
    title: "Fitts's Law",
    desc: 'The time to reach a target shrinks with size and proximity. We design touch targets and CTAs sized and positioned for effortless accuracy, especially on mobile screens.',
  },
  {
    Icon: FaLayerGroup,
    color: '#2d4fa2',
    title: 'Gestalt Principles',
    desc: 'Proximity, similarity, and continuity create groupings users understand without instruction. We structure every layout so the logic is self-evident - no labels needed.',
  },
  {
    Icon: FaRegObjectGroup,
    color: '#4573df',
    title: "Hick's Law",
    desc: 'Every added option doubles decision time. We audit every screen to eliminate unnecessary choices, converging users toward a single confident action at each step.',
  },
];

export default function UIUXProductDesignDetailPage() {
  const { theme } = useTheme();
  const themeStyles = React.useMemo(() => (theme === 'dark' ? darkStyles : lightStyles), [theme]);
  useInViewAnimation();
  const [openCalendly, calendlyModal] = useCalendlyModal();
  if (!service) return null;

  return (
    <div className={`${commonStyles.aiMLBoxSizingAll} ${themeStyles.main}`}>
      {/* NavBars */}
      <div className={styles.desktopNavbarWrapper}>
        <NewNavBar />
      </div>
      <div className={styles.mobileNavbarWrapper}>
        <NavBarMobile />
      </div>
      <GmIcon />

      <main
        id="main-content"
        className={commonStyles.mainContent}
        aria-label="UI/UX Product Design Service Detail"
      >
        {/* Soft background shapes for extra depth */}
        <div className={commonStyles.bgShapeLeft} aria-hidden="true" />
        <div className={commonStyles.bgShapeRight} aria-hidden="true" />

        {/* Breadcrumbs for Navigation & SEO */}
        <Breadcrumbs theme={theme as 'light' | 'dark'} />

        {/* Hero Section - Full-width gradient, Lottie/SVG, CTA */}
        <section
          className={`${commonStyles.heroSection} ${themeStyles.heroSection} service-hero-gradient`}
          data-animate="fade-in"
          aria-labelledby="hero-title"
        >
          <div
            className={`${commonStyles.heroOverlay} ${themeStyles.heroOverlay}`}
            aria-hidden="true"
          />
          <div
            className={`${commonStyles.heroBlurCircle} ${themeStyles.heroBlurCircle}`}
            aria-hidden="true"
          />
          <div className={commonStyles.heroContent}>
            <div className={commonStyles.heroTextBlock}>
              <h1 id="hero-title" className={`${commonStyles.heroTitle} ${themeStyles.heroTitle}`}>
                <span className={commonStyles.gradientText}>{serviceCopy.mainSalesPitch}</span>
              </h1>
              <p
                className={`${commonStyles.heroDesc} ${themeStyles.heroDesc}`}
                data-animate="typewriter"
              >
                {serviceCopy.supportingLine}
              </p>
              <div className={commonStyles.heroCTAWrapper}>
                <button
                  type="button"
                  className={commonStyles.ctaBtn}
                  data-animate="cta-bounce"
                  aria-label="Improve My UX"
                  onClick={openCalendly}
                >
                  {serviceCopy.primaryCta}
                  <span className={commonStyles.ctaBtnArrow} aria-hidden="true">
                    →
                  </span>
                </button>
              </div>
            </div>
            <div className={commonStyles.heroImageBlock} aria-hidden="true">
              <div className={commonStyles.heroImageCard} data-animate="float">
                {/* AI Brain Lottie - design intelligence, creative thinking, smart UX */}
                <LottiePlayer
                  src="/lottie/14_uiux_web_design.json"
                  loop
                  style={{ width: '100%', height: '100%', minWidth: '180px', minHeight: '180px' }}
                  ariaLabel="Animated design illustration for UI UX product design services"
                />
                <div className={commonStyles.heroImageDot} />
                <div className={commonStyles.heroImageSparkles}>
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={commonStyles.sparkle}
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <ServiceProofStrip proof={serviceCopy.proofMicroLine} theme={theme} />

        {/* Service Overview - Side-by-side layout */}
        {/* Section divider */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <section
          className={`${commonStyles.overviewSection} ${themeStyles.overviewSection}`}
          data-animate="slide-left"
        >
          <div className={commonStyles.overviewTextBlock}>
            <h2 className={`${commonStyles.overviewTitle} ${themeStyles.overviewTitle}`}>
              Overview
            </h2>
            <p className={`${commonStyles.overviewDesc} ${themeStyles.overviewDesc}`}>
              We combine user research, data-driven personas, and iterative prototyping to craft
              interfaces that delight users and drive conversions. Our design systems ensure brand
              consistency across platforms while usability testing validates every decision before
              development begins.
            </p>
          </div>
          <div className={commonStyles.overviewImageBlock}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/icon-wireframe-ui.png"
              alt="UI/UX wireframe design"
              className={`${commonStyles.overviewImage} ${themeStyles.overviewImage}`}
              data-animate="fade-in"
              style={{
                width: 200,
                height: 200,
                objectFit: 'contain',
                filter: 'drop-shadow(0 16px 40px rgba(69,115,223,0.22))',
              }}
            />
          </div>
        </section>

        <ServiceUsabilityBlocks copy={serviceCopy} theme={theme} />

        {/* Design Psychology & UX Insights */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <section
          aria-labelledby="psych-title"
          data-animate="slide-left"
          style={{
            padding: '3.5rem 6%',
            display: 'flex',
            gap: '4rem',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          {/* Left: insights grid */}
          <div style={{ flex: '1 1 420px', minWidth: 0 }}>
            <h2
              id="psych-title"
              className={`${commonStyles.overviewTitle} ${themeStyles.overviewTitle}`}
              style={{ marginBottom: '0.5rem' }}
            >
              Design Psychology &amp; UX Principles
            </h2>
            <p
              className={`${commonStyles.overviewDesc} ${themeStyles.overviewDesc}`}
              style={{ marginBottom: '2rem', opacity: 0.85 }}
            >
              Every interface decision we make is grounded in cognitive science and behavioral
              research - not just aesthetics. This is what separates products people love from ones
              they abandon.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem',
              }}
            >
              {psychInsights.map((ins, i) => (
                <div
                  key={i}
                  className={`${commonStyles.featureCard} ${themeStyles.featureCard}`}
                  style={{
                    padding: '1.25rem 1.25rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      marginBottom: '0.15rem',
                    }}
                  >
                    <span
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: `${ins.color}18`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: `0 2px 8px ${ins.color}22`,
                      }}
                    >
                      <ins.Icon size={17} color={ins.color} />
                    </span>
                    <strong style={{ fontSize: '0.875rem', fontWeight: 700, lineHeight: 1.3 }}>
                      {ins.title}
                    </strong>
                  </div>
                  <p
                    style={{
                      fontSize: '0.8125rem',
                      lineHeight: 1.6,
                      margin: 0,
                      opacity: 0.78,
                      fontWeight: 400,
                    }}
                  >
                    {ins.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: floating clay illustration */}
          <div
            style={{
              flex: '0 0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              paddingTop: '2rem',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/icon-analytics-dashboard.png"
              alt="Analytics dashboard illustration"
              width={240}
              height={240}
              loading="lazy"
              style={{
                objectFit: 'contain',
                filter: 'drop-shadow(0 20px 48px rgba(69,115,223,0.26))',
                animation: 'float 5s ease-in-out infinite',
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/icon-lightbulb.png"
              alt="Innovation and ideas"
              width={120}
              height={120}
              loading="lazy"
              style={{
                objectFit: 'contain',
                filter: 'drop-shadow(0 10px 24px rgba(255,152,0,0.22))',
                animation: 'float 4.5s ease-in-out infinite',
                animationDelay: '1.2s',
              }}
            />
          </div>
        </section>

        {/* Why It Matters - Animated counters, impact */}
        {/* Section divider */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <section
          className={`${commonStyles.whySection} ${themeStyles.whySection}`}
          data-animate="fade-in"
        >
          <h2 className={`${commonStyles.whyTitle} ${themeStyles.whyTitle}`}>Why This Matters</h2>
          <div className={commonStyles.whyStatsRow}>
            <div className={`${commonStyles.whyStatCard} ${themeStyles.whyStatCard}`}>
              <span data-animate="countup" data-value="94">
                94%
              </span>
              <div className={`${commonStyles.whyStatDesc} ${themeStyles.whyStatDesc}`}>
                of first impressions are design-related (ResearchGate)
              </div>
            </div>
            <div className={`${commonStyles.whyStatCard} ${themeStyles.whyStatCard}`}>
              <span data-animate="countup" data-value="32">
                32%
              </span>
              <div className={`${commonStyles.whyStatDesc} ${themeStyles.whyStatDesc}`}>
                higher revenue for companies investing in design (McKinsey)
              </div>
            </div>
            <div className={`${commonStyles.whyStatCard} ${themeStyles.whyStatCard}`}>
              <span data-animate="countup" data-value="88">
                88%
              </span>
              <div className={`${commonStyles.whyStatDesc} ${themeStyles.whyStatDesc}`}>
                of users won{"'"}t return after a bad UX experience (Sweor)
              </div>
            </div>
            <div className={`${commonStyles.whyStatCard} ${themeStyles.whyStatCard}`}>
              <span data-animate="countup" data-value="400">
                400%
              </span>
              <div className={`${commonStyles.whyStatDesc} ${themeStyles.whyStatDesc}`}>
                ROI possible from UX investment - Forrester Research
              </div>
            </div>
          </div>
          {/* Supporting illustration */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/icon-target-goal.png"
              alt="Target goal - user-centered design"
              width={140}
              height={140}
              loading="lazy"
              style={{
                objectFit: 'contain',
                filter: 'drop-shadow(0 12px 32px rgba(69,115,223,0.24))',
                opacity: 0.9,
              }}
            />
          </div>
        </section>

        {/* Process Stepper - Timeline ready for animation */}
        {/* Section divider */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <section
          className={`${commonStyles.processSection} ${themeStyles.processSection}`}
          data-animate="timeline"
        >
          <h2 className={`${commonStyles.processTitle} ${themeStyles.processTitle}`}>
            Our Process
          </h2>
          <div className={commonStyles.processStepsRow}>
            {processSteps.map((step, idx) => (
              <div key={idx} className={commonStyles.processStepCard}>
                <div className={`${commonStyles.processStepIcon} ${themeStyles.processStepIcon}`}>
                  {step.icon}
                </div>
                <div className={`${commonStyles.processStepTitle} ${themeStyles.processStepTitle}`}>
                  {step.title}
                </div>
                <div className={`${commonStyles.processStepDesc} ${themeStyles.processStepDesc}`}>
                  {step.desc}
                </div>
                {idx < processSteps.length - 1 && (
                  <div
                    className={`${commonStyles.processStepConnector} ${themeStyles.processStepConnector}`}
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Features as Cards - Deliverables Grid */}
        {/* Section divider */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <section
          className={`${commonStyles.featuresSection} ${themeStyles.featuresSection}`}
          data-animate="stagger-fade"
        >
          <h2 className={`${commonStyles.featuresTitle} ${themeStyles.featuresTitle}`}>
            What We Build
          </h2>
          <div className={commonStyles.featuresRow}>
            {features.map((f, i) => (
              <div
                key={i}
                className={`${commonStyles.featureCard} ${themeStyles.featureCard}`}
                data-animate="fade-in"
              >
                {f.icon}
                {f.label}
              </div>
            ))}
          </div>
        </section>

        {/* Technologies as Logo Cloud */}
        {/* Section divider */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <section
          className={`${commonStyles.techSection} ${themeStyles.techSection}`}
          data-animate="logo-cloud"
        >
          <h2 className={`${commonStyles.techTitle} ${themeStyles.techTitle}`}>Technologies</h2>
          <div className={commonStyles.techRow}>
            {service.techs.map((t, i) => {
              let Icon = null;
              let color = undefined;
              switch (t.toLowerCase()) {
                case 'figma':
                  Icon = SiFigma;
                  color = '#F24E1E';
                  break;
                case 'adobe xd':
                  Icon = FaPalette;
                  color = '#FF61F6';
                  break;
                case 'sketch':
                  Icon = SiSketch;
                  color = '#F7B500';
                  break;
                case 'invision':
                  Icon = SiInvision;
                  color = '#FF3366';
                  break;
                default:
                  Icon = null;
                  color = undefined;
              }
              return (
                <span
                  key={i}
                  className={`${commonStyles.techCard} ${themeStyles.techCard}`}
                  data-animate="scale-on-hover"
                >
                  {Icon ? (
                    <Icon size={40} className={styles.techIcon} title={t} color={color} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/meta/${
                        t.toLowerCase().replace(/\s/g, '') === 'azureai' ||
                        t.toLowerCase().replace(/\s/g, '') === 'azure' ||
                        t.toLowerCase().replace(/\s/g, '') === 'microsoftazure'
                          ? 'AzureAI.png'
                          : `${t.replace(/\s/g, '')}.png`
                      }`}
                      alt={t}
                      className={styles.techImage}
                    />
                  )}
                  {t}
                </span>
              );
            })}
          </div>
        </section>

        <ServiceDecisionGuide copy={serviceCopy} theme={theme} />

        {/* How We Work Section */}
        {/* Section divider */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <section
          className={`${commonStyles.howSection} ${themeStyles.howSection}`}
          aria-labelledby="how-we-work-title"
        >
          <h2 id="how-we-work-title" className={`${commonStyles.howTitle} ${themeStyles.howTitle}`}>
            How We Work
          </h2>
          <div className={`${commonStyles.howDesc} ${themeStyles.howDesc}`}>
            Choose the working model that fits your budget, speed, and level of product direction.
          </div>
          <div className={commonStyles.howGrid}>
            {engagementModels.map((model) => (
              <div
                key={model.title}
                className={`${commonStyles.howCard} ${themeStyles.howCard}`}
                data-popular={model.isPopular ? 'true' : undefined}
              >
                {model.isPopular && <div className={commonStyles.popularBadge}>Most Popular</div>}
                <div
                  className={`${commonStyles.iconWrapper} ${themeStyles.iconWrapper}`}
                  style={{ color: '#4573df' }}
                >
                  {model.icon}
                </div>
                <h3>{model.title}</h3>
                <div className={commonStyles.benefitsList}>
                  {model.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className={`${commonStyles.benefitItem} ${themeStyles.benefitItem}`}
                    >
                      <BsCheckCircleFill
                        size={16}
                        style={{ color: '#4573df' }}
                        className={styles.benefitIcon}
                      />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        {/* Section divider */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <div className={commonStyles.faqSection}>
          <ServiceFAQs faqs={faqs} theme={theme} />
        </div>

        {/* CTA - Full-width colored strip */}
        {/* Section divider */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <section
          className={`${commonStyles.ctaSection} ${themeStyles.ctaSection}`}
          data-animate="cta-strip"
        >
          {/* Glassmorphism overlay */}
          <div className={`${commonStyles.ctaOverlay} ${themeStyles.ctaOverlay}`} />
          <button
            type="button"
            className={`${commonStyles.ctaBtnMain} ${themeStyles.ctaBtnMain}`}
            data-animate="cta-bounce"
            onClick={openCalendly}
            aria-label={serviceCopy.primaryCta}
          >
            <FaPalette className={commonStyles.ctaBtnIcon} title="Design Consultant" />
            {serviceCopy.primaryCta}
          </button>
          <div className={`${commonStyles.ctaDesc} ${themeStyles.ctaDesc}`}>
            {serviceCopy.abVariant}
          </div>
          <a
            href="/contact"
            className={`${commonStyles.ctaDesc} ${themeStyles.ctaDesc}`}
            style={{
              display: 'inline-block',
              marginTop: 8,
              textDecoration: 'underline',
              fontSize: '0.95rem',
            }}
          >
            Or send us a message
          </a>
          <Link
            href="/projects"
            className={`${commonStyles.ctaDesc} ${themeStyles.ctaDesc}`}
            style={{
              display: 'inline-block',
              marginTop: 12,
              textDecoration: 'underline',
              fontSize: '0.95rem',
              opacity: 0.85,
            }}
          >
            See Our Case Studies &rarr;
          </Link>
        </section>
      </main>
      {calendlyModal}
      <ServiceSchema
        service={{
          title: service.title!,
          description: service.description!,
          slug: 'ui-ux-product-design',
          features: service.features,
        }}
      />
      <Footer />
    </div>
  );
}
