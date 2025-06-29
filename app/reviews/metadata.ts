import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reviews & Testimonials | Megicode',
  description: 'Read what our clients say about their experience working with Megicode. Discover success stories and testimonials from our satisfied clients across various industries.',
  keywords: ['reviews', 'testimonials', 'client feedback', 'megicode reviews', 'software development reviews'],
  openGraph: {
    title: 'Reviews & Testimonials | Megicode',
    description: 'Read what our clients say about their experience working with Megicode. Discover success stories and testimonials from our satisfied clients across various industries.',
    url: 'https://www.megicode.com/reviews',
    images: [
      {
        url: '/meta/reviews-og.png',
        width: 1200,
        height: 630,
        alt: 'Megicode Reviews',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reviews & Testimonials | Megicode',
    description: 'Read what our clients say about their experience working with Megicode. Discover success stories and testimonials from our satisfied clients across various industries.',
    images: ['/meta/reviews-og.png'],
  },
};
