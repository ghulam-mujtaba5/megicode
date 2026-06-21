import { NextResponse } from 'next/server';

import { listBlogPostsPayload } from '@/lib/blog/posts';

export async function GET() {
  try {
    return NextResponse.json(await listBlogPostsPayload());
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
