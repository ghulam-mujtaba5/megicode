import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Megicode | Your AI-Powered Technical Partner',
  description: "Megicode is an AI-focused software company that partners with startups, non-technical founders, and growing businesses to build intelligent products. We're the technical co-founder every startup deserves.",
  keywords: ['Megicode', 'AI software company', 'technical co-founder', 'startup tech partner', 'AI-powered development', 'AI SaaS builder', 'CTO as a service'],
  openGraph: {
    title: 'About Megicode | Your AI-Powered Technical Partner',
    description: "We build AI-powered software for startups and growing businesses — from first MVP to production-ready AI products. Your technical co-founder from idea to scale.",
    url: 'https://www.megicode.com/about',
    siteName: 'Megicode',
    images: [
      {
        url: '/api/og?title=About%20Megicode&subtitle=Your%20AI-Powered%20Technical%20Partner',
        width: 1200,
        height: 630,
        alt: 'About Megicode — Your AI-Powered Technical Partner',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Megicode | Your AI-Powered Technical Partner',
    description: "We build AI-powered software for startups and growing businesses — from first MVP to production-ready AI products. Your technical co-founder from idea to scale.",
    images: ['/api/og?title=About%20Megicode&subtitle=Your%20AI-Powered%20Technical%20Partner'],
  },
  alternates: {
    canonical: 'https://www.megicode.com/about',
  },
}
