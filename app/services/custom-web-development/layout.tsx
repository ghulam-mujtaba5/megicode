import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Custom Web Development',
  description: 'Robust, scalable, and secure web applications built with React, Next.js, Node.js, and TypeScript. Full-stack development, API integration, e-commerce solutions, and CMS portals tailored to your business goals.',
  keywords: ['Web Development', 'Custom Web Applications', 'Full-Stack Development', 'E-commerce', 'CMS', 'React', 'Next.js', 'Node.js', 'TypeScript'],
  openGraph: {
    title: 'Custom Web Development | Megicode',
    description: 'Robust, scalable, and secure web applications tailored to your business goals and user needs.',
    url: 'https://megicode.com/services/custom-web-development',
    images: [{ url: '/meta/services-og.png', width: 1200, height: 630, alt: 'Custom Web Development | Megicode' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Web Development | Megicode',
    description: 'Robust, scalable, and secure web applications tailored to your business goals and user needs.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://megicode.com/services/custom-web-development',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
