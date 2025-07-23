import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, phone, company, service } = body;

    // --- Basic Server-Side Validation ---
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // --- TODO: Implement real email sending logic here ---
    // For example, using a service like Resend, Nodemailer, or SendGrid.
    // console.log('Simulating email sending...');
    // console.log(`To: your-email@example.com`);
    // console.log(`From: ${email}`);
    // console.log(`Subject: ${subject}`);
    // console.log(`Message: ${message}`);
    // console.log(`--- Additional Info ---`);
    // console.log(`Name: ${name}`);
    // console.log(`Phone: ${phone || 'Not provided'}`);
    // console.log(`Company: ${company || 'Not provided'}`);
    // console.log(`Service: ${service || 'Not specified'}`);
    // console.log('-------------------------');

    // Simulate a delay to mimic a real API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ message: 'Message sent successfully!' }, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
