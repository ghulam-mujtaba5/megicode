'use client';
import React, { useMemo } from 'react';
import { BsCheckCircleFill } from 'react-icons/bs';
import {
  FaAws,
  FaCloud,
  FaCode,
  FaLifeRing,
  FaPaintBrush,
  FaPlug,
  FaRocket,
  FaSearch,
  FaShieldAlt,
} from 'react-icons/fa';
// Import additional icons we'll need
import { RiPriceTag3Fill, RiTeamFill, RiTimeFill } from 'react-icons/ri';
import { SiDocker, SiNextdotjs, SiNodedotjs, SiReact, SiSpringboot } from 'react-icons/si';

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
  ServiceConversionPanel,
  ServiceDecisionGuide,
  ServiceFAQs,
  ServicePersonalizationPanel,
  ServiceProofStrip,
  ServiceRecommendationPanel,
  ServiceUsabilityBlocks,
} from '../ServiceDetailSections';
import servicePageCopy from '../servicePageCopy';
import servicesData from '../servicesData';
import commonStyles from './web-development-common.module.css';
import darkStyles from './web-development-dark.module.css';
import lightStyles from './web-development-light.module.css';

const LottiePlayer = dynamic(() => import('../../../components/LottiePlayer/LottiePlayer'), {
  ssr: false,
});
// Clone the service object and override the techs array to remove 'AI' and 'Azure', and add other relevant technologies
const service = {
  ...servicesData.find((s) => s.slug === 'custom-web-development'),
  title: 'Custom Web Development',
  description:
    'Robust, scalable, and secure web applications tailored to your business goals and user needs.',
  techs: ['React', 'Next.js', 'Node.js', 'Spring Boot', 'AWS', 'Docker'],
};
const serviceCopy = servicePageCopy['custom-web-development'];

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
    title: 'Requirement Analysis',
    desc: 'Define goals & features.',
    icon: <FaSearch color="#4573df" size={36} title="Requirement Analysis" />,
  },
  {
    title: 'UI/UX Design',
    desc: 'Wireframes & prototypes.',
    icon: <FaPaintBrush color="#4573df" size={36} title="UI/UX Design" />,
  },
  {
    title: 'Development & Testing',
    desc: 'Build & QA.',
    icon: <FaCode color="#4573df" size={36} title="Development & Testing" />,
  },
  {
    title: 'Deployment & Launch',
    desc: 'Go live!',
    icon: <FaRocket color="#4573df" size={36} title="Deployment & Launch" />,
  },
  {
    title: 'Maintenance & Growth',
    desc: 'Support & optimize.',
    icon: <FaLifeRing color="#4573df" size={36} title="Maintenance & Growth" />,
  },
];

const faqs = [
  {
    q: 'Can you migrate our legacy app?',
    a: 'Yes, we specialize in modernizing legacy applications with minimal disruption to your business operations.',
  },
  {
    q: 'Do you offer post-launch support?',
    a: 'Yes, we provide comprehensive maintenance, monitoring, and enhancement support after launch.',
  },
  {
    q: 'How do you ensure web app security?',
    a: 'We implement industry-standard security practices, regular security audits, and follow OWASP guidelines.',
  },
  {
    q: 'What is the typical timeline?',
    a: 'Web projects typically take 8-16 weeks, depending on complexity and requirements.',
  },
];

// Features/deliverables with icons
const features = [
  { icon: <FaCode color="#4573df" size={36} title="Custom Web Apps" />, label: 'Custom Web Apps' },
  { icon: <FaPaintBrush color="#4573df" size={36} title="UI/UX Design" />, label: 'UI/UX Design' },
  {
    icon: <FaCloud color="#4573df" size={36} title="Cloud Deployment" />,
    label: 'Cloud Deployment',
  },
  {
    icon: <FaShieldAlt color="#4573df" size={36} title="Security Best Practices" />,
    label: 'Security Best Practices',
  },
  {
    icon: <FaPlug color="#4573df" size={36} title="API Integrations" />,
    label: 'API Integrations',
  },
];

export default function WebDevelopmentDetailPage() {
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
        aria-label="Custom Web Development Service Detail"
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
                  aria-label="Build a Better Website"
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
                {/* Web coding Lottie - code editor animation for custom web development */}
                <LottiePlayer
                  src="/lottie/web-coding.json"
                  loop
                  style={{ width: '100%', height: '100%', minWidth: '180px', minHeight: '180px' }}
                  ariaLabel="Animated code editor illustration for custom web development"
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
        <ServicePersonalizationPanel
          currentSlug="custom-web-development"
          currentTitle={service.title!}
          primaryCta={serviceCopy.primaryCta}
          onConsultationClick={openCalendly}
          theme={theme}
        />

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
              We build high-performance web applications using modern frameworks like React,
              Next.js, and Node.js. From enterprise portals to e-commerce platforms, our full-stack
              team delivers SEO-optimized, accessible, and scalable solutions with security baked in
              from day one.
            </p>
          </div>
          <div className={commonStyles.overviewImageBlock}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/icon-code-editor.png"
              alt="Custom web development"
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
              <span data-animate="countup" data-value="85">
                85%
              </span>
              <div className={`${commonStyles.whyStatDesc} ${themeStyles.whyStatDesc}`}>
                of customers judge businesses by their websites
              </div>
            </div>
            <div className={`${commonStyles.whyStatCard} ${themeStyles.whyStatCard}`}>
              <span data-animate="countup" data-value="40">
                40%
              </span>
              <div className={`${commonStyles.whyStatDesc} ${themeStyles.whyStatDesc}`}>
                higher conversion rate with optimized web apps
              </div>
            </div>
          </div>
          {/* Supporting illustration */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/icon-global-web.png"
              alt="Global web - worldwide reach through web development"
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
                case 'react':
                  Icon = SiReact;
                  color = '#61DAFB';
                  break;
                case 'next.js':
                  Icon = SiNextdotjs;
                  color = '#000000';
                  break;
                case 'node.js':
                  Icon = SiNodedotjs;
                  color = '#339933';
                  break;
                case 'spring boot':
                  Icon = SiSpringboot;
                  color = '#6DB33F';
                  break;
                case 'aws':
                  Icon = FaAws;
                  color = '#FF9900';
                  break;
                case 'docker':
                  Icon = SiDocker;
                  color = '#2496ED';
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

        <ServiceRecommendationPanel currentSlug="custom-web-development" theme={theme} />
        <ServiceConversionPanel
          copy={serviceCopy}
          primaryCta={serviceCopy.primaryCta}
          onConsultationClick={openCalendly}
          theme={theme}
        />
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
          <button
            type="button"
            className={`${commonStyles.ctaBtnMain} ${themeStyles.ctaBtnMain}`}
            data-animate="cta-bounce"
            onClick={openCalendly}
            aria-label={serviceCopy.primaryCta}
          >
            <FaCode className={commonStyles.ctaBtnIcon} title="Web Development Consultant" />
            {serviceCopy.primaryCta}
          </button>
          <div className={`${commonStyles.ctaDesc} ${themeStyles.ctaDesc}`}>
            {serviceCopy.abVariant}
          </div>
          <a
            href="/contact"
            className={`${commonStyles.ctaDesc} ${themeStyles.ctaDesc}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 14,
              marginRight: 10,
              padding: '0.75rem 1.15rem',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.42)',
              background: 'rgba(255,255,255,0.12)',
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: 800,
            }}
          >
            Send Project Details
          </a>
          <Link
            href="/projects"
            className={`${commonStyles.ctaDesc} ${themeStyles.ctaDesc}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 14,
              padding: '0.75rem 1.15rem',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.92)',
              color: '#2d4fa2',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: 800,
            }}
          >
            View Case Studies
          </Link>
        </section>
      </main>
      {calendlyModalElement}
      <ServiceSchema
        service={{
          title: service.title!,
          description: service.description!,
          slug: 'custom-web-development',
          features: service.features,
        }}
      />
      <Footer />
    </div>
  );
}
