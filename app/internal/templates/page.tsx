import Link from 'next/link';
import { redirect } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';

import styles from '../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { projectTemplates, users } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';

// Icons
const Icons = {
  template: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="9" y1="21" x2="9" y2="9"/>
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  trash: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  toggle: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="5" width="22" height="14" rx="7" ry="7"/>
      <circle cx="16" cy="12" r="3"/>
    </svg>
  ),
  empty: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="9" y1="21" x2="9" y2="9"/>
    </svg>
  ),
};

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  web_app: { label: 'Web App', color: 'var(--int-primary)' },
  mobile_app: { label: 'Mobile App', color: 'var(--int-success)' },
  api: { label: 'API', color: 'var(--int-warning)' },
  e_commerce: { label: 'E-Commerce', color: 'var(--int-error)' },
  cms: { label: 'CMS', color: 'var(--int-info)' },
  custom: { label: 'Custom', color: 'var(--int-text-muted)' },
};

export default async function TemplatesPage() {
  const session = await requireRole(['admin', 'pm']);

  const db = getDb();
  const templates = await db.select({
    template: projectTemplates,
    creatorName: users.name,
  })
  .from(projectTemplates)
  .leftJoin(users, eq(projectTemplates.createdByUserId, users.id))
  .orderBy(desc(projectTemplates.createdAt))
  .all();

  // Server action to create template
  async function addTemplate(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm']);
    const db = getDb();

    const name = String(formData.get('name') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();
    const category = String(formData.get('category') ?? 'custom').trim() as 'web_app' | 'mobile_app' | 'api' | 'e_commerce' | 'cms' | 'custom';
    const estimatedHours = parseInt(String(formData.get('estimatedHours') ?? '0'), 10) || null;
    const techStackRaw = String(formData.get('techStack') ?? '').trim();
    const techStackJson = techStackRaw ? techStackRaw.split(',').map(s => s.trim()).filter(Boolean) : null;
    const tasksRaw = String(formData.get('defaultTasks') ?? '').trim();
    const tasksJson = tasksRaw ? JSON.stringify(tasksRaw.split('\n').map(s => s.trim()).filter(Boolean).map(t => ({ title: t }))) : null;

    if (!name) return;

    const now = new Date();
    await db.insert(projectTemplates).values({
      id: crypto.randomUUID(),
      name,
      description: description || null,
      category,
      estimatedHours,
      techStackJson: techStackJson as any,
      tasksJson,
      isActive: true,
      createdByUserId: session.user.id ?? null,
      createdAt: now,
      updatedAt: now,
    });

    redirect('/internal/templates');
  }

  async function toggleActive(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const id = String(formData.get('id') ?? '').trim();
    const isActive = formData.get('isActive') === 'true';

    if (!id) return;

    await db.update(projectTemplates).set({ 
      isActive: !isActive,
      updatedAt: new Date(),
    }).where(eq(projectTemplates.id, id));

    redirect('/internal/templates');
  }

  async function deleteTemplate(formData: FormData) {
    'use server';
    await requireRole(['admin']);
    const db = getDb();

    const id = String(formData.get('id') ?? '').trim();
    if (!id) return;

    await db.delete(projectTemplates).where(eq(projectTemplates.id, id));
    redirect('/internal/templates');
  }

  const activeCount = templates.filter(t => t.template.isActive).length;

  return (
    <main className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Project Templates</h1>
          <p className={styles.pageSubtitle}>
            <span className={styles.highlight}>{templates.length}</span> templates ({activeCount} active)
          </p>
        </div>
      </div>

      {/* Add Template Form */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>{Icons.plus} Add New Template</h2>
        </div>
        <div className={styles.cardBody}>
          <form action={addTemplate} className={styles.form}>
            <div className={styles.grid2}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Name *</label>
                <input className={styles.input} type="text" name="name" placeholder="E-Commerce Starter" required />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Category</label>
                <select className={styles.select} name="category">
                  <option value="web_app">Web App</option>
                  <option value="mobile_app">Mobile App</option>
                  <option value="api">API</option>
                  <option value="e_commerce">E-Commerce</option>
                  <option value="cms">CMS</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Estimated Hours</label>
                <input className={styles.input} type="number" name="estimatedHours" placeholder="160" min="0" />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Tech Stack (comma-separated)</label>
                <input className={styles.input} type="text" name="techStack" placeholder="Next.js, TypeScript, Tailwind" />
              </div>
              <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                <label className={styles.label}>Description</label>
                <textarea className={styles.textarea} name="description" placeholder="Template description..." rows={2}></textarea>
              </div>
              <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                <label className={styles.label}>Default Tasks (one per line)</label>
                <textarea className={styles.textarea} name="defaultTasks" placeholder="Setup project structure&#10;Configure authentication&#10;Database schema design&#10;API development&#10;Frontend development&#10;Testing&#10;Deployment" rows={5}></textarea>
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <button className={`${styles.btn} ${styles.btnPrimary}`} type="submit">
                {Icons.plus} Create Template
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Templates List */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>{Icons.template} All Templates</h2>
          <span className={styles.badge}>{templates.length}</span>
        </div>

        {templates.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>{Icons.empty}</div>
            <h3>No templates yet</h3>
            <p>Create your first project template to standardize project setup.</p>
          </div>
        ) : (
          <div className={styles.cardBody} style={{ padding: 0 }}>
            <div className={styles.tableWrapper} style={{ border: 'none' }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>TEMPLATE</th>
                    <th>CATEGORY</th>
                    <th>EST. HOURS</th>
                    <th>TASKS</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map(({ template, creatorName }) => {
                    const catInfo = CATEGORY_LABELS[template.category] || CATEGORY_LABELS.custom;
                    const tasks = template.tasksJson || [];
                    const techStack = template.techStackJson || [];
                    
                    return (
                      <tr key={template.id} style={{ opacity: template.isActive ? 1 : 0.6 }}>
                        <td>
                          <div className={styles.cellMain}>{template.name}</div>
                          {template.description && (
                            <div className={styles.cellSub} style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {template.description}
                            </div>
                          )}
                          {techStack.length > 0 && (
                            <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                              {techStack.slice(0, 3).map((tech, i) => (
                                <span key={i} className={styles.badge} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>{tech}</span>
                              ))}
                              {techStack.length > 3 && (
                                <span className={styles.badge} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>+{techStack.length - 3}</span>
                              )}
                            </div>
                          )}
                        </td>
                        <td>
                          <span className={styles.badge} style={{ background: catInfo.color, color: 'white' }}>
                            {catInfo.label}
                          </span>
                        </td>
                        <td>
                          {template.estimatedHours ? (
                            <span>{template.estimatedHours}h</span>
                          ) : (
                            <span className={styles.textMuted}>—</span>
                          )}
                        </td>
                        <td>
                          <span className={styles.badge}>{tasks.length} tasks</span>
                        </td>
                        <td>
                          <span className={`${styles.badge} ${template.isActive ? styles.badgeSuccess : styles.badgeDefault}`}>
                            {template.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <form action={toggleActive}>
                              <input type="hidden" name="id" value={template.id} />
                              <input type="hidden" name="isActive" value={String(template.isActive)} />
                              <button className={`${styles.btn} ${styles.btnSm} ${styles.btnGhost}`} type="submit" title={template.isActive ? 'Deactivate' : 'Activate'}>
                                {Icons.toggle}
                              </button>
                            </form>
                            {session.user.role === 'admin' && (
                              <form action={deleteTemplate}>
                                <input type="hidden" name="id" value={template.id} />
                                <button className={`${styles.btn} ${styles.btnSm} ${styles.btnGhost}`} type="submit" style={{ color: 'var(--int-error)' }} title="Delete">
                                  {Icons.trash}
                                </button>
                              </form>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
