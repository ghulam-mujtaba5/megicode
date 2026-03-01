import type { Metadata } from 'next';
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Technical Co-Founder as a Service | CTO-Level Guidance for Startups | Megicode',
  description: 'Get a technical co-founder without giving up equity. Megicode provides CTO-level tech strategy, architecture decisions, team building, product roadmapping, and investor-ready technical due diligence for non-technical founders.',
  keywords: ['technical co-founder service', 'CTO as a service', 'fractional CTO for startups', 'startup tech strategy', 'non-technical founder tech partner', 'startup architecture advice', 'tech due diligence', 'startup CTO advisory'],
  openGraph: {
    title: 'Technical Co-Founder as a Service | CTO for Startups | Megicode',
    description: 'CTO-level tech strategy, architecture decisions, team building & investor-ready due diligence for non-technical founders.',
    url: 'https://www.megicode.com/services/it-consulting-support',
    images: [{ url: '/meta/services-og.png', width: 1200, height: 630, alt: 'Technical Co-Founder as a Service | Megicode' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Technical Co-Founder as a Service | CTO for Startups | Megicode',
    description: 'CTO-level tech strategy, architecture decisions, team building & investor-ready due diligence for non-technical founders.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://www.megicode.com/services/it-consulting-support',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Technical Co-Founder as a Service', path: '/services/it-consulting-support' },
  ]);
  const service = serviceJsonLd({
    name: 'Technical Co-Founder as a Service',
    description: 'CTO-level tech strategy, architecture decisions, team building, and investor-ready due diligence for startups.',
    path: '/services/it-consulting-support',
    category: 'Technical Advisory',
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      {children}
    </>
  );
}
