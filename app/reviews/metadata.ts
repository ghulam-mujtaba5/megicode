import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reviews & Testimonials | Megicode',
  description: "What our clients say about Megicode—If You Can Imagine It, We Can Build It. Read real testimonials and success stories from businesses who partnered with us to build intelligent, scalable solutions.",
  keywords: ['reviews', 'testimonials', 'client feedback', 'megicode reviews', 'software development reviews', 'brand tagline'],
  openGraph: {
    title: 'Reviews & Testimonials | Megicode',
    description: "What our clients say about Megicode—If You Can Imagine It, We Can Build It.",
    url: 'https://megicode.com/reviews',
    images: [
      {
        url: '/meta/reviews-og.png',
        width: 1200,
        height: 630,
        alt: 'Megicode Reviews – If You Can Imagine It, We Can Build It',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reviews & Testimonials | Megicode',
    description: "What our clients say about Megicode—If You Can Imagine It, We Can Build It.",
    images: ['/meta/reviews-og.png'],
  },
  alternates: {
    canonical: 'https://megicode.com/reviews',
  },
};
