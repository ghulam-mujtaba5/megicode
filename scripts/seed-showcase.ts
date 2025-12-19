
import { getDb } from '../lib/db';
import { projects, tasks, processInstances, clients, processDefinitions, users } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

async function seed() {
  const db = getDb();
  console.log('🌱 Seeding database for Showcase...');

  const now = new Date();

  // 0. Create a User (for assignee)
  const [devOpsUser] = await db.insert(users).values({
    id: randomUUID(),
    email: 'bot@megicode.com',
    name: 'DevOps Bot',
    role: 'dev',
    status: 'active',
    createdAt: now,
    updatedAt: now,
  }).returning();

  // 1. Create a Showcase Client
  const [client] = await db.insert(clients).values({
    id: randomUUID(),
    name: 'TechCorp Inc.',
    billingEmail: 'cto@techcorp.com',
    company: 'TechCorp',
    status: 'active',
    createdAt: now,
    updatedAt: now,
  }).returning();

  console.log('✅ Client created:', client.name);

  // 2. Create a Showcase Project
  const [project] = await db.insert(projects).values({
    id: randomUUID(),
    name: 'Project Phoenix (AI Dashboard)',
    description: 'Next-gen AI analytics dashboard with real-time processing.',
    status: 'in_progress',
    clientId: client.id,
    startAt: now,
    techStack: ['Next.js', 'Python', 'TensorFlow', 'ClickUp'] as any,
    createdAt: now,
    updatedAt: now,
  }).returning();

  console.log('✅ Project created:', project.name);

  // 2.5 Create Process Definition
  const [procDef] = await db.insert(processDefinitions).values({
    id: randomUUID(),
    key: 'Process_Advanced',
    version: 1,
    json: { steps: [] } as any,
    createdAt: now,
  }).returning();

  // 3. Create Process Instance
  const [procInstance] = await db.insert(processInstances).values({
    id: randomUUID(),
    projectId: project.id,
    processDefinitionId: procDef.id,
    status: 'running',
    currentStepKey: 'UserTask_Development',
    startedAt: now,
  }).returning();

  // 4. Create Tasks (Simulating ClickUp Sync)
  const taskList = [
    { title: 'Setup CI/CD Pipeline', status: 'done', priority: 'high', assignee: devOpsUser.id },
    { title: 'Implement Auth (OAuth2)', status: 'in_progress', priority: 'critical', assignee: devOpsUser.id },
    { title: 'Design Dark Mode UI', status: 'todo', priority: 'medium', assignee: devOpsUser.id },
    { title: 'Integrate Stripe Payments', status: 'todo', priority: 'high', assignee: devOpsUser.id },
  ];

  for (const t of taskList) {
    await db.insert(tasks).values({
      id: randomUUID(),
      instanceId: procInstance.id,
      key: `TASK-${randomUUID().substring(0, 4)}`,
      title: t.title,
      status: t.status as any,
      priority: t.priority as any,
      assignedToUserId: t.assignee,
      dueAt: new Date(Date.now() + 86400000 * 7),
      createdAt: now,
      updatedAt: now,
    });
  }

  console.log(`✅ Created ${taskList.length} tasks.`);
  console.log('🌱 Seeding complete! Ready for showcase.');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
