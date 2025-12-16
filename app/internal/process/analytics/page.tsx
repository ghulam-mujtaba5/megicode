/**
 * Process Analytics Page
 * 
 * Dashboard showing comprehensive analytics for business processes
 */
import Link from 'next/link';
import { Suspense } from 'react';

import s from '../../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import ProcessAnalyticsDashboard from '@/components/ProcessAnalytics/ProcessAnalyticsDashboard';

// Icons
const Icons = {
  back: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  analytics: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
};

export const metadata = {
  title: 'Process Analytics | Internal Portal',
  description: 'View comprehensive analytics for business processes',
};

function AnalyticsLoading() {
  return (
    <div className={s.card}>
      <div className={s.cardBody} style={{ textAlign: 'center', padding: '3rem' }}>
        <div className={s.spinner}></div>
        <p style={{ color: 'var(--int-text-muted)', marginTop: '1rem' }}>Loading analytics...</p>
      </div>
    </div>
  );
}

export default async function ProcessAnalyticsPage() {
  // Only allow admin and PM
  await requireRole(['admin', 'pm']);

  return (
    <main className={s.page}>
      {/* Page Header */}
      <div className={s.pageHeader}>
        <div className={s.pageHeaderContent}>
          <Link href="/internal/process" className={s.backLink}>
            <span className={s.icon}>{Icons.back}</span>
            Back to Processes
          </Link>
          <div className={s.welcomeSection}>
            <h1 className={s.pageTitle}>
              <span className={s.icon}>{Icons.analytics}</span>
              Process Analytics
            </h1>
            <p className={s.pageSubtitle}>
              Comprehensive metrics and insights for your business processes
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <Suspense fallback={<AnalyticsLoading />}>
        <ProcessAnalyticsDashboard initialPeriod="30d" />
      </Suspense>
    </main>
  );
}
