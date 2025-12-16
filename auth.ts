import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { eq } from 'drizzle-orm';

import { getDb } from '@/lib/db';
import { users, type UserRole } from '@/lib/db/schema';

function parseCsv(value?: string | null): string[] {
  return (value ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function isEmailAllowed(email: string): boolean {
  const allowedEmails = parseCsv(process.env.INTERNAL_ALLOWED_EMAILS);
  const allowedDomains = parseCsv(process.env.INTERNAL_ALLOWED_DOMAINS);

  if (allowedEmails.length === 0 && allowedDomains.length === 0) return true;

  const normalized = email.toLowerCase();
  if (allowedEmails.includes(normalized)) return true;

  const domain = normalized.split('@')[1] ?? '';
  return allowedDomains.includes(domain);
}

function getRoleForEmail(email: string): UserRole {
  const adminEmails = parseCsv(process.env.INTERNAL_ADMIN_EMAILS);
  if (adminEmails.includes(email.toLowerCase())) return 'admin';

  const fallback = (process.env.INTERNAL_DEFAULT_ROLE ?? 'viewer').toLowerCase();
  if (fallback === 'pm' || fallback === 'dev' || fallback === 'qa' || fallback === 'viewer') {
    return fallback;
  }
  return 'viewer';
}

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/internal/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    // Dev-only credentials provider for testing without Google OAuth
    ...(process.env.NODE_ENV === 'development' && process.env.DEV_LOGIN_ENABLED === 'true'
      ? [
          CredentialsProvider({
            id: 'dev-login',
            name: 'Dev Login',
            credentials: {
              email: { label: 'Email', type: 'email' },
            },
            async authorize(credentials) {
              if (!credentials?.email) return null;
              const email = credentials.email.toLowerCase();
              if (!isEmailAllowed(email)) return null;
              return { id: email, email, name: email.split('@')[0] };
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase();
      if (!email) return false;
      if (!isEmailAllowed(email)) return false;

      const db = getDb();
      const now = new Date();
      const role = getRoleForEmail(email);

      await db
        .insert(users)
        .values({
          id: crypto.randomUUID(),
          email,
          name: user.name ?? null,
          image: user.image ?? null,
          role,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: users.email,
          set: {
            name: user.name ?? null,
            image: user.image ?? null,
            updatedAt: now,
          },
        });

      return true;
    },
    async jwt({ token }) {
      const email = typeof token.email === 'string' ? token.email.toLowerCase() : null;
      if (!email) return token;

      const db = getDb();
      const row = await db.select().from(users).where(eq(users.email, email)).get();

      if (row) {
        token.uid = row.id;
        token.role = row.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.uid === 'string' ? token.uid : undefined;
        session.user.role = typeof token.role === 'string' ? (token.role as UserRole) : 'viewer';
      }
      return session;
    },
  },
};
