import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  async sendWelcomeEmail(email: string, name: string) {
    if (!process.env.RESEND_API_KEY) {
      console.warn('Resend API Key not configured');
      return;
    }

    try {
      await resend.emails.send({
        from: 'Megicode <onboarding@megicode.com>',
        to: email,
        subject: 'Welcome to Megicode Portal',
        html: `
          <h1>Welcome, ${name}!</h1>
          <p>You have been granted access to the Megicode Internal Portal.</p>
          <p>Click <a href="${process.env.NEXT_PUBLIC_SITE_URL}/internal/login">here</a> to login.</p>
        `
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  }

  async sendTaskNotification(email: string, taskTitle: string, action: string) {
    if (!process.env.RESEND_API_KEY) return;

    try {
      await resend.emails.send({
        from: 'Megicode <notifications@megicode.com>',
        to: email,
        subject: `Task Update: ${taskTitle}`,
        html: `
          <h2>Task Update</h2>
          <p>The task <strong>${taskTitle}</strong> has been ${action}.</p>
          <p>View it <a href="${process.env.NEXT_PUBLIC_SITE_URL}/internal/tasks">here</a>.</p>
        `
      });
    } catch (error) {
      console.error('Failed to send task notification:', error);
    }
  }
}

export const emailService = new EmailService();
