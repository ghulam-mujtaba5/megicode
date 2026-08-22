import { aboutPageJsonLd, breadcrumbJsonLd, founderPersonJsonLd } from '@/lib/metadata';

export { metadata } from './metadata';

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  const aboutPage = aboutPageJsonLd();
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ]);
  const founder = founderPersonJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(founder) }}
      />
      {children}
    </>
  );
}
