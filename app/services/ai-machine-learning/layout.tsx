import type { Metadata } from 'next';
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Custom AI & Machine Learning Development Services | Hire AI Experts',
  description: 'Build intelligent AI systems that automate workflows and unlock growth. Megicode delivers custom AI model development, NLP, computer vision, and generative AI consulting for startups and enterprises using TensorFlow, PyTorch & OpenAI.',
  keywords: ['AI development agency Pakistan', 'custom AI solutions for startups', 'machine learning consulting', 'generative AI consulting for business', 'hire AI developers', 'NLP development services', 'computer vision solutions', 'AI automation agency', 'TensorFlow development', 'PyTorch consulting', 'AI integration services', 'LLM development'],
  openGraph: {
    title: 'Custom AI Development & ML Solutions | Megicode — Hire AI Experts',
    description: 'Build intelligent AI systems that automate workflows and unlock growth. Custom AI models, NLP, computer vision & generative AI consulting.',
    url: 'https://megicode.com/services/ai-machine-learning',
    images: [{ url: '/meta/services-og.png', width: 1200, height: 630, alt: 'AI & Machine Learning Solutions | Megicode' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom AI Development & ML Solutions | Megicode — Hire AI Experts',
    description: 'Build intelligent AI systems that automate workflows and unlock growth. Custom AI models, NLP, computer vision & generative AI consulting.',
    images: ['/meta/services-og.png'],
  },
  alternates: {
    canonical: 'https://megicode.com/services/ai-machine-learning',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'AI & Machine Learning', path: '/services/ai-machine-learning' },
  ]);
  const service = serviceJsonLd({
    name: 'AI & Machine Learning Solutions',
    description: 'Custom AI models, natural language processing, computer vision, and intelligent automation systems.',
    path: '/services/ai-machine-learning',
    category: 'Artificial Intelligence',
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      {children}
    </>
  );
}
