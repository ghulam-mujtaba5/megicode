import { drizzle } from 'drizzle-orm/libsql';
import { createClient, type Client } from '@libsql/client';
import * as schema from './schema';

let _client: Client | null = null;
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export function getTursoClient(): Client {
  if (_client) return _client;

  const url = requireEnv('TURSO_DATABASE_URL');
  console.log('Connecting to database at:', url);
  
  _client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  return _client;
}

export function getDb() {
  if (_db) return _db;
  _db = drizzle(getTursoClient(), { schema });
  return _db;
}

/**
 * Execute multiple database operations in a transaction.
 * If any operation fails, all changes are rolled back.
 * 
 * @example
 * ```ts
 * await withTransaction(async (tx) => {
 *   await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100` }).where(eq(accounts.userId, fromId));
 *   await tx.update(accounts).set({ balance: sql`${accounts.balance} + 100` }).where(eq(accounts.userId, toId));
 * });
 * ```
 */
export async function withTransaction<T>(
  fn: (tx: Parameters<Parameters<ReturnType<typeof getDb>['transaction']>[0]>[0]) => Promise<T>
): Promise<T> {
  const db = getDb();
  return db.transaction(fn);
}
export { schema };
