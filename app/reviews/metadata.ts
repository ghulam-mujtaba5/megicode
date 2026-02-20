import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Reviews & Testimonials | Megicode',
  description: "Read what real clients say about working with Megicode — from The Aesthetics Place clinic platform to CampusAxis university portal. Honest reviews from businesses and users we've built for.",
  keywords: ['megicode reviews', 'client testimonials', 'aesthetics place review', 'campusaxis review', 'software company reviews', 'megicode feedback'],
  openGraph: {
    title: 'Client Reviews & Testimonials | Megicode',
    description: "Read what real clients say about working with Megicode.",
    url: 'https://megicode.com/reviews',
    images: [
      {
        url: '/meta/reviews-og.png',
        width: 1200,
        height: 630,
        alt: 'Megicode Client Reviews & Testimonials',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Client Reviews & Testimonials | Megicode',
    description: "Read what real clients say about working with Megicode.",
    images: ['/meta/reviews-og.png'],
  },
  alternates: {
    canonical: 'https://megicode.com/reviews',
  },
};
