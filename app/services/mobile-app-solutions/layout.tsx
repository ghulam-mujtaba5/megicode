import type { Metadata } from 'next';
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Mobile App Development | Cross-Platform iOS & Android with AI Features | Megicode',
  description: 'Build mobile apps that stand out with AI features. Megicode develops cross-platform iOS & Android apps using React Native and Flutter — with AI-powered features, real-time sync, and startup-ready architecture.',
  keywords: ['mobile app development', 'AI-powered mobile apps', 'React Native development', 'Flutter app development', 'startup mobile app', 'cross-platform mobile apps', 'iOS Android development', 'mobile MVP development'],
  openGraph: {
    title: 'Mobile App Development | iOS & Android with AI Features | Megicode',
    description: 'Cross-platform mobile apps with AI features, real-time sync, and startup-ready architecture.',
    url: 'https://www.megicode.com/services/mobile-app-solutions',
    images: [{ url: '/meta/services-og.png', width: 1200, height: 630, alt: 'Mobile App Development | Megicode' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobile App Development | iOS & Android with AI Features | Megicode',
    description: 'Cross-platform mobile apps with AI features, real-time sync, and startup-ready architecture.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://www.megicode.com/services/mobile-app-solutions',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Mobile App Development', path: '/services/mobile-app-solutions' },
  ]);
  const service = serviceJsonLd({
    name: 'Mobile App Development',
    description: 'Cross-platform iOS & Android apps with AI features, real-time sync, and startup-ready architecture.',
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
