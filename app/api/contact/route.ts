import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { z } from 'zod';

const contactSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(200),
    email: z.string().trim().email('Valid email is required').max(320),
    subject: z.string().trim().max(200).optional().or(z.literal('')),
    message: z.string().trim().min(1, 'Message is required').max(10000),
    phone: z.string().trim().max(50).optional().or(z.literal('')),
    company: z.string().trim().max(200).optional().or(z.literal('')),
    service: z.string().trim().max(200).optional().or(z.literal('')),
  })
  .strict();

function zodIssuesToFieldErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.') || 'root';
    if (!fieldErrors[path]) fieldErrors[path] = issue.message;
  }
  return fieldErrors;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          fieldErrors: zodIssuesToFieldErrors(parsed.error),
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message, phone, company, service } = parsed.data;

    // Compose the email content
    const emailSubject = subject ? `New Message from ${name}: ${subject}` : `New Message from ${name}`;
    const emailText = `Name: ${name}\nEmail: ${email}\n${phone ? `Phone: ${phone}\n` : ''}${company ? `Company: ${company}\n` : ''}${service ? `Service: ${service}\n` : ''}Message: ${message}`;

    const toEmail = process.env.CONTACT_TO_EMAIL || process.env.TO_EMAIL || process.env.ZOHO_USER;
    if (!toEmail) {
      return NextResponse.json(
        { error: 'Missing CONTACT_TO_EMAIL/TO_EMAIL (or ZOHO_USER as fallback).' },
        { status: 500 }
      );
    }

    await sendEmail({
      from: process.env.CONTACT_FROM_EMAIL || undefined,
      to: toEmail,
      subject: emailSubject,
      text: emailText,
      replyTo: email,
    });

    return NextResponse.json({ message: 'Message sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Contact email API Error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
