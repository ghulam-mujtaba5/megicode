/**
 * Camunda Workers - Main Entry Point
 * Start all external task workers
 */

import { createWorker } from '@/lib/camunda';
import type { Task } from '@/lib/camunda/types';
import { db } from '@/lib/db';
import { leads, projects, clients, tasks } from '@/lib/db/schema';
import nodemailer from 'nodemailer';

// Configure Zoho SMTP
const transporter = nodemailer.createTransporter({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_USER,
    pass: process.env.ZOHO_PASS,
  },
});

/**
 * Worker: ServiceTask_CaptureRequest
 * Auto-capture lead record from contact form
 */
export function startCaptureRequestWorker() {
  return createWorker({
    taskType: 'ServiceTask_CaptureRequest',
    handler: async (job: Task) => {
      const variables = job.variables;

      const [lead] = await db
        .insert(leads)
        .values({
          name: variables.name,
          email: variables.email,
          company: variables.company || null,
          phone: variables.phone || null,
          service: variables.service || null,
          message: variables.message || null,
          source: variables.source || 'website',
          status: 'new',
        })
        .returning();

      console.log(`[Worker] Created lead record: ${lead.id}`);

      // Return lead ID to process
      await job.complete({ leadId: lead.id });
    },
  });
}

/**
 * Worker: ServiceTask_CreateProjectInstance
 * Initialize project and process instance
 */
export function startCreateProjectWorker() {
  return createWorker({
    taskType: 'ServiceTask_CreateProjectInstance',
    handler: async (job: Task) => {
      const variables = job.variables;

      const [project] = await db
        .insert(projects)
        .values({
          name: variables.name || `Project for ${variables.email}`,
          description: variables.description || variables.message,
          status: 'new',
          clientId: variables.clientId || null,
          techStack: variables.techStack || [],
          startDate: new Date(),
          budgetEstimate: variables.budgetEstimate || null,
          timelineEstimate: variables.timelineEstimate || null,
        })
        .returning();

      console.log(`[Worker] Created project: ${project.id}`);

      await job.complete({
        projectId: project.id,
        projectName: project.name,
      });
    },
  });
}

/**
 * Worker: ServiceTask_LinkClient
 * Find or create client record
 */
export function startLinkClientWorker() {
  return createWorker({
    taskType: 'ServiceTask_LinkClient',
    handler: async (job: Task) => {
      const variables = job.variables;

      // Try to find existing client by email
      const existing = await db.query.clients.findFirst({
        where: (clients, { eq }) => eq(clients.email, variables.email),
      });

      let clientId: string;

      if (existing) {
        clientId = existing.id;
        console.log(`[Worker] Found existing client: ${clientId}`);
      } else {
        const [newClient] = await db
          .insert(clients)
          .values({
            name: variables.name,
            email: variables.email,
            company: variables.company || null,
            phone: variables.phone || null,
            status: 'active',
          })
          .returning();

        clientId = newClient.id;
        console.log(`[Worker] Created new client: ${clientId}`);
      }

      // Update project with client ID
      if (variables.projectId) {
        await db
          .update(projects)
          .set({ clientId })
          .where((projects, { eq }) => eq(projects.id, variables.projectId));
      }

      await job.complete({ clientId });
    },
  });
}

/**
 * Worker: GenerateFollowUpEmail
 * Generate AI-powered follow-up email
 */
export function startGenerateEmailWorker() {
  return createWorker({
    taskType: 'GenerateFollowUpEmail',
    handler: async (job: Task) => {
      const variables = job.variables;

      // In production, integrate with OpenAI/Claude for AI-generated content
      const emailBody = `
Hi ${variables.name},

Thank you for reaching out to Megicode. We've received your inquiry about ${variables.service || 'our services'}.

${variables.message ? `You mentioned: "${variables.message}"` : ''}

We'd love to discuss how we can help bring your vision to life. Our team specializes in:
- Custom web & mobile application development
- AI-powered solutions
- Modern tech stack (React, Next.js, TypeScript, etc.)
- End-to-end project delivery

Would you be available for a quick discovery call this week?

Best regards,
The Megicode Team
      `.trim();

      console.log('[Worker] Generated follow-up email');

      await job.complete({
        emailSubject: `Re: Your inquiry about ${variables.service || 'Megicode services'}`,
        emailBody,
      });
    },
  });
}

/**
 * Worker: SendFollowUpEmail / SendWelcomeEmail / SendDeliveryEmail
 * Send email via Zoho SMTP
 */
export function startSendEmailWorker() {
  return createWorker({
    taskType: 'SendFollowUpEmail',
    handler: async (job: Task) => {
      const variables = job.variables;

      await transporter.sendMail({
        from: process.env.ZOHO_USER,
        to: variables.email || variables.to,
        subject: variables.emailSubject || variables.subject,
        text: variables.emailBody || variables.body,
      });

      console.log(`[Worker] Email sent to ${variables.email || variables.to}`);

      await job.complete({ emailSent: true });
    },
  });
}

/**
 * Worker: SendWelcomeEmail
 */
export function startSendWelcomeEmailWorker() {
  return createWorker({
    taskType: 'SendWelcomeEmail',
    handler: async (job: Task) => {
      const variables = job.variables;

      const emailBody = `
Hi ${variables.name},

Welcome to Megicode! 🎉

We're thrilled to have you as a client. Your project "${variables.projectName}" is now officially underway.

Here's what happens next:
1. We'll schedule a kickoff meeting to align on requirements
2. Our project manager will share the project timeline and milestones
3. You'll get access to our client portal for real-time updates

Need anything? Just reply to this email.

Best regards,
The Megicode Team
      `.trim();

      await transporter.sendMail({
        from: process.env.ZOHO_USER,
        to: variables.email,
        subject: `Welcome to Megicode! - ${variables.projectName}`,
        text: emailBody,
      });

      console.log(`[Worker] Welcome email sent to ${variables.email}`);

      await job.complete({ welcomeEmailSent: true });
    },
  });
}

/**
 * Worker: ServiceTask_SendDeliveryEmail
 */
export function startSendDeliveryEmailWorker() {
  return createWorker({
    taskType: 'ServiceTask_SendDeliveryEmail',
    handler: async (job: Task) => {
      const variables = job.variables;

      const emailBody = `
Hi ${variables.name},

Great news! Your project "${variables.projectName}" is now live and delivered. 🚀

Access your application here: ${variables.deploymentUrl || 'URL will be provided separately'}

What's included:
- Full source code repository access
- Documentation and deployment guides
- 30 days of post-launch support
- Maintenance and update options

We'd love your feedback! Please take a moment to share your experience.

Thank you for choosing Megicode!

Best regards,
The Megicode Team
      `.trim();

      await transporter.sendMail({
        from: process.env.ZOHO_USER,
        to: variables.email,
        subject: `🎉 Your Project is Live! - ${variables.projectName}`,
        text: emailBody,
      });

      console.log(`[Worker] Delivery email sent to ${variables.email}`);

      await job.complete({ deliveryEmailSent: true });
    },
  });
}

/**
 * Worker: ServiceTask_TrackMetrics
 * Update real-time metrics and KPIs
 */
export function startTrackMetricsWorker() {
  return createWorker({
    taskType: 'ServiceTask_TrackMetrics',
    handler: async (job: Task) => {
      const variables = job.variables;

      // Calculate metrics
      const totalTasks = await db.query.tasks.findMany({
        where: (tasks, { eq }) =>
          eq(tasks.projectId, variables.projectId),
      });

      const completedTasks = totalTasks.filter((t) => t.status === 'done');
      const overdueTasks = totalTasks.filter(
        (t) => t.dueDate && new Date(t.dueDate) < new Date()
      );

      const metrics = {
        totalTasks: totalTasks.length,
        completedTasks: completedTasks.length,
        completionPercentage:
          totalTasks.length > 0
            ? Math.round((completedTasks.length / totalTasks.length) * 100)
            : 0,
        overdueTasks: overdueTasks.length,
      };

      console.log('[Worker] Metrics calculated:', metrics);

      await job.complete({ metrics });
    },
  });
}

/**
 * Start all workers
 */
export function startAllWorkers() {
  console.log('[Workers] Starting all Camunda workers...');

  const workers = [
    startCaptureRequestWorker(),
    startCreateProjectWorker(),
    startLinkClientWorker(),
    startGenerateEmailWorker(),
    startSendEmailWorker(),
    startSendWelcomeEmailWorker(),
    startSendDeliveryEmailWorker(),
    startTrackMetricsWorker(),
  ];

  console.log(`[Workers] Started ${workers.length} workers`);

  return workers;
}
