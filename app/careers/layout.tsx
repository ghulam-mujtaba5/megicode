import type { Metadata } from 'next';
import { breadcrumbJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join the Megicode team. Explore open positions in software development, AI, data science, and product design. We offer competitive benefits, remote-friendly work, and a culture of innovation.',
  keywords: ['careers', 'jobs', 'software developer jobs', 'AI careers', 'Megicode careers', 'tech jobs', 'remote jobs'],
  openGraph: {
    title: 'Careers at Megicode',
    description: 'Join our team of innovators. Explore open positions in software development, AI, data science, and design.',
    url: 'https://megicode.com/careers',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers at Megicode',
    description: 'Join our team of innovators. Explore open positions in software development, AI, data science, and design.',
  },
  alternates: {
    canonical: 'https://megicode.com/careers',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Careers', path: '/careers' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
