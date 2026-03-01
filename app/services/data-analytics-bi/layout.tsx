import type { Metadata } from 'next';
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'AI Integration & Data Intelligence | Add AI to Your Software | Megicode',
  description: 'Add AI superpowers to your existing product. Megicode integrates GPT-powered chatbots, smart search, recommendation engines, and AI-driven analytics into your software using OpenAI, Python & modern data stacks.',
  keywords: ['AI integration services', 'add AI to existing software', 'GPT chatbot integration', 'AI-powered analytics', 'recommendation engine development', 'smart search AI', 'AI data intelligence', 'AI consulting for startups'],
  openGraph: {
    title: 'AI Integration & Data Intelligence | Add AI to Your Product | Megicode',
    description: 'Add AI superpowers to your existing product — GPT chatbots, smart search, recommendation engines & AI analytics.',
    url: 'https://www.megicode.com/services/data-analytics-bi',
    images: [{ url: '/meta/services-og.png', width: 1200, height: 630, alt: 'AI Integration & Data Intelligence | Megicode' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Integration & Data Intelligence | Add AI to Your Product | Megicode',
    description: 'Add AI superpowers to your existing product — GPT chatbots, smart search, recommendation engines & AI analytics.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://www.megicode.com/services/data-analytics-bi',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'AI Integration & Data Intelligence', path: '/services/data-analytics-bi' },
  ]);
  const service = serviceJsonLd({
    name: 'AI Integration & Data Intelligence',
    description: 'Add AI capabilities to existing products — GPT chatbots, smart search, recommendation engines, and AI-driven analytics.',
    path: '/services/data-analytics-bi',
    category: 'AI Integration',
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      {children}
    </>
  );
}
