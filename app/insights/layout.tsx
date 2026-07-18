import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Insights — AI, SaaS & Engineering Articles',
  description:
    'Executive guides on AI product development, SaaS engineering, automation, cloud, and growth — written for founders and operators who build with Megicode.',
  keywords: [
    'AI development articles',
    'SaaS engineering blog',
    'AI product development guide',
    'build AI SaaS',
    'LLM integration guide',
    'RAG chatbot development',
    'AI agent development',
    'SaaS MVP guide',
    'tech insights for founders',
    'software engineering blog',
    'AI automation articles',
    'custom AI model guide',
    'startup engineering articles',
    'cloud architecture guide',
    'multi-tenant SaaS architecture',
    'Next.js SaaS development',
    'Megicode insights',
    'Megicode blog',
  ],
  openGraph: {
    title: 'Megicode Insights — AI, SaaS & Engineering Articles',
    description:
      'Executive guides on AI product development, SaaS engineering, automation, cloud, and growth — written for founders and operators.',
    url: 'https://www.megicode.com/insights',
    type: 'website',
    siteName: 'Megicode',
    images: [
      {
        url: 'https://www.megicode.com/meta/default-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Megicode Insights — AI, SaaS & Engineering Articles',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Megicode Insights — AI, SaaS & Engineering Articles',
    description:
      'Executive guides on AI product development, SaaS engineering, and automation for founders.',
    images: ['https://www.megicode.com/meta/default-og.jpg'],
  },
  alternates: {
    canonical: 'https://www.megicode.com/insights',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
