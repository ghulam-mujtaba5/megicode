import { requireInternalSession } from '@/lib/internal/auth';

import BlogManagerClient from './BlogManagerClient';

export default async function InternalBlogPage() {
  await requireInternalSession();
  return <BlogManagerClient />;
}
