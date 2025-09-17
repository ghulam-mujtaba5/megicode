import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'About Us | Megicode',
  description: "Learn about Megicode's journey in setting the ideal standard of quality and innovation in business and technology. We deliver excellence in every project—building intelligent, scalable solutions that create lasting value for our clients, teams, and the global digital ecosystem.",
  keywords: ['Megicode', 'AI development', 'software solutions', 'innovation', 'digital transformation', 'brand vision', 'mission statement'],
  openGraph: {
    title: 'About Us | Megicode',
    description: "Learn about Megicode's journey in setting the ideal standard of quality and innovation in business and technology. If You Can Imagine It, We Can Build It.",
    images: [
      {
        url: '/meta/about-og.png',
        width: 1200,
        height: 630,
        alt: 'About Megicode – If You Can Imagine It, We Can Build It',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Megicode',
    description: "Learn about Megicode's journey in setting the ideal standard of quality and innovation in business and technology. If You Can Imagine It, We Can Build It.",
    images: ['/meta/about-og.png'],
  }
})
