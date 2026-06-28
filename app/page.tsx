import HomePageClient from './HomePageClient';

export const metadata = {
  title: 'Megicode — AI Software, Automation & SaaS MVP Development',
  description:
    'Megicode builds AI automation, SaaS MVPs, custom portals, booking systems, and business platforms for startups and growing teams. See real shipped proof from CampusAxis, clinic platforms, and growth websites.',
  keywords: [
    'AI software development company',
    'AI automation agency',
    'AI SaaS MVP development',
    'custom web app development',
    'business platform development',
    'technical consulting for startups',
    'clinic booking automation',
    'startup software partner',
    'LLM integration services',
  ],
  openGraph: {
    title: 'Megicode — AI Software, Automation & SaaS MVP Development',
    description:
      'AI automation, SaaS MVPs, custom portals, booking systems, and business platforms backed by shipped product proof.',
    url: 'https://www.megicode.com',
    siteName: 'Megicode',
    images: [
      {
        url: '/meta/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Megicode AI software development and automation services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Megicode — AI Software, Automation & SaaS MVP Development',
    description:
      'AI automation, SaaS MVPs, custom portals, booking systems, and business platforms backed by shipped product proof.',
    images: ['/meta/twitter-card.png'],
  },
  alternates: {
    canonical: 'https://www.megicode.com',
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
