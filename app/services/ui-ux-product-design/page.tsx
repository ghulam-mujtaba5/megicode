

"use client";
import React from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useInViewAnimation } from "../../../hooks/useInViewAnimation";
import servicesData from "../servicesData";
import { ServiceFAQs } from "../ServiceDetailSections";
import { FaPencilRuler, FaPalette, FaUserCheck, FaRegObjectGroup, FaUsers, FaRocket, FaLifeRing } from "react-icons/fa";
import { SiFigma, SiAdobe, SiSketch, SiInvision } from "react-icons/si";

  ...servicesData.find(s => s.slug === "ui-ux-product-design"),
  techs: [
    "Figma",
    "Adobe XD",
    "Sketch",
    "InVision",
    "Zeplin"
  ]
};

import ThemeToggleIcon from "../../../components/Icon/sbicon";
import { useCallback } from "react";
const service = {
  ...servicesData.find(s => s.slug === "ui-ux-product-design"),
  techs: [
    "Figma",
    "Adobe XD",
    "Sketch",
    "InVision",
    "Zeplin"
  ]
};
  {
    title: "Research & Discovery",
    desc: "User & business research.",
    icon: <FaUsers color="#4ea8ff" size={36} title="Research & Discovery" />
  },
  {
    title: "Wireframing & Prototyping",
    desc: "Flows & prototypes.",
    icon: <FaPencilRuler color="#4ea8ff" size={36} title="Wireframing & Prototyping" />
  },
  {
    title: "UI/UX Design",
    desc: "Visual & UX design.",
    icon: <FaPalette color="#4ea8ff" size={36} title="UI/UX Design" />
  },
  {
    title: "Usability Testing",
    desc: "Test & iterate.",
    icon: <FaUserCheck color="#4ea8ff" size={36} title="Usability Testing" />
  },
  {
    title: "Handoff & Support",
    desc: "Dev handoff & support.",
    icon: <FaLifeRing color="#4ea8ff" size={36} title="Handoff & Support" />
  }
];

const faqs = [
  { q: "Do you provide design systems?", a: "Yes, we create scalable design systems for consistency and efficiency." },
  { q: "Can you work with our branding?", a: "Absolutely. We align all designs with your brand guidelines." },
  { q: "What tools do you use?", a: "Figma, Adobe XD, Sketch, InVision, Zeplin, and more." },
  { q: "Do you test with real users?", a: "Yes, usability testing is a core part of our process." }
];

const features = [
  { icon: <FaRegObjectGroup color="#4ea8ff" size={36} title="Design Systems" />, label: "Design Systems" },
  { icon: <FaPalette color="#4ea8ff" size={36} title="Brand Identity" />, label: "Brand Identity" },
  { icon: <FaPencilRuler color="#4ea8ff" size={36} title="Wireframes & Prototypes" />, label: "Wireframes & Prototypes" },
  { icon: <FaUserCheck color="#4ea8ff" size={36} title="User Testing" />, label: "User Testing" },
  { icon: <FaLifeRing color="#4ea8ff" size={36} title="Ongoing Support" />, label: "Ongoing Support" },
];

const testimonial = {
  quote: "Megicode's design team elevated our product's UX and brand, leading to higher user engagement.",
  name: "Emily W.",
  company: "EdTech Platform"
};

export default function UIUXProductDesignDetailPage() {
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
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 #4ea8ff33; } 70% { box-shadow: 0 0 0 18px #4ea8ff11; } 100% { box-shadow: 0 0 0 0 #4ea8ff33; } }
      `}</style>
      <div style={{ background: palette.bgMain, overflowX: 'hidden', position: 'relative', minHeight: '100vh', colorScheme: isDark ? 'dark' : 'light', transition: 'background 0.4s, color 0.3s' }}>
        <main
          style={{
            maxWidth: 1160,
            margin: '2.5rem auto',
            padding: '0 1.2rem 5rem 1.2rem',
            fontFamily: 'Inter, sans-serif',
            background: 'linear-gradient(120deg, rgba(36,41,54,0.98) 60%, rgba(78,168,255,0.10) 100%)',
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
          aria-label="UI/UX Product Design Service Detail"
        >
          {/* Hero Section */}
          <section
            style={{
              width: '100%',
              background: palette.heroGradient,
              borderRadius: '0 0 3.5rem 3.5rem',
              padding: '5.2rem 3.2rem 4.2rem 3.2rem',
              marginBottom: 64,
              boxShadow: isDark ? '0 12px 48px #23294666' : '0 12px 48px #4ea8ff33',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 390,
              zIndex: 1,
              animation: 'fadeInUp 1.1s cubic-bezier(.23,1.01,.32,1) both',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 64, flexWrap: 'wrap', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 3 }}>
              <div style={{ flex: 1, minWidth: 320 }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: isDark ? '#eaf6ff' : '#fff', marginBottom: 24, letterSpacing: -2.5, textShadow: isDark ? '0 6px 32px #23294699, 0 1px 0 #23294644' : '0 6px 32px #4ea8ff66, 0 1px 0 #fff2', lineHeight: 1.08 }}>{service.title}</h1>
                <p style={{ fontSize: '1.36rem', color: isDark ? '#b0c4d8' : '#eaf6ff', marginBottom: 36, fontWeight: 600, lineHeight: 1.75, textShadow: isDark ? '0 3px 16px #23294644' : '0 3px 16px #4ea8ff33', letterSpacing: 0.01 }}>{service.description}</p>
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
                    boxShadow: isDark ? '0 6px 32px #23294644, 0 0 0 2.5px #263040' : '0 6px 32px #4ea8ff33, 0 0 0 2.5px #eaf6ff',
                    transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
                    display: 'inline-block',
                    marginTop: 24,
                    border: `2.5px solid ${palette.ctaBtnBorder}`,
                    letterSpacing: 0.32,
                    backdropFilter: 'blur(2.5px)',
                    cursor: 'pointer',
                    filter: isDark ? 'drop-shadow(0 2px 12px #23294644)' : 'drop-shadow(0 2px 12px #4ea8ff33)',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = palette.ctaBtnHover;
                    e.currentTarget.style.transform = 'scale(1.045)';
                    e.currentTarget.style.boxShadow = isDark ? '0 12px 48px #23294666, 0 0 0 2.5px #263040' : '0 12px 48px #4ea8ff44, 0 0 0 2.5px #eaf6ff';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = palette.ctaBtn;
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = isDark ? '0 6px 32px #23294644, 0 0 0 2.5px #263040' : '0 6px 32px #4ea8ff33, 0 0 0 2.5px #eaf6ff';
                  }}
                >Start Your Design Project</a>
              </div>
              <div style={{ flex: 1, minWidth: 260, textAlign: 'center', position: 'relative' }}>
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
                  animation: 'pulse 2.8s infinite',
                }}>
                  <img
                    src="/Ui&Ux-icon.svg"
                    alt="UI/UX Illustration"
                    style={{ width: 220, maxWidth: '100%', borderRadius: 32, boxShadow: '0 8px 32px #4ea8ff33', background: isDark ? 'rgba(36,41,54,0.98)' : '#fff', padding: 18, border: `2px solid ${palette.cardInnerBorder}` }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Overview Section */}
          <div style={{ width: '100%', height: 0, borderTop: '1.5px solid #eaf6ff', margin: '0 0 2.2rem 0', opacity: 0.7 }} />
          <section style={{
            display: 'flex',
            gap: 56,
            alignItems: 'center',
            flexWrap: 'wrap',
            margin: '3.2rem 0',
            background: palette.cardBg,
            borderRadius: 26,
            boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff11',
            padding: '3rem 2.5rem',
            border: `1.5px solid ${palette.border}`,
            backdropFilter: 'blur(2.5px)',
            animation: 'fadeInUp 1.2s cubic-bezier(.23,1.01,.32,1) both',
          }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: palette.textAccent, marginBottom: 20, letterSpacing: 0.13, textShadow: isDark ? '0 2px 8px #23294633' : '0 2px 8px #4ea8ff11', lineHeight: 1.1 }}>Overview</h2>
              <p style={{ fontSize: '1.22rem', color: palette.textMain, marginBottom: 14, lineHeight: 1.8, fontWeight: 600 }}>{service.description}</p>
            </div>
            <div style={{ flex: 1, minWidth: 180, textAlign: 'center' }}>
              <img src="/Ui&Ux-icon.svg" alt="UI/UX Service Overview" style={{ width: 160, maxWidth: '100%', borderRadius: 18, boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff22', background: palette.iconBg, padding: 18, border: `1.5px solid ${palette.iconBorder}` }} />
            </div>
          </section>

          {/* Process Stepper */}
          <div style={{ width: '100%', height: 0, borderTop: '1.5px solid #eaf6ff', margin: '0 0 2.2rem 0', opacity: 0.7 }} />
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
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 0,
              flexWrap: 'wrap',
              margin: '0 auto',
              maxWidth: 980,
            }}>
              {processSteps.map((step, idx) => (
                <div key={idx} style={{
                  flex: 1,
                  minWidth: 160,
                  maxWidth: 220,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  margin: '0 8px',
                  position: 'relative',
                }}>
                  <div style={{
                    background: isDark ? '#232946' : '#f7fafd',
                    borderRadius: '50%',
                    width: 64,
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                    border: `2.5px solid ${palette.border}`,
                    boxShadow: isDark ? '0 4px 18px #23294633' : '0 4px 18px #4ea8ff11',
                  }}>
                    {step.icon}
                  </div>
                  <div style={{ fontWeight: 900, fontSize: '1.08rem', color: palette.textAccent, marginBottom: 6 }}>{step.title}</div>
                  <div style={{ color: palette.textSubtle, fontWeight: 600, fontSize: '0.99rem', marginBottom: 0 }}>{step.desc}</div>
                  {idx < processSteps.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      right: -8,
                      top: 32,
                      width: 24,
                      height: 2,
                      background: isDark ? '#263040' : '#eaf6ff',
                      opacity: 0.7,
                      zIndex: 1,
                      left: '100%',
                      marginLeft: 0,
                      marginRight: 0,
                      display: 'block',
                    }} />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Features as Cards */}
          <div style={{ width: '100%', height: 0, borderTop: '1.5px solid #eaf6ff', margin: '0 0 2.2rem 0', opacity: 0.7 }} />
          <section style={{ margin: '3.2rem 0', animation: 'fadeInUp 1.5s cubic-bezier(.23,1.01,.32,1) both' }}>
            <h2 style={{ fontSize: '1.38rem', fontWeight: 900, color: '#4ea8ff', marginBottom: 26, letterSpacing: 0.14, textShadow: '0 2px 8px #4ea8ff11', lineHeight: 1.1 }}>Key Features</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
              {features.map((f, i) => (
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
                  {f.icon}
                  {f.label}
                </div>
              ))}
            </div>
          </section>

          {/* Technologies as Logo Cloud */}
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
            <h2 style={{ fontSize: '1.28rem', fontWeight: 900, color: '#4ea8ff', marginBottom: 26, letterSpacing: 0.14, textShadow: '0 2px 8px #4ea8ff11', lineHeight: 1.1 }}>Technologies</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center' }}>
              {service.techs.map((t, i) => {
                let Icon = null;
                let color = undefined;
                switch (t.toLowerCase()) {
                  case "figma": Icon = SiFigma; color = "#F24E1E"; break;
                  case "adobe xd": Icon = SiAdobe; color = "#FF61F6"; break;
                  case "sketch": Icon = SiSketch; color = "#F7B500"; break;
                  case "invision": Icon = SiInvision; color = "#FF3366"; break;
                  // Zeplin icon not available in react-icons/si
                  default: Icon = null; color = undefined;
                }
                return (
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
                    {Icon ? (
                      <Icon size={40} style={{ marginRight: 12 }} title={t} color={color} />
                    ) : (
                      <span style={{ width: 40, height: 40, marginRight: 12, display: 'inline-block' }} />
                    )}
                    {t}
                  </span>
                );
              })}
            </div>
          </section>

          {/* How We Work Section */}
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
            aria-labelledby="how-we-work-title"
          >
            <h2 id="how-we-work-title" style={{ fontSize: '1.55rem', fontWeight: 900, color: palette.textAccent, marginBottom: 18, letterSpacing: 0.13, textShadow: isDark ? '0 2px 8px #23294633' : '0 2px 8px #4ea8ff11', lineHeight: 1.1, textAlign: 'center' }}>
              How We Work: Partnership, Process & Delivery
            </h2>
            <div style={{ maxWidth: 900, margin: '0 auto', marginBottom: 32, color: palette.textSubtle, fontWeight: 600, fontSize: '1.13rem', textAlign: 'center' }}>
              We operate as your strategic partner—combining robust engagement models, agile execution, and enterprise-grade governance. Our workflow ensures risk-managed, transparent, and value-driven design delivery: on time, on budget, and with full business visibility.
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
                boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff11',
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
                boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff11',
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
                    <div style={{ color: palette.textSubtle, fontWeight: 600, fontSize: '0.99rem', marginTop: 2 }}>Iterative, sprint-based delivery with continuous improvement. CMMI L3+ for process maturity and global best practices in design.</div>
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

          {/* CTA - Full-width colored strip */}
          <div style={{ width: '100%', height: 0, borderTop: '1.5px solid #eaf6ff', margin: '0 0 2.2rem 0', opacity: 0.7 }} />
          <section style={{
            margin: '4.2rem 0 0 0',
            textAlign: 'center',
            background: palette.ctaBg,
            borderRadius: 32,
export default function UIUXProductDesignDetailPage() {
  const { theme, toggleTheme } = useTheme();
  useInViewAnimation();
  const onDarkModeButtonContainerClick = useCallback(() => {
    toggleTheme && toggleTheme();
  }, [toggleTheme]);
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
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 #4ea8ff33; } 70% { box-shadow: 0 0 0 18px #4ea8ff11; } 100% { box-shadow: 0 0 0 0 #4ea8ff33; }
      `}</style>
      <div style={{ background: palette.bgMain, overflowX: 'hidden', position: 'relative', minHeight: '100vh', colorScheme: isDark ? 'dark' : 'light', transition: 'background 0.4s, color 0.3s' }}>
        {/* Theme Toggle Icon - match services page style */}
        <div
          id="theme-toggle"
          role="button"
          tabIndex={0}
          aria-label="Toggle theme"
          onClick={onDarkModeButtonContainerClick}
        >
          <ThemeToggleIcon />
        </div>
        <main
          style={{
            maxWidth: 1160,
            margin: '2.5rem auto',
            padding: '0 1.2rem 5rem 1.2rem',
            fontFamily: 'Inter, sans-serif',
            background: 'linear-gradient(120deg, rgba(36,41,54,0.98) 60%, rgba(78,168,255,0.10) 100%)',
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
          aria-label="UI/UX Product Design Service Detail"
        >
            padding: '3.5rem 2.8rem',
            boxShadow: isDark ? '0 12px 48px #23294633' : '0 12px 48px #4ea8ff22',
            position: 'relative',
            overflow: 'hidden',
            animation: 'fadeInUp 2s cubic-bezier(.23,1.01,.32,1) both',
          }}>
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
              animation: 'pulse 2.2s infinite',
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
              <FaPalette style={{ marginRight: 14, fontSize: '1.5rem', animation: 'pulse 2.2s infinite', verticalAlign: 'middle' }} title="Design Consultant" />
              Start Your Design Project
            </a>
            <div style={{ marginTop: 22, color: palette.textMain, fontSize: '1.18rem', fontWeight: 800, textShadow: isDark ? '0 3px 16px #23294644' : '0 3px 16px #4ea8ff22', position: 'relative', zIndex: 2 }}>Ready to elevate your product? Let’s talk about your vision.</div>
          </section>
        </main>
      </div>
    </>
  );
}
