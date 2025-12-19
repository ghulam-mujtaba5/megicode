import { redirect } from 'next/navigation';

import { requireRole } from '@/lib/internal/auth';

export default async function AdminIntegrationsRedirectPage() {
  await requireRole(['admin']);
  redirect('/internal/integrations');
}
