

"use client";
import React from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useInViewAnimation } from "../../../hooks/useInViewAnimation";
import servicesData from "../servicesData";
import { OurProcess, EngagementModels, MethodologyAndCommunication, ServiceFAQs } from "../ServiceDetailSections";

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
  { title: "Discovery & Planning", desc: "App vision & requirements.", icon: "/IconSystem/requirements.svg" },
  { title: "UI/UX Design", desc: "Mobile UI/UX design.", icon: "/IconSystem/design.svg" },
  { title: "Development & Testing", desc: "Build & QA.", icon: "/IconSystem/development.svg" },
  { title: "App Store Launch", desc: "Launch on stores.", icon: "/IconSystem/deploy.svg" },
  { title: "Ongoing Support", desc: "Updates & support.", icon: "/IconSystem/support.svg" }
];

const faqs = [
  { q: "Do you build both iOS and Android apps?", a: "Yes, we offer native and cross-platform development for both platforms." },
  { q: "Can you help with app store submission?", a: "Absolutely. We handle the entire launch process for you." },
  { q: "What about app maintenance?", a: "We provide ongoing support, updates, and feature enhancements." },
  { q: "How do you ensure app quality?", a: "We use automated and manual testing on real devices for every release." }
];

const features = [
  { icon: "/IconSystem/requirements.svg", label: "Requirements & Planning" },
  { icon: "/IconSystem/design.svg", label: "UI/UX Design" },
  { icon: "/IconSystem/development.svg", label: "Native & Cross-platform Development" },
  { icon: "/IconSystem/deploy.svg", label: "App Store Launch" },
  { icon: "/IconSystem/support.svg", label: "Ongoing Support" },
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
  return (
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
          margin: '3.2rem 0',
          background: palette.cardBg,
          borderRadius: 26,
          boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff11',
          padding: '3rem 2.5rem',
          border: `1.5px solid ${palette.border}`,
          backdropFilter: 'blur(2.5px)',
        }}>
          <h2 style={{ fontSize: '1.38rem', fontWeight: 900, color: palette.textAccent, marginBottom: 36, letterSpacing: 0.14, textShadow: isDark ? '0 2px 8px #23294633' : '0 2px 8px #4ea8ff11', lineHeight: 1.1, textAlign: 'center' }}>Our Process</h2>
          <OurProcess steps={processSteps} />
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
                <img src={f.icon} alt={f.label} style={{ width: 36, height: 36, marginRight: 18 }} />
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
            {service.techs.map((t, i) => (
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
                <img src={`/meta/${t.replace(/\s/g, '')}.png`} alt={t} style={{ width: 40, height: 40, marginRight: 12 }} />
                {t}
              </span>
            ))}
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
              <EngagementModels />
            </div>
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
    </div>
  );
}
