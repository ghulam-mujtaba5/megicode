/**
 * Onboarding Automation API
 * 
 * POST /api/internal/onboarding/automate
 * 
 * Executes automated onboarding actions:
 * - Send welcome email
 * - Share onboarding documentation
 * - Generate project summary
 * - Create project workspace
 * - Trigger kickoff meeting scheduling
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { eq } from 'drizzle-orm';
import nodemailer from 'nodemailer';

import { authOptions } from '@/auth';
import { getDb } from '@/lib/db';
import { leads, clients, projects, events, processInstances, users } from '@/lib/db/schema';

// Email transporter (Zoho SMTP)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_USER,
      pass: process.env.ZOHO_PASS,
    },
  });
};

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();

  try {
    const body = await request.json();
    const { action, leadId, clientId, projectId, processInstanceId, data } = body;

    const now = new Date();
    let result: any = { success: true };

    switch (action) {
      case 'send_welcome_email': {
        // Get client/lead information
        let recipient: { name: string; email: string } | null = null;

        if (clientId) {
          const client = await db.select().from(clients).where(eq(clients.id, clientId)).get();
          if (client && client.billingEmail) {
            recipient = { name: client.name, email: client.billingEmail };
          }
        }

        if (!recipient && leadId) {
          const lead = await db.select().from(leads).where(eq(leads.id, leadId)).get();
          if (lead && lead.email) {
            recipient = { name: lead.name, email: lead.email };
          }
        }

        if (!recipient) {
          return NextResponse.json(
            { error: 'No recipient email found' },
            { status: 400 }
          );
        }

        // Send welcome email
        const welcomeHtml = generateWelcomeEmail(recipient.name, data?.projectName);

        if (process.env.ZOHO_USER && process.env.ZOHO_PASS) {
          const transporter = createTransporter();
          await transporter.sendMail({
            from: `"Megicode Team" <${process.env.ZOHO_USER}>`,
            to: recipient.email,
            subject: 'Welcome to Megicode! 🎉 Your Project Journey Begins',
            html: welcomeHtml,
          });
        }

        // Log event
        await db.insert(events).values({
          id: crypto.randomUUID(),
          leadId: leadId || null,
          projectId: projectId || null,
          instanceId: processInstanceId || null,
          type: 'email.welcome_sent',
          actorUserId: session.user.id,
          payloadJson: {
            to: recipient.email,
            sentAt: now,
            projectName: data?.projectName,
          },
          createdAt: now,
        });

        result = { success: true, emailSent: true, recipient: recipient.email };
        break;
      }

      case 'share_onboarding_docs': {
        // Generate onboarding documentation links
        const docsLinks = {
          projectGuidelines: `/docs/project-guidelines`,
          communicationChannels: `/docs/communication-channels`,
          developmentProcess: `/docs/development-process`,
          escalationProcedures: `/docs/escalation-procedures`,
        };

        // Get recipient email
        let recipientEmail = null;
        if (clientId) {
          const client = await db.select().from(clients).where(eq(clients.id, clientId)).get();
          recipientEmail = client?.billingEmail;
        } else if (leadId) {
          const lead = await db.select().from(leads).where(eq(leads.id, leadId)).get();
          recipientEmail = lead?.email;
        }

        // Send documentation email
        if (recipientEmail && process.env.ZOHO_USER && process.env.ZOHO_PASS) {
          const transporter = createTransporter();
          await transporter.sendMail({
            from: `"Megicode Team" <${process.env.ZOHO_USER}>`,
            to: recipientEmail,
            subject: 'Your Megicode Project Documentation',
            html: generateDocsEmail(data?.projectName, docsLinks),
          });
        }

        // Log event
        await db.insert(events).values({
          id: crypto.randomUUID(),
          leadId: leadId || null,
          projectId: projectId || null,
          instanceId: processInstanceId || null,
          type: 'onboarding.docs_shared',
          actorUserId: session.user.id,
          payloadJson: {
            sharedAt: now,
            docs: Object.keys(docsLinks),
          },
          createdAt: now,
        });

        result = { success: true, docsShared: true, docs: docsLinks };
        break;
      }

      case 'generate_project_summary': {
        // Generate project summary from lead/project data
        let projectData = null;
        let leadData = null;

        if (projectId) {
          projectData = await db.select().from(projects).where(eq(projects.id, projectId)).get();
        }
        if (leadId) {
          leadData = await db.select().from(leads).where(eq(leads.id, leadId)).get();
        }

        const summary = {
          projectName: projectData?.name || leadData?.name || 'New Project',
          description: projectData?.description || leadData?.message || '',
          requirements: leadData?.functionalRequirements || [],
          nonFunctionalRequirements: leadData?.nonFunctionalRequirements || [],
          targetPlatforms: leadData?.targetPlatforms || '',
          techPreferences: leadData?.techPreferences || '',
          estimatedBudget: leadData?.estimatedBudget ? leadData.estimatedBudget / 100 : null,
          estimatedHours: leadData?.estimatedHours || null,
          srsUrl: leadData?.srsUrl || null,
          generatedAt: now,
        };

        // Log event
        await db.insert(events).values({
          id: crypto.randomUUID(),
          leadId: leadId || null,
          projectId: projectId || null,
          instanceId: processInstanceId || null,
          type: 'onboarding.summary_generated',
          actorUserId: session.user.id,
          payloadJson: summary,
          createdAt: now,
        });

        result = { success: true, summary };
        break;
      }

      case 'create_project_workspace': {
        // Create project from lead if not exists
        let project = projectId 
          ? await db.select().from(projects).where(eq(projects.id, projectId)).get()
          : null;

        if (!project && leadId) {
          const lead = await db.select().from(leads).where(eq(leads.id, leadId)).get();
          if (lead) {
            const newProjectId = crypto.randomUUID();
            await db.insert(projects).values({
              id: newProjectId,
              leadId: leadId,
              clientId: clientId || null,
              name: data?.projectName || `Project for ${lead.name}`,
              description: lead.message || '',
              status: 'new',
              priority: 'high',
              wikiUrl: lead.srsUrl || null,
              createdAt: now,
              updatedAt: now,
            });

            // Update process instance with project ID
            if (processInstanceId) {
              await db
                .update(processInstances)
                .set({ projectId: newProjectId })
                .where(eq(processInstances.id, processInstanceId));
            }

            project = await db.select().from(projects).where(eq(projects.id, newProjectId)).get();
          }
        }

        if (!project) {
          return NextResponse.json(
            { error: 'Could not create project workspace' },
            { status: 400 }
          );
        }

        // Log event
        await db.insert(events).values({
          id: crypto.randomUUID(),
          projectId: project.id,
          instanceId: processInstanceId || null,
          type: 'project.workspace_created',
          actorUserId: session.user.id,
          payloadJson: {
            projectId: project.id,
            projectName: project.name,
            createdAt: now,
          },
          createdAt: now,
        });

        result = {
          success: true,
          project: {
            id: project.id,
            name: project.name,
            status: project.status,
          },
        };
        break;
      }

      case 'assign_team': {
        if (!projectId) {
          return NextResponse.json(
            { error: 'Project ID required for team assignment' },
            { status: 400 }
          );
        }

        const teamMemberIds = data?.teamMemberIds || [];

        // Log team assignment event
        await db.insert(events).values({
          id: crypto.randomUUID(),
          projectId,
          instanceId: processInstanceId || null,
          type: 'project.team_assigned',
          actorUserId: session.user.id,
          payloadJson: {
            teamMemberIds,
            assignedAt: now,
          },
          createdAt: now,
        });

        result = { success: true, teamAssigned: true, memberCount: teamMemberIds.length };
        break;
      }

      case 'schedule_kickoff': {
        if (!projectId) {
          return NextResponse.json(
            { error: 'Project ID required for kickoff scheduling' },
            { status: 400 }
          );
        }

        const kickoffDate = data?.kickoffDate ? new Date(data.kickoffDate) : null;

        // Log kickoff scheduling event
        await db.insert(events).values({
          id: crypto.randomUUID(),
          projectId,
          instanceId: processInstanceId || null,
          type: 'project.kickoff_scheduled',
          actorUserId: session.user.id,
          payloadJson: {
            scheduledFor: kickoffDate,
            scheduledAt: now,
          },
          createdAt: now,
        });

        result = { success: true, kickoffScheduled: true, date: kickoffDate };
        break;
      }

      case 'send_followup_email': {
        // Get lead information
        if (!leadId) {
          return NextResponse.json(
            { error: 'Lead ID required for follow-up email' },
            { status: 400 }
          );
        }

        const lead = await db.select().from(leads).where(eq(leads.id, leadId)).get();
        if (!lead || !lead.email) {
          return NextResponse.json(
            { error: 'Lead email not found' },
            { status: 400 }
          );
        }

        // Send follow-up email
        const followUpHtml = generateFollowUpEmail(lead.name, lead.company || '');

        if (process.env.ZOHO_USER && process.env.ZOHO_PASS) {
          const transporter = createTransporter();
          await transporter.sendMail({
            from: `"Megicode Team" <${process.env.ZOHO_USER}>`,
            to: lead.email,
            subject: 'Thank You for Your Interest in Megicode',
            html: followUpHtml,
          });
        }

        // Log event
        await db.insert(events).values({
          id: crypto.randomUUID(),
          leadId,
          instanceId: processInstanceId || null,
          type: 'email.followup_sent',
          actorUserId: session.user.id,
          payloadJson: {
            to: lead.email,
            sentAt: now,
          },
          createdAt: now,
        });

        result = { success: true, emailSent: true, recipient: lead.email };
        break;
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error executing onboarding automation:', error);
    return NextResponse.json(
      { error: 'Failed to execute automation' },
      { status: 500 }
    );
  }
}

// Email template generators
function generateWelcomeEmail(name: string, projectName?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Megicode</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;background:#f4f4f5">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px">
    <div style="background:#fff;border-radius:12px;padding:40px;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
      <div style="text-align:center;margin-bottom:32px">
        <h1 style="color:#18181b;margin:0 0 8px">Welcome to Megicode! 🎉</h1>
        <p style="color:#71717a;margin:0">We're excited to start working with you</p>
      </div>
      
      <p style="color:#3f3f46;line-height:1.6">
        Dear ${name},
      </p>
      
      <p style="color:#3f3f46;line-height:1.6">
        Thank you for choosing Megicode for your ${projectName || 'software'} project. We're thrilled to have you on board and look forward to bringing your vision to life.
      </p>
      
      <div style="background:#f4f4f5;border-radius:8px;padding:24px;margin:24px 0">
        <h3 style="color:#18181b;margin:0 0 16px">What happens next?</h3>
        <ul style="color:#3f3f46;margin:0;padding-left:20px;line-height:1.8">
          <li>You'll receive onboarding documentation shortly</li>
          <li>Our project manager will schedule a kickoff meeting</li>
          <li>We'll set up your project workspace and communication channels</li>
          <li>Development will begin according to our agreed timeline</li>
        </ul>
      </div>
      
      <p style="color:#3f3f46;line-height:1.6">
        If you have any questions in the meantime, don't hesitate to reach out. We're here to help!
      </p>
      
      <p style="color:#3f3f46;line-height:1.6">
        Best regards,<br>
        <strong>The Megicode Team</strong>
      </p>
    </div>
    
    <div style="text-align:center;padding:24px;color:#a1a1aa;font-size:14px">
      <p style="margin:0">© ${new Date().getFullYear()} Megicode. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function generateDocsEmail(projectName: string | undefined, docs: Record<string, string>): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Project Documentation</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f4f4f5">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px">
    <div style="background:#fff;border-radius:12px;padding:40px;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
      <h1 style="color:#18181b;margin:0 0 24px">Your Project Documentation</h1>
      
      <p style="color:#3f3f46;line-height:1.6">
        Here are the essential documents to help you get started with your ${projectName || 'project'}:
      </p>
      
      <div style="margin:24px 0">
        ${Object.entries(docs).map(([key, url]) => `
          <div style="background:#f4f4f5;border-radius:8px;padding:16px;margin:8px 0">
            <strong style="color:#18181b">${key.replace(/([A-Z])/g, ' $1').trim()}</strong>
          </div>
        `).join('')}
      </div>
      
      <p style="color:#71717a;font-size:14px">
        These documents will be available in your project workspace.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function generateFollowUpEmail(name: string, company: string): string {
  const companyText = company ? ` at ${company}` : '';
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Thank You for Your Interest</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f4f4f5">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px">
    <div style="background:#fff;border-radius:12px;padding:40px;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
      <h1 style="color:#18181b;margin:0 0 24px">Thank You for Reaching Out!</h1>
      
      <p style="color:#3f3f46;line-height:1.6">
        Hi ${name}${companyText},
      </p>
      
      <p style="color:#3f3f46;line-height:1.6">
        Thank you for your interest in Megicode! We received your inquiry and are excited to learn more about your project.
      </p>
      
      <p style="color:#3f3f46;line-height:1.6">
        Our team will review your requirements and get back to you within 24 hours to schedule a discovery call.
      </p>
      
      <div style="background:#f4f4f5;border-radius:8px;padding:24px;margin:24px 0">
        <h3 style="color:#18181b;margin:0 0 12px">In the meantime...</h3>
        <p style="color:#3f3f46;margin:0">
          Feel free to reply to this email if you have any additional information to share about your project.
        </p>
      </div>
      
      <p style="color:#3f3f46;line-height:1.6">
        Looking forward to speaking with you soon!
      </p>
      
      <p style="color:#3f3f46;line-height:1.6">
        Best regards,<br>
        <strong>The Megicode Team</strong>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
