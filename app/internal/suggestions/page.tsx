import Link from 'next/link';
import { redirect } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';

import { requireInternalSession, requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { processSuggestions, users } from '@/lib/db/schema';
import s from '../styles.module.css';

// Icons
const Icons = {
  lightbulb: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
};

const categoryLabels: Record<string, string> = {
  workflow: 'Workflow',
  tooling: 'Tooling',
  communication: 'Communication',
  documentation: 'Documentation',
  quality: 'Quality',
  other: 'Other',
};

const priorityColors: Record<string, string> = {
  low: 'var(--int-text-muted)',
  medium: 'var(--int-info)',
  high: 'var(--int-error)',
};

const statusColors: Record<string, { bg: string; text: string }> = {
  submitted: { bg: '#e5e7eb', text: '#374151' },
  under_review: { bg: '#fef3c7', text: '#92400e' },
  accepted: { bg: '#d1fae5', text: '#065f46' },
  implemented: { bg: '#10b981', text: '#ffffff' },
  rejected: { bg: '#fee2e2', text: '#991b1b' },
};

export default async function ProcessSuggestionsPage() {
  const session = await requireInternalSession();
  const db = getDb();
  const userRole = session.user.role ?? 'viewer';
  const isPmOrAdmin = userRole === 'pm' || userRole === 'admin';

  // Fetch all suggestions with submitter info
  const suggestionsList = await db.select({
    suggestion: processSuggestions,
    submitterName: users.name,
    submitterEmail: users.email,
  })
  .from(processSuggestions)
  .leftJoin(users, eq(processSuggestions.submittedByUserId, users.id))
  .orderBy(desc(processSuggestions.createdAt))
  .all();

  // Server action to submit a suggestion
  async function submitSuggestion(formData: FormData) {
    'use server';
    const session = await requireInternalSession();
    const db = getDb();

    const title = String(formData.get('title') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();
    const category = String(formData.get('category') ?? 'other').trim() as 'efficiency' | 'quality' | 'cost' | 'communication' | 'tooling' | 'workflow' | 'documentation' | 'other';
    const priority = String(formData.get('priority') ?? 'medium').trim() as 'low' | 'medium' | 'high';

    if (!title || !description) return;

    const now = new Date();
    await db.insert(processSuggestions).values({
      id: crypto.randomUUID(),
      title,
      description,
      category,
      priority,
      status: 'submitted',
      submittedByUserId: session.user.id ?? null,
      createdAt: now,
      updatedAt: now,
    });

    redirect('/internal/suggestions');
  }

  // Server action to update suggestion status (PM/Admin only)
  async function updateSuggestionStatus(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const id = String(formData.get('id') ?? '').trim();
    const status = String(formData.get('status') ?? 'submitted').trim() as 'submitted' | 'under_review' | 'accepted' | 'implemented' | 'rejected';
    const reviewNotes = String(formData.get('reviewNotes') ?? '').trim();

    if (!id) return;

    const now = new Date();
    const session = await requireInternalSession();
    
    const updates: Record<string, unknown> = {
      status,
      reviewNotes: reviewNotes || null,
      reviewedByUserId: session.user.id ?? null,
      updatedAt: now,
    };
    
    if (status === 'implemented') {
      updates.implementedAt = now;
    }

    await db.update(processSuggestions).set(updates).where(eq(processSuggestions.id, id));
    redirect('/internal/suggestions');
  }

  return (
    <main className={s.page}>
      {/* Header */}
      <div className={s.pageHeader}>
        <div className={s.pageHeaderContent}>
          <div className={s.pageHeaderLeft}>
            <h1 className={s.pageTitle}>
              <span style={{ width: '28px', height: '28px', marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }}>{Icons.lightbulb}</span>
              Process Improvements
            </h1>
            <p className={s.pageSubtitle}>
              Suggest changes to our workflows and processes
            </p>
          </div>
        </div>
      </div>

      {/* Submission Form */}
      <section className={s.card} style={{ marginBottom: '1.5rem' }}>
        <div className={s.cardHeader}>
          <h2 className={s.cardTitle}>Submit a Suggestion</h2>
        </div>
        <div className={s.cardBody}>
          <form action={submitSuggestion}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className={s.label}>Title</label>
                <input className={s.input} name="title" placeholder="Brief title for your suggestion..." required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label className={s.label}>Category</label>
                  <select className={s.select} name="category">
                    <option value="workflow">Workflow</option>
                    <option value="tooling">Tooling</option>
                    <option value="communication">Communication</option>
                    <option value="documentation">Documentation</option>
                    <option value="quality">Quality</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={s.label}>Priority</label>
                  <select className={s.select} name="priority">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label className={s.label}>Description</label>
              <textarea
                className={s.textarea}
                name="description"
                placeholder="Describe the current problem and your proposed solution..."
                rows={4}
                required
              />
            </div>
            <button className={`${s.btn} ${s.btnPrimary}`} type="submit">
              <span style={{ width: '16px', height: '16px', marginRight: '6px' }}>{Icons.plus}</span>
              Submit Suggestion
            </button>
          </form>
        </div>
      </section>

      {/* Suggestions List */}
      <section className={s.card}>
        <div className={s.cardHeader}>
          <h2 className={s.cardTitle}>All Suggestions ({suggestionsList.length})</h2>
        </div>
        <div className={s.cardBody} style={{ padding: 0 }}>
          {suggestionsList.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--int-text-muted)' }}>
              No suggestions yet. Be the first to submit one!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {suggestionsList.map(({ suggestion: sug, submitterName, submitterEmail }) => {
                const statusStyle = statusColors[sug.status] || statusColors.submitted;
                
                return (
                  <div
                    key={sug.id}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid var(--int-border, #e5e7eb)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{sug.title}</h3>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                          <span
                            className={s.badge}
                            style={{ background: 'var(--int-bg-alt)', color: 'var(--int-text-secondary)' }}
                          >
                            {categoryLabels[sug.category] || sug.category}
                          </span>
                          <span
                            className={s.badge}
                            style={{ background: priorityColors[sug.priority], color: 'white' }}
                          >
                            {sug.priority}
                          </span>
                          <span
                            className={s.badge}
                            style={{ background: statusStyle.bg, color: statusStyle.text }}
                          >
                            {sug.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                      <div className={s.textMuted} style={{ fontSize: '0.75rem', textAlign: 'right' }}>
                        <div>{submitterName || submitterEmail?.split('@')[0] || 'Anonymous'}</div>
                        <div>{sug.createdAt.toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: 'var(--int-text-secondary)' }}>
                      {sug.description}
                    </p>
                    
                    {sug.reviewNotes && (
                      <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'var(--int-bg-alt)', borderRadius: '4px', fontSize: '0.85rem' }}>
                        <strong>Review Notes:</strong> {sug.reviewNotes}
                      </div>
                    )}
                    
                    {/* Review Form (PM/Admin only) */}
                    {isPmOrAdmin && sug.status !== 'implemented' && sug.status !== 'rejected' && (
                      <form action={updateSuggestionStatus} style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input type="hidden" name="id" value={sug.id} />
                        <select className={s.select} name="status" defaultValue={sug.status} style={{ width: 'auto' }}>
                          <option value="submitted">Submitted</option>
                          <option value="under_review">Under Review</option>
                          <option value="accepted">Accepted</option>
                          <option value="implemented">Implemented</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <input
                          className={s.input}
                          name="reviewNotes"
                          placeholder="Add review notes..."
                          defaultValue={sug.reviewNotes || ''}
                          style={{ flex: 1 }}
                        />
                        <button className={`${s.btn} ${s.btnSecondary}`} type="submit">
                          Update
                        </button>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
