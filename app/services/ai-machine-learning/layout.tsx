import type { Metadata } from 'next';
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'AI & Machine Learning Solutions',
  description: 'Custom AI models, natural language processing, computer vision, and intelligent automation systems. Megicode builds scalable AI solutions using TensorFlow, PyTorch, and OpenAI to drive innovation for your business.',
  keywords: ['AI solutions', 'Machine Learning', 'Artificial Intelligence', 'Custom AI models', 'AI automation', 'NLP', 'Computer Vision', 'TensorFlow', 'PyTorch'],
  openGraph: {
    title: 'AI & Machine Learning Solutions | Megicode',
    description: 'Custom AI models, automation, and intelligent systems to drive innovation and efficiency for your business.',
    url: 'https://megicode.com/services/ai-machine-learning',
    images: [{ url: '/meta/services-og.png', width: 1200, height: 630, alt: 'AI & Machine Learning Solutions | Megicode' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI & Machine Learning Solutions | Megicode',
    description: 'Custom AI models, automation, and intelligent systems to drive innovation and efficiency for your business.',
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
