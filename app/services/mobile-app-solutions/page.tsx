

"use client";
import React from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useInViewAnimation } from "../../../hooks/useInViewAnimation";
import servicesData from "../servicesData";

import { ServiceFAQs } from "../ServiceDetailSections";
import { FaClipboardList, FaPencilRuler, FaMobileAlt, FaRocket, FaLifeRing, FaReact, FaAws, FaFigma, FaHandshake, FaMoneyBillWave, FaUsers, FaClock, FaBolt, FaBullhorn, FaTools } from 'react-icons/fa';
import { SiFlutter, SiSwift, SiKotlin, SiFirebase, SiJira, SiFigma as SiFigmaIcon, SiGithub } from 'react-icons/si';

import Footer from "../../../components/Footer/Footer";

const service = {
  ...servicesData.find(s => s.slug === "mobile-app-solutions"),
  techs: [
    "React Native",
    "Flutter",
    "Swift",
    "Kotlin",
    "Firebase",
    "AWS",
    "Figma"
  ]
};


const processSteps = [
  { title: "Discovery & Planning", desc: "App vision & requirements.", icon: <FaClipboardList size={32} color="#4ea8ff" /> },
  { title: "UI/UX Design", desc: "Mobile UI/UX design.", icon: <FaPencilRuler size={32} color="#4ea8ff" /> },
  { title: "Development & Testing", desc: "Build & QA.", icon: <FaMobileAlt size={32} color="#4ea8ff" /> },
  { title: "App Store Launch", desc: "Launch on stores.", icon: <FaRocket size={32} color="#4ea8ff" /> },
  { title: "Ongoing Support", desc: "Updates & support.", icon: <FaLifeRing size={32} color="#4ea8ff" /> },
];

const faqs = [
  { q: "Do you build both iOS and Android apps?", a: "Yes, we offer native and cross-platform development for both platforms." },
  { q: "Can you help with app store submission?", a: "Absolutely. We handle the entire launch process for you." },
  { q: "What about app maintenance?", a: "We provide ongoing support, updates, and feature enhancements." },
  { q: "How do you ensure app quality?", a: "We use automated and manual testing on real devices for every release." }
];


const features = [
  { icon: <FaMobileAlt size={28} color="#4ea8ff" />, label: "Cross-Platform Expertise" },
  { icon: <FaBolt size={28} color="#4ea8ff" />, label: "Agile & Rapid Delivery" },
  { icon: <FaTools size={28} color="#4ea8ff" />, label: "Enterprise-Grade Security" },
  { icon: <FaRocket size={28} color="#4ea8ff" />, label: "App Store Optimization" },
  { icon: <FaLifeRing size={28} color="#4ea8ff" />, label: "Ongoing Analytics & Support" },
];

const testimonial = {
  quote: "Megicode's mobile team delivered a beautiful, high-performance app that our users love!",
  name: "Alex R.",
  company: "HealthTech Startup"
};

export default function MobileAppSolutionsDetailPage() {
  const { theme } = useTheme();
  useInViewAnimation && useInViewAnimation();
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

  // Animation keyframes and skip link for accessibility
  const keyframes = `
    @keyframes floatY { 0% { transform: translateY(0); } 50% { transform: translateY(-18px); } 100% { transform: translateY(0); } }
    @keyframes floatX { 0% { transform: translateX(0); } 50% { transform: translateX(18px); } 100% { transform: translateX(0); } }
    @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(32px); } 100% { opacity: 1; transform: translateY(0); } }
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 #4ea8ff33; } 70% { box-shadow: 0 0 0 18px #4ea8ff11; } 100% { box-shadow: 0 0 0 0 #4ea8ff33; } }
    @keyframes borderGradient {
      0% { border-image-source: linear-gradient(90deg, #4ea8ff, #6ea8ff, #cfe8ef, #4ea8ff); }
      100% { border-image-source: linear-gradient(450deg, #4ea8ff, #6ea8ff, #cfe8ef, #4ea8ff); }
    }
    @keyframes sparkMove {
      0% { transform: translateY(0) scale(1); opacity: 1; }
      50% { transform: translateY(-18px) scale(1.2); opacity: 0.7; }
      100% { transform: translateY(0) scale(1); opacity: 1; }
    }
  `;

  return (
    <React.Fragment>
      <style>{keyframes}</style>
      <a href="#main-content" className="skip-to-content" style={{position:'absolute',left:'-999px',top:'auto',width:1,height:1,overflow:'hidden',zIndex:9999,background:'#fff',color:'#222b3a',fontWeight:'bold',borderRadius:8,padding:'8px 18px',transition:'left 0.2s'}} tabIndex={0}>Skip to main content</a>
      <div style={{ background: palette.bgMain, overflowX: 'hidden', position: 'relative', minHeight: '100vh', colorScheme: isDark ? 'dark' : 'light', transition: 'background 0.4s, color 0.3s' }}>
        {/* Animated background shapes */}
        <div style={{position:'absolute',left:-120,top:80,width:320,height:320,background:isDark?'radial-gradient(circle, #23294655 0%, #181c2200 80%)':'radial-gradient(circle, #cfe8ef55 0%, #f7fafd00 80%)',filter:'blur(32px)',zIndex:0,pointerEvents:'none',animation:'floatY 7s ease-in-out infinite'}} aria-hidden="true" />
        <div style={{position:'absolute',right:-100,bottom:0,width:260,height:260,background:isDark?'radial-gradient(circle, #4ea8ff33 0%, #23294600 80%)':'radial-gradient(circle, #4ea8ff22 0%, #f7fafd00 80%)',filter:'blur(36px)',zIndex:0,pointerEvents:'none',animation:'floatX 9s ease-in-out infinite'}} aria-hidden="true" />
        {/* Scroll to top button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{position:'fixed',bottom:32,right:32,zIndex:100,background:palette.ctaBtn,color:palette.ctaBtnText,border:`2px solid ${palette.ctaBtnBorder}`,borderRadius:'50%',width:48,height:48,boxShadow:isDark?'0 4px 16px #23294688':'0 4px 16px #4ea8ff33',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,transition:'background 0.2s, box-shadow 0.2s, transform 0.15s',outline:'none'}}
          aria-label="Scroll to top"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        ></button>
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
        aria-label="Mobile App Solutions Service Detail"
      >
        {/* Hero Section */}
        <section
          style={{
            width: '100%',
            background: palette.heroGradient,
            borderRadius: '0 0 3.5rem 3.5rem',
            padding: '4.2rem 2.2rem 3.2rem 2.2rem',
            marginBottom: 64,
            boxShadow: isDark ? '0 12px 48px #23294666' : '0 12px 48px #4ea8ff33',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 320,
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 64, flexWrap: 'wrap', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 3 }}>
            <div style={{ flex: 1, minWidth: 320 }}>
              <h1 style={{ fontSize: '3rem', fontWeight: 900, color: isDark ? '#eaf6ff' : '#fff', marginBottom: 24, letterSpacing: -2.5, textShadow: isDark ? '0 6px 32px #23294699, 0 1px 0 #23294644' : '0 6px 32px #4ea8ff66, 0 1px 0 #fff2', lineHeight: 1.08 }}>{service.title}</h1>
              <p style={{ fontSize: '1.22rem', color: isDark ? '#b0c4d8' : '#eaf6ff', marginBottom: 36, fontWeight: 600, lineHeight: 1.75, textShadow: isDark ? '0 3px 16px #23294644' : '0 3px 16px #4ea8ff33', letterSpacing: 0.01 }}>{service.description}</p>
              <a
                href="/contact"
                style={{
                  background: palette.ctaBtn,
                  color: palette.ctaBtnText,
                  fontWeight: 900,
                  fontSize: '1.18rem',
                  borderRadius: 18,
                  padding: '1rem 2.5rem',
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
              >Start Your Mobile Project</a>
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
              }}>
                <img
                  src="/mobile app icon.svg"
                  alt="Mobile App Illustration"
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
        }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: palette.textAccent, marginBottom: 20, letterSpacing: 0.13, textShadow: isDark ? '0 2px 8px #23294633' : '0 2px 8px #4ea8ff11', lineHeight: 1.1 }}>Overview</h2>
            <p style={{ fontSize: '1.22rem', color: palette.textMain, marginBottom: 14, lineHeight: 1.8, fontWeight: 600 }}>{service.description}</p>
          </div>
          <div style={{ flex: 1, minWidth: 180, textAlign: 'center' }}>
            <img src="/mobile app icon.svg" alt="Mobile App Overview" style={{ width: 160, maxWidth: '100%', borderRadius: 18, boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff22', background: palette.iconBg, padding: 18, border: `1.5px solid ${palette.iconBorder}` }} />
          </div>
        </section>

        {/* Process Stepper */}
        <div style={{ width: '100%', height: 0, borderTop: '1.5px solid #eaf6ff', margin: '0 0 2.2rem 0', opacity: 0.7 }} />
        <section style={{
          margin: '2.2rem 0',
          background: palette.cardBg,
          borderRadius: 22,
          boxShadow: isDark ? '0 4px 18px #23294633' : '0 4px 18px #4ea8ff11',
          padding: '2.2rem 1.2rem',
          border: `1px solid ${palette.border}`,
          backdropFilter: 'blur(1.5px)',
        }}>
          <h2 style={{ fontSize: '1.18rem', fontWeight: 900, color: palette.textAccent, marginBottom: 18, textShadow: isDark ? '0 1px 4px #23294633' : '0 1px 4px #4ea8ff11', lineHeight: 1.1, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 }}>{'Our Process'}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'center' }}>
            {processSteps.map((step, i) => (
              <div key={i} style={{
                background: palette.cardBgGlass,
                borderRadius: 16,
                padding: '1.1rem 1.1rem',
                minWidth: 140,
                maxWidth: 200,
                flex: '1 1 140px',
                fontWeight: 700,
                color: palette.textMain,
                boxShadow: isDark ? '0 2px 8px #23294622' : '0 2px 8px #4ea8ff11',
                fontSize: '0.98rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 7,
                border: `1px solid ${palette.border}`,
                transition: 'box-shadow 0.2s, transform 0.15s',
                backdropFilter: 'blur(1px)',
                cursor: 'pointer',
                filter: isDark ? 'drop-shadow(0 1px 6px #23294622)' : 'drop-shadow(0 1px 6px #4ea8ff11)',
                textAlign: 'center',
                marginBottom: 8,
              }}>
                <div style={{ marginBottom: 2 }}>{step.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '1.01rem', color: palette.textAccent, marginBottom: 1 }}>{step.title}</div>
                <div style={{ color: palette.textMain, fontWeight: 500, fontSize: '0.93rem', opacity: 0.85 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features as Cards */}
        <div style={{ width: '100%', height: 0, borderTop: '1.5px solid #eaf6ff', margin: '0 0 2.2rem 0', opacity: 0.7 }} />
        <section style={{ margin: '3.2rem 0' }}>
          <h2 style={{ fontSize: '1.38rem', fontWeight: 900, color: '#4ea8ff', marginBottom: 26, letterSpacing: 0.14, textShadow: '0 2px 8px #4ea8ff11', lineHeight: 1.1 }}>Key Features</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: palette.cardBgGlass,
                borderRadius: 22,
                padding: '1.7rem 1.8rem',
                minWidth: 180,
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
              }}>
                <span style={{ marginRight: 18 }}>{f.icon}</span>
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
        }}>
          <h2 style={{ fontSize: '1.28rem', fontWeight: 900, color: '#4ea8ff', marginBottom: 26, letterSpacing: 0.14, textShadow: '0 2px 8px #4ea8ff11', lineHeight: 1.1 }}>Technologies</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center' }}>
            {service.techs.map((t, i) => {
              let Icon = null;
              let color = undefined;
              switch (t.toLowerCase()) {
                case "react native": Icon = FaReact; color = "#61dafb"; break;
                case "flutter": Icon = SiFlutter; color = "#02569B"; break;
                case "swift": Icon = SiSwift; color = "#FA7343"; break;
                case "kotlin": Icon = SiKotlin; color = "#7F52FF"; break;
                case "firebase": Icon = SiFirebase; color = "#FFCA28"; break;
                case "aws": Icon = FaAws; color = "#FF9900"; break;
                case "figma": Icon = FaFigma; color = "#A259FF"; break;
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
                }}>
                  {Icon ? (
                    <Icon size={36} style={{ marginRight: 12 }} color={color} />
                  ) : (
                    <img src={`/meta/${t.replace(/\s/g, '')}.png`} alt={t} style={{ width: 36, height: 36, marginRight: 12 }} />
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
            color: palette.textMain,
          }}
          aria-labelledby="how-we-work-title"
        >
          <h2 id="how-we-work-title" style={{ fontSize: '1.55rem', fontWeight: 900, color: palette.textAccent, marginBottom: 18, letterSpacing: 0.13, textShadow: isDark ? '0 2px 8px #23294633' : '0 2px 8px #4ea8ff11', lineHeight: 1.1, textAlign: 'center' }}>
            How We Work: Partnership, Process & Delivery
          </h2>
          <div style={{ maxWidth: 900, margin: '0 auto', marginBottom: 32, color: palette.textSubtle, fontWeight: 600, fontSize: '1.13rem', textAlign: 'center' }}>
            We operate as your strategic partner—combining robust engagement models, agile execution, and enterprise-grade governance. Our operational workflow ensures risk-managed, transparent, and value-driven mobile app delivery: on time, on budget, and with full business visibility.
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
                <FaHandshake size={32} color={palette.textAccent} aria-label="Engagement Models" />
                <span style={{ fontWeight: 800, fontSize: '1.13rem', color: palette.textAccent }}>Engagement Models</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <FaMoneyBillWave size={22} color="#4ea8ff" aria-label="Fixed Price" />
                  <span style={{ fontWeight: 700 }}>Fixed Price</span>
                </div>
                <div style={{ color: palette.textSubtle, fontSize: '1rem', marginLeft: 34, marginBottom: 8 }}>Predictable budget, defined scope.</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <FaUsers size={22} color="#4ea8ff" aria-label="Dedicated Team" />
                  <span style={{ fontWeight: 700 }}>Dedicated Team</span>
                </div>
                <div style={{ color: palette.textSubtle, fontSize: '1rem', marginLeft: 34, marginBottom: 8 }}>Flexible, scalable team extension.</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <FaClock size={22} color="#4ea8ff" aria-label="Time & Material" />
                  <span style={{ fontWeight: 700 }}>Time & Material</span>
                </div>
                <div style={{ color: palette.textSubtle, fontSize: '1rem', marginLeft: 34 }}>Agile, transparent billing.</div>
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
                <FaBolt size={32} color={palette.textAccent} aria-label="Methodology & Communication" />
                <span style={{ fontWeight: 800, fontSize: '1.13rem', color: palette.textAccent }}>Methodology & Communication</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <FaBolt size={22} color="#4ea8ff" aria-label="Agile, CMMI L3+" />
                <span style={{ fontWeight: 700 }}>Agile, CMMI L3+</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <FaBullhorn size={22} color="#4ea8ff" aria-label="Transparent Updates" />
                <span style={{ fontWeight: 700 }}>Transparent Updates</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <SiJira size={22} color="#0052CC" aria-label="Jira" />
                <SiFigmaIcon size={22} color="#A259FF" aria-label="Figma" />
                <SiGithub size={22} color="#333" aria-label="GitHub" />
                <span style={{ fontWeight: 700 }}>Jira, Figma, GitHub</span>
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
            transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
          }}>
            Start Your Mobile Project
          </a>
          <div style={{ marginTop: 22, color: palette.textMain, fontSize: '1.18rem', fontWeight: 800, textShadow: isDark ? '0 3px 16px #23294644' : '0 3px 16px #4ea8ff22', position: 'relative', zIndex: 2 }}>Ready to launch your app? Let’s talk about your vision.</div>
        </section>
        </main>
        <Footer />
      </div>
    </React.Fragment>
  );
}
