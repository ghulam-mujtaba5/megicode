import { breadcrumbJsonLd, serviceJsonLd } from '@/lib/metadata';

export { metadata } from './metadata';

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
  ]);

  const services = [
    serviceJsonLd({
      name: 'AI Automation & Agents',
      description:
        'AI chatbots, WhatsApp flows, CRM and booking automation, workflow agents, and lead capture systems for growing businesses.',
      path: '/services/ai-automation-agents',
      category: 'AI Automation',
    }),
    serviceJsonLd({
      name: 'AI SaaS & MVP Development',
      description:
        'Launch-ready AI SaaS MVP development with auth, dashboards, databases, payments, AI features, admin panels, and deployment.',
      path: '/services/ai-saas-mvp-development',
      category: 'AI Product Development',
    }),
    serviceJsonLd({
      name: 'Custom Web Apps & Business Platforms',
      description:
        'Custom portals, dashboards, booking systems, CRMs, management platforms, and business software tailored to daily operations.',
      path: '/services/custom-web-development',
      category: 'Custom Software Development',
    }),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {services.map((service) => (
        <script
          key={String(service['@id'])}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
        />
      ))}
      {children}
    </>
  );
}
