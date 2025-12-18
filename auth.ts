import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { eq } from 'drizzle-orm';

import { getDb } from '@/lib/db';
import { type UserRole, users } from '@/lib/db/schema';

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
    ...(process.env.NEXT_PUBLIC_DEV_LOGIN_ENABLED === 'true'
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

      try {
        const db = getDb();
        const now = new Date();
        // Check if user already exists
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        // Determine role to set:
        // - If user already exists: preserve their stored role (don't overwrite)
        // - If user is listed in INTERNAL_ADMIN_EMAILS: promote to admin
        // - Otherwise for new users use configured fallback mapping
        let roleToSet: UserRole;
        const adminEmails = parseCsv(process.env.INTERNAL_ADMIN_EMAILS);
        if (existingUser.length > 0) {
          roleToSet = (existingUser[0].role as UserRole) ?? ((process.env.INTERNAL_DEFAULT_ROLE ?? 'viewer') as UserRole);
          // Allow explicit admin promotion via env
          if (adminEmails.includes(email)) roleToSet = 'admin';
        } else {
          roleToSet = getRoleForEmail(email);
        }

        if (existingUser.length > 0) {
          // Update existing user but do NOT overwrite role unless admin promoted
          await db
            .update(users)
            .set({
              name: user.name ?? null,
              image: user.image ?? null,
              role: roleToSet,
              updatedAt: now,
            })
            .where(eq(users.email, email));
        } else {
          // Insert new user
          await db.insert(users).values({
            id: crypto.randomUUID(),
            email,
            name: user.name ?? null,
            image: user.image ?? null,
            role: roleToSet,
            createdAt: now,
            updatedAt: now,
          });
        }

        return true;
      } catch (error) {
        console.error('Database error during sign-in:', error);
        // Re-throw with more context
        throw new Error(
          `Failed to save user: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    },
    async jwt({ token }) {
      const email = typeof token.email === 'string' ? token.email.toLowerCase() : null;
      if (!email) return token;

      const db = getDb();
      const row = await db.select().from(users).where(eq(users.email, email)).get();

      if (row) {
        token.uid = row.id;
        token.role = row.role;
        token.status = row.status;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.uid === 'string' ? token.uid : undefined;
        session.user.role = typeof token.role === 'string' ? (token.role as UserRole) : 'viewer';
        session.user.status = typeof token.status === 'string' ? token.status : 'pending';
      }
      return session;
    },
  },
};
