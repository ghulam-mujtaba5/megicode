

"use client";
import React from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useInViewAnimation } from "../../../hooks/useInViewAnimation";
import servicesData from "../servicesData";
import { OurProcess, EngagementModels, MethodologyAndCommunication, ServiceFAQs } from "../ServiceDetailSections";
import { FaCogs, FaLink, FaRobot, FaSync, FaChalkboardTeacher, FaLifeRing, FaDatabase, FaTools, FaCheckCircle } from "react-icons/fa";
import NavBarMobile from "../../../components/NavBar_Mobile/NavBar-mobile";
import ThemeToggleIcon from "../../../components/Icon/sbicon";

const service = {
  ...servicesData.find(s => s.slug === "automation-integration"),
  techs: [
    "Python",
    "Zapier",
    "Make",
    "Selenium",
    "Node.js",
    "REST APIs",
    "Power Automate"
  ]
};

const processSteps = [
  {
    title: "Process Mapping",
    desc: "Map workflows and identify automation opportunities.",
    icon: <FaDatabase color="#4ea8ff" size={36} title="Process Mapping" />
  },
  {
    title: "Solution Design",
    desc: "Design automation and integration solutions.",
    icon: <FaCogs color="#4ea8ff" size={36} title="Solution Design" />
  },
  {
    title: "Implementation",
    desc: "Develop, integrate, and deploy automation.",
    icon: <FaRobot color="#4ea8ff" size={36} title="Implementation" />
  },
  {
    title: "Training & Handover",
    desc: "Train users and document solutions.",
    icon: <FaChalkboardTeacher color="#4ea8ff" size={36} title="Training & Handover" />
  },
  {
    title: "Support & Optimization",
    desc: "Monitor, support, and optimize workflows.",
    icon: <FaLifeRing color="#4ea8ff" size={36} title="Support & Optimization" />
  }
];

const faqs = [
  { q: "Can you automate legacy systems?", a: "Yes, we can integrate and automate across modern and legacy platforms." },
  { q: "What tools do you use for automation?", a: "We use Python, Zapier, Make, Selenium, Node.js, and custom scripts." },
  { q: "How do you ensure reliability?", a: "We use robust error handling, monitoring, and regular maintenance." },
  { q: "Is training included?", a: "Yes, we provide training and documentation for all solutions." }
];

const features = [
  { icon: <FaSync color="#4ea8ff" size={36} title="Workflow Automation" />, label: "Workflow Automation" },
  { icon: <FaLink color="#4ea8ff" size={36} title="System Integration" />, label: "System Integration" },
  { icon: <FaTools color="#4ea8ff" size={36} title="Custom Scripting" />, label: "Custom Scripting" },
  { icon: <FaCheckCircle color="#4ea8ff" size={36} title="Error Handling & Monitoring" />, label: "Error Handling & Monitoring" },
  { icon: <FaChalkboardTeacher color="#4ea8ff" size={36} title="Training & Documentation" />, label: "Training & Documentation" },
];

const testimonial = {
  quote: "Megicode automated our business processes, saving us hundreds of hours per year.",
  name: "Maria G.",
  company: "Logistics Company"
};

export default function AutomationIntegrationDetailPage() {
  const { theme, toggleTheme } = useTheme();
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
  // Responsive helpers
  const isClient = typeof window !== 'undefined';
  const [windowWidth, setWindowWidth] = React.useState(isClient ? window.innerWidth : 1200);
  React.useEffect(() => {
    if (!isClient) return;
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isClient]);

  // Breakpoints
  const isMobile = windowWidth < 600;
  const isTablet = windowWidth < 900;

  return (
    <>
      <div style={{ background: palette.bgMain, overflowX: 'hidden', position: 'relative', minHeight: '100vh', colorScheme: isDark ? 'dark' : 'light', transition: 'background 0.4s, color 0.3s' }}>
        {/* NavBarMobile and ThemeToggleIcon at the top */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '0.7rem 0.7rem 0 0.7rem' : '1.2rem 2.2rem 0 2.2rem', position: 'relative', zIndex: 10 }}>
          <NavBarMobile />
          <div
            id="theme-toggle"
            role="button"
            tabIndex={0}
            aria-label="Toggle theme"
            onClick={() => toggleTheme && toggleTheme()}
            style={{ cursor: 'pointer', marginLeft: isMobile ? 8 : 24 }}
          >
            <ThemeToggleIcon />
          </div>
        </div>
        <main id="main-content"
          style={{
            maxWidth: 1160,
            margin: isMobile ? '0.5rem 0' : '2.5rem auto',
            // Add more top padding for mobile
            padding: isMobile ? '3.5rem 0.2rem 2.5rem 0.2rem' : isTablet ? '0 0.7rem 4rem 0.7rem' : '0 1.2rem 5rem 1.2rem',
            fontFamily: 'Inter, sans-serif',
            background: isMobile ? 'none' : 'linear-gradient(120deg, rgba(36,41,54,0.98) 60%, rgba(70,115,223,0.10) 100%)',
            borderRadius: isMobile ? 0 : 36,
            boxShadow: isMobile ? 'none' : palette.boxShadow,
            position: 'relative',
            overflow: 'hidden',
            border: isMobile ? 'none' : `1.5px solid ${palette.border}`,
            color: palette.textMain,
            transition: 'background 0.4s, box-shadow 0.3s, border 0.3s',
            minHeight: isMobile ? '100vh' : '80vh',
            display: 'flex',
            flexDirection: 'column',
          }}
          aria-label="Automation & Integration Service Detail"
        >
        {/* Hero Section */}
        <section
          style={{
            width: '100%',
            background: palette.heroGradient,
            borderRadius: isMobile ? 0 : '0 0 3.5rem 3.5rem',
            padding: isMobile ? '2.2rem 0.7rem 1.7rem 0.7rem' : isTablet ? '3rem 1.2rem 2.2rem 1.2rem' : '4.2rem 3.2rem 3.2rem 3.2rem',
            marginBottom: isMobile ? 24 : 64,
            boxShadow: isMobile ? 'none' : isDark ? '0 12px 48px #23294666' : '0 12px 48px #4ea8ff33',
            position: 'relative',
            overflow: 'hidden',
            minHeight: isMobile ? 180 : 320,
            zIndex: 1,
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: isMobile ? 24 : 64,
            flexWrap: 'wrap',
            maxWidth: 1200,
            margin: '0 auto',
            position: 'relative',
            zIndex: 3
          }}>
            <div style={{ flex: 1, minWidth: isMobile ? 'unset' : 320, marginBottom: isMobile ? 18 : 0 }}>
              <h1 style={{ fontSize: isMobile ? '2rem' : isTablet ? '2.3rem' : '3rem', fontWeight: 900, color: isDark ? '#eaf6ff' : '#fff', marginBottom: isMobile ? 12 : 20, letterSpacing: -2, textShadow: isDark ? '0 6px 32px #23294699, 0 1px 0 #23294644' : '0 6px 32px #4ea8ff66, 0 1px 0 #fff2', lineHeight: 1.08 }}>{service.title}</h1>
              <p style={{ fontSize: isMobile ? '1.01rem' : '1.22rem', color: isDark ? '#b0c4d8' : '#eaf6ff', marginBottom: isMobile ? 16 : 28, fontWeight: 600, lineHeight: 1.75, textShadow: isDark ? '0 3px 16px #23294644' : '0 3px 16px #4ea8ff33', letterSpacing: 0.01 }}>{service.description}</p>
              <a
                href="/contact"
                style={{
                  background: palette.ctaBtn,
                  color: palette.ctaBtnText,
                  fontWeight: 900,
                  fontSize: isMobile ? '1rem' : '1.18rem',
                  borderRadius: 18,
                  padding: isMobile ? '0.8rem 1.5rem' : '1.1rem 2.8rem',
                  textDecoration: 'none',
                  boxShadow: isDark ? '0 6px 32px #23294644, 0 0 0 2.5px #263040' : '0 6px 32px #4ea8ff33, 0 0 0 2.5px #eaf6ff',
                  transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
                  display: 'inline-block',
                  marginTop: 18,
                  border: `2.5px solid ${palette.ctaBtnBorder}`,
                  letterSpacing: 0.22,
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
              >Start Your Automation Project</a>
            </div>
            <div style={{ flex: 1, minWidth: isMobile ? 'unset' : 260, textAlign: 'center', position: 'relative', marginTop: isMobile ? 18 : 0 }}>
              <div style={{
                display: 'inline-block',
                background: isDark ? 'rgba(36,41,54,0.22)' : 'rgba(255,255,255,0.22)',
                borderRadius: 40,
                boxShadow: '0 8px 32px #4ea8ff33',
                padding: isMobile ? 10 : 22,
                border: `2.5px solid ${palette.cardInnerBorder}`,
                backdropFilter: 'blur(2.5px)',
                transition: 'box-shadow 0.2s',
                position: 'relative',
              }}>
                <img
                  src="/data scrapping icon.svg"
                  alt="Automation Illustration"
                  style={{ width: isMobile ? 110 : 180, maxWidth: '100%', borderRadius: 32, boxShadow: '0 8px 32px #4ea8ff33', background: isDark ? 'rgba(36,41,54,0.98)' : '#fff', padding: isMobile ? 8 : 18, border: `2px solid ${palette.cardInnerBorder}` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Process Stepper */}
        <section style={{ margin: isMobile ? '1.2rem 0' : '3.2rem 0', background: palette.cardBg, borderRadius: isMobile ? 12 : 26, boxShadow: isMobile ? 'none' : isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff11', padding: isMobile ? '1.2rem 0.7rem' : '3rem 2.5rem', border: `1.5px solid ${palette.border}`, backdropFilter: 'blur(2.5px)' }}>
          <h2 style={{ fontSize: isMobile ? '1.13rem' : '1.38rem', fontWeight: 900, color: palette.textAccent, marginBottom: isMobile ? 18 : 36, letterSpacing: 0.14, textShadow: isDark ? '0 2px 8px #23294633' : '0 2px 8px #4ea8ff11', lineHeight: 1.1, textAlign: 'center' }}>Our Process</h2>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: isMobile ? 'flex-start' : 'space-between',
            alignItems: isMobile ? 'stretch' : 'flex-start',
            gap: isMobile ? 18 : 0,
            flexWrap: 'wrap',
            margin: '0 auto',
            maxWidth: 980
          }}>
            {processSteps.map((step, idx) => (
              <div key={idx} style={{ flex: 1, minWidth: isMobile ? 'unset' : 160, maxWidth: isMobile ? 'unset' : 220, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', margin: isMobile ? '0 0 18px 0' : '0 8px', position: 'relative' }}>
                <div style={{ background: isDark ? '#232946' : '#f7fafd', borderRadius: '50%', width: isMobile ? 48 : 64, height: isMobile ? 48 : 64, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, border: `2.5px solid ${palette.border}`, boxShadow: isDark ? '0 4px 18px #23294633' : '0 4px 18px #4ea8ff11' }}>
                  {step.icon}
                </div>
                <div style={{ fontWeight: 900, fontSize: isMobile ? '1rem' : '1.08rem', color: palette.textAccent, marginBottom: 6 }}>{step.title}</div>
                <div style={{ color: palette.textSubtle, fontWeight: 600, fontSize: isMobile ? '0.93rem' : '0.99rem', marginBottom: 0 }}>{step.desc}</div>
                {!isMobile && idx < processSteps.length - 1 && (
                  <div style={{ position: 'absolute', right: -8, top: 32, width: 24, height: 2, background: isDark ? '#263040' : '#eaf6ff', opacity: 0.7, zIndex: 1, left: '100%', marginLeft: 0, marginRight: 0, display: 'block' }} />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Features as Cards */}
        <section style={{ margin: isMobile ? '1.2rem 0' : '3.2rem 0' }}>
          <h2 style={{ fontSize: isMobile ? '1.13rem' : '1.38rem', fontWeight: 900, color: '#4ea8ff', marginBottom: isMobile ? 14 : 26, letterSpacing: 0.14, textShadow: '0 2px 8px #4ea8ff11', lineHeight: 1.1 }}>What You Get</h2>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flexWrap: 'wrap', gap: isMobile ? 14 : 32 }}>
            {features.map((f, i) => (
              <div key={i} style={{ background: palette.cardBgGlass, borderRadius: isMobile ? 12 : 22, padding: isMobile ? '1.1rem 1.1rem' : '1.7rem 1.8rem', minWidth: isMobile ? 'unset' : 180, flex: 1, fontWeight: 900, color: palette.textMain, boxShadow: isMobile ? 'none' : isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff11', fontSize: isMobile ? '1rem' : '1.16rem', display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 22, border: `1.5px solid ${palette.border}`, transition: 'box-shadow 0.2s, transform 0.15s', backdropFilter: 'blur(2px)', cursor: 'pointer', filter: isDark ? 'drop-shadow(0 2px 12px #23294633)' : 'drop-shadow(0 2px 12px #4ea8ff11)', marginBottom: isMobile ? 8 : 0 }}>
                {f.icon}
                {f.label}
              </div>
            ))}
          </div>
        </section>

        {/* Technologies as Logo Cloud */}
        <section style={{ margin: isMobile ? '1.2rem 0' : '3.2rem 0', background: palette.cardBg, borderRadius: isMobile ? 12 : 26, boxShadow: isMobile ? 'none' : isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff11', padding: isMobile ? '1.2rem 0.7rem' : '3rem 2.5rem', border: `1.5px solid ${palette.border}`, backdropFilter: 'blur(2.5px)' }}>
          <h2 style={{ fontSize: isMobile ? '1.13rem' : '1.28rem', fontWeight: 900, color: '#4ea8ff', marginBottom: isMobile ? 14 : 26, letterSpacing: 0.14, textShadow: '0 2px 8px #4ea8ff11', lineHeight: 1.1 }}>Technologies</h2>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flexWrap: 'wrap', gap: isMobile ? 10 : 32, alignItems: 'center' }}>
            {service.techs.map((t, i) => (
              <span key={i} style={{ background: palette.cardBgGlass, borderRadius: isMobile ? 8 : 14, padding: isMobile ? '0.5rem 1.1rem' : '0.7rem 1.7rem', fontWeight: 900, fontSize: isMobile ? '0.99rem' : '1.16rem', letterSpacing: 0.24, boxShadow: isMobile ? 'none' : isDark ? '0 4px 18px #23294633' : '0 4px 18px #4ea8ff11', display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 16, border: `1.5px solid ${palette.border}`, transition: 'box-shadow 0.2s, transform 0.15s', backdropFilter: 'blur(2px)', cursor: 'pointer', filter: isDark ? 'drop-shadow(0 2px 12px #23294633)' : 'drop-shadow(0 2px 12px #4ea8ff11)', marginBottom: isMobile ? 6 : 0 }}>
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* How We Work Section */}
        <section style={{ margin: isMobile ? '1.2rem 0' : '3.2rem 0', background: isDark ? 'linear-gradient(100deg, #232946 60%, #181c22 100%)' : 'linear-gradient(100deg, #e3e6ea 60%, #f7fafd 100%)', borderRadius: isMobile ? 14 : 32, boxShadow: isMobile ? 'none' : isDark ? '0 12px 48px #23294633' : '0 12px 48px #4ea8ff11', padding: isMobile ? '1.2rem 0.7rem' : '3.2rem 2.8rem', border: `2px solid ${palette.border}`, position: 'relative', overflow: 'hidden', color: palette.textMain }} aria-labelledby="how-we-work-title">
          <h2 id="how-we-work-title" style={{ fontSize: '1.55rem', fontWeight: 900, color: palette.textAccent, marginBottom: 18, letterSpacing: 0.13, textShadow: isDark ? '0 2px 8px #23294633' : '0 2px 8px #4ea8ff11', lineHeight: 1.1, textAlign: 'center' }}>
            How We Work: Partnership, Process & Delivery
          </h2>
          <div style={{ maxWidth: 900, margin: '0 auto', marginBottom: isMobile ? 16 : 32, color: palette.textSubtle, fontWeight: 600, fontSize: isMobile ? '0.99rem' : '1.13rem', textAlign: 'center' }}>
            We operate as your strategic partner—combining robust engagement models, agile execution, and enterprise-grade governance. Our operational workflow ensures risk-managed, transparent, and value-driven automation delivery: on time, on budget, and with full business visibility.
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: isMobile ? 14 : 36,
            alignItems: 'stretch',
            margin: '0 auto',
            maxWidth: 980
          }}>
            <div style={{ background: palette.cardBgGlass, borderRadius: isMobile ? 10 : 22, padding: isMobile ? '1.1rem 0.9rem' : '2.1rem 1.7rem', boxShadow: isMobile ? 'none' : isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff11', border: `1.5px solid ${palette.cardInnerBorder}`, display: 'flex', flexDirection: 'column', gap: isMobile ? 10 : 18, minHeight: isMobile ? 120 : 240, justifyContent: 'flex-start', alignItems: 'flex-start', position: 'relative' }}>
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
            <div style={{ background: palette.cardBgGlass, borderRadius: isMobile ? 10 : 22, padding: isMobile ? '1.1rem 0.9rem' : '2.1rem 1.7rem', boxShadow: isMobile ? 'none' : isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff11', border: `1.5px solid ${palette.cardInnerBorder}`, display: 'flex', flexDirection: 'column', gap: isMobile ? 10 : 18, minHeight: isMobile ? 120 : 260, justifyContent: 'flex-start', alignItems: 'flex-start', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <span style={{ fontSize: '2rem' }} aria-label="Methodology & Communication" role="img">🧭</span>
                <span style={{ fontWeight: 800, fontSize: '1.13rem', color: palette.textAccent }}>Methodology & Communication</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: '1.3rem' }} aria-label="Agile, CMMI L3+" role="img">⚡</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: palette.textMain }}>Agile, CMMI L3+</div>
                  <div style={{ color: palette.textSubtle, fontWeight: 600, fontSize: '0.99rem', marginTop: 2 }}>Iterative, sprint-based delivery with continuous improvement. CMMI L3+ for process maturity and global best practices in automation.</div>
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
        <section style={{ margin: isMobile ? '1.2rem 0' : '3.2rem 0', background: palette.testimonialBg, borderRadius: isMobile ? 14 : 32, padding: isMobile ? '1.2rem 0.7rem' : '3.2rem 2.8rem', boxShadow: isMobile ? 'none' : isDark ? '0 12px 48px #23294633' : '0 12px 48px #4ea8ff11', textAlign: 'center', border: `2.5px solid ${palette.border}`, position: 'relative', overflow: 'hidden', color: palette.textMain }}>
          <div style={{ fontSize: isMobile ? '1.08rem' : '1.38rem', fontWeight: 900, color: palette.textMain, marginBottom: isMobile ? 10 : 22, fontStyle: 'italic', letterSpacing: 0.14, textShadow: isDark ? '0 3px 16px #23294644' : '0 3px 16px #4ea8ff22', position: 'relative', zIndex: 2, lineHeight: 1.3 }}>
            “{testimonial.quote}”
          </div>
          <div style={{ color: palette.textAccent, fontWeight: 900, fontSize: isMobile ? '1rem' : '1.18rem', letterSpacing: 0.14, position: 'relative', zIndex: 2 }}>{testimonial.name} <span style={{ color: palette.textMain, fontWeight: 800 }}>| {testimonial.company}</span></div>
        </section>

        {/* FAQs */}
        <div style={{ margin: isMobile ? '1.2rem 0' : '3.2rem 0', background: palette.cardBg, borderRadius: isMobile ? 12 : 26, boxShadow: isMobile ? 'none' : isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff11', padding: isMobile ? '1.2rem 0.7rem' : '3rem 2.5rem', border: `1.5px solid ${palette.border}`, backdropFilter: 'blur(2.5px)', color: palette.textMain }}>
          <ServiceFAQs faqs={faqs} />
        </div>

        {/* CTA */}
        <section style={{ margin: isMobile ? '2.2rem 0 0 0' : '4.2rem 0 0 0', textAlign: 'center', background: palette.ctaBg, borderRadius: isMobile ? 14 : 32, padding: isMobile ? '1.5rem 0.7rem' : '3.5rem 2.8rem', boxShadow: isMobile ? 'none' : isDark ? '0 12px 48px #23294633' : '0 12px 48px #4ea8ff22', position: 'relative', overflow: 'hidden' }}>
          <a href="/contact" style={{ background: palette.ctaBtn, color: palette.ctaBtnText, fontWeight: 900, fontSize: isMobile ? '1rem' : '1.18rem', borderRadius: 18, padding: isMobile ? '0.8rem 1.5rem' : '1.1rem 2.8rem', textDecoration: 'none', boxShadow: isDark ? '0 8px 32px #23294644' : '0 8px 32px #4ea8ff33', display: 'inline-block', border: `2.5px solid ${palette.ctaBtnBorder}`, letterSpacing: 0.22, backdropFilter: 'blur(2.5px)', cursor: 'pointer', position: 'relative', zIndex: 2, filter: isDark ? 'drop-shadow(0 2px 12px #23294644)' : 'drop-shadow(0 2px 12px #4ea8ff33)', borderImage: 'linear-gradient(90deg, #4ea8ff, #6ea8ff, #cfe8ef, #4ea8ff) 1', transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s' }}
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
            <FaCogs style={{ marginRight: 14, fontSize: isMobile ? '1.1rem' : '1.5rem', verticalAlign: 'middle' }} title="Automation Consultant" />
            Start Your Automation Project
          </a>
          <div style={{ marginTop: isMobile ? 10 : 22, color: palette.textMain, fontSize: isMobile ? '1rem' : '1.18rem', fontWeight: 800, textShadow: isDark ? '0 3px 16px #23294644' : '0 3px 16px #4ea8ff22', position: 'relative', zIndex: 2 }}>Ready to automate your business? Let’s talk about your vision.</div>
        </section>
      </main>
    </div>
    </>
  );
}
