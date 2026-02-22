import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Software Development Services | AI, Web, Mobile & Cloud | Megicode',
  description: "End-to-end software development services for startups and enterprises. From custom AI solutions and web apps to mobile development, cloud migration & UI/UX design — Megicode turns your vision into production-ready software.",
  keywords: ['software development services Pakistan', 'custom software development company', 'AI development agency', 'web development services', 'mobile app development', 'cloud migration services', 'UI UX design agency', 'hire software developers Pakistan', 'startup software development', 'enterprise software solutions'],
  openGraph: {
    title: 'End-to-End Software Development Services | AI, Web, Mobile & Cloud | Megicode',
    description: "From AI solutions and web apps to mobile development & cloud migration — Megicode turns your vision into production-ready software.",
    url: 'https://megicode.com/services',
    siteName: 'Megicode',
    images: [
      {
        url: '/meta/services-og.png',
        width: 1200,
        height: 630,
        alt: 'Megicode Services – If You Can Imagine It, We Can Build It',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services | Megicode',
    description: "Explore our comprehensive software development services—If You Can Imagine It, We Can Build It.",
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://megicode.com/services',
  },
};
