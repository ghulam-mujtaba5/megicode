"use client";
import Footer from "../../../components/Footer/Footer";
import commonStyles from "./web-development-common.module.css";
import lightStyles from "./web-development-light.module.css";
import darkStyles from "./web-development-dark.module.css";
import GmIcon from "../../../components/Icon/sbicon";

import React, { useMemo } from "react";
import { useCalendlyModal } from "../../../components/CalendlyModal";
import { useTheme } from "../../../context/ThemeContext";
import { useInViewAnimation } from "../../../hooks/useInViewAnimation";
import servicesData from "../servicesData";
import ServiceSchema from "@/components/SEO/ServiceSchema";
import { ServiceFAQs } from "../ServiceDetailSections";
import { SiReact, SiNextdotjs, SiNodedotjs, SiSpringboot, SiAmazon, SiDocker } from "react-icons/si";
import { 
  FaCode,
  FaPaintBrush,
  FaCloud,
  FaShieldAlt,
  FaPlug,
  FaSearch,
  FaRocket,
  FaLifeRing
} from "react-icons/fa";

import NavBarMobile from "../../../components/NavBar_Mobile/NavBar-mobile";
import NewNavBar from "../../../components/NavBar_Desktop_Company/NewNavBar";
// Clone the service object and override the techs array to remove 'AI' and 'Azure', and add other relevant technologies
const service = {
  ...servicesData.find(s => s.slug === "custom-web-development"),
  title: "Custom Web Development",
  description: "Robust, scalable, and secure web applications tailored to your business goals and user needs.",
  techs: [
    "React",
    "Next.js",
    "Node.js",
    "Spring Boot",
    "AWS",
    "Docker"
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
    title: "Requirement Analysis",
    desc: "Define goals & features.",
    icon: <FaSearch color="#4573df" size={36} title="Requirement Analysis" />
  },
  {
    title: "UI/UX Design",
    desc: "Wireframes & prototypes.",
    icon: <FaPaintBrush color="#4573df" size={36} title="UI/UX Design" />
  },
  {
    title: "Development & Testing",
    desc: "Build & QA.",
    icon: <FaCode color="#4573df" size={36} title="Development & Testing" />
  },
  {
    title: "Deployment & Launch",
    desc: "Go live!",
    icon: <FaRocket color="#4573df" size={36} title="Deployment & Launch" />
  },
  {
    title: "Maintenance & Growth",
    desc: "Support & optimize.",
    icon: <FaLifeRing color="#4573df" size={36} title="Maintenance & Growth" />
  }
];

const faqs = [
  { q: "Can you migrate our legacy app?", a: "Yes, we specialize in modernizing legacy applications with minimal disruption to your business operations." },
  { q: "Do you offer post-launch support?", a: "Yes, we provide comprehensive maintenance, monitoring, and enhancement support after launch." },
  { q: "How do you ensure web app security?", a: "We implement industry-standard security practices, regular security audits, and follow OWASP guidelines." },
  { q: "What is the typical timeline?", a: "Web projects typically take 8-16 weeks, depending on complexity and requirements." }
];

// Features/deliverables with icons
const features = [
  { icon: <FaCode color="#4573df" size={36} title="Custom Web Apps" />, label: "Custom Web Apps" },
  { icon: <FaPaintBrush color="#4573df" size={36} title="UI/UX Design" />, label: "UI/UX Design" },
  { icon: <FaCloud color="#4573df" size={36} title="Cloud Deployment" />, label: "Cloud Deployment" },
  { icon: <FaShieldAlt color="#4573df" size={36} title="Security Best Practices" />, label: "Security Best Practices" },
  { icon: <FaPlug color="#4573df" size={36} title="API Integrations" />, label: "API Integrations" },
];

const testimonial = {
  quote: "Megicode built a robust web platform for us, delivering on time and exceeding our expectations for quality and UX.",
  name: "Priya S.",
  company: "E-Commerce Startup"
};

export default function WebDevelopmentDetailPage() {
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
        <NewNavBar />
      </div>
      <div className="mobile-navbar-wrapper" style={{ width: '100%', position: 'sticky', top: 0, zIndex: 2000 }}>
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
                    aria-label="Get Started with Web Development Services"
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
                    src="/web app icon.svg"
                    alt="Web App Illustration"
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
            <p className={`${commonStyles.overviewDesc} ${themeStyles.overviewDesc}`}>We build high-performance web applications using modern frameworks like React, Next.js, and Node.js. From enterprise portals to e-commerce platforms, our full-stack team delivers SEO-optimized, accessible, and scalable solutions with security baked in from day one.</p>
          </div>
          <div className={commonStyles.overviewImageBlock}>
            <img
              src="/web app icon.svg"
              alt="Web App Development Overview"
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
              <span data-animate="countup" data-value="85">85%</span>
              <div className={`${commonStyles.whyStatDesc} ${themeStyles.whyStatDesc}`}>of customers judge businesses by their websites</div>
            </div>
            <div className={`${commonStyles.whyStatCard} ${themeStyles.whyStatCard}`}>
              <span data-animate="countup" data-value="40">40%</span>
              <div className={`${commonStyles.whyStatDesc} ${themeStyles.whyStatDesc}`}>higher conversion rate with optimized web apps</div>
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
                case "react": Icon = SiReact; color = "#61DAFB"; break;
                case "next.js": Icon = SiNextdotjs; color = "#000000"; break;
                case "node.js": Icon = SiNodedotjs; color = "#339933"; break;
                case "spring boot": Icon = SiSpringboot; color = "#6DB33F"; break;
                case "aws": Icon = SiAmazon; color = "#FF9900"; break;
                case "docker": Icon = SiDocker; color = "#2496ED"; break;
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
          <ServiceFAQs faqs={faqs} theme={theme} />
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
            aria-label="Start Your Web Project"
          >
            <FaCode className={commonStyles.ctaBtnIcon} title="Web Development Consultant" />
            Start Your Web Project
          </button>
          <div className={`${commonStyles.ctaDesc} ${themeStyles.ctaDesc}`}>Ready to build your next web app? Let&apos;s talk about your vision.</div>
          <a href="/contact" className={`${commonStyles.ctaDesc} ${themeStyles.ctaDesc}`} style={{ display: 'inline-block', marginTop: 8, textDecoration: 'underline', fontSize: '0.95rem' }}>Or send us a message</a>
        </section>
      </main>
  {calendlyModalElement}
  <ServiceSchema service={{ title: service.title!, description: service.description!, slug: 'custom-web-development', features: service.features }} />
  <Footer />
    </div>
  );
}
