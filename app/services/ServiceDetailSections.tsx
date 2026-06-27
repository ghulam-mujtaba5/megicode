'use client';
import React from 'react';

import Link from 'next/link';

import type { ServicePageCopy } from './servicePageCopy';

const serviceCatalog = [
  {
    slug: 'ai-automation-agents',
    title: 'AI Automation & Agents',
    href: '/services/ai-automation-agents',
    summary: 'Automate leads, replies, bookings, and repetitive workflows.',
  },
  {
    slug: 'ai-saas-mvp-development',
    title: 'AI SaaS & MVP Development',
    href: '/services/ai-saas-mvp-development',
    summary: 'Turn an AI idea into a launch-ready product.',
  },
  {
    slug: 'custom-web-development',
    title: 'Custom Web Apps & Business Platforms',
    href: '/services/custom-web-development',
    summary: 'Build portals, dashboards, CRMs, and booking systems.',
  },
  {
    slug: 'ui-ux-design',
    title: 'UI/UX Product Design',
    href: '/services/ui-ux-design',
    summary: 'Design interfaces users understand and trust.',
  },
  {
    slug: 'cloud-devops',
    title: 'Cloud & DevOps',
    href: '/services/cloud-devops',
    summary: 'Launch faster with stable deployment and infrastructure.',
  },
  {
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    href: '/services/mobile-app-development',
    summary: 'Bring your platform to iOS and Android.',
  },
  {
    slug: 'data-analytics',
    title: 'Data Analytics & BI',
    href: '/services/data-analytics',
    summary: 'Turn scattered data into clear decisions.',
  },
  {
    slug: 'growth-marketing-seo',
    title: 'Growth Marketing & SEO',
    href: '/services/growth-marketing-seo',
    summary: 'Improve visibility, traffic quality, and conversions.',
  },
  {
    slug: 'technical-consulting',
    title: 'Technical Consulting',
    href: '/services/technical-consulting',
    summary: 'Get the right roadmap before you build.',
  },
];

const bestSellingSlugs = [
  'ai-automation-agents',
  'ai-saas-mvp-development',
  'custom-web-development',
];

const recommendationMap: Record<string, string[]> = {
  'ai-automation-agents': ['ai-saas-mvp-development', 'custom-web-development', 'data-analytics'],
  'ai-saas-mvp-development': ['ai-automation-agents', 'ui-ux-design', 'cloud-devops'],
  'custom-web-development': ['ai-automation-agents', 'data-analytics', 'cloud-devops'],
  'ui-ux-design': ['custom-web-development', 'ai-saas-mvp-development', 'growth-marketing-seo'],
  'cloud-devops': ['custom-web-development', 'ai-saas-mvp-development', 'technical-consulting'],
  'mobile-app-development': ['ui-ux-design', 'custom-web-development', 'cloud-devops'],
  'data-analytics': ['ai-automation-agents', 'custom-web-development', 'technical-consulting'],
  'growth-marketing-seo': ['ui-ux-design', 'custom-web-development', 'data-analytics'],
  'technical-consulting': ['ai-saas-mvp-development', 'custom-web-development', 'cloud-devops'],
};

function getServiceBySlug(slug: string) {
  return serviceCatalog.find((service) => service.slug === slug);
}

function getRecommendedSlugs(currentSlug: string, history: string[], sourceHint: string) {
  const hinted = /chatbot|automation|whatsapp|lead|booking/i.test(sourceHint)
    ? ['ai-automation-agents', 'custom-web-development', 'data-analytics']
    : /seo|growth|traffic|content/i.test(sourceHint)
      ? ['growth-marketing-seo', 'ui-ux-design', 'data-analytics']
      : /mobile|ios|android/i.test(sourceHint)
        ? ['mobile-app-development', 'ui-ux-design', 'cloud-devops']
        : /dashboard|analytics|data|bi/i.test(sourceHint)
          ? ['data-analytics', 'ai-automation-agents', 'custom-web-development']
          : [];

  return [...hinted, ...(recommendationMap[currentSlug] || []), ...history]
    .filter((slug) => slug !== currentSlug)
    .filter((slug, index, list) => list.indexOf(slug) === index)
    .slice(0, 3);
}

function useVisitorContext(currentSlug: string) {
  const [isReturning, setIsReturning] = React.useState(false);
  const [viewedSlugs, setViewedSlugs] = React.useState<string[]>([]);
  const [localTime, setLocalTime] = React.useState('');
  const [sourceHint, setSourceHint] = React.useState('');

  React.useEffect(() => {
    const formatTime = () => {
      setLocalTime(
        new Intl.DateTimeFormat(undefined, {
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short',
        }).format(new Date())
      );
    };

    formatTime();
    const interval = window.setInterval(formatTime, 60_000);

    const hasVisited = window.localStorage.getItem('megicode:returningVisitor') === 'true';
    const previous = JSON.parse(
      window.localStorage.getItem('megicode:viewedServices') || '[]'
    ) as string[];
    const nextViewed = [currentSlug, ...previous.filter((slug) => slug !== currentSlug)].slice(
      0,
      5
    );

    window.localStorage.setItem('megicode:returningVisitor', 'true');
    window.localStorage.setItem('megicode:viewedServices', JSON.stringify(nextViewed));
    window.sessionStorage.setItem('megicode:lastService', currentSlug);

    window.setTimeout(() => {
      setIsReturning(hasVisited);
      setViewedSlugs(previous.filter((slug) => slug !== currentSlug).slice(0, 3));
      setSourceHint(`${document.referrer} ${window.location.pathname}`.toLowerCase());
    }, 0);

    return () => window.clearInterval(interval);
  }, [currentSlug]);

  return { isReturning, viewedSlugs, localTime, sourceHint };
}

export function OurProcess({
  steps,
  theme,
}: {
  steps: { title: string; desc: string; icon?: string | React.ReactNode }[];
  theme?: string;
}) {
  const isDark = theme === 'dark';
  return (
    <section style={{ marginTop: 32, marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4573df', marginBottom: 18 }}>
        Our Process
      </h2>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        {steps.map((step, i) => (
          <div
            key={i}
            style={{ flex: 1, minWidth: 120, textAlign: 'center', position: 'relative' }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                margin: '0 auto 8px',
                borderRadius: '50%',
                background: isDark ? '#2a2f45' : '#e3e6ea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px #4573df22',
                fontSize: 26,
              }}
            >
              {step.icon ? (
                typeof step.icon === 'string' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={step.icon} alt={step.title} style={{ width: 28, height: 28 }} />
                ) : (
                  step.icon
                )
              ) : (
                <span role="img" aria-label="step">
                  🔹
                </span>
              )}
            </div>
            <div
              style={{ fontWeight: 700, color: '#4573df', fontSize: '1.05rem', marginBottom: 4 }}
            >
              {step.title}
            </div>
            <div style={{ fontSize: '0.98rem', color: isDark ? '#c8ccd4' : '#444', opacity: 0.85 }}>
              {step.desc}
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  position: 'absolute',
                  right: -6,
                  top: 24,
                  width: 12,
                  height: 2,
                  background: '#4573df55',
                  zIndex: 0,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function ServiceProofStrip({ proof, theme }: { proof: string; theme?: string }) {
  const isDark = theme === 'dark';
  return (
    <section
      aria-label="Service proof point"
      style={{
        width: 'min(1120px, calc(100% - 32px))',
        margin: '-0.5rem auto 2.4rem',
        padding: '0.9rem 1.1rem',
        borderRadius: 14,
        border: isDark ? '1px solid rgba(123,160,255,0.22)' : '1px solid rgba(69,115,223,0.16)',
        background: isDark ? 'rgba(29,33,39,0.82)' : 'rgba(255,255,255,0.86)',
        boxShadow: isDark ? '0 14px 34px rgba(0,0,0,0.2)' : '0 12px 30px rgba(69,115,223,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        color: isDark ? '#dce6ff' : '#334155',
        fontSize: '0.92rem',
        lineHeight: 1.55,
        fontWeight: 600,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: '#4573df',
          boxShadow: '0 0 0 6px rgba(69,115,223,0.12)',
          flexShrink: 0,
        }}
      />
      <span style={{ color: '#4573df', fontWeight: 800, flexShrink: 0 }}>Proof</span>
      <span>{proof}</span>
    </section>
  );
}

export function ServicePersonalizationPanel({
  currentSlug,
  currentTitle,
  primaryCta,
  onConsultationClick,
  theme,
}: {
  currentSlug: string;
  currentTitle: string;
  primaryCta: string;
  onConsultationClick: () => void;
  theme?: string;
}) {
  const { isReturning, viewedSlugs, localTime } = useVisitorContext(currentSlug);
  const isDark = theme === 'dark';
  const heading = isDark ? '#f8fafc' : '#1d2127';
  const text = isDark ? '#dbe6fb' : '#334155';
  const panel = isDark
    ? 'linear-gradient(135deg, rgba(29,33,39,0.96), rgba(36,41,54,0.92))'
    : 'linear-gradient(135deg, #ffffff, #f8fafc)';
  const quickLinks = isReturning
    ? viewedSlugs.map(getServiceBySlug).filter(Boolean)
    : bestSellingSlugs.map(getServiceBySlug).filter(Boolean);

  return (
    <section
      aria-label="Personalized service guidance"
      style={{
        width: 'min(1120px, calc(100% - 32px))',
        margin: '0 auto 2.5rem',
        border: isDark ? '1px solid rgba(123,160,255,0.22)' : '1px solid rgba(69,115,223,0.16)',
        borderRadius: 22,
        padding: '1.25rem',
        background: panel,
        boxShadow: isDark ? '0 18px 48px rgba(0,0,0,0.22)' : '0 18px 48px rgba(69,115,223,0.08)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <div>
          <p
            style={{
              margin: '0 0 0.35rem',
              color: '#4573df',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {isReturning ? 'Welcome back' : 'New here? Start with the proven paths'}
          </p>
          <h2
            style={{
              margin: 0,
              color: heading,
              fontSize: 'clamp(1.25rem, 2vw, 1.7rem)',
              lineHeight: 1.2,
              letterSpacing: 0,
            }}
          >
            {isReturning
              ? `Continue exploring ${currentTitle} with a faster next step.`
              : 'Choose the outcome you want, then book the right consultation.'}
          </h2>
          <p style={{ margin: '0.75rem 0 0', color: text, lineHeight: 1.6, fontWeight: 620 }}>
            Local time: {localTime || 'detecting...'} · Remote-first delivery · Serving clients in
            5+ countries.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={onConsultationClick}
            style={{
              border: 0,
              borderRadius: 999,
              padding: '0.9rem 1.35rem',
              background: 'linear-gradient(135deg, #ff9800, #f97316)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.98rem',
              cursor: 'pointer',
              boxShadow: '0 14px 30px rgba(249,115,22,0.28)',
              width: 'fit-content',
            }}
          >
            {isReturning ? primaryCta : 'Get a Free AI Consultation'}
          </button>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
            {quickLinks.map(
              (service) =>
                service && (
                  <Link
                    key={service.slug}
                    href={service.href}
                    style={{
                      borderRadius: 999,
                      padding: '0.55rem 0.8rem',
                      border: isDark
                        ? '1px solid rgba(123,160,255,0.26)'
                        : '1px solid rgba(69,115,223,0.18)',
                      color: '#4573df',
                      background: isDark ? 'rgba(123,160,255,0.08)' : 'rgba(69,115,223,0.08)',
                      textDecoration: 'none',
                      fontWeight: 750,
                      fontSize: '0.84rem',
                    }}
                  >
                    {service.title}
                  </Link>
                )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServiceConversionPanel({
  copy,
  primaryCta,
  onConsultationClick,
  theme,
}: {
  copy: ServicePageCopy;
  primaryCta: string;
  onConsultationClick: () => void;
  theme?: string;
}) {
  const isDark = theme === 'dark';
  return (
    <section
      aria-label="Service action prompt"
      style={{
        width: 'min(1120px, calc(100% - 32px))',
        margin: '2.5rem auto',
        borderRadius: 24,
        padding: '1.4rem',
        background: 'linear-gradient(135deg, #4573df, #2d4fa2)',
        color: '#ffffff',
        boxShadow: isDark ? '0 22px 52px rgba(0,0,0,0.28)' : '0 22px 52px rgba(69,115,223,0.18)',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ maxWidth: 720 }}>
          <p
            style={{
              margin: '0 0 0.35rem',
              fontWeight: 850,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontSize: '0.78rem',
              color: 'rgba(255,255,255,0.78)',
            }}
          >
            Outcome first
          </p>
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(1.35rem, 2.2vw, 2rem)',
              lineHeight: 1.18,
              letterSpacing: 0,
              color: '#ffffff',
            }}
          >
            {copy.abVariant}
          </h2>
        </div>
        <button
          type="button"
          onClick={onConsultationClick}
          style={{
            border: 0,
            borderRadius: 999,
            padding: '0.95rem 1.45rem',
            background: '#ff9800',
            color: '#ffffff',
            fontWeight: 850,
            fontSize: '0.98rem',
            cursor: 'pointer',
            boxShadow: '0 16px 32px rgba(0,0,0,0.22)',
          }}
        >
          {primaryCta}
        </button>
      </div>
    </section>
  );
}

export function ServiceRecommendationPanel({
  currentSlug,
  theme,
}: {
  currentSlug: string;
  theme?: string;
}) {
  const { viewedSlugs, sourceHint } = useVisitorContext(currentSlug);
  const isDark = theme === 'dark';
  const heading = isDark ? '#f8fafc' : '#1d2127';
  const text = isDark ? '#dbe6fb' : '#334155';
  const recommended = getRecommendedSlugs(currentSlug, viewedSlugs, sourceHint)
    .map(getServiceBySlug)
    .filter(Boolean);

  return (
    <section
      aria-labelledby="smart-recommendations-title"
      style={{
        margin: '3rem 0',
        display: 'grid',
        gap: '1rem',
      }}
    >
      <div>
        <p
          style={{
            margin: '0 0 0.45rem',
            color: '#4573df',
            fontWeight: 850,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontSize: '0.8rem',
          }}
        >
          Recommended next
        </p>
        <h2
          id="smart-recommendations-title"
          style={{
            margin: 0,
            color: heading,
            fontSize: 'clamp(1.45rem, 2.2vw, 2rem)',
            lineHeight: 1.2,
            letterSpacing: 0,
          }}
        >
          Services that usually pair well with this goal
        </h2>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
          gap: '1rem',
        }}
      >
        {recommended.map(
          (service) =>
            service && (
              <Link
                key={service.slug}
                href={service.href}
                style={{
                  border: isDark
                    ? '1px solid rgba(123,160,255,0.22)'
                    : '1px solid rgba(69,115,223,0.16)',
                  borderRadius: 18,
                  padding: '1.1rem',
                  background: isDark ? 'rgba(36,41,54,0.9)' : 'rgba(255,255,255,0.9)',
                  boxShadow: isDark
                    ? '0 14px 34px rgba(0,0,0,0.16)'
                    : '0 14px 34px rgba(69,115,223,0.07)',
                  textDecoration: 'none',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 0.45rem',
                    color: heading,
                    fontSize: '1.02rem',
                    lineHeight: 1.3,
                    letterSpacing: 0,
                  }}
                >
                  {service.title}
                </h3>
                <p style={{ margin: 0, color: text, lineHeight: 1.55, fontWeight: 600 }}>
                  {service.summary}
                </p>
              </Link>
            )
        )}
      </div>
    </section>
  );
}

export function ServiceUsabilityBlocks({ copy, theme }: { copy: ServicePageCopy; theme?: string }) {
  const isDark = theme === 'dark';
  const cardBackground = isDark ? 'rgba(36,41,54,0.92)' : 'rgba(255,255,255,0.88)';
  const border = isDark ? '1px solid rgba(123,160,255,0.18)' : '1px solid rgba(69,115,223,0.14)';
  const text = isDark ? '#dbe6fb' : '#334155';
  const heading = isDark ? '#f8fafc' : '#1d2127';

  return (
    <section
      aria-labelledby="service-usefulness-title"
      style={{
        width: '100%',
        margin: '3rem 0',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
        gap: '1.5rem',
        alignItems: 'stretch',
      }}
    >
      <div
        style={{
          border,
          borderRadius: 22,
          padding: '2rem',
          background: isDark
            ? 'linear-gradient(145deg, rgba(29,33,39,0.96), rgba(36,41,54,0.9))'
            : 'linear-gradient(145deg, #ffffff, #f8fafc)',
          boxShadow: isDark ? '0 18px 44px rgba(0,0,0,0.22)' : '0 18px 44px rgba(69,115,223,0.08)',
        }}
      >
        <p
          style={{
            margin: '0 0 0.55rem',
            color: '#4573df',
            fontWeight: 800,
            fontSize: '0.82rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Where this helps
        </p>
        <h2
          id="service-usefulness-title"
          style={{
            margin: '0 0 1rem',
            color: heading,
            fontSize: 'clamp(1.6rem, 2.4vw, 2.35rem)',
            lineHeight: 1.15,
            letterSpacing: 0,
          }}
        >
          {copy.useCaseHeading}
        </h2>
        <div style={{ display: 'grid', gap: '0.8rem', marginTop: '1.35rem' }}>
          {copy.useCases.map((item) => (
            <div
              key={item}
              style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
                color: text,
                fontWeight: 650,
                lineHeight: 1.55,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  background: '#4573df',
                  marginTop: '0.45rem',
                  flexShrink: 0,
                }}
              />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: '1rem',
        }}
      >
        {copy.outcomes.map((outcome) => (
          <article
            key={outcome.title}
            style={{
              border,
              borderRadius: 18,
              padding: '1.35rem',
              background: cardBackground,
              boxShadow: isDark
                ? '0 14px 34px rgba(0,0,0,0.16)'
                : '0 14px 34px rgba(69,115,223,0.07)',
              minHeight: 190,
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'rgba(69,115,223,0.12)',
                border: '1px solid rgba(69,115,223,0.18)',
                marginBottom: '1rem',
              }}
            />
            <h3
              style={{
                margin: '0 0 0.6rem',
                color: heading,
                fontSize: '1.08rem',
                lineHeight: 1.3,
                letterSpacing: 0,
              }}
            >
              {outcome.title}
            </h3>
            <p
              style={{
                margin: 0,
                color: text,
                fontSize: '0.95rem',
                lineHeight: 1.6,
                fontWeight: 560,
              }}
            >
              {outcome.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ServiceDecisionGuide({ copy, theme }: { copy: ServicePageCopy; theme?: string }) {
  const isDark = theme === 'dark';
  const panel = isDark ? 'rgba(29,33,39,0.96)' : 'rgba(255,255,255,0.92)';
  const border = isDark ? '1px solid rgba(123,160,255,0.2)' : '1px solid rgba(69,115,223,0.14)';
  const text = isDark ? '#dbe6fb' : '#334155';
  const heading = isDark ? '#f8fafc' : '#1d2127';

  return (
    <section
      aria-labelledby="decision-guide-title"
      style={{
        margin: '4rem 0',
        border,
        borderRadius: 24,
        background: panel,
        boxShadow: isDark ? '0 18px 48px rgba(0,0,0,0.22)' : '0 18px 48px rgba(69,115,223,0.08)',
        padding: '2rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '1.5rem',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ maxWidth: 680 }}>
          <p
            style={{
              margin: '0 0 0.45rem',
              color: '#4573df',
              fontWeight: 800,
              fontSize: '0.82rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Decision guide
          </p>
          <h2
            id="decision-guide-title"
            style={{
              margin: 0,
              color: heading,
              fontSize: 'clamp(1.5rem, 2.2vw, 2.1rem)',
              lineHeight: 1.2,
              letterSpacing: 0,
            }}
          >
            Make sure this is the right move before you spend.
          </h2>
        </div>
        <p
          style={{
            margin: 0,
            maxWidth: 420,
            color: text,
            fontSize: '1rem',
            lineHeight: 1.65,
            fontWeight: 650,
          }}
        >
          {copy.abVariant}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: '1rem',
        }}
      >
        <div
          style={{
            border,
            borderRadius: 16,
            padding: '1.25rem',
            background: isDark ? 'rgba(36,41,54,0.72)' : '#f8fafc',
          }}
        >
          <h3 style={{ margin: '0 0 0.9rem', color: heading, fontSize: '1rem', letterSpacing: 0 }}>
            Good fit when
          </h3>
          {copy.decisionGuide.goodFit.map((item) => (
            <p
              key={item}
              style={{ margin: '0 0 0.65rem', color: text, lineHeight: 1.55, fontWeight: 600 }}
            >
              {item}
            </p>
          ))}
        </div>
        <div
          style={{
            border,
            borderRadius: 16,
            padding: '1.25rem',
            background: isDark ? 'rgba(36,41,54,0.52)' : '#ffffff',
          }}
        >
          <h3 style={{ margin: '0 0 0.9rem', color: heading, fontSize: '1rem', letterSpacing: 0 }}>
            Avoid if
          </h3>
          {copy.decisionGuide.notFor.map((item) => (
            <p
              key={item}
              style={{ margin: '0 0 0.65rem', color: text, lineHeight: 1.55, fontWeight: 600 }}
            >
              {item}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export function EngagementModels({ theme }: { theme?: string } = {}) {
  const isDark = theme === 'dark';
  return (
    <section style={{ marginTop: 32, marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#4573df', marginBottom: 10 }}>
        Engagement Models
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: '1.3rem' }} aria-label="Fixed Price" role="img">
            📊
          </span>
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: '1.05rem',
                color: isDark ? '#e0e4ec' : '#232946',
              }}
            >
              Fixed Price
            </div>
            <div
              style={{
                color: isDark ? '#a8b0c0' : '#3a4a5d',
                fontWeight: 600,
                fontSize: '0.99rem',
                marginTop: 2,
              }}
            >
              Defined scope, predictable budget, and milestone-based billing. Best for projects with
              clear requirements and risk management needs.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: '1.3rem' }} aria-label="Dedicated Team" role="img">
            🤝
          </span>
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: '1.05rem',
                color: isDark ? '#e0e4ec' : '#232946',
              }}
            >
              Dedicated Team
            </div>
            <div
              style={{
                color: isDark ? '#a8b0c0' : '#3a4a5d',
                fontWeight: 600,
                fontSize: '0.99rem',
                marginTop: 2,
              }}
            >
              Scalable, cross-functional team extension. Direct access to certified Megicode
              experts, rapid onboarding, and seamless enterprise collaboration.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: '1.3rem' }} aria-label="Time & Material" role="img">
            ⏱️
          </span>
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: '1.05rem',
                color: isDark ? '#e0e4ec' : '#232946',
              }}
            >
              Time & Material
            </div>
            <div
              style={{
                color: isDark ? '#a8b0c0' : '#3a4a5d',
                fontWeight: 600,
                fontSize: '0.99rem',
                marginTop: 2,
              }}
            >
              Agile, transparent billing for evolving requirements. Ideal for innovation, R&D, and
              projects with dynamic scope.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MethodologyAndCommunication({ theme }: { theme?: string } = {}) {
  const isDark = theme === 'dark';
  return (
    <section style={{ marginTop: 32, marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#4573df', marginBottom: 10 }}>
        Methodology & Communication
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: '1.3rem' }} aria-label="Agile, CMMI L3+" role="img">
            ⚡
          </span>
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: '1.05rem',
                color: isDark ? '#e0e4ec' : '#232946',
              }}
            >
              Agile, CMMI L3+
            </div>
            <div
              style={{
                color: isDark ? '#a8b0c0' : '#3a4a5d',
                fontWeight: 600,
                fontSize: '0.99rem',
                marginTop: 2,
              }}
            >
              Iterative, sprint-based delivery with continuous improvement. CMMI L3+ for process
              maturity and global best practices in enterprise IT.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: '1.3rem' }} aria-label="Transparent Updates" role="img">
            📢
          </span>
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: '1.05rem',
                color: isDark ? '#e0e4ec' : '#232946',
              }}
            >
              Transparent Updates
            </div>
            <div
              style={{
                color: isDark ? '#a8b0c0' : '#3a4a5d',
                fontWeight: 600,
                fontSize: '0.99rem',
                marginTop: 2,
              }}
            >
              Weekly demos, open communication, and real-time dashboards for full project
              transparency and stakeholder alignment.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: '1.3rem' }} aria-label="Jira, Figma, GitHub" role="img">
            🛠️
          </span>
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: '1.05rem',
                color: isDark ? '#e0e4ec' : '#232946',
              }}
            >
              Jira, Figma, GitHub
            </div>
            <div
              style={{
                color: isDark ? '#a8b0c0' : '#3a4a5d',
                fontWeight: 600,
                fontSize: '0.99rem',
                marginTop: 2,
              }}
            >
              Enterprise-grade tools for project tracking, secure design collaboration, and code
              quality assurance.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: '1.3rem' }} aria-label="Risk Management & Governance" role="img">
            🛡️
          </span>
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: '1.05rem',
                color: isDark ? '#e0e4ec' : '#232946',
              }}
            >
              Risk Management & Governance
            </div>
            <div
              style={{
                color: isDark ? '#a8b0c0' : '#3a4a5d',
                fontWeight: 600,
                fontSize: '0.99rem',
                marginTop: 2,
              }}
            >
              Proactive risk identification, regulatory compliance (GDPR, ISO 27001), and executive
              reporting for enterprise assurance.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServiceFAQs({ faqs, theme }: { faqs: { q: string; a: string }[]; theme?: string }) {
  const [open, setOpen] = React.useState<number | null>(null);
  const isDark = theme === 'dark';
  return (
    <section style={{ marginTop: 32, marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#4573df', marginBottom: 10 }}>
        FAQs
      </h2>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {faqs.map((faq, i) => (
          <div
            key={i}
            style={{
              marginBottom: 12,
              borderRadius: 8,
              background: isDark ? '#1e2233' : '#e3e6ea',
              boxShadow: '0 1px 4px #4573df11',
            }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                padding: '0.7rem 1rem',
                fontWeight: 700,
                color: '#4573df',
                fontSize: '1.01rem',
                cursor: 'pointer',
              }}
            >
              {faq.q}
            </button>
            {open === i && (
              <div
                style={{
                  padding: '0 1rem 0.7rem 1rem',
                  color: isDark ? '#c8ccd4' : '#444',
                  fontSize: '0.98rem',
                }}
              >
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
