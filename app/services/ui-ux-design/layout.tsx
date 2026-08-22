import type { Metadata } from 'next';

import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Product Design & UX Strategy | Conversion-Focused Design for SaaS & AI | Megicode',
  description:
    'Design AI-powered products that users love and convert. Megicode delivers product strategy, UX research, design systems, and conversion-focused UI for SaaS startups and AI products using Figma.',
  keywords: [
    'SaaS product design',
    'AI product UX',
    'conversion-focused design',
    'startup UX strategy',
    'Figma design services',
    'design systems',
    'product design for startups',
    'UX for AI products',
  ],
  openGraph: {
    title: 'Product Design & UX Strategy for SaaS & AI Products | Megicode',
    description:
      'Design products users love and that convert — UX research, design systems & conversion-focused UI for SaaS & AI.',
    url: 'https://www.megicode.com/services/ui-ux-design',
    images: [
      {
        url: '/meta/services-og.png',
        width: 1200,
        height: 630,
        alt: 'Product Design & UX Strategy | Megicode',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Product Design & UX Strategy for SaaS & AI Products | Megicode',
    description:
      'Design products users love and that convert — UX research, design systems & conversion-focused UI for SaaS & AI.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://www.megicode.com/services/ui-ux-design',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Product Design & UX Strategy', path: '/services/ui-ux-design' },
  ]);
  const service = serviceJsonLd({
    name: 'Product Design & UX Strategy',
    description:
      'Conversion-focused product design, UX research, and design systems for SaaS and AI-powered products.',
    path: '/services/ui-ux-design',
    category: 'Product Design',
    offers: [
      {
        name: 'UX Discovery & Wireframing Sprint',
        description:
          'User flow mapping, information architecture, low-fidelity wireframes, and conversion path design.',
        price: '950',
        priceCurrency: 'USD',
        deliveryTime: '1-2 weeks',
      },
      {
        name: 'Full Product UI/UX & Design System',
        description:
          'High-fidelity Figma mockups, responsive design, interactive prototype, and scalable design system.',
        price: '2800',
        priceCurrency: 'USD',
        deliveryTime: '3-6 weeks',
      },
      {
        name: 'Conversion Rate & UX Redesign',
        description:
          'UX audit of existing product, friction elimination, micro-interactions, and conversion-optimized screen overhaul.',
        price: '1600',
        priceCurrency: 'USD',
        deliveryTime: '2-4 weeks',
      },
    ],
  });
  const faqs = faqJsonLd([
    {
      q: 'Do you provide design systems?',
      a: 'Yes, we create scalable design systems for consistency and efficiency.',
    },
    {
      q: 'Can you work with our branding?',
      a: 'Absolutely. We align all designs with your brand guidelines.',
    },
    {
      q: 'What tools do you use?',
      a: 'Figma, Adobe XD, Sketch, InVision, and other modern design tools.',
    },
    {
      q: 'Do you test with real users?',
      a: 'Yes, usability testing is a core part of our process.',
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
