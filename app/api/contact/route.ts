import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const zohoUser = process.env.ZOHO_USER;
const zohoPass = process.env.ZOHO_PASS;

export async function POST(request: Request) {
  if (!zohoUser || !zohoPass) {
    return NextResponse.json(
      { error: 'Missing required environment variables for Zoho SMTP.' },
      { status: 500 }
    );
  }
  try {
    const body = await request.json();
    const { name, email, subject, message, phone, company, service } = body;

    // --- Server-Side Validation ---
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: zohoUser,
        pass: zohoPass,
      },
    });

    // Compose the email content
    const emailSubject = subject ? `New Message from ${name}: ${subject}` : `New Message from ${name}`;
    const emailText = `Name: ${name}\nEmail: ${email}\n${phone ? `Phone: ${phone}\n` : ''}${company ? `Company: ${company}\n` : ''}${service ? `Service: ${service}\n` : ''}Message: ${message}`;

    await transporter.sendMail({
      from: `"Megicode Contact Form" <${zohoUser}>`,
      to: zohoUser,
      subject: emailSubject,
      text: emailText,
      replyTo: email,
    });

    return NextResponse.json({ message: 'Message sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Zoho SMTP API Error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
