"use client";
import Footer from "../../../components/Footer/Footer";
import commonStyles from "./mobile-app-common.module.css";
import lightStyles from "./mobile-app-light.module.css";
import darkStyles from "./mobile-app-dark.module.css";
import GmIcon from "../../../components/Icon/sbicon";

import React, { useMemo } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useInViewAnimation } from "../../../hooks/useInViewAnimation";
import servicesData from "../servicesData";
import { OurProcess, EngagementModels, MethodologyAndCommunication, ServiceFAQs } from "../ServiceDetailSections";
import { SiReact, SiFlutter, SiSwift, SiKotlin, SiFirebase, SiApple, SiAndroid } from "react-icons/si";
import { FaMobileAlt, FaCode, FaPaintBrush, FaRocket, FaLifeRing, FaAppStoreIos, FaGooglePlay, FaCogs, FaUserFriends, FaMobile, FaShieldAlt, FaSearch, FaPencilAlt, FaTools, FaCloudUploadAlt, FaChartLine } from "react-icons/fa";

import NavBarMobile from "../../../components/NavBar_Mobile/NavBar-mobile";
import NavBar from "../../../components/NavBar_Desktop_Company/nav-bar-Company";
const service = servicesData.find(s => s.slug === "mobile-app-solutions");

const keyFeatures = [
  { icon: <FaMobileAlt color="#4573df" size={36} title="Cross-Platform Development" />, label: "Cross-Platform Expertise" },
  { icon: <FaRocket color="#4573df" size={36} title="Agile Development" />, label: "Agile & Rapid Delivery" },
  { icon: <FaShieldAlt color="#4573df" size={36} title="App Security" />, label: "Enterprise-Grade Security" },
  { icon: <FaAppStoreIos color="#4573df" size={36} title="App Store Optimization" />, label: "App Store Optimization" },
  { icon: <FaLifeRing color="#4573df" size={36} title="Ongoing Support" />, label: "Ongoing Analytics & Support" }
];

const processSteps = [
  { 
    title: "Discovery & Planning",
    description: "App vision & requirements",
    icon: <FaSearch color="#4573df" size={36} title="Discovery & Planning" />
  },
  {
    title: "UI/UX Design",
    description: "Mobile UI/UX design",
    icon: <FaPencilAlt color="#4573df" size={36} title="UI/UX Design" />
  },
  {
    title: "Development & Testing",
    description: "Build & QA",
    icon: <FaTools color="#4573df" size={36} title="Development" />
  },
  {
    title: "App Store Launch",
    description: "Launch on stores",
    icon: <FaCloudUploadAlt color="#4573df" size={36} title="Deployment" />
  }
];

const techStack = [
  { name: "react native", icon: SiReact, color: "#61DAFB" },
  { name: "flutter", icon: SiFlutter, color: "#02569B" },
  { name: "swift", icon: SiSwift, color: "#FA7343" },
  { name: "kotlin", icon: SiKotlin, color: "#7F52FF" },
  { name: "firebase", icon: SiFirebase, color: "#FFCA28" },
  { name: "ios", icon: SiApple, color: "#000000" },
  { name: "android", icon: SiAndroid, color: "#3DDC84" }
];

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



const faqs = [
  { q: "Do you build both iOS and Android apps?", a: "Yes, we develop native apps for both iOS and Android platforms, as well as cross-platform solutions using frameworks like React Native and Flutter to maximize efficiency and reach." },
  { q: "Can you help with app store submission?", a: "Absolutely! We handle the entire app store submission process for both Apple App Store and Google Play Store, ensuring compliance with guidelines and optimizing for approval." },
  { q: "What about app maintenance?", a: "We provide comprehensive maintenance services including updates, bug fixes, performance optimization, and feature additions to keep your app running smoothly and up-to-date." },
  { q: "How do you ensure app quality?", a: "We implement rigorous QA processes including automated testing, manual testing, performance testing, and security audits throughout development to ensure high-quality, reliable apps." }
];

// Features/deliverables with icons
const features = [
  { icon: <FaCode color="#4573df" size={36} title="Cross-Platform Development" />, label: "Cross-Platform Expertise" },
  { icon: <FaRocket color="#4573df" size={36} title="Agile Development" />, label: "Agile & Rapid Delivery" },
  { icon: <FaShieldAlt color="#4573df" size={36} title="Security" />, label: "Enterprise-Grade Security" },
  { icon: <FaAppStoreIos color="#4573df" size={36} title="App Store" />, label: "App Store Optimization" },
  { icon: <FaChartLine color="#4573df" size={36} title="Analytics" />, label: "Ongoing Analytics & Support" },
];

const testimonial = {
  quote: "Megicode's mobile team delivered a beautiful, high-performance app that our users love. Their expertise in both iOS and Android development was invaluable!",
  name: "Alex R.",
  company: "HealthTech Startup"
};

export default function MobileAppSolutionsPage() {
  const { theme } = useTheme();
  const themeStyles = useMemo(() => (theme === 'dark' ? darkStyles : lightStyles), [theme]);
  useInViewAnimation();
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
                  <a
                    href="/contact"
                    className={commonStyles.ctaBtn}
                    data-animate="cta-bounce"
                    aria-label="Get Started with AI & Machine Learning Services"
                  >
                    Get Started
                    <span className={commonStyles.ctaBtnArrow} aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
              <div className={commonStyles.heroImageBlock} aria-hidden="true">
                <div className={commonStyles.heroImageCard} data-animate="float">
                  <img
                    src="/mobile app icon.svg"
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
            <img src="/mobile app icon.svg" alt="Mobile App Development Overview" className={`${commonStyles.overviewImage} ${themeStyles.overviewImage}`} data-animate="fade-in" />
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
              <div className={`${commonStyles.whyStatDesc} ${themeStyles.whyStatDesc}`}>of consumers prefer mobile apps over websites</div>
            </div>
            <div className={`${commonStyles.whyStatCard} ${themeStyles.whyStatCard}`}>
              <span data-animate="countup" data-value="3">3x</span>
              <div className={`${commonStyles.whyStatDesc} ${themeStyles.whyStatDesc}`}>higher engagement with mobile apps vs web</div>
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
                <div className={`${commonStyles.processStepDesc} ${themeStyles.processStepDesc}`}>{step.description}</div>
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
                case "react native": Icon = SiReact; color = "#61DAFB"; break;
                case "flutter": Icon = SiFlutter; color = "#02569B"; break;
                case "swift": Icon = SiSwift; color = "#FA7343"; break;
                case "kotlin": Icon = SiKotlin; color = "#7F52FF"; break;
                case "firebase": Icon = SiFirebase; color = "#FFCA28"; break;
                case "ios": Icon = SiApple; color = "#000000"; break;
                case "android": Icon = SiAndroid; color = "#3DDC84"; break;
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
          <a href="/contact" className={`${commonStyles.ctaBtnMain} ${themeStyles.ctaBtnMain}`} data-animate="cta-bounce">
            <FaMobileAlt className={commonStyles.ctaBtnIcon} title="Mobile App Expert" />
            Start Your Mobile Project
          </a>
          <div className={`${commonStyles.ctaDesc} ${themeStyles.ctaDesc}`}>Ready to unlock the power of AI? Let's talk about your vision.</div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
