import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | Megicode',
  description: 'Explore our portfolio of successful projects and products delivered across web, mobile, desktop applications, AI solutions, and data science.',
  keywords: ['portfolio', 'projects', 'case studies', 'software development', 'megicode projects'],
  openGraph: {
    title: 'Projects | Megicode',
    description: 'Explore our portfolio of successful projects and products delivered across web, mobile, desktop applications, AI solutions, and data science.',
  url: 'https://megicode.com/projects',
    images: [
      {
        url: '/meta/projects-og.png',
        width: 1200,
        height: 630,
        alt: 'Megicode Projects Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Megicode',
    description: 'Explore our portfolio of successful projects and products delivered across web, mobile, desktop applications, AI solutions, and data science.',
    images: ['/meta/projects-og.png'],
  },
};
