import type { Metadata } from 'next';
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Custom Web Application Development | Scalable Solutions for Startups & Enterprises',
  description: 'Ship production-ready web apps 2x faster. Megicode builds high-performance, SEO-optimized web applications with React, Next.js, Node.js & TypeScript. Full-stack development, SaaS platforms, e-commerce & enterprise portals.',
  keywords: ['custom web development company', 'hire web developers Pakistan', 'Next.js development agency', 'React web application development', 'SaaS platform development', 'full-stack web development services', 'e-commerce web development', 'enterprise web portal development', 'scalable web applications', 'TypeScript development'],
  openGraph: {
    title: 'Custom Web App Development for Startups & Enterprises | Megicode',
    description: 'Ship production-ready web apps 2x faster. Full-stack React, Next.js & Node.js development — from SaaS to enterprise portals.',
    url: 'https://megicode.com/services/custom-web-development',
    images: [{ url: '/meta/services-og.png', width: 1200, height: 630, alt: 'Custom Web Development | Megicode' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Web App Development for Startups & Enterprises | Megicode',
    description: 'Ship production-ready web apps 2x faster. Full-stack React, Next.js & Node.js development — from SaaS to enterprise portals.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://megicode.com/services/custom-web-development',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Custom Web Development', path: '/services/custom-web-development' },
  ]);
  const service = serviceJsonLd({
    name: 'Custom Web Development',
    description: 'Robust, scalable, and secure web applications built with React, Next.js, Node.js, and TypeScript.',
    path: '/services/custom-web-development',
    category: 'Web Development',
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      {children}
    </>
  );
}
