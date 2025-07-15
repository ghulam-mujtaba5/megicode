import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = await Promise.resolve(params.id);
  
  try {
    const res = await fetch(`https://payloadw.onrender.com/api/posts/${id}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!res.ok) {
      console.error(`Failed to fetch post ${id}: ${res.status} ${res.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch post: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    if (!data || (!data.doc && !data.id)) {
      console.error('Invalid response format from API:', data);
      return NextResponse.json(
        { error: 'Invalid response format from API' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
