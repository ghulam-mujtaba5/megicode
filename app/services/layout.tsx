import { breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/metadata';

export { metadata } from './metadata';

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
  ]);

  const collection = collectionPageJsonLd({
    name: 'Megicode Engineering & AI Software Services',
    description:
      'Custom software development, AI automation workflows, AI SaaS MVP development, cloud architecture, and technical consulting.',
    path: '/services',
    items: [
      {
        name: 'AI Automation & Agents',
        path: '/services/ai-automation-agents',
        description: 'Autonomous AI workflows, lead triage, and backend process automation.',
      },
      {
        name: 'AI SaaS / MVP Development',
        path: '/services/ai-saas-mvp-development',
        description: 'Production-ready AI SaaS MVPs engineered and launched in 2 to 6 weeks.',
      },
      {
        name: 'Custom Web Applications',
        path: '/services/custom-web-development',
        description: 'Bespoke web applications, portals, and dashboards built on Next.js & React.',
      },
      {
        name: 'Mobile App Development',
        path: '/services/mobile-app-development',
        description: 'Cross-platform iOS and Android apps built with React Native.',
      },
      {
        name: 'Cloud & DevOps Engineering',
        path: '/services/cloud-devops',
        description: 'Scalable cloud infrastructure, CI/CD pipelines, AWS, Docker, and Kubernetes.',
      },
      {
        name: 'Data & Analytics',
        path: '/services/data-analytics',
        description: 'Real-time analytics dashboards, ETL pipelines, and business intelligence.',
      },
      {
        name: 'UI/UX Product Design',
        path: '/services/ui-ux-design',
        description: 'Conversion-focused interface design, design systems, and Figma prototypes.',
      },
      {
        name: 'Growth Marketing & SEO',
        path: '/services/growth-marketing-seo',
        description: 'Technical SEO, performance engineering, and generative AI search optimization.',
      },
      {
        name: 'Technical Consulting',
        path: '/services/technical-consulting',
        description: 'CTO-as-a-service, software architecture reviews, and AI strategy consulting.',
      },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }}
      />
      {children}
    </>
  );
}


