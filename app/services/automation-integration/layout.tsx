import type { Metadata } from 'next';
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Business Automation & API Integration Services | Save 100+ Hours/Month',
  description: 'Eliminate manual workflows and connect your systems. Megicode delivers custom workflow automation, API integrations, ETL pipelines & RPA solutions using Python, Zapier, Make & Node.js — saving businesses 100+ hours per month.',
  keywords: ['business process automation services', 'API integration company', 'workflow automation consulting', 'RPA development services', 'ETL pipeline development', 'Zapier automation experts', 'custom API development', 'process optimization consulting', 'data integration services', 'automation agency Pakistan'],
  openGraph: {
    title: 'Business Automation & API Integration | Save 100+ Hours/Month | Megicode',
    description: 'Eliminate manual workflows and connect your systems. Custom automation, API integrations & RPA solutions.',
    url: 'https://megicode.com/services/automation-integration',
    images: [{ url: '/meta/services-og.png', width: 1200, height: 630, alt: 'Automation & Integration | Megicode' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Automation & API Integration | Save 100+ Hours/Month | Megicode',
    description: 'Eliminate manual workflows and connect your systems. Custom automation, API integrations & RPA solutions.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://megicode.com/services/automation-integration',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Automation & Integration', path: '/services/automation-integration' },
  ]);
  const service = serviceJsonLd({
    name: 'Automation & Integration',
    description: 'Workflow automation, API integration, ETL pipelines, and robotic process automation.',
    path: '/services/automation-integration',
    category: 'Business Automation',
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      {children}
    </>
  );
}
