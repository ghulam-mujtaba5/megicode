import Link from 'next/link';
import { sql, like, or, desc } from 'drizzle-orm';

import { requireInternalSession } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { leads, projects, tasks, clients, users } from '@/lib/db/schema';
import s from '../styles.module.css';

// Icons
const Icons = {
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  lead: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  project: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  task: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  client: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  arrowRight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>,
};

interface SearchParams {
  q?: string;
}

export default async function GlobalSearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await requireInternalSession();
  const db = getDb();
  const userRole = session.user.role ?? 'viewer';
  const isPm = userRole === 'pm' || userRole === 'admin';

  const resolvedParams = await searchParams;
  const query = resolvedParams.q?.trim() ?? '';
  const searchPattern = `%${query}%`;

  // Perform searches if query exists
  let leadResults: Array<{ id: string; name: string; company: string | null; service: string | null; status: string; createdAt: Date | null }> = [];
  let projectResults: Array<{ id: string; name: string; status: string; techStack: string[] | null; createdAt: Date | null }> = [];
  let taskResults: Array<{ id: string; title: string; status: string; priority: string; projectName: string | null }> = [];
  let clientResults: Array<{ id: string; name: string; company: string | null; billingEmail: string | null }> = [];
  let userResults: Array<{ id: string; email: string; role: string | null; name: string | null }> = [];

  if (query.length >= 2) {
    // Search leads (PM/Admin only)
    if (isPm) {
      leadResults = await db
        .select({
          id: leads.id,
          name: leads.name,
          company: leads.company,
          service: leads.service,
          status: leads.status,
          createdAt: leads.createdAt,
        })
        .from(leads)
        .where(
          or(
            like(leads.name, searchPattern),
            like(leads.company, searchPattern),
            like(leads.email, searchPattern),
            like(leads.service, searchPattern),
            like(leads.message, searchPattern)
          )
        )
        .orderBy(desc(leads.createdAt))
        .limit(10)
        .all();
    }

    // Search projects
    projectResults = await db
      .select({
        id: projects.id,
        name: projects.name,
        status: projects.status,
        techStack: projects.techStack,
        createdAt: projects.createdAt,
      })
      .from(projects)
      .where(
        or(
          like(projects.name, searchPattern),
          like(projects.description, searchPattern),
          like(projects.techStack, searchPattern)
        )
      )
      .orderBy(desc(projects.createdAt))
      .limit(10)
      .all();

    // Search tasks (with project name)
    const taskJoinResults = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        status: tasks.status,
        priority: tasks.priority,
        projectName: projects.name,
      })
      .from(tasks)
      .leftJoin(projects, sql`${tasks.projectId} = ${projects.id}`)
      .where(
        or(
          like(tasks.title, searchPattern),
          like(tasks.description, searchPattern)
        )
      )
      .orderBy(desc(tasks.createdAt))
      .limit(10)
      .all();
    taskResults = taskJoinResults;

    // Search clients (PM/Admin only)
    if (isPm) {
      clientResults = await db
        .select({
          id: clients.id,
          name: clients.name,
          company: clients.company,
          billingEmail: clients.billingEmail,
        })
        .from(clients)
        .where(
          or(
            like(clients.name, searchPattern),
            like(clients.company, searchPattern),
            like(clients.billingEmail, searchPattern)
          )
        )
        .orderBy(desc(clients.createdAt))
        .limit(10)
        .all();
    }

    // Search users (Admin only)
    if (userRole === 'admin') {
      userResults = await db
        .select({
          id: users.id,
          email: users.email,
          role: users.role,
          name: users.name,
        })
        .from(users)
        .where(
          or(
            like(users.email, searchPattern),
            like(users.name, searchPattern)
          )
        )
        .limit(10)
        .all();
    }
  }

  const totalResults = leadResults.length + projectResults.length + taskResults.length + clientResults.length + userResults.length;

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      new: s.badgePrimary,
      in_review: s.badgeWarning,
      approved: s.badgeSuccess,
      converted: s.badgeSuccess,
      todo: s.badgeDefault,
      in_progress: s.badgePrimary,
      blocked: s.badgeDanger,
      done: s.badgeSuccess,
      canceled: s.badgeDefault,
      draft: s.badgeDefault,
      sent: s.badgePrimary,
      paid: s.badgeSuccess,
      overdue: s.badgeDanger,
      delivered: s.badgeSuccess,
      in_qa: s.badgeWarning,
    };
    return map[status] || s.badgeDefault;
  };

  return (
    <main className={s.page}>
      {/* Header */}
      <div className={s.pageHeader}>
        <div className={s.pageHeaderContent}>
          <div className={s.pageHeaderLeft}>
            <h1 className={s.pageTitle}>Global Search</h1>
            <p className={s.pageSubtitle}>
              Search across leads, projects, tasks, clients, and users
            </p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <section className={s.section}>
        <form method="GET" className={s.searchForm} style={{ display: 'flex', gap: '0.75rem', maxWidth: '600px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', opacity: 0.5 }}>
              {Icons.search}
            </span>
            <input
              type="text"
              name="q"
              placeholder="Search leads, projects, tasks, clients..."
              defaultValue={query}
              className={s.input}
              style={{ paddingLeft: '40px' }}
              autoFocus
            />
          </div>
          <button type="submit" className={s.btnPrimary}>
            Search
          </button>
        </form>
      </section>

      {/* Results */}
      {query.length >= 2 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Results Summary */}
          <p className={s.textMuted} style={{ margin: 0 }}>
            Found <strong>{totalResults}</strong> result{totalResults !== 1 ? 's' : ''} for &quot;{query}&quot;
          </p>

          {/* Lead Results */}
          {leadResults.length > 0 && (
            <section className={s.card}>
              <div className={s.cardHeader}>
                <h2 className={s.cardTitle}>
                  <span style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }}>{Icons.lead}</span>
                  Leads ({leadResults.length})
                </h2>
              </div>
              <div className={s.cardBody}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Company</th>
                      <th>Service</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadResults.map((lead) => (
                      <tr key={lead.id}>
                        <td><strong>{lead.name}</strong></td>
                        <td>{lead.company || '—'}</td>
                        <td>{lead.service || '—'}</td>
                        <td>
                          <span className={`${s.badge} ${getStatusBadge(lead.status)}`}>
                            {lead.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <Link href={`/internal/leads/${lead.id}`} className={s.btnSmall}>
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Project Results */}
          {projectResults.length > 0 && (
            <section className={s.card}>
              <div className={s.cardHeader}>
                <h2 className={s.cardTitle}>
                  <span style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }}>{Icons.project}</span>
                  Projects ({projectResults.length})
                </h2>
              </div>
              <div className={s.cardBody}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Tech Stack</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectResults.map((project) => (
                      <tr key={project.id}>
                        <td><strong>{project.name}</strong></td>
                        <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {project.techStack || '—'}
                        </td>
                        <td>
                          <span className={`${s.badge} ${getStatusBadge(project.status)}`}>
                            {project.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <Link href={`/internal/projects/${project.id}`} className={s.btnSmall}>
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Task Results */}
          {taskResults.length > 0 && (
            <section className={s.card}>
              <div className={s.cardHeader}>
                <h2 className={s.cardTitle}>
                  <span style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }}>{Icons.task}</span>
                  Tasks ({taskResults.length})
                </h2>
              </div>
              <div className={s.cardBody}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Project</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {taskResults.map((task) => (
                      <tr key={task.id}>
                        <td><strong>{task.title}</strong></td>
                        <td>{task.projectName || '—'}</td>
                        <td>
                          <span className={`${s.badge} ${getStatusBadge(task.status)}`}>
                            {task.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td>
                          <span className={`${s.badge} ${task.priority === 'critical' ? s.badgeDanger : task.priority === 'high' ? s.badgeWarning : s.badgeDefault}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <Link href={`/internal/tasks/${task.id}`} className={s.btnSmall}>
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Client Results */}
          {clientResults.length > 0 && (
            <section className={s.card}>
              <div className={s.cardHeader}>
                <h2 className={s.cardTitle}>
                  <span style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }}>{Icons.client}</span>
                  Clients ({clientResults.length})
                </h2>
              </div>
              <div className={s.cardBody}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Company</th>
                      <th>Billing Email</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientResults.map((client) => (
                      <tr key={client.id}>
                        <td><strong>{client.name}</strong></td>
                        <td>{client.company || '—'}</td>
                        <td>{client.billingEmail || '—'}</td>
                        <td style={{ textAlign: 'right' }}>
                          <Link href={`/internal/clients/${client.id}`} className={s.btnSmall}>
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* User Results */}
          {userResults.length > 0 && (
            <section className={s.card}>
              <div className={s.cardHeader}>
                <h2 className={s.cardTitle}>
                  <span style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }}>{Icons.user}</span>
                  Users ({userResults.length})
                </h2>
              </div>
              <div className={s.cardBody}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {userResults.map((user) => (
                      <tr key={user.id}>
                        <td><strong>{user.email}</strong></td>
                        <td>{user.name || '—'}</td>
                        <td>
                          <span className={`${s.badge} ${user.role === 'admin' ? s.badgeDanger : user.role === 'pm' ? s.badgeWarning : s.badgeDefault}`}>
                            {user.role || 'viewer'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <Link href={`/internal/users/${user.id}`} className={s.btnSmall}>
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* No Results */}
          {totalResults === 0 && (
            <div className={s.emptyState}>
              <div className={s.emptyStateIcon}>{Icons.search}</div>
              <h3>No results found</h3>
              <p>Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
      ) : query.length > 0 ? (
        <p className={s.textMuted}>Please enter at least 2 characters to search.</p>
      ) : (
        <div className={s.emptyState}>
          <div className={s.emptyStateIcon}>{Icons.search}</div>
          <h3>Start searching</h3>
          <p>Enter a search term above to find leads, projects, tasks, clients, and more</p>
        </div>
      )}
    </main>
  );
}
