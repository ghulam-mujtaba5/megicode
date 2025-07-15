import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://payloadw.onrender.com/api/posts', {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    
    if (!res.ok) {
      console.error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch posts: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    if (!data || !Array.isArray(data.docs)) {
      console.error('Invalid response format from API:', data);
      return NextResponse.json(
        { error: 'Invalid response format from API' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
