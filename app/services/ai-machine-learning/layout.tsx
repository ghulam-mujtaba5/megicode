import type { Metadata } from 'next';
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'AI-Powered Product Development | Build AI SaaS & Intelligent Products | Megicode',
  description: 'Build AI-first products that solve real problems. Megicode delivers custom AI/ML development, GPT & LLM integration, RAG systems, AI agents, and intelligent SaaS MVPs using OpenAI, LangChain, Python & TensorFlow.',
  keywords: ['AI product development', 'AI-powered MVP', 'LLM integration services', 'GPT integration', 'RAG system development', 'AI agent development', 'custom AI solutions', 'AI SaaS development', 'OpenAI development', 'LangChain development'],
  openGraph: {
    title: 'AI-Powered Product Development | Build Intelligent SaaS | Megicode',
    description: 'Build AI-first products with custom ML models, GPT/LLM integration, RAG systems, and AI agents.',
    url: 'https://megicode.com/services/ai-machine-learning',
    images: [{ url: '/meta/services-og.png', width: 1200, height: 630, alt: 'AI-Powered Product Development | Megicode' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Powered Product Development | Build Intelligent SaaS | Megicode',
    description: 'Build AI-first products with custom ML models, GPT/LLM integration, RAG systems, and AI agents.',
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
    { name: 'AI-Powered Product Development', path: '/services/ai-machine-learning' },
  ]);
  const service = serviceJsonLd({
    name: 'AI-Powered Product Development',
    description: 'Build AI-first SaaS products with custom ML models, GPT/LLM integration, RAG systems, and AI agents.',
    path: '/services/ai-machine-learning',
    category: 'AI Development',
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      {children}
    </>
  );
}
