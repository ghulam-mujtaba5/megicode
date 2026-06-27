'use client';
import React from 'react';

import type { ServicePageCopy } from './servicePageCopy';

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
