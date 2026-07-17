import type { Metadata } from 'next';

import { breadcrumbJsonLd, serviceJsonLd } from '@/lib/metadata';

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
        name: 'Starter Audit',
        description:
          'Technical SEO, funnel clarity, analytics, conversion path, and priority fix audit for websites and software businesses.',
      },
      {
        name: 'Website + SEO + Lead Generation',
        description:
          'Search-focused website improvements, proof placement, tracking setup, content direction, and lead-generation CTA paths.',
      },
    ],
  });
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
      {children}
    </>
  );
}
