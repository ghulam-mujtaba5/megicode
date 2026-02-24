import type { Metadata } from 'next';
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Product Design & UX Strategy | Conversion-Focused Design for SaaS & AI | Megicode',
  description: 'Design AI-powered products that users love and convert. Megicode delivers product strategy, UX research, design systems, and conversion-focused UI for SaaS startups and AI products using Figma.',
  keywords: ['SaaS product design', 'AI product UX', 'conversion-focused design', 'startup UX strategy', 'Figma design services', 'design systems', 'product design for startups', 'UX for AI products'],
  openGraph: {
    title: 'Product Design & UX Strategy for SaaS & AI Products | Megicode',
    description: 'Design products users love and that convert — UX research, design systems & conversion-focused UI for SaaS & AI.',
    url: 'https://megicode.com/services/ui-ux-product-design',
    images: [{ url: '/meta/services-og.png', width: 1200, height: 630, alt: 'Product Design & UX Strategy | Megicode' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Product Design & UX Strategy for SaaS & AI Products | Megicode',
    description: 'Design products users love and that convert — UX research, design systems & conversion-focused UI for SaaS & AI.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://megicode.com/services/ui-ux-product-design',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Product Design & UX Strategy', path: '/services/ui-ux-product-design' },
  ]);
  const service = serviceJsonLd({
    name: 'Product Design & UX Strategy',
    description: 'Conversion-focused product design, UX research, and design systems for SaaS and AI-powered products.',
    path: '/services/ui-ux-product-design',
    category: 'Product Design',
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      {children}
    </>
  );
}
