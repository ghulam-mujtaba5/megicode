import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Megicode',
  description: "Contact Megicode—If You Can Imagine It, We Can Build It. Let's discuss your vision and how we can deliver intelligent, scalable solutions for your business.",
  keywords: ['contact', 'megicode', 'software development', 'get in touch', 'brand tagline'],
  openGraph: {
    title: 'Contact | Megicode',
    description: "Contact Megicode—If You Can Imagine It, We Can Build It.",
    url: 'https://megicode.com/contact',
    images: [
      {
        url: '/meta/contact-og.png',
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
    images: ['/meta/contact-og.png'],
  },
  alternates: {
    canonical: 'https://megicode.com/contact',
  },
};
