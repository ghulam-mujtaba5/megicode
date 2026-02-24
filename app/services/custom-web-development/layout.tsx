import type { Metadata } from 'next';
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'SaaS & Web Platform Development | Build Your Startup MVP Faster | Megicode',
  description: 'Launch your SaaS product faster. Megicode builds production-ready web platforms and startup MVPs with Next.js, React, Node.js & TypeScript — including auth, payments, dashboards, and AI features baked in.',
  keywords: ['SaaS MVP development', 'startup web development', 'Next.js SaaS builder', 'web platform development', 'startup MVP builder', 'full-stack SaaS development', 'React web development', 'TypeScript SaaS platform'],
  openGraph: {
    title: 'SaaS & Web Platform Development | Build Your Startup MVP | Megicode',
    description: 'Launch your SaaS product faster with Next.js, React & TypeScript — auth, payments, dashboards & AI features included.',
    url: 'https://megicode.com/services/custom-web-development',
    images: [{ url: '/meta/services-og.png', width: 1200, height: 630, alt: 'SaaS & Web Platform Development | Megicode' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaaS & Web Platform Development | Build Your Startup MVP | Megicode',
    description: 'Launch your SaaS product faster with Next.js, React & TypeScript — auth, payments, dashboards & AI features included.',
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
    { name: 'SaaS & Web Platform Development', path: '/services/custom-web-development' },
  ]);
  const service = serviceJsonLd({
    name: 'SaaS & Web Platform Development',
    description: 'Production-ready SaaS platforms and web applications for startups, built with Next.js, React & TypeScript.',
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
