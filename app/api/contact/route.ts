import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { z } from 'zod';

// ─── Simple in-memory rate limiter ───────────────────────────
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // max requests per IP per window

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// Clean up stale entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}, 5 * 60 * 1000);

// ─── Helpers ─────────────────────────────────────────────────

/** Strip newline characters to prevent email header injection */
function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]/g, ' ').trim();
}

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
    // Rate limiting by IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

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

    // Compose the email content (sanitize values used in headers)
    const safeName = sanitizeHeaderValue(name);
    const safeSubject = subject ? sanitizeHeaderValue(subject) : '';
    const emailSubject = safeSubject
      ? `New Message from ${safeName}: ${safeSubject}`
      : `New Message from ${safeName}`;
    const emailText = `Name: ${name}\nEmail: ${email}\n${phone ? `Phone: ${phone}\n` : ''}${company ? `Company: ${company}\n` : ''}${service ? `Service: ${service}\n` : ''}Message: ${message}`;

    const toEmail = process.env.CONTACT_TO_EMAIL || process.env.TO_EMAIL || process.env.ZOHO_USER;
    if (!toEmail) {
      console.error('Contact API: Missing recipient email environment variable.');
      return NextResponse.json(
        { error: 'Server configuration error. Please try again later.' },
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
