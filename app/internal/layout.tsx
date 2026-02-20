import { getServerSession } from 'next-auth/next';
import type { Metadata } from 'next';

import { authOptions } from '@/auth';
import InternalSidebar from '@/components/InternalSidebar/InternalSidebar';
import InternalProviders from './providers';
import './internal-globals.css';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <InternalProviders>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {session?.user?.email && (
          <InternalSidebar
            email={session.user.email}
            role={session.user.role ?? 'viewer'}
            isAdmin={session.user.role === 'admin'}
          />
        )}
        <main style={{ 
          flex: 1, 
          marginLeft: session?.user?.email ? '260px' : '0',
          padding: '2rem',
          background: 'var(--background)',
          minHeight: '100vh',
          transition: 'margin-left 0.3s ease'
        }}>
          {children}
        </main>
      </div>
    </InternalProviders>
  );
}
