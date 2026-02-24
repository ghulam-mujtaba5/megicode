"use client";
import Footer from "../../../components/Footer/Footer";
import commonStyles from "./cloud-devops-common.module.css";
import lightStyles from "./cloud-devops-light.module.css";
import darkStyles from "./cloud-devops-dark.module.css";
import GmIcon from "../../../components/Icon/sbicon";

import React, { useMemo } from "react";
import { useCalendlyModal } from "../../../components/CalendlyModal";
import { useTheme } from "../../../context/ThemeContext";
import { useInViewAnimation } from "../../../hooks/useInViewAnimation";
import servicesData from "../servicesData";
import ServiceSchema from "@/components/SEO/ServiceSchema";
import Breadcrumbs from "@/components/SEO/Breadcrumbs";
import { ServiceFAQs } from "../ServiceDetailSections";
import {
  SiAmazon,
  SiDocker,
  SiKubernetes,
  SiTerraform,
  SiGithubactions,
  SiJenkins,
  SiGooglecloud
} from "react-icons/si";
import {
  FaCloud,
  FaCodeBranch,
  FaServer,
  FaShieldAlt,
  FaChartLine,
  FaSearch,
  FaCogs,
  FaRocket,
  FaLifeRing
} from "react-icons/fa";

import NavBarMobile from "../../../components/NavBar_Mobile/NavBar-mobile";
import NewNavBar from "../../../components/NavBar_Desktop_Company/NewNavBar";
import dynamic from "next/dynamic";
const LottiePlayer = dynamic(() => import('../../../components/LottiePlayer/LottiePlayer'), { ssr: false });
// Clone the service object and override the techs array to remove 'AI' and 'Azure', and add other relevant technologies
const service = {
  ...servicesData.find(s => s.slug === "cloud-devops-services"),
  title: "Cloud & DevOps Services",
  description: "Cloud migration, CI/CD, and infrastructure automation for scalable, secure, and efficient operations.",
  techs: [
    "AWS",
    "Azure",
    "Docker",
    "Kubernetes",
    "Terraform",
    "GitHub Actions",
    "Jenkins",
    "Google Cloud"
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
    color: "#4573df",
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
    title: "Assessment & Planning",
    desc: "Infra & cloud goals.",
    icon: <FaSearch color="#4573df" size={36} title="Assessment & Planning" />
  },
  {
    title: "Architecture & Setup",
    desc: "Cloud & CI/CD setup.",
    icon: <FaServer color="#4573df" size={36} title="Architecture & Setup" />
  },
  {
    title: "Migration & Automation",
    desc: "Migrate & automate.",
    icon: <FaCloud color="#4573df" size={36} title="Migration & Automation" />
  },
  {
    title: "Monitoring & Optimization",
    desc: "Monitor & optimize.",
    icon: <FaChartLine color="#4573df" size={36} title="Monitoring & Optimization" />
  },
  {
    title: "Ongoing Support",
    desc: "Continuous improvement.",
    icon: <FaLifeRing color="#4573df" size={36} title="Ongoing Support" />
  }
];

const faqs = [
  { q: "Can you migrate from on-prem to cloud?", a: "Yes, we specialize in seamless migration from on-premises to cloud infrastructure with minimal disruption." },
  { q: "What DevOps tools do you use?", a: "We use industry-leading tools including AWS, Azure, Docker, Kubernetes, Terraform, GitHub Actions, and Jenkins." },
  { q: "How do you ensure uptime and security?", a: "We implement robust monitoring, automated failover, and industry best practices for security and compliance." },
  { q: "Do you offer managed services?", a: "Yes, we provide ongoing management and optimization." }
];

// Features/deliverables with icons
const features = [
  { icon: <FaCloud color="#4573df" size={36} title="Cloud Migration" />, label: "Cloud Migration" },
  { icon: <FaCodeBranch color="#4573df" size={36} title="CI/CD Automation" />, label: "CI/CD Automation" },
  { icon: <FaCogs color="#4573df" size={36} title="Infrastructure as Code" />, label: "Infrastructure as Code" },
  { icon: <FaShieldAlt color="#4573df" size={36} title="Security & Compliance" />, label: "Security & Compliance" },
  { icon: <FaChartLine color="#4573df" size={36} title="Monitoring & Optimization" />, label: "Monitoring & Optimization" },
];

const testimonial = {
  quote: "Megicode's DevOps team migrated us to the cloud and automated our deployments, saving us time and money.",
  name: "Liam T.",
  company: "SaaS Platform"
};

export default function CloudDevOpsPage() {
  const { theme } = useTheme();
  const themeStyles = useMemo(() => (theme === 'dark' ? darkStyles : lightStyles), [theme]);
  const isDark = theme === 'dark';
  const palette = {
    cardInnerBorder: isDark ? 'rgba(78, 168, 255, 0.2)' : 'rgba(78, 168, 255, 0.1)'
  };
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
        aria-label="Cloud & DevOps Service Detail"
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '88px 24px 64px'
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
                  aria-label="Get Started with Cloud & DevOps Services"
                  onClick={openCalendly}
                >
                  Get Started
                  <span className={commonStyles.ctaBtnArrow} aria-hidden="true">→</span>
                </button>
              </div>
            </div>
            <div className={commonStyles.heroImageBlock} aria-hidden="true">
              <div className={commonStyles.heroImageCard} data-animate="float">
                {/* Analytics Lottie — live metrics, monitoring, dashboards in DevOps */}
                <LottiePlayer
                  src="/lottie/cloud-devops.json"
                  loop
                  style={{ width: '100%', height: '100%', minWidth: '180px', minHeight: '180px' }}
                  ariaLabel="Animated cloud infrastructure illustration for DevOps services"
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
            <p className={`${commonStyles.overviewDesc} ${themeStyles.overviewDesc}`}>We architect and manage cloud infrastructure on AWS, Azure, and GCP while implementing CI/CD pipelines, infrastructure as code, and automated monitoring. Our DevOps practices enable faster releases, reduced downtime, and lower operational costs for teams of any size.</p>
          </div>
          <div className={commonStyles.overviewImageBlock}>
            <img
              src="/meta/rm.svg"
              alt="Cloud & DevOps Overview"
              className={`${commonStyles.overviewImage} ${themeStyles.overviewImage}`}
              data-animate="fade-in"
              style={{ width: 180, maxWidth: '100%', borderRadius: 32, boxShadow: '0 8px 32px #4573df33', background: isDark ? 'rgba(36,41,54,0.98)' : '#fff', padding: 18, border: `2px solid ${palette.cardInnerBorder}` }}
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
              <span data-animate="countup" data-value="60">60%</span>
              <div className={`${commonStyles.whyStatDesc} ${themeStyles.whyStatDesc}`}>faster deployment with cloud DevOps</div>
            </div>
            <div className={`${commonStyles.whyStatCard} ${themeStyles.whyStatCard}`}>
              <span data-animate="countup" data-value="45">45%</span>
              <div className={`${commonStyles.whyStatDesc} ${themeStyles.whyStatDesc}`}>cost reduction through cloud optimization</div>
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
              const getTechIcon = (tech: string) => {
                switch (tech.toLowerCase()) {
                  case "aws": return { icon: SiAmazon, color: "#FF9900" };
                  case "azure": return { icon: FaCloud, color: "#0089D6" };
                  case "docker": return { icon: SiDocker, color: "#2496ED" };
                  case "kubernetes": return { icon: SiKubernetes, color: "#326CE5" };
                  case "terraform": return { icon: SiTerraform, color: "#623CE4" };
                  case "github actions": return { icon: SiGithubactions, color: "#2088FF" };
                  case "jenkins": return { icon: SiJenkins, color: "#D24939" };
                  case "google cloud": return { icon: SiGooglecloud, color: "#4285F4" };
                  default: return null;
                }
              };

              const techIcon = getTechIcon(t);

              return (
                <span key={i} className={`${commonStyles.techCard} ${themeStyles.techCard}`} data-animate="scale-on-hover">
                  {techIcon ? (
                    <techIcon.icon size={40} style={{ marginRight: 12 }} title={t} color={techIcon.color} />
                  ) : (
                    <img
                      src={`/meta/${t.replace(/\s/g, '')}.png`}
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
            aria-label="Start Your Cloud Project"
          >
            <FaCloud className={commonStyles.ctaBtnIcon} title="Cloud Consultant" />
            Start Your Cloud Project
          </button>
          <div className={`${commonStyles.ctaDesc} ${themeStyles.ctaDesc}`}>Ready to modernize your infrastructure? Let&apos;s talk about your vision.</div>
          <a href="/contact" className={`${commonStyles.ctaDesc} ${themeStyles.ctaDesc}`} style={{ display: 'inline-block', marginTop: 8, textDecoration: 'underline', fontSize: '0.95rem' }}>Or send us a message</a>
          <a href="/projects" className={`${commonStyles.ctaDesc} ${themeStyles.ctaDesc}`} style={{ display: 'inline-block', marginTop: 12, textDecoration: 'underline', fontSize: '0.95rem', opacity: 0.85 }}>See Our Case Studies &rarr;</a>
        </section>
      </main>
      {calendlyModalElement}
      <ServiceSchema service={{ title: service.title!, description: service.description!, slug: 'cloud-devops-services', features: service.features }} />
      <Footer />
    </div>
  );
}
