import type { Metadata } from 'next';

import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Marketing Company for Startups | Growth Marketing & SEO | Megicode',
  description:
    'Data-driven growth marketing for AI-powered products and SaaS startups. Technical SEO, content marketing, performance ads, conversion optimization, and analytics — we turn traffic into paying users.',
  keywords: [
    'startup growth marketing',
    'SEO for SaaS',
    'growth marketing for AI startups',
    'SaaS content marketing',
    'startup performance marketing',
    'conversion rate optimization',
    'technical SEO agency',
    'growth hacking for startups',
    'marketing companies for startups',
    'marketing agency lead generation',
    'digital growth strategy',
  ],
  openGraph: {
    title: 'Marketing Company for Startups | Growth Marketing & SEO | Megicode',
    description:
      'Data-driven growth marketing for SaaS and AI startups — SEO, content, paid ads & conversion optimization.',
    url: 'https://www.megicode.com/services/growth-marketing-seo',
    images: [
      {
        url: '/meta/services-og.png',
        width: 1200,
        height: 630,
        alt: 'Growth Marketing & SEO | Megicode',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Growth Marketing & SEO for Startups | Data-Driven Growth | Megicode',
    description:
      'Data-driven growth marketing for SaaS and AI startups — SEO, content, paid ads & conversion optimization.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://www.megicode.com/services/growth-marketing-seo',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Growth Marketing & SEO', path: '/services/growth-marketing-seo' },
  ]);
  const service = serviceJsonLd({
    name: 'Growth Marketing & SEO for Startups',
    description:
      'Data-driven growth marketing for AI-powered products and SaaS startups. Technical SEO, content marketing, performance ads, and conversion optimization.',
    path: '/services/growth-marketing-seo',
    category: 'Growth Marketing',
    offers: [
      {
        name: 'Technical SEO & CRO Audit',
        description:
          'Comprehensive site audit, core web vitals optimization, schema validation, and conversion funnel analysis.',
        price: '650',
        priceCurrency: 'USD',
        deliveryTime: '1-2 weeks',
      },
      {
        name: 'Growth Sprint & Lead Engine',
        description:
          'Programmatic SEO, high-converting landing pages, search intent optimization, and analytics setup.',
        price: '2200',
        priceCurrency: 'USD',
        deliveryTime: '4-6 weeks',
      },
      {
        name: 'Monthly SEO & Organic Growth Retainer',
        description:
          'Continuous keyword targeting, technical SEO maintenance, content optimization, and ranking tracking.',
        price: '1500',
        priceCurrency: 'USD',
        deliveryTime: 'Monthly',
      },
    ],
  });
  const faqs = faqJsonLd([
    {
      q: 'How long until we see SEO results?',
      a: 'Technical SEO fixes show impact within 2-4 weeks. Content-driven organic growth typically takes 3-6 months to build momentum, but we set up analytics and paid campaigns for immediate wins while SEO compounds.',
    },
    {
      q: 'Do you run paid ad campaigns?',
      a: 'Yes - we manage Google Ads and Meta Ads campaigns. We handle everything from creative to targeting to bidding optimization, always focused on cost-per-acquisition and ROI.',
    },
    {
      q: 'Can you work with our existing marketing team?',
      a: 'Absolutely. We can supplement your team with specialized SEO, CRO, or paid ads expertise, or run specific campaigns while your team handles other channels.',
    },
    {
      q: 'What industries do you specialize in?',
      a: 'We focus on SaaS, AI-powered products, and tech startups. Our strategies are built for products with digital-first customer acquisition - not traditional retail or local business marketing.',
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
