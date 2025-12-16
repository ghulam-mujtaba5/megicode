import { eq, and, desc } from 'drizzle-orm';

import { getDb } from '@/lib/db';
import { processDefinitions, type UserRole } from '@/lib/db/schema';

export type ProcessStep = {
  key: string;
  title: string;
  recommendedRole?: UserRole;
};

export type ProcessDefinitionJson = {
  key: string;
  version: number;
  name: string;
  steps: ProcessStep[];
};

const DEFAULT_PROCESS_KEY = 'megicode_delivery';

export function getDefaultProcessJson(): ProcessDefinitionJson {
  return {
    key: DEFAULT_PROCESS_KEY,
    version: 1,
    name: 'Megicode Delivery Process',
    steps: [
      { key: 'client_request', title: 'Client Request', recommendedRole: 'pm' },
      { key: 'pm_review', title: 'PM Review', recommendedRole: 'pm' },
      { key: 'approval', title: 'Approval', recommendedRole: 'admin' },
      { key: 'assign_team', title: 'Assign Team', recommendedRole: 'pm' },
      { key: 'requirements', title: 'Requirements', recommendedRole: 'pm' },
      { key: 'design', title: 'Design', recommendedRole: 'dev' },
      { key: 'development', title: 'Development', recommendedRole: 'dev' },
      { key: 'testing', title: 'Testing', recommendedRole: 'qa' },
      { key: 'review', title: 'Review', recommendedRole: 'pm' },
      { key: 'qa', title: 'QA', recommendedRole: 'qa' },
      { key: 'deployment', title: 'Deployment', recommendedRole: 'dev' },
      { key: 'delivery', title: 'Delivery Package', recommendedRole: 'pm' },
      { key: 'feedback', title: 'Client Feedback', recommendedRole: 'pm' },
      { key: 'close', title: 'Close', recommendedRole: 'admin' },
    ],
  };
}

export async function ensureActiveDefaultProcessDefinition() {
  const db = getDb();

  const active = await db
    .select()
    .from(processDefinitions)
    .where(and(eq(processDefinitions.key, DEFAULT_PROCESS_KEY), eq(processDefinitions.isActive, true)))
    .orderBy(desc(processDefinitions.version))
    .get();

  if (active) {
    return {
      id: active.id,
      json: JSON.parse(active.json) as ProcessDefinitionJson,
    };
  }

  const now = new Date();
  const json = getDefaultProcessJson();

  const id = crypto.randomUUID();
  await db.insert(processDefinitions).values({
    id,
    key: json.key,
    version: json.version,
    isActive: true,
    json: JSON.stringify(json),
    createdAt: now,
  });

  return { id, json };
}
