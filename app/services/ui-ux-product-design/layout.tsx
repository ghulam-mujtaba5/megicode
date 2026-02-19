import type { Metadata } from 'next';

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
  return children;
}
