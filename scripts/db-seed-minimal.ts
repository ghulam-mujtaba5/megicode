/*
 * Minimal DB seed for users/roles (idempotent)
 * Run with: npm run db:seed:users
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const dotenv = require('dotenv');
const crypto = require('crypto');

export {};

// Load env
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

const { getDb } = require('../lib/db');
const schema = require('../lib/db/schema');

function generateId() {
  return crypto.randomUUID();
}

async function seedUsers() {
  const db = getDb();
  const now = new Date();

  console.log('🌱 Running minimal user seed...');

  const users = [
    {
      id: generateId(),
      email: 'admin@megicode.com',
      name: 'Admin User',
      role: 'admin',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      email: 'pm@megicode.com',
      name: 'Project Manager',
      role: 'pm',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      email: 'dev@megicode.com',
      name: 'Developer',
      role: 'dev',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      email: 'qa@megicode.com',
      name: 'QA Engineer',
      role: 'qa',
      createdAt: now,
      updatedAt: now,
    },
  ];

  try {
    for (const u of users) {
      await db
        .insert(schema.users)
        .values(u)
        .onConflictDoUpdate({
          target: schema.users.email,
          set: {
            name: u.name,
            role: u.role,
            updatedAt: now,
          },
        });
    }

    console.log(`  ✓ Upserted ${users.length} users`);
  } catch (err) {
    console.error('Failed to seed users:', err);
    process.exit(1);
  }
}

seedUsers().then(() => process.exit(0));
