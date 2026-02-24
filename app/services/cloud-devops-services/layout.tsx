import type { Metadata } from 'next';
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Cloud Infrastructure & DevOps | Startup-Ready Cloud Architecture | Megicode',
  description: 'Scale your startup infrastructure with confidence. Megicode delivers cloud architecture design, CI/CD pipelines, auto-scaling, and cost optimization on AWS & Vercel — built for startups going from zero to scale.',
  keywords: ['startup cloud architecture', 'DevOps for startups', 'CI/CD pipeline setup', 'AWS cloud services', 'Vercel deployment', 'cloud cost optimization', 'infrastructure as code', 'startup DevOps', 'Docker containerization', 'GitHub Actions CI/CD'],
  openGraph: {
    title: 'Cloud Infrastructure & DevOps for Startups | Megicode',
    description: 'Scale your startup infrastructure — cloud architecture, CI/CD pipelines, auto-scaling & cost optimization.',
    url: 'https://megicode.com/services/cloud-devops-services',
    images: [{ url: '/meta/services-og.png', width: 1200, height: 630, alt: 'Cloud Infrastructure & DevOps | Megicode' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cloud Infrastructure & DevOps for Startups | Megicode',
    description: 'Scale your startup infrastructure — cloud architecture, CI/CD pipelines, auto-scaling & cost optimization.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://megicode.com/services/cloud-devops-services',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Cloud Infrastructure & DevOps', path: '/services/cloud-devops-services' },
  ]);
  const service = serviceJsonLd({
    name: 'Cloud Infrastructure & DevOps',
    description: 'Startup-ready cloud architecture, CI/CD pipelines, auto-scaling, and infrastructure cost optimization.',
    path: '/services/cloud-devops-services',
    category: 'Cloud & DevOps',
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      {children}
    </>
  );
}
