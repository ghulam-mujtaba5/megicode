'use client';
import React, { useMemo } from 'react';
import { BsCheckCircleFill } from 'react-icons/bs';
import {
  FaAws,
  FaBook,
  FaChartLine,
  FaHeadset,
  FaNetworkWired,
  FaProjectDiagram,
  FaServer,
  FaShieldAlt,
  FaTools,
  FaUserCog,
} from 'react-icons/fa';
// Import additional icons we'll need
import { RiPriceTag3Fill, RiTeamFill, RiTimeFill } from 'react-icons/ri';
import { SiDocker, SiGooglechrome, SiJira, SiSlack } from 'react-icons/si';

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
import commonStyles from './it-consulting-common.module.css';
import darkStyles from './it-consulting-dark.module.css';
import lightStyles from './it-consulting-light.module.css';

const LottiePlayer = dynamic(() => import('../../../components/LottiePlayer/LottiePlayer'), {
  ssr: false,
});

// Clone the service object and override the techs array to remove 'AI' and 'Azure', and add other relevant technologies
const service = {
  ...servicesData.find((s) => s.slug === 'it-consulting-support'),
  techs: ['Jira', 'AWS', 'Google Workspace', 'Docker', 'Slack'],
};
const serviceCopy = servicePageCopy['it-consulting-support'];

const engagementModels = [
  {
    title: 'Fixed Price',
    icon: <RiPriceTag3Fill size={40} />,
    benefits: ['Defined scope', 'Predictable budget', 'Risk management'],
    color: '#2d4fa2',
    isPopular: false,
  },
  {
    title: 'Dedicated Team',
    icon: <RiTeamFill size={40} />,
    benefits: ['Scalable team extension', 'Certified experts', 'Enterprise collaboration'],
    color: '#4573df',
    isPopular: true,
  },
  {
    title: 'Time & Material',
    icon: <RiTimeFill size={40} />,
    benefits: ['Agile development', 'Dynamic scope', 'Innovation focus'],
    color: '#ff9800',
    isPopular: false,
  },
];

const processSteps = [
  {
    title: 'Assessment & Strategy',
    desc: 'IT landscape & strategy.',
    icon: <FaChartLine color="#4573df" size={36} title="Assessment & Strategy" />,
  },
  {
    title: 'Solution Design',
    desc: 'Design solutions.',
    icon: <FaProjectDiagram color="#4573df" size={36} title="Solution Design" />,
  },
  {
    title: 'Implementation',
    desc: 'Deploy & configure.',
    icon: <FaServer color="#4573df" size={36} title="Implementation" />,
  },
  {
    title: 'Training & Documentation',
    desc: 'Train & document.',
    icon: <FaBook color="#4573df" size={36} title="Training & Documentation" />,
  },
  {
    title: 'Ongoing Support',
    desc: 'Monitor & improve.',
    icon: <FaHeadset color="#4573df" size={36} title="Ongoing Support" />,
  },
];

const faqs = [
  {
    q: 'Do you provide 24/7 support?',
    a: 'Yes, we offer various support packages including 24/7 coverage with different SLA levels to match your business needs.',
  },
  {
    q: 'Can you help with compliance?',
    a: 'Absolutely! We help organizations achieve and maintain compliance with GDPR, ISO 27001, HIPAA, and other standards.',
  },
  {
    q: 'What platforms do you support?',
    a: 'We support all major platforms including Windows, Linux, macOS, cloud services (AWS, Azure, GCP), and enterprise applications.',
  },
  {
    q: 'How do you ensure security?',
    a: 'We implement industry best practices, conduct regular security audits, and follow strict protocols for data protection and access control.',
  },
];

// Features/deliverables with icons
const features = [
  {
    icon: <FaChartLine color="#4573df" size={36} title="Technology Strategy" />,
    label: 'Technology Strategy & Roadmapping',
  },
  {
    icon: <FaNetworkWired color="#4573df" size={36} title="IT Infrastructure" />,
    label: 'IT Infrastructure Consulting',
  },
  {
    icon: <FaShieldAlt color="#4573df" size={36} title="Security Audits" />,
    label: 'Security Audits & Compliance',
  },
  {
    icon: <FaTools color="#4573df" size={36} title="Maintenance" />,
    label: 'Ongoing Maintenance & Support',
  },
  {
    icon: <FaBook color="#4573df" size={36} title="Training" />,
    label: 'Training & Documentation',
  },
];

export default function ITConsultingSupportPage() {
  const { theme } = useTheme();
  const themeStyles = useMemo(() => (theme === 'dark' ? darkStyles : lightStyles), [theme]);
  useInViewAnimation();
  const [openCalendly, calendlyModalElement] = useCalendlyModal();
  if (!service) return null;

  return (
    <div className={`${commonStyles.aiMLBoxSizingAll} ${themeStyles.main}`}>
      {/* NavBars */}
      <div
        className="desktop-navbar-wrapper"
        style={{ width: '100%', position: 'sticky', top: 0, zIndex: 2100 }}
      >
        <NewNavBar />
      </div>
      <div
        className="mobile-navbar-wrapper"
        style={{ width: '100%', position: 'sticky', top: 0, zIndex: 2000 }}
      >
        <NavBarMobile />
      </div>
      <GmIcon />

      <main
        id="main-content"
        className={commonStyles.mainContent}
        aria-label="IT Consulting & Support Service Detail"
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '88px 24px 64px',
        }}
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
                  aria-label="Get Technical Direction"
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
                {/* Team Lottie - expert team providing consulting & support */}
                <LottiePlayer
                  src="/lottie/06_cybersecurity_trust.json"
                  loop
                  style={{ width: '100%', height: '100%', minWidth: '180px', minHeight: '180px' }}
                  ariaLabel="Animated security shield illustration for IT consulting and support"
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
              Our IT consultants partner with you to align technology with business goals. We
              provide strategic roadmapping, infrastructure assessments, security audits, compliance
              guidance (GDPR, ISO 27001, HIPAA), and ongoing managed support to keep your systems
              secure and efficient.
            </p>
          </div>
          <div className={commonStyles.overviewImageBlock}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/icon-handshake.png"
              alt="IT consulting and tech partnership"
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
              <span data-animate="countup" data-value="60">
                60%
              </span>
              <div className={`${commonStyles.whyStatDesc} ${themeStyles.whyStatDesc}`}>
                of businesses experience costly downtime without proactive IT support (Gartner)
              </div>
            </div>
            <div className={`${commonStyles.whyStatCard} ${themeStyles.whyStatCard}`}>
              <span data-animate="countup" data-value="43">
                43%
              </span>
              <div className={`${commonStyles.whyStatDesc} ${themeStyles.whyStatDesc}`}>
                reduction in downtime with managed IT services
              </div>
            </div>
          </div>
          {/* Supporting illustration */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/icon-support-agent.png"
              alt="Support agent - IT consulting expertise"
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
                case 'jira':
                  Icon = SiJira;
                  color = '#0052CC';
                  break;
                case 'aws':
                  Icon = FaAws;
                  color = '#FF9900';
                  break;
                case 'google workspace':
                  Icon = SiGooglechrome;
                  color = '#4285F4';
                  break;
                case 'docker':
                  Icon = SiDocker;
                  color = '#2496ED';
                  break;
                case 'slack':
                  Icon = SiSlack;
                  color = '#4A154B';
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
                    <Icon size={40} style={{ marginRight: 12 }} title={t} color={color} />
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
                      style={{ width: 40, height: 40, marginRight: 12 }}
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
                      <BsCheckCircleFill size={16} style={{ color: '#4573df', flexShrink: 0 }} />
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/icon-security-badge.png"
            alt=""
            width={72}
            height={72}
            loading="lazy"
            aria-hidden="true"
            style={{
              display: 'block',
              margin: '0 auto 1.25rem',
              objectFit: 'contain',
              filter: 'drop-shadow(0 8px 24px rgba(69,115,223,0.32))',
              opacity: 0.9,
            }}
          />
          <button
            type="button"
            className={`${commonStyles.ctaBtnMain} ${themeStyles.ctaBtnMain}`}
            data-animate="cta-bounce"
            onClick={openCalendly}
            aria-label={serviceCopy.primaryCta}
          >
            <FaUserCog className={commonStyles.ctaBtnIcon} title="IT Consultant" />
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
      {calendlyModalElement}
      <ServiceSchema
        service={{
          title: service.title!,
          description: service.description!,
          slug: 'it-consulting-support',
          features: service.features,
        }}
      />
      <Footer />
    </div>
  );
}
