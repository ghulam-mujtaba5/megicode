import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects & Products | Megicode – Real Platforms We Built & Shipped',
  description: "Explore real projects by Megicode — from the Aesthetics Place clinic platform (aestheticsplace.pk) to CampusAxis university portal (campusaxis.pk). Full-stack web apps, management systems, and products we built and shipped.",
  keywords: ['megicode projects', 'aesthetics clinic website', 'university portal', 'campusaxis', 'aestheticsplace', 'next.js projects', 'full stack web development', 'megicode portfolio', 'pakistan software company'],
  openGraph: {
    title: 'Projects & Products | Megicode',
    description: "Real projects, real products, real impact. See what Megicode builds — clinic platforms, university portals, and more.",
    url: 'https://megicode.com/projects',
    siteName: 'Megicode',
    images: [
      {
        url: '/api/og?title=Projects%20%26%20Products&subtitle=Real%20Platforms%20We%20Built%20%26%20Shipped',
        width: 1200,
        height: 630,
        alt: 'Megicode Projects – Real Platforms We Built & Shipped',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects & Products | Megicode',
    description: "Real projects, real products, real impact. See what Megicode builds.",
    images: ['/api/og?title=Projects%20%26%20Products&subtitle=Real%20Platforms%20We%20Built%20%26%20Shipped'],
  },
  alternates: {
    canonical: 'https://megicode.com/projects',
  },
};
