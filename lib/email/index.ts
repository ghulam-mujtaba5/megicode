import nodemailer from 'nodemailer';
import { Resend } from 'resend';

export type EmailProvider = 'auto' | 'zoho' | 'resend';

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
  from?: string;
}

function getProvider(): EmailProvider {
  const raw = (process.env.EMAIL_PROVIDER ?? 'auto').toLowerCase();
  if (raw === 'zoho' || raw === 'resend' || raw === 'auto') return raw;
  return 'auto';
}

function resolveFrom(): string {
  return (
    process.env.EMAIL_FROM ||
    process.env.FROM_EMAIL ||
    process.env.ZOHO_USER ||
    ''
  );
}

async function sendWithZoho(params: SendEmailParams) {
  const zohoUser = process.env.ZOHO_USER;
  const zohoPass = process.env.ZOHO_PASS;
  if (!zohoUser || !zohoPass) throw new Error('Missing ZOHO_USER/ZOHO_PASS');

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: zohoUser,
      pass: zohoPass,
    },
  });

  const from = params.from ?? (resolveFrom() || `Megicode <${zohoUser}>`);

  const info = await transporter.sendMail({
    from,
    to: params.to,
    subject: params.subject,
    text: params.text,
    html: params.html,
    replyTo: params.replyTo,
  });

  return { provider: 'zoho' as const, id: info.messageId };
}

async function sendWithResend(params: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('Missing RESEND_API_KEY');

  const resend = new Resend(apiKey);
  const from = params.from ?? resolveFrom();
  if (!from) throw new Error('Missing EMAIL_FROM/FROM_EMAIL for Resend');

  const result = await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    text: params.text,
    html: params.html,
    replyTo: params.replyTo,
  });

  if (result.error) {
    throw new Error(`Resend error: ${result.error.message}`);
  }

  return { provider: 'resend' as const, id: result.data?.id };
}

export async function sendEmail(params: SendEmailParams) {
  const provider = getProvider();

  if (provider === 'zoho') return sendWithZoho(params);
  if (provider === 'resend') return sendWithResend(params);

  // auto: prefer Resend when configured, else fallback to Zoho
  if (process.env.RESEND_API_KEY) {
    try {
      return await sendWithResend(params);
    } catch {
      // fall through to Zoho
    }
  }

  return sendWithZoho(params);
}
