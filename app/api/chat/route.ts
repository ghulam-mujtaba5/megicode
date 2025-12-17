// Placeholder API route for /api/chat
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Chat API placeholder' });
}

export async function POST(req: Request) {
  return NextResponse.json({ message: 'Chat API placeholder response' });
}
