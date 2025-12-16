import { desc, eq } from 'drizzle-orm';

import commonStyles from '../../internalCommon.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { processDefinitions } from '@/lib/db/schema';
import { ensureActiveDefaultProcessDefinition } from '@/lib/workflow/processDefinition';

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
    <main className={commonStyles.page}>
      <section className={commonStyles.card}>
        <h1>Process Definitions</h1>
        <p className={commonStyles.muted}>
          This is the versioned process model used to generate tasks and track instances.
        </p>

        <div className={commonStyles.grid2}>
          <div>
            <h2>Active Versions</h2>
            <table className={commonStyles.table}>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Version</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                {active.map((d) => (
                  <tr key={d.id}>
                    <td>{d.key}</td>
                    <td>{d.version}</td>
                    <td>{d.isActive ? 'yes' : 'no'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h2>Current Model</h2>
            <p className={commonStyles.muted}>
              Key: {json.key} · Version: {json.version} · Name: {json.name}
            </p>
            <div className={commonStyles.grid}>
              {steps.map((s) => (
                <div key={s.key} className={commonStyles.row}>
                  <div>
                    <strong>{s.title}</strong>
                    <div className={commonStyles.muted}>{s.key}</div>
                  </div>
                  <div className={commonStyles.muted}>{s.recommendedRole ?? ''}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2>Raw JSON</h2>
        <pre className={commonStyles.pre}>{JSON.stringify(json, null, 2)}</pre>
      </section>
    </main>
  );
}
