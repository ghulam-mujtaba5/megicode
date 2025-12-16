'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import styles from './onboarding.module.css';

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  
  // @ts-ignore
  const status = session?.user?.status;

  if (status === 'active') {
    router.push('/internal');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/internal/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, department }),
      });

      if (res.ok) {
        // Force session update to reflect changes if we were to auto-approve
        // But here we just want to show the pending state
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'pending' && session?.user?.role !== 'admin') {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.status}>
            <span className={styles.statusIcon}>⏳</span>
            <h2 className={styles.statusTitle}>Account Pending Approval</h2>
            <p className={styles.statusMessage}>
              Thanks for signing up! Your account is currently under review by the administrators.
              You will receive an email once your access is approved.
            </p>
            <button onClick={() => signOut({ callbackUrl: '/internal/login' })} className={styles.logoutButton}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Complete Your Profile</h1>
        <p className={styles.subtitle}>
          Please provide a few details to finish setting up your account.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Full Name</label>
            <input 
              className={styles.input} 
              value={session?.user?.name || ''} 
              disabled 
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input 
              className={styles.input} 
              value={session?.user?.email || ''} 
              disabled 
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Job Title</label>
            <input
              className={styles.input}
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Developer"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Department</label>
            <input
              className={styles.input}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Engineering"
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Submitting...' : 'Request Access'}
          </button>
        </form>
      </div>
    </div>
  );
}
