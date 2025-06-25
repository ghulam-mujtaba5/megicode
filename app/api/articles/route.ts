import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://payloadw.onrender.com/api/posts');
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch articles' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
