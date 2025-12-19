import { redirect } from 'next/navigation';

import { requireRole } from '@/lib/internal/auth';

export default async function AdminProcessInstanceRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(['admin']);
  const { id } = await params;
  redirect(`/internal/process/${id}`);
}
