/**
 * Database Seeding Script
 * 
 * Populates the database with sample data for development/testing.
 * Run with: npm run db:seed
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const dotenv = require('dotenv');
const crypto = require('crypto');

export {};

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

const { getDb } = require('../lib/db');
const schema = require('../lib/db/schema');
const { sql } = require('drizzle-orm');

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function generateId(): string {
  return crypto.randomUUID();
}

async function seed() {
  const db = getDb();
  const now = new Date();

  console.log('🌱 Starting database seed...\n');

  // CLEAR EXISTING DATA
  console.log('🧹 Clearing existing data...');
  
  try {
    // Disable foreign keys to allow deletion regardless of order
    await db.run(sql`PRAGMA foreign_keys = OFF`);
  } catch (e) {
    console.warn('   Warning: Could not disable foreign keys:', getErrorMessage(e));
  }
  
  const safeDelete = async (table: any, name: string) => {
    try {
      await db.delete(table);
      console.log(`   Deleted ${name}`);
    } catch (e) {
      console.warn(`   Failed to delete ${name}: ${getErrorMessage(e)}`);
    }
  };

  // Delete in reverse order of dependencies
  await safeDelete(schema.businessProcessAutomations, 'businessProcessAutomations');
  await safeDelete(schema.businessProcessMessages, 'businessProcessMessages');
  await safeDelete(schema.businessProcessData, 'businessProcessData');
  await safeDelete(schema.businessProcessStepInstances, 'businessProcessStepInstances');
  await safeDelete(schema.timeEntries, 'timeEntries');
  await safeDelete(schema.bugs, 'bugs');
  await safeDelete(schema.meetings, 'meetings');
  await safeDelete(schema.payments, 'payments');
  await safeDelete(schema.invoiceItems, 'invoiceItems');
  await safeDelete(schema.invoices, 'invoices');
  await safeDelete(schema.proposalItems, 'proposalItems');
  await safeDelete(schema.proposals, 'proposals');
  await safeDelete(schema.attachments, 'attachments');
  await safeDelete(schema.projectNotes, 'projectNotes');
  await safeDelete(schema.leadNotes, 'leadNotes');
  await safeDelete(schema.clientContacts, 'clientContacts');
  await safeDelete(schema.milestones, 'milestones');
  await safeDelete(schema.tasks, 'tasks');
  await safeDelete(schema.processInstances, 'processInstances');
  await safeDelete(schema.processDefinitions, 'processDefinitions');
  await safeDelete(schema.projects, 'projects');
  await safeDelete(schema.leads, 'leads');
  await safeDelete(schema.clients, 'clients');
  await safeDelete(schema.users, 'users');
  
  try {
    // Re-enable foreign keys
    await db.run(sql`PRAGMA foreign_keys = ON`);
  } catch (e) {
    console.warn('   Warning: Could not re-enable foreign keys:', getErrorMessage(e));
  }
  
  console.log('   Data cleared.\n');

  // 1. Create sample users
  console.log('Creating users...');
  const users = [
    {
      id: generateId(),
      email: 'admin@megicode.com',
      name: 'Admin User',
      role: 'admin' as const,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      email: 'pm@megicode.com',
      name: 'Project Manager',
      role: 'pm' as const,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      email: 'dev@megicode.com',
      name: 'Developer',
      role: 'dev' as const,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      email: 'qa@megicode.com',
      name: 'QA Engineer',
      role: 'qa' as const,
      createdAt: now,
      updatedAt: now,
    },
  ];
  await db.insert(schema.users).values(users);
  console.log(`  ✓ Created ${users.length} users`);

  // 2. Create sample clients
  console.log('Creating clients...');
  const clients = [
    {
      id: generateId(),
      name: 'Acme Corporation',
      company: 'Acme Corp',
      website: 'https://acme.example.com',
      industry: 'Technology',
      status: 'active' as const,
      billingEmail: 'billing@acme.example.com',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'TechStart Inc',
      company: 'TechStart',
      website: 'https://techstart.example.com',
      industry: 'Startup',
      status: 'active' as const,
      billingEmail: 'finance@techstart.example.com',
      createdAt: now,
      updatedAt: now,
    },
  ];
  await db.insert(schema.clients).values(clients);
  console.log(`  ✓ Created ${clients.length} clients`);

  // 3. Create sample leads
  console.log('Creating leads...');
  const leads = [
    {
      id: generateId(),
      name: 'John Smith',
      email: 'john@example.com',
      company: 'Smith & Co',
      phone: '+1-555-0100',
      service: 'Custom Web Development',
      message: 'Looking for a custom e-commerce platform for our retail business.',
      source: 'website_contact',
      status: 'new' as const,
      estimatedBudget: 5000000, // $50,000 in cents
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'Sarah Johnson',
      email: 'sarah@startup.io',
      company: 'StartupIO',
      service: 'Mobile App Solutions',
      message: 'Need a mobile app for iOS and Android. MVP first.',
      source: 'referral',
      status: 'in_review' as const,
      estimatedBudget: 3000000, // $30,000
      estimatedHours: 400,
      complexity: 'moderate' as const,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      updatedAt: now,
    },
  ];
  await db.insert(schema.leads).values(leads);
  console.log(`  ✓ Created ${leads.length} leads`);

  // 4. Create sample projects
  console.log('Creating projects...');
  const projects = [
    {
      id: generateId(),
      clientId: clients[0].id,
      name: 'Acme E-commerce Platform',
      description: 'Full-featured e-commerce platform with inventory management',
      ownerUserId: users[1].id, // PM
      status: 'in_progress' as const,
      priority: 'high',
      healthStatus: 'green' as const,
      techStack: JSON.stringify(['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe']),
      repoUrl: 'https://github.com/megicode/acme-ecommerce',
      stagingUrl: 'https://staging.acme.example.com',
      startAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Started 30 days ago
      dueAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // Due in 60 days
      createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      updatedAt: now,
    },
    {
      id: generateId(),
      clientId: clients[1].id,
      name: 'TechStart Mobile App',
      description: 'Cross-platform mobile app with real-time features',
      ownerUserId: users[1].id,
      status: 'new' as const,
      priority: 'medium',
      healthStatus: 'amber' as const,
      techStack: JSON.stringify(['React Native', 'Node.js', 'MongoDB']),
      createdAt: now,
      updatedAt: now,
    },
  ];
  await db.insert(schema.projects).values(projects);
  console.log(`  ✓ Created ${projects.length} projects`);

  // 5. Create sample process definition (minimal)
  console.log('Creating process definitions...');
  const processDefinition = {
    id: generateId(),
    key: 'standard_delivery',
    version: 1,
    isActive: true,
    json: JSON.stringify({
      name: 'Standard Project Delivery',
      steps: [
        { key: 'kickoff', title: 'Project Kickoff' },
        { key: 'development', title: 'Development' },
        { key: 'qa', title: 'QA & Testing' },
        { key: 'delivery', title: 'Delivery' },
      ],
    }),
    createdAt: now,
  };
  await db.insert(schema.processDefinitions).values(processDefinition);
  console.log(`  ✓ Created 1 process definition`);

  // 6. Create process instance for active project
  console.log('Creating process instances...');
  const processInstance = {
    id: generateId(),
    processDefinitionId: processDefinition.id,
    projectId: projects[0].id,
    status: 'running' as const,
    currentStepKey: 'development',
    startedAt: projects[0].startAt,
  };
  await db.insert(schema.processInstances).values(processInstance);
  console.log(`  ✓ Created 1 process instance`);

  // 7. Create sample tasks
  console.log('Creating tasks...');
  const tasks = [
    {
      id: generateId(),
      instanceId: processInstance.id,
      projectId: projects[0].id,
      key: 'setup-repo',
      title: 'Setup project repository',
      description: 'Initialize git repo, CI/CD, and development environment',
      priority: 'high',
      status: 'done' as const,
      assignedToUserId: users[2].id, // Developer
      completedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: now,
    },
    {
      id: generateId(),
      instanceId: processInstance.id,
      projectId: projects[0].id,
      key: 'auth-system',
      title: 'Implement authentication system',
      description: 'User registration, login, password reset, and OAuth',
      priority: 'high',
      status: 'done' as const,
      assignedToUserId: users[2].id,
      completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      updatedAt: now,
    },
    {
      id: generateId(),
      instanceId: processInstance.id,
      projectId: projects[0].id,
      key: 'product-catalog',
      title: 'Build product catalog',
      description: 'Product listing, categories, search, and filters',
      priority: 'medium',
      status: 'in_progress' as const,
      assignedToUserId: users[2].id,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: now,
    },
    {
      id: generateId(),
      instanceId: processInstance.id,
      projectId: projects[0].id,
      key: 'checkout-flow',
      title: 'Implement checkout flow',
      description: 'Cart, shipping, payment integration with Stripe',
      priority: 'high',
      status: 'todo' as const,
      dueAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      instanceId: processInstance.id,
      projectId: projects[0].id,
      key: 'admin-dashboard',
      title: 'Admin dashboard',
      description: 'Order management, inventory, and analytics',
      priority: 'medium',
      status: 'todo' as const,
      createdAt: now,
      updatedAt: now,
    },
  ];
  await db.insert(schema.tasks).values(tasks);
  console.log(`  ✓ Created ${tasks.length} tasks`);

  // 8. Create sample milestones
  console.log('Creating milestones...');
  const milestones = [
    {
      id: generateId(),
      projectId: projects[0].id,
      title: 'Alpha Release',
      description: 'Core features working, ready for internal testing',
      dueAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      sortOrder: 1,
      createdAt: now,
    },
    {
      id: generateId(),
      projectId: projects[0].id,
      title: 'Beta Release',
      description: 'All features complete, ready for client testing',
      dueAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      sortOrder: 2,
      createdAt: now,
    },
    {
      id: generateId(),
      projectId: projects[0].id,
      title: 'Production Launch',
      description: 'Final deployment to production',
      dueAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      sortOrder: 3,
      createdAt: now,
    },
  ];
  await db.insert(schema.milestones).values(milestones);
  console.log(`  ✓ Created ${milestones.length} milestones`);

  // 9. Create client contacts, notes, and attachments
  console.log('Creating client contacts, notes, and attachments...');
  const clientContacts = [
    {
      id: generateId(),
      clientId: clients[0].id,
      name: 'Alice Robinson',
      email: 'alice@acme.example.com',
      phone: '+1-555-0111',
      role: 'Product Owner',
      isPrimary: 1,
      preferredChannel: 'email',
      createdAt: now,
    },
    {
      id: generateId(),
      clientId: clients[1].id,
      name: 'Ben Turner',
      email: 'ben@techstart.example.com',
      phone: '+1-555-0122',
      role: 'CTO',
      isPrimary: 1,
      preferredChannel: 'slack',
      createdAt: now,
    },
  ];
  await db.insert(schema.clientContacts).values(clientContacts);
  await db.insert(schema.leadNotes).values([
    {
      id: generateId(),
      leadId: leads[0].id,
      authorUserId: users[0].id,
      content: 'Initial discovery note recorded during intake call.',
      createdAt: now,
    },
  ]);
  await db.insert(schema.projectNotes).values([
    {
      id: generateId(),
      projectId: projects[0].id,
      authorUserId: users[1].id,
      content: 'Project kickoff completed. Onboarding checklist started.',
      createdAt: now,
    },
  ]);
  await db.insert(schema.attachments).values([
    {
      id: generateId(),
      entityType: 'project',
      entityId: projects[0].id,
      filename: 'architecture.png',
      url: 'https://assets.example.com/architecture.png',
      mimeType: 'image/png',
      sizeBytes: 123456,
      uploadedByUserId: users[2].id,
      createdAt: now,
    },
  ]);
  console.log('  ✓ Created client contacts, notes, and attachments');

  // 10. Create proposals, invoices and payments
  console.log('Creating proposals, invoices, and payments...');
  const proposal = {
    id: generateId(),
    leadId: leads[0].id,
    clientId: clients[0].id,
    title: 'Acme E-commerce SOW',
    summary: 'MVP e-commerce platform with payments and admin panel',
    scope: 'Design, implement, and deploy e-commerce platform',
    timeline: '3 months',
    costModel: 'fixed',
    totalAmount: 5000000,
    currency: 'USD',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'sent',
    createdByUserId: users[1].id,
    createdAt: now,
    updatedAt: now,
  };
  await db.insert(schema.proposals).values(proposal);
  await db.insert(schema.proposalItems).values([
    {
      id: generateId(),
      proposalId: proposal.id,
      description: 'Frontend implementation',
      quantity: 1,
      unitPrice: 2000000,
      sortOrder: 1,
    },
    {
      id: generateId(),
      proposalId: proposal.id,
      description: 'Backend & integrations',
      quantity: 1,
      unitPrice: 2500000,
      sortOrder: 2,
    },
  ]);

  const invoice = {
    id: generateId(),
    invoiceNumber: 'INV-1001',
    projectId: projects[0].id,
    clientId: clients[0].id,
    proposalId: proposal.id,
    title: 'Deposit Invoice - Acme E-commerce',
    totalAmount: 1500000,
    paidAmount: 0,
    currency: 'USD',
    dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'sent',
    createdAt: now,
    updatedAt: now,
  };
  await db.insert(schema.invoices).values(invoice);
  await db.insert(schema.invoiceItems).values([
    {
      id: generateId(),
      invoiceId: invoice.id,
      description: 'Deposit (30%)',
      quantity: 1,
      unitPrice: 1500000,
      sortOrder: 0,
    },
  ]);
  await db.insert(schema.payments).values([
    {
      id: generateId(),
      invoiceId: invoice.id,
      amount: 1500000,
      method: 'bank_transfer',
      reference: 'BTX-12345',
      paidAt: new Date(),
      notes: 'Client paid deposit',
      createdAt: now,
    },
  ]);
  console.log('  ✓ Created proposals, invoices, and payments');

  // 11. Create meetings, bugs and time entries
  console.log('Creating meetings, bugs, and time entries...');
  await db.insert(schema.meetings).values([
    {
      id: generateId(),
      projectId: projects[0].id,
      title: 'Sprint Planning',
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      durationMinutes: 60,
      meetingLink: 'https://meet.example.com/planning',
      agenda: 'Plan sprint tasks and priorities',
      createdByUserId: users[1].id,
      createdAt: now,
    },
  ]);
  await db.insert(schema.bugs).values([
    {
      id: generateId(),
      projectId: projects[0].id,
      title: 'Checkout button not responding',
      description: 'Button click does not trigger add-to-cart event in Safari',
      stepsToReproduce: '1. Open product page in Safari\n2. Click Add to cart\n3. Nothing happens',
      severity: 'high',
      status: 'open',
      reportedByUserId: users[3].id,
      assignedToUserId: users[2].id,
      createdAt: now,
      updatedAt: now,
    },
  ]);
  await db.insert(schema.timeEntries).values([
    {
      id: generateId(),
      taskId: tasks[2].id,
      projectId: projects[0].id,
      userId: users[2].id,
      description: 'Implemented product listing API',
      minutes: 240,
      date: new Date(),
      billable: 1,
      createdAt: now,
    },
  ]);
  console.log('  ✓ Created meetings, bugs, and time entries');

  // 12. Create some business process step instances & data
  console.log('Creating business process step instances and data...');
  const bpStepInstances = [
    {
      id: generateId(),
      processInstanceId: processInstance.id,
      stepKey: 'kickoff',
      status: 'completed',
      startedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
      assignedToUserId: users[1].id,
      createdAt: now,
    },
    {
      id: generateId(),
      processInstanceId: processInstance.id,
      stepKey: 'development',
      status: 'active',
      startedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      assignedToUserId: users[2].id,
      createdAt: now,
    },
  ];
  await db.insert(schema.businessProcessStepInstances).values(bpStepInstances);
  await db.insert(schema.businessProcessData).values([
    {
      id: generateId(),
      processInstanceId: processInstance.id,
      dataKey: 'deployment_bucket',
      dataValue: 'staging-acme-bucket',
      dataType: 'string',
      updatedAt: now,
      updatedByUserId: users[2].id,
    },
  ]);
  await db.insert(schema.businessProcessMessages).values([
    {
      id: generateId(),
      processInstanceId: processInstance.id,
      messageKey: 'notify-qa',
      fromStepKey: 'development',
      toStepKey: 'qa',
      label: 'Dev->QA handoff',
      payload: JSON.stringify({ buildUrl: 'https://staging.acme.example.com' }),
      sentAt: new Date(),
      status: 'sent',
    },
  ]);
  await db.insert(schema.businessProcessAutomations).values([
    {
      id: generateId(),
      processInstanceId: processInstance.id,
      stepKey: 'development',
      automationAction: 'run-ci',
      status: 'completed',
      startedAt: new Date(Date.now() - 5 * 60 * 1000),
      completedAt: new Date(Date.now() - 3 * 60 * 1000),
      resultData: JSON.stringify({ success: true }),
      retryCount: 0,
    },
  ]);
  console.log('  ✓ Created business process artifacts');

  // 13. Create sample notifications for users
  console.log('Creating sample notifications...');
  const notificationTypes = ['task_assigned', 'project_created', 'task_due_soon', 'sla_warning', 'system'];
  const notificationPriorities = ['low', 'normal', 'high', 'urgent'];
  
  const sampleNotifications = [
    {
      id: generateId(),
      userId: users[0].id, // admin
      type: 'project_created',
      title: 'New Project Created',
      message: 'Project "ACME Corp Website Redesign" has been created and assigned to your team.',
      priority: 'normal',
      entityType: 'project',
      entityId: projects[0].id,
      link: `/internal/projects/${projects[0].id}`,
      actorUserId: users[1].id,
      isRead: false,
      isDismissed: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    },
    {
      id: generateId(),
      userId: users[0].id, // admin
      type: 'task_due_soon',
      title: 'Task Due Soon',
      message: '"Complete wireframes" is due in 2 days. Please review and prioritize.',
      priority: 'high',
      entityType: 'task',
      entityId: tasks[0].id,
      link: `/internal/tasks/${tasks[0].id}`,
      isRead: false,
      isDismissed: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    },
    {
      id: generateId(),
      userId: users[0].id, // admin
      type: 'sla_warning',
      title: 'SLA Warning',
      message: 'The "Development" step in project "ACME Corp Website Redesign" is approaching its SLA deadline.',
      priority: 'urgent',
      entityType: 'project',
      entityId: projects[0].id,
      link: `/internal/projects/${projects[0].id}`,
      isRead: false,
      isDismissed: false,
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
    },
    {
      id: generateId(),
      userId: users[0].id, // admin
      type: 'system',
      title: 'Welcome to Megicode Internal Portal',
      message: 'Your account has been set up. Start by exploring the dashboard and reviewing your assigned tasks.',
      priority: 'low',
      isRead: true,
      isDismissed: false,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: generateId(),
      userId: users[1].id, // PM
      type: 'task_assigned',
      title: 'New Task Assigned',
      message: 'You have been assigned to "Define project scope" in ACME Corp Website Redesign.',
      priority: 'normal',
      entityType: 'task',
      entityId: tasks[1].id,
      link: `/internal/tasks/${tasks[1].id}`,
      actorUserId: users[0].id,
      isRead: false,
      isDismissed: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: generateId(),
      userId: users[2].id, // Dev
      type: 'task_assigned',
      title: 'Development Task Assigned',
      message: 'You have been assigned to implement the landing page for ACME Corp project.',
      priority: 'high',
      entityType: 'project',
      entityId: projects[0].id,
      link: `/internal/projects/${projects[0].id}`,
      actorUserId: users[1].id,
      isRead: false,
      isDismissed: false,
      createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 mins ago
    },
  ];
  
  try {
    await db.insert(schema.notifications).values(sampleNotifications);
    console.log('  ✓ Created sample notifications');
  } catch (e) {
    console.warn('  ⚠️ Could not create notifications:', getErrorMessage(e));
  }

  console.log('\n✅ Database seeding completed successfully!\n');
  console.log('Sample accounts created:');
  console.log('  - admin@megicode.com (admin)');
  console.log('  - pm@megicode.com (project manager)');
  console.log('  - dev@megicode.com (developer)');
  console.log('  - qa@megicode.com (qa engineer)\n');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exitCode = 1;
});
