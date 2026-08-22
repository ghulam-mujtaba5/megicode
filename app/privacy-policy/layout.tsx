import type { Metadata } from 'next';

import { breadcrumbJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Privacy Policy — Megicode Data Protection & Privacy Terms',
  description:
    'Read the Megicode privacy policy. Learn how we collect, use, protect, and retain your personal data when you use our website and services.',
  keywords: [
    'privacy policy',
    'data protection',
    'Megicode privacy',
    'GDPR',
    'personal data',
    'cookies policy',
    'data security',
    'user rights',
  ],
  openGraph: {
    title: 'Privacy Policy | Megicode',
    description:
      'Learn how Megicode collects, uses, and protects your personal data. Your privacy matters to us.',
    url: 'https://www.megicode.com/privacy-policy',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy | Megicode',
    description: 'Learn how Megicode collects, uses, and protects your personal data.',
  },
  alternates: {
    canonical: 'https://www.megicode.com/privacy-policy',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {children}
    </>
  );
}
