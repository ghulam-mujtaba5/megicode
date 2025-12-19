import s from '../styles.module.css';
import { requireInternalSession } from '@/lib/internal/auth';
import NotificationsClient from './NotificationsClient';

export default async function NotificationsPage() {
  await requireInternalSession();

  return (
    <main className={s.page}>
      <div className={s.container}>
        <NotificationsClient />
      </div>
    </main>
  );
}
