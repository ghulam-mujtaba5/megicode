import type { Metadata } from 'next';

import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Technical Co-Founder as a Service | CTO-Level Guidance for Startups | Megicode',
  description:
    'Get a technical co-founder without giving up equity. Megicode provides CTO-level tech strategy, architecture decisions, team building, product roadmapping, and investor-ready technical due diligence for non-technical founders.',
  keywords: [
    'technical co-founder service',
    'CTO as a service',
    'fractional CTO for startups',
    'startup tech strategy',
    'non-technical founder tech partner',
    'startup architecture advice',
    'tech due diligence',
    'startup CTO advisory',
  ],
  openGraph: {
    title: 'Technical Co-Founder as a Service | CTO for Startups | Megicode',
    description:
      'CTO-level tech strategy, architecture decisions, team building & investor-ready due diligence for non-technical founders.',
    url: 'https://www.megicode.com/services/technical-consulting',
    images: [
      {
        url: '/meta/services-og.png',
        width: 1200,
        height: 630,
        alt: 'Technical Co-Founder as a Service | Megicode',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Technical Co-Founder as a Service | CTO for Startups | Megicode',
    description:
      'CTO-level tech strategy, architecture decisions, team building & investor-ready due diligence for non-technical founders.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://www.megicode.com/services/technical-consulting',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Technical Co-Founder as a Service', path: '/services/technical-consulting' },
  ]);
  const service = serviceJsonLd({
    name: 'Technical Co-Founder as a Service',
    description:
      'CTO-level tech strategy, architecture decisions, team building, and investor-ready due diligence for startups.',
    path: '/services/technical-consulting',
    category: 'Technical Advisory',
    offers: [
      {
        name: 'Technical Discovery & MVP Roadmap',
        description:
          'MVP scope definition, architecture options, tech stack selection, risk analysis, and budget plan.',
        price: '400',
        priceCurrency: 'USD',
        deliveryTime: '1-2 weeks',
      },
      {
        name: 'Fractional CTO & Architecture Advisory',
        description:
          'CTO-level advisory, engineering team mentoring, technical due diligence for investors, and code audits.',
        price: '2500',
        priceCurrency: 'USD',
        deliveryTime: 'Monthly',
      },
      {
        name: 'Architecture & Security Audit',
        description:
          'Deep architecture evaluation, security vulnerability scanning, performance bottleneck identification, and remediation plan.',
        price: '1200',
        priceCurrency: 'USD',
        deliveryTime: '1-2 weeks',
      },
    ],
  });
  const faqs = faqJsonLd([
    {
      q: 'Do you provide 24/7 support?',
      a: 'Yes, we offer various support packages including 24/7 coverage with different SLA levels to match your business needs.',
    },
    {
      q: 'Can you help with compliance?',
      a: 'Absolutely! We help organizations achieve and maintain compliance with GDPR, ISO 27001, HIPAA, and other standards.',
    },
    {
      q: 'What platforms do you support?',
      a: 'We support all major platforms including Windows, Linux, macOS, cloud services (AWS, Azure, GCP), and enterprise applications.',
    },
    {
      q: 'How do you ensure security?',
      a: 'We implement industry best practices, conduct regular security audits, and follow strict protocols for data protection and access control.',
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
