import type { Metadata } from 'next';
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Cloud & DevOps Services',
  description: 'Cloud migration, CI/CD pipelines, infrastructure automation, and container orchestration. Megicode delivers scalable, secure cloud solutions using AWS, Azure, Docker, Kubernetes, and Terraform.',
  keywords: ['Cloud Services', 'DevOps', 'Cloud Migration', 'CI/CD', 'Infrastructure as Code', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform'],
  openGraph: {
    title: 'Cloud & DevOps Services | Megicode',
    description: 'Cloud migration, CI/CD, and infrastructure automation for scalable, secure, and efficient operations.',
    url: 'https://megicode.com/services/cloud-devops-services',
    images: [{ url: '/meta/services-og.png', width: 1200, height: 630, alt: 'Cloud & DevOps Services | Megicode' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cloud & DevOps Services | Megicode',
    description: 'Cloud migration, CI/CD, and infrastructure automation for scalable, secure, and efficient operations.',
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
