import type { Metadata } from 'next';
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Mobile App Development Services | Hire iOS & Android App Developers',
  description: 'Launch your mobile app in weeks, not months. Megicode builds high-performance native and cross-platform mobile apps for iOS & Android using React Native, Flutter, Swift & Kotlin — from MVP to scale.',
  keywords: ['mobile app development Pakistan', 'hire mobile app developers', 'iOS app development services', 'Android app development company', 'React Native development agency', 'Flutter app development', 'cross-platform mobile apps', 'startup MVP app development', 'mobile UI UX design', 'app store optimization'],
  openGraph: {
    title: 'Hire Top Mobile App Developers | iOS & Android | Megicode',
    description: 'Launch your mobile app in weeks, not months. Native & cross-platform apps for iOS & Android — from MVP to scale.',
    url: 'https://megicode.com/services/mobile-app-solutions',
    images: [{ url: '/meta/services-og.png', width: 1200, height: 630, alt: 'Mobile App Solutions | Megicode' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hire Top Mobile App Developers | iOS & Android | Megicode',
    description: 'Launch your mobile app in weeks, not months. Native & cross-platform apps for iOS & Android — from MVP to scale.',
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
