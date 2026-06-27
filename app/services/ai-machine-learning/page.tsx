'use client';
import React, { useMemo } from 'react';
import { BsCheckCircleFill } from 'react-icons/bs';
import {
  FaAws,
  FaCogs,
  FaDatabase,
  FaEye,
  FaLanguage,
  FaLifeRing,
  FaRobot,
  FaRocket,
  FaSearch,
} from 'react-icons/fa';
// Import additional icons we'll need
import { RiPriceTag3Fill, RiTeamFill, RiTimeFill } from 'react-icons/ri';
import {
  SiGooglecloud,
  SiOpenai,
  SiPython,
  SiPytorch,
  SiScikitlearn,
  SiTensorflow,
} from 'react-icons/si';

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
import commonStyles from './ai-machine-learning-common.module.css';
import darkStyles from './ai-machine-learning-dark.module.css';
import lightStyles from './ai-machine-learning-light.module.css';

const LottiePlayer = dynamic(() => import('../../../components/LottiePlayer/LottiePlayer'), {
  ssr: false,
});
// Clone the service object and override the techs array to remove 'AI' and 'Azure', and add other relevant technologies
const service = {
  ...servicesData.find((s) => s.slug === 'ai-machine-learning'),
  techs: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'AWS', 'Google Cloud', 'OpenAI'],
};
const serviceCopy = servicePageCopy['ai-machine-learning'];

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
    title: 'Discovery & Consultation',
    desc: 'Business goals & AI opportunities.',
    icon: <FaSearch color="#4573df" size={36} title="Discovery & Consultation" />,
  },
  {
    title: 'Data Preparation',
    desc: 'Data collection & cleaning.',
    icon: <FaDatabase color="#4573df" size={36} title="Data Preparation" />,
  },
  {
    title: 'Model Development',
    desc: 'Custom AI/ML model design.',
    icon: <FaCogs color="#4573df" size={36} title="Model Development" />,
  },
  {
    title: 'Integration & Deployment',
    desc: 'Workflow integration & launch.',
    icon: <FaRocket color="#4573df" size={36} title="Integration & Deployment" />,
  },
  {
    title: 'Monitoring & Support',
    desc: 'Ongoing tuning & support.',
    icon: <FaLifeRing color="#4573df" size={36} title="Monitoring & Support" />,
  },
];

const faqs = [
  {
    q: 'How do you ensure data privacy and security?',
    a: 'We follow strict security protocols, comply with GDPR, and use secure cloud infrastructure for all AI projects.',
  },
  {
    q: 'Can you work with our existing data and systems?',
    a: 'Yes, we specialize in integrating AI solutions with your current tech stack and data sources.',
  },
  {
    q: 'What is the typical project timeline?',
    a: 'AI projects usually take 6-16 weeks, depending on complexity and data readiness.',
  },
  {
    q: 'Do you provide post-launch support?',
    a: 'Absolutely. We offer ongoing monitoring, retraining, and support packages.',
  },
];

// Features/deliverables with icons
const features = [
  {
    icon: <FaRobot color="#4573df" size={36} title="AI Model Development" />,
    label: 'AI Model Development',
  },
  {
    icon: <SiTensorflow color="#FF6F00" size={36} title="Machine Learning Integration" />,
    label: 'Machine Learning Integration',
  },
  {
    icon: <FaLanguage color="#4573df" size={36} title="Natural Language Processing" />,
    label: 'Natural Language Processing',
  },
  { icon: <FaEye color="#4573df" size={36} title="Computer Vision" />, label: 'Computer Vision' },
  {
    icon: <FaCogs color="#4573df" size={36} title="AI-Powered Automation" />,
    label: 'AI-Powered Automation',
  },
];

export default function AIMachineLearningDetailPage() {
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
        aria-label="AI & Machine Learning Service Detail"
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
                  aria-label="Build My AI Product"
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
                {/* AI Brain Lottie animation replaces static SVG */}
                <LottiePlayer
                  src="/lottie/ai-brain.json"
                  loop
                  style={{
                    width: '100%',
                    height: '100%',
                    minWidth: '180px',
                    minHeight: '180px',
                  }}
                  ariaLabel="Animated AI brain neural network illustration"
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
              From predictive analytics to natural language processing, we design and deploy custom
              AI models tailored to your industry. Our end-to-end approach covers data strategy,
              model training, integration with your existing systems, and ongoing optimization to
              deliver measurable ROI.
            </p>
          </div>
          <div className={commonStyles.overviewImageBlock}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/icon-lightbulb.png"
              alt="AI innovation and intelligence"
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
              <span data-animate="countup" data-value="78">
                78%
              </span>
              <div className={`${commonStyles.whyStatDesc} ${themeStyles.whyStatDesc}`}>
                of businesses believe AI will impact their industry (PwC)
              </div>
            </div>
            <div className={`${commonStyles.whyStatCard} ${themeStyles.whyStatCard}`}>
              <span data-animate="countup" data-value="2">
                2x
              </span>
              <div className={`${commonStyles.whyStatDesc} ${themeStyles.whyStatDesc}`}>
                revenue growth for AI adoption leaders
              </div>
            </div>
          </div>
          {/* Supporting illustration */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/icon-target-growth.png"
              alt="Target growth - AI-driven measurable results"
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
                case 'python':
                  Icon = SiPython;
                  color = '#3776AB';
                  break;
                case 'tensorflow':
                  Icon = SiTensorflow;
                  color = '#FF6F00';
                  break;
                case 'pytorch':
                  Icon = SiPytorch;
                  color = '#EE4C2C';
                  break;
                case 'scikit-learn':
                  Icon = SiScikitlearn;
                  color = '#F7931E';
                  break;
                case 'aws':
                case 'amazon aws':
                case 'amazon web services':
                  Icon = FaAws;
                  color = '#FF9900';
                  break;
                case 'google cloud':
                  Icon = SiGooglecloud;
                  color = '#4285F4';
                  break;
                case 'openai':
                  Icon = SiOpenai;
                  color = '#412991';
                  break;
                case 'azureai':
                case 'azure ai':
                case 'microsoft azure':
                  Icon = null;
                  color = undefined;
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
          <button
            type="button"
            className={`${commonStyles.ctaBtnMain} ${themeStyles.ctaBtnMain}`}
            data-animate="cta-bounce"
            onClick={openCalendly}
            aria-label={serviceCopy.primaryCta}
          >
            <FaRobot className={commonStyles.ctaBtnIcon} title="AI Consultant" />
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
          slug: 'ai-machine-learning',
          features: service.features,
        }}
      />
      <Footer />
    </div>
  );
}
