import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Megicode',
  description: "Have a startup idea or need AI-powered software? Let's talk. Megicode partners with startups, founders, and growing businesses to build intelligent products — from first MVP to scale.",
  keywords: ['contact megicode', 'AI software development', 'startup tech partner', 'hire AI developers', 'get in touch'],
  openGraph: {
    title: 'Contact Megicode | Your AI-Powered Tech Partner',
    description: "Have a startup idea or need AI-powered software? Let's talk about building your next product.",
    url: 'https://megicode.com/contact',
    siteName: 'Megicode',
    images: [
      {
        url: '/api/og?title=Contact%20Us&subtitle=Your%20AI-Powered%20Tech%20Partner',
        width: 1200,
        height: 630,
        alt: 'Contact Megicode — Your AI-Powered Tech Partner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Megicode | Your AI-Powered Tech Partner',
    description: "Have a startup idea or need AI-powered software? Let's talk about building your next product.",
    images: ['/api/og?title=Contact%20Us&subtitle=Your%20AI-Powered%20Tech%20Partner'],
  },
  alternates: {
    canonical: 'https://megicode.com/contact',
  },
};
