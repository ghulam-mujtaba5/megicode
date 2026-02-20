import type { Metadata } from 'next';
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'UI/UX & Product Design',
  description: 'User-centered design for engaging, intuitive, and accessible digital products. Megicode delivers user research, wireframing, prototyping, design systems, and usability testing using Figma and modern design tools.',
  keywords: ['UI UX Design', 'Product Design', 'User Research', 'Wireframing', 'Prototyping', 'Usability Testing', 'Figma', 'Design Systems'],
  openGraph: {
    title: 'UI/UX & Product Design | Megicode',
    description: 'User-centered design for engaging, intuitive, and accessible digital products.',
    url: 'https://megicode.com/services/ui-ux-product-design',
    images: [{ url: '/meta/services-og.png', width: 1200, height: 630, alt: 'UI/UX & Product Design | Megicode' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UI/UX & Product Design | Megicode',
    description: 'User-centered design for engaging, intuitive, and accessible digital products.',
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
