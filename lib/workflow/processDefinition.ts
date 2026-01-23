import { eq, and, desc } from 'drizzle-orm';

import { getDb } from '@/lib/db';
import { processDefinitions, type UserRole } from '@/lib/db/schema';
import type { ProcessDefinitionJson } from '@/lib/types/json-types';

export type ProcessStep = {
  key: string;
  title: string;
  type: 'task' | 'approval' | 'notification';
  assigneeRole?: string;
  next?: string;
};

export const DEFAULT_PROCESS_KEY = 'megicode_delivery';

export function getDefaultProcessJson(): ProcessDefinitionJson {
  return {
    steps: [
      { key: 'client_request', title: 'Client Request', type: 'task', assigneeRole: 'pm' },
      { key: 'pm_review', title: 'PM Review', type: 'task', assigneeRole: 'pm' },
      { key: 'approval', title: 'Approval', type: 'approval', assigneeRole: 'admin' },
      { key: 'assign_team', title: 'Assign Team', type: 'task', assigneeRole: 'pm' },
      { key: 'requirements', title: 'Requirements', recommendedRole: 'pm' },
      { key: 'design', title: 'Design', recommendedRole: 'dev' },
      { key: 'development', title: 'Development', recommendedRole: 'dev' },
      { key: 'testing', title: 'Testing', recommendedRole: 'qa' },
      { key: 'review', title: 'Review', recommendedRole: 'pm' },
      { key: 'qa', title: 'QA', recommendedRole: 'qa' },
      { key: 'deployment', title: 'Deployment', type: 'task', assigneeRole: 'dev' },
      { key: 'delivery', title: 'Delivery Package', type: 'task', assigneeRole: 'pm' },
      { key: 'feedback', title: 'Client Feedback', type: 'task', assigneeRole: 'pm' },
      { key: 'close', title: 'Close', type: 'task', assigneeRole: 'admin' },
    ],
  };
}

export async function ensureActiveDefaultProcessDefinition() {
  const db = getDb();

  const activeRows = await db
    .select()
    .from(processDefinitions)
    .where(and(eq(processDefinitions.key, DEFAULT_PROCESS_KEY), eq(processDefinitions.isActive, true)))
    .orderBy(desc(processDefinitions.version))
    .limit(1);
  const active = activeRows[0];

  if (active) {
    return {
      id: active.id,
      key: active.key,
      version: active.version,
      json: active.json,
    };
  }

  const now = new Date();
  const json = getDefaultProcessJson();

  const id = crypto.randomUUID();
  await db.insert(processDefinitions).values({
    id,
    key: DEFAULT_PROCESS_KEY,
    version: 1,
    isActive: true,
    json: json,
    createdAt: now,
  });

  return { id, key: DEFAULT_PROCESS_KEY, version: 1, json };
}

