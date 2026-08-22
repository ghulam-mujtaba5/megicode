import type { Metadata } from 'next';

import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Cloud Infrastructure & DevOps | Startup-Ready Cloud Architecture | Megicode',
  description:
    'Scale your startup infrastructure with confidence. Megicode delivers cloud architecture design, CI/CD pipelines, auto-scaling, and cost optimization on AWS & Vercel — built for startups going from zero to scale.',
  keywords: [
    'startup cloud architecture',
    'DevOps for startups',
    'CI/CD pipeline setup',
    'AWS cloud services',
    'Vercel deployment',
    'cloud cost optimization',
    'infrastructure as code',
    'startup DevOps',
    'Docker containerization',
    'GitHub Actions CI/CD',
  ],
  openGraph: {
    title: 'Cloud Infrastructure & DevOps for Startups | Megicode',
    description:
      'Scale your startup infrastructure — cloud architecture, CI/CD pipelines, auto-scaling & cost optimization.',
    url: 'https://www.megicode.com/services/cloud-devops',
    images: [
      {
        url: '/meta/services-og.png',
        width: 1200,
        height: 630,
        alt: 'Cloud Infrastructure & DevOps | Megicode',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cloud Infrastructure & DevOps for Startups | Megicode',
    description:
      'Scale your startup infrastructure — cloud architecture, CI/CD pipelines, auto-scaling & cost optimization.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://www.megicode.com/services/cloud-devops',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Cloud Infrastructure & DevOps', path: '/services/cloud-devops' },
  ]);
  const service = serviceJsonLd({
    name: 'Cloud Infrastructure & DevOps',
    description:
      'Startup-ready cloud architecture, CI/CD pipelines, auto-scaling, and infrastructure cost optimization.',
    path: '/services/cloud-devops',
    category: 'Cloud & DevOps',
    offers: [
      {
        name: 'Cloud Architecture & Setup',
        description:
          'AWS/Vercel architecture setup, containerization with Docker, and environment configuration.',
        price: '1500',
        priceCurrency: 'USD',
        deliveryTime: '1-3 weeks',
      },
      {
        name: 'CI/CD & Automation Pipeline',
        description:
          'Automated GitHub Actions deployment pipelines, testing automation, and zero-downtime releases.',
        price: '2500',
        priceCurrency: 'USD',
        deliveryTime: '2-4 weeks',
      },
      {
        name: 'Cloud Infrastructure & Security Retainer',
        description:
          'Ongoing 24/7 monitoring, auto-scaling, backup management, cost optimization, and security audits.',
        price: '1000',
        priceCurrency: 'USD',
        deliveryTime: 'Monthly',
      },
    ],
  });
  const faqs = faqJsonLd([
    {
      q: 'Can you migrate from on-prem to cloud?',
      a: 'Yes, we specialize in seamless migration from on-premises to cloud infrastructure with minimal disruption.',
    },
    {
      q: 'What DevOps tools do you use?',
      a: 'We use industry-leading tools including AWS, Azure, Docker, Kubernetes, Terraform, GitHub Actions, and Jenkins.',
    },
    {
      q: 'How do you ensure uptime and security?',
      a: 'We implement robust monitoring, automated failover, and industry best practices for security and compliance.',
    },
    {
      q: 'Do you offer managed services?',
      a: 'Yes, we provide ongoing management and optimization.',
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
