import Link from 'next/link';

import s from '../../styles.module.css';
import { requireRole } from '@/lib/internal/auth';

const ROLE_DEFINITIONS: Array<{ role: string; description: string }> = [
  {
    role: 'admin',
    description: 'Full access to internal portal features, settings, and user administration.',
  },
  {
    role: 'pm',
    description: 'Project management access (leads, projects, tasks, process, finance views).',
  },
  {
    role: 'dev',
    description: 'Engineering access focused on delivery execution (projects, tasks, bugs).',
  },
  {
    role: 'qa',
    description: 'Quality assurance access (bugs, tasks, project verification workflows).',
  },
  {
    role: 'viewer',
    description: 'Read-only access for stakeholders and limited team members.',
  },
];

export default async function AdminRolesPage() {
  await requireRole(['admin']);

  return (
    <main className={s.page}>
      <div className={s.container}>
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>Roles</h1>
            <p className={s.pageSubtitle}>
              Reference for internal role capabilities. For assigning roles, use Users.
            </p>
          </div>
          <div className={s.pageActions}>
            <Link href="/internal/admin/users" className={`${s.btn} ${s.btnPrimary}`}>
              Manage users
            </Link>
            <Link href="/internal/admin/settings" className={`${s.btn} ${s.btnSecondary}`}>
              Settings
            </Link>
          </div>
        </div>

        <section className={s.card}>
          <div className={s.cardBody}>
            <div className={s.tableContainer}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {ROLE_DEFINITIONS.map((r) => (
                    <tr key={r.role}>
                      <td>
                        <span className={`${s.badge} ${s.badgePrimary}`}>{r.role}</span>
                      </td>
                      <td style={{ color: 'var(--int-text-muted)' }}>{r.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className={s.card} style={{ marginTop: 24 }}>
          <div className={s.cardBody}>
            <div style={{ fontWeight: 650, marginBottom: 6 }}>Note</div>
            <p className={s.pageSubtitle} style={{ margin: 0 }}>
              Roles are currently a fixed enum (admin/pm/dev/qa/viewer). If you ever want fully custom roles
              & permissions, we can extend the schema and add a proper permissions matrix UI.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
