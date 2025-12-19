import { redirect } from 'next/navigation';

import { requireRole } from '@/lib/internal/auth';

export default async function AdminProcessRedirectPage() {
  await requireRole(['admin']);
  redirect('/internal/process');
}
