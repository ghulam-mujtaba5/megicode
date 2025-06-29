import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Megicode - AI & Software Development Experts',
  description: 'Learn about Megicode\'s journey in delivering innovative AI-powered software solutions. Discover our values, expertise, and commitment to transforming businesses through technology.',
  keywords: 'Megicode, AI development, software solutions, tech company, innovation, digital transformation',
  openGraph: {
    title: 'About Megicode - AI & Software Development Experts',
    description: 'Discover how Megicode transforms businesses with AI-powered software solutions. Learn about our journey, values, and expertise.',
    images: [
      {
        
        url: '/meta/about-og.png',
        width: 1200,
        height: 630,
        alt: 'Megicode About Us'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Megicode - AI & Software Development Experts',
    description: 'Discover how Megicode transforms businesses with AI-powered software solutions.',
    images: ['/meta/about-og.png'],
  }
}
