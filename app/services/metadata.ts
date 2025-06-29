import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services | Megicode',
  description: 'Explore our comprehensive software development services including web, mobile, desktop applications, AI solutions, and data science.',
  openGraph: {
    title: 'Services | Megicode',
    description: 'Explore our comprehensive software development services including web, mobile, desktop applications, AI solutions, and data science.',
    url: 'https://www.megicode.com/services',
    images: [
      {
        url: '/meta/services-og.png',
        width: 1200,
        height: 630,
        alt: 'Megicode Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services | Megicode',
    description: 'Explore our comprehensive software development services including web, mobile, desktop applications, AI solutions, and data science.',
    images: ['/meta/services-og.png'],
  },
};
