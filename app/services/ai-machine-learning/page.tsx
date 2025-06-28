
"use client";

import React from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useInViewAnimation } from "../../../hooks/useInViewAnimation";
import servicesData from "../servicesData";
import { OurProcess, EngagementModels, MethodologyAndCommunication, ServiceFAQs } from "../ServiceDetailSections";
import { SiPython, SiTensorflow, SiPytorch, SiScikitlearn, SiAmazon, SiGooglecloud } from "react-icons/si";
import { FaRobot, FaLanguage, FaEye, FaCogs } from "react-icons/fa";


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
  { title: "Discovery & Consultation", desc: "Business goals & AI opportunities.", icon: "/IconSystem/requirements.svg" },
  { title: "Data Preparation", desc: "Data collection & cleaning.", icon: "/IconSystem/data.svg" },
  { title: "Model Development", desc: "Custom AI/ML model design.", icon: "/IconSystem/development.svg" },
  { title: "Integration & Deployment", desc: "Workflow integration & launch.", icon: "/IconSystem/deploy.svg" },
  { title: "Monitoring & Support", desc: "Ongoing tuning & support.", icon: "/IconSystem/support.svg" }
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
      <style>{`
        ${keyframes}
        .skip-to-content {
          position: absolute;
          left: -999px;
          top: auto;
          width: 1px;
          height: 1px;
          overflow: hidden;
          z-index: 9999;
          background: #fff;
          color: #222b3a;
          font-weight: bold;
          border-radius: 8px;
          padding: 8px 18px;
          transition: left 0.2s;
        }
        .skip-to-content:focus {
          left: 16px;
          top: 16px;
          width: auto;
          height: auto;
          outline: 3px solid #4573df;
        }
        .engagement-method-section {
          display: flex;
          flex-wrap: wrap;
          gap: 56px;
          margin: 3.2rem 0;
          animation: fadeInUp 1.7s cubic-bezier(.23,1.01,.32,1) both;
          align-items: stretch;
        }
        @media (max-width: 900px) {
          .engagement-method-section {
            flex-direction: column;
            gap: 32px;
          }
        }
        .engagement-method-card:focus-within, .engagement-method-card:focus {
          outline: 3px solid #4573df;
          outline-offset: 2px;
        }
        .engagement-method-icon[aria-label] {
          outline: none;
        }
        .engagement-method-icon:focus {
          outline: 2px solid #4573df;
        }
        .cta-btn:active {
          transform: scale(0.97);
          box-shadow: 0 2px 8px #4573df44;
        }
      `}</style>
      <a href="#main-content" className="skip-to-content">Skip to main content</a>
      <div style={{ background: palette.bgMain, overflowX: 'hidden', position: 'relative', minHeight: '100vh', colorScheme: isDark ? 'dark' : 'light', transition: 'background 0.4s, color 0.3s' }}>
        <main id="main-content"
          style={{
            maxWidth: 1160,
            margin: '2.5rem auto',
            padding: '0 1.2rem 5rem 1.2rem',
            fontFamily: 'Inter, sans-serif',
            background: 'linear-gradient(120deg, rgba(36,41,54,0.98) 60%, rgba(70,115,223,0.10) 100%)',
            borderRadius: 36,
            boxShadow: palette.boxShadow,
            position: 'relative',
            overflow: 'hidden',
            border: `1.5px solid ${palette.border}`,
            color: palette.textMain,
            transition: 'background 0.4s, box-shadow 0.3s, border 0.3s',
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
          }}
          aria-label="AI & Machine Learning Service Detail"
        >
        {/* Soft background shapes for extra depth */}
        <div style={{
          position: 'absolute',
          left: -120,
          top: 80,
          width: 320,
          height: 320,
          background: isDark ? 'radial-gradient(circle, #23294655 0%, #181c2200 80%)' : 'radial-gradient(circle, #cfe8ef55 0%, #f7fafd00 80%)',
          filter: 'blur(32px)',
          zIndex: 0,
          pointerEvents: 'none',
          animation: 'floatY 7s ease-in-out infinite',
        }} aria-hidden="true" />
        <div style={{
          position: 'absolute',
          right: -100,
          bottom: 0,
          width: 260,
          height: 260,
          background: isDark ? 'radial-gradient(circle, #4573df33 0%, #23294600 80%)' : 'radial-gradient(circle, #4573df22 0%, #f7fafd00 80%)',
          filter: 'blur(36px)',
          zIndex: 0,
          pointerEvents: 'none',
          animation: 'floatX 9s ease-in-out infinite',
        }} aria-hidden="true" />
        {/* Scroll to top button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 100,
            background: palette.ctaBtn,
            color: palette.ctaBtnText,
            border: `2px solid ${palette.ctaBtnBorder}`,
            borderRadius: '50%',
            width: 48,
            height: 48,
            boxShadow: isDark ? '0 4px 16px #23294688' : '0 4px 16px #4573df33',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
            outline: 'none',
          }}
          aria-label="Scroll to top"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          ↑
        </button>
      {/* Hero Section - Full-width gradient, Lottie/SVG, CTA */}
      <section
        className="service-hero-gradient"
        style={{
          width: '100%',
          background: palette.heroGradient,
          borderRadius: '0 0 3.5rem 3.5rem',
          padding: '5.2rem 3.2rem 4.2rem 3.2rem',
          marginBottom: 64,
          boxShadow: isDark ? '0 12px 48px #23294666' : '0 12px 48px #4573df33',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 390,
          zIndex: 1,
          animation: 'fadeInUp 1.1s cubic-bezier(.23,1.01,.32,1) both',
        }}
        data-animate="fade-in"
      >
        {/* Glassmorphism overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: palette.heroOverlay,
          backdropFilter: 'blur(8px)',
          borderRadius: '0 0 3.5rem 3.5rem',
          zIndex: 2,
          pointerEvents: 'none',
          boxShadow: isDark ? '0 0 0 2.5px #263040' : '0 0 0 2.5px #eaf6ff55',
        }} />
        {/* Decorative blurred circle */}
        <div style={{
          position: 'absolute',
          right: -80,
          top: 40,
          width: 220,
          height: 220,
          background: isDark ? 'radial-gradient(circle, #232946 0%, #4573df33 80%)' : 'radial-gradient(circle, #eaf6ff 0%, #4573df11 80%)',
          filter: 'blur(18px)',
          zIndex: 1,
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 64, flexWrap: 'wrap', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 3 }}>
          <div style={{ flex: 1, minWidth: 320 }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: isDark ? '#eaf6ff' : '#fff', marginBottom: 24, letterSpacing: -2.5, textShadow: isDark ? '0 6px 32px #23294699, 0 1px 0 #23294644' : '0 6px 32px #4573df66, 0 1px 0 #fff2', lineHeight: 1.08 }}>{service.title}</h1>
            <p style={{ fontSize: '1.36rem', color: isDark ? '#b0c4d8' : '#eaf6ff', marginBottom: 36, fontWeight: 600, lineHeight: 1.75, textShadow: isDark ? '0 3px 16px #23294644' : '0 3px 16px #4573df33', letterSpacing: 0.01 }} data-animate="typewriter">{service.description}</p>
            <a
              href="/contact"
              style={{
                background: palette.ctaBtn,
                color: palette.ctaBtnText,
                fontWeight: 900,
                fontSize: '1.28rem',
                borderRadius: 22,
                padding: '1.25rem 3.3rem',
                textDecoration: 'none',
                boxShadow: isDark ? '0 6px 32px #23294644, 0 0 0 2.5px #263040' : '0 6px 32px #4573df33, 0 0 0 2.5px #eaf6ff',
                transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
                display: 'inline-block',
                marginTop: 24,
                border: `2.5px solid ${palette.ctaBtnBorder}`,
                letterSpacing: 0.32,
                backdropFilter: 'blur(2.5px)',
                cursor: 'pointer',
                filter: isDark ? 'drop-shadow(0 2px 12px #23294644)' : 'drop-shadow(0 2px 12px #4573df33)',
              }}
              data-animate="cta-bounce"
              onMouseOver={e => {
                e.currentTarget.style.background = palette.ctaBtnHover;
                e.currentTarget.style.transform = 'scale(1.045)';
                e.currentTarget.style.boxShadow = isDark ? '0 12px 48px #23294666, 0 0 0 2.5px #263040' : '0 12px 48px #4573df44, 0 0 0 2.5px #eaf6ff';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = palette.ctaBtn;
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = isDark ? '0 6px 32px #23294644, 0 0 0 2.5px #263040' : '0 6px 32px #4573df33, 0 0 0 2.5px #eaf6ff';
              }}
            >Get Started</a>
          </div>
          <div style={{ flex: 1, minWidth: 260, textAlign: 'center', position: 'relative' }}>
            {/* Lottie animation placeholder, fallback to SVG */}
            {/* <Lottie src="/lottie/ai-head.json" ... /> */}
            <div style={{
              display: 'inline-block',
              background: isDark ? 'rgba(36,41,54,0.22)' : 'rgba(255,255,255,0.22)',
              borderRadius: 40,
              boxShadow: '0 8px 32px #4573df33',
              padding: 22,
              border: `2.5px solid ${palette.cardInnerBorder}`,
              backdropFilter: 'blur(2.5px)',
              transition: 'box-shadow 0.2s',
              position: 'relative',
              animation: 'pulse 2.8s infinite',
            }}>
              <img
                src="/Ai icon.svg"
                alt="AI Illustration"
                style={{ width: 220, maxWidth: '100%', borderRadius: 32, boxShadow: '0 8px 32px #4573df33', background: isDark ? 'rgba(36,41,54,0.98)' : '#fff', padding: 18, border: `2px solid ${palette.cardInnerBorder}` }}
                data-animate="float"
              />
              {/* Animated floating dot */}
              <div style={{
                position: 'absolute',
                right: 18,
                top: 18,
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #6ea8ff 0%, #4573df 80%)',
                boxShadow: '0 0 16px #6ea8ff99',
                opacity: 0.7,
                animation: 'floatY 2.5s ease-in-out infinite',
                zIndex: 2,
              }} />
            </div>
            {/* Optionally add micro-animated background shapes here */}
          </div>
        </div>
      </section>

      {/* Service Overview - Side-by-side layout */}
      {/* Section divider */}
      <div style={{ width: '100%', height: 0, borderTop: '1.5px solid #eaf6ff', margin: '0 0 2.2rem 0', opacity: 0.7 }} />
      <section style={{
        display: 'flex',
        gap: 56,
        alignItems: 'center',
        flexWrap: 'wrap',
        margin: '3.2rem 0',
        background: palette.cardBg,
        borderRadius: 26,
        boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4573df11',
        padding: '3rem 2.5rem',
        border: `1.5px solid ${palette.border}`,
        backdropFilter: 'blur(2.5px)',
        animation: 'fadeInUp 1.2s cubic-bezier(.23,1.01,.32,1) both',
      }} data-animate="slide-left">
        <div style={{ flex: 1, minWidth: 260 }}>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: palette.textAccent, marginBottom: 20, letterSpacing: 0.13, textShadow: isDark ? '0 2px 8px #23294633' : '0 2px 8px #4573df11', lineHeight: 1.1 }}>Overview</h2>
          <p style={{ fontSize: '1.22rem', color: palette.textMain, marginBottom: 14, lineHeight: 1.8, fontWeight: 600 }}>{service.description}</p>
        </div>
        <div style={{ flex: 1, minWidth: 180, textAlign: 'center' }}>
          <img src="/ds&ai-icon.svg" alt="AI Service Overview" style={{ width: 160, maxWidth: '100%', borderRadius: 18, boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4573df22', background: palette.iconBg, padding: 18, border: `1.5px solid ${palette.iconBorder}` }} data-animate="fade-in" />
        </div>
      </section>

      {/* Why It Matters - Animated counters, impact */}
      {/* Section divider */}
      <div style={{ width: '100%', height: 0, borderTop: '1.5px solid #eaf6ff', margin: '0 0 2.2rem 0', opacity: 0.7 }} />
      <section style={{ margin: '3.2rem 0', animation: 'fadeInUp 1.3s cubic-bezier(.23,1.01,.32,1) both', color: palette.textMain }} data-animate="fade-in">
        <h2 style={{ fontSize: '1.38rem', fontWeight: 900, color: palette.textAccent, marginBottom: 26, letterSpacing: 0.14, textShadow: isDark ? '0 2px 8px #23294633' : '0 2px 8px #4573df11', lineHeight: 1.1 }}>Why It Matters</h2>
        <div style={{ display: 'flex', gap: 56, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 240, background: isDark ? 'linear-gradient(90deg, #232946 60%, #181c22 100%)' : 'linear-gradient(90deg, #e3e6ea 60%, #f7fafd 100%)', borderRadius: 26, padding: '2rem 2rem', textAlign: 'center', fontWeight: 900, color: palette.textAccent, fontSize: '2.4rem', marginBottom: 14, boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4573df11', border: `1.5px solid ${palette.border}`, transition: 'box-shadow 0.2s, transform 0.15s', backdropFilter: 'blur(2px)', filter: isDark ? 'drop-shadow(0 2px 12px #23294633)' : 'drop-shadow(0 2px 12px #4573df11)' }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.035)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span data-animate="countup" data-value="78">78%</span>
            <div style={{ fontSize: '1.18rem', color: palette.textMain, fontWeight: 800, marginTop: 12 }}>of businesses believe AI will impact their industry (PwC)</div>
          </div>
          <div style={{ flex: 1, minWidth: 240, background: isDark ? 'linear-gradient(90deg, #232946 60%, #181c22 100%)' : 'linear-gradient(90deg, #e3e6ea 60%, #f7fafd 100%)', borderRadius: 26, padding: '2rem 2rem', textAlign: 'center', fontWeight: 900, color: palette.textAccent, fontSize: '2.4rem', marginBottom: 14, boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4573df11', border: `1.5px solid ${palette.border}`, transition: 'box-shadow 0.2s, transform 0.15s', backdropFilter: 'blur(2px)', filter: isDark ? 'drop-shadow(0 2px 12px #23294633)' : 'drop-shadow(0 2px 12px #4573df11)' }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.035)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span data-animate="countup" data-value="2">2x</span>
            <div style={{ fontSize: '1.18rem', color: palette.textMain, fontWeight: 800, marginTop: 12 }}>revenue growth for AI adoption leaders</div>
          </div>
        </div>
      </section>

      {/* Process Stepper - Timeline ready for animation */}
      {/* Section divider */}
      <div style={{ width: '100%', height: 0, borderTop: '1.5px solid #eaf6ff', margin: '0 0 2.2rem 0', opacity: 0.7 }} />
      <section style={{
        margin: '3.2rem 0',
        background: palette.cardBg,
        borderRadius: 26,
        boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4573df11',
        padding: '3rem 2.5rem',
        border: `1.5px solid ${palette.border}`,
        backdropFilter: 'blur(2.5px)',
        animation: 'fadeInUp 1.4s cubic-bezier(.23,1.01,.32,1) both',
      }} data-animate="timeline">
        <OurProcess steps={processSteps} />
      </section>

      {/* Features as Cards - Deliverables Grid */}
      {/* Section divider */}
      <div style={{ width: '100%', height: 0, borderTop: '1.5px solid #eaf6ff', margin: '0 0 2.2rem 0', opacity: 0.7 }} />
      <section style={{ margin: '3.2rem 0', animation: 'fadeInUp 1.5s cubic-bezier(.23,1.01,.32,1) both' }} data-animate="stagger-fade">
        <h2 style={{ fontSize: '1.38rem', fontWeight: 900, color: '#4573df', marginBottom: 26, letterSpacing: 0.14, textShadow: '0 2px 8px #4573df11', lineHeight: 1.1 }}>What You Get</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
          {features.map((f, i) => (
            <div key={i} className="deliverable-card" style={{
              background: palette.cardBgGlass,
              borderRadius: 22,
              padding: '1.7rem 1.8rem',
              minWidth: 240,
              flex: 1,
              fontWeight: 900,
              color: palette.textMain,
              boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4573df11',
              fontSize: '1.16rem',
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              border: `1.5px solid ${palette.border}`,
              transition: 'box-shadow 0.2s, transform 0.15s',
              backdropFilter: 'blur(2px)',
              cursor: 'pointer',
              filter: isDark ? 'drop-shadow(0 2px 12px #23294633)' : 'drop-shadow(0 2px 12px #4573df11)',
            }}
              onMouseOver={e => e.currentTarget.style.boxShadow = isDark ? '0 16px 48px #23294644' : '0 16px 48px #4573df22'}
              onMouseOut={e => e.currentTarget.style.boxShadow = isDark ? '0 8px 32px #23294633' : '0 8px 32px #4573df11'}
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
      <div style={{ width: '100%', height: 0, borderTop: '1.5px solid #eaf6ff', margin: '0 0 2.2rem 0', opacity: 0.7 }} />
      <section style={{
        margin: '3.2rem 0',
        background: palette.cardBg,
        borderRadius: 26,
        boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4573df11',
        padding: '3rem 2.5rem',
        border: `1.5px solid ${palette.border}`,
        backdropFilter: 'blur(2.5px)',
        animation: 'fadeInUp 1.6s cubic-bezier(.23,1.01,.32,1) both',
      }} data-animate="logo-cloud">
        <h2 style={{ fontSize: '1.28rem', fontWeight: 900, color: '#4573df', marginBottom: 26, letterSpacing: 0.14, textShadow: '0 2px 8px #4573df11', lineHeight: 1.1 }}>Technologies</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center' }}>
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
              <span key={i} className="tech-logo-card" style={{
                background: palette.cardBgGlass,
                borderRadius: 14,
                padding: '0.7rem 1.7rem',
                fontWeight: 900,
                fontSize: '1.16rem',
                letterSpacing: 0.24,
                boxShadow: isDark ? '0 4px 18px #23294633' : '0 4px 18px #4573df11',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                border: `1.5px solid ${palette.border}`,
                transition: 'box-shadow 0.2s, transform 0.15s',
                backdropFilter: 'blur(2px)',
                cursor: 'pointer',
                filter: isDark ? 'drop-shadow(0 2px 12px #23294633)' : 'drop-shadow(0 2px 12px #4573df11)',
              }}
                onMouseOver={e => e.currentTarget.style.boxShadow = isDark ? '0 16px 48px #23294644' : '0 16px 48px #4573df22'}
                onMouseOut={e => e.currentTarget.style.boxShadow = isDark ? '0 4px 18px #23294633' : '0 4px 18px #4573df11'}
                data-animate="scale-on-hover"
              >
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
      <div style={{ width: '100%', height: 0, borderTop: '1.5px solid #eaf6ff', margin: '0 0 2.2rem 0', opacity: 0.7 }} />
      <section
        style={{
          margin: '3.2rem 0',
          background: isDark ? 'linear-gradient(100deg, #232946 60%, #181c22 100%)' : 'linear-gradient(100deg, #e3e6ea 60%, #f7fafd 100%)',
          borderRadius: 32,
          boxShadow: isDark ? '0 12px 48px #23294633' : '0 12px 48px #4573df11',
          padding: '3.2rem 2.8rem',
          border: `2px solid ${palette.border}`,
          position: 'relative',
          overflow: 'hidden',
          animation: 'fadeInUp 1.8s cubic-bezier(.23,1.01,.32,1) both',
          color: palette.textMain,
        }}
        aria-labelledby="how-we-work-title"
      >
        <h2 id="how-we-work-title" style={{ fontSize: '1.55rem', fontWeight: 900, color: palette.textAccent, marginBottom: 18, letterSpacing: 0.13, textShadow: isDark ? '0 2px 8px #23294633' : '0 2px 8px #4573df11', lineHeight: 1.1, textAlign: 'center' }}>
          How We Work: Partnership, Process & Delivery
        </h2>
        <div style={{ maxWidth: 900, margin: '0 auto', marginBottom: 32, color: palette.textSubtle, fontWeight: 600, fontSize: '1.13rem', textAlign: 'center' }}>
          We operate as your strategic partner—combining robust engagement models, agile execution, and enterprise-grade governance. Our operational workflow ensures risk-managed, transparent, and value-driven AI delivery: on time, on budget, and with full business visibility.
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 36,
          alignItems: 'stretch',
          margin: '0 auto',
          maxWidth: 980,
        }}>
          {/* Engagement Models */}
          <div style={{
            background: palette.cardBgGlass,
            borderRadius: 22,
            padding: '2.1rem 1.7rem',
            boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4573df11',
            border: `1.5px solid ${palette.cardInnerBorder}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            minHeight: 240,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            position: 'relative',
          }}>
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
          <div style={{
            background: palette.cardBgGlass,
            borderRadius: 22,
            padding: '2.1rem 1.7rem',
            boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4573df11',
            border: `1.5px solid ${palette.cardInnerBorder}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            minHeight: 260,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            position: 'relative',
          }}>
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
      <div style={{ width: '100%', height: 0, borderTop: '1.5px solid #eaf6ff', margin: '0 0 2.2rem 0', opacity: 0.7 }} />
      <section style={{
        margin: '3.2rem 0',
        background: palette.testimonialBg,
        borderRadius: 32,
        padding: '3.2rem 2.8rem',
        boxShadow: isDark ? '0 12px 48px #23294633' : '0 12px 48px #4573df11',
        textAlign: 'center',
        border: `2.5px solid ${palette.border}`,
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeInUp 1.8s cubic-bezier(.23,1.01,.32,1) both',
        color: palette.textMain,
      }} data-animate="fade-in">
        {/* Animated spark/dot */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 18,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #6ea8ff 0%, #4573df 80%)',
          boxShadow: '0 0 16px #6ea8ff99',
          opacity: 0.7,
          animation: 'sparkMove 2.2s ease-in-out infinite',
          zIndex: 3,
          transform: 'translateX(-50%)',
        }} />
        {/* Glassmorphism overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: isDark ? 'rgba(36,41,54,0.13)' : 'rgba(255,255,255,0.13)',
          backdropFilter: 'blur(4px)',
          borderRadius: 28,
          zIndex: 1,
          pointerEvents: 'none',
        }} />
        <div style={{ fontSize: '1.38rem', fontWeight: 900, color: palette.textMain, marginBottom: 22, fontStyle: 'italic', letterSpacing: 0.14, textShadow: isDark ? '0 3px 16px #23294644' : '0 3px 16px #4573df22', position: 'relative', zIndex: 2, lineHeight: 1.3 }}>
          “{testimonial.quote}”
        </div>
        <div style={{ color: palette.textAccent, fontWeight: 900, fontSize: '1.18rem', letterSpacing: 0.14, position: 'relative', zIndex: 2 }}>{testimonial.name} <span style={{ color: palette.textMain, fontWeight: 800 }}>| {testimonial.company}</span></div>
      </section>

      {/* FAQs */}
      {/* Section divider */}
      <div style={{ width: '100%', height: 0, borderTop: '1.5px solid #eaf6ff', margin: '0 0 2.2rem 0', opacity: 0.7 }} />
      <div style={{
        margin: '3.2rem 0',
        background: palette.cardBg,
        borderRadius: 26,
        boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4573df11',
        padding: '3rem 2.5rem',
        border: `1.5px solid ${palette.border}`,
        backdropFilter: 'blur(2.5px)',
        animation: 'fadeInUp 1.9s cubic-bezier(.23,1.01,.32,1) both',
        color: palette.textMain,
      }}>
        <ServiceFAQs faqs={faqs} />
      </div>

      {/* CTA - Full-width colored strip */}
      {/* Section divider */}
      <div style={{ width: '100%', height: 0, borderTop: '1.5px solid #eaf6ff', margin: '0 0 2.2rem 0', opacity: 0.7 }} />
      <section style={{
        margin: '4.2rem 0 0 0',
        textAlign: 'center',
        background: palette.ctaBg,
        borderRadius: 32,
        padding: '3.5rem 2.8rem',
        boxShadow: isDark ? '0 12px 48px #23294633' : '0 12px 48px #4573df22',
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeInUp 2s cubic-bezier(.23,1.01,.32,1) both',
      }} data-animate="cta-strip">
        {/* Glassmorphism overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(4px)',
          borderRadius: 28,
          zIndex: 1,
          pointerEvents: 'none',
        }} />
        <a href="/contact" style={{
          background: palette.ctaBtn,
          color: palette.ctaBtnText,
          fontWeight: 900,
          fontSize: '1.28rem',
          borderRadius: 22,
          padding: '1.25rem 3.3rem',
          textDecoration: 'none',
          boxShadow: isDark ? '0 8px 32px #23294644' : '0 8px 32px #4573df33',
          display: 'inline-block',
          border: `2.5px solid ${palette.ctaBtnBorder}`,
          letterSpacing: 0.32,
          backdropFilter: 'blur(2.5px)',
          cursor: 'pointer',
          position: 'relative',
          zIndex: 2,
          filter: isDark ? 'drop-shadow(0 2px 12px #23294644)' : 'drop-shadow(0 2px 12px #4573df33)',
          borderImage: 'linear-gradient(90deg, #4573df, #6ea8ff, #cfe8ef, #4573df) 1',
          animation: 'borderGradient 4s linear infinite alternate',
          transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
        }} data-animate="cta-bounce"
          onMouseOver={e => {
            e.currentTarget.style.background = palette.ctaBtnHover;
            e.currentTarget.style.transform = 'scale(1.045)';
            e.currentTarget.style.boxShadow = isDark ? '0 16px 56px #23294666' : '0 16px 56px #4573df44';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = palette.ctaBtn;
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = isDark ? '0 8px 32px #23294644' : '0 8px 32px #4573df33';
          }}
        >
          <FaRobot style={{ marginRight: 14, fontSize: '1.5rem', animation: 'pulse 2.2s infinite', verticalAlign: 'middle' }} title="AI Consultant" />
          Talk to AI Consultant
        </a>
        <div style={{ marginTop: 22, color: palette.textMain, fontSize: '1.18rem', fontWeight: 800, textShadow: isDark ? '0 3px 16px #23294644' : '0 3px 16px #4573df22', position: 'relative', zIndex: 2 }}>Ready to unlock the power of AI? Let’s talk about your vision.</div>
      </section>
        </main>
      </div>
    </>
  );
}


