import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Megicode',
  description: "Contact Megicode—If You Can Imagine It, We Can Build It. Let's discuss your vision and how we can deliver intelligent, scalable solutions for your business.",
  keywords: ['contact', 'megicode', 'software development', 'get in touch', 'brand tagline'],
  openGraph: {
    title: 'Contact | Megicode',
    description: "Contact Megicode—If You Can Imagine It, We Can Build It.",
    url: 'https://megicode.com/contact',
    siteName: 'Megicode',
    images: [
      {
        url: '/api/og?title=Contact%20Us&subtitle=If%20You%20Can%20Imagine%20It%2C%20We%20Can%20Build%20It',
        width: 1200,
        height: 630,
        alt: 'Contact Megicode – If You Can Imagine It, We Can Build It',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | Megicode',
    description: "Contact Megicode—If You Can Imagine It, We Can Build It.",
    images: ['/api/og?title=Contact%20Us&subtitle=If%20You%20Can%20Imagine%20It%2C%20We%20Can%20Build%20It'],
  },
  alternates: {
    canonical: 'https://megicode.com/contact',
  },
};
