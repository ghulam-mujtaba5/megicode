import React from 'react';
import Link from 'next/link';

export type CoreMoneyPage =
  | '/services/ai-automation-agents'
  | '/services/ai-saas-mvp-development'
  | '/services/custom-web-development';

export interface ServiceFunnelTarget {
  title: string;
  href: CoreMoneyPage;
  tagline: string;
  description: string;
  cta: string;
  badge: string;
  contactServiceParam: 'ai-automation-agents' | 'lean-ai-saas-mvp' | 'starter-business-platform';
}

export const SERVICE_AI_AUTOMATION: ServiceFunnelTarget = {
  title: 'AI Automation & Custom AI Agents',
  href: '/services/ai-automation-agents',
  tagline: 'Looking to automate workflows, lead capture, or customer operations with AI?',
  description:
    'We design and deploy autonomous AI agents, multi-step n8n pipelines, and custom LLM integrations with measurable ROI.',
  cta: 'Explore AI Automation Services →',
  badge: 'High-ROI AI Engineering',
  contactServiceParam: 'ai-automation-agents',
};

export const SERVICE_AI_SAAS_MVP: ServiceFunnelTarget = {
  title: 'AI SaaS & MVP Development in 4–6 Weeks',
  href: '/services/ai-saas-mvp-development',
  tagline: 'Have an AI or SaaS concept you want to validate and launch fast?',
  description:
    'We build launch-ready, scalable SaaS MVPs with authentication, billing, AI features, and high-conversion UX.',
  cta: 'Explore SaaS MVP Development →',
  badge: 'Rapid MVP Builder',
  contactServiceParam: 'lean-ai-saas-mvp',
};

export const SERVICE_CUSTOM_WEB: ServiceFunnelTarget = {
  title: 'Custom Software & Platform Development',
  href: '/services/custom-web-development',
  tagline: 'Need a custom web application, enterprise portal, or scalable SaaS platform?',
  description:
    'We build production-grade web systems, high-traffic portals, and cloud backends with Next.js, TypeScript, and modern databases.',
  cta: 'Explore Custom Software Services →',
  badge: 'Enterprise Engineering',
  contactServiceParam: 'starter-business-platform',
};

/**
 * Deterministic Reverse-Silo 51-Article Mapping Matrix
 * Routes 100% of published insights strictly into the 3 core money pages:
 * - /services/ai-automation-agents (17 articles)
 * - /services/ai-saas-mvp-development (18 articles)
 * - /services/custom-web-development (16 articles)
 */
const AI_AUTOMATION_SLUGS = new Set([
  'ai-agent-development-for-business-what-to-automate-first',
  'llm-integration-guide-for-startups',
  'rag-chatbot-development-business-knowledge',
  'ai-chatbot-customer-support-features-use-cases-build-plan',
  'custom-ai-model-vs-ai-api-startup-guide',
  'add-ai-features-to-existing-app',
  'business-process-automation-ai-workflows',
  'crm-automation-for-startups-stop-losing-leads',
  'n8n-zapier-custom-automation',
  'ai-reporting-dashboard-business-data',
  'lead-generation-automation-service-businesses',
  'whatsapp-automation-for-businesses-use-cases',
  'appointment-booking-automation-clinics-agencies-consultants',
  'data-entry-automation-remove-repetitive-work',
  'ecommerce-automation-workflows',
  'ai-tools-for-small-businesses',
  'digital-transformation-roadmap-growing-businesses',
]);

const AI_SAAS_MVP_SLUGS = new Set([
  'build-ai-saas-mvp-without-wasting-budget',
  'ai-product-roadmap-for-founders',
  'ai-saas-security-checklist-founders',
  'ai-software-production-ready-checklist',
  'saas-mvp-development-cost-guide',
  'startup-mvp-scope-what-to-build-first',
  'best-tech-stack-for-saas-startups-2026',
  'nextjs-saas-development-modern-web-apps',
  'admin-dashboard-development-features-saas',
  'marketplace-platform-development-trust-based-platform',
  'multi-tenant-saas-architecture-founders',
  'saas-subscription-payments-plan-before-development',
  'choose-saas-development-company-startup',
  'saas-launch-checklist-before-going-live',
  'ai-powered-mobile-app-ideas-startups',
  'mobile-app-mvp-checklist-before-launch',
  'ux-design-for-ai-products',
  'product-analytics-for-mvps',
]);

const CUSTOM_WEB_SLUGS = new Set([
  'react-native-vs-flutter-startup-app',
  'push-notifications-real-time-features-mobile-apps',
  'offline-first-mobile-apps',
  'mobile-app-performance-optimization',
  'cloud-architecture-for-startups',
  'cicd-pipeline-for-startups',
  'devops-monitoring-founders-track-after-launch',
  'business-intelligence-dashboard-kpis',
  'technical-seo-for-saas-websites',
  'design-systems-for-startups',
  'clinic-management-software-features',
  'university-portal-development-students-use',
  'real-estate-software-development-portals-crm-automation',
  'education-saas-development-learning-platforms',
  'custom-software-vs-off-the-shelf-tools',
  'property-lease-management-software',
]);

/**
 * Returns the matching Core Money Page target for any insight article.
 * Guarantees 100% deterministic resolution for all 51 published articles,
 * and semantic heuristic fallback for draft / dynamic articles.
 */
export function getServiceForArticle(
  slugOrId?: string,
  category?: string,
  tags?: string[]
): ServiceFunnelTarget {
  const normalizedSlug = (slugOrId || '')
    .toLowerCase()
    .trim()
    .replace(/^\/insights\//, '')
    .replace(/^\//, '');

  if (AI_AUTOMATION_SLUGS.has(normalizedSlug)) {
    return SERVICE_AI_AUTOMATION;
  }
  if (AI_SAAS_MVP_SLUGS.has(normalizedSlug)) {
    return SERVICE_AI_SAAS_MVP;
  }
  if (CUSTOM_WEB_SLUGS.has(normalizedSlug)) {
    return SERVICE_CUSTOM_WEB;
  }

  // Fallback heuristic for dynamically created or unmapped articles
  const combined = `${normalizedSlug} ${category || ''} ${(tags || []).join(' ')}`.toLowerCase();

  if (
    combined.includes('agent') ||
    combined.includes('automation') ||
    combined.includes('n8n') ||
    combined.includes('zapier') ||
    combined.includes('bot') ||
    combined.includes('workflow') ||
    combined.includes('crm') ||
    combined.includes('whatsapp')
  ) {
    return SERVICE_AI_AUTOMATION;
  }

  if (
    combined.includes('saas') ||
    combined.includes('mvp') ||
    combined.includes('startup') ||
    combined.includes('product') ||
    combined.includes('launch') ||
    combined.includes('subscription') ||
    combined.includes('dashboard')
  ) {
    return SERVICE_AI_SAAS_MVP;
  }

  return SERVICE_CUSTOM_WEB;
}

export interface ServiceLinkFunnelProps {
  slug?: string;
  slugOrId?: string;
  title?: string;
  category?: string;
  tags?: string[];
}

export const ServiceLinkFunnel: React.FC<ServiceLinkFunnelProps> = ({
  slug,
  slugOrId,
  title = '',
  category = '',
  tags = [],
}) => {
  const targetService = getServiceForArticle(slug || slugOrId || title, category, tags);

  return (
    <aside
      aria-label="Recommended Megicode Service"
      style={{
        margin: '2.5rem 0',
        padding: '2rem',
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
          fontSize: '1.35rem',
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
          href={`/contact?service=${targetService.contactServiceParam}`}
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
    </aside>
  );
};

export default ServiceLinkFunnel;
