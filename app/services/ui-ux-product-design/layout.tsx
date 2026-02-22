import type { Metadata } from 'next';
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'UI/UX Design & Product Strategy | Design That Converts Users to Customers',
  description: 'Design digital products that users love and convert. Megicode delivers user research, wireframing, high-fidelity prototyping, design systems & usability testing using Figma — for SaaS, mobile apps & enterprise products.',
  keywords: ['UI UX design agency Pakistan', 'product design services', 'Figma design agency', 'UX research and strategy', 'wireframing and prototyping', 'design systems development', 'usability testing services', 'SaaS product design', 'mobile app UI design', 'conversion-focused design'],
  openGraph: {
    title: 'UI/UX Design That Converts | Product Strategy & Figma | Megicode',
    description: 'Design digital products that users love and convert. UX research, prototyping & design systems for SaaS, mobile & enterprise.',
    url: 'https://megicode.com/services/ui-ux-product-design',
    images: [{ url: '/meta/services-og.png', width: 1200, height: 630, alt: 'UI/UX & Product Design | Megicode' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UI/UX Design That Converts | Product Strategy & Figma | Megicode',
    description: 'Design digital products that users love and convert. UX research, prototyping & design systems for SaaS, mobile & enterprise.',
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
    { name: 'UI/UX & Product Design', path: '/services/ui-ux-product-design' },
  ]);
  const service = serviceJsonLd({
    name: 'UI/UX & Product Design',
    description: 'User-centered design for engaging, intuitive, and accessible digital products.',
    path: '/services/ui-ux-product-design',
    category: 'Design',
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      {children}
    </>
  );
}
