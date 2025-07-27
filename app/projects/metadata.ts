import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | Megicode',
  description: "Explore our portfolio of successful projects—If You Can Imagine It, We Can Build It. See how Megicode delivers excellence in every project, building intelligent, scalable solutions that create lasting value.",
  keywords: ['portfolio', 'projects', 'case studies', 'software development', 'megicode projects', 'innovation', 'brand vision'],
  openGraph: {
    title: 'Projects | Megicode',
    description: "Explore our portfolio of successful projects—If You Can Imagine It, We Can Build It.",
    url: 'https://megicode.com/projects',
    images: [
      {
        url: '/meta/projects-og.png',
        width: 1200,
        height: 630,
        alt: 'Megicode Projects – If You Can Imagine It, We Can Build It',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Megicode',
    description: "Explore our portfolio of successful projects—If You Can Imagine It, We Can Build It.",
    images: ['/meta/projects-og.png'],
  },
};
