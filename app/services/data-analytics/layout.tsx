import type { Metadata } from 'next';

import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Data Analytics & BI Dashboard Development Services | Megicode',
  description:
    'Turn raw business data into actionable decision engines. Megicode builds custom executive dashboards, real-time KPI tracking, and AI-powered business intelligence platforms.',
  keywords: [
    'data analytics development services',
    'business intelligence dashboard development',
    'admin dashboard development',
    'AI reporting dashboard',
    'KPI business intelligence',
    'custom BI dashboards for SaaS',
    'business intelligence dashboard',
    'executive reporting dashboards',
  ],
  openGraph: {
    title: 'Data Analytics & BI Dashboard Development Services | Megicode',
    description:
      'Custom executive dashboards, real-time KPI tracking, and AI-powered business intelligence platforms.',
    url: 'https://www.megicode.com/services/data-analytics',
    images: [
      {
        url: '/meta/services-og.png',
        width: 1200,
        height: 630,
        alt: 'Data Analytics & BI Dashboard Development | Megicode',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Data Analytics & BI Dashboard Development Services | Megicode',
    description:
      'Custom executive dashboards, real-time KPI tracking, and AI-powered business intelligence platforms.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://www.megicode.com/services/data-analytics',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'AI Integration & Data Intelligence', path: '/services/data-analytics' },
  ]);
  const service = serviceJsonLd({
    name: 'AI Integration & Data Intelligence',
    description:
      'Add AI capabilities to existing products — GPT chatbots, smart search, recommendation engines, and AI-driven analytics.',
    path: '/services/data-analytics',
    category: 'AI Integration',
    offers: [
      {
        name: 'BI Dashboard Starter',
        description: 'Executive dashboard, KPI tracking, and automated data pipeline integration.',
        price: '1800',
        priceCurrency: 'USD',
        deliveryTime: '2-4 weeks',
      },
      {
        name: 'Custom AI Analytics Platform',
        description:
          'Unified multi-source data warehouse, predictive analytics models, and custom reporting suites.',
        price: '3800',
        priceCurrency: 'USD',
        deliveryTime: '4-8 weeks',
      },
      {
        name: 'Managed Data Intelligence',
        description:
          'Data pipeline maintenance, model retraining, and monthly business intelligence reporting.',
        price: '950',
        priceCurrency: 'USD',
        deliveryTime: 'Monthly',
      },
    ],
  });
  const faqs = faqJsonLd([
    {
      q: 'Can you connect to all our data sources?',
      a: 'Yes, we integrate with all major databases, cloud services, and enterprise systems to provide unified analytics.',
    },
    {
      q: 'How secure is our business data?',
      a: 'We implement enterprise-grade security measures, comply with GDPR and SOC2, and follow strict data governance protocols.',
    },
    {
      q: 'Do you provide training for our team?',
      a: 'Yes, we offer comprehensive training programs to ensure your team can effectively use and maintain the analytics solutions.',
    },
    {
      q: 'Can dashboards be customized?',
      a: 'Absolutely. All dashboards and reports are tailored to your KPIs and branding.',
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
