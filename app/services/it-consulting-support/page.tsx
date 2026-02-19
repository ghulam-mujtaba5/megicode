"use client";
import Footer from "../../../components/Footer/Footer";
import commonStyles from "./it-consulting-common.module.css";
import lightStyles from "./it-consulting-light.module.css";
import darkStyles from "./it-consulting-dark.module.css";
import GmIcon from "../../../components/Icon/sbicon";

import React, { useMemo } from "react";
import { useCalendlyModal } from "../../../components/CalendlyModal";
import { useTheme } from "../../../context/ThemeContext";
import { useInViewAnimation } from "../../../hooks/useInViewAnimation";
import servicesData from "../servicesData";
import ServiceSchema from "@/components/SEO/ServiceSchema";
import { OurProcess, EngagementModels, MethodologyAndCommunication, ServiceFAQs } from "../ServiceDetailSections";
import { 
  SiJira, 
  SiGooglechrome, 
  SiAmazon,
  SiDocker,
  SiSlack
} from "react-icons/si";
import { 
  FaChartLine, 
  FaNetworkWired, 
  FaServer, 
  FaUserCog, 
  FaHeadset, 
  FaShieldAlt, 
  FaTools, 
  FaBook, 
  FaProjectDiagram,
  FaClipboardCheck
} from "react-icons/fa";

import NavBarMobile from "../../../components/NavBar_Mobile/NavBar-mobile";
import NewNavBar from "../../../components/NavBar_Desktop_Company/NewNavBar";
// Clone the service object and override the techs array to remove 'AI' and 'Azure', and add other relevant technologies
const service = {
  ...servicesData.find(s => s.slug === "it-consulting-support"),
  techs: [
    "Jira",
    "AWS",
    "Google Workspace",
    "Docker",
    "Slack"
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
      "Defined scope",
      "Predictable budget",
      "Risk management"
    ],
    color: "#4FACFE",
    isPopular: false
  },
  {
    title: "Dedicated Team",
    icon: <RiTeamFill size={40} />,
    benefits: [
      "Scalable team extension",
      "Certified experts",
      "Enterprise collaboration"
    ],
    color: "#6EA8FF",
    isPopular: true
  },
  {
    title: "Time & Material",
    icon: <RiTimeFill size={40} />,
    benefits: [
      "Agile development",
      "Dynamic scope",
      "Innovation focus"
    ],
    color: "#45B7DF",
    isPopular: false
  }
];

const processSteps = [
  {
    title: "Assessment & Strategy",
    desc: "IT landscape & strategy.",
    icon: <FaChartLine color="#4573df" size={36} title="Assessment & Strategy" />
  },
  {
    title: "Solution Design",
    desc: "Design solutions.",
    icon: <FaProjectDiagram color="#4573df" size={36} title="Solution Design" />
  },
  {
    title: "Implementation",
    desc: "Deploy & configure.",
    icon: <FaServer color="#4573df" size={36} title="Implementation" />
  },
  {
    title: "Training & Documentation",
    desc: "Train & document.",
    icon: <FaBook color="#4573df" size={36} title="Training & Documentation" />
  },
  {
    title: "Ongoing Support",
    desc: "Monitor & improve.",
    icon: <FaHeadset color="#4573df" size={36} title="Ongoing Support" />
  }
];

const faqs = [
  { q: "Do you provide 24/7 support?", a: "Yes, we offer various support packages including 24/7 coverage with different SLA levels to match your business needs." },
  { q: "Can you help with compliance?", a: "Absolutely! We help organizations achieve and maintain compliance with GDPR, ISO 27001, HIPAA, and other standards." },
  { q: "What platforms do you support?", a: "We support all major platforms including Windows, Linux, macOS, cloud services (AWS, Azure, GCP), and enterprise applications." },
  { q: "How do you ensure security?", a: "We implement industry best practices, conduct regular security audits, and follow strict protocols for data protection and access control." }
];

// Features/deliverables with icons
const features = [
  { icon: <FaChartLine color="#4573df" size={36} title="Technology Strategy" />, label: "Technology Strategy & Roadmapping" },
  { icon: <FaNetworkWired color="#4573df" size={36} title="IT Infrastructure" />, label: "IT Infrastructure Consulting" },
  { icon: <FaShieldAlt color="#4573df" size={36} title="Security Audits" />, label: "Security Audits & Compliance" },
  { icon: <FaTools color="#4573df" size={36} title="Maintenance" />, label: "Ongoing Maintenance & Support" },
  { icon: <FaBook color="#4573df" size={36} title="Training" />, label: "Training & Documentation" },
];

const testimonial = {
  quote: "Megicode's IT consulting team helped us achieve compliance and secure our infrastructure.",
  name: "David P.",
  company: "Legal Services Firm"
};

export default function ITConsultingSupportPage() {
  const { theme } = useTheme();
  const themeStyles = useMemo(() => (theme === 'dark' ? darkStyles : lightStyles), [theme]);
  useInViewAnimation();
  const [openCalendly, calendlyModalElement] = useCalendlyModal();
  if (!service) return null;

  return (
    <div className={`${commonStyles.aiMLBoxSizingAll} ${themeStyles.main}`}>
      {/* NavBars */}
      <div className="desktop-navbar-wrapper" style={{ width: '100%', position: 'sticky', top: 0, zIndex: 2100 }}>
        <NewNavBar />
      </div>
      <div className="mobile-navbar-wrapper" style={{ width: '100%', position: 'sticky', top: 0, zIndex: 2000 }}>
        <NavBarMobile />
      </div>
      <GmIcon />

      <main
        id="main-content"
        className={commonStyles.mainContent}
        aria-label="IT Consulting & Support Service Detail"
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
                    aria-label="Get Started with IT Consulting & Support Services"
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
                    src="/it-consulting-support-icon.svg"
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
            <img src="/it-consulting-support-icon.svg" alt="IT Service Overview" className={`${commonStyles.overviewImage} ${themeStyles.overviewImage}`} data-animate="fade-in" />
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
                case "jira": 
                  Icon = SiJira; 
                  color = "#0052CC"; 
                  break;
                case "aws": 
                  Icon = SiAmazon; 
                  color = "#FF9900"; 
                  break;
                case "google workspace": 
                  Icon = SiGooglechrome; 
                  color = "#4285F4"; 
                  break;
                case "docker":
                  Icon = SiDocker;
                  color = "#2496ED";
                  break;
                case "slack":
                  Icon = SiSlack;
                  color = "#4A154B";
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
            aria-label="Start Your IT Project"
          >
            <FaUserCog className={commonStyles.ctaBtnIcon} title="IT Consultant" />
            Start Your IT Project
          </button>
          <div className={`${commonStyles.ctaDesc} ${themeStyles.ctaDesc}`}>Ready for secure, reliable IT? Let's talk about your vision.</div>
        </section>
      </main>
  {calendlyModalElement}
  <ServiceSchema service={{ title: service.title!, description: service.description!, slug: 'it-consulting-support', features: service.features }} />
  <Footer />
    </div>
  );
}
