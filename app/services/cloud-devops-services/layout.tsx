import type { Metadata } from 'next';
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Cloud Migration & DevOps Services | AWS, Azure & Kubernetes Experts',
  description: 'Migrate to the cloud with zero downtime. Megicode delivers end-to-end cloud migration, CI/CD pipeline automation, Kubernetes orchestration & infrastructure-as-code using AWS, Azure, Docker & Terraform.',
  keywords: ['cloud migration services Pakistan', 'DevOps consulting agency', 'AWS migration services', 'Azure cloud services', 'CI/CD pipeline setup', 'Kubernetes consulting', 'Docker containerization', 'infrastructure as code Terraform', 'cloud cost optimization', 'DevOps automation'],
  openGraph: {
    title: 'Cloud Migration & DevOps Experts | AWS, Azure, Kubernetes | Megicode',
    description: 'Migrate to the cloud with zero downtime. End-to-end CI/CD, Kubernetes & infrastructure automation.',
    url: 'https://megicode.com/services/cloud-devops-services',
    images: [{ url: '/meta/services-og.png', width: 1200, height: 630, alt: 'Cloud & DevOps Services | Megicode' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cloud Migration & DevOps Experts | AWS, Azure, Kubernetes | Megicode',
    description: 'Migrate to the cloud with zero downtime. End-to-end CI/CD, Kubernetes & infrastructure automation.',
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
    { name: 'Cloud & DevOps Services', path: '/services/cloud-devops-services' },
  ]);
  const service = serviceJsonLd({
    name: 'Cloud & DevOps Services',
    description: 'Cloud migration, CI/CD pipelines, infrastructure automation, and container orchestration.',
    path: '/services/cloud-devops-services',
    category: 'Cloud Computing',
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      {children}
    </>
  );
}
