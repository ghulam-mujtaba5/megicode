
import { Resend } from 'resend';

// Initialize Resend with API key (or mock if missing)
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

export const EmailService = {
  async sendWelcomePacket(to: string, clientName: string) {
    if (!resend) {
      console.log(`[Mock Email] Sending Welcome Packet to ${to}`);
      return { success: true, id: 'mock_email_id' };
    }

    try {
      const data = await resend.emails.send({
        from: 'Megicode <onboarding@megicode.com>',
        to: [to],
        subject: 'Welcome to Megicode! 🚀',
        html: `
          <h1>Welcome, ${clientName}!</h1>
          <p>We are thrilled to start this journey with you.</p>
          <p>You can access your client portal here: <a href="https://www.megicode.com/internal/login">Client Portal</a></p>
        `,
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  },

  async sendInvoice(to: string, invoiceId: string, amount: number) {
    console.log(`[Mock Email] Sending Invoice ${invoiceId} for $${amount} to ${to}`);
    return { success: true };
  }
};
