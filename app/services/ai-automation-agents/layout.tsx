import type { Metadata } from 'next';

import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'AI Automation Services for Businesses | Build AI Agents & Workflows | Megicode',
  description:
    'Automate leads, customer support, and repetitive operations with custom AI agents and intelligent workflows built for growing businesses. Talk with Megicode AI engineers.',
  keywords: [
    'AI automation company',
    'AI automation agency',
    'AI automation services',
    'business automation services',
    'AI workflow automation company',
    'AI agents for business',
    'custom AI chatbot development',
    'clinic booking automation',
    'process automation agency',
    'intelligent workflow automation',
  ],
  openGraph: {
    title: 'AI Automation Services for Businesses | Build AI Agents & Workflows | Megicode',
    description:
      'Automate leads, customer support, and operations with custom AI agents and intelligent workflows built for growing businesses.',
    url: 'https://www.megicode.com/services/ai-automation-agents',
    images: [
      {
        url: '/meta/services-og.png',
        width: 1200,
        height: 630,
        alt: 'AI Automation Services | Megicode',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Automation Services for Businesses | Build AI Agents & Workflows | Megicode',
    description:
      'Automate leads, customer support, and operations with custom AI agents and intelligent workflows built for growing businesses.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://www.megicode.com/services/ai-automation-agents',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'AI Automation for Businesses', path: '/services/ai-automation-agents' },
  ]);
  const service = serviceJsonLd({
    name: 'AI Automation for Businesses',
    description:
      'Intelligent workflow automation, AI chatbots, smart integrations, and process optimization for SMEs.',
    path: '/services/ai-automation-agents',
    category: 'AI Automation',
    offers: [
      {
        name: 'AI Automation Starter',
        description:
          '1 automated workflow, core integration with CRM/email/booking, testing, and launch handoff.',
        price: '900',
        priceCurrency: 'USD',
        deliveryTime: '1-2 weeks',
      },
      {
        name: 'AI Automation Growth',
        description:
          '2-3 automated workflows, CRM, form, email, or WhatsApp logic, testing, and launch handoff.',
        price: '1800',
        priceCurrency: 'USD',
        deliveryTime: '2-4 weeks',
      },
      {
        name: 'AI Automation Advanced',
        description:
          '4-6 workflows, advanced branching, conditional routing, reporting, and team handoff.',
        price: '3200',
        priceCurrency: 'USD',
        deliveryTime: '3-5 weeks',
      },
      {
        name: 'Clinic AI Receptionist',
        description:
          'WhatsApp booking, patient intake, appointment reminders, and staff handoff automation.',
        price: '1250',
        priceCurrency: 'USD',
        deliveryTime: '2-3 weeks',
      },
    ],
  });
  const faqs = faqJsonLd([
    {
      q: 'Can you automate legacy systems?',
      a: 'Yes, we can integrate and automate legacy systems through various approaches including API integration, RPA, and custom middleware solutions.',
    },
    {
      q: 'What tools do you use for automation?',
      a: 'We use a comprehensive stack including Python, Zapier, Make, Selenium, Node.js, REST APIs, and Power Automate, choosing the best tool for each specific requirement.',
    },
    {
      q: 'How do you ensure reliability?',
      a: 'We implement robust error handling, monitoring systems, automated testing, and failover mechanisms to ensure reliable operation of all automated processes.',
    },
    {
      q: 'Is training included?',
      a: 'Yes, we provide training and documentation for all solutions.',
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
