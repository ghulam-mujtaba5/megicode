import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read the Megicode privacy policy. Learn how we collect, use, and protect your personal data when you use our website and services.',
  keywords: ['privacy policy', 'data protection', 'Megicode privacy', 'GDPR', 'personal data'],
  openGraph: {
    title: 'Privacy Policy | Megicode',
    description: 'Learn how Megicode collects, uses, and protects your personal data.',
    url: 'https://www.megicode.com/privacy-policy',
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
  return children;
}
