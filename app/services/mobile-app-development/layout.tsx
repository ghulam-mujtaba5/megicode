import type { Metadata } from 'next';

import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Cross Platform Mobile Application Development Company | iOS & Android | Megicode',
  description:
    'Build mobile apps that stand out with AI features. Megicode develops cross-platform iOS & Android apps using React Native and Flutter — with AI-powered features, real-time sync, and startup-ready architecture.',
  keywords: [
    'mobile app development',
    'AI-powered mobile apps',
    'React Native development',
    'Flutter app development',
    'startup mobile app',
    'cross-platform mobile apps',
    'iOS Android development',
    'mobile MVP development',
    'cross platform mobile application development company',
  ],
  openGraph: {
    title: 'Cross Platform Mobile Application Development Company | iOS & Android | Megicode',
    description:
      'Cross-platform mobile apps with AI features, real-time sync, and startup-ready architecture.',
    url: 'https://www.megicode.com/services/mobile-app-development',
    images: [
      {
        url: '/meta/services-og.png',
        width: 1200,
        height: 630,
        alt: 'Mobile App Development | Megicode',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobile App Development | iOS & Android with AI Features | Megicode',
    description:
      'Cross-platform mobile apps with AI features, real-time sync, and startup-ready architecture.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://www.megicode.com/services/mobile-app-development',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Mobile App Development', path: '/services/mobile-app-development' },
  ]);
  const service = serviceJsonLd({
    name: 'Mobile App Development',
    description:
      'Cross-platform iOS & Android apps with AI features, real-time sync, and startup-ready architecture.',
    path: '/services/mobile-app-development',
    category: 'Mobile Development',
    offers: [
      {
        name: 'Mobile App MVP (React Native / Flutter)',
        description:
          'Cross-platform iOS and Android mobile app, auth, offline sync, push notifications, and app store deployment.',
        price: '4200',
        priceCurrency: 'USD',
        deliveryTime: '4-8 weeks',
      },
      {
        name: 'Full Scale Mobile Application',
        description:
          'Feature-rich native performance app with AI features, real-time sync, payments, and admin backend.',
        price: '8500',
        priceCurrency: 'USD',
        deliveryTime: '8-14 weeks',
      },
      {
        name: 'Mobile App Support & Retainer',
        description:
          'OS updates, bug fixing, performance monitoring, and app store maintenance.',
        price: '800',
        priceCurrency: 'USD',
        deliveryTime: 'Monthly',
      },
    ],
  });
  const faqs = faqJsonLd([
    {
      q: 'Do you build both iOS and Android apps?',
      a: 'Yes, we develop native apps for both iOS and Android platforms, as well as cross-platform solutions using frameworks like React Native and Flutter to maximize efficiency and reach.',
    },
    {
      q: 'Can you help with app store submission?',
      a: 'Absolutely! We handle the entire app store submission process for both Apple App Store and Google Play Store, ensuring compliance with guidelines and optimizing for approval.',
    },
    {
      q: 'What about app maintenance?',
      a: 'We provide comprehensive maintenance services including updates, bug fixes, performance optimization, and feature additions to keep your app running smoothly and up-to-date.',
    },
    {
      q: 'How do you ensure app quality?',
      a: 'We implement rigorous QA processes including automated testing, manual testing, performance testing, and security audits throughout development to ensure high-quality, reliable apps.',
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqs) }}
      />
      {children}
    </>
  );
}
