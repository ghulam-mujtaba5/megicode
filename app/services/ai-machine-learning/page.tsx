"use client";
import Footer from "../../../components/Footer/Footer";
import commonStyles from "./ai-machine-learning-common.module.css";
import lightStyles from "./ai-machine-learning-light.module.css";
import darkStyles from "./ai-machine-learning-dark.module.css";
import GmIcon from "../../../components/Icon/sbicon";

import React, { useMemo } from "react";
import { useCalendlyModal } from "../../../components/CalendlyModal";
import { useTheme } from "../../../context/ThemeContext";
import { useInViewAnimation } from "../../../hooks/useInViewAnimation";
import servicesData from "../servicesData";
import { OurProcess, EngagementModels, MethodologyAndCommunication, ServiceFAQs } from "../ServiceDetailSections";
import { SiPython, SiTensorflow, SiPytorch, SiScikitlearn, SiAmazon, SiGooglecloud } from "react-icons/si";
import { FaRobot, FaLanguage, FaEye, FaCogs, FaSearch, FaDatabase, FaRocket, FaLifeRing } from "react-icons/fa";

import NavBarMobile from "../../../components/NavBar_Mobile/NavBar-mobile";
import NavBar from "../../../components/NavBar_Desktop_Company/nav-bar-Company";
// Clone the service object and override the techs array to remove 'AI' and 'Azure', and add other relevant technologies
const service = {
  ...servicesData.find(s => s.slug === "ai-machine-learning"),
  techs: [
    "Python",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "AWS",
    "Google Cloud",
    "OpenAI"
  ]
};

// Import additional icons we'll need
import { RiPriceTag3Fill, RiTeamFill, RiTimeFill } from 'react-icons/ri';
import { BsCheckCircleFill } from 'react-icons/bs';

const engagementModels = [
  {
    title: "Fixed Price",
    icon: <RiPriceTag3Fill size={40} />,
    benefits: [
      "Defined Project Scope",
      "Predictable Budget",
      "Milestone-Based Billing"
    ],
    color: "#4FACFE",
    isPopular: false
  },
  {
    title: "Dedicated Team",
    icon: <RiTeamFill size={40} />,
    benefits: [
      "Scalable Team Extension",
      "Direct Expert Access",
      "Seamless Integration"
    ],
    color: "#6EA8FF",
    isPopular: true
  },
  {
    title: "Time & Material",
    icon: <RiTimeFill size={40} />,
    benefits: [
      "Flexible Scope",
      "Agile Development",
      "Pay-as-you-go"
    ],
    color: "#45B7DF",
    isPopular: false
  }
];

const processSteps = [
  {
    title: "Discovery & Consultation",
    desc: "Business goals & AI opportunities.",
    icon: <FaSearch color="#4573df" size={36} title="Discovery & Consultation" />
  },
  {
    title: "Data Preparation",
    desc: "Data collection & cleaning.",
    icon: <FaDatabase color="#4573df" size={36} title="Data Preparation" />
  },
  {
    title: "Model Development",
    desc: "Custom AI/ML model design.",
    icon: <FaCogs color="#4573df" size={36} title="Model Development" />
  },
  {
    title: "Integration & Deployment",
    desc: "Workflow integration & launch.",
    icon: <FaRocket color="#4573df" size={36} title="Integration & Deployment" />
  },
  {
    title: "Monitoring & Support",
    desc: "Ongoing tuning & support.",
    icon: <FaLifeRing color="#4573df" size={36} title="Monitoring & Support" />
  }
];

const faqs = [
  { q: "How do you ensure data privacy and security?", a: "We follow strict security protocols, comply with GDPR, and use secure cloud infrastructure for all AI projects." },
  { q: "Can you work with our existing data and systems?", a: "Yes, we specialize in integrating AI solutions with your current tech stack and data sources." },
  { q: "What is the typical project timeline?", a: "AI projects usually take 6-16 weeks, depending on complexity and data readiness." },
  { q: "Do you provide post-launch support?", a: "Absolutely. We offer ongoing monitoring, retraining, and support packages." }
];

// Features/deliverables with icons
const features = [
  { icon: <FaRobot color="#4573df" size={36} title="AI Model Development" />, label: "AI Model Development" },
  { icon: <SiTensorflow color="#FF6F00" size={36} title="Machine Learning Integration" />, label: "Machine Learning Integration" },
  { icon: <FaLanguage color="#4573df" size={36} title="Natural Language Processing" />, label: "Natural Language Processing" },
  { icon: <FaEye color="#4573df" size={36} title="Computer Vision" />, label: "Computer Vision" },
  { icon: <FaCogs color="#4573df" size={36} title="AI-Powered Automation" />, label: "AI-Powered Automation" },
];

const testimonial = {
  quote: "Megicode delivered a custom AI solution that transformed our business insights and automated key processes. Their expertise and communication were top-notch!",
  name: "Sarah L.",
  company: "FinTech Client"
};

export default function AIMachineLearningDetailPage() {
  const { theme } = useTheme();
  const themeStyles = useMemo(() => (theme === 'dark' ? darkStyles : lightStyles), [theme]);
  useInViewAnimation();
  const [openCalendly, calendlyModalElement] = useCalendlyModal();
  if (!service) return null;

  return (
    <div className={`${commonStyles.aiMLBoxSizingAll} ${themeStyles.main}`}>
      {/* NavBars */}
      <div className="desktop-navbar-wrapper" style={{ width: '100%', position: 'sticky', top: 0, zIndex: 2100 }}>
        <NavBar />
      </div>
      <div className="mobile-navbar-wrapper" style={{ width: '100%', position: 'sticky', top: 0, zIndex: 2000 }}>
        <NavBarMobile />
      </div>
      <GmIcon />

      <main
        id="main-content"
        className={commonStyles.mainContent}
        aria-label="AI & Machine Learning Service Detail"
        style={{ 
          paddingTop: '88px',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '88px 24px 64px'
        }}
      >
        {/* Soft background shapes for extra depth */}
        <div className={commonStyles.bgShapeLeft} aria-hidden="true" />
        <div className={commonStyles.bgShapeRight} aria-hidden="true" />
        {/* Hero Section - Full-width gradient, Lottie/SVG, CTA */}
        <section
            className={`${commonStyles.heroSection} ${themeStyles.heroSection} service-hero-gradient`}
            data-animate="fade-in"
            aria-labelledby="hero-title"
          >
            <div className={`${commonStyles.heroOverlay} ${themeStyles.heroOverlay}`} aria-hidden="true" />
            <div 
              className={`${commonStyles.heroBlurCircle} ${themeStyles.heroBlurCircle}`}
              aria-hidden="true"
            />
            <div className={commonStyles.heroContent}>
              <div className={commonStyles.heroTextBlock}>
                <h1 id="hero-title" className={`${commonStyles.heroTitle} ${themeStyles.heroTitle}`}>
                  <span className={commonStyles.gradientText}>{service.title}</span>
                </h1>
                <p className={`${commonStyles.heroDesc} ${themeStyles.heroDesc}`} data-animate="typewriter">
                  {service.description}
                </p>
                <div className={commonStyles.heroCTAWrapper}>
                  <button
                    type="button"
                    className={commonStyles.ctaBtn}
                    data-animate="cta-bounce"
                    aria-label="Get Started with AI & Machine Learning Services"
                    onClick={openCalendly}
                  >
                    Get Started
                    <span className={commonStyles.ctaBtnArrow} aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
              <div className={commonStyles.heroImageBlock} aria-hidden="true">
                <div className={commonStyles.heroImageCard} data-animate="float">
                  <img
                    src="/Ai icon.svg"
                    alt=""
                    className={commonStyles.heroImage}
                    loading="eager"
                  />
                  <div className={commonStyles.heroImageDot} />
                  <div className={commonStyles.heroImageSparkles}>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={commonStyles.sparkle} style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

        {/* Service Overview - Side-by-side layout */}
        {/* Section divider */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <section className={`${commonStyles.overviewSection} ${themeStyles.overviewSection}`} data-animate="slide-left">
          <div className={commonStyles.overviewTextBlock}>
            <h2 className={`${commonStyles.overviewTitle} ${themeStyles.overviewTitle}`}>Overview</h2>
            <p className={`${commonStyles.overviewDesc} ${themeStyles.overviewDesc}`}>{service.description}</p>
          </div>
          <div className={commonStyles.overviewImageBlock}>
            <img src="/ds&ai-icon.svg" alt="AI Service Overview" className={`${commonStyles.overviewImage} ${themeStyles.overviewImage}`} data-animate="fade-in" />
          </div>
        </section>

        {/* Why It Matters - Animated counters, impact */}
        {/* Section divider */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <section className={`${commonStyles.whySection} ${themeStyles.whySection}`} data-animate="fade-in">
          <h2 className={`${commonStyles.whyTitle} ${themeStyles.whyTitle}`}>Why It Matters</h2>
          <div className={commonStyles.whyStatsRow}>
            <div className={`${commonStyles.whyStatCard} ${themeStyles.whyStatCard}`}>
              <span data-animate="countup" data-value="78">78%</span>
              <div className={`${commonStyles.whyStatDesc} ${themeStyles.whyStatDesc}`}>of businesses believe AI will impact their industry (PwC)</div>
            </div>
            <div className={`${commonStyles.whyStatCard} ${themeStyles.whyStatCard}`}>
              <span data-animate="countup" data-value="2">2x</span>
              <div className={`${commonStyles.whyStatDesc} ${themeStyles.whyStatDesc}`}>revenue growth for AI adoption leaders</div>
            </div>
          </div>
        </section>

        {/* Process Stepper - Timeline ready for animation */}
        {/* Section divider */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <section className={`${commonStyles.processSection} ${themeStyles.processSection}`} data-animate="timeline">
          <h2 className={`${commonStyles.processTitle} ${themeStyles.processTitle}`}>Our Process</h2>
          <div className={commonStyles.processStepsRow}>
            {processSteps.map((step, idx) => (
              <div key={idx} className={commonStyles.processStepCard}>
                <div className={`${commonStyles.processStepIcon} ${themeStyles.processStepIcon}`}>{step.icon}</div>
                <div className={`${commonStyles.processStepTitle} ${themeStyles.processStepTitle}`}>{step.title}</div>
                <div className={`${commonStyles.processStepDesc} ${themeStyles.processStepDesc}`}>{step.desc}</div>
                {idx < processSteps.length - 1 && (
                  <div className={`${commonStyles.processStepConnector} ${themeStyles.processStepConnector}`} />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Features as Cards - Deliverables Grid */}
        {/* Section divider */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <section className={`${commonStyles.featuresSection} ${themeStyles.featuresSection}`} data-animate="stagger-fade">
          <h2 className={`${commonStyles.featuresTitle} ${themeStyles.featuresTitle}`}>What You Get</h2>
          <div className={commonStyles.featuresRow}>
            {features.map((f, i) => (
              <div key={i} className={`${commonStyles.featureCard} ${themeStyles.featureCard}`} data-animate="fade-in">
                {f.icon}
                {f.label}
              </div>
            ))}
          </div>
        </section>

        {/* Technologies as Logo Cloud */}
        {/* Section divider */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <section className={`${commonStyles.techSection} ${themeStyles.techSection}`} data-animate="logo-cloud">
          <h2 className={`${commonStyles.techTitle} ${themeStyles.techTitle}`}>Technologies</h2>
          <div className={commonStyles.techRow}>
            {service.techs.map((t, i) => {
              let Icon = null;
              let color = undefined;
              switch (t.toLowerCase()) {
                case "python": Icon = SiPython; color = "#3776AB"; break;
                case "tensorflow": Icon = SiTensorflow; color = "#FF6F00"; break;
                case "pytorch": Icon = SiPytorch; color = "#EE4C2C"; break;
                case "scikit-learn": Icon = SiScikitlearn; color = "#F7931E"; break;
                case "aws":
                case "amazon aws":
                case "amazon web services": Icon = SiAmazon; color = "#FF9900"; break;
                case "google cloud": Icon = SiGooglecloud; color = "#4285F4"; break;
                case "openai":
                  try {
                    Icon = require("react-icons/si").SiOpenai;
                    color = "#412991";
                  } catch { Icon = null; color = undefined; }
                  break;
                case "azureai":
                case "azure ai":
                case "microsoft azure":
                  try {
                    Icon = require("react-icons/si").SiMicrosoftazure;
                    color = "#0089D6";
                  } catch { Icon = null; color = undefined; }
                  break;
                default: Icon = null; color = undefined;
              }
              return (
                <span key={i} className={`${commonStyles.techCard} ${themeStyles.techCard}`} data-animate="scale-on-hover">
                  {Icon ? (
                    <Icon size={40} style={{ marginRight: 12 }} title={t} color={color} />
                  ) : (
                    <img
                      src={`/meta/${
                        t.toLowerCase().replace(/\s/g, '') === 'azureai' || t.toLowerCase().replace(/\s/g, '') === 'azure' || t.toLowerCase().replace(/\s/g, '') === 'microsoftazure'
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

        {/* How We Work Section */}
        {/* Section divider */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <section className={`${commonStyles.howSection} ${themeStyles.howSection}`} aria-labelledby="how-we-work-title">
          <h2 id="how-we-work-title" className={`${commonStyles.howTitle} ${themeStyles.howTitle}`}>
            How We Work
          </h2>
          <div className={`${commonStyles.howDesc} ${themeStyles.howDesc}`}>
            Choose your ideal engagement model for maximum value and efficiency.
          </div>
          <div className={commonStyles.howGrid}>
            {engagementModels.map((model, index) => (
              <div 
                key={model.title} 
                className={`${commonStyles.howCard} ${themeStyles.howCard}`}
                style={{
                  borderColor: model.isPopular ? model.color : undefined,
                  transform: model.isPopular ? 'scale(1.05)' : undefined,
                }}
              >
                {model.isPopular && (
                  <div className={commonStyles.popularBadge}>
                    Most Popular
                  </div>
                )}
                <div className={`${commonStyles.iconWrapper} ${themeStyles.iconWrapper}`} style={{ color: model.color }}>
                  {model.icon}
                </div>
                <h3>{model.title}</h3>
                <div className={commonStyles.benefitsList}>
                  {model.benefits.map((benefit, idx) => (
                    <div key={idx} className={`${commonStyles.benefitItem} ${themeStyles.benefitItem}`}>
                      <BsCheckCircleFill
                        size={16}
                        style={{ color: model.color, flexShrink: 0 }}
                      />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonial */}
        {/* Section divider */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <section className={`${commonStyles.testimonialSection} ${themeStyles.testimonialSection}`} data-animate="fade-in">
          {/* Animated spark/dot */}
          <div className={commonStyles.testimonialDot} />
          {/* Glassmorphism overlay */}
          <div className={`${commonStyles.testimonialOverlay} ${themeStyles.testimonialOverlay}`} />
          <div className={`${commonStyles.testimonialQuote} ${themeStyles.testimonialQuote}`}>
            "{testimonial.quote}"
          </div>
          <div className={`${commonStyles.testimonialAuthor} ${themeStyles.testimonialAuthor}`}>
            {testimonial.name} <span className={`${commonStyles.testimonialCompany} ${themeStyles.testimonialCompany}`}>| {testimonial.company}</span>
          </div>
        </section>

        {/* FAQs */}
        {/* Section divider */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <div className={commonStyles.faqSection}>
          <ServiceFAQs faqs={faqs} />
        </div>

        {/* CTA - Full-width colored strip */}
        {/* Section divider */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <section className={`${commonStyles.ctaSection} ${themeStyles.ctaSection}`} data-animate="cta-strip">
          {/* Glassmorphism overlay */}
          <div className={`${commonStyles.ctaOverlay} ${themeStyles.ctaOverlay}`} />
          <button
            type="button"
            className={`${commonStyles.ctaBtnMain} ${themeStyles.ctaBtnMain}`}
            data-animate="cta-bounce"
            onClick={openCalendly}
            aria-label="Talk to AI Consultant"
          >
            <FaRobot className={commonStyles.ctaBtnIcon} title="AI Consultant" />
            Talk to AI Consultant
          </button>
          <div className={`${commonStyles.ctaDesc} ${themeStyles.ctaDesc}`}>Ready to unlock the power of AI? Let's talk about your vision.</div>
        </section>
      </main>
  {calendlyModalElement}
  <Footer />
    </div>
  );
}
