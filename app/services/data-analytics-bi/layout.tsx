import type { Metadata } from 'next';
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Data Analytics & Business Intelligence Services | Power BI & Tableau Experts',
  description: 'Make data-driven decisions that grow revenue. Megicode builds custom BI dashboards, predictive analytics models & data warehouses using Power BI, Tableau, Python & SQL — turning raw data into competitive advantage.',
  keywords: ['data analytics services Pakistan', 'business intelligence consulting', 'Power BI dashboard development', 'Tableau consulting services', 'predictive analytics solutions', 'data warehousing services', 'big data analytics company', 'custom BI dashboards', 'data visualization services', 'SQL analytics'],
  openGraph: {
    title: 'Data Analytics & BI Experts | Power BI, Tableau & Python | Megicode',
    description: 'Make data-driven decisions that grow revenue. Custom dashboards, predictive analytics & data warehousing solutions.',
    url: 'https://megicode.com/services/data-analytics-bi',
    images: [{ url: '/meta/services-og.png', width: 1200, height: 630, alt: 'Data Analytics & BI | Megicode' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Data Analytics & BI Experts | Power BI, Tableau & Python | Megicode',
    description: 'Make data-driven decisions that grow revenue. Custom dashboards, predictive analytics & data warehousing solutions.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://megicode.com/services/data-analytics-bi',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Data Analytics & BI', path: '/services/data-analytics-bi' },
  ]);
  const service = serviceJsonLd({
    name: 'Data Analytics & Business Intelligence',
    description: 'Transform raw data into actionable insights with custom dashboards, predictive analytics, and BI solutions.',
    path: '/services/data-analytics-bi',
    category: 'Data Analytics',
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      {children}
    </>
  );
}
