import React from 'react';

import { LOGO_MAIN_DARK, LOGO_MAIN_LIGHT, PWA_ICON } from '@/lib/logo';
import { SOCIAL_PROFILES, canonicalUrl, professionalServiceJsonLd } from '@/lib/metadata';

import GoogleAnalytics from '@/components/GoogleAnalytics/GoogleAnalytics';
import MicrosoftClarity from '@/components/MicrosoftClarity/MicrosoftClarity';

import '../styles/global.css';
import ClientLayout from './ClientLayout';
import { Providers } from './providers';

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  void import('../utils/axe-a11y');
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.megicode.com'),
  title: {
    default: 'Megicode — AI-Powered Software Development for Startups & Businesses',
    template: '%s | Megicode',
  },
  description:
    'Megicode builds AI-powered software for startups, non-technical founders, and growing businesses. From AI SaaS MVPs and LLM integration to technical co-founder services and intelligent automation — your tech partner from idea to scale.',
  keywords: [
    'AI software development',
    'AI-powered MVP development',
    'technical co-founder service',
    'AI SaaS builder',
    'LLM integration',
    'startup software partner',
    'AI automation for business',
    'CTO as a service',
    'AI product development',
    'React development',
    'Next.js development',
    'generative AI consulting',
  ],
  authors: [{ name: 'Ghulam Mujtaba' }],
  creator: 'Ghulam Mujtaba',
  publisher: 'Megicode',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      // Theme-aware favicons (3D PNG mark)
      { url: LOGO_MAIN_LIGHT, media: '(prefers-color-scheme: light)', type: 'image/png' },
      { url: LOGO_MAIN_DARK, media: '(prefers-color-scheme: dark)', type: 'image/png' },
      // Canonical svg wrapper + PNG fallbacks
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/meta/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/meta/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/meta/favicon.ico', sizes: '48x48' },
    ],
    apple: [{ url: '/meta/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      { url: '/meta/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/meta/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/meta/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.megicode.com',
    siteName: 'Megicode',
    title: 'Megicode — AI-Powered Software Development for Startups & Businesses',
    description:
      'AI-powered software for startups, founders & growing businesses. From AI SaaS MVPs to technical co-founder services.',
    images: [
      {
        url: '/meta/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Megicode - Modern Software Solutions',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Megicode — AI-Powered Software for Startups & Businesses',
    description:
      'AI-powered software for startups, founders & growing businesses. From AI SaaS MVPs to technical co-founder services.',
    images: ['/meta/twitter-card.png'],
    creator: '@megicode',
  },
  alternates: {
    canonical: 'https://www.megicode.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://www.megicode.com#organization',
    name: 'Megicode',
    url: 'https://www.megicode.com',
    logo: `https://www.megicode.com${PWA_ICON}`,
    email: 'contact@megicode.com',
    foundingDate: '2025-07',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 2,
      maxValue: 10,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lahore',
      addressCountry: 'PK',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: 'contact@megicode.com',
        contactType: 'customer support',
        availableLanguage: ['English', 'Urdu'],
      },
    ],
    knowsAbout: [
      'AI-Powered Software Development',
      'AI SaaS MVP Development',
      'Technical Co-Founder Services',
      'LLM & GPT Integration',
      'RAG System Development',
      'AI Agent Development',
      'Generative AI',
      'Machine Learning',
      'AI Automation for SMEs',
      'SaaS Platform Development',
      'Web Application Development',
      'Mobile App Development',
      'React',
      'Next.js',
      'Node.js',
      'TypeScript',
      'Python',
      'OpenAI',
      'LangChain',
      'Product Design & UX',
      'Cloud Infrastructure',
      'AWS',
      'DevOps & CI/CD',
      'Startup Software Solutions',
    ],
    sameAs: [...SOCIAL_PROFILES],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Megicode',
    url: 'https://www.megicode.com',
    description:
      'AI-powered software development for startups, founders, and growing businesses. From AI SaaS MVPs and LLM integration to technical co-founder services — your tech partner from idea to scale.',
    publisher: {
      '@type': 'Organization',
      '@id': 'https://www.megicode.com#organization',
      name: 'Megicode',
    },
  };

  const professionalService = professionalServiceJsonLd();

  const navJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: ['About', 'Services', 'Pricing', 'Case Studies', 'Insights', 'Contact', 'Privacy Policy'],
    url: [
      'https://www.megicode.com/about',
      'https://www.megicode.com/services',
      canonicalUrl('/pricing'),
      canonicalUrl('/projects'),
      canonicalUrl('/insights'),
      'https://www.megicode.com/contact',
      'https://www.megicode.com/privacy-policy',
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalService) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(navJsonLd) }}
        />
        <MicrosoftClarity />
        <GoogleAnalytics />
      </head>
      <body suppressHydrationWarning>
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
