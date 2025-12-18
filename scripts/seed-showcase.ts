
import { db } from '../drizzle/db';
import { projects, tasks, leads, processInstances, clients } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Seeding database for Showcase...');

  // 1. Create a Showcase Client
  const [client] = await db.insert(clients).values({
    name: 'TechCorp Inc.',
    email: 'cto@techcorp.com',
    company: 'TechCorp',
    status: 'active',
  }).returning();

  console.log('✅ Client created:', client.name);

  // 2. Create a Showcase Project
  const [project] = await db.insert(projects).values({
    name: 'Project Phoenix (AI Dashboard)',
    description: 'Next-gen AI analytics dashboard with real-time processing.',
    status: 'in_progress',
    clientId: client.id,
    startDate: new Date().toISOString(),
    budget: 50000,
    techStack: JSON.stringify(['Next.js', 'Python', 'TensorFlow', 'ClickUp']),
  }).returning();

  console.log('✅ Project created:', project.name);

  // 3. Create Process Instance
  await db.insert(processInstances).values({
    projectId: project.id,
    processId: 'Process_Advanced', // Matches our new BPMN
    status: 'running',
    currentStep: 'UserTask_Development',
    startedAt: new Date().toISOString(),
  });

  // 4. Create Tasks (Simulating ClickUp Sync)
  const taskList = [
    { title: 'Setup CI/CD Pipeline', status: 'done', priority: 'high', assignee: 'DevOps Bot' },
    { title: 'Implement Auth (OAuth2)', status: 'in_progress', priority: 'critical', assignee: 'Senior Dev' },
    { title: 'Design Dark Mode UI', status: 'todo', priority: 'medium', assignee: 'Designer' },
    { title: 'Integrate Stripe Payments', status: 'todo', priority: 'high', assignee: 'Backend Dev' },
  ];

  for (const t of taskList) {
    await db.insert(tasks).values({
      projectId: project.id,
      title: t.title,
      status: t.status as any,
      priority: t.priority as any,
      assigneeId: t.assignee, // Using string for simplicity in showcase
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString(), // Due in 7 days
    });
  }

  console.log(`✅ Created ${taskList.length} tasks.`);
  console.log('🌱 Seeding complete! Ready for showcase.');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
