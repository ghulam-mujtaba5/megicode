import type { Metadata } from 'next';
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Mobile App Solutions',
  description: 'Native and cross-platform mobile apps for iOS and Android. Megicode builds high-performance mobile applications using React Native, Flutter, Swift, and Kotlin — designed for engagement and scalability.',
  keywords: ['Mobile App Development', 'iOS Development', 'Android Development', 'Cross-Platform Apps', 'React Native', 'Flutter', 'Mobile UI/UX'],
  openGraph: {
    title: 'Mobile App Solutions | Megicode',
    description: 'Native and cross-platform mobile apps for iOS and Android, designed for performance and engagement.',
    url: 'https://megicode.com/services/mobile-app-solutions',
    images: [{ url: '/meta/services-og.png', width: 1200, height: 630, alt: 'Mobile App Solutions | Megicode' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobile App Solutions | Megicode',
    description: 'Native and cross-platform mobile apps for iOS and Android, designed for performance and engagement.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://megicode.com/services/mobile-app-solutions',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Mobile App Solutions', path: '/services/mobile-app-solutions' },
  ]);
  const service = serviceJsonLd({
    name: 'Mobile App Solutions',
    description: 'Native and cross-platform mobile apps for iOS and Android, designed for performance and engagement.',
    path: '/services/mobile-app-solutions',
    category: 'Mobile Development',
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      {children}
    </>
  );
}
