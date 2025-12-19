/**
 * Comprehensive Database Seeding Script
 * 
 * Populates the database with MAXIMUM realistic data for all features,
 * stages, scenarios, workflows, and analytics.
 * 
 * Run with: npx tsx scripts/db-seed-comprehensive.ts
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

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysAgo: number, daysAhead: number = 0): Date {
  const now = Date.now();
  const offset = randomInt(-daysAgo, daysAhead) * 24 * 60 * 60 * 1000;
  return new Date(now + offset);
}

function randomFromArray<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  const db = getDb();
  const now = new Date();

  console.log('🌱 Starting COMPREHENSIVE database seed...\n');

  // CLEAR EXISTING DATA
  console.log('🧹 Clearing existing data...');
  
  try {
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
    await db.run(sql`PRAGMA foreign_keys = ON`);
  } catch (e) {
    console.warn('   Warning: Could not re-enable foreign keys:', getErrorMessage(e));
  }
  
  console.log('   Data cleared.\n');

  // ========== 1. CREATE USERS (Team members) ==========
  console.log('Creating users...');
  const users = [
    { id: generateId(), email: 'admin@megicode.com', name: 'Muhammad Ali', role: 'admin' as const, capacity: 40, status: 'active' as const, createdAt: now, updatedAt: now },
    { id: generateId(), email: 'pm@megicode.com', name: 'Sarah Chen', role: 'pm' as const, capacity: 40, status: 'active' as const, createdAt: now, updatedAt: now },
    { id: generateId(), email: 'pm2@megicode.com', name: 'James Rodriguez', role: 'pm' as const, capacity: 40, status: 'active' as const, createdAt: now, updatedAt: now },
    { id: generateId(), email: 'dev1@megicode.com', name: 'Alex Kumar', role: 'dev' as const, capacity: 40, status: 'active' as const, createdAt: now, updatedAt: now },
    { id: generateId(), email: 'dev2@megicode.com', name: 'Emily Zhang', role: 'dev' as const, capacity: 40, status: 'active' as const, createdAt: now, updatedAt: now },
    { id: generateId(), email: 'dev3@megicode.com', name: 'Michael Brown', role: 'dev' as const, capacity: 40, status: 'active' as const, createdAt: now, updatedAt: now },
    { id: generateId(), email: 'dev4@megicode.com', name: 'Priya Sharma', role: 'dev' as const, capacity: 40, status: 'active' as const, createdAt: now, updatedAt: now },
    { id: generateId(), email: 'qa1@megicode.com', name: 'David Park', role: 'qa' as const, capacity: 40, status: 'active' as const, createdAt: now, updatedAt: now },
    { id: generateId(), email: 'qa2@megicode.com', name: 'Lisa Thompson', role: 'qa' as const, capacity: 40, status: 'active' as const, createdAt: now, updatedAt: now },
    { id: generateId(), email: 'design@megicode.com', name: 'Anna Wilson', role: 'dev' as const, capacity: 40, status: 'active' as const, createdAt: now, updatedAt: now },
  ];
  await db.insert(schema.users).values(users);
  console.log(`  ✓ Created ${users.length} users`);

  // ========== 2. CREATE CLIENTS ==========
  console.log('Creating clients...');
  const clientsData = [
    { name: 'Acme Corporation', company: 'Acme Corp', website: 'https://acme.io', industry: 'Technology', status: 'active' as const },
    { name: 'TechStart Inc', company: 'TechStart', website: 'https://techstart.co', industry: 'Startup', status: 'active' as const },
    { name: 'Global Retail Solutions', company: 'GRS', website: 'https://grs-retail.com', industry: 'Retail', status: 'active' as const },
    { name: 'HealthFirst Medical', company: 'HealthFirst', website: 'https://healthfirst.med', industry: 'Healthcare', status: 'active' as const },
    { name: 'EduLearn Platform', company: 'EduLearn', website: 'https://edulearn.edu', industry: 'Education', status: 'active' as const },
    { name: 'FinanceHub', company: 'FinanceHub LLC', website: 'https://financehub.com', industry: 'Finance', status: 'active' as const },
    { name: 'GreenEnergy Solutions', company: 'GreenEnergy', website: 'https://greenenergy.eco', industry: 'Energy', status: 'active' as const },
    { name: 'LogiTrans Shipping', company: 'LogiTrans', website: 'https://logitrans.ship', industry: 'Logistics', status: 'active' as const },
    { name: 'MediaMax Entertainment', company: 'MediaMax', website: 'https://mediamax.ent', industry: 'Media', status: 'active' as const },
    { name: 'CloudNine Services', company: 'CloudNine', website: 'https://cloudnine.cloud', industry: 'Technology', status: 'active' as const },
    { name: 'FoodieDelight', company: 'FoodieDelight Co', website: 'https://foodiedelight.food', industry: 'Food & Beverage', status: 'active' as const },
    { name: 'TravelEase', company: 'TravelEase Intl', website: 'https://travelease.travel', industry: 'Travel', status: 'inactive' as const },
  ];
  const clients = clientsData.map(c => ({
    id: generateId(),
    ...c,
    billingEmail: `billing@${c.company.toLowerCase().replace(/\s/g, '')}.com`,
    createdAt: randomDate(180),
    updatedAt: now,
  }));
  await db.insert(schema.clients).values(clients);
  console.log(`  ✓ Created ${clients.length} clients`);

  // ========== 3. CREATE LEADS (Various stages) ==========
  console.log('Creating leads...');
  const leadStatuses = ['new', 'in_review', 'approved', 'rejected', 'converted'] as const;
  const services = ['Custom Web Development', 'Mobile App Solutions', 'E-commerce Platform', 'API Development', 'Cloud Migration', 'UI/UX Design', 'SaaS Development', 'AI/ML Integration'];
  const sources = ['website_contact', 'referral', 'linkedin', 'conference', 'cold_outreach', 'partner'];
  const complexities = ['simple', 'moderate', 'complex', 'enterprise'] as const;
  
  const leadsData = [
    { name: 'John Smith', email: 'john@smithco.com', company: 'Smith & Co', status: 'new' as const },
    { name: 'Sarah Johnson', email: 'sarah@startupx.io', company: 'StartupX', status: 'new' as const },
    { name: 'Michael Lee', email: 'mlee@techgiant.com', company: 'TechGiant', status: 'new' as const },
    { name: 'Emma Davis', email: 'emma@innovate.co', company: 'Innovate Co', status: 'in_review' as const },
    { name: 'Robert Wilson', email: 'rwilson@enterprise.com', company: 'Enterprise Corp', status: 'in_review' as const },
    { name: 'Jennifer Brown', email: 'jbrown@retail360.com', company: 'Retail360', status: 'in_review' as const },
    { name: 'David Kim', email: 'dkim@fintech.io', company: 'FinTech Solutions', status: 'in_review' as const },
    { name: 'Lisa Chen', email: 'lchen@healthapp.com', company: 'HealthApp', status: 'approved' as const },
    { name: 'James Martinez', email: 'jmartinez@logix.co', company: 'Logix Systems', status: 'approved' as const },
    { name: 'Patricia Taylor', email: 'ptaylor@mediaco.com', company: 'MediaCo', status: 'approved' as const },
    { name: 'Thomas Anderson', email: 'tanderson@matrix.io', company: 'Matrix Inc', status: 'approved' as const },
    { name: 'Amanda White', email: 'awhite@cloudserv.com', company: 'CloudServ', status: 'converted' as const },
    { name: 'Christopher Garcia', email: 'cgarcia@ecomm.co', company: 'E-Comm Plus', status: 'converted' as const },
    { name: 'Michelle Robinson', email: 'mrobinson@saasify.io', company: 'SaaSify', status: 'converted' as const },
    { name: 'Kevin Thompson', email: 'kthompson@ailab.tech', company: 'AI Lab', status: 'rejected' as const },
    { name: 'Rachel Adams', email: 'radams@oldtech.com', company: 'OldTech Inc', status: 'rejected' as const },
  ];
  
  const leads = leadsData.map((l, i) => ({
    id: generateId(),
    ...l,
    phone: `+1-555-${String(1000 + i).padStart(4, '0')}`,
    service: randomFromArray(services),
    message: `Looking for a professional team to build ${randomFromArray(['an e-commerce platform', 'a mobile app', 'a SaaS product', 'a custom CRM', 'an AI solution', 'a cloud infrastructure'])}.`,
    source: randomFromArray(sources),
    estimatedBudget: randomInt(2, 15) * 1000000, // $20k - $150k in cents
    estimatedHours: randomInt(200, 2000),
    complexity: randomFromArray(complexities),
    createdAt: randomDate(90, 0),
    updatedAt: now,
  }));
  await db.insert(schema.leads).values(leads);
  console.log(`  ✓ Created ${leads.length} leads`);

  // ========== 4. CREATE PROJECTS (Various stages and health) ==========
  console.log('Creating projects...');
  const projectStatuses = ['new', 'in_progress', 'in_qa', 'blocked', 'delivered', 'on_hold'] as const;
  const healthStatuses = ['green', 'amber', 'red'] as const;
  const priorities = ['critical', 'high', 'medium', 'low'];
  
  const projectsData = [
    { clientIdx: 0, name: 'Acme E-commerce Platform', status: 'in_progress' as const, health: 'green' as const, priority: 'high' },
    { clientIdx: 0, name: 'Acme Mobile App', status: 'in_qa' as const, health: 'green' as const, priority: 'medium' },
    { clientIdx: 1, name: 'TechStart MVP', status: 'in_progress' as const, health: 'amber' as const, priority: 'high' },
    { clientIdx: 2, name: 'GRS Inventory System', status: 'in_progress' as const, health: 'green' as const, priority: 'high' },
    { clientIdx: 2, name: 'GRS POS Integration', status: 'new' as const, health: 'green' as const, priority: 'medium' },
    { clientIdx: 3, name: 'HealthFirst Patient Portal', status: 'in_progress' as const, health: 'red' as const, priority: 'critical' },
    { clientIdx: 3, name: 'HealthFirst Analytics Dashboard', status: 'blocked' as const, health: 'red' as const, priority: 'high' },
    { clientIdx: 4, name: 'EduLearn LMS Platform', status: 'in_progress' as const, health: 'green' as const, priority: 'high' },
    { clientIdx: 5, name: 'FinanceHub Trading Platform', status: 'in_qa' as const, health: 'amber' as const, priority: 'critical' },
    { clientIdx: 6, name: 'GreenEnergy Monitoring System', status: 'delivered' as const, health: 'green' as const, priority: 'medium' },
    { clientIdx: 7, name: 'LogiTrans Fleet Tracker', status: 'in_progress' as const, health: 'green' as const, priority: 'high' },
    { clientIdx: 8, name: 'MediaMax Streaming Platform', status: 'new' as const, health: 'green' as const, priority: 'medium' },
    { clientIdx: 9, name: 'CloudNine Infrastructure', status: 'delivered' as const, health: 'green' as const, priority: 'medium' },
    { clientIdx: 10, name: 'FoodieDelight Ordering App', status: 'in_progress' as const, health: 'amber' as const, priority: 'high' },
    { clientIdx: 10, name: 'FoodieDelight Admin Portal', status: 'on_hold' as const, health: 'amber' as const, priority: 'low' },
  ];
  
  const techStacks = [
    ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
    ['React Native', 'Node.js', 'MongoDB', 'Firebase'],
    ['Vue.js', 'Python', 'FastAPI', 'Redis'],
    ['Angular', 'Java', 'Spring Boot', 'MySQL'],
    ['Svelte', 'Go', 'GraphQL', 'DynamoDB'],
  ];
  
  const projects = projectsData.map((p, i) => {
    const startDays = randomInt(60, 180);
    const durationDays = randomInt(60, 180);
    const renewalDate = new Date(now.getTime() + randomInt(10, 60) * 24 * 60 * 60 * 1000);
    
    return {
      id: generateId(),
      clientId: clients[p.clientIdx].id,
      name: p.name,
      description: `Comprehensive ${p.name.toLowerCase()} with modern architecture and best practices.`,
      ownerUserId: randomFromArray([users[1].id, users[2].id]), // PMs
      status: p.status,
      priority: p.priority,
      healthStatus: p.health,
      techStack: JSON.stringify(randomFromArray(techStacks)),
      repoUrl: `https://github.com/megicode/${p.name.toLowerCase().replace(/\s+/g, '-')}`,
      stagingUrl: `https://staging.${p.name.toLowerCase().replace(/\s+/g, '')}.example.com`,
      startAt: new Date(now.getTime() - startDays * 24 * 60 * 60 * 1000),
      dueAt: new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000),
      contractRenewalAt: i < 5 ? renewalDate : null, // Some projects have renewals
      createdAt: new Date(now.getTime() - (startDays + 10) * 24 * 60 * 60 * 1000),
      updatedAt: now,
    };
  });
  await db.insert(schema.projects).values(projects);
  console.log(`  ✓ Created ${projects.length} projects`);

  // ========== 5. CREATE PROCESS DEFINITION ==========
  console.log('Creating process definitions...');
  const processDefinition = {
    id: generateId(),
    key: 'megicode_delivery_v2',
    version: 2,
    isActive: true,
    json: JSON.stringify({
      name: 'Megicode Delivery Process',
      key: 'megicode_delivery_v2',
      version: 2,
      lanes: [
        { name: 'Client', color: '#3b82f6' },
        { name: 'Business Development', color: '#a855f7' },
        { name: 'Automation/CRM', color: '#f59e0b' },
        { name: 'Project Management', color: '#22c55e' },
      ],
      steps: [
        { key: 'start', title: 'Start', type: 'start_event', lane: 'Client' },
        { key: 'request_intake', title: 'Request Intake', type: 'user_task', lane: 'Business Development', isManual: true, slaHours: 24 },
        { key: 'crm_capture', title: 'CRM Lead Capture', type: 'service_task', lane: 'Automation/CRM', automationAction: 'capture_lead', slaHours: 1 },
        { key: 'requirements_review', title: 'Requirements Review', type: 'user_task', lane: 'Business Development', isManual: true, slaHours: 72 },
        { key: 'feasibility_check', title: 'Feasibility Assessment', type: 'gateway', lane: 'Business Development' },
        { key: 'proposal_creation', title: 'Proposal Creation', type: 'user_task', lane: 'Business Development', isManual: true, slaHours: 120 },
        { key: 'client_review', title: 'Client Review', type: 'user_task', lane: 'Client', isManual: true, slaHours: 168 },
        { key: 'approval_gateway', title: 'Approval Decision', type: 'gateway', lane: 'Client' },
        { key: 'contract_signing', title: 'Contract Signing', type: 'user_task', lane: 'Business Development', isManual: true, slaHours: 48 },
        { key: 'project_setup', title: 'Project Setup', type: 'user_task', lane: 'Project Management', isManual: true, slaHours: 24 },
        { key: 'create_project', title: 'Create Project Record', type: 'service_task', lane: 'Automation/CRM', automationAction: 'create_project', slaHours: 1 },
        { key: 'kickoff', title: 'Project Kickoff', type: 'user_task', lane: 'Project Management', isManual: true, slaHours: 72 },
        { key: 'development', title: 'Development Phase', type: 'user_task', lane: 'Project Management', isManual: true, slaHours: 720 },
        { key: 'qa_testing', title: 'QA & Testing', type: 'user_task', lane: 'Project Management', isManual: true, slaHours: 120 },
        { key: 'client_uat', title: 'Client UAT', type: 'user_task', lane: 'Client', isManual: true, slaHours: 168 },
        { key: 'delivery', title: 'Final Delivery', type: 'user_task', lane: 'Project Management', isManual: true, slaHours: 48 },
        { key: 'send_invoice', title: 'Send Invoice', type: 'service_task', lane: 'Automation/CRM', automationAction: 'generate_invoice', slaHours: 24 },
        { key: 'end', title: 'End', type: 'end_event', lane: 'Project Management' },
      ],
      transitions: [
        { from: 'start', to: 'request_intake' },
        { from: 'request_intake', to: 'crm_capture' },
        { from: 'crm_capture', to: 'requirements_review' },
        { from: 'requirements_review', to: 'feasibility_check' },
        { from: 'feasibility_check', to: 'proposal_creation', condition: 'feasible' },
        { from: 'proposal_creation', to: 'client_review' },
        { from: 'client_review', to: 'approval_gateway' },
        { from: 'approval_gateway', to: 'contract_signing', condition: 'approved' },
        { from: 'contract_signing', to: 'project_setup' },
        { from: 'project_setup', to: 'create_project' },
        { from: 'create_project', to: 'kickoff' },
        { from: 'kickoff', to: 'development' },
        { from: 'development', to: 'qa_testing' },
        { from: 'qa_testing', to: 'client_uat' },
        { from: 'client_uat', to: 'delivery' },
        { from: 'delivery', to: 'send_invoice' },
        { from: 'send_invoice', to: 'end' },
      ],
    }),
    createdAt: now,
  };
  await db.insert(schema.processDefinitions).values(processDefinition);
  console.log(`  ✓ Created process definition`);

  // ========== 6. CREATE PROCESS INSTANCES ==========
  console.log('Creating process instances...');
  const processInstancesData = projects.map((project, i) => {
    const stepKeys = ['request_intake', 'requirements_review', 'proposal_creation', 'contract_signing', 'project_setup', 'kickoff', 'development', 'qa_testing', 'client_uat', 'delivery'];
    let currentStep = 'development';
    let status: 'running' | 'completed' | 'canceled' = 'running';
    
    if (project.status === 'delivered') {
      currentStep = 'end';
      status = 'completed';
    } else if (project.status === 'new') {
      currentStep = 'project_setup';
    } else if (project.status === 'in_qa') {
      currentStep = 'qa_testing';
    } else if (project.status === 'blocked') {
      currentStep = 'development';
    } else if (project.status === 'on_hold') {
      status = 'canceled';
    }
    
    return {
      id: generateId(),
      processDefinitionId: processDefinition.id,
      projectId: project.id,
      leadId: i < leads.length ? leads[i % leads.length].id : null,
      status,
      currentStepKey: currentStep,
      startedAt: project.startAt,
      endedAt: status === 'completed' ? new Date(now.getTime() - randomInt(5, 30) * 24 * 60 * 60 * 1000) : null,
    };
  });
  await db.insert(schema.processInstances).values(processInstancesData);
  console.log(`  ✓ Created ${processInstancesData.length} process instances`);

  // ========== 7. CREATE STEP INSTANCES (for analytics) ==========
  console.log('Creating business process step instances...');
  const stepInstancesData: any[] = [];
  const stepKeys = ['request_intake', 'crm_capture', 'requirements_review', 'proposal_creation', 'contract_signing', 'project_setup', 'create_project', 'kickoff', 'development', 'qa_testing', 'client_uat', 'delivery'];
  
  processInstancesData.forEach((instance, idx) => {
    const project = projects[idx];
    let completedSteps: string[] = [];
    
    // Determine which steps are completed based on current step
    const currentIdx = stepKeys.indexOf(instance.currentStepKey);
    if (currentIdx > 0 || instance.status === 'completed') {
      completedSteps = instance.status === 'completed' ? stepKeys : stepKeys.slice(0, currentIdx);
    }
    
    completedSteps.forEach((stepKey, stepIdx) => {
      const startDate = new Date(project.startAt!.getTime() + stepIdx * randomInt(1, 5) * 24 * 60 * 60 * 1000);
      const duration = randomInt(2, 48) * 60 * 60 * 1000; // 2-48 hours
      
      stepInstancesData.push({
        id: generateId(),
        processInstanceId: instance.id,
        stepKey,
        status: 'completed',
        startedAt: startDate,
        completedAt: new Date(startDate.getTime() + duration),
        assignedToUserId: randomFromArray(users).id,
        completedByUserId: randomFromArray(users).id,
        createdAt: startDate,
      });
    });
    
    // Add current active step if running
    if (instance.status === 'running' && instance.currentStepKey !== 'end') {
      stepInstancesData.push({
        id: generateId(),
        processInstanceId: instance.id,
        stepKey: instance.currentStepKey,
        status: 'active',
        startedAt: new Date(now.getTime() - randomInt(1, 10) * 24 * 60 * 60 * 1000),
        assignedToUserId: randomFromArray(users).id,
        createdAt: now,
      });
    }
  });
  
  if (stepInstancesData.length > 0) {
    await db.insert(schema.businessProcessStepInstances).values(stepInstancesData);
  }
  console.log(`  ✓ Created ${stepInstancesData.length} step instances`);

  // ========== 8. CREATE TASKS (Various states) ==========
  console.log('Creating tasks...');
  const taskStatuses = ['todo', 'in_progress', 'in_review', 'blocked', 'done', 'canceled'] as const;
  const taskTemplates = [
    'Setup development environment',
    'Implement user authentication',
    'Design database schema',
    'Build REST API endpoints',
    'Create frontend components',
    'Integrate payment gateway',
    'Write unit tests',
    'Performance optimization',
    'Security audit',
    'Documentation',
    'Deploy to staging',
    'Client demo preparation',
    'Bug fixes from QA',
    'Mobile responsiveness',
    'Analytics integration',
    'Email notification system',
    'Admin dashboard',
    'User settings page',
    'Search functionality',
    'Report generation',
  ];
  
  const tasksData: any[] = [];
  const devUsers = users.filter(u => u.role === 'dev');
  const qaUsers = users.filter(u => u.role === 'qa');
  
  projects.forEach((project, pIdx) => {
    const numTasks = randomInt(8, 20);
    const instance = processInstancesData[pIdx];
    
    for (let i = 0; i < numTasks; i++) {
      const status = randomFromArray(taskStatuses);
      const dueOffset = randomInt(-10, 30); // Some overdue, some upcoming
      const createdDays = randomInt(30, 90);
      
      tasksData.push({
        id: generateId(),
        instanceId: instance.id,
        projectId: project.id,
        key: `task-${pIdx}-${i}`,
        title: randomFromArray(taskTemplates),
        description: `Task for ${project.name}: ${randomFromArray(['Critical feature', 'Enhancement', 'Bug fix', 'Technical debt', 'Client request'])}`,
        priority: randomFromArray(priorities),
        status,
        assignedToUserId: randomFromArray([...devUsers, ...qaUsers]).id,
        dueAt: new Date(now.getTime() + dueOffset * 24 * 60 * 60 * 1000),
        completedAt: status === 'done' ? new Date(now.getTime() - randomInt(1, 30) * 24 * 60 * 60 * 1000) : null,
        estimatedMinutes: randomInt(60, 480),
        actualMinutes: status === 'done' ? randomInt(60, 600) : null,
        createdAt: new Date(now.getTime() - createdDays * 24 * 60 * 60 * 1000),
        updatedAt: now,
      });
    }
  });
  await db.insert(schema.tasks).values(tasksData);
  console.log(`  ✓ Created ${tasksData.length} tasks`);

  // ========== 9. CREATE MILESTONES ==========
  console.log('Creating milestones...');
  const milestoneTemplates = ['Alpha Release', 'Beta Release', 'Production Launch', 'Phase 1 Complete', 'Phase 2 Complete', 'MVP Delivery', 'Client Demo', 'Final Review'];
  const milestonesData: any[] = [];
  
  projects.forEach(project => {
    const numMilestones = randomInt(2, 4);
    for (let i = 0; i < numMilestones; i++) {
      const dueOffset = randomInt(7, 90);
      const status = randomFromArray(['pending', 'completed', 'canceled'] as const);
      
      milestonesData.push({
        id: generateId(),
        projectId: project.id,
        title: milestoneTemplates[i % milestoneTemplates.length],
        description: `Milestone for ${project.name}`,
        dueAt: new Date(now.getTime() + dueOffset * 24 * 60 * 60 * 1000),
        status,
        sortOrder: i + 1,
        createdAt: randomDate(60),
      });
    }
  });
  await db.insert(schema.milestones).values(milestonesData);
  console.log(`  ✓ Created ${milestonesData.length} milestones`);

  // ========== 10. CREATE CLIENT CONTACTS ==========
  console.log('Creating client contacts...');
  const roles = ['CEO', 'CTO', 'Product Owner', 'Project Manager', 'Technical Lead', 'Designer'];
  const contactsData: any[] = [];
  
  clients.forEach(client => {
    const numContacts = randomInt(1, 3);
    for (let i = 0; i < numContacts; i++) {
      contactsData.push({
        id: generateId(),
        clientId: client.id,
        name: `${randomFromArray(['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emma'])} ${randomFromArray(['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'])}`,
        email: `contact${i}@${client.company.toLowerCase().replace(/\s/g, '')}.com`,
        phone: `+1-555-${String(randomInt(1000, 9999))}`,
        role: randomFromArray(roles),
        isPrimary: i === 0 ? 1 : 0,
        createdAt: now,
        updatedAt: now,
      });
    }
  });
  await db.insert(schema.clientContacts).values(contactsData);
  console.log(`  ✓ Created ${contactsData.length} client contacts`);

  // ========== 11. CREATE PROPOSALS ==========
  console.log('Creating proposals...');
  const proposalsData: any[] = [];
  const proposalItemsData: any[] = [];
  
  leads.slice(0, 10).forEach(lead => {
    const proposalId = generateId();
    const totalAmount = randomInt(3, 15) * 1000000; // $30k - $150k
    
    proposalsData.push({
      id: proposalId,
      leadId: lead.id,
      clientId: randomFromArray(clients).id,
      title: `${lead.company} - Project Proposal`,
      summary: `Custom ${randomFromArray(services).toLowerCase()} solution`,
      scope: 'Full design, development, testing, and deployment',
      timeline: `${randomInt(2, 6)} months`,
      costModel: randomFromArray(['fixed', 'hourly', 'milestone']),
      totalAmount,
      currency: 'USD',
      validUntil: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      status: randomFromArray(['draft', 'sent', 'accepted', 'rejected']),
      createdByUserId: randomFromArray([users[1].id, users[2].id]),
      createdAt: randomDate(60),
      updatedAt: now,
    });
    
    // Add proposal items
    const itemCount = randomInt(2, 5);
    for (let i = 0; i < itemCount; i++) {
      proposalItemsData.push({
        id: generateId(),
        proposalId,
        description: randomFromArray(['Frontend Development', 'Backend Development', 'UI/UX Design', 'QA Testing', 'Project Management', 'DevOps Setup']),
        quantity: 1,
        unitPrice: Math.floor(totalAmount / itemCount),
        sortOrder: i,
      });
    }
  });
  await db.insert(schema.proposals).values(proposalsData);
  await db.insert(schema.proposalItems).values(proposalItemsData);
  console.log(`  ✓ Created ${proposalsData.length} proposals`);

  // ========== 12. CREATE INVOICES ==========
  console.log('Creating invoices...');
  const invoicesData: any[] = [];
  const invoiceItemsData: any[] = [];
  const paymentsData: any[] = [];
  
  let invoiceNum = 1001;
  projects.slice(0, 10).forEach(project => {
    const invoiceId = generateId();
    const subtotal = randomInt(1, 5) * 1000000; // $10k - $50k
    const taxAmount = Math.floor(subtotal * 0.1); // 10% tax
    const totalAmount = subtotal + taxAmount;
    const status = randomFromArray(['draft', 'sent', 'paid', 'overdue', 'canceled'] as const);
    
    invoicesData.push({
      id: invoiceId,
      invoiceNumber: `INV-${invoiceNum++}`,
      projectId: project.id,
      clientId: project.clientId,
      title: `Invoice - ${project.name}`,
      subtotal,
      taxAmount,
      totalAmount,
      currency: 'USD',
      dueAt: new Date(now.getTime() + randomInt(-15, 30) * 24 * 60 * 60 * 1000),
      paidAt: status === 'paid' ? new Date(now.getTime() - randomInt(1, 15) * 24 * 60 * 60 * 1000) : null,
      status,
      createdAt: randomDate(60),
      updatedAt: now,
    });
    
    invoiceItemsData.push({
      id: generateId(),
      invoiceId,
      description: randomFromArray(['Development Services', 'Design Services', 'Consulting Hours', 'Monthly Retainer']),
      quantity: 1,
      unitPrice: totalAmount,
      amount: totalAmount,
      sortOrder: 0,
    });
    
    // Add payment if paid
    if (status === 'paid') {
      paymentsData.push({
        id: generateId(),
        invoiceId,
        amount: totalAmount,
        method: randomFromArray(['bank_transfer', 'credit_card', 'check', 'wire']),
        reference: `PAY-${randomInt(10000, 99999)}`,
        paidAt: new Date(now.getTime() - randomInt(1, 30) * 24 * 60 * 60 * 1000),
        createdAt: now,
      });
    }
  });
  await db.insert(schema.invoices).values(invoicesData);
  await db.insert(schema.invoiceItems).values(invoiceItemsData);
  if (paymentsData.length > 0) {
    await db.insert(schema.payments).values(paymentsData);
  }
  console.log(`  ✓ Created ${invoicesData.length} invoices`);

  // ========== 13. CREATE BUGS ==========
  console.log('Creating bugs...');
  const bugTitles = [
    'Login button unresponsive on mobile',
    'Payment processing timeout',
    'Dashboard charts not loading',
    'Search returns incorrect results',
    'Email notifications delayed',
    'File upload fails for large files',
    'Session expires too quickly',
    'Dark mode text visibility issue',
    'API rate limiting not working',
    'Cache invalidation problem',
  ];
  const bugsData: any[] = [];
  
  projects.slice(0, 8).forEach(project => {
    const numBugs = randomInt(1, 4);
    for (let i = 0; i < numBugs; i++) {
      bugsData.push({
        id: generateId(),
        projectId: project.id,
        title: randomFromArray(bugTitles),
        description: 'Detailed bug description with reproduction steps.',
        stepsToReproduce: '1. Navigate to feature\n2. Perform action\n3. Observe unexpected behavior',
        severity: randomFromArray(['critical', 'high', 'medium', 'low']),
        status: randomFromArray(['open', 'in_progress', 'resolved', 'closed', 'wont_fix']),
        reportedByUserId: randomFromArray(qaUsers).id,
        assignedToUserId: randomFromArray(devUsers).id,
        createdAt: randomDate(30),
        updatedAt: now,
      });
    }
  });
  await db.insert(schema.bugs).values(bugsData);
  console.log(`  ✓ Created ${bugsData.length} bugs`);

  // ========== 14. CREATE TIME ENTRIES ==========
  console.log('Creating time entries...');
  const timeEntriesData: any[] = [];
  
  tasksData.filter(t => t.status === 'done' || t.status === 'in_progress').slice(0, 50).forEach(task => {
    const numEntries = randomInt(1, 4);
    for (let i = 0; i < numEntries; i++) {
      timeEntriesData.push({
        id: generateId(),
        taskId: task.id,
        projectId: task.projectId,
        userId: task.assignedToUserId,
        description: `Work on ${task.title}`,
        minutes: randomInt(30, 240),
        durationMinutes: randomInt(30, 240),
        date: randomDate(14, 0),
        billable: randomInt(0, 1),
        createdAt: now,
        updatedAt: now,
      });
    }
  });
  await db.insert(schema.timeEntries).values(timeEntriesData);
  console.log(`  ✓ Created ${timeEntriesData.length} time entries`);

  // ========== 15. CREATE MEETINGS ==========
  console.log('Creating meetings...');
  const meetingTitles = ['Sprint Planning', 'Daily Standup', 'Sprint Review', 'Client Demo', 'Technical Discussion', 'Architecture Review', 'Design Review', 'Kickoff Meeting'];
  const meetingTypes = ['discovery', 'kickoff', 'sprint_planning', 'standup', 'review', 'retrospective', 'client_call', 'internal'] as const;
  const meetingsData: any[] = [];
  
  projects.slice(0, 8).forEach(project => {
    const numMeetings = randomInt(2, 5);
    for (let i = 0; i < numMeetings; i++) {
      const startAt = new Date(now.getTime() + randomInt(-7, 14) * 24 * 60 * 60 * 1000);
      const durationMinutes = randomFromArray([30, 45, 60, 90]);
      const endAt = new Date(startAt.getTime() + durationMinutes * 60 * 1000);
      
      meetingsData.push({
        id: generateId(),
        projectId: project.id,
        title: randomFromArray(meetingTitles),
        description: 'Discuss project progress and next steps.',
        meetingType: randomFromArray(meetingTypes),
        meetingUrl: `https://meet.google.com/${generateId().slice(0, 10)}`,
        startAt,
        endAt,
        organizerUserId: randomFromArray([users[1].id, users[2].id]),
        status: 'scheduled' as const,
        createdAt: now,
        updatedAt: now,
      });
    }
  });
  await db.insert(schema.meetings).values(meetingsData);
  console.log(`  ✓ Created ${meetingsData.length} meetings`);

  // ========== 16. CREATE AUTOMATIONS ==========
  console.log('Creating automation records...');
  const automationsData: any[] = [];
  const automationActions = ['capture_lead', 'create_project', 'send_notification', 'generate_invoice', 'update_crm', 'run-ci'];
  
  processInstancesData.forEach(instance => {
    const numAutomations = randomInt(1, 4);
    for (let i = 0; i < numAutomations; i++) {
      const status = randomFromArray(['completed', 'completed', 'completed', 'failed'] as const);
      automationsData.push({
        id: generateId(),
        processInstanceId: instance.id,
        stepKey: randomFromArray(stepKeys),
        automationAction: randomFromArray(automationActions),
        status,
        startedAt: randomDate(30, 0),
        completedAt: new Date(now.getTime() - randomInt(1, 24) * 60 * 60 * 1000),
        resultData: JSON.stringify({ success: status === 'completed' }),
        errorMessage: status === 'failed' ? 'Automation failed due to timeout' : null,
        retryCount: status === 'failed' ? randomInt(1, 3) : 0,
      });
    }
  });
  await db.insert(schema.businessProcessAutomations).values(automationsData);
  console.log(`  ✓ Created ${automationsData.length} automation records`);

  // ========== 17. CREATE NOTES ==========
  console.log('Creating notes...');
  const leadNotesData: any[] = [];
  const projectNotesData: any[] = [];
  
  leads.forEach(lead => {
    leadNotesData.push({
      id: generateId(),
      leadId: lead.id,
      authorUserId: randomFromArray(users).id,
      content: `Initial contact with ${lead.name}. ${randomFromArray(['Very interested', 'Needs follow-up', 'Budget discussion pending', 'Technical requirements gathered'])}`,
      createdAt: randomDate(30),
    });
  });
  
  projects.forEach(project => {
    const numNotes = randomInt(1, 3);
    for (let i = 0; i < numNotes; i++) {
      projectNotesData.push({
        id: generateId(),
        projectId: project.id,
        authorUserId: randomFromArray(users).id,
        content: randomFromArray([
          'Weekly progress update: On track for milestone.',
          'Client requested scope change - needs review.',
          'Technical blocker resolved, resuming development.',
          'Sprint completed successfully.',
          'QA feedback addressed, ready for review.',
        ]),
        createdAt: randomDate(14),
      });
    }
  });
  
  await db.insert(schema.leadNotes).values(leadNotesData);
  await db.insert(schema.projectNotes).values(projectNotesData);
  console.log(`  ✓ Created ${leadNotesData.length} lead notes and ${projectNotesData.length} project notes`);

  // ========== 18. CREATE ATTACHMENTS ==========
  console.log('Creating attachments...');
  const attachmentsData: any[] = [];
  const fileTypes = [
    { name: 'requirements.pdf', mime: 'application/pdf' },
    { name: 'design-mockup.figma', mime: 'application/figma' },
    { name: 'architecture.png', mime: 'image/png' },
    { name: 'contract.pdf', mime: 'application/pdf' },
    { name: 'meeting-notes.md', mime: 'text/markdown' },
  ];
  
  projects.forEach(project => {
    const numAttachments = randomInt(1, 3);
    for (let i = 0; i < numAttachments; i++) {
      const file = randomFromArray(fileTypes);
      attachmentsData.push({
        id: generateId(),
        entityType: 'project',
        entityId: project.id,
        filename: file.name,
        url: `https://assets.megicode.com/${project.id}/${file.name}`,
        mimeType: file.mime,
        sizeBytes: randomInt(10000, 5000000),
        uploadedByUserId: randomFromArray(users).id,
        createdAt: randomDate(60),
      });
    }
  });
  await db.insert(schema.attachments).values(attachmentsData);
  console.log(`  ✓ Created ${attachmentsData.length} attachments`);

  console.log('\n✅ COMPREHENSIVE database seeding completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - ${users.length} users (team members)`);
  console.log(`   - ${clients.length} clients`);
  console.log(`   - ${leads.length} leads (various stages)`);
  console.log(`   - ${projects.length} projects (various statuses)`);
  console.log(`   - ${processInstancesData.length} workflow instances`);
  console.log(`   - ${stepInstancesData.length} workflow step instances`);
  console.log(`   - ${tasksData.length} tasks`);
  console.log(`   - ${milestonesData.length} milestones`);
  console.log(`   - ${proposalsData.length} proposals`);
  console.log(`   - ${invoicesData.length} invoices`);
  console.log(`   - ${bugsData.length} bugs`);
  console.log(`   - ${timeEntriesData.length} time entries`);
  console.log(`   - ${meetingsData.length} meetings`);
  console.log(`   - ${automationsData.length} automation records`);
  console.log('\n🔐 Sample accounts:');
  console.log('   - admin@megicode.com (admin)');
  console.log('   - pm@megicode.com (project manager)');
  console.log('   - dev1@megicode.com (developer)');
  console.log('   - qa1@megicode.com (qa engineer)\n');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exitCode = 1;
});
