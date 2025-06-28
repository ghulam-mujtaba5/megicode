
"use client";
import React from "react";
import servicesData from "../servicesData";
import { OurProcess, EngagementModels, MethodologyAndCommunication, ServiceFAQs } from "../ServiceDetailSections";

const service = servicesData.find(s => s.slug === "mobile-app-solutions");

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

const testimonial = {
  quote: "Megicode's mobile team delivered a beautiful, high-performance app that our users love!",
  name: "Alex R.",
  company: "HealthTech Startup"
};

export default function MobileAppSolutionsDetailPage() {
  if (!service) return null;
  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 1rem', fontFamily: 'Inter, sans-serif' }}>
      {/* Hero Section */}
      <section style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap', marginBottom: 36 }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#4ea8ff', marginBottom: 10 }}>{service.title}</h1>
          <p style={{ fontSize: '1.18rem', color: '#222b3a', marginBottom: 18, fontWeight: 500 }}>{service.description}</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            <span style={{ background: '#e3e6ea', color: '#4ea8ff', borderRadius: 8, padding: '0.3rem 1rem', fontWeight: 700, fontSize: '1.05rem' }}>Mobile</span>
            <span style={{ background: '#e3e6ea', color: '#4ea8ff', borderRadius: 8, padding: '0.3rem 1rem', fontWeight: 700, fontSize: '1.05rem' }}>iOS</span>
            <span style={{ background: '#e3e6ea', color: '#4ea8ff', borderRadius: 8, padding: '0.3rem 1rem', fontWeight: 700, fontSize: '1.05rem' }}>Android</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 220, textAlign: 'center' }}>
          <img src="/mobile app icon.svg" alt="Mobile App Illustration" style={{ width: 160, maxWidth: '100%', borderRadius: 24, boxShadow: '0 4px 24px #4ea8ff22' }} />
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
        <a href="/contact" style={{ background: '#4ea8ff', color: '#fff', fontWeight: 800, fontSize: '1.18rem', borderRadius: 12, padding: '1rem 2.5rem', textDecoration: 'none', boxShadow: '0 2px 12px #4ea8ff33', transition: 'background 0.2s' }}>Start Your Mobile Project</a>
        <div style={{ marginTop: 10, color: '#3a4a5d', fontSize: '1.01rem' }}>Ready to launch your app? Let’s talk about your vision.</div>
      </section>
    </main>
  );
}
