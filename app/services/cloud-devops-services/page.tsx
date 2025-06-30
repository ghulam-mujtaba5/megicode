"use client";
import React from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useInViewAnimation } from "../../../hooks/useInViewAnimation";
import servicesData from "../servicesData";
import { OurProcess, EngagementModels, MethodologyAndCommunication, ServiceFAQs } from "../ServiceDetailSections";
import { SiAmazon, SiDocker, SiKubernetes, SiTerraform, SiGithubactions, SiJenkins, SiGooglecloud } from "react-icons/si";
import { FaCloud, FaServer, FaSync, FaLock, FaCogs, FaLifeRing, FaRocket, FaDatabase } from "react-icons/fa";

import Footer from "../../../components/Footer/Footer";

const service = {
  ...servicesData.find(s => s.slug === "cloud-devops-services"),
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

const processSteps = [
  {
    title: "Assessment & Planning",
    desc: "Infra & cloud goals.",
    icon: <FaDatabase color="#4ea8ff" size={36} title="Assessment & Planning" />
  },
  {
    title: "Architecture & Setup",
    desc: "Cloud & CI/CD setup.",
    icon: <FaCloud color="#4ea8ff" size={36} title="Architecture & Setup" />
  },
  {
    title: "Migration & Automation",
    desc: "Migrate & automate.",
    icon: <FaSync color="#4ea8ff" size={36} title="Migration & Automation" />
  },
  {
    title: "Monitoring & Optimization",
    desc: "Monitor & optimize.",
    icon: <FaCogs color="#4ea8ff" size={36} title="Monitoring & Optimization" />
  },
  {
    title: "Ongoing Support",
    desc: "Continuous improvement.",
    icon: <FaLifeRing color="#4ea8ff" size={36} title="Ongoing Support" />
  }
];

const faqs = [
  { q: "Can you migrate from on-prem to cloud?", a: "Yes, we handle full cloud migrations and hybrid setups." },
  { q: "What DevOps tools do you use?", a: "We use AWS, Azure, Docker, Kubernetes, Terraform, GitHub Actions, Jenkins, and more." },
  { q: "How do you ensure uptime and security?", a: "We implement best practices for monitoring, backups, and security compliance." },
  { q: "Do you offer managed services?", a: "Yes, we provide ongoing management and optimization." }
];

const features = [
  { icon: <FaCloud color="#4ea8ff" size={36} title="Cloud Migration" />, label: "Cloud Migration" },
  { icon: <FaSync color="#4ea8ff" size={36} title="CI/CD Automation" />, label: "CI/CD Automation" },
  { icon: <FaServer color="#4ea8ff" size={36} title="Infrastructure as Code" />, label: "Infrastructure as Code" },
  { icon: <FaLock color="#4ea8ff" size={36} title="Security & Compliance" />, label: "Security & Compliance" },
  { icon: <FaCogs color="#4ea8ff" size={36} title="Monitoring & Optimization" />, label: "Monitoring & Optimization" },
];

const testimonial = {
  quote: "Megicode's DevOps team migrated us to the cloud and automated our deployments, saving us time and money.",
  name: "Liam T.",
  company: "SaaS Platform"
};

export default function CloudDevOpsServicesDetailPage() {
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
          aria-label="Cloud & DevOps Services Detail"
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
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 64, flexWrap: 'wrap', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 3 }}>
            <div style={{ flex: 1, minWidth: 320 }}>
              <h1 style={{ fontSize: '3rem', fontWeight: 900, color: isDark ? '#eaf6ff' : '#fff', marginBottom: 20, letterSpacing: -2, textShadow: isDark ? '0 6px 32px #23294699, 0 1px 0 #23294644' : '0 6px 32px #4ea8ff66, 0 1px 0 #fff2', lineHeight: 1.08 }}>{service.title}</h1>
              <p style={{ fontSize: '1.22rem', color: isDark ? '#b0c4d8' : '#eaf6ff', marginBottom: 28, fontWeight: 600, lineHeight: 1.75, textShadow: isDark ? '0 3px 16px #23294644' : '0 3px 16px #4ea8ff33', letterSpacing: 0.01 }}>{service.description}</p>
              <a
                href="/contact"
                style={{
                  background: palette.ctaBtn,
                  color: palette.ctaBtnText,
                  fontWeight: 900,
                  fontSize: '1.18rem',
                  borderRadius: 18,
                  padding: '1.1rem 2.8rem',
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
              >Start Your Cloud Project</a>
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
                  src="/meta/rm.svg"
                  alt="Cloud & DevOps RM Illustration"
                  style={{ width: 180, maxWidth: '100%', borderRadius: 32, boxShadow: '0 8px 32px #4ea8ff33', background: isDark ? 'rgba(36,41,54,0.98)' : '#fff', padding: 18, border: `2px solid ${palette.cardInnerBorder}` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Process Stepper */}
        <section style={{ margin: '3.2rem 0', background: palette.cardBg, borderRadius: 26, boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff11', padding: '3rem 2.5rem', border: `1.5px solid ${palette.border}`, backdropFilter: 'blur(2.5px)' }}>
          <h2 style={{ fontSize: '1.38rem', fontWeight: 900, color: palette.textAccent, marginBottom: 36, letterSpacing: 0.14, textShadow: isDark ? '0 2px 8px #23294633' : '0 2px 8px #4ea8ff11', lineHeight: 1.1, textAlign: 'center' }}>Our Process</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 0, flexWrap: 'wrap', margin: '0 auto', maxWidth: 980 }}>
            {processSteps.map((step, idx) => (
              <div key={idx} style={{ flex: 1, minWidth: 160, maxWidth: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', margin: '0 8px', position: 'relative' }}>
                <div style={{ background: isDark ? '#232946' : '#f7fafd', borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, border: `2.5px solid ${palette.border}`, boxShadow: isDark ? '0 4px 18px #23294633' : '0 4px 18px #4ea8ff11' }}>
                  {step.icon}
                </div>
                <div style={{ fontWeight: 900, fontSize: '1.08rem', color: palette.textAccent, marginBottom: 6 }}>{step.title}</div>
                <div style={{ color: palette.textSubtle, fontWeight: 600, fontSize: '0.99rem', marginBottom: 0 }}>{step.desc}</div>
                {idx < processSteps.length - 1 && (
                  <div style={{ position: 'absolute', right: -8, top: 32, width: 24, height: 2, background: isDark ? '#263040' : '#eaf6ff', opacity: 0.7, zIndex: 1, left: '100%', marginLeft: 0, marginRight: 0, display: 'block' }} />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Features as Cards */}
        <section style={{ margin: '3.2rem 0' }}>
          <h2 style={{ fontSize: '1.38rem', fontWeight: 900, color: '#4ea8ff', marginBottom: 26, letterSpacing: 0.14, textShadow: '0 2px 8px #4ea8ff11', lineHeight: 1.1 }}>What You Get</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
            {features.map((f, i) => (
              <div key={i} style={{ background: palette.cardBgGlass, borderRadius: 22, padding: '1.7rem 1.8rem', minWidth: 180, flex: 1, fontWeight: 900, color: palette.textMain, boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff11', fontSize: '1.16rem', display: 'flex', alignItems: 'center', gap: 22, border: `1.5px solid ${palette.border}`, transition: 'box-shadow 0.2s, transform 0.15s', backdropFilter: 'blur(2px)', cursor: 'pointer', filter: isDark ? 'drop-shadow(0 2px 12px #23294633)' : 'drop-shadow(0 2px 12px #4ea8ff11)' }}>
                {f.icon}
                {f.label}
              </div>
            ))}
          </div>
        </section>

        {/* Technologies as Logo Cloud */}
        <section style={{ margin: '3.2rem 0', background: palette.cardBg, borderRadius: 26, boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff11', padding: '3rem 2.5rem', border: `1.5px solid ${palette.border}`, backdropFilter: 'blur(2.5px)' }}>
          <h2 style={{ fontSize: '1.28rem', fontWeight: 900, color: '#4ea8ff', marginBottom: 26, letterSpacing: 0.14, textShadow: '0 2px 8px #4ea8ff11', lineHeight: 1.1 }}>Technologies</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center' }}>
            {service.techs.map((t, i) => {
              let Icon = null;
              let color = undefined;
              switch (t.toLowerCase()) {
                case "aws": Icon = SiAmazon; color = "#FF9900"; break;
                case "azure": Icon = FaCloud; color = "#0089D6"; break;
                case "docker": Icon = SiDocker; color = "#2496ED"; break;
                case "kubernetes": Icon = SiKubernetes; color = "#326CE5"; break;
                case "terraform": Icon = SiTerraform; color = "#623CE4"; break;
                case "github actions": Icon = SiGithubactions; color = "#2088FF"; break;
                case "jenkins": Icon = SiJenkins; color = "#D24939"; break;
                case "google cloud": Icon = SiGooglecloud; color = "#4285F4"; break;
                default: Icon = null; color = undefined;
              }
              return (
                <span key={i} style={{ background: palette.cardBgGlass, borderRadius: 14, padding: '0.7rem 1.7rem', fontWeight: 900, fontSize: '1.16rem', letterSpacing: 0.24, boxShadow: isDark ? '0 4px 18px #23294633' : '0 4px 18px #4ea8ff11', display: 'flex', alignItems: 'center', gap: 16, border: `1.5px solid ${palette.border}`, transition: 'box-shadow 0.2s, transform 0.15s', backdropFilter: 'blur(2px)', cursor: 'pointer', filter: isDark ? 'drop-shadow(0 2px 12px #23294633)' : 'drop-shadow(0 2px 12px #4ea8ff11)' }}>
                  {Icon ? (
                    <Icon size={40} style={{ marginRight: 12 }} title={t} color={color} />
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
        <section style={{ margin: '3.2rem 0', background: isDark ? 'linear-gradient(100deg, #232946 60%, #181c22 100%)' : 'linear-gradient(100deg, #e3e6ea 60%, #f7fafd 100%)', borderRadius: 32, boxShadow: isDark ? '0 12px 48px #23294633' : '0 12px 48px #4ea8ff11', padding: '3.2rem 2.8rem', border: `2px solid ${palette.border}`, position: 'relative', overflow: 'hidden', color: palette.textMain }} aria-labelledby="how-we-work-title">
          <h2 id="how-we-work-title" style={{ fontSize: '1.55rem', fontWeight: 900, color: palette.textAccent, marginBottom: 18, letterSpacing: 0.13, textShadow: isDark ? '0 2px 8px #23294633' : '0 2px 8px #4ea8ff11', lineHeight: 1.1, textAlign: 'center' }}>
            How We Work: Partnership, Process & Delivery
          </h2>
          <div style={{ maxWidth: 900, margin: '0 auto', marginBottom: 32, color: palette.textSubtle, fontWeight: 600, fontSize: '1.13rem', textAlign: 'center' }}>
            We operate as your strategic partner—combining robust engagement models, agile execution, and enterprise-grade governance. Our operational workflow ensures risk-managed, transparent, and value-driven cloud and DevOps delivery: on time, on budget, and with full business visibility.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 36, alignItems: 'stretch', margin: '0 auto', maxWidth: 980 }}>
            <div style={{ background: palette.cardBgGlass, borderRadius: 22, padding: '2.1rem 1.7rem', boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff11', border: `1.5px solid ${palette.cardInnerBorder}`, display: 'flex', flexDirection: 'column', gap: 18, minHeight: 240, justifyContent: 'flex-start', alignItems: 'flex-start', position: 'relative' }}>
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
            <div style={{ background: palette.cardBgGlass, borderRadius: 22, padding: '2.1rem 1.7rem', boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff11', border: `1.5px solid ${palette.cardInnerBorder}`, display: 'flex', flexDirection: 'column', gap: 18, minHeight: 260, justifyContent: 'flex-start', alignItems: 'flex-start', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <span style={{ fontSize: '2rem' }} aria-label="Methodology & Communication" role="img">🧭</span>
                <span style={{ fontWeight: 800, fontSize: '1.13rem', color: palette.textAccent }}>Methodology & Communication</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: '1.3rem' }} aria-label="Agile, CMMI L3+" role="img">⚡</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: palette.textMain }}>Agile, CMMI L3+</div>
                  <div style={{ color: palette.textSubtle, fontWeight: 600, fontSize: '0.99rem', marginTop: 2 }}>Iterative, sprint-based delivery with continuous improvement. CMMI L3+ for process maturity and global best practices in cloud and DevOps.</div>
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
        <section style={{ margin: '3.2rem 0', background: palette.testimonialBg, borderRadius: 32, padding: '3.2rem 2.8rem', boxShadow: isDark ? '0 12px 48px #23294633' : '0 12px 48px #4ea8ff11', textAlign: 'center', border: `2.5px solid ${palette.border}`, position: 'relative', overflow: 'hidden', color: palette.textMain }}>
          <div style={{ fontSize: '1.38rem', fontWeight: 900, color: palette.textMain, marginBottom: 22, fontStyle: 'italic', letterSpacing: 0.14, textShadow: isDark ? '0 3px 16px #23294644' : '0 3px 16px #4ea8ff22', position: 'relative', zIndex: 2, lineHeight: 1.3 }}>
            “{testimonial.quote}”
          </div>
          <div style={{ color: palette.textAccent, fontWeight: 900, fontSize: '1.18rem', letterSpacing: 0.14, position: 'relative', zIndex: 2 }}>{testimonial.name} <span style={{ color: palette.textMain, fontWeight: 800 }}>| {testimonial.company}</span></div>
        </section>

        {/* FAQs */}
        <div style={{ margin: '3.2rem 0', background: palette.cardBg, borderRadius: 26, boxShadow: isDark ? '0 8px 32px #23294633' : '0 8px 32px #4ea8ff11', padding: '3rem 2.5rem', border: `1.5px solid ${palette.border}`, backdropFilter: 'blur(2.5px)', color: palette.textMain }}>
          <ServiceFAQs faqs={faqs} />
        </div>

        {/* CTA */}
        <section style={{ margin: '4.2rem 0 0 0', textAlign: 'center', background: palette.ctaBg, borderRadius: 32, padding: '3.5rem 2.8rem', boxShadow: isDark ? '0 12px 48px #23294633' : '0 12px 48px #4ea8ff22', position: 'relative', overflow: 'hidden' }}>
          <a href="/contact" style={{ background: palette.ctaBtn, color: palette.ctaBtnText, fontWeight: 900, fontSize: '1.18rem', borderRadius: 18, padding: '1.1rem 2.8rem', textDecoration: 'none', boxShadow: isDark ? '0 8px 32px #23294644' : '0 8px 32px #4ea8ff33', display: 'inline-block', border: `2.5px solid ${palette.ctaBtnBorder}`, letterSpacing: 0.22, backdropFilter: 'blur(2.5px)', cursor: 'pointer', position: 'relative', zIndex: 2, filter: isDark ? 'drop-shadow(0 2px 12px #23294644)' : 'drop-shadow(0 2px 12px #4ea8ff33)', borderImage: 'linear-gradient(90deg, #4ea8ff, #6ea8ff, #cfe8ef, #4ea8ff) 1', transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s' }}
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
            <FaCloud style={{ marginRight: 14, fontSize: '1.5rem', verticalAlign: 'middle' }} title="Cloud Consultant" />
            Start Your Cloud Project
          </a>
          <div style={{ marginTop: 22, color: palette.textMain, fontSize: '1.18rem', fontWeight: 800, textShadow: isDark ? '0 3px 16px #23294644' : '0 3px 16px #4ea8ff22', position: 'relative', zIndex: 2 }}>Ready to modernize your infrastructure? Let’s talk about your vision.</div>
        </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
