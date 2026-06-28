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
    badge: 'Lead automation',
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
    bestFor: 'Teams losing leads, time, and follow-ups to manual work',
    result: 'Capture, qualify, reply, book, and follow up without staff chasing every task.',
    path: ['Map workflow', 'Build agent', 'Connect tools'],
  },
  {
    slug: 'ai-saas-mvp-development',
    badge: 'AI product build',
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
    bestFor: 'Founders turning an AI idea into a real SaaS MVP',
    result: 'Get the right product architecture, AI features, dashboard, and launch plan.',
    path: ['Roadmap', 'MVP build', 'Launch'],
  },
  {
    slug: 'custom-web-development',
    badge: 'Business platform',
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
    bestFor: 'Businesses replacing spreadsheets, manual admin, and scattered tools',
    result: 'Turn daily operations into one clear platform your team can actually use.',
    path: ['Model process', 'Build portal', 'Scale ops'],
  },
];

const supportingServices = [
  {
    slug: 'ui-ux-design',
    badge: 'UX clarity',
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
    bestFor: 'Products and websites that need clearer user flow and trust',
    result: 'Make your offer easier to understand, navigate, and buy.',
    path: ['Audit flow', 'Redesign UI', 'Test clarity'],
  },
  {
    slug: 'cloud-devops',
    badge: 'Launch stability',
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
    bestFor: 'Teams preparing for launch, scale, or cleaner deployments',
    result: 'Ship with stable infrastructure, CI/CD, monitoring, and fewer launch surprises.',
    path: ['Plan infra', 'Automate CI', 'Monitor'],
  },
  {
    slug: 'mobile-app-development',
    badge: 'Mobile experience',
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
    bestFor: 'Platforms that need customer or staff access on phones',
    result: 'Extend your product into iOS and Android without rebuilding the whole backend.',
    path: ['Define app', 'Build mobile', 'Store ready'],
  },
  {
    slug: 'data-analytics',
    badge: 'Data clarity',
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
    bestFor: 'Teams making decisions from messy sheets, tools, and reports',
    result: 'Turn scattered data into dashboards and views leadership can trust.',
    path: ['Clean data', 'Model KPIs', 'Dashboard'],
  },
  {
    slug: 'growth-marketing-seo',
    badge: 'Growth system',
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
    bestFor: 'SaaS, AI, and service brands that need better qualified traffic',
    result: 'Improve search visibility, tracking, content direction, and conversion signals.',
    path: ['Audit funnel', 'Fix SEO', 'Track growth'],
  },
  {
    slug: 'technical-consulting',
    badge: 'CTO guidance',
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
    bestFor: 'Non-technical founders needing product and architecture decisions',
    result: 'Get a clearer roadmap before spending heavily on the wrong build.',
    path: ['Review idea', 'Choose stack', 'Plan build'],
  },
];

const offerPackages = [
  {
    name: 'Starter Audit',
    fit: 'You know something is inefficient, but need the right first step.',
    includes: ['Workflow or website audit', 'Priority fix list', 'Implementation roadmap'],
    cta: 'Book Free Audit',
  },
  {
    name: 'MVP Roadmap',
    fit: 'You have an AI/SaaS idea and need a practical build plan.',
    includes: ['Feature scope', 'Tech architecture', 'Timeline and budget logic'],
    cta: 'Get MVP Roadmap',
  },
  {
    name: 'AI Automation Setup',
    fit: 'You want leads, replies, bookings, or reporting automated.',
    includes: ['Workflow mapping', 'AI agent or automation', 'Tool integrations'],
    cta: 'See What We Can Automate',
  },
  {
    name: 'Clinic AI Receptionist',
    fit: 'You run a clinic or appointment-based service and need faster lead handling.',
    includes: ['WhatsApp booking flow', 'Patient intake logic', 'Reminder and handoff setup'],
    cta: 'Automate Clinic Bookings',
  },
  {
    name: 'Full SaaS MVP Build',
    fit: 'You need the product designed, built, launched, and supported.',
    includes: ['UX + development', 'AI features', 'Deployment and handover'],
    cta: 'Discuss My Project',
  },
  {
    name: 'Monthly Support / Retainer',
    fit: 'You already have a product and need steady improvements after launch.',
    includes: ['Feature updates', 'Monitoring and fixes', 'Growth and automation support'],
    cta: 'Plan Ongoing Support',
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
                badge={service.badge}
                bestFor={service.bestFor}
                result={service.result}
                path={service.path}
                featured={idx === 0}
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
                badge={service.badge}
                bestFor={service.bestFor}
                result={service.result}
                path={service.path}
                delay={idx * 0.08}
                index={idx + coreServices.length}
              />
            ))}
          </div>

          <p className={`delivery-note ${isDark ? 'note-dark' : 'note-light'}`}>
            Need mobile apps, UX design, cloud setup, data, SEO, or roadmap support? These are
            available as part of complete product delivery.
          </p>
        </section>

        <section className="offers-section" aria-labelledby="offers-heading">
          <header className="section-head">
            <span className={`eyebrow ${isDark ? 'eyebrow-dark' : 'eyebrow-light'}`}>
              Offer models
            </span>
            <h2
              id="offers-heading"
              className={`section-title ${isDark ? 'title-dark' : 'title-light'}`}
            >
              Clear ways to start without guessing the budget.
            </h2>
            <p className={`section-sub ${isDark ? 'sub-dark' : 'sub-light'}`}>
              Pick a starting model based on risk: audit first, roadmap first, automation first,
              clinic booking first, full MVP build, or monthly support.
            </p>
          </header>

          <div className="offers-grid">
            {offerPackages.map((offer, index) => (
              <article
                key={offer.name}
                className={`offer-card ${isDark ? 'offer-card-dark' : 'offer-card-light'}`}
              >
                <div className="offer-top">
                  <span
                    className={`offer-index ${isDark ? 'offer-index-dark' : 'offer-index-light'}`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3>{offer.name}</h3>
                </div>
                <p>{offer.fit}</p>
                <ul>
                  {offer.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a
                  href="/contact"
                  className={`offer-cta ${isDark ? 'offer-cta-dark' : 'offer-cta-light'}`}
                >
                  {offer.cta}
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>

      <style jsx>{`
        /* ── Section layout ── */
        .services-section {
          padding: 4.5rem 2rem 2.5rem;
          max-width: 1320px;
          margin: 0 auto;
          position: relative;
        }
        .supporting-section {
          padding-top: 2.75rem;
          padding-bottom: 2rem;
        }
        .offers-section {
          max-width: 1320px;
          margin: 0 auto;
          padding: 2rem 2rem 5.5rem;
        }

        /* ── Section header ── */
        .section-head {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-bottom: 2.75rem;
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
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.15rem;
          align-items: stretch;
        }

        #core-heading + .section-sub {
          max-width: 560px;
        }

        /* ── Delivery note ── */
        .delivery-note {
          font-family: 'Open Sans', sans-serif;
          font-size: 0.9rem;
          line-height: 1.6;
          text-align: center;
          max-width: 720px;
          margin: 2.5rem auto 0;
          padding: 1rem 1.25rem;
          border-radius: 18px;
        }

        .offers-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
        }
        .offer-card {
          position: relative;
          overflow: hidden;
          min-height: 310px;
          padding: 1.35rem;
          border-radius: 22px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          box-sizing: border-box;
        }
        .offer-card::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(135deg, rgba(69, 115, 223, 0.09), transparent 52%),
            radial-gradient(circle at 12% 12%, rgba(255, 152, 0, 0.12), transparent 34%);
        }
        .offer-card > * {
          position: relative;
          z-index: 1;
        }
        .offer-card-light {
          background: rgba(255, 255, 255, 0.84);
          border: 1px solid rgba(69, 115, 223, 0.13);
          box-shadow: 0 14px 34px rgba(69, 115, 223, 0.08);
        }
        .offer-card-dark {
          background: #262b34;
          border: 1px solid #3e444c;
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.22);
        }
        .offer-top {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .offer-index {
          width: 38px;
          height: 38px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 0.8rem;
          font-weight: 800;
        }
        .offer-index-light {
          color: #4573df;
          background: rgba(69, 115, 223, 0.09);
          border: 1px solid rgba(69, 115, 223, 0.14);
        }
        .offer-index-dark {
          color: #c0d4ff;
          background: rgba(69, 115, 223, 0.14);
          border: 1px solid rgba(69, 115, 223, 0.22);
        }
        .offer-card h3 {
          margin: 0;
          font-size: 1.08rem;
          line-height: 1.25;
          color: ${isDark ? '#eaf6ff' : '#0f172a'};
        }
        .offer-card p {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.6;
          color: ${isDark ? '#adb5bd' : '#526070'};
        }
        .offer-card ul {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          flex: 1;
        }
        .offer-card li {
          font-size: 0.82rem;
          line-height: 1.45;
          color: ${isDark ? '#d7dde5' : '#334155'};
        }
        .offer-card li::before {
          content: '✓';
          color: #4573df;
          font-weight: 800;
          margin-right: 0.45rem;
        }
        .offer-cta {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          padding: 0.68rem 1rem;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 800;
          text-decoration: none;
        }
        .offer-cta-light {
          color: #ffffff;
          background: linear-gradient(135deg, #4573df, #2d4fa2);
          box-shadow: 0 12px 24px rgba(69, 115, 223, 0.22);
        }
        .offer-cta-dark {
          color: #ffffff;
          background: linear-gradient(135deg, #4573df, #2d4fa2);
          box-shadow: 0 12px 24px rgba(69, 115, 223, 0.28);
        }
        .note-light {
          color: #526070;
          background: rgba(69, 115, 223, 0.06);
          border: 1px solid rgba(69, 115, 223, 0.12);
        }
        .note-dark {
          color: #adb5bd;
          background: rgba(69, 115, 223, 0.1);
          border: 1px solid rgba(69, 115, 223, 0.18);
        }

        /* ── Responsive ── */
        @media (max-width: 1080px) {
          .services-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.25rem;
          }
          .offers-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
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
          .offers-section {
            padding: 1.5rem 1rem 3.5rem;
          }
          .offers-grid {
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
