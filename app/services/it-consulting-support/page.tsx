

"use client";
import React from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useInViewAnimation } from "../../../hooks/useInViewAnimation";
import servicesData from "../servicesData";
import { OurProcess, EngagementModels, MethodologyAndCommunication, ServiceFAQs } from "../ServiceDetailSections";
import { FaCogs, FaUserShield, FaRegHandshake, FaRegClock, FaRegCheckCircle, FaMapSigns, FaServer, FaShieldAlt, FaLifeRing, FaBook } from "react-icons/fa";


import { SiJirasoftware, SiGoogle } from "react-icons/si";
import { FaNetworkWired } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";

const service = servicesData.find(s => s.slug === "it-consulting-support");

const processSteps = [
  {
    title: "Assessment & Strategy",
    desc: "IT landscape & strategy.",
    icon: <FaUserShield size={32} color="#4ea8ff" title="Assessment & Strategy" />
  },
  {
    title: "Solution Design",
    desc: "Design solutions.",
    icon: <FaRegHandshake size={32} color="#4ea8ff" title="Solution Design" />
  },
  {
    title: "Implementation",
    desc: "Deploy & configure.",
    icon: <FaCogs size={32} color="#4ea8ff" title="Implementation" />
  },
  {
    title: "Training & Documentation",
    desc: "Train & document.",
    icon: <FaRegCheckCircle size={32} color="#4ea8ff" title="Training & Documentation" />
  },
  {
    title: "Ongoing Support",
    desc: "Monitor & improve.",
    icon: <FaRegClock size={32} color="#4ea8ff" title="Ongoing Support" />
  }
];

const techs = [
  { name: "ITIL", icon: <FaNetworkWired size={36} color="#4ea8ff" title="ITIL" /> },
  { name: "ISO 27001", icon: <MdSecurity size={36} color="#4ea8ff" title="ISO 27001" /> },
  { name: "Microsoft 365", icon: <img src="/IconSystem/microsoft365.svg" alt="Microsoft 365" style={{ width: 36, height: 36, marginRight: 0 }} /> },
  { name: "Google Workspace", icon: <SiGoogle size={36} color="#4ea8ff" title="Google Workspace" /> },
  { name: "Jira", icon: <SiJirasoftware size={36} color="#4ea8ff" title="Jira" /> },
];

const faqs = [
  { q: "Do you provide 24/7 support?", a: "Yes, we offer various support packages including 24/7 coverage." },
  { q: "Can you help with compliance?", a: "Absolutely. We assist with ISO, GDPR, and other compliance needs." },
  { q: "What platforms do you support?", a: "We support Microsoft 365, Google Workspace, and more." },
  { q: "How do you ensure security?", a: "We follow ITIL, ISO 27001, and industry best practices for security." }
];

const testimonial = {
  quote: "Megicode's IT consulting team helped us achieve compliance and secure our infrastructure.",
  name: "David P.",
  company: "Legal Services Firm"
};

export default function ITConsultingSupportDetailPage() {
  const { theme } = useTheme();
  useInViewAnimation();
  if (!service) return null;
  const isDark = theme === 'dark';
  const palette = {
    bgMain: isDark ? 'linear-gradient(120deg, #181c22 70%, #232946 100%)' : 'linear-gradient(120deg, #f7fafd 70%, #eaf6ff 100%)',
    border: isDark ? '#23272f' : '#eaf6ff',
    boxShadow: isDark ? '0 12px 64px #181c2244, 0 1.5px 0 #23272f' : '0 12px 64px #4ea8ff33, 0 1.5px 0 #fff',
    cardBg: isDark ? 'rgba(24,28,34,0.98)' : 'rgba(255,255,255,0.96)',
    cardBgGlass: isDark ? 'rgba(36,41,54,0.88)' : 'rgba(255,255,255,0.92)',
    textMain: isDark ? '#eaf6ff' : '#222b3a',
    textAccent: isDark ? '#6ea8ff' : '#4ea8ff',
    textSubtle: isDark ? '#b0c4d8' : '#3a4a5d',
    heroGradient: isDark ? 'linear-gradient(100deg, #232946 0%, #4ea8ff 60%, #6ea8ff 100%)' : 'linear-gradient(100deg, #4ea8ff 0%, #6ea8ff 60%, #cfe8ef 100%)',
    heroOverlay: isDark ? 'rgba(24,28,34,0.18)' : 'rgba(255,255,255,0.13)',
    divider: isDark ? '#263040' : '#eaf6ff',
    testimonialBg: isDark ? 'linear-gradient(100deg, #232946 60%, #181c22 100%)' : 'linear-gradient(100deg, #e3e6ea 60%, #f7fafd 100%)',
    ctaBg: isDark ? 'linear-gradient(100deg, #232946 0%, #4ea8ff 60%, #6ea8ff 100%)' : 'linear-gradient(100deg, #4ea8ff 0%, #6ea8ff 60%, #cfe8ef 100%)',
    ctaBtn: isDark ? 'rgba(36,41,54,0.98)' : 'rgba(255,255,255,0.96)',
    ctaBtnHover: isDark ? '#232946' : '#eaf6ff',
    ctaBtnText: isDark ? '#6ea8ff' : '#4ea8ff',
    ctaBtnBorder: isDark ? '#263040' : '#fff',
    iconBg: isDark ? '#232946' : '#f7fafd',
    iconBorder: isDark ? '#263040' : '#eaf6ff',
    cardInner: isDark ? 'rgba(36,41,54,0.92)' : 'rgba(255,255,255,0.96)',
    cardInnerBorder: isDark ? '#232946' : '#eaf6ff',
  };
  return (
    <>
      <style>{`
        @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(32px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes borderGradient {
          0% { border-image-source: linear-gradient(90deg, #4ea8ff, #6ea8ff, #cfe8ef, #4ea8ff); }
          100% { border-image-source: linear-gradient(450deg, #4ea8ff, #6ea8ff, #cfe8ef, #4ea8ff); }
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
            background: 'linear-gradient(120deg, rgba(36,41,54,0.98) 60%, rgba(70,168,255,0.10) 100%)',
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
          aria-label="IT Consulting & Support Service Detail"
        >
        {/* Hero Section */}
        <section
          style={{
            width: '100%',
            background: palette.heroGradient,
            borderRadius: '0 0 3.5rem 3.5rem',
            padding: '4.2rem 3.2rem 3.2rem 3.2rem',
            marginBottom: 64,
            boxShadow: isDark ? '0 12px 48px #23294666' : '0 12px 48px #4ea8ff33',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 320,
            zIndex: 1,
            animation: 'fadeInUp 1.1s cubic-bezier(.23,1.01,.32,1) both',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 64, flexWrap: 'wrap', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 3 }}>
            <div style={{ flex: 1, minWidth: 320 }}>
              <h1 style={{ fontSize: '3rem', fontWeight: 900, color: isDark ? '#eaf6ff' : '#fff', marginBottom: 18, letterSpacing: -2, textShadow: isDark ? '0 6px 32px #23294699, 0 1px 0 #23294644' : '0 6px 32px #4ea8ff66, 0 1px 0 #fff2', lineHeight: 1.08 }}>{service.title}</h1>
              <p style={{ fontSize: '1.28rem', color: isDark ? '#b0c4d8' : '#eaf6ff', marginBottom: 28, fontWeight: 600, lineHeight: 1.75, textShadow: isDark ? '0 3px 16px #23294644' : '0 3px 16px #4ea8ff33', letterSpacing: 0.01 }}>{service.description}</p>
              <a
                href="/contact"
                style={{
                  background: palette.ctaBtn,
                  color: palette.ctaBtnText,
                  fontWeight: 900,
                  fontSize: '1.18rem',
                  borderRadius: 22,
                  padding: '1.1rem 2.8rem',
                  textDecoration: 'none',
                  boxShadow: isDark ? '0 6px 32px #23294644, 0 0 0 2.5px #263040' : '0 6px 32px #4ea8ff33, 0 0 0 2.5px #eaf6ff',
                  transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
                  display: 'inline-block',
                  marginTop: 18,
                  border: `2.5px solid ${palette.ctaBtnBorder}`,
                  letterSpacing: 0.32,
                  backdropFilter: 'blur(2.5px)',
                  cursor: 'pointer',
                  filter: isDark ? 'drop-shadow(0 2px 12px #23294644)' : 'drop-shadow(0 2px 12px #4ea8ff33)',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = palette.ctaBtnHover;
                  e.currentTarget.style.transform = 'scale(1.045)';
                  e.currentTarget.style.boxShadow = isDark ? '0 12px 48px #23294666' : '0 12px 48px #4ea8ff44';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = palette.ctaBtn;
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = isDark ? '0 6px 32px #23294644, 0 0 0 2.5px #263040' : '0 6px 32px #4ea8ff33, 0 0 0 2.5px #eaf6ff';
                }}
              >Start Your IT Project</a>
            </div>
            <div style={{ flex: 1, minWidth: 220, textAlign: 'center', position: 'relative' }}>
              <div style={{
                display: 'inline-block',
                background: isDark ? 'rgba(36,41,54,0.22)' : 'rgba(255,255,255,0.22)',
                borderRadius: 40,
                boxShadow: '0 8px 32px #4ea8ff33',
                padding: 22,
                border: `2.5px solid ${palette.cardInnerBorder}`,
                backdropFilter: 'blur(2.5px)',
                transition: 'box-shadow 0.2s',
                position: 'relative',
              }}>
                <img
                  src="/it-consulting-support-icon.svg"
                  alt="IT Consulting Illustration"
                  style={{ width: 180, maxWidth: '100%', borderRadius: 32, boxShadow: '0 8px 32px #4ea8ff33', background: isDark ? 'rgba(36,41,54,0.98)' : '#fff', padding: 18, border: `2px solid ${palette.cardInnerBorder}` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section divider */}
        <div style={{ width: '100%', height: 0, borderTop: '1.5px solid #eaf6ff', margin: '0 0 2.2rem 0', opacity: 0.7 }} />

        {/* Process Stepper */}
        <section style={{
          margin: '3.2rem 0',
          background: palette.cardBg,
          borderRadius: 26,
          boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff11',
          padding: '3rem 2.5rem',
          border: `1.5px solid ${palette.border}`,
          backdropFilter: 'blur(2.5px)',
          animation: 'fadeInUp 1.4s cubic-bezier(.23,1.01,.32,1) both',
        }}>
          <h2 style={{ fontSize: '1.38rem', fontWeight: 900, color: palette.textAccent, marginBottom: 36, letterSpacing: 0.14, textShadow: isDark ? '0 2px 8px #23294633' : '0 2px 8px #4ea8ff11', lineHeight: 1.1, textAlign: 'center' }}>Our Process</h2>
          <OurProcess steps={processSteps} />
        </section>

        {/* Features as Cards */}
        <div style={{ width: '100%', height: 0, borderTop: '1.5px solid #eaf6ff', margin: '0 0 2.2rem 0', opacity: 0.7 }} />
        <section style={{ margin: '3.2rem 0', animation: 'fadeInUp 1.5s cubic-bezier(.23,1.01,.32,1) both' }}>
          <h2 style={{ fontSize: '1.38rem', fontWeight: 900, color: palette.textAccent, marginBottom: 26, letterSpacing: 0.14, textShadow: isDark ? '0 2px 8px #23294633' : '0 2px 8px #4ea8ff11', lineHeight: 1.1 }}>Key Features</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
            {service.features.map((f, i) => {
              // Choose icon based on feature index or text
              const icons = [
                <FaMapSigns color={palette.textAccent} size={32} style={{ marginRight: 14 }} title="Technology Strategy & Roadmapping" />,
                <FaServer color={palette.textAccent} size={32} style={{ marginRight: 14 }} title="IT Infrastructure Consulting" />,
                <FaShieldAlt color={palette.textAccent} size={32} style={{ marginRight: 14 }} title="Security Audits & Compliance" />,
                <FaLifeRing color={palette.textAccent} size={32} style={{ marginRight: 14 }} title="Ongoing Maintenance & Support" />,
                <FaBook color={palette.textAccent} size={32} style={{ marginRight: 14 }} title="Training & Documentation" />
              ];
              return (
                <div key={i} style={{
                  background: palette.cardBgGlass,
                  borderRadius: 22,
                  padding: '1.7rem 1.8rem',
                  minWidth: 240,
                  flex: 1,
                  fontWeight: 900,
                  color: palette.textMain,
                  boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff11',
                  fontSize: '1.16rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 22,
                  border: `1.5px solid ${palette.border}`,
                  transition: 'box-shadow 0.2s, transform 0.15s',
                  backdropFilter: 'blur(2px)',
                  cursor: 'pointer',
                  filter: isDark ? 'drop-shadow(0 2px 12px #23294633)' : 'drop-shadow(0 2px 12px #4ea8ff11)',
                }}
                  onMouseOver={e => e.currentTarget.style.boxShadow = isDark ? '0 16px 48px #23294644' : '0 16px 48px #4ea8ff22'}
                  onMouseOut={e => e.currentTarget.style.boxShadow = isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff11'}
                >
                  {icons[i] || <FaCogs color={palette.textAccent} size={32} style={{ marginRight: 14 }} />}
                  {f}
                </div>
              );
            })}
          </div>
        </section>

        {/* Technologies as Badges */}
        <div style={{ width: '100%', height: 0, borderTop: '1.5px solid #eaf6ff', margin: '0 0 2.2rem 0', opacity: 0.7 }} />
        <section style={{
          margin: '3.2rem 0',
          background: palette.cardBg,
          borderRadius: 26,
          boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff11',
          padding: '3rem 2.5rem',
          border: `1.5px solid ${palette.border}`,
          backdropFilter: 'blur(2.5px)',
          animation: 'fadeInUp 1.6s cubic-bezier(.23,1.01,.32,1) both',
        }}>
          <h2 style={{ fontSize: '1.28rem', fontWeight: 900, color: palette.textAccent, marginBottom: 26, letterSpacing: 0.14, textShadow: isDark ? '0 2px 8px #23294633' : '0 2px 8px #4ea8ff11', lineHeight: 1.1 }}>Technologies</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center' }}>
            {techs.map((t, i) => (
              <span key={i} style={{
                background: palette.cardBgGlass,
                borderRadius: 14,
                padding: '0.7rem 1.7rem',
                fontWeight: 900,
                fontSize: '1.16rem',
                letterSpacing: 0.24,
                boxShadow: isDark ? '0 4px 18px #23294633' : '0 4px 18px #4ea8ff11',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                border: `1.5px solid ${palette.border}`,
                transition: 'box-shadow 0.2s, transform 0.15s',
                backdropFilter: 'blur(2px)',
                cursor: 'pointer',
                filter: isDark ? 'drop-shadow(0 2px 12px #23294633)' : 'drop-shadow(0 2px 12px #4ea8ff11)',
              }}
                onMouseOver={e => e.currentTarget.style.boxShadow = isDark ? '0 16px 48px #23294644' : '0 16px 48px #4ea8ff22'}
                onMouseOut={e => e.currentTarget.style.boxShadow = isDark ? '0 4px 18px #23294633' : '0 4px 18px #4ea8ff11'}
              >
                {typeof t.icon === 'string' ? (
                  <img src={t.icon} alt={t.name} style={{ width: 36, height: 36, marginRight: 10 }} />
                ) : (
                  t.icon
                )}
                {t.name}
              </span>
            ))}
          </div>
        </section>

        {/* Engagement Models & Methodology */}
        <div style={{ width: '100%', height: 0, borderTop: '1.5px solid #eaf6ff', margin: '0 0 2.2rem 0', opacity: 0.7 }} />
        <section
          style={{
            margin: '3.2rem 0',
            background: isDark ? 'linear-gradient(100deg, #232946 60%, #181c22 100%)' : 'linear-gradient(100deg, #e3e6ea 60%, #f7fafd 100%)',
            borderRadius: 32,
            boxShadow: isDark ? '0 12px 48px #23294633' : '0 12px 48px #4ea8ff11',
            padding: '3.2rem 2.8rem',
            border: `2px solid ${palette.border}`,
            position: 'relative',
            overflow: 'hidden',
            animation: 'fadeInUp 1.8s cubic-bezier(.23,1.01,.32,1) both',
            color: palette.textMain,
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 36, alignItems: 'stretch', margin: '0 auto', maxWidth: 980 }}>
            <div style={{ background: palette.cardBgGlass, borderRadius: 22, padding: '2.1rem 1.7rem', boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff11', border: `1.5px solid ${palette.cardInnerBorder}`, display: 'flex', flexDirection: 'column', gap: 18, minHeight: 240, justifyContent: 'flex-start', alignItems: 'flex-start', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <span style={{ fontSize: '2rem' }} aria-label="Engagement Models" role="img">💼</span>
                <span style={{ fontWeight: 800, fontSize: '1.13rem', color: palette.textAccent }}>Engagement Models</span>
              </div>
              <EngagementModels />
            </div>
            <div style={{ background: palette.cardBgGlass, borderRadius: 22, padding: '2.1rem 1.7rem', boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff11', border: `1.5px solid ${palette.cardInnerBorder}`, display: 'flex', flexDirection: 'column', gap: 18, minHeight: 260, justifyContent: 'flex-start', alignItems: 'flex-start', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <span style={{ fontSize: '2rem' }} aria-label="Methodology & Communication" role="img">🧭</span>
                <span style={{ fontWeight: 800, fontSize: '1.13rem', color: palette.textAccent }}>Methodology & Communication</span>
              </div>
              <MethodologyAndCommunication />
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <div style={{ width: '100%', height: 0, borderTop: '1.5px solid #eaf6ff', margin: '0 0 2.2rem 0', opacity: 0.7 }} />
        <section style={{
          margin: '3.2rem 0',
          background: palette.testimonialBg,
          borderRadius: 32,
          padding: '3.2rem 2.8rem',
          boxShadow: isDark ? '0 12px 48px #23294633' : '0 12px 48px #4ea8ff11',
          textAlign: 'center',
          border: `2.5px solid ${palette.border}`,
          position: 'relative',
          overflow: 'hidden',
          animation: 'fadeInUp 1.8s cubic-bezier(.23,1.01,.32,1) both',
          color: palette.textMain,
        }}>
          <div style={{ fontSize: '1.38rem', fontWeight: 900, color: palette.textMain, marginBottom: 22, fontStyle: 'italic', letterSpacing: 0.14, textShadow: isDark ? '0 3px 16px #23294644' : '0 3px 16px #4ea8ff22', position: 'relative', zIndex: 2, lineHeight: 1.3 }}>
            “{testimonial.quote}”
          </div>
          <div style={{ color: palette.textAccent, fontWeight: 900, fontSize: '1.18rem', letterSpacing: 0.14, position: 'relative', zIndex: 2 }}>{testimonial.name} <span style={{ color: palette.textMain, fontWeight: 800 }}>| {testimonial.company}</span></div>
        </section>

        {/* FAQs */}
        <div style={{ width: '100%', height: 0, borderTop: '1.5px solid #eaf6ff', margin: '0 0 2.2rem 0', opacity: 0.7 }} />
        <div style={{
          margin: '3.2rem 0',
          background: palette.cardBg,
          borderRadius: 26,
          boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff11',
          padding: '3rem 2.5rem',
          border: `1.5px solid ${palette.border}`,
          backdropFilter: 'blur(2.5px)',
          animation: 'fadeInUp 1.9s cubic-bezier(.23,1.01,.32,1) both',
          color: palette.textMain,
        }}>
          <ServiceFAQs faqs={faqs} />
        </div>

        {/* CTA */}
        <div style={{ width: '100%', height: 0, borderTop: '1.5px solid #eaf6ff', margin: '0 0 2.2rem 0', opacity: 0.7 }} />
        <section style={{
          margin: '4.2rem 0 0 0',
          textAlign: 'center',
          background: palette.ctaBg,
          borderRadius: 32,
          padding: '3.5rem 2.8rem',
          boxShadow: isDark ? '0 12px 48px #23294633' : '0 12px 48px #4ea8ff22',
          position: 'relative',
          overflow: 'hidden',
          animation: 'fadeInUp 2s cubic-bezier(.23,1.01,.32,1) both',
        }}>
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
            boxShadow: isDark ? '0 8px 32px #23294644' : '0 8px 32px #4ea8ff33',
            display: 'inline-block',
            border: `2.5px solid ${palette.ctaBtnBorder}`,
            letterSpacing: 0.32,
            backdropFilter: 'blur(2.5px)',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 2,
            filter: isDark ? 'drop-shadow(0 2px 12px #23294644)' : 'drop-shadow(0 2px 12px #4ea8ff33)',
            borderImage: 'linear-gradient(90deg, #4ea8ff, #6ea8ff, #cfe8ef, #4ea8ff) 1',
            animation: 'borderGradient 4s linear infinite alternate',
            transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
          }}
            onMouseOver={e => {
              e.currentTarget.style.background = palette.ctaBtnHover;
              e.currentTarget.style.transform = 'scale(1.045)';
              e.currentTarget.style.boxShadow = isDark ? '0 16px 56px #23294666' : '0 16px 56px #4ea8ff44';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = palette.ctaBtn;
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = isDark ? '0 8px 32px #23294644' : '0 8px 32px #4ea8ff33';
            }}
          >
            Start Your IT Project
          </a>
          <div style={{ marginTop: 22, color: palette.textMain, fontSize: '1.18rem', fontWeight: 800, textShadow: isDark ? '0 3px 16px #23294644' : '0 3px 16px #4ea8ff22', position: 'relative', zIndex: 2 }}>Ready for secure, reliable IT? Let’s talk about your vision.</div>
        </section>
        </main>
      </div>
    </>
  );
}
