"use client";
import React from "react";

export function OurProcess({ steps }: { steps: { title: string; desc: string; icon?: string }[] }) {
  return (
    <section style={{ marginTop: 32, marginBottom: 32 }}>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#4ea8ff", marginBottom: 18 }}>Our Process</h2>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        {steps.map((step, i) => (
          <div key={i} style={{ flex: 1, minWidth: 120, textAlign: 'center', position: 'relative' }}>
            <div style={{
              width: 48, height: 48, margin: '0 auto 8px', borderRadius: '50%', background: '#e3e6ea', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #4ea8ff22', fontSize: 26
            }}>
              {step.icon ? <img src={step.icon} alt={step.title} style={{ width: 28, height: 28 }} /> : <span role="img" aria-label="step">🔹</span>}
            </div>
            <div style={{ fontWeight: 700, color: '#4ea8ff', fontSize: '1.05rem', marginBottom: 4 }}>{step.title}</div>
            <div style={{ fontSize: '0.98rem', color: '#444', opacity: 0.85 }}>{step.desc}</div>
            {i < steps.length - 1 && (
              <div style={{ position: 'absolute', right: -6, top: 24, width: 12, height: 2, background: '#4ea8ff55', zIndex: 0 }} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function EngagementModels() {
  const models = [
    { label: 'Fixed Price', icon: '💰', desc: 'Predictable budget, defined scope.' },
    { label: 'Dedicated Team', icon: '🤝', desc: 'Flexible, scalable team extension.' },
    { label: 'Time & Material', icon: '⏱️', desc: 'Agile, transparent billing.' },
  ];
  return (
    <section style={{ marginTop: 32, marginBottom: 32 }}>
      <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#4ea8ff", marginBottom: 10 }}>Engagement Models</h2>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        {models.map((m, i) => (
          <div key={i} style={{ background: '#e3e6ea', borderRadius: 12, padding: '0.7rem 1.2rem', minWidth: 120, textAlign: 'center', boxShadow: '0 1px 4px #4ea8ff11' }}>
            <div style={{ fontSize: 26, marginBottom: 4 }}>{m.icon}</div>
            <div style={{ fontWeight: 700, color: '#4ea8ff', fontSize: '1.01rem' }}>{m.label}</div>
            <div style={{ fontSize: '0.97rem', color: '#444', opacity: 0.8 }}>{m.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function MethodologyAndCommunication() {
  const items = [
    { icon: '⚡', label: 'Agile, CMMI L3+' },
    { icon: '📢', label: 'Transparent Updates' },
    { icon: '🛠️', label: 'Jira, Figma, GitHub' },
  ];
  return (
    <section style={{ marginTop: 32, marginBottom: 32 }}>
      <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#4ea8ff", marginBottom: 10 }}>Methodology & Communication</h2>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        {items.map((item, i) => (
          <div key={i} style={{ background: '#e3e6ea', borderRadius: 12, padding: '0.7rem 1.2rem', minWidth: 120, textAlign: 'center', boxShadow: '0 1px 4px #4ea8ff11' }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{item.icon}</div>
            <div style={{ fontWeight: 700, color: '#4ea8ff', fontSize: '1.01rem' }}>{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ServiceFAQs({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = React.useState<number | null>(null);
  return (
    <section style={{ marginTop: 32, marginBottom: 32 }}>
      <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#4ea8ff", marginBottom: 10 }}>FAQs</h2>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{ marginBottom: 12, borderRadius: 8, background: '#e3e6ea', boxShadow: '0 1px 4px #4ea8ff11' }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', padding: '0.7rem 1rem', fontWeight: 700, color: '#4ea8ff', fontSize: '1.01rem', cursor: 'pointer' }}>
              {faq.q}
            </button>
            {open === i && (
              <div style={{ padding: '0 1rem 0.7rem 1rem', color: '#444', fontSize: '0.98rem' }}>{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
