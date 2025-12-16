import { desc, eq } from 'drizzle-orm';

import styles from '../../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { processDefinitions } from '@/lib/db/schema';
import { ensureActiveDefaultProcessDefinition } from '@/lib/workflow/processDefinition';

// Icons
const Icons = {
  process: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  versions: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
  model: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="9" y1="21" x2="9" y2="9"/>
    </svg>
  ),
  code: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  step: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
};

export default async function ProcessAdminPage() {
  await requireRole(['admin']);

  const db = getDb();
  const active = await db
    .select()
    .from(processDefinitions)
    .where(eq(processDefinitions.isActive, true))
    .orderBy(desc(processDefinitions.createdAt))
    .all();

  const ensured = await ensureActiveDefaultProcessDefinition();

  const current = active.find((d) => d.id === ensured.id) ?? active[0] ?? null;
  const json = current ? JSON.parse(current.json) : ensured.json;

  const jsonWithSteps = json as { steps?: unknown };
  const steps = Array.isArray(jsonWithSteps.steps)
    ? (jsonWithSteps.steps as Array<{ key: string; title: string; recommendedRole?: string }>)
    : [];

  return (
    <main className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Process Definitions</h1>
          <p className={styles.pageSubtitle}>
            Versioned process model used to generate tasks and track instances
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.kpiPurple}`}>
          <div className={styles.kpiIcon}>{Icons.process}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{active.length}</span>
            <span className={styles.kpiLabel}>Active Versions</span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiBlue}`}>
          <div className={styles.kpiIcon}>{Icons.model}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{steps.length}</span>
            <span className={styles.kpiLabel}>Process Steps</span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiGreen}`}>
          <div className={styles.kpiIcon}>{Icons.versions}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>v{json.version}</span>
            <span className={styles.kpiLabel}>Current Version</span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiOrange}`}>
          <div className={styles.kpiIcon}>{Icons.code}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{json.key}</span>
            <span className={styles.kpiLabel}>Process Key</span>
          </div>
        </div>
      </div>

      <div className={styles.twoColumnGrid}>
        {/* Active Versions */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Active Versions</h2>
            <span className={styles.badge}>{active.length}</span>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>KEY</th>
                  <th>VERSION</th>
                  <th>ACTIVE</th>
                </tr>
              </thead>
              <tbody>
                {active.map((d) => (
                  <tr key={d.id}>
                    <td className={styles.cellMain}>{d.key}</td>
                    <td className={styles.cellMuted}>{d.version}</td>
                    <td>
                      <span className={`${styles.badge} ${d.isActive ? styles.badgeSuccess : styles.badgeDefault}`}>
                        {d.isActive ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Current Model */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Current Model</h2>
            <span className={styles.cardIcon}>{Icons.model}</span>
          </div>
          <p className={styles.cardSubtitle}>
            Key: <strong>{json.key}</strong> · Version: <strong>{json.version}</strong> · Name: <strong>{json.name}</strong>
          </p>
          <div className={styles.stepsList}>
            {steps.map((s, index) => (
              <div key={s.key} className={styles.stepItem}>
                <div className={styles.stepNumber}>{index + 1}</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>{s.title}</div>
                  <div className={styles.stepMeta}>
                    <span className={styles.stepKey}>{s.key}</span>
                    {s.recommendedRole && (
                      <span className={`${styles.badge} ${styles.badgeDefault}`}>{s.recommendedRole}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Raw JSON */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Raw JSON</h2>
          <span className={styles.cardIcon}>{Icons.code}</span>
        </div>
        <pre className={styles.codeBlock}>{JSON.stringify(json, null, 2)}</pre>
      </section>
    </main>
  );
}
