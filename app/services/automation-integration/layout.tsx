import type { Metadata } from 'next';
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Automation & Integration',
  description: 'Streamline your business with workflow automation, API integration, ETL pipelines, and robotic process automation (RPA). Megicode connects your systems and eliminates manual tasks using Python, Zapier, and custom scripting.',
  keywords: ['Automation', 'Integration', 'Business Process Automation', 'API Integration', 'RPA', 'ETL', 'Workflow Automation', 'Zapier'],
  openGraph: {
    title: 'Automation & Integration | Megicode',
    description: 'Workflow automation, data integration, and process optimization to streamline your business.',
    url: 'https://megicode.com/services/automation-integration',
    images: [{ url: '/meta/services-og.png', width: 1200, height: 630, alt: 'Automation & Integration | Megicode' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Automation & Integration | Megicode',
    description: 'Workflow automation, data integration, and process optimization to streamline your business.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://megicode.com/services/automation-integration',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Automation & Integration', path: '/services/automation-integration' },
  ]);
  const service = serviceJsonLd({
    name: 'Automation & Integration',
    description: 'Workflow automation, API integration, ETL pipelines, and robotic process automation.',
    path: '/services/automation-integration',
    category: 'Business Automation',
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      {children}
    </>
  );
}
