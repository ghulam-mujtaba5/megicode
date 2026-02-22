import type { Metadata } from 'next';
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'IT Consulting & Technical Support | CTO-as-a-Service for Startups',
  description: 'Get expert IT leadership without the full-time cost. Megicode provides technology strategy, security audits, compliance consulting, infrastructure guidance & 24/7 technical support — your fractional CTO partner.',
  keywords: ['IT consulting services Pakistan', 'CTO as a service', 'fractional CTO for startups', 'IT strategy consulting', 'security audit services', 'compliance consulting', 'technology roadmapping', 'IT infrastructure consulting', 'managed IT support', 'IT outsourcing Pakistan'],
  openGraph: {
    title: 'IT Consulting & CTO-as-a-Service for Startups | Megicode',
    description: 'Get expert IT leadership without the full-time cost. Strategy, security audits & 24/7 technical support.',
    url: 'https://megicode.com/services/it-consulting-support',
    images: [{ url: '/meta/services-og.png', width: 1200, height: 630, alt: 'IT Consulting & Support | Megicode' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IT Consulting & CTO-as-a-Service for Startups | Megicode',
    description: 'Get expert IT leadership without the full-time cost. Strategy, security audits & 24/7 technical support.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://megicode.com/services/it-consulting-support',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'IT Consulting & Support', path: '/services/it-consulting-support' },
  ]);
  const service = serviceJsonLd({
    name: 'IT Consulting & Support',
    description: 'Expert IT strategy, security audits, compliance consulting, and ongoing technical support.',
    path: '/services/it-consulting-support',
    category: 'IT Services',
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      {children}
    </>
  );
}
