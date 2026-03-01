import type { Metadata } from 'next';
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'AI Automation for Businesses | Intelligent Workflow Automation | Megicode',
  description: 'Replace manual work with AI-powered automation. Megicode builds intelligent workflow automation, AI chatbots, smart integrations, and process optimization for SMEs — saving businesses 100+ hours per month.',
  keywords: ['AI automation for business', 'intelligent workflow automation', 'AI chatbot development', 'business process automation', 'AI for SMEs', 'workflow AI integration', 'smart business automation', 'AI-powered operations'],
  openGraph: {
    title: 'AI Automation for Businesses | Intelligent Workflows | Megicode',
    description: 'Replace manual work with AI-powered automation — intelligent workflows, AI chatbots & smart integrations for SMEs.',
    url: 'https://www.megicode.com/services/automation-integration',
    images: [{ url: '/meta/services-og.png', width: 1200, height: 630, alt: 'AI Automation for Businesses | Megicode' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Automation for Businesses | Intelligent Workflows | Megicode',
    description: 'Replace manual work with AI-powered automation — intelligent workflows, AI chatbots & smart integrations for SMEs.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://www.megicode.com/services/automation-integration',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'AI Automation for Businesses', path: '/services/automation-integration' },
  ]);
  const service = serviceJsonLd({
    name: 'AI Automation for Businesses',
    description: 'Intelligent workflow automation, AI chatbots, smart integrations, and process optimization for SMEs.',
    path: '/services/automation-integration',
    category: 'AI Automation',
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      {children}
    </>
  );
}
