"use client";
import Footer from "../../../components/Footer/Footer";
import commonStyles from "./growth-marketing-seo-common.module.css";
import lightStyles from "./growth-marketing-seo-light.module.css";
import darkStyles from "./growth-marketing-seo-dark.module.css";
import GmIcon from "../../../components/Icon/sbicon";

import React, { useMemo } from "react";
import { useCalendlyModal } from "../../../components/CalendlyModal";
import { useTheme } from "../../../context/ThemeContext";
import { useInViewAnimation } from "../../../hooks/useInViewAnimation";
import servicesData from "../servicesData";
import ServiceSchema from "@/components/SEO/ServiceSchema";
import Breadcrumbs from "@/components/SEO/Breadcrumbs";
import { ServiceFAQs } from "../ServiceDetailSections";
import { FaSearch, FaPenFancy, FaBullhorn, FaChartLine, FaChartBar, FaCrosshairs, FaRocket, FaLifeRing, FaFileAlt, FaSeedling } from "react-icons/fa";
import { SiGoogleanalytics, SiSemrush, SiGoogleads, SiMeta, SiHubspot } from "react-icons/si";

import NavBarMobile from "../../../components/NavBar_Mobile/NavBar-mobile";
import NewNavBar from "../../../components/NavBar_Desktop_Company/NewNavBar";

const service = {
  ...servicesData.find(s => s.slug === "growth-marketing-seo"),
  techs: [
    "Google Analytics",
    "SEMrush",
    "Ahrefs",
    "Google Ads",
    "Meta Ads",
    "HubSpot"
  ]
};

import { RiPriceTag3Fill, RiTeamFill, RiTimeFill } from 'react-icons/ri';
import { BsCheckCircleFill } from 'react-icons/bs';

const engagementModels = [
  {
    title: "Fixed Price",
    icon: <RiPriceTag3Fill size={40} />,
    benefits: [
      "Defined Campaign Scope",
      "Predictable Budget",
      "Milestone-Based Billing"
    ],
    color: "#4FACFE",
    isPopular: false
  },
  {
    title: "Retainer",
    icon: <RiTeamFill size={40} />,
    benefits: [
      "Ongoing Growth Support",
      "Dedicated Marketing Team",
      "Monthly Strategy Reviews"
    ],
    color: "#4573df",
    isPopular: true
  },
  {
    title: "Performance-Based",
    icon: <RiTimeFill size={40} />,
    benefits: [
      "Pay for Results",
      "Data-Driven Optimization",
      "Transparent ROI Tracking"
    ],
    color: "#45B7DF",
    isPopular: false
  }
];

const processSteps = [
  {
    title: "Growth Audit",
    desc: "Analyze your current traffic, funnel, and competitors.",
    icon: <FaSearch color="#4573df" size={36} title="Growth Audit" />
  },
  {
    title: "Strategy & Roadmap",
    desc: "Build a data-driven growth plan with clear KPIs.",
    icon: <FaCrosshairs color="#4573df" size={36} title="Strategy & Roadmap" />
  },
  {
    title: "Content & SEO",
    desc: "Create high-impact content and optimize for search.",
    icon: <FaPenFancy color="#4573df" size={36} title="Content & SEO" />
  },
  {
    title: "Launch Campaigns",
    desc: "Execute paid and organic growth campaigns.",
    icon: <FaRocket color="#4573df" size={36} title="Launch Campaigns" />
  },
  {
    title: "Measure & Optimize",
    desc: "Track results and continuously improve ROI.",
    icon: <FaLifeRing color="#4573df" size={36} title="Measure & Optimize" />
  }
];

const faqs = [
  { q: "How long until we see SEO results?", a: "Technical SEO fixes show impact within 2-4 weeks. Content-driven organic growth typically takes 3-6 months to build momentum, but we set up analytics and paid campaigns for immediate wins while SEO compounds." },
  { q: "Do you run paid ad campaigns?", a: "Yes — we manage Google Ads and Meta Ads campaigns. We handle everything from creative to targeting to bidding optimization, always focused on cost-per-acquisition and ROI." },
  { q: "Can you work with our existing marketing team?", a: "Absolutely. We can supplement your team with specialized SEO, CRO, or paid ads expertise, or run specific campaigns while your team handles other channels." },
  { q: "What industries do you specialize in?", a: "We focus on SaaS, AI-powered products, and tech startups. Our strategies are built for products with digital-first customer acquisition — not traditional retail or local business marketing." }
];

const features = [
  { icon: <FaSearch color="#4573df" size={36} title="Technical SEO" />, label: "Technical SEO & Site Optimization" },
  { icon: <FaPenFancy color="#4573df" size={36} title="Content Marketing" />, label: "Content Marketing & Thought Leadership" },
  { icon: <FaBullhorn color="#4573df" size={36} title="Performance Marketing" />, label: "Performance Marketing (Google & Meta)" },
  { icon: <FaChartLine color="#4573df" size={36} title="Conversion Rate Optimization" />, label: "Conversion Rate Optimization (CRO)" },
  { icon: <FaChartBar color="#4573df" size={36} title="Analytics & Dashboards" />, label: "Analytics Setup & Growth Dashboards" },
  { icon: <FaSeedling color="#4573df" size={36} title="Product Launch Strategy" />, label: "Product Launch & Go-to-Market Strategy" },
];

const testimonial = {
  quote: "Megicode didn't just build our product — they helped us get our first 1,000 users. Their SEO and content strategy gave us organic traffic that keeps growing month over month.",
  name: "Sarah K.",
  company: "SaaS Startup Founder"
};

export default function GrowthMarketingSeoPage() {
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
        aria-label="Growth Marketing & SEO Service Detail"
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '88px 24px 64px'
        }}
      >
        {/* Soft background shapes */}
        <div className={commonStyles.bgShapeLeft} aria-hidden="true" />
        <div className={commonStyles.bgShapeRight} aria-hidden="true" />

        {/* Breadcrumbs */}
        <Breadcrumbs theme={theme as 'light' | 'dark'} />

        {/* Hero Section */}
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
                  aria-label="Get Started with Growth Marketing & SEO"
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
                  src="/data visualization icon.svg"
                  alt="Growth Marketing & SEO illustration"
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

        {/* Overview */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <section className={`${commonStyles.overviewSection} ${themeStyles.overviewSection}`} data-animate="slide-left">
          <div className={commonStyles.overviewTextBlock}>
            <h2 className={`${commonStyles.overviewTitle} ${themeStyles.overviewTitle}`}>Overview</h2>
            <p className={`${commonStyles.overviewDesc} ${themeStyles.overviewDesc}`}>Most startups build great products but struggle to get users. We bridge that gap with growth marketing engineered for tech products — combining technical SEO, high-converting content, and data-driven paid campaigns. Every strategy is tied to measurable KPIs: traffic, signups, activation, and revenue.</p>
          </div>
          <div className={commonStyles.overviewImageBlock}>
            <img src="/Big Data Analytics.svg" alt="Growth Marketing Overview" className={`${commonStyles.overviewImage} ${themeStyles.overviewImage}`} data-animate="fade-in" />
          </div>
        </section>

        {/* Why It Matters */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <section className={`${commonStyles.whySection} ${themeStyles.whySection}`} data-animate="fade-in">
          <h2 className={`${commonStyles.whyTitle} ${themeStyles.whyTitle}`}>Why It Matters</h2>
          <div className={commonStyles.whyStatsRow}>
            <div className={`${commonStyles.whyStatCard} ${themeStyles.whyStatCard}`}>
              <span data-animate="countup" data-value="68">68%</span>
              <div className={`${commonStyles.whyStatDesc} ${themeStyles.whyStatDesc}`}>of online experiences begin with a search engine</div>
            </div>
            <div className={`${commonStyles.whyStatCard} ${themeStyles.whyStatCard}`}>
              <span data-animate="countup" data-value="5">5x</span>
              <div className={`${commonStyles.whyStatDesc} ${themeStyles.whyStatDesc}`}>lower customer acquisition cost with organic vs paid channels</div>
            </div>
          </div>
        </section>

        {/* Process */}
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

        {/* Features */}
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

        {/* Technologies */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <section className={`${commonStyles.techSection} ${themeStyles.techSection}`} data-animate="logo-cloud">
          <h2 className={`${commonStyles.techTitle} ${themeStyles.techTitle}`}>Tools We Use</h2>
          <div className={commonStyles.techRow}>
            {service.techs.map((t, i) => {
              const techLogos: Record<string, React.ReactNode> = {
                "Google Analytics": <SiGoogleanalytics color="#E37400" size={32} title="Google Analytics" />,
                "SEMrush": <SiSemrush color="#FF642D" size={32} title="SEMrush" />,
                "Ahrefs": <FaSearch color="#FF8C00" size={32} title="Ahrefs" />,
                "Google Ads": <SiGoogleads color="#4285F4" size={32} title="Google Ads" />,
                "Meta Ads": <SiMeta color="#0081FB" size={32} title="Meta Ads" />,
                "HubSpot": <SiHubspot color="#FF7A59" size={32} title="HubSpot" />
              };
              const IconComponent = techLogos[t];
              return (
                <span key={i} className={`${commonStyles.techCard} ${themeStyles.techCard}`} data-animate="scale-on-hover">
                  {IconComponent}
                  {t}
                </span>
              );
            })}
          </div>
        </section>

        {/* How We Work */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <section className={`${commonStyles.howSection} ${themeStyles.howSection}`} aria-labelledby="how-we-work-title">
          <h2 id="how-we-work-title" className={`${commonStyles.howTitle} ${themeStyles.howTitle}`}>
            How We Work
          </h2>
          <div className={`${commonStyles.howDesc} ${themeStyles.howDesc}`}>
            Choose your ideal engagement model for maximum growth and ROI.
          </div>
          <div className={commonStyles.howGrid}>
            {engagementModels.map((model) => (
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
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <section className={`${commonStyles.testimonialSection} ${themeStyles.testimonialSection}`} data-animate="fade-in">
          <div className={commonStyles.testimonialDot} />
          <div className={`${commonStyles.testimonialOverlay} ${themeStyles.testimonialOverlay}`} />
          <div className={`${commonStyles.testimonialQuote} ${themeStyles.testimonialQuote}`}>
            &ldquo;{testimonial.quote}&rdquo;
          </div>
          <div className={`${commonStyles.testimonialAuthor} ${themeStyles.testimonialAuthor}`}>
            {testimonial.name} <span className={`${commonStyles.testimonialCompany} ${themeStyles.testimonialCompany}`}>| {testimonial.company}</span>
          </div>
        </section>

        {/* FAQs */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <div className={commonStyles.faqSection}>
          <ServiceFAQs faqs={faqs} theme={theme} />
        </div>

        {/* CTA */}
        <div className={`${commonStyles.sectionDivider} ${themeStyles.sectionDivider}`} />
        <section className={`${commonStyles.ctaSection} ${themeStyles.ctaSection}`} data-animate="cta-strip">
          <div className={`${commonStyles.ctaOverlay} ${themeStyles.ctaOverlay}`} />
          <button
            type="button"
            className={`${commonStyles.ctaBtnMain} ${themeStyles.ctaBtnMain}`}
            data-animate="cta-bounce"
            onClick={openCalendly}
            aria-label="Start Your Growth Marketing Project"
          >
            <FaRocket className={commonStyles.ctaBtnIcon} title="Growth Marketing" />
            Start Growing Your Startup
          </button>
          <div className={`${commonStyles.ctaDesc} ${themeStyles.ctaDesc}`}>Ready to turn traffic into paying users? Let&apos;s build your growth engine.</div>
          <a href="/contact" className={`${commonStyles.ctaDesc} ${themeStyles.ctaDesc}`} style={{ display: 'inline-block', marginTop: 8, textDecoration: 'underline', fontSize: '0.95rem' }}>Or send us a message</a>
          <a href="/projects" className={`${commonStyles.ctaDesc} ${themeStyles.ctaDesc}`} style={{ display: 'inline-block', marginTop: 12, textDecoration: 'underline', fontSize: '0.95rem', opacity: 0.85 }}>See Our Case Studies &rarr;</a>
        </section>
      </main>
      {calendlyModalElement}
      <ServiceSchema service={{ title: service.title!, description: service.description!, slug: 'growth-marketing-seo', features: service.features }} />
      <Footer />
    </div>
  );
}
