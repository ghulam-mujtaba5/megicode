
"use client";
import React from "react";
import servicesData from "../servicesData";
import { OurProcess, EngagementModels, MethodologyAndCommunication, ServiceFAQs } from "../ServiceDetailSections";

const service = servicesData.find(s => s.slug === "ui-ux-product-design");

const processSteps = [
  { title: "Research & Discovery", desc: "User & business research.", icon: "/IconSystem/requirements.svg" },
  { title: "Wireframing & Prototyping", desc: "Flows & prototypes.", icon: "/IconSystem/design.svg" },
  { title: "UI/UX Design", desc: "Visual & UX design.", icon: "/IconSystem/development.svg" },
  { title: "Usability Testing", desc: "Test & iterate.", icon: "/IconSystem/deploy.svg" },
  { title: "Handoff & Support", desc: "Dev handoff & support.", icon: "/IconSystem/support.svg" }
];

const faqs = [
  { q: "Do you provide design systems?", a: "Yes, we create scalable design systems for consistency and efficiency." },
  { q: "Can you work with our branding?", a: "Absolutely. We align all designs with your brand guidelines." },
  { q: "What tools do you use?", a: "Figma, Adobe XD, Sketch, InVision, Zeplin, and more." },
  { q: "Do you test with real users?", a: "Yes, usability testing is a core part of our process." }
];

const testimonial = {
  quote: "Megicode's design team elevated our product's UX and brand, leading to higher user engagement.",
  name: "Emily W.",
  company: "EdTech Platform"
};

export default function UIUXProductDesignDetailPage() {
  if (!service) return null;
  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 1rem', fontFamily: 'Inter, sans-serif' }}>
      {/* Hero Section */}
      <section style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap', marginBottom: 36 }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#4ea8ff', marginBottom: 10 }}>{service.title}</h1>
          <p style={{ fontSize: '1.18rem', color: '#222b3a', marginBottom: 18, fontWeight: 500 }}>{service.description}</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            <span style={{ background: '#e3e6ea', color: '#4ea8ff', borderRadius: 8, padding: '0.3rem 1rem', fontWeight: 700, fontSize: '1.05rem' }}>UI/UX</span>
            <span style={{ background: '#e3e6ea', color: '#4ea8ff', borderRadius: 8, padding: '0.3rem 1rem', fontWeight: 700, fontSize: '1.05rem' }}>Design</span>
            <span style={{ background: '#e3e6ea', color: '#4ea8ff', borderRadius: 8, padding: '0.3rem 1rem', fontWeight: 700, fontSize: '1.05rem' }}>Branding</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 220, textAlign: 'center' }}>
          <img src="/Ui&Ux-icon.svg" alt="UI/UX Illustration" style={{ width: 160, maxWidth: '100%', borderRadius: 24, boxShadow: '0 4px 24px #4ea8ff22' }} />
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
        <a href="/contact" style={{ background: '#4ea8ff', color: '#fff', fontWeight: 800, fontSize: '1.18rem', borderRadius: 12, padding: '1rem 2.5rem', textDecoration: 'none', boxShadow: '0 2px 12px #4ea8ff33', transition: 'background 0.2s' }}>Start Your Design Project</a>
        <div style={{ marginTop: 10, color: '#3a4a5d', fontSize: '1.01rem' }}>Ready to elevate your product? Let’s talk about your vision.</div>
      </section>
    </main>
  );
}
