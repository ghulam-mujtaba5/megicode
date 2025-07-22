"use client";
import Footer from "../../../components/Footer/Footer";
import commonStyles from "./data-analytics-common.module.css";
import lightStyles from "./data-analytics-light.module.css";
import darkStyles from "./data-analytics-dark.module.css";
import GmIcon from "../../../components/Icon/sbicon";

import React, { useMemo } from "react";
import { useCalendlyModal } from "../../../components/CalendlyModal";
import { useTheme } from "../../../context/ThemeContext";
import { useInViewAnimation } from "../../../hooks/useInViewAnimation";
import servicesData from "../servicesData";
import { OurProcess, EngagementModels, MethodologyAndCommunication, ServiceFAQs } from "../ServiceDetailSections";
import { SiPython, SiTableau, SiMysql, SiApachespark } from "react-icons/si";
import { 
  FaSearch, 
  FaDatabase, 
  FaChartBar, 
  FaRocket, 
  FaLifeRing,
  FaChartPie,
  FaChartLine,
  FaCalculator,
  FaWarehouse
} from "react-icons/fa";

import NavBarMobile from "../../../components/NavBar_Mobile/NavBar-mobile";
import NavBar from "../../../components/NavBar_Desktop_Company/nav-bar-Company";
// Clone the service object and override the techs array to remove 'AI' and 'Azure', and add other relevant technologies
const service = {
  ...servicesData.find(s => s.slug === "data-analytics-bi"),
  title: "Data Analytics & Business Intelligence",
  description: "Transform data into actionable insights with analytics, dashboards, and business intelligence solutions.",
  techs: [
    "Python",
    "Power BI",
    "Tableau",
    "SQL",
    "Spark"
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
    title: "Discovery & Assessment",
    desc: "Business goals & data needs.",
    icon: <FaSearch color="#4573df" size={36} title="Discovery & Assessment" />
  },
  {
    title: "Data Integration",
    desc: "Aggregate & clean data.",
    icon: <FaDatabase color="#4573df" size={36} title="Data Integration" />
  },
  {
    title: "Analytics & Dashboarding",
    desc: "Dashboards & predictive models.",
    icon: <FaChartBar color="#4573df" size={36} title="Analytics & Dashboarding" />
  },
  {
    title: "Deployment & Training",
    desc: "Deploy & train your team.",
    icon: <FaRocket color="#4573df" size={36} title="Deployment & Training" />
  },
  {
    title: "Ongoing Optimization",
    desc: "Monitor & optimize.",
    icon: <FaLifeRing color="#4573df" size={36} title="Ongoing Optimization" />
  }
];

const faqs = [
  { q: "Can you connect to all our data sources?", a: "Yes, we integrate with all major databases, cloud services, and enterprise systems to provide unified analytics." },
  { q: "How secure is our business data?", a: "We implement enterprise-grade security measures, comply with GDPR and SOC2, and follow strict data governance protocols." },
  { q: "Do you provide training for our team?", a: "Yes, we offer comprehensive training programs to ensure your team can effectively use and maintain the analytics solutions." },
  { q: "Can dashboards be customized?", a: "Absolutely. All dashboards and reports are tailored to your KPIs and branding." }
];

// Features/deliverables with icons
const features = [
  { icon: <FaChartLine color="#4573df" size={36} title="Big Data Analytics" />, label: "Big Data Analytics" },
  { icon: <FaChartPie color="#4573df" size={36} title="Tableau Visualization" />, label: "Tableau Visualization" },
  { icon: <FaCalculator color="#4573df" size={36} title="Predictive Analytics" />, label: "Predictive Analytics" },
  { icon: <FaWarehouse color="#4573df" size={36} title="Data Warehousing" />, label: "Data Warehousing" },
];

const testimonial = {
  quote: "Megicode's BI dashboards gave us real-time insights and empowered our team to make data-driven decisions.",
  name: "James K.",
  company: "Retail Analytics Client"
};

export default function DataAnalyticsDetailPage() {
  const { theme } = useTheme();
  const themeStyles = useMemo(() => (theme === 'dark' ? darkStyles : lightStyles), [theme]);
  const isDark = theme === 'dark';
  const palette = useMemo(() => ({
    cardInnerBorder: isDark ? 'rgba(78, 168, 255, 0.2)' : 'rgba(78, 168, 255, 0.1)'
  }), [isDark]);
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
                    aria-label="Get Started with Analytics & BI Services"
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
                    src="/Big Data Analytics.svg"
                    alt="Data Analytics Illustration"
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
            <img 
              src="/Big Data Analytics.svg"
              alt="Data Analytics & BI Overview"
              className={`${commonStyles.overviewImage} ${themeStyles.overviewImage}`}
              data-animate="fade-in"
              style={{ 
                width: 180, 
                maxWidth: '100%', 
                borderRadius: 32, 
                boxShadow: '0 8px 32px #4ea8ff33', 
                background: isDark ? 'rgba(36,41,54,0.98)' : '#fff', 
                padding: 18, 
                border: `2px solid ${palette.cardInnerBorder}` 
              }}
            />
          </div>
        </section>

        {/* Why It Matters - Animated counters, impact */}
        {/* Section divider */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <section className={`${commonStyles.whySection} ${themeStyles.whySection}`} data-animate="fade-in">
          <h2 className={`${commonStyles.whyTitle} ${themeStyles.whyTitle}`}>Why It Matters</h2>
          <div className={commonStyles.whyStatsRow}>
            <div className={`${commonStyles.whyStatCard} ${themeStyles.whyStatCard}`}>
              <span data-animate="countup" data-value="5">5x</span>
              <div className={`${commonStyles.whyStatDesc} ${themeStyles.whyStatDesc}`}>ROI for companies using BI & analytics</div>
            </div>
            <div className={`${commonStyles.whyStatCard} ${themeStyles.whyStatCard}`}>
              <span data-animate="countup" data-value="70">70%</span>
              <div className={`${commonStyles.whyStatDesc} ${themeStyles.whyStatDesc}`}>of execs say analytics is critical to business</div>
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
                case "power bi": Icon = SiTableau; color = "#00A4EF"; break; // Using Tableau icon temporarily for Power BI
                case "tableau": Icon = SiTableau; color = "#E97627"; break;
                case "sql": Icon = SiMysql; color = "#4479A1"; break;
                case "spark": Icon = SiApachespark; color = "#E25A1C"; break;
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
            aria-label="Talk to Analytics Consultant"
          >
            <FaChartLine className={commonStyles.ctaBtnIcon} title="Analytics Consultant" />
            Talk to Analytics Consultant
          </button>
          <div className={`${commonStyles.ctaDesc} ${themeStyles.ctaDesc}`}>Ready to unlock your data? Let's talk about your vision.</div>
        </section>
      </main>
  {calendlyModalElement}
  <Footer />
    </div>
  );
}
