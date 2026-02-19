import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles & Insights',
  description: 'Read the latest articles, insights, and thought leadership from Megicode on software development, AI, cloud computing, and digital transformation.',
  keywords: ['articles', 'blog', 'tech insights', 'software development articles', 'AI blog', 'Megicode blog'],
  openGraph: {
    title: 'Articles & Insights | Megicode',
    description: 'Read the latest articles and insights on software development, AI, cloud computing, and digital transformation.',
    url: 'https://megicode.com/article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Articles & Insights | Megicode',
    description: 'Read the latest articles and insights on software development, AI, and digital transformation.',
  },
  alternates: {
    canonical: 'https://megicode.com/article',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
