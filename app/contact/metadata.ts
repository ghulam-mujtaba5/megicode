import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Megicode',
  description: "Get in touch with Megicode for your software development needs. Let's discuss your project.",
  openGraph: {
    title: 'Contact | Megicode',
    description: "Get in touch with Megicode for your software development needs. Let's discuss your project.",
  url: 'https://megicode.com/contact',
    images: [
      {
        url: '/meta/contact-og.png',
        width: 1200,
        height: 630,
        alt: 'Contact Megicode',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | Megicode',
    description: "Get in touch with Megicode for your software development needs. Let's discuss your project.",
    images: ['/meta/contact-og.png'],
  },
};
