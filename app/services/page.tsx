'use client';

import React, { Suspense } from 'react';

import dynamic from 'next/dynamic';

import { SITE_SOCIAL, getCopyrightText } from '@/lib/constants';

import LoadingAnimation from '@/components/LoadingAnimation/LoadingAnimation';
import Breadcrumbs from '@/components/SEO/Breadcrumbs';

import Footer from '../../components/Footer/Footer';
import ThemeToggleIcon from '../../components/Icon/sbicon';
import NewNavBar from '../../components/NavBar_Desktop_Company/NewNavBar';
import NavBarMobile from '../../components/NavBar_Mobile/NavBar-mobile';
import { useTheme } from '../../context/ThemeContext';

const ServicesHero = dynamic(() => import('../../components/Services/Hero/ServicesHero'), {
  loading: () => <LoadingAnimation size="medium" />,
});
const ServiceCard = dynamic(() => import('../../components/Services/Card/ServiceCard'), {
  loading: () => <LoadingAnimation size="medium" />,
});

const coreServices = [
  {
    slug: 'ai-automation-agents',
    title: 'AI Automation & Agents',
    description:
      'Automate repetitive business work using AI chatbots, WhatsApp flows, CRMs, booking systems, and workflow agents that save time and capture more leads.',
    features: [
      'AI Chatbots & WhatsApp Flows',
      'CRM & Booking Automation',
      'Workflow Agents',
      'Lead Capture Systems',
    ],
    techs: ['Python', 'OpenAI', 'n8n', 'Zapier', 'Node.js'],
    ctaText: 'Automate My Leads',
    href: '/services/ai-automation-agents',
  },
  {
    slug: 'ai-saas-mvp-development',
    title: 'AI SaaS & MVP Development',
    description:
      'Turn your AI product idea into a launch-ready MVP with auth, dashboard, database, payments, AI features, admin panel, and deployment.',
    features: [
      'Auth & User Management',
      'AI Feature Integration',
      'Payment Systems',
      'Admin Dashboard',
    ],
    techs: ['Next.js', 'OpenAI', 'Python', 'PostgreSQL', 'Stripe'],
    ctaText: 'Plan My AI MVP',
    href: '/services/ai-saas-mvp-development',
  },
  {
    slug: 'custom-web-development',
    title: 'Custom Web Apps & Business Platforms',
    description:
      'Build portals, dashboards, booking systems, CRMs, and management platforms tailored to your business operations.',
    features: [
      'Business Portals & Dashboards',
      'Booking & CRM Systems',
      'Admin Panels & API Integration',
      'Scalable Architecture',
    ],
    techs: ['Next.js', 'React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    ctaText: 'Build My Platform',
    href: '/services/custom-web-development',
  },
];

const supportingServices = [
  {
    slug: 'ui-ux-design',
    title: 'UI/UX Product Design',
    description:
      'Design interfaces users understand and trust, from product flows to high-fidelity SaaS and platform screens.',
    features: [
      'Product Flow Design',
      'High-Fidelity Prototyping',
      'Design Systems',
      'Usability Review',
    ],
    techs: ['Figma', 'Framer', 'Storybook', 'Adobe XD'],
    ctaText: 'Improve My UX',
    href: '/services/ui-ux-design',
  },
  {
    slug: 'cloud-devops',
    title: 'Cloud & DevOps',
    description:
      'Launch faster with stable deployment, infrastructure, CI/CD, monitoring, and release workflows.',
    features: [
      'Cloud Architecture Setup',
      'CI/CD Pipeline Automation',
      'Auto-Scaling & Cost Optimization',
      'Security & Compliance',
    ],
    techs: ['AWS', 'Vercel', 'Docker', 'GitHub Actions', 'Terraform'],
    ctaText: 'Prepare My Launch',
    href: '/services/cloud-devops',
  },
  {
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    description:
      'Bring your platform to iOS and Android with cross-platform apps that connect to your product backend.',
    features: [
      'React Native & Flutter Apps',
      'iOS & Android Delivery',
      'Push Notifications',
      'App Store Readiness',
    ],
    techs: ['React Native', 'Flutter', 'Firebase', 'Node.js', 'TypeScript'],
    ctaText: 'Discuss Mobile App',
    href: '/services/mobile-app-development',
  },
  {
    slug: 'data-analytics',
    title: 'Data Analytics & BI',
    description:
      'Turn scattered data into clear dashboards, reports, and business intelligence your team can act on.',
    features: [
      'Business Dashboards',
      'Analytics Integrations',
      'Reporting Views',
      'Data Pipeline Automation',
    ],
    techs: ['Python', 'OpenAI', 'Power BI', 'SQL', 'Pandas'],
    ctaText: 'Build My Dashboard',
    href: '/services/data-analytics',
  },
  {
    slug: 'growth-marketing-seo',
    title: 'Growth Marketing & SEO',
    description:
      'Improve organic visibility, technical SEO, content strategy, and conversion tracking for SaaS, AI products, and business platforms.',
    features: [
      'Technical SEO Audits',
      'Content Growth Strategy',
      'Analytics & Conversion Tracking',
      'Paid Campaign Support',
    ],
    techs: ['Google Analytics', 'SEMrush', 'Ahrefs', 'Google Ads', 'HubSpot'],
    ctaText: 'Grow My Traffic',
    href: '/services/growth-marketing-seo',
  },
  {
    slug: 'technical-consulting',
    title: 'Technical Consulting',
    description:
      'CTO-level tech strategy, architecture decisions, and investor-ready technical due diligence.',
    features: [
      'CTO-Level Tech Strategy',
      'Architecture & Stack Selection',
      'Product Roadmap Planning',
      'Investor-Ready Due Diligence',
    ],
    techs: ['Architecture', 'Agile', 'Team Management', 'Roadmapping'],
    ctaText: 'Get Roadmap',
    href: '/services/technical-consulting',
  },
];

export default function ServicesPage() {
  const { theme, toggleTheme } = useTheme();

  const { linkedinUrl, instagramUrl, githubUrl } = SITE_SOCIAL;
  const copyrightText = getCopyrightText();

  const isDark = theme === 'dark';

  return (
    <div
      style={{
        backgroundColor: isDark ? 'var(--page-bg-dark, #1d2127)' : 'var(--page-bg, #ffffff)',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      <div
        id="theme-toggle"
        role="button"
        tabIndex={0}
        aria-label="Toggle theme"
        onClick={toggleTheme}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
          }
        }}
      >
        <ThemeToggleIcon />
      </div>

      <nav id="desktop-navbar" aria-label="Main Navigation">
        <NewNavBar />
      </nav>

      <nav id="mobile-navbar" aria-label="Mobile Navigation">
        <NavBarMobile />
      </nav>

      <main id="main-content" aria-label="Services Main Content">
        <h1
          style={{
            position: 'absolute',
            left: '-9999px',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
        >
          Our Services
        </h1>

        <div style={{ maxWidth: '1320px', margin: '20px auto 0', padding: '0 2rem' }}>
          <Breadcrumbs theme={theme as 'light' | 'dark'} />
        </div>

        <Suspense fallback={<LoadingAnimation size="medium" />}>
          <ServicesHero />
        </Suspense>

        {/* ── Core Services ────────────────────────────────────────────────── */}
        <section className="services-section" aria-labelledby="core-heading">
          <header className="section-head">
            <span className={`eyebrow ${isDark ? 'eyebrow-dark' : 'eyebrow-light'}`}>
              Core Services
            </span>
            <h2
              id="core-heading"
              className={`section-title ${isDark ? 'title-dark' : 'title-light'}`}
            >
              What we&apos;re <span className="title-accent">best at</span>
            </h2>
            <p className={`section-sub ${isDark ? 'sub-dark' : 'sub-light'}`}>
              Three focused services that define Megicode&apos;s core strength — pick the one that
              fits your stage.
            </p>
          </header>

          <div className="services-grid">
            {coreServices.map((service, idx) => (
              <ServiceCard
                key={service.slug}
                slug={service.slug}
                title={service.title}
                description={service.description}
                features={service.features}
                techs={service.techs}
                ctaText={service.ctaText}
                href={service.href}
                delay={idx * 0.1}
                index={idx}
              />
            ))}
          </div>
        </section>

        {/* ── Supporting Capabilities ───────────────────────────────────────── */}
        <section
          className="services-section supporting-section"
          aria-labelledby="supporting-heading"
        >
          <header className="section-head">
            <span className={`eyebrow ${isDark ? 'eyebrow-dark' : 'eyebrow-light'}`}>
              Supporting Capabilities
            </span>
            <h2
              id="supporting-heading"
              className={`section-title ${isDark ? 'title-dark' : 'title-light'}`}
            >
              Supporting Capabilities
            </h2>
            <p className={`section-sub ${isDark ? 'sub-dark' : 'sub-light'}`}>
              Specialist capabilities that support the core product, automation, and platform work.
            </p>
          </header>

          <div className="services-grid">
            {supportingServices.map((service, idx) => (
              <ServiceCard
                key={service.slug}
                slug={service.slug}
                title={service.title}
                description={service.description}
                features={service.features}
                techs={service.techs}
                ctaText={service.ctaText}
                href={service.href}
                delay={idx * 0.08}
                index={idx}
              />
            ))}
          </div>

          <p className={`delivery-note ${isDark ? 'note-dark' : 'note-light'}`}>
            Need mobile apps, UX design, cloud setup, data, SEO, or roadmap support? These are
            available as part of complete product delivery.
          </p>
        </section>
      </main>

      <style jsx>{`
        /* ── Section layout ── */
        .services-section {
          padding: 4rem 2rem 2rem;
          max-width: 1320px;
          margin: 0 auto;
        }
        .supporting-section {
          padding-top: 2rem;
          padding-bottom: 5rem;
        }

        /* ── Section header ── */
        .section-head {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-bottom: 2.5rem;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          font-family: 'Open Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 100px;
        }
        .eyebrow-light {
          background: rgba(69, 115, 223, 0.1);
          color: #4573df;
        }
        .eyebrow-dark {
          background: rgba(69, 115, 223, 0.18);
          color: #7ba0ff;
        }

        .section-title {
          font-family: 'Open Sans', sans-serif;
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.025em;
          margin: 0;
        }
        .title-light {
          color: #111827;
        }
        .title-dark {
          color: #f1f5f9;
        }

        .title-accent {
          background: linear-gradient(90deg, #4573df 0%, #2d4fa2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-sub {
          font-family: 'Open Sans', sans-serif;
          font-size: 1rem;
          line-height: 1.7;
          max-width: 480px;
          margin: 0;
        }
        .sub-light {
          color: #6b7280;
        }
        .sub-dark {
          color: #94a3b8;
        }

        /* ── Card grid ── */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 1.75rem;
        }

        /* ── Delivery note ── */
        .delivery-note {
          font-family: 'Open Sans', sans-serif;
          font-size: 0.875rem;
          line-height: 1.6;
          font-style: italic;
          text-align: center;
          margin: 2rem 0 0;
        }
        .note-light {
          color: #9ca3af;
        }
        .note-dark {
          color: #64748b;
        }

        /* ── Responsive ── */
        @media (max-width: 860px) {
          .services-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.25rem;
          }
        }
        @media (max-width: 640px) {
          .services-section {
            padding: 2.5rem 1rem 1.5rem;
          }
          .supporting-section {
            padding-bottom: 3rem;
          }
          .services-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <footer id="footer-section" aria-label="Footer" style={{ width: '100%', overflow: 'hidden' }}>
        <Footer
          linkedinUrl={linkedinUrl}
          instagramUrl={instagramUrl}
          githubUrl={githubUrl}
          copyrightText={copyrightText}
        />
      </footer>
    </div>
  );
}
