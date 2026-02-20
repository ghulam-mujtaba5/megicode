"use client";
import React from "react";

import type { ReactNode } from "react";

export function OurProcess({ steps, theme }: { steps: { title: string; desc: string; icon?: string | React.ReactNode }[]; theme?: string }) {
  const isDark = theme === 'dark';
  return (
    <section style={{ marginTop: 32, marginBottom: 32 }}>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#4ea8ff", marginBottom: 18 }}>Our Process</h2>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        {steps.map((step, i) => (
          <div key={i} style={{ flex: 1, minWidth: 120, textAlign: 'center', position: 'relative' }}>
            <div style={{
              width: 48, height: 48, margin: '0 auto 8px', borderRadius: '50%', background: isDark ? '#2a2f45' : '#e3e6ea', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #4ea8ff22', fontSize: 26
            }}>
              {step.icon
                ? (typeof step.icon === 'string'
                    ? <img src={step.icon} alt={step.title} style={{ width: 28, height: 28 }} />
                    : step.icon)
                : <span role="img" aria-label="step">🔹</span>}
            </div>
            <div style={{ fontWeight: 700, color: '#4ea8ff', fontSize: '1.05rem', marginBottom: 4 }}>{step.title}</div>
            <div style={{ fontSize: '0.98rem', color: isDark ? '#c8ccd4' : '#444', opacity: 0.85 }}>{step.desc}</div>
            {i < steps.length - 1 && (
              <div style={{ position: 'absolute', right: -6, top: 24, width: 12, height: 2, background: '#4ea8ff55', zIndex: 0 }} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

import { FaMoneyBillWave, FaUsers, FaRegClock, FaBolt, FaBullhorn, FaTools } from "react-icons/fa";

export function EngagementModels({ theme }: { theme?: string } = {}) {
  const isDark = theme === 'dark';
  return (
    <section style={{ marginTop: 32, marginBottom: 32 }}>
      <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#4ea8ff", marginBottom: 10 }}>Engagement Models</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: '1.3rem' }} aria-label="Fixed Price" role="img">📊</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: isDark ? '#e0e4ec' : '#232946' }}>Fixed Price</div>
            <div style={{ color: isDark ? '#a8b0c0' : '#3a4a5d', fontWeight: 600, fontSize: '0.99rem', marginTop: 2 }}>Defined scope, predictable budget, and milestone-based billing. Best for projects with clear requirements and risk management needs.</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: '1.3rem' }} aria-label="Dedicated Team" role="img">🤝</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: isDark ? '#e0e4ec' : '#232946' }}>Dedicated Team</div>
            <div style={{ color: isDark ? '#a8b0c0' : '#3a4a5d', fontWeight: 600, fontSize: '0.99rem', marginTop: 2 }}>Scalable, cross-functional team extension. Direct access to certified Megicode experts, rapid onboarding, and seamless enterprise collaboration.</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: '1.3rem' }} aria-label="Time & Material" role="img">⏱️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: isDark ? '#e0e4ec' : '#232946' }}>Time & Material</div>
            <div style={{ color: isDark ? '#a8b0c0' : '#3a4a5d', fontWeight: 600, fontSize: '0.99rem', marginTop: 2 }}>Agile, transparent billing for evolving requirements. Ideal for innovation, R&D, and projects with dynamic scope.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MethodologyAndCommunication({ theme }: { theme?: string } = {}) {
  const isDark = theme === 'dark';
  return (
    <section style={{ marginTop: 32, marginBottom: 32 }}>
      <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#4ea8ff", marginBottom: 10 }}>Methodology & Communication</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: '1.3rem' }} aria-label="Agile, CMMI L3+" role="img">⚡</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: isDark ? '#e0e4ec' : '#232946' }}>Agile, CMMI L3+</div>
            <div style={{ color: isDark ? '#a8b0c0' : '#3a4a5d', fontWeight: 600, fontSize: '0.99rem', marginTop: 2 }}>Iterative, sprint-based delivery with continuous improvement. CMMI L3+ for process maturity and global best practices in enterprise IT.</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: '1.3rem' }} aria-label="Transparent Updates" role="img">📢</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: isDark ? '#e0e4ec' : '#232946' }}>Transparent Updates</div>
            <div style={{ color: isDark ? '#a8b0c0' : '#3a4a5d', fontWeight: 600, fontSize: '0.99rem', marginTop: 2 }}>Weekly demos, open communication, and real-time dashboards for full project transparency and stakeholder alignment.</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: '1.3rem' }} aria-label="Jira, Figma, GitHub" role="img">🛠️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: isDark ? '#e0e4ec' : '#232946' }}>Jira, Figma, GitHub</div>
            <div style={{ color: isDark ? '#a8b0c0' : '#3a4a5d', fontWeight: 600, fontSize: '0.99rem', marginTop: 2 }}>Enterprise-grade tools for project tracking, secure design collaboration, and code quality assurance.</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: '1.3rem' }} aria-label="Risk Management & Governance" role="img">🛡️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: isDark ? '#e0e4ec' : '#232946' }}>Risk Management & Governance</div>
            <div style={{ color: isDark ? '#a8b0c0' : '#3a4a5d', fontWeight: 600, fontSize: '0.99rem', marginTop: 2 }}>Proactive risk identification, regulatory compliance (GDPR, ISO 27001), and executive reporting for enterprise assurance.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServiceFAQs({ faqs, theme }: { faqs: { q: string; a: string }[]; theme?: string }) {
  const [open, setOpen] = React.useState<number | null>(null);
  const isDark = theme === 'dark';
  return (
    <section style={{ marginTop: 32, marginBottom: 32 }}>
      <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#4ea8ff", marginBottom: 10 }}>FAQs</h2>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{ marginBottom: 12, borderRadius: 8, background: isDark ? '#1e2233' : '#e3e6ea', boxShadow: '0 1px 4px #4ea8ff11' }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', padding: '0.7rem 1rem', fontWeight: 700, color: '#4ea8ff', fontSize: '1.01rem', cursor: 'pointer' }}>
              {faq.q}
            </button>
            {open === i && (
              <div style={{ padding: '0 1rem 0.7rem 1rem', color: isDark ? '#c8ccd4' : '#444', fontSize: '0.98rem' }}>{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
