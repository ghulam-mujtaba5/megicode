import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Enterprise Solutions & Case Studies | Megicode',
  description: 'Discover how Megicode delivers cutting-edge enterprise solutions, AI implementations, and digital transformation projects. View our success stories and technological innovations.',
  keywords: ['enterprise solutions', 'AI projects', 'digital transformation', 'case studies', 'machine learning', 'cloud architecture', 'full-stack development', 'enterprise software'],
  openGraph: {
    title: 'Enterprise Solutions & Case Studies | Megicode',
    description: 'Leading enterprise solutions and digital transformation success stories',
    images: [
      {
        url: '/images/meta/projects-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Megicode Enterprise Solutions Showcase',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enterprise Solutions & Case Studies | Megicode',
    description: 'Leading enterprise solutions and digital transformation success stories',
    images: ['/images/meta/projects-og.jpg'],
  },
  alternates: {
    canonical: 'https://megicode.com/project'
  }
}
