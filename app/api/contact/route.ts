import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, phone, company, service } = body;

    // --- Server-Side Validation ---
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

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
