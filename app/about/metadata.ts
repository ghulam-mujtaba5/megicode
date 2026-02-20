import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Megicode',
  description: "Learn about Megicode's journey in setting the ideal standard of quality and innovation in business and technology. We deliver excellence in every project—building intelligent, scalable solutions that create lasting value for our clients, teams, and the global digital ecosystem.",
  keywords: ['Megicode', 'AI development', 'software solutions', 'innovation', 'digital transformation', 'brand vision', 'mission statement'],
  openGraph: {
    title: 'About Us | Megicode',
    description: "Learn about Megicode's journey in setting the ideal standard of quality and innovation in business and technology. If You Can Imagine It, We Can Build It.",
    url: 'https://megicode.com/about',
    siteName: 'Megicode',
    images: [
      {
        url: '/api/og?title=About%20Us&subtitle=Setting%20the%20ideal%20standard%20of%20quality%20and%20innovation',
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
    images: ['/api/og?title=About%20Us&subtitle=Setting%20the%20ideal%20standard%20of%20quality%20and%20innovation'],
  },
  alternates: {
    canonical: 'https://megicode.com/about',
  },
}
