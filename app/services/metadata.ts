import type { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Services | Megicode',
  description: "Explore our comprehensive software development services—If You Can Imagine It, We Can Build It. We deliver intelligent, scalable solutions that create lasting value for our clients, teams, and the global digital ecosystem.",
  keywords: ['Megicode', 'software development', 'web development', 'mobile apps', 'AI solutions', 'data science', 'brand tagline'],
  openGraph: {
    title: 'Services | Megicode',
    description: "Explore our comprehensive software development services—If You Can Imagine It, We Can Build It.",
    url: 'https://megicode.com/services',
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
});
