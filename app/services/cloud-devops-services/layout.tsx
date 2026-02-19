import type { Metadata } from 'next';

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
  return children;
}
