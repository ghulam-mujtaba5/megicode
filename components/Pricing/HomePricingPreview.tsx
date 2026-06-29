'use client';

import Link from 'next/link';

import { pricingEntrypoints } from '@/data/pricing';

import { useTheme } from '@/context/ThemeContext';

export default function HomePricingPreview() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section
      className={`pricing-preview ${isDark ? 'dark' : 'light'}`}
      aria-labelledby="home-pricing-heading"
    >
      <div className="pricing-preview-inner">
        <div className="section-head">
          <span>Clear starting points</span>
          <h2 id="home-pricing-heading">Clear ways to start without guessing the budget</h2>
          <p>
            Start small with a roadmap or automation package, then scale into a full MVP or custom
            platform when the scope is clear.
          </p>
        </div>

        <div className="preview-grid">
          {pricingEntrypoints.map((entry) => (
            <article className="preview-card" key={entry.title}>
              <div>
                <h3>{entry.title}</h3>
                <strong>{entry.price}</strong>
                {'supportText' in entry && entry.supportText && (
                  <span className="support-line">{entry.supportText}</span>
                )}
                <p>{entry.bestFor}</p>
              </div>
              <Link
                className="card-button"
                href={entry.href}
                aria-label={`${entry.cta}: ${entry.title}`}
              >
                <span>{entry.cta}</span>
                <span className="card-button-icon" aria-hidden="true">
                  -&gt;
                </span>
              </Link>
            </article>
          ))}
        </div>

        <div className="preview-actions">
          <Link className="section-button section-button-primary" href="/pricing">
            <span>View Pricing</span>
            <span className="section-button-icon" aria-hidden="true">
              -&gt;
            </span>
          </Link>
          <Link
            className="section-button section-button-secondary"
            href="/contact?source=home-pricing"
          >
            <span>Book Free Fit Call</span>
            <span className="section-button-icon" aria-hidden="true">
              -&gt;
            </span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .pricing-preview {
          box-sizing: border-box;
          width: 100%;
          padding: 5rem 1.25rem;
          font-family: 'Open Sans', sans-serif;
        }
        .pricing-preview-inner {
          width: min(1180px, calc(100vw - 64px));
          margin: 0 auto;
        }
        .section-head {
          max-width: 780px;
          margin: 0 auto 2rem;
          text-align: center;
        }
        .section-head span {
          display: inline-flex;
          border-radius: 999px;
          padding: 6px 14px;
          background: ${isDark ? 'rgba(69, 115, 223, 0.18)' : 'rgba(69, 115, 223, 0.1)'};
          color: ${isDark ? '#c0d4ff' : '#4573df'};
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        .section-head h2 {
          margin: 12px 0;
          color: ${isDark ? '#f8fafc' : '#111827'};
          font-size: clamp(1.8rem, 3.2vw, 2.65rem);
          line-height: 1.15;
          letter-spacing: 0;
        }
        .section-head p {
          margin: 0;
          color: ${isDark ? '#cbd5e1' : '#526070'};
          line-height: 1.75;
        }
        .preview-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 20px;
        }
        .preview-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 18px;
          min-height: 280px;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.11)' : 'rgba(69,115,223,0.13)'};
          background: ${isDark ? '#252b34' : 'rgba(255,255,255,0.84)'};
          box-shadow: ${isDark
            ? '0 18px 42px rgba(0,0,0,0.22)'
            : '0 18px 42px rgba(69,115,223,0.08)'};
          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease,
            border-color 0.22s ease;
        }
        .preview-card:hover {
          transform: translateY(-4px);
          border-color: ${isDark ? 'rgba(123,160,255,0.28)' : 'rgba(69,115,223,0.24)'};
          box-shadow: ${isDark
            ? '0 24px 52px rgba(0,0,0,0.28)'
            : '0 24px 52px rgba(69,115,223,0.13)'};
        }
        .preview-card h3 {
          margin: 0 0 10px;
          color: ${isDark ? '#f8fafc' : '#111827'};
          font-size: 1rem;
          line-height: 1.3;
        }
        .preview-card strong {
          display: block;
          color: #ff9800;
          font-size: 1.22rem;
          line-height: 1.2;
        }
        .support-line {
          display: block;
          margin-top: 6px;
          color: ${isDark ? '#c0d4ff' : '#2d4fa2'};
          font-size: 0.8rem;
          font-weight: 900;
          line-height: 1.25;
        }
        .preview-card p {
          margin: 14px 0 0;
          color: ${isDark ? '#cbd5e1' : '#526070'};
          font-size: 0.86rem;
          line-height: 1.62;
        }
        .card-button {
          display: inline-flex;
          box-sizing: border-box;
          width: 100%;
          min-height: 46px;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-radius: 999px;
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.14)' : 'rgba(15,23,42,0.12)'};
          padding: 0 18px;
          color: ${isDark ? '#f8fafc' : '#1d2127'};
          background: ${isDark ? 'rgba(255,255,255,0.055)' : 'rgba(15,23,42,0.035)'};
          font-size: 0.86rem;
          font-weight: 900;
          line-height: 1.2;
          text-decoration: none;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }
        .card-button:hover,
        .card-button:focus-visible {
          transform: translateY(-1px);
          border-color: rgba(255, 152, 0, 0.72);
          color: #fff;
          background: linear-gradient(135deg, #ff9800, #f97316);
          box-shadow: 0 16px 30px rgba(249, 115, 22, 0.22);
          outline: none;
        }
        .card-button:focus-visible {
          box-shadow:
            0 0 0 3px rgba(255, 152, 0, 0.22),
            0 16px 30px rgba(249, 115, 22, 0.22);
        }
        .card-button-icon {
          width: auto;
          height: auto;
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #ff9800;
          background: transparent;
          font-size: 1rem;
          line-height: 1;
          transition:
            transform 0.2s ease,
            color 0.2s ease;
        }
        .card-button span:first-child,
        .section-button span:first-child {
          min-width: 0;
          overflow-wrap: anywhere;
        }
        .card-button:hover .card-button-icon,
        .card-button:focus-visible .card-button-icon {
          transform: translateX(2px);
          color: #fff;
        }
        .preview-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-top: 2rem;
        }
        .section-button {
          display: inline-flex;
          box-sizing: border-box;
          min-height: 48px;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          border-radius: 999px;
          border: 1px solid transparent;
          padding: 0 22px;
          font-weight: 900;
          text-decoration: none;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease;
        }
        .section-button:hover,
        .section-button:focus-visible {
          transform: translateY(-1px);
          outline: none;
        }
        .section-button-primary {
          color: #fff;
          background: linear-gradient(135deg, #ff9800, #f97316);
          box-shadow: 0 16px 34px rgba(249, 115, 22, 0.24);
        }
        .section-button-secondary {
          color: ${isDark ? '#f8fafc' : '#1d2127'};
          border-color: ${isDark ? 'rgba(255,255,255,0.16)' : 'rgba(15,23,42,0.14)'};
          background: ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)'};
        }
        .section-button-secondary:hover,
        .section-button-secondary:focus-visible {
          color: #fff;
          border-color: rgba(255, 152, 0, 0.72);
          background: linear-gradient(135deg, #ff9800, #f97316);
          box-shadow: 0 16px 34px rgba(249, 115, 22, 0.24);
        }
        .section-button-icon {
          width: auto;
          height: auto;
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: currentColor;
          background: transparent;
          line-height: 1;
          transition:
            transform 0.2s ease,
            color 0.2s ease;
        }
        .section-button-secondary .section-button-icon {
          color: #ff9800;
          background: transparent;
        }
        .section-button:hover .section-button-icon,
        .section-button:focus-visible .section-button-icon {
          transform: translateX(2px);
        }
        .section-button-secondary:hover .section-button-icon,
        .section-button-secondary:focus-visible .section-button-icon {
          color: #fff;
        }
        @media (max-width: 1120px) {
          .preview-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (max-width: 720px) {
          .pricing-preview {
            padding: 3.5rem 1rem;
          }
          .pricing-preview-inner {
            width: min(100%, calc(100vw - 32px));
          }
          .preview-grid {
            grid-template-columns: 1fr;
          }
          .preview-card {
            min-height: auto;
          }
          .preview-actions {
            flex-direction: column;
          }
          .section-button {
            width: 100%;
          }
        }
      `}</style>
      <style jsx global>{`
        .pricing-preview .card-button {
          display: inline-flex;
          box-sizing: border-box;
          width: 100%;
          min-height: 46px;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-radius: 999px;
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.14)' : 'rgba(15,23,42,0.12)'};
          padding: 0 18px;
          color: ${isDark ? '#f8fafc' : '#1d2127'};
          background: ${isDark ? 'rgba(255,255,255,0.055)' : 'rgba(15,23,42,0.035)'};
          font-size: 0.86rem;
          font-weight: 900;
          line-height: 1.2;
          text-decoration: none;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }
        .pricing-preview .card-button:hover,
        .pricing-preview .card-button:focus-visible {
          transform: translateY(-1px);
          border-color: rgba(255, 152, 0, 0.72);
          color: #fff;
          background: linear-gradient(135deg, #ff9800, #f97316);
          box-shadow: 0 16px 30px rgba(249, 115, 22, 0.22);
          outline: none;
        }
        .pricing-preview .card-button:focus-visible {
          box-shadow:
            0 0 0 3px rgba(255, 152, 0, 0.22),
            0 16px 30px rgba(249, 115, 22, 0.22);
        }
        .pricing-preview .card-button-icon {
          width: auto;
          height: auto;
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #ff9800;
          background: transparent;
          font-size: 1rem;
          line-height: 1;
          transition:
            transform 0.2s ease,
            color 0.2s ease;
        }
        .pricing-preview .card-button span:first-child,
        .pricing-preview .section-button span:first-child {
          min-width: 0;
          overflow-wrap: anywhere;
        }
        .pricing-preview .card-button:hover .card-button-icon,
        .pricing-preview .card-button:focus-visible .card-button-icon {
          transform: translateX(2px);
          color: #fff;
        }
        .pricing-preview .section-button {
          display: inline-flex;
          box-sizing: border-box;
          min-height: 48px;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          border-radius: 999px;
          border: 1px solid transparent;
          padding: 0 22px;
          font-weight: 900;
          text-decoration: none;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease;
        }
        .pricing-preview .section-button:hover,
        .pricing-preview .section-button:focus-visible {
          transform: translateY(-1px);
          outline: none;
        }
        .pricing-preview .section-button-primary {
          color: #fff;
          background: linear-gradient(135deg, #ff9800, #f97316);
          box-shadow: 0 16px 34px rgba(249, 115, 22, 0.24);
        }
        .pricing-preview .section-button-secondary {
          color: ${isDark ? '#f8fafc' : '#1d2127'};
          border-color: ${isDark ? 'rgba(255,255,255,0.16)' : 'rgba(15,23,42,0.14)'};
          background: ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)'};
        }
        .pricing-preview .section-button-secondary:hover,
        .pricing-preview .section-button-secondary:focus-visible {
          color: #fff;
          border-color: rgba(255, 152, 0, 0.72);
          background: linear-gradient(135deg, #ff9800, #f97316);
          box-shadow: 0 16px 34px rgba(249, 115, 22, 0.24);
        }
        .pricing-preview .section-button-icon {
          width: auto;
          height: auto;
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: currentColor;
          background: transparent;
          line-height: 1;
          transition:
            transform 0.2s ease,
            color 0.2s ease;
        }
        .pricing-preview .section-button-secondary .section-button-icon {
          color: #ff9800;
          background: transparent;
        }
        .pricing-preview .section-button:hover .section-button-icon,
        .pricing-preview .section-button:focus-visible .section-button-icon {
          transform: translateX(2px);
        }
        .pricing-preview .section-button-secondary:hover .section-button-icon,
        .pricing-preview .section-button-secondary:focus-visible .section-button-icon {
          color: #fff;
        }
        @media (max-width: 720px) {
          .pricing-preview .section-button {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
