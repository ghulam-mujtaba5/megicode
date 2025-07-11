
"use client";
import Footer from "../../../components/Footer/Footer";
import styles from "./ai-machine-learning.module.css";

import React from "react";
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
  useInViewAnimation();
  if (!service) return null;
  // Keyframes for animation
  const keyframes = `
    @keyframes floatY { 0% { transform: translateY(0); } 50% { transform: translateY(-18px); } 100% { transform: translateY(0); } }
    @keyframes floatX { 0% { transform: translateX(0); } 50% { transform: translateX(18px); } 100% { transform: translateX(0); } }
    @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(32px); } 100% { opacity: 1; transform: translateY(0); } }
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 #4573df33; } 70% { box-shadow: 0 0 0 18px #4573df11; } 100% { box-shadow: 0 0 0 0 #4573df33; } }
    @keyframes borderGradient {
      0% { border-image-source: linear-gradient(90deg, #4573df, #6ea8ff, #cfe8ef, #4573df); }
      100% { border-image-source: linear-gradient(450deg, #4573df, #6ea8ff, #cfe8ef, #4573df); }
    }
    @keyframes sparkMove {
      0% { transform: translateY(0) scale(1); opacity: 1; }
      50% { transform: translateY(-18px) scale(1.2); opacity: 0.7; }
      100% { transform: translateY(0) scale(1); opacity: 1; }
    }
  `;
  // Color palette for light/dark
  const isDark = theme === 'dark';
  const palette = {
    bgMain: isDark ? 'linear-gradient(120deg, #181c22 70%, #232946 100%)' : 'linear-gradient(120deg, #f7fafd 70%, #eaf6ff 100%)',
    border: isDark ? '#23272f' : '#eaf6ff',
    boxShadow: isDark ? '0 12px 64px #181c2244, 0 1.5px 0 #23272f' : '0 12px 64px #4573df33, 0 1.5px 0 #fff',
    cardBg: isDark ? 'rgba(24,28,34,0.98)' : 'rgba(255,255,255,0.96)',
    cardBgGlass: isDark ? 'rgba(36,41,54,0.88)' : 'rgba(255,255,255,0.92)',
    textMain: isDark ? '#eaf6ff' : '#222b3a',
    textAccent: isDark ? '#6ea8ff' : '#4573df',
    textSubtle: isDark ? '#b0c4d8' : '#3a4a5d',
    heroGradient: isDark ? 'linear-gradient(100deg, #232946 0%, #4573df 60%, #6ea8ff 100%)' : 'linear-gradient(100deg, #4573df 0%, #6ea8ff 60%, #cfe8ef 100%)',
    heroOverlay: isDark ? 'rgba(24,28,34,0.18)' : 'rgba(255,255,255,0.13)',
    divider: isDark ? '#263040' : '#eaf6ff',
    testimonialBg: isDark ? 'linear-gradient(100deg, #232946 60%, #181c22 100%)' : 'linear-gradient(100deg, #e3e6ea 60%, #f7fafd 100%)',
    ctaBg: isDark ? 'linear-gradient(100deg, #232946 0%, #4573df 60%, #6ea8ff 100%)' : 'linear-gradient(100deg, #4573df 0%, #6ea8ff 60%, #cfe8ef 100%)',
    ctaBtn: isDark ? 'rgba(36,41,54,0.98)' : 'rgba(255,255,255,0.96)',
    ctaBtnHover: isDark ? '#232946' : '#eaf6ff',
    ctaBtnText: isDark ? '#6ea8ff' : '#4573df',
    ctaBtnBorder: isDark ? '#263040' : '#fff',
    iconBg: isDark ? '#232946' : '#f7fafd',
    iconBorder: isDark ? '#263040' : '#eaf6ff',
    cardInner: isDark ? 'rgba(36,41,54,0.92)' : 'rgba(255,255,255,0.96)',
    cardInnerBorder: isDark ? '#232946' : '#eaf6ff',
  };
  return (
    <>
      {/* Desktop NavBar (visible on desktop only) */}
      <div className="desktop-navbar-wrapper" style={{ width: '100%', position: 'sticky', top: 0, zIndex: 2100 }}>
        <NavBar />
      </div>
      {/* Mobile NavBar (visible on mobile only) */}
      <div className="mobile-navbar-wrapper" style={{ width: '100%', position: 'sticky', top: 0, zIndex: 2000 }}>
        <NavBarMobile />
      </div>
      {/* CSS moved to external file ai-machine-learning.module.css */}
      <div
        className={`${styles.aiMLBoxSizingAll} ${isDark ? styles.dark : styles.light}`}
      >
        <main
          id="main-content"
          className={styles.mainContent}
          aria-label="AI & Machine Learning Service Detail"
          style={{ paddingTop: '72px' }} // Add this line or adjust as needed
        >
          {/* Soft background shapes for extra depth */}
          <div className={styles.bgShapeLeft} aria-hidden="true" />
          <div className={styles.bgShapeRight} aria-hidden="true" />
          {/* Hero Section - Full-width gradient, Lottie/SVG, CTA */}
          <section
            className={`${styles.heroSection} service-hero-gradient`}
            data-animate="fade-in"
          >
            {/* Glassmorphism overlay */}
            <div className={styles.heroOverlay} />
            {/* Decorative blurred circle */}
            <div
              className={
                isDark
                  ? `${styles.heroBlurCircle} ${styles.heroBlurCircleDark}`
                  : `${styles.heroBlurCircle} ${styles.heroBlurCircleLight}`
              }
              aria-hidden="true"
            />
            <div className={styles.heroContent}>
              <div className={styles.heroTextBlock}>
                <h1 className={styles.heroTitle}>{service.title}</h1>
                <p className={styles.heroDesc} data-animate="typewriter">{service.description}</p>
                <a
                  href="/contact"
                  className={styles.ctaBtn}
                  data-animate="cta-bounce"
                >Get Started</a>
              </div>
              <div className={styles.heroImageBlock}>
                {/* Lottie animation placeholder, fallback to SVG */}
                {/* <Lottie src="/lottie/ai-head.json" ... /> */}
                <div className={styles.heroImageCard}>
                  <img
                    src="/Ai icon.svg"
                    alt="AI Illustration"
                    className={styles.heroImage}
                    data-animate="float"
                  />
                  {/* Animated floating dot */}
                  <div className={styles.heroImageDot} />
                </div>
                {/* Optionally add micro-animated background shapes here */}
              </div>
            </div>
          </section>

          {/* Service Overview - Side-by-side layout */}
          {/* Section divider */}
          <div className={styles.sectionDivider} />
          <section className={styles.overviewSection} data-animate="slide-left">
            <div className={styles.overviewTextBlock}>
              <h2 className={styles.overviewTitle}>Overview</h2>
              <p className={styles.overviewDesc}>{service.description}</p>
            </div>
            <div className={styles.overviewImageBlock}>
              <img src="/ds&ai-icon.svg" alt="AI Service Overview" className={styles.overviewImage} data-animate="fade-in" />
            </div>
          </section>

          {/* Why It Matters - Animated counters, impact */}
          {/* Section divider */}
          <div className={styles.sectionDivider} />
          <section className={styles.whySection} data-animate="fade-in">
            <h2 className={styles.whyTitle}>Why It Matters</h2>
            <div className={styles.whyStatsRow}>
              <div className={styles.whyStatCard}>
                <span data-animate="countup" data-value="78">78%</span>
                <div className={styles.whyStatDesc}>of businesses believe AI will impact their industry (PwC)</div>
              </div>
              <div className={styles.whyStatCard}>
                <span data-animate="countup" data-value="2">2x</span>
                <div className={styles.whyStatDesc}>revenue growth for AI adoption leaders</div>
              </div>
            </div>
          </section>

          {/* Process Stepper - Timeline ready for animation */}
          {/* Section divider */}
          <div className={styles.sectionDivider} />
          <section className={styles.processSection} data-animate="timeline">
            <h2 className={styles.processTitle}>Our Process</h2>
            <div className={styles.processStepsRow}>
              {processSteps.map((step, idx) => (
                <div key={idx} className={styles.processStepCard}>
                  <div className={styles.processStepIcon}>{step.icon}</div>
              <div className={styles.processStepTitle}>{step.title}</div>
              <div className={styles.processStepDesc}>{step.desc}</div>
              {idx < processSteps.length - 1 && (
                <div className={styles.processStepConnector} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features as Cards - Deliverables Grid */}
      {/* Section divider */}
      <div className={styles.sectionDivider} />
      <section className={styles.featuresSection} data-animate="stagger-fade">
        <h2 className={styles.featuresTitle}>What You Get</h2>
        <div className={styles.featuresRow}>
          {features.map((f, i) => (
            <div key={i} className={styles.featureCard} data-animate="fade-in">
              {f.icon}
              {f.label}
            </div>
          ))}
        </div>
      </section>

      {/* Technologies as Logo Cloud */}
      {/* Section divider */}
      <div className={styles.sectionDivider} />
      <section className={styles.techSection} data-animate="logo-cloud">
        <h2 className={styles.techTitle}>Technologies</h2>
        <div className={styles.techRow}>
          {/* Example: Map tech name to react-icon if available, else fallback to image */}
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
                  // Dynamically import to avoid breaking if not present
                  // eslint-disable-next-line @typescript-eslint/no-var-requires
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
              <span key={i} className={styles.techCard} data-animate="scale-on-hover">
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
      <div className={styles.sectionDivider} />
      <section className={styles.howSection} aria-labelledby="how-we-work-title">
        <h2 id="how-we-work-title" className={styles.howTitle}>
          How We Work: Partnership, Process & Delivery
        </h2>
        <div className={styles.howDesc}>
          We operate as your strategic partner—combining robust engagement models, agile execution, and enterprise-grade governance. Our operational workflow ensures risk-managed, transparent, and value-driven AI delivery: on time, on budget, and with full business visibility.
        </div>
        <div className={styles.howGrid}>
          {/* Engagement Models */}
          <div className={styles.howCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <span style={{ fontSize: '2rem' }} aria-label="Engagement Models" role="img">💼</span>
              <span style={{ fontWeight: 800, fontSize: '1.13rem', color: palette.textAccent }}>Engagement Models</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ fontSize: '1.3rem' }} aria-label="Fixed Price" role="img">📊</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: palette.textMain }}>Fixed Price</div>
                <div style={{ color: palette.textSubtle, fontWeight: 600, fontSize: '0.99rem', marginTop: 2 }}>Defined scope, predictable budget, and milestone-based billing. Best for projects with clear requirements and risk management needs.</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ fontSize: '1.3rem' }} aria-label="Dedicated Team" role="img">🤝</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: palette.textMain }}>Dedicated Team</div>
                <div style={{ color: palette.textSubtle, fontWeight: 600, fontSize: '0.99rem', marginTop: 2 }}>Scalable, cross-functional team extension. Direct access to certified Megicode experts, rapid onboarding, and seamless enterprise collaboration.</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ fontSize: '1.3rem' }} aria-label="Time & Material" role="img">⏱️</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: palette.textMain }}>Time & Material</div>
                <div style={{ color: palette.textSubtle, fontWeight: 600, fontSize: '0.99rem', marginTop: 2 }}>Agile, transparent billing for evolving requirements. Ideal for innovation, R&D, and projects with dynamic scope.</div>
              </div>
            </div>
          </div>
          {/* Methodology & Communication */}
          <div className={styles.howCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <span style={{ fontSize: '2rem' }} aria-label="Methodology & Communication" role="img">🧭</span>
              <span style={{ fontWeight: 800, fontSize: '1.13rem', color: palette.textAccent }}>Methodology & Communication</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ fontSize: '1.3rem' }} aria-label="Agile, CMMI L3+" role="img">⚡</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: palette.textMain }}>Agile, CMMI L3+</div>
                <div style={{ color: palette.textSubtle, fontWeight: 600, fontSize: '0.99rem', marginTop: 2 }}>Iterative, sprint-based delivery with continuous improvement. CMMI L3+ for process maturity and global best practices in enterprise AI.</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ fontSize: '1.3rem' }} aria-label="Transparent Updates" role="img">📢</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: palette.textMain }}>Transparent Updates</div>
                <div style={{ color: palette.textSubtle, fontWeight: 600, fontSize: '0.99rem', marginTop: 2 }}>Weekly demos, open communication, and real-time dashboards for full project transparency and stakeholder alignment.</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ fontSize: '1.3rem' }} aria-label="Jira, Figma, GitHub" role="img">🛠️</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: palette.textMain }}>Jira, Figma, GitHub</div>
                <div style={{ color: palette.textSubtle, fontWeight: 600, fontSize: '0.99rem', marginTop: 2 }}>Enterprise-grade tools for project tracking, secure design collaboration, and code quality assurance.</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ fontSize: '1.3rem' }} aria-label="Risk Management & Governance" role="img">🛡️</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: palette.textMain }}>Risk Management & Governance</div>
                <div style={{ color: palette.textSubtle, fontWeight: 600, fontSize: '0.99rem', marginTop: 2 }}>Proactive risk identification, regulatory compliance (GDPR, SOC2), and executive reporting for enterprise assurance.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {/* Section divider */}
      <div className={styles.sectionDivider} />
      <section className={styles.testimonialSection} data-animate="fade-in">
        {/* Animated spark/dot */}
        <div className={styles.testimonialDot} />
        {/* Glassmorphism overlay */}
        <div className={styles.testimonialOverlay} />
        <div className={styles.testimonialQuote}>
          “{testimonial.quote}”
        </div>
        <div className={styles.testimonialAuthor}>{testimonial.name} <span className={styles.testimonialCompany}>| {testimonial.company}</span></div>
      </section>

      {/* FAQs */}
      {/* Section divider */}
      <div className={styles.sectionDivider} />
      <div className={styles.faqSection}>
        <ServiceFAQs faqs={faqs} />
      </div>

      {/* CTA - Full-width colored strip */}
      {/* Section divider */}
      <div className={styles.sectionDivider} />
      <section className={styles.ctaSection} data-animate="cta-strip">
        {/* Glassmorphism overlay */}
        <div className={styles.ctaOverlay} />
        <a href="/contact" className={styles.ctaBtnMain} data-animate="cta-bounce">
          <FaRobot className={styles.ctaBtnIcon} title="AI Consultant" />
          Talk to AI Consultant
        </a>
        <div className={styles.ctaDesc}>Ready to unlock the power of AI? Let’s talk about your vision.</div>
      </section>
        </main>
        <Footer />
      </div>
    </>
  );
}