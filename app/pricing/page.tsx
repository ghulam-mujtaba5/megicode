import PricingPageClient from './PricingPageClient';

export const metadata = {
  title: 'Pricing | Megicode AI Automation, SaaS MVPs & Business Platforms',
  description:
    'Transparent USD starting prices for Megicode AI automation, clinic AI receptionist, SaaS MVP, custom platform, roadmap, and monthly support packages.',
  keywords: [
    'Megicode pricing',
    'AI automation pricing',
    'AI SaaS MVP development cost',
    'clinic AI receptionist pricing',
    'custom business platform pricing',
    'MVP roadmap pricing',
  ],
  openGraph: {
    title: 'Megicode Pricing',
    description:
      'Clear USD starting prices for AI automation, SaaS MVPs, clinic AI receptionist systems, and custom business platforms.',
    url: 'https://www.megicode.com/pricing',
    siteName: 'Megicode',
    images: [
      {
        url: '/meta/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Megicode pricing for AI automation and software development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Megicode Pricing',
    description:
      'Transparent USD starting prices for AI automation, SaaS MVPs, clinic AI receptionist systems, and custom platforms.',
    images: ['/meta/twitter-card.png'],
  },
  alternates: {
    canonical: 'https://www.megicode.com/pricing',
  },
};

export default function PricingPage() {
  return <PricingPageClient />;
}
