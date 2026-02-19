import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Analytics & Business Intelligence',
  description: 'Transform raw data into actionable insights with custom dashboards, predictive analytics, and BI solutions. Megicode delivers data warehousing, visualization, and big data analytics using Power BI, Tableau, and Python.',
  keywords: ['Data Analytics', 'Business Intelligence', 'Big Data', 'Data Visualization', 'Predictive Analytics', 'Power BI', 'Tableau', 'Data Warehousing'],
  openGraph: {
    title: 'Data Analytics & Business Intelligence | Megicode',
    description: 'Transform data into actionable insights with analytics, dashboards, and business intelligence solutions.',
    url: 'https://megicode.com/services/data-analytics-bi',
    images: [{ url: '/meta/services-og.png', width: 1200, height: 630, alt: 'Data Analytics & BI | Megicode' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Data Analytics & Business Intelligence | Megicode',
    description: 'Transform data into actionable insights with analytics, dashboards, and business intelligence solutions.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://megicode.com/services/data-analytics-bi',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
