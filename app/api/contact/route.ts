import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import React from 'react';
import { ContactFormEmail } from '../../../components/Email/ContactFormEmail';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL;
const toEmail = process.env.TO_EMAIL;

export async function POST(request: Request) {
  if (!fromEmail || !toEmail || !process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'Missing required environment variables for email configuration.' },
      { status: 500 }
    );
  }
  try {
    const body = await request.json();
    const { name, email, subject, message, phone, company, service } = body;

    // --- Server-Side Validation ---
    if (!name || !email || !subject || !message || !service) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // --- Send Email using Resend ---
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `New Message from ${name}: ${subject}`,
      replyTo: email,
      react: ContactFormEmail({ name, email, subject, message, phone, company, service }) as React.ReactElement,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return NextResponse.json({ error: 'Error sending message.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Message sent successfully!' }, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
