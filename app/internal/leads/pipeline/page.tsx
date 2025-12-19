import Link from 'next/link';
import { desc } from 'drizzle-orm';

import styles from '../../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import PipelineBoard from './PipelineBoard';

// Icons
const Icons = {
  back: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  ),
  list: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  )
};

export default async function PipelinePage() {
  await requireRole(['admin', 'pm']);
  const db = getDb();
  
  const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt)).all();

  return (
    <main className={styles.page}>
      <div className={styles.container} style={{ maxWidth: '100%' }}>
        <div className={styles.pageHeader}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Link href="/internal/leads" className={styles.btnGhost} style={{ padding: '4px 8px' }}>
                {Icons.back} Back to List
              </Link>
            </div>
            <h1 className={styles.pageTitle}>Leads Pipeline</h1>
            <p className={styles.pageSubtitle}>Drag and drop leads to update their status</p>
          </div>
          <div className={styles.pageActions}>
            <Link href="/internal/leads" className={`${styles.btn} ${styles.btnSecondary}`}>
              {Icons.list} List View
            </Link>
          </div>
        </div>

        <PipelineBoard leads={allLeads} />
      </div>
    </main>
  );
}
