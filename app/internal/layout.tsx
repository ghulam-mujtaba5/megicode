import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/auth';
import InternalNavClient from '@/components/InternalNav/InternalNavClient';

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <>
      {session?.user?.email ? (
        <InternalNavClient
          email={session.user.email}
          role={session.user.role ?? 'viewer'}
          isAdmin={session.user.role === 'admin'}
        />
      ) : null}
      {children}
    </>
  );
}
