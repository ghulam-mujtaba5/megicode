import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Reviews & Testimonials | Megicode',
  description: "Read what real clients say about working with Megicode — from The Aesthetics Place clinic platform to CampusAxis university portal. Honest reviews from businesses and users we've built for.",
  keywords: ['megicode reviews', 'client testimonials', 'aesthetics place review', 'campusaxis review', 'software company reviews', 'megicode feedback'],
  openGraph: {
    title: 'Client Reviews & Testimonials | Megicode',
    description: "Read what real clients say about working with Megicode.",
    url: 'https://megicode.com/reviews',
    siteName: 'Megicode',
    images: [
      {
        url: '/api/og?title=Client%20Reviews%20%26%20Testimonials&subtitle=What%20our%20clients%20say%20about%20Megicode',
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
    images: ['/api/og?title=Client%20Reviews%20%26%20Testimonials&subtitle=What%20our%20clients%20say%20about%20Megicode'],
  },
  alternates: {
    canonical: 'https://megicode.com/reviews',
  },
};
