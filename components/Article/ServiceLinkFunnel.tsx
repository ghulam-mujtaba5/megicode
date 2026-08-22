import React from 'react';
import Link from 'next/link';

interface ServiceLinkFunnelProps {
  title?: string;
  category?: string;
  tags?: string[];
}

export const ServiceLinkFunnel: React.FC<ServiceLinkFunnelProps> = ({
  title = '',
  category = '',
  tags = [],
}) => {
  const combinedText = `${title} ${category} ${tags.join(' ')}`.toLowerCase();

  let targetService = {
    title: 'Custom Software & Platform Development',
    href: '/services/custom-web-development',
    tagline: 'Need a custom web application, enterprise portal, or scalable SaaS platform?',
    description: 'We build production-grade web systems with modern Next.js, TypeScript, and high-performance databases.',
    cta: 'Explore Custom Software Services →',
    badge: 'Enterprise Engineering',
  };

  if (
    combinedText.includes('ai') ||
    combinedText.includes('agent') ||
    combinedText.includes('automation') ||
    combinedText.includes('bot') ||
    combinedText.includes('llm') ||
    combinedText.includes('workflow')
  ) {
    targetService = {
      title: 'AI Automation & Custom AI Agents',
      href: '/services/ai-automation-agents',
      tagline: 'Looking to automate workflows, lead capture, or customer operations with AI?',
      description: 'We design and deploy autonomous AI agents, multi-step n8n pipelines, and custom LLM integrations.',
      cta: 'Explore AI Automation Services →',
      badge: 'High-ROI AI Engineering',
    };
  } else if (
    combinedText.includes('saas') ||
    combinedText.includes('mvp') ||
    combinedText.includes('startup') ||
    combinedText.includes('product') ||
    combinedText.includes('launch')
  ) {
    targetService = {
      title: 'AI SaaS & MVP Development in 4–6 Weeks',
      href: '/services/ai-saas-mvp-development',
      tagline: 'Have an AI or SaaS concept you want to validate and launch fast?',
      description: 'We build launch-ready, scalable SaaS MVPs with authentication, billing, AI features, and high conversion UX.',
      cta: 'Explore SaaS MVP Development →',
      badge: 'Rapid MVP Builder',
    };
  } else if (
    combinedText.includes('data') ||
    combinedText.includes('analytics') ||
    combinedText.includes('bi') ||
    combinedText.includes('dashboard')
  ) {
    targetService = {
      title: 'Data Analytics & Executive BI Dashboards',
      href: '/services/data-analytics',
      tagline: 'Need centralized reporting dashboards and real-time business intelligence?',
      description: 'We build interactive executive dashboards, KPI monitors, and predictive analytics platforms.',
      cta: 'Explore Data Analytics Services →',
      badge: 'Business Intelligence',
    };
  }

  return (
    <div
      style={{
        margin: '2rem 0',
        padding: '1.75rem',
        borderRadius: '16px',
        background: 'linear-gradient(145deg, rgba(20, 24, 39, 0.95), rgba(13, 16, 28, 0.95))',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: '20px',
          background: 'rgba(59, 130, 246, 0.15)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          color: '#60a5fa',
          fontSize: '0.8rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.75rem',
        }}
      >
        {targetService.badge}
      </div>
      <h3
        style={{
          margin: '0 0 0.5rem 0',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#ffffff',
          lineHeight: 1.3,
        }}
      >
        {targetService.tagline}
      </h3>
      <p
        style={{
          margin: '0 0 1.25rem 0',
          color: '#94a3b8',
          fontSize: '0.95rem',
          lineHeight: 1.6,
        }}
      >
        {targetService.description}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <Link
          href={targetService.href}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '10px 20px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.9rem',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'background 0.2s ease',
          }}
        >
          {targetService.cta}
        </Link>
        <Link
          href="/contact"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '10px 18px',
            backgroundColor: 'transparent',
            color: '#cbd5e1',
            fontWeight: 600,
            fontSize: '0.9rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            textDecoration: 'none',
          }}
        >
          Book Discovery Call
        </Link>
      </div>
    </div>
  );
};
