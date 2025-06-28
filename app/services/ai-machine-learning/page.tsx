
"use client";
import React from "react";
import servicesData from "../servicesData";
import { OurProcess, EngagementModels, MethodologyAndCommunication, ServiceFAQs } from "../ServiceDetailSections";

const service = servicesData.find(s => s.slug === "ai-machine-learning");

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

const testimonial = {
  quote: "Megicode delivered a custom AI solution that transformed our business insights and automated key processes. Their expertise and communication were top-notch!",
  name: "Sarah L.",
  company: "FinTech Client"
};

export default function AIMachineLearningDetailPage() {
  if (!service) return null;
  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 1rem', fontFamily: 'Inter, sans-serif' }}>
      {/* Hero Section */}
      <section style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap', marginBottom: 36 }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#4ea8ff', marginBottom: 10 }}>{service.title}</h1>
          <p style={{ fontSize: '1.18rem', color: '#222b3a', marginBottom: 18, fontWeight: 500 }}>{service.description}</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            <span style={{ background: '#e3e6ea', color: '#4ea8ff', borderRadius: 8, padding: '0.3rem 1rem', fontWeight: 700, fontSize: '1.05rem' }}>AI</span>
            <span style={{ background: '#e3e6ea', color: '#4ea8ff', borderRadius: 8, padding: '0.3rem 1rem', fontWeight: 700, fontSize: '1.05rem' }}>Machine Learning</span>
            <span style={{ background: '#e3e6ea', color: '#4ea8ff', borderRadius: 8, padding: '0.3rem 1rem', fontWeight: 700, fontSize: '1.05rem' }}>Automation</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 220, textAlign: 'center' }}>
          <img src="/Ai icon.svg" alt="AI Illustration" style={{ width: 160, maxWidth: '100%', borderRadius: 24, boxShadow: '0 4px 24px #4ea8ff22' }} />
        </div>
      </section>

      {/* Process Stepper */}
      <OurProcess steps={processSteps} />

      {/* Features as Cards */}
      <section style={{ margin: '36px 0' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#4ea8ff', marginBottom: 18 }}>Key Features</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
          {service.features.map((f, i) => (
            <div key={i} style={{ background: '#e3e6ea', borderRadius: 14, padding: '1.1rem 1.2rem', minWidth: 180, flex: 1, fontWeight: 600, color: '#222b3a', boxShadow: '0 1px 4px #4ea8ff11', fontSize: '1.05rem' }}>{f}</div>
          ))}
        </div>
      </section>

      {/* Technologies as Badges */}
      <section style={{ margin: '36px 0' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#4ea8ff', marginBottom: 12 }}>Technologies</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {service.techs.map((t, i) => (
            <span key={i} style={{ background: '#1d2127', color: '#4ea8ff', borderRadius: 8, padding: '0.32rem 1.1rem', fontWeight: 700, fontSize: '1.01rem', letterSpacing: 0.2 }}>{t}</span>
          ))}
        </div>
      </section>

      {/* Engagement Models & Methodology */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, margin: '36px 0' }}>
        <div style={{ flex: 1, minWidth: 260 }}><EngagementModels /></div>
        <div style={{ flex: 1, minWidth: 260 }}><MethodologyAndCommunication /></div>
      </div>

      {/* Testimonial */}
      <section style={{ margin: '36px 0', background: '#e3e6ea', borderRadius: 18, padding: '2rem 1.5rem', boxShadow: '0 2px 12px #4ea8ff11', textAlign: 'center' }}>
        <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#222b3a', marginBottom: 10, fontStyle: 'italic' }}>
          “{testimonial.quote}”
        </div>
        <div style={{ color: '#4ea8ff', fontWeight: 700, fontSize: '1.01rem' }}>{testimonial.name} <span style={{ color: '#222b3a', fontWeight: 500 }}>| {testimonial.company}</span></div>
      </section>

      {/* FAQs */}
      <ServiceFAQs faqs={faqs} />

      {/* CTA */}
      <section style={{ margin: '48px 0 0 0', textAlign: 'center' }}>
        <a href="/contact" style={{ background: '#4ea8ff', color: '#fff', fontWeight: 800, fontSize: '1.18rem', borderRadius: 12, padding: '1rem 2.5rem', textDecoration: 'none', boxShadow: '0 2px 12px #4ea8ff33', transition: 'background 0.2s' }}>Start Your AI Project</a>
        <div style={{ marginTop: 10, color: '#3a4a5d', fontSize: '1.01rem' }}>Ready to unlock the power of AI? Let’s talk about your vision.</div>
      </section>
    </main>
  );
}

// ...removed duplicate export default...
