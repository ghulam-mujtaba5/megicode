import type { Metadata } from 'next';

import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'SaaS MVP Development Company | Build AI SaaS in 4-6 Weeks | Megicode',
  description:
    'Launch your AI SaaS MVP fast with production-ready Next.js architecture, Stripe billing, multi-tenancy, and LLM integrations. Fixed-timeline delivery for startup founders.',
  keywords: [
    'SaaS MVP development company',
    'build SaaS product',
    'MVP development agency',
    'SaaS tech stack',
    'AI SaaS development company',
    'AI SaaS MVP builder',
    'Next.js SaaS development',
    'hire developers for SaaS MVP',
    'custom SaaS software development',
    'technical cofounder for startups',
  ],
  openGraph: {
    title: 'SaaS MVP Development Company | Build AI SaaS in 4-6 Weeks | Megicode',
    description:
      'Launch your AI SaaS MVP fast with production-ready architecture, Stripe billing, multi-tenancy, and LLM integrations.',
    url: 'https://www.megicode.com/services/ai-saas-mvp-development',
    images: [
      {
        url: '/meta/services-og.png',
        width: 1200,
        height: 630,
        alt: 'SaaS MVP Development Company | Megicode',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaaS MVP Development Company | Build AI SaaS in 4-6 Weeks | Megicode',
    description:
      'Launch your AI SaaS MVP fast with production-ready architecture, Stripe billing, multi-tenancy, and LLM integrations.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://www.megicode.com/services/ai-saas-mvp-development',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'AI-Powered Product Development', path: '/services/ai-saas-mvp-development' },
  ]);
  const service = serviceJsonLd({
    name: 'AI-Powered Product Development',
    description:
      'Build AI-first SaaS products with custom ML models, GPT/LLM integration, RAG systems, and AI agents.',
    path: '/services/ai-saas-mvp-development',
    category: 'AI Development',
    offers: [
      {
        name: 'MVP Roadmap',
        description:
          'Feature scope, architecture, build sequence, AI feature planning, budget logic, and launch roadmap.',
        price: '400',
        priceCurrency: 'USD',
        deliveryTime: '1-2 weeks',
      },
      {
        name: 'Lean AI SaaS MVP',
        description:
          'A focused first version with core product flow, auth, dashboard, AI integration, and deployment.',
        price: '4500',
        priceCurrency: 'USD',
        deliveryTime: '4-8 weeks',
      },
      {
        name: 'Core AI SaaS MVP',
        description:
          'UX and full development, AI feature integration, Stripe payments, admin panel, and launch support.',
        price: '6500',
        priceCurrency: 'USD',
        deliveryTime: '6-10 weeks',
      },
      {
        name: 'Advanced AI SaaS MVP',
        description:
          'Complex multi-tenant architecture, advanced AI logic, integrations, and scale-ready launch plan.',
        price: '12000',
        priceCurrency: 'USD',
        deliveryTime: '8-14+ weeks',
      },
    ],
  });
  const faqs = faqJsonLd([
    {
      q: 'How do you ensure data privacy and security?',
      a: 'We follow strict security protocols, comply with GDPR, and use secure cloud infrastructure for all AI projects.',
    },
    {
      q: 'Can you work with our existing data and systems?',
      a: 'Yes, we specialize in integrating AI solutions with your current tech stack and data sources.',
    },
    {
      q: 'What is the typical project timeline?',
      a: 'AI projects usually take 6-16 weeks, depending on complexity and data readiness.',
    },
    {
      q: 'Do you provide post-launch support?',
      a: 'Absolutely. We offer ongoing monitoring, retraining, and support packages.',
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqs) }}
      />
      {children}
    </>
  );
}
