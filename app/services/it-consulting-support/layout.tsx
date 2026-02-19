import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IT Consulting & Support',
  description: 'Expert IT strategy, security audits, compliance consulting, and ongoing technical support. Megicode helps you achieve your technology goals with roadmapping, infrastructure guidance, and maintenance services.',
  keywords: ['IT Consulting', 'IT Support', 'IT Strategy', 'Security Audits', 'Compliance', 'Technology Roadmapping', 'IT Infrastructure'],
  openGraph: {
    title: 'IT Consulting & Support | Megicode',
    description: 'Expert guidance, security, and ongoing support to help you achieve your technology goals.',
    url: 'https://megicode.com/services/it-consulting-support',
    images: [{ url: '/meta/services-og.png', width: 1200, height: 630, alt: 'IT Consulting & Support | Megicode' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IT Consulting & Support | Megicode',
    description: 'Expert guidance, security, and ongoing support to help you achieve your technology goals.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://megicode.com/services/it-consulting-support',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
