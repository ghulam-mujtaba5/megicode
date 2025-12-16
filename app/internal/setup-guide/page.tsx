import { requireInternalSession } from '@/lib/internal/auth';
import s from '../styles.module.css';

// Icons
const Icons = {
  book: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  terminal: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>,
  folder: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  database: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  globe: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  copy: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
};

const setupSteps = [
  {
    title: '1. Clone the Repository',
    icon: 'folder',
    content: `Clone the repository to your local machine:`,
    code: 'git clone https://github.com/megicode/megicode.git\ncd megicode',
  },
  {
    title: '2. Install Dependencies',
    icon: 'terminal',
    content: 'Install all required Node.js dependencies:',
    code: 'npm install',
  },
  {
    title: '3. Environment Variables',
    icon: 'globe',
    content: 'Create a .env.local file with the following required variables:',
    code: `# Database
TURSO_DATABASE_URL=libsql://your-database-url.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Email (Zoho)
ZOHO_USER=your-email@megicode.com
ZOHO_PASS=your-app-password

# Optional
NEXT_PUBLIC_SITE_URL=http://localhost:3000`,
  },
  {
    title: '4. Database Setup',
    icon: 'database',
    content: 'Run database migrations to set up the schema:',
    code: 'npm run db:generate\nnpm run db:migrate',
  },
  {
    title: '5. Start Development Server',
    icon: 'terminal',
    content: 'Start the Next.js development server:',
    code: 'npm run dev',
  },
  {
    title: '6. Access the App',
    icon: 'globe',
    content: 'Open your browser and navigate to:',
    code: 'http://localhost:3000',
    note: 'The internal portal is available at /internal',
  },
];

const additionalNotes = [
  {
    title: 'Code Style',
    items: [
      'ESLint is configured - run `npm run lint` to check',
      'Prettier is configured - run `npm run format` to format',
      'Husky pre-commit hooks run linting automatically',
    ],
  },
  {
    title: 'Database Commands',
    items: [
      '`npm run db:generate` - Generate migration files',
      '`npm run db:migrate` - Apply migrations to database',
      '`npm run db:seed` - Seed initial data (if available)',
    ],
  },
  {
    title: 'Build Commands',
    items: [
      '`npm run build` - Create production build',
      '`npm run start` - Start production server',
      '`npm run generate-meta` - Generate meta images',
    ],
  },
  {
    title: 'Folder Structure',
    items: [
      '`app/` - Next.js App Router pages',
      '`components/` - Reusable UI components',
      '`lib/` - Database, auth, utilities',
      '`public/` - Static assets',
      '`styles/` - Global styles',
    ],
  },
];

export default async function SetupGuidePage() {
  await requireInternalSession();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'folder': return Icons.folder;
      case 'terminal': return Icons.terminal;
      case 'database': return Icons.database;
      case 'globe': return Icons.globe;
      default: return Icons.book;
    }
  };

  return (
    <main className={s.page}>
      {/* Header */}
      <header className={s.header}>
        <div className={s.headerContent}>
          <div className={s.headerTitleRow}>
            <span className={s.headerIcon}>{Icons.book}</span>
            <h1 className={s.headerTitle}>Local Setup Guide</h1>
          </div>
          <p className={s.headerSubtitle}>Get up and running with the Megicode development environment</p>
        </div>
      </header>

      {/* Prerequisites */}
      <section className={s.card} style={{ marginBottom: '1.5rem' }}>
        <div className={s.cardHeader}>
          <div className={s.cardHeaderLeft}>
            <div className={`${s.cardIcon} ${s.cardIconPrimary}`}>{Icons.check}</div>
            <h2 className={s.cardTitle}>Prerequisites</h2>
          </div>
        </div>
        <div className={s.cardBody}>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><strong>Node.js</strong> v18 or higher</li>
            <li><strong>npm</strong> v9 or higher (comes with Node.js)</li>
            <li><strong>Git</strong> for version control</li>
            <li><strong>VS Code</strong> (recommended) with ESLint and Prettier extensions</li>
            <li><strong>Turso CLI</strong> (optional) for database management</li>
          </ul>
        </div>
      </section>

      {/* Setup Steps */}
      {setupSteps.map((step, index) => (
        <section key={index} className={s.card} style={{ marginBottom: '1rem' }}>
          <div className={s.cardHeader}>
            <div className={s.cardHeaderLeft}>
              <div className={`${s.cardIcon} ${s.cardIconPrimary}`}>{getIcon(step.icon)}</div>
              <h2 className={s.cardTitle}>{step.title}</h2>
            </div>
          </div>
          <div className={s.cardBody}>
            <p style={{ marginTop: 0, marginBottom: '0.75rem' }}>{step.content}</p>
            <div style={{
              backgroundColor: 'var(--int-code-bg, #1e293b)',
              color: 'var(--int-code-text, #e2e8f0)',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '0.875rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              position: 'relative',
            }}>
              <code>{step.code}</code>
            </div>
            {step.note && (
              <p style={{ marginTop: '0.75rem', marginBottom: 0, color: 'var(--int-text-muted)', fontSize: '0.875rem', fontStyle: 'italic' }}>
                Note: {step.note}
              </p>
            )}
          </div>
        </section>
      ))}

      {/* Additional Notes */}
      <section className={s.card} style={{ marginTop: '1.5rem' }}>
        <div className={s.cardHeader}>
          <div className={s.cardHeaderLeft}>
            <div className={`${s.cardIcon} ${s.cardIconSuccess}`}>{Icons.book}</div>
            <h2 className={s.cardTitle}>Additional Notes</h2>
          </div>
        </div>
        <div className={s.cardBody}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {additionalNotes.map((section, idx) => (
              <div key={idx}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: 0, marginBottom: '0.5rem' }}>{section.title}</h3>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--int-text-muted)' }}>
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} style={{ marginBottom: '0.25rem' }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className={s.card} style={{ marginTop: '1.5rem' }}>
        <div className={s.cardHeader}>
          <div className={s.cardHeaderLeft}>
            <div className={`${s.cardIcon} ${s.cardIconWarning}`}>{Icons.terminal}</div>
            <h2 className={s.cardTitle}>Troubleshooting</h2>
          </div>
        </div>
        <div className={s.cardBody}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}>Database connection errors</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--int-text-muted)' }}>
                Ensure your TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are correctly set in .env.local
              </p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}>Port 3000 already in use</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--int-text-muted)' }}>
                Run <code style={{ backgroundColor: 'var(--int-bg-secondary)', padding: '0.125rem 0.25rem', borderRadius: '0.25rem' }}>npm run dev -- -p 3001</code> to use a different port
              </p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}>TypeScript errors</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--int-text-muted)' }}>
                Run <code style={{ backgroundColor: 'var(--int-bg-secondary)', padding: '0.125rem 0.25rem', borderRadius: '0.25rem' }}>npx tsc --noEmit</code> to see all TypeScript errors
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
