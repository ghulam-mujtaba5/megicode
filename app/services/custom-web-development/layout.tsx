import type { Metadata } from 'next';

import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Custom Software Development Company | Enterprise Platforms & Portals | Megicode',
  description:
    'Custom software, business platforms, dashboards, and internal portals engineered for your operational workflows. Reliable web application development by Megicode.',
  keywords: [
    'custom software development company',
    'business software solutions',
    'enterprise software development',
    'custom web application development',
    'business process automation',
    'portal development company',
    'Next.js web development',
    'custom CRM development',
    'custom software engineering',
  ],
  openGraph: {
    title: 'Custom Software Development Company | Enterprise Platforms & Portals | Megicode',
    description:
      'Custom software, business platforms, dashboards, and internal portals engineered for your operational workflows.',
    url: 'https://www.megicode.com/services/custom-web-development',
    images: [
      {
        url: '/meta/services-og.png',
        width: 1200,
        height: 630,
        alt: 'Custom Software Development Company | Megicode',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Software Development Company | Enterprise Platforms & Portals | Megicode',
    description:
      'Custom software, business platforms, dashboards, and internal portals engineered for your operational workflows.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://www.megicode.com/services/custom-web-development',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'SaaS & Web Platform Development', path: '/services/custom-web-development' },
  ]);
  const service = serviceJsonLd({
    name: 'SaaS & Web Platform Development',
    description:
      'Production-ready SaaS platforms and web applications for startups, built with Next.js, React & TypeScript.',
    path: '/services/custom-web-development',
    category: 'Web Development',
    offers: [
      {
        name: 'Starter Business Platform',
        description:
          'Core portal, admin dashboard, user roles, database architecture, and launch setup.',
        price: '3500',
        priceCurrency: 'USD',
        deliveryTime: '4-8 weeks',
      },
      {
        name: 'Growth Business Platform',
        description:
          'Custom portals, CRMs, booking systems, dashboards, and internal operating platforms.',
        price: '5500',
        priceCurrency: 'USD',
        deliveryTime: '6-10 weeks',
      },
      {
        name: 'Enterprise Web Platform',
        description:
          'Complex multi-system integration, high-concurrency architecture, and dedicated engineering.',
        price: '11000',
        priceCurrency: 'USD',
        deliveryTime: '8-14+ weeks',
      },
      {
        name: 'Monthly Platform Retainer',
        description:
          'Continuous feature improvements, monitoring, security updates, and performance tuning.',
        price: '1200',
        priceCurrency: 'USD',
        deliveryTime: 'Ongoing',
      },
    ],
  });
  const faqs = faqJsonLd([
    {
      q: 'Can you migrate our legacy app?',
      a: 'Yes, we specialize in modernizing legacy applications with minimal disruption to your business operations.',
    },
    {
      q: 'Do you offer post-launch support?',
      a: 'Yes, we provide comprehensive maintenance, monitoring, and enhancement support after launch.',
    },
    {
      q: 'How do you ensure web app security?',
      a: 'We implement industry-standard security practices, regular security audits, and follow OWASP guidelines.',
    },
    {
      q: 'What is the typical timeline?',
      a: 'Web projects typically take 8-16 weeks, depending on complexity and requirements.',
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
