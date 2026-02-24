import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI-Powered Software Development Services | Megicode',
  description: "AI-powered software development for startups, founders, and growing businesses. From AI SaaS MVPs and LLM integration to technical co-founder services and intelligent automation — your tech partner from idea to scale.",
  keywords: ['AI software development', 'AI-powered MVP development', 'technical co-founder service', 'AI SaaS builder', 'LLM integration services', 'AI automation for business', 'startup software development', 'AI product development'],
  openGraph: {
    title: 'AI-Powered Software Development Services | Megicode',
    description: "From AI SaaS MVPs and LLM integration to technical co-founder services — your tech partner from idea to scale.",
    url: 'https://megicode.com/services',
    siteName: 'Megicode',
    images: [
      {
        url: '/meta/services-og.png',
        width: 1200,
        height: 630,
        alt: 'Megicode Services — AI-Powered Software for Startups',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Powered Software Development Services | Megicode',
    description: "From AI SaaS MVPs and LLM integration to technical co-founder services — your tech partner from idea to scale.",
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://megicode.com/services',
  },
};
