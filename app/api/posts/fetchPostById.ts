import { NextResponse } from 'next/server';

export async function fetchPostById(id: string) {
  try {
    const res = await fetch(`https://payloadw.onrender.com/api/posts/${id}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch post: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    if (!data || (!data.doc && !data.id)) {
      return NextResponse.json(
        { error: 'Invalid response format from API' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
