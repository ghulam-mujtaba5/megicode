import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      role?: 'admin' | 'pm' | 'dev' | 'qa' | 'viewer';
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    uid?: string;
    role?: 'admin' | 'pm' | 'dev' | 'qa' | 'viewer';
  }
}
